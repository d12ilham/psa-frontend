import { Router } from "express";
import { prisma } from "../lib/prisma";
import { resolvePageTheme, safeJsonParse } from "../lib/colourUtils";
import {
  DEFAULT_CTA_COLOURS,
  DEFAULT_HOME_PAGE_CONFIG,
  GLOBAL_PSA_BRAND_PALETTE,
} from "../lib/templateDefaults";

const router = Router();

async function getGlobalSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" },
  });

  const ctaColours = safeJsonParse(
    settings?.ctaColoursJson,
    DEFAULT_CTA_COLOURS
  );
  const psaBrandPalette = safeJsonParse(
    settings?.psaBrandPaletteJson,
    GLOBAL_PSA_BRAND_PALETTE
  );
  const homePageConfig = safeJsonParse(
    settings?.homePageConfigJson,
    DEFAULT_HOME_PAGE_CONFIG
  );

  return {
    title:
      settings?.title || "Public Skills Australia — Workforce Insights Reports",
    description:
      settings?.description ||
      "Workforce insights, strategies and data for government sectors across Australia.",
    logoLightUrl:
      settings?.logoLightUrl ||
      "/uploads/7c44c719-ad10-460e-a0f9-b971240d10fc.png",
    logoDarkUrl:
      settings?.logoDarkUrl ||
      "/uploads/d3b7b4f4-dc59-4f40-8853-4346724c1d6a.png",
    introVideoUrl: settings?.introVideoUrl || "",
    psaBrandPalette,
    ctaColours,
    homePageConfig,
  };
}

router.get("/site-settings", async (_req, res) => {
  const settings = await getGlobalSettings();
  res.json(settings);
});

router.get("/reports", async (req, res) => {
  const includeAll = req.query.includeAll === "1";
  const yearParam = req.query.year ? Number(req.query.year) : undefined;

  const where: Record<string, unknown> = {};
  if (!includeAll) {
    where.status = "PUBLISHED";
  }
  if (yearParam && !Number.isNaN(yearParam)) {
    where.year = yearParam;
  }

  const reports = await prisma.report.findMany({
    where,
    include: { sector: true },
    orderBy: [{ year: "desc" }, { sector: { name: "asc" } }],
  });

  const settings = await getGlobalSettings();

  res.json({
    siteSettings: settings,
    reports: reports.map((r) => ({
      id: r.id,
      year: r.year,
      title: r.title,
      slug: r.slug,
      shortDescription: r.shortDescription,
      coverImageUrl: r.coverImageUrl,
      pdfFileUrl: r.pdfFileUrl,
      previousPdfs: safeJsonParse(r.previousPdfsJson, []),
      psaSectorPageUrl: r.psaSectorPageUrl,
      contactUrl: r.contactUrl,
      landingIntroDesc: r.landingIntroDesc,
      landingExecDesc: r.landingExecDesc,
      status: r.status,
      isFeatured: r.isFeatured,
      sector: {
        id: r.sector.id,
        code: r.sector.code,
        slug: r.sector.slug,
        name: r.sector.name,
        badgeText: r.sector.badgeText,
        shortCode: r.sector.shortCode,
        primaryColor: r.sector.primaryColor,
        secondaryColor: r.sector.secondaryColor,
        accentColor: r.sector.accentColor,
        surfaceTint: r.sector.surfaceTint,
        borderTint: r.sector.borderTint,
        headerBg: r.sector.headerBg,
        subSectors: safeJsonParse(r.sector.subSectorsJson, []),
      },
    })),
  });
});

router.get("/reports/:slug", async (req, res) => {
  const preview = req.query.preview === "1";
  const report = await prisma.report.findUnique({
    where: { slug: req.params.slug },
    include: {
      sector: true,
      pages: {
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!report || (!preview && report.status !== "PUBLISHED")) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  const settings = await getGlobalSettings();
  const transitionPage = report.pages.find((p) => p.pageType === "transition");
  const resolvedTheme = resolvePageTheme({
    paletteMode: transitionPage?.paletteMode || "SECTOR",
    subSectorCode: transitionPage?.subSectorCode,
    sector: report.sector,
    cta: settings.ctaColours,
  });

  res.json({
    siteSettings: settings,
    report: {
      id: report.id,
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
    },
    sector: {
      id: report.sector.id,
      code: report.sector.code,
      slug: report.sector.slug,
      name: report.sector.name,
      badgeText: report.sector.badgeText,
      shortCode: report.sector.shortCode,
      primaryColor: report.sector.primaryColor,
      secondaryColor: report.sector.secondaryColor,
      accentColor: report.sector.accentColor,
      surfaceTint: report.sector.surfaceTint,
      borderTint: report.sector.borderTint,
      headerBg: report.sector.headerBg,
      subSectors: safeJsonParse(report.sector.subSectorsJson, []),
    },
    transitionContent: transitionPage
      ? safeJsonParse(transitionPage.contentJson, {})
      : null,
    resolvedTheme,
    navigation: report.pages
      .filter((p) => p.pageType !== "transition")
      .map((p) => ({
        id: p.id,
        pageType: p.pageType,
        title: p.title,
        slug: p.slug,
        sortOrder: p.sortOrder,
        paletteMode: p.paletteMode,
      })),
  });
});

router.get("/reports/:slug/pages/:pageType", async (req, res) => {
  const preview = req.query.preview === "1";
  const report = await prisma.report.findUnique({
    where: { slug: req.params.slug },
    include: {
      sector: true,
      pages: {
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!report || (!preview && report.status !== "PUBLISHED")) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  const normalizedType = req.params.pageType.toLowerCase().trim();
  const PAGE_ALIASES: Record<string, string> = {
    update_2025_strategies: "update_strategies",
    update_2024_strategies: "update_strategies",
    workforce_strategies_2025: "update_strategies",
    state_territory: "industry_profile",
    industry_profile_presentation: "industry_profile",
    workforce_insights_2026: "workforce_insights",
    proposed_strategies: "workforce_strategies",
    existing_industry_strategies: "existing_strategies",
    industry_strategies: "existing_strategies",
    federal_government_initiatives: "federal_initiatives",
    "2027_and_beyond": "looking_forward",
    downloads_and_reference: "downloads",
    downloads_reference: "downloads",
    download_pdf: "downloads",
    download: "downloads",
    police_proposed_strategies_summary: "workforce_strategies",
    police_federal_initiatives: "federal_initiatives",
    defence: "industry_overview",
    fes: "industry_overview",
    police: "industry_overview",
  };

  let page = report.pages.find(
    (p) => p.pageType.toLowerCase() === normalizedType
  );
  let inferredSubSector: string | null = null;

  if (!page) {
    const resolvePatternTarget = (raw: string): string | undefined => {
      if (PAGE_ALIASES[raw]) return PAGE_ALIASES[raw];

      // Strip sub-sector prefixes (defence_*, fes_*, police_*) first
      const stripped = raw.startsWith("defence_")
        ? raw.replace(/^defence_/, "")
        : raw.startsWith("fes_")
          ? raw.replace(/^fes_/, "")
          : raw.startsWith("police_")
            ? raw.replace(/^police_/, "")
            : raw;

      if (PAGE_ALIASES[stripped]) return PAGE_ALIASES[stripped];

      if (stripped.endsWith("_federal_initiatives")) return "federal_initiatives";
      if (
        stripped.startsWith("workforce_insight_") ||
        (stripped.startsWith("workforce_insights_") &&
          stripped !== "workforce_insights_2026")
      ) {
        return "workforce_insights_detail";
      }
      if (stripped.startsWith("industry_profile_")) return "industry_profile";
      if (
        stripped.startsWith("update_2024_") ||
        stripped.startsWith("update_2025_")
      ) {
        return "update_strategies";
      }
      if (stripped.startsWith("cross_sector_")) return "cross_sector_analysis";
      if (stripped.startsWith("driver_")) return "drivers_of_change";

      // Public Safety sub-sector supporting insight detail pages
      if (
        stripped.startsWith("emerging_technology") ||
        stripped.startsWith("transitioning_veterans") ||
        stripped.startsWith("disaster_recovery") ||
        stripped.startsWith("surf_life_saving") ||
        stripped.startsWith("hazardous_materials") ||
        stripped.startsWith("digital_forensics") ||
        stripped.startsWith("regional_remote_leadership") ||
        stripped.startsWith("contextualisation")
      ) {
        return "workforce_insights_detail";
      }

      return stripped !== raw ? stripped : undefined;
    };

    if (normalizedType === "defence" || normalizedType.startsWith("defence_")) {
      inferredSubSector = "DEF";
    } else if (normalizedType === "fes" || normalizedType.startsWith("fes_")) {
      inferredSubSector = "FES";
    } else if (normalizedType === "police" || normalizedType.startsWith("police_")) {
      inferredSubSector = "POL";
    }

    const mappedTarget = resolvePatternTarget(normalizedType);
    if (mappedTarget) {
      page = report.pages.find(
        (p) => p.pageType.toLowerCase() === mappedTarget
      );
    }
  }

  if (!page) {
    res.status(404).json({ error: "Chapter page not found" });
    return;
  }

  const settings = await getGlobalSettings();
  let content = safeJsonParse<Record<string, unknown>>(page.contentJson, {});

  // Resolve global shared templates if linked (About PSA, Drivers of Change, Federal Initiatives)
  if (content.useSharedTemplate && typeof content.sharedKey === "string") {
    const shared = await prisma.sharedTemplateContent.findUnique({
      where: { key: content.sharedKey },
    });
    if (shared) {
      content = {
        ...safeJsonParse<Record<string, unknown>>(shared.contentJson, {}),
        _sharedKey: shared.key,
      };
    }
  }

  // Mirror Workforce Insights & Proposed Strategies into Executive Summary (Audit PDF p. 34, 51)
  let linkedInsights = null;
  let linkedStrategies = null;
  if (normalizedType === "executive_summary") {
    const insightsPage = report.pages.find(
      (p) => p.pageType === "workforce_insights"
    );
    const strategiesPage = report.pages.find(
      (p) => p.pageType === "workforce_strategies"
    );
    if (insightsPage) {
      linkedInsights = safeJsonParse(insightsPage.contentJson, {});
    }
    if (strategiesPage) {
      linkedStrategies = safeJsonParse(strategiesPage.contentJson, {});
    }
  }

  // Provide aligned themes & insight metadata for WFI Supporting Details (Audit PDF p. 56)
  let linkedInsightsMeta = null;
  if (normalizedType === "workforce_insights_detail") {
    const insightsPage = report.pages.find(
      (p) => p.pageType === "workforce_insights"
    );
    if (insightsPage) {
      linkedInsightsMeta = safeJsonParse(insightsPage.contentJson, {});
    }
  }

  const resolvedTheme = resolvePageTheme({
    paletteMode: inferredSubSector ? "SUB_SECTOR" : page.paletteMode,
    subSectorCode: inferredSubSector || page.subSectorCode,
    sector: report.sector,
    cta: settings.ctaColours,
  });

  res.json({
    siteSettings: settings,
    report: {
      id: report.id,
      year: report.year,
      title: report.title,
      slug: report.slug,
      pdfFileUrl: report.pdfFileUrl,
      previousPdfs: safeJsonParse(report.previousPdfsJson, []),
      contactUrl: report.contactUrl,
      psaSectorPageUrl: report.psaSectorPageUrl,
      status: report.status,
    },
    sector: {
      id: report.sector.id,
      code: report.sector.code,
      slug: report.sector.slug,
      name: report.sector.name,
      badgeText: report.sector.badgeText,
      shortCode: report.sector.shortCode,
      primaryColor: report.sector.primaryColor,
      secondaryColor: report.sector.secondaryColor,
      accentColor: report.sector.accentColor,
      surfaceTint: report.sector.surfaceTint,
      borderTint: report.sector.borderTint,
      headerBg: report.sector.headerBg,
      subSectors: safeJsonParse(report.sector.subSectorsJson, []),
    },
    page: {
      id: page.id,
      pageType: page.pageType,
      title: page.title,
      slug: page.slug,
      sortOrder: page.sortOrder,
      paletteMode: page.paletteMode,
      subSectorCode: page.subSectorCode,
      layoutVariant: page.layoutVariant,
      content,
      footnotes: safeJsonParse(page.footnotesJson, []),
      linkedInsights,
      linkedStrategies,
      linkedInsightsMeta,
    },
    resolvedTheme,
    navigation: report.pages
      .filter((p) => p.pageType !== "transition")
      .map((p) => ({
        id: p.id,
        pageType: p.pageType,
        title: p.title,
        slug: p.slug,
        sortOrder: p.sortOrder,
        paletteMode: p.paletteMode,
      })),
  });
});

export default router;
