import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { safeJsonParse } from "../lib/colourUtils";
import { getDefaultPageContent } from "../lib/templateDefaults";
import { triggerFrontendRevalidation } from "../lib/revalidate";

const router = Router();

const footnoteSchema = z.object({
  number: z.number().int().min(1),
  text: z.string(),
  sourceName: z.string(),
  url: z.string().optional(),
  openInNewTab: z.boolean().optional(),
});

const createPageSchema = z.object({
  pageType: z.string().min(2),
  title: z.string().min(2),
  paletteMode: z.enum(["GLOBAL_PSA", "SECTOR", "SUB_SECTOR"]).optional(),
  subSectorCode: z.string().nullable().optional(),
  layoutVariant: z.string().optional(),
  isVisible: z.boolean().optional(),
  content: z.record(z.unknown()).optional(),
  footnotes: z.array(footnoteSchema).optional(),
});

const updatePageSchema = z.object({
  title: z.string().min(2).optional(),
  isVisible: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  paletteMode: z.enum(["GLOBAL_PSA", "SECTOR", "SUB_SECTOR"]).optional(),
  subSectorCode: z.string().nullable().optional(),
  layoutVariant: z.string().optional(),
  content: z.record(z.unknown()).optional(),
  footnotes: z.array(footnoteSchema).optional(),
});

const reorderSchema = z.object({
  pageIds: z.array(z.string().min(1)),
});

function formatPage(p: {
  id: string;
  reportId: string;
  pageType: string;
  title: string;
  slug: string;
  sortOrder: number;
  isVisible: boolean;
  paletteMode: string;
  subSectorCode: string | null;
  layoutVariant: string;
  contentJson: string;
  footnotesJson: string;
  updatedAt: Date;
}) {
  return {
    id: p.id,
    reportId: p.reportId,
    pageType: p.pageType,
    title: p.title,
    slug: p.slug,
    sortOrder: p.sortOrder,
    isVisible: p.isVisible,
    paletteMode: p.paletteMode,
    subSectorCode: p.subSectorCode,
    layoutVariant: p.layoutVariant,
    content: safeJsonParse(p.contentJson, {}),
    footnotes: safeJsonParse(p.footnotesJson, []),
    updatedAt: p.updatedAt,
  };
}

router.get("/reports/:reportId/pages", requireAuth, async (req, res) => {
  const pages = await prisma.chapterPage.findMany({
    where: { reportId: req.params.reportId },
    orderBy: { sortOrder: "asc" },
  });
  res.json(pages.map(formatPage));
});

router.post(
  "/reports/:reportId/pages",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const parsed = createPageSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const report = await prisma.report.findUnique({
      where: { id: req.params.reportId },
      include: { sector: true, pages: true },
    });
    if (!report) {
      res.status(404).json({ error: "Report not found" });
      return;
    }

    const normalizedType = parsed.data.pageType
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_]+/g, "_");

    const duplicate = report.pages.find((p) => p.pageType === normalizedType);
    const finalPageType = duplicate
      ? `${normalizedType}_${report.pages.length + 1}`
      : normalizedType;

    const maxOrder = report.pages.reduce(
      (max, p) => Math.max(max, p.sortOrder),
      -1
    );

    const content =
      parsed.data.content ||
      getDefaultPageContent(
        normalizedType.startsWith("one_off") ? "one_off_page" : normalizedType,
        report.sector.name,
        report.year,
        report.sector.code
      );

    const created = await prisma.chapterPage.create({
      data: {
        reportId: report.id,
        pageType: finalPageType,
        title: parsed.data.title,
        slug: finalPageType,
        sortOrder: maxOrder + 1,
        isVisible: parsed.data.isVisible ?? true,
        paletteMode: parsed.data.paletteMode || "SECTOR",
        subSectorCode: parsed.data.subSectorCode ?? null,
        layoutVariant: parsed.data.layoutVariant || "standard",
        contentJson: JSON.stringify(content),
        footnotesJson: JSON.stringify(parsed.data.footnotes || []),
      },
    });

    res.status(201).json(formatPage(created));
  }
);

router.put(
  "/reports/:reportId/pages/reorder",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    await prisma.$transaction(
      parsed.data.pageIds.map((id, index) =>
        prisma.chapterPage.updateMany({
          where: { id, reportId: req.params.reportId },
          data: { sortOrder: index },
        })
      )
    );

    const updated = await prisma.chapterPage.findMany({
      where: { reportId: req.params.reportId },
      orderBy: { sortOrder: "asc" },
    });
    res.json(updated.map(formatPage));
  }
);

router.get("/pages/:pageId", requireAuth, async (req, res) => {
  const page = await prisma.chapterPage.findUnique({
    where: { id: req.params.pageId },
  });
  if (!page) {
    res.status(404).json({ error: "Chapter page not found" });
    return;
  }
  res.json(formatPage(page));
});

router.put(
  "/pages/:pageId",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const parsed = updatePageSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const existing = await prisma.chapterPage.findUnique({
      where: { id: req.params.pageId },
      include: { report: true },
    });
    if (!existing) {
      res.status(404).json({ error: "Chapter page not found" });
      return;
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) data.title = parsed.data.title;
    if (parsed.data.isVisible !== undefined)
      data.isVisible = parsed.data.isVisible;
    if (parsed.data.sortOrder !== undefined)
      data.sortOrder = parsed.data.sortOrder;
    if (parsed.data.paletteMode !== undefined)
      data.paletteMode = parsed.data.paletteMode;
    if (parsed.data.subSectorCode !== undefined)
      data.subSectorCode = parsed.data.subSectorCode;
    if (parsed.data.layoutVariant !== undefined)
      data.layoutVariant = parsed.data.layoutVariant;
    if (parsed.data.content !== undefined)
      data.contentJson = JSON.stringify(parsed.data.content);
    if (parsed.data.footnotes !== undefined)
      data.footnotesJson = JSON.stringify(parsed.data.footnotes);

    const updated = await prisma.chapterPage.update({
      where: { id: req.params.pageId },
      data,
    });

    if (existing.report.status === "PUBLISHED") {
      await triggerFrontendRevalidation([
        `/reports/${existing.report.slug}/${existing.pageType}`,
        `/reports/cms/${existing.report.slug}/${existing.pageType}`,
      ]);
    }

    res.json(formatPage(updated));
  }
);

router.delete(
  "/pages/:pageId",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const existing = await prisma.chapterPage.findUnique({
      where: { id: req.params.pageId },
    });
    if (!existing) {
      res.status(404).json({ error: "Chapter page not found" });
      return;
    }
    await prisma.chapterPage.delete({ where: { id: req.params.pageId } });
    res.json({ deleted: true, id: req.params.pageId });
  }
);

export default router;
