import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { safeJsonParse } from "../lib/colourUtils";
import { buildDefaultPagesForSector } from "../lib/templateDefaults";
import { triggerFrontendRevalidation } from "../lib/revalidate";

const router = Router();

const previousPdfSchema = z.object({
  year: z.string(),
  title: z.string(),
  url: z.string(),
});

const createReportSchema = z.object({
  sectorId: z.string().min(1),
  year: z.number().int().min(2020).max(2100),
  title: z.string().min(3),
  slug: z.string().min(3).optional(),
  shortDescription: z.string().optional(),
  coverImageUrl: z.string().optional(),
  pdfFileUrl: z.string().optional(),
  previousPdfs: z.array(previousPdfSchema).optional(),
  psaSectorPageUrl: z.string().optional(),
  contactUrl: z.string().optional(),
  landingIntroDesc: z.string().optional(),
  landingExecDesc: z.string().optional(),
  status: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]).optional(),
  isFeatured: z.boolean().optional(),
  scaffoldTemplates: z.boolean().optional(),
});

const updateReportSchema = createReportSchema.partial();

const cloneReportSchema = z.object({
  targetYear: z.number().int().min(2020).max(2100),
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  status: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]).optional(),
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatReport(report: {
  id: string;
  sectorId: string;
  year: number;
  title: string;
  slug: string;
  shortDescription: string;
  coverImageUrl: string;
  pdfFileUrl: string;
  previousPdfsJson: string;
  psaSectorPageUrl: string;
  contactUrl: string;
  landingIntroDesc: string;
  landingExecDesc: string;
  status: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  sector?: {
    id: string;
    code: string;
    name: string;
    shortCode: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  _count?: { pages: number };
}) {
  return {
    id: report.id,
    sectorId: report.sectorId,
    year: report.year,
    title: report.title,
    slug: report.slug,
    shortDescription: report.shortDescription,
    coverImageUrl: report.coverImageUrl,
    pdfFileUrl: report.pdfFileUrl,
    previousPdfs: safeJsonParse(report.previousPdfsJson, []),
    psaSectorPageUrl: report.psaSectorPageUrl,
    contactUrl: report.contactUrl,
    landingIntroDesc: report.landingIntroDesc,
    landingExecDesc: report.landingExecDesc,
    status: report.status,
    isFeatured: report.isFeatured,
    sector: report.sector,
    pagesCount: report._count?.pages,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  };
}

router.get("/", requireAuth, async (req, res) => {
  const year = req.query.year ? Number(req.query.year) : undefined;
  const sectorId = req.query.sectorId ? String(req.query.sectorId) : undefined;
  const status = req.query.status ? String(req.query.status) : undefined;

  const where: Record<string, unknown> = {};
  if (year && !Number.isNaN(year)) where.year = year;
  if (sectorId) where.sectorId = sectorId;
  if (status) where.status = status;

  const reports = await prisma.report.findMany({
    where,
    include: {
      sector: {
        select: {
          id: true,
          code: true,
          name: true,
          shortCode: true,
          primaryColor: true,
          secondaryColor: true,
          accentColor: true,
        },
      },
      _count: { select: { pages: true } },
    },
    orderBy: [{ year: "desc" }, { sector: { name: "asc" } }],
  });

  res.json(reports.map(formatReport));
});

router.get("/:id", requireAuth, async (req, res) => {
  const report = await prisma.report.findUnique({
    where: { id: req.params.id },
    include: {
      sector: true,
      pages: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!report) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  res.json({
    ...formatReport(report),
    sector: {
      ...report.sector,
      subSectors: safeJsonParse(report.sector.subSectorsJson, []),
    },
    pages: report.pages.map((p) => ({
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
    })),
  });
});

router.post(
  "/",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const parsed = createReportSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const sector = await prisma.sector.findUnique({
      where: { id: parsed.data.sectorId },
    });
    if (!sector) {
      res.status(404).json({ error: "Sector not found" });
      return;
    }

    const baseSlug = slugify(
      parsed.data.slug || `${sector.slug}-wir-${parsed.data.year}`
    );
    const existingSlug = await prisma.report.findUnique({
      where: { slug: baseSlug },
    });
    const finalSlug = existingSlug
      ? `${baseSlug}-${Date.now().toString(36)}`
      : baseSlug;

    const shouldScaffold = parsed.data.scaffoldTemplates ?? true;
    const defaultPages = shouldScaffold
      ? buildDefaultPagesForSector(sector.code, sector.name, parsed.data.year)
      : [];

    const created = await prisma.report.create({
      data: {
        sectorId: sector.id,
        year: parsed.data.year,
        title: parsed.data.title,
        slug: finalSlug,
        shortDescription:
          parsed.data.shortDescription || sector.subtitle || "",
        coverImageUrl:
          parsed.data.coverImageUrl || sector.defaultCoverImage || "",
        pdfFileUrl: parsed.data.pdfFileUrl || "",
        previousPdfsJson: JSON.stringify(parsed.data.previousPdfs || []),
        psaSectorPageUrl:
          parsed.data.psaSectorPageUrl ||
          "https://publicskillsaustralia.org.au",
        contactUrl:
          parsed.data.contactUrl ||
          "https://publicskillsaustralia.org.au/contact",
        landingIntroDesc:
          parsed.data.landingIntroDesc ||
          "For readers who want the report background — how it was developed, the methodology and the full report structure.",
        landingExecDesc:
          parsed.data.landingExecDesc ||
          "Straight to the key insights and strategies — the workforce story on one page, built for large screens and briefings.",
        status: parsed.data.status || "DRAFT",
        isFeatured: parsed.data.isFeatured ?? false,
        pages: {
          create: defaultPages,
        },
      },
      include: {
        sector: true,
        _count: { select: { pages: true } },
      },
    });

    if (created.status === "PUBLISHED") {
      await triggerFrontendRevalidation(["/reports", `/reports/${created.slug}`]);
    }

    res.status(201).json(formatReport(created));
  }
);

router.post(
  "/:id/clone",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const parsed = cloneReportSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const source = await prisma.report.findUnique({
      where: { id: req.params.id },
      include: {
        sector: true,
        pages: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!source) {
      res.status(404).json({ error: "Source report not found" });
      return;
    }

    const { targetYear } = parsed.data;
    const baseSlug = slugify(
      parsed.data.slug || `${source.sector.slug}-wir-${targetYear}`
    );
    const existingSlug = await prisma.report.findUnique({
      where: { slug: baseSlug },
    });
    const finalSlug = existingSlug
      ? `${baseSlug}-${Date.now().toString(36)}`
      : baseSlug;

    const clonedTitle =
      parsed.data.title ||
      (source.title.includes(String(source.year))
        ? source.title.replaceAll(String(source.year), String(targetYear))
        : `${targetYear} ${source.sector.name} Workforce Insights Report`);

    const prevPdfs = safeJsonParse<
      Array<{ year: string; title: string; url: string }>
    >(source.previousPdfsJson, []);
    if (source.pdfFileUrl) {
      const alreadyListed = prevPdfs.some(
        (p) => p.year === String(source.year) && p.url === source.pdfFileUrl
      );
      if (!alreadyListed) {
        prevPdfs.unshift({
          year: String(source.year),
          title: `${source.year} ${source.sector.name} Workforce Insights Report`,
          url: source.pdfFileUrl,
        });
      }
    }

    const cloned = await prisma.$transaction(async (tx) => {
      return tx.report.create({
        data: {
          sectorId: source.sectorId,
          year: targetYear,
          title: clonedTitle,
          slug: finalSlug,
          shortDescription: source.shortDescription,
          coverImageUrl: source.coverImageUrl,
          pdfFileUrl: "",
          previousPdfsJson: JSON.stringify(prevPdfs),
          psaSectorPageUrl: source.psaSectorPageUrl,
          contactUrl: source.contactUrl,
          landingIntroDesc: source.landingIntroDesc,
          landingExecDesc: source.landingExecDesc,
          status: parsed.data.status || "DRAFT",
          isFeatured: false,
          pages: {
            create: source.pages.map((p) => {
              const sourceYearStr = String(source.year);
              const targetYearStr = String(targetYear);
              return {
                pageType: p.pageType,
                title: p.title.replaceAll(sourceYearStr, targetYearStr),
                slug: p.slug,
                sortOrder: p.sortOrder,
                isVisible: p.isVisible,
                paletteMode: p.paletteMode,
                subSectorCode: p.subSectorCode,
                layoutVariant: p.layoutVariant,
                contentJson: p.contentJson,
                footnotesJson: p.footnotesJson,
              };
            }),
          },
        },
        include: {
          sector: true,
          _count: { select: { pages: true } },
        },
      });
    });

    res.status(201).json(formatReport(cloned));
  }
);

router.put(
  "/:id",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const parsed = updateReportSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const existing = await prisma.report.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) {
      res.status(404).json({ error: "Report not found" });
      return;
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.year !== undefined) data.year = parsed.data.year;
    if (parsed.data.title !== undefined) data.title = parsed.data.title;
    if (parsed.data.slug !== undefined) data.slug = slugify(parsed.data.slug);
    if (parsed.data.shortDescription !== undefined)
      data.shortDescription = parsed.data.shortDescription;
    if (parsed.data.coverImageUrl !== undefined)
      data.coverImageUrl = parsed.data.coverImageUrl;
    if (parsed.data.pdfFileUrl !== undefined)
      data.pdfFileUrl = parsed.data.pdfFileUrl;
    if (parsed.data.previousPdfs !== undefined)
      data.previousPdfsJson = JSON.stringify(parsed.data.previousPdfs);
    if (parsed.data.psaSectorPageUrl !== undefined)
      data.psaSectorPageUrl = parsed.data.psaSectorPageUrl;
    if (parsed.data.contactUrl !== undefined)
      data.contactUrl = parsed.data.contactUrl;
    if (parsed.data.landingIntroDesc !== undefined)
      data.landingIntroDesc = parsed.data.landingIntroDesc;
    if (parsed.data.landingExecDesc !== undefined)
      data.landingExecDesc = parsed.data.landingExecDesc;
    if (parsed.data.status !== undefined) data.status = parsed.data.status;
    if (parsed.data.isFeatured !== undefined)
      data.isFeatured = parsed.data.isFeatured;

    const updated = await prisma.report.update({
      where: { id: req.params.id },
      data,
      include: {
        sector: true,
        _count: { select: { pages: true } },
      },
    });

    await triggerFrontendRevalidation([
      "/reports",
      `/reports/${updated.slug}`,
      `/reports/cms/${updated.slug}`,
    ]);
    res.json(formatReport(updated));
  }
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  async (req, res) => {
    const existing = await prisma.report.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) {
      res.status(404).json({ error: "Report not found" });
      return;
    }
    await prisma.report.delete({ where: { id: req.params.id } });
    await triggerFrontendRevalidation(["/reports"]);
    res.json({ deleted: true, id: req.params.id });
  }
);

export default router;
