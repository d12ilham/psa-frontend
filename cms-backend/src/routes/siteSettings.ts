import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { evaluateContrast, normalizeHex, safeJsonParse } from "../lib/colourUtils";
import {
  DEFAULT_CTA_COLOURS,
  DEFAULT_HOME_PAGE_CONFIG,
  GLOBAL_PSA_BRAND_PALETTE,
} from "../lib/templateDefaults";
import { triggerFrontendRevalidation } from "../lib/revalidate";

const router = Router();

const hexRegex = /^#?[0-9a-fA-F]{3,6}$/;

const updateSiteSettingsSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  logoLightUrl: z.string().optional(),
  logoDarkUrl: z.string().optional(),
  introVideoUrl: z.string().optional(),
  psaBrandPalette: z.record(z.string()).optional(),
  ctaColours: z
    .object({
      primaryBg: z.string().regex(hexRegex),
      primaryText: z.string().regex(hexRegex),
      hoverBg: z.string().regex(hexRegex),
      hoverText: z.string().regex(hexRegex),
      downloadBg: z.string().regex(hexRegex),
      downloadText: z.string().regex(hexRegex),
    })
    .optional(),
  homePageConfig: z.record(z.unknown()).optional(),
});

function formatSiteSettings(row: {
  id: string;
  title: string;
  description: string;
  logoLightUrl: string;
  logoDarkUrl: string;
  introVideoUrl: string;
  psaBrandPaletteJson: string;
  ctaColoursJson: string;
  homePageConfigJson: string;
  updatedAt: Date;
}) {
  const ctaColours = safeJsonParse(row.ctaColoursJson, DEFAULT_CTA_COLOURS);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    logoLightUrl: row.logoLightUrl,
    logoDarkUrl: row.logoDarkUrl,
    introVideoUrl: row.introVideoUrl,
    psaBrandPalette: safeJsonParse(row.psaBrandPaletteJson, GLOBAL_PSA_BRAND_PALETTE),
    ctaColours,
    ctaContrast: {
      primary: evaluateContrast(ctaColours.primaryText, ctaColours.primaryBg),
      hover: evaluateContrast(ctaColours.hoverText, ctaColours.hoverBg),
      download: evaluateContrast(ctaColours.downloadText, ctaColours.downloadBg),
    },
    homePageConfig: safeJsonParse(row.homePageConfigJson, DEFAULT_HOME_PAGE_CONFIG),
    updatedAt: row.updatedAt,
  };
}

router.get("/", requireAuth, async (_req, res) => {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" },
  });
  if (!settings) {
    res.status(404).json({ error: "Site settings not initialized" });
    return;
  }
  res.json(formatSiteSettings(settings));
});

router.put(
  "/",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const parsed = updateSiteSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const existing = await prisma.siteSettings.findUnique({
      where: { id: "global" },
    });
    if (!existing) {
      res.status(404).json({ error: "Site settings not initialized" });
      return;
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) data.title = parsed.data.title;
    if (parsed.data.description !== undefined)
      data.description = parsed.data.description;
    if (parsed.data.logoLightUrl !== undefined)
      data.logoLightUrl = parsed.data.logoLightUrl;
    if (parsed.data.logoDarkUrl !== undefined)
      data.logoDarkUrl = parsed.data.logoDarkUrl;
    if (parsed.data.introVideoUrl !== undefined)
      data.introVideoUrl = parsed.data.introVideoUrl;

    if (parsed.data.psaBrandPalette !== undefined) {
      const normalizedPalette: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.data.psaBrandPalette)) {
        normalizedPalette[k] = normalizeHex(v, v);
      }
      data.psaBrandPaletteJson = JSON.stringify(normalizedPalette);
    }

    if (parsed.data.ctaColours !== undefined) {
      const c = parsed.data.ctaColours;
      data.ctaColoursJson = JSON.stringify({
        primaryBg: normalizeHex(c.primaryBg),
        primaryText: normalizeHex(c.primaryText, "#252D02"),
        hoverBg: normalizeHex(c.hoverBg),
        hoverText: normalizeHex(c.hoverText, "#FFFFFF"),
        downloadBg: normalizeHex(c.downloadBg),
        downloadText: normalizeHex(c.downloadText, "#FFFFFF"),
      });
    }

    if (parsed.data.homePageConfig !== undefined) {
      data.homePageConfigJson = JSON.stringify(parsed.data.homePageConfig);
    }

    const updated = await prisma.siteSettings.update({
      where: { id: "global" },
      data,
    });

    await triggerFrontendRevalidation(["/reports"]);
    res.json(formatSiteSettings(updated));
  }
);

export default router;
