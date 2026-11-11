export interface SiteSettings {
  title: string;
  description: string;
  logoLightUrl: string;
  logoDarkUrl: string;
}

export const SITE_SETTINGS: SiteSettings = {
  title: "Public Skills Australia — Workforce Insights Reports",
  description:
    "Workforce insights, strategies and data for government sectors across Australia.",
  logoLightUrl: "/uploads/7c44c719-ad10-460e-a0f9-b971240d10fc.png",
  logoDarkUrl: "/uploads/d3b7b4f4-dc59-4f40-8853-4346724c1d6a.png",
};

export interface StaticReport {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImageUrl: string;
  pdfFileUrl: string;
  psaSectorPageUrl: string;
  contactUrl: string;
  cardNote?: string;
  status: "published";
  isFeatured: boolean;
  industryId: string;
  yearId: string;
  createdAt: string;
  industry: {
    id: string;
    name: string;
    slug: string;
  };
  year: {
    id: string;
    label: string;
  };
  landingIntroDesc: string;
  landingExecDesc: string;
}

export const DEFAULT_LANDING_INTRO_DESC =
  "For readers who want the report background — how it was developed, the methodology and the full report structure.";

export const DEFAULT_LANDING_EXEC_DESC =
  "Straight to the key insights and strategies — the workforce story on one page, built for large screens and briefings.";

export interface SectorConfig {
  id: string; // Internal identifier: 'local-government' | 'public-safety' | 'federal-state' | 'correctional-services'
  industrySlugs: string[]; // Slugs from DB industries table that map to this sector
  name: string;
  badgeText: string;
  shortCode: string; // e.g. "LG WIR", "PS WIR"
  theme: {
    badgeBg: string;
    headerBg: string;
    headerText: string;
    accentColor: string;
    primaryColor: string;
    heroGradient?: string;
  };
  subtitle?: string;
  defaultCoverImage: string;
  defaultYear: string;
  defaultSlug: string;
  pdfFileUrl: string;
  psaSectorPageUrl: string;
  contactUrl: string;
  landingIntroDesc: string;
  landingExecDesc: string;
  subsectors?: string[];
  defaultChapters: { key: string; label: string }[];
}

export const SECTOR_CONFIGS: Record<string, SectorConfig> = {
  "local-government": {
    id: "local-government",
    industrySlugs: ["local-government"],
    name: "Local Government",
    badgeText: "LOCAL GOVERNMENT",
    shortCode: "LG WIR",
    theme: {
      badgeBg: "bg-lg-dark",
      headerBg: "#252D02",
      headerText: "#FFFFFF",
      accentColor: "#85CC00",
      primaryColor: "#046D2A",
    },
    subtitle: "Councils and Regional Authorities across Australia",
    defaultCoverImage: "/images/reports/sector-card-local-government.png",
    defaultYear: "2026",
    defaultSlug: "local-government-workforce-insights-report",
    pdfFileUrl:
      "https://psa-directus-prod.azurewebsites.net/assets/895e9b7a-2c55-4531-95a1-dafa90b60a1c.pdf",
    psaSectorPageUrl: "https://publicskillsaustralia.org.au",
    contactUrl: "https://publicskillsaustralia.org.au/contact",
    landingIntroDesc: DEFAULT_LANDING_INTRO_DESC,
    landingExecDesc: DEFAULT_LANDING_EXEC_DESC,
    defaultChapters: [
      { key: "introduction", label: "Introduction" },
      { key: "about", label: "About Public Skills Australia" },
      { key: "methodology", label: "Methodology" },
      { key: "executive_summary", label: "Executive Summary" },
      { key: "drivers_of_change", label: "Drivers of Change" },
      { key: "industry_overview", label: "Industry-Sector Overview" },
      { key: "state_territory", label: "State and Territory Profile" },
      { key: "industry_profile", label: "Industry Profile" },
      { key: "workforce_insights", label: "Workforce Insights" },
      { key: "workforce_strategies", label: "2026 Proposed Strategies" },
      { key: "update_2025_strategies", label: "Update on 2025 Strategies" },
      { key: "existing_strategies", label: "Existing Industry-Sector Strategies" },
      { key: "federal_initiatives", label: "Federal Government Initiatives" },
      { key: "looking_forward", label: "Looking Forward" },
      { key: "downloads", label: "Downloads & References" },
    ],
  },

  "public-safety": {
    id: "public-safety",
    industrySlugs: ["public-safety"],
    name: "Public Safety",
    badgeText: "PUBLIC SAFETY",
    shortCode: "PS WIR",
    theme: {
      badgeBg: "bg-[#046D2A]",
      headerBg: "#252D02",
      headerText: "#FFFFFF",
      accentColor: "#8AC900",
      primaryColor: "#046D2A",
    },
    subtitle: "Fire and Emergency Services · Police · Defence",
    defaultCoverImage: "/images/reports/public-safety-card-background.webp",
    defaultYear: "2026",
    defaultSlug: "public-safety-wir-2026",
    pdfFileUrl:
      "https://psa-directus-prod.azurewebsites.net/assets/b3a99498-8d9f-4275-aa00-fcf73274d2ce.pdf",
    psaSectorPageUrl: "https://publicskillsaustralia.org.au/workforce-plans",
    contactUrl: "https://publicskillsaustralia.org.au/contact",
    landingIntroDesc: DEFAULT_LANDING_INTRO_DESC,
    landingExecDesc:
      "Straight to the key insights and strategies on one page, built for large screens and briefings.",
    subsectors: ["Fire and Emergency Services", "Police", "Defence"],
    defaultChapters: [
      { key: "introduction", label: "Introduction" },
      { key: "about", label: "About Public Skills Australia" },
      { key: "methodology", label: "Methodology" },
      { key: "executive_summary", label: "Executive Summary" },
      { key: "drivers_of_change", label: "Drivers of Change" },
      { key: "industry_overview", label: "Industry-Sector Overview" },
      { key: "state_territory", label: "State and Territory Profile" },
      { key: "workforce_insights", label: "Workforce Insights" },
      { key: "workforce_strategies", label: "Workforce Strategies" },
      { key: "looking_forward", label: "Looking Forward" },
      { key: "downloads", label: "Downloads & References" },
    ],
  },

  "federal-state": {
    id: "federal-state",
    industrySlugs: [
      "federal-state",
      "federal-state-territory-government",
      "federal-and-state-territory-government",
    ],
    name: "Federal and State/Territory Government",
    badgeText: "FEDERAL AND STATE/TERRITORY GOVERNMENT",
    shortCode: "FSTG WIR",
    theme: {
      badgeBg: "bg-[#694834]",
      headerBg: "#252D02",
      headerText: "#FFFFFF",
      accentColor: "#8AC900",
      primaryColor: "#046D2A",
    },
    subtitle: "Federal Agencies and State/Territory Public Services",
    defaultCoverImage: "/images/reports/sector-card-federal-state.png",
    defaultYear: "2026",
    defaultSlug: "federal-state-territory-wir-2026",
    pdfFileUrl:
      "https://psa-directus-prod.azurewebsites.net/assets/51b5fe57-c571-427b-ae72-917b57603b4b.pdf",
    psaSectorPageUrl: "https://publicskillsaustralia.org.au",
    contactUrl: "https://publicskillsaustralia.org.au/contact",
    landingIntroDesc: DEFAULT_LANDING_INTRO_DESC,
    landingExecDesc:
      "Straight to the key insights and strategies on one page, built for large screens and briefings.",
    subsectors: ["Federal Public Service", "State & Territory Public Sector"],
    defaultChapters: [
      { key: "introduction", label: "Introduction" },
      { key: "about", label: "About Public Skills Australia" },
      { key: "methodology", label: "Methodology" },
      { key: "executive_summary", label: "Executive Summary" },
      { key: "drivers_of_change", label: "Drivers of Change" },
      { key: "industry_overview", label: "Industry-Sector Overview" },
      { key: "industry_profile", label: "Industry Profile" },
      { key: "workforce_insights", label: "Workforce Insights" },
      { key: "workforce_strategies", label: "2026 Proposed Strategies" },
      { key: "existing_strategies", label: "Existing Industry-Sector Strategies" },
      { key: "federal_initiatives", label: "Federal Government Initiatives" },
      { key: "looking_forward", label: "Looking Forward" },
      { key: "downloads", label: "Downloads & References" },
    ],
  },

  "correctional-services": {
    id: "correctional-services",
    industrySlugs: ["correctional-services"],
    name: "Correctional Services",
    badgeText: "CORRECTIONAL SERVICES",
    shortCode: "CS WIR",
    theme: {
      badgeBg: "bg-[#0B6DA8]",
      headerBg: "#063B5D",
      headerText: "#FFFFFF",
      accentColor: "#38BDF8",
      primaryColor: "#0B6DA8",
    },
    subtitle: "Custodial and Community Corrections across Australia",
    defaultCoverImage: "/images/reports/sector-card-correctional-services.png",
    defaultYear: "2026",
    defaultSlug: "correctional-services-wir-2026",
    pdfFileUrl:
      "https://psa-directus-prod.azurewebsites.net/assets/d5e36137-5d7a-4012-bd9e-c2b33b0bf232.pdf",
    psaSectorPageUrl: "https://publicskillsaustralia.org.au",
    contactUrl: "https://publicskillsaustralia.org.au/contact",
    landingIntroDesc: DEFAULT_LANDING_INTRO_DESC,
    landingExecDesc: DEFAULT_LANDING_EXEC_DESC,
    subsectors: ["Custodial Corrections", "Community Corrections"],
    defaultChapters: [
      { key: "introduction", label: "Introduction" },
      { key: "about", label: "About Public Skills Australia" },
      { key: "methodology", label: "Methodology" },
      { key: "executive_summary", label: "Executive Summary" },
      { key: "drivers_of_change", label: "Drivers of Change" },
      { key: "industry_overview", label: "Industry-Sector Overview" },
      { key: "state_territory", label: "State and Territory Profile" },
      { key: "workforce_insights", label: "Workforce Insights" },
      { key: "workforce_strategies", label: "Workforce Strategies" },
      { key: "looking_forward", label: "Looking Forward" },
      { key: "downloads", label: "Downloads & References" },
    ],
  },
};

export function getStaticReport(slug: string): StaticReport {
  const sector = resolveSector(null, slug);
  return {
    id: sector.id,
    title: `${sector.name} Workforce Insights Report`,
    slug: slug || sector.defaultSlug,
    shortDescription: sector.subtitle || `${sector.name} Workforce Insights Report`,
    coverImageUrl: sector.defaultCoverImage,
    pdfFileUrl: sector.pdfFileUrl,
    psaSectorPageUrl: sector.psaSectorPageUrl,
    contactUrl: sector.contactUrl,
    status: "published",
    isFeatured: true,
    industryId: sector.id,
    yearId: sector.defaultYear,
    createdAt: "2026-01-01T00:00:00.000Z",
    industry: {
      id: sector.id,
      name: sector.name,
      slug: sector.industrySlugs[0],
    },
    year: {
      id: sector.defaultYear,
      label: sector.defaultYear,
    },
    landingIntroDesc: sector.landingIntroDesc,
    landingExecDesc: sector.landingExecDesc,
  };
}

export const STATIC_REPORTS: StaticReport[] = Object.values(SECTOR_CONFIGS).map(
  (sector) => getStaticReport(sector.defaultSlug),
);

/**
 * Resolves the sector configuration by checking:
 * 1. Industry slug/name from API (e.g. from report.industry.slug or report.industry.name)
 * 2. Fallback check against the report's URL slug
 */
export function resolveSector(
  industrySlugOrName?: string | null,
  reportSlug?: string | null,
): SectorConfig {
  const normIndustry = (industrySlugOrName || "").toLowerCase().trim();
  const normSlug = (reportSlug || "").toLowerCase().trim();

  // 1. Direct check against industrySlugs
  for (const sector of Object.values(SECTOR_CONFIGS)) {
    if (
      sector.industrySlugs.some(
        (slug) => slug === normIndustry || normIndustry.includes(slug),
      ) ||
      normIndustry.includes(sector.name.toLowerCase())
    ) {
      return sector;
    }
  }

  // 2. Fallback check against reportSlug keywords
  if (normSlug.includes("public-safety")) return SECTOR_CONFIGS["public-safety"];
  if (normSlug.includes("federal") || normSlug.includes("state-territory")) {
    return SECTOR_CONFIGS["federal-state"];
  }
  if (normSlug.includes("correctional")) {
    return SECTOR_CONFIGS["correctional-services"];
  }

  // 3. Default fallback to Local Government
  return SECTOR_CONFIGS["local-government"];
}
