import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  deriveTints,
  evaluateContrast,
  normalizeHex,
  safeJsonParse,
} from "../lib/colourUtils";
import { triggerFrontendRevalidation } from "../lib/revalidate";

const router = Router();

const subSectorSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  primaryColor: z.string(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  surfaceTint: z.string().optional(),
  borderTint: z.string().optional(),
});

const updateSectorSchema = z.object({
  name: z.string().min(2).optional(),
  badgeText: z.string().min(2).optional(),
  shortCode: z.string().min(2).optional(),
  subtitle: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  surfaceTint: z.string().optional(),
  borderTint: z.string().optional(),
  headerBg: z.string().optional(),
  defaultCoverImage: z.string().optional(),
  subSectors: z.array(subSectorSchema).optional(),
  autoDeriveTints: z.boolean().optional(),
});

function formatSector(row: {
  id: string;
  code: string;
  slug: string;
  name: string;
  badgeText: string;
  shortCode: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceTint: string;
  borderTint: string;
  headerBg: string;
  defaultCoverImage: string;
  subSectorsJson: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  const subSectors = safeJsonParse<Array<z.infer<typeof subSectorSchema>>>(
    row.subSectorsJson,
    []
  ).map((sub) => ({
    ...sub,
    contrastOnWhite: evaluateContrast(sub.primaryColor, "#FFFFFF"),
    contrastOnSurface: evaluateContrast(
      sub.primaryColor,
      sub.surfaceTint || "#FAFAF0"
    ),
  }));

  return {
    id: row.id,
    code: row.code,
    slug: row.slug,
    name: row.name,
    badgeText: row.badgeText,
    shortCode: row.shortCode,
    subtitle: row.subtitle,
    primaryColor: row.primaryColor,
    secondaryColor: row.secondaryColor,
    accentColor: row.accentColor,
    surfaceTint: row.surfaceTint,
    borderTint: row.borderTint,
    headerBg: row.headerBg,
    defaultCoverImage: row.defaultCoverImage,
    contrast: {
      whiteOnPrimary: evaluateContrast("#FFFFFF", row.primaryColor),
      primaryOnPageBg: evaluateContrast(row.primaryColor, "#FAFAF0"),
      primaryOnSurface: evaluateContrast(row.primaryColor, row.surfaceTint),
    },
    subSectors,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

router.get("/", requireAuth, async (_req, res) => {
  const sectors = await prisma.sector.findMany({ orderBy: { name: "asc" } });
  res.json(sectors.map(formatSector));
});

router.put(
  "/:id",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const parsed = updateSectorSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const existing = await prisma.sector.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) {
      res.status(404).json({ error: "Sector not found" });
      return;
    }

    const nextPrimary = parsed.data.primaryColor
      ? normalizeHex(parsed.data.primaryColor, existing.primaryColor)
      : existing.primaryColor;

    const tints = deriveTints(nextPrimary);
    const shouldAutoDerive = parsed.data.autoDeriveTints ?? false;

    const data: Record<string, unknown> = {
      primaryColor: nextPrimary,
    };

    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.badgeText !== undefined)
      data.badgeText = parsed.data.badgeText;
    if (parsed.data.shortCode !== undefined)
      data.shortCode = parsed.data.shortCode;
    if (parsed.data.subtitle !== undefined)
      data.subtitle = parsed.data.subtitle;
    if (parsed.data.secondaryColor !== undefined)
      data.secondaryColor = normalizeHex(
        parsed.data.secondaryColor,
        existing.secondaryColor
      );
    if (parsed.data.accentColor !== undefined)
      data.accentColor = normalizeHex(
        parsed.data.accentColor,
        existing.accentColor
      );
    if (parsed.data.headerBg !== undefined)
      data.headerBg = normalizeHex(parsed.data.headerBg, existing.headerBg);
    if (parsed.data.defaultCoverImage !== undefined)
      data.defaultCoverImage = parsed.data.defaultCoverImage;

    if (shouldAutoDerive) {
      data.surfaceTint = tints.surfaceTint;
      data.borderTint = tints.borderTint;
    } else {
      if (parsed.data.surfaceTint !== undefined)
        data.surfaceTint = normalizeHex(
          parsed.data.surfaceTint,
          existing.surfaceTint
        );
      if (parsed.data.borderTint !== undefined)
        data.borderTint = normalizeHex(
          parsed.data.borderTint,
          existing.borderTint
        );
    }

    if (parsed.data.subSectors !== undefined) {
      const normalizedSubs = parsed.data.subSectors.map((sub) => {
        const subPrimary = normalizeHex(sub.primaryColor);
        const subTints = deriveTints(subPrimary);
        return {
          code: sub.code,
          name: sub.name,
          primaryColor: subPrimary,
          secondaryColor: sub.secondaryColor
            ? normalizeHex(sub.secondaryColor, subPrimary)
            : subPrimary,
          accentColor: sub.accentColor
            ? normalizeHex(sub.accentColor, subPrimary)
            : subPrimary,
          surfaceTint: sub.surfaceTint
            ? normalizeHex(sub.surfaceTint, subTints.surfaceTint)
            : subTints.surfaceTint,
          borderTint: sub.borderTint
            ? normalizeHex(sub.borderTint, subTints.borderTint)
            : subTints.borderTint,
        };
      });
      data.subSectorsJson = JSON.stringify(normalizedSubs);
    }

    const updated = await prisma.sector.update({
      where: { id: req.params.id },
      data,
    });

    await triggerFrontendRevalidation(["/reports"]);
    res.json(formatSector(updated));
  }
);

export default router;
