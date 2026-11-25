import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_CTA_COLOURS,
  DEFAULT_HOME_PAGE_CONFIG,
  DEFAULT_SHARED_TEMPLATES,
  GLOBAL_PSA_BRAND_PALETTE,
  SECTOR_SEEDS,
  buildDefaultPagesForSector,
} from "../src/lib/templateDefaults";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PSA DWIR CMS database...");

  // 1. Seed Users
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const editorPasswordHash = await bcrypt.hash("Editor123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@psa.org.au" },
    update: {},
    create: {
      email: "admin@psa.org.au",
      name: "PSA Super Admin",
      role: "SUPER_ADMIN",
      passwordHash: adminPasswordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: "editor@psa.org.au" },
    update: {},
    create: {
      email: "editor@psa.org.au",
      name: "PSA Content Editor",
      role: "EDITOR",
      passwordHash: editorPasswordHash,
    },
  });

  // 2. Seed SiteSettings
  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      title: "Public Skills Australia — Workforce Insights Reports",
      description:
        "Workforce insights, strategies and data for government sectors across Australia.",
      logoLightUrl: "/uploads/7c44c719-ad10-460e-a0f9-b971240d10fc.png",
      logoDarkUrl: "/uploads/d3b7b4f4-dc59-4f40-8853-4346724c1d6a.png",
      introVideoUrl: DEFAULT_HOME_PAGE_CONFIG.introVideoUrl,
      psaBrandPaletteJson: JSON.stringify(GLOBAL_PSA_BRAND_PALETTE),
      ctaColoursJson: JSON.stringify(DEFAULT_CTA_COLOURS),
      homePageConfigJson: JSON.stringify(DEFAULT_HOME_PAGE_CONFIG),
    },
  });

  // 3. Seed Shared Templates (About PSA, Drivers of Change, Federal Initiatives)
  for (const tpl of Object.values(DEFAULT_SHARED_TEMPLATES)) {
    await prisma.sharedTemplateContent.upsert({
      where: { key: tpl.key },
      update: {},
      create: {
        key: tpl.key,
        title: tpl.title,
        contentJson: JSON.stringify(tpl.content),
      },
    });
  }

  // 4. Seed Reusable Source Links
  const existingSources = await prisma.sourceLink.count();
  if (existingSources === 0) {
    await prisma.sourceLink.createMany({
      data: [
        {
          label: "Jobs and Skills Australia, Occupation Shortage List, 2025",
          sourceName: "Jobs and Skills Australia (JSA)",
          url: "https://www.jobsandskills.gov.au/",
          publisher: "Jobs and Skills Australia",
          referenceYear: 2026,
          openInNewTab: true,
        },
        {
          label: "ABS Census & Labour Force Data, Australian Bureau of Statistics, 2025",
          sourceName: "Australian Bureau of Statistics (ABS)",
          url: "https://www.abs.gov.au/",
          publisher: "ABS",
          referenceYear: 2026,
          openInNewTab: true,
        },
        {
          label: "NCVER Total VET Students and Courses (VOCSTATS data set), 2025",
          sourceName: "National Centre for Vocational Education Research (NCVER)",
          url: "https://www.ncver.edu.au/",
          publisher: "NCVER",
          referenceYear: 2026,
          openInNewTab: true,
        },
        {
          label: "Productivity Commission, Report on Government Services, 2026",
          sourceName: "Productivity Commission",
          url: "https://www.pc.gov.au/ongoing/report-on-government-services/",
          publisher: "Productivity Commission",
          referenceYear: 2026,
          openInNewTab: true,
        },
      ],
    });
  }

  // 5. Seed Sectors & Baseline 2026 Reports
  const reportSeedConfigs: Record<
    string,
    { slug: string; pdfUrl: string; previousPdfs: Array<{ year: string; title: string; url: string }> }
  > = {
    "local-government": {
      slug: "local-government-workforce-insights-report",
      pdfUrl: "https://psa-directus-prod.azurewebsites.net/assets/895e9b7a-2c55-4531-95a1-dafa90b60a1c.pdf",
      previousPdfs: [
        {
          year: "2025",
          title: "2025 Local Government Workforce Insights Report",
          url: "https://publicskillsaustralia.org.au",
        },
        {
          year: "2024",
          title: "2024 Federal, State/Territory & Local Government Workforce Plan",
          url: "https://publicskillsaustralia.org.au",
        },
      ],
    },
    "public-safety": {
      slug: "public-safety-wir-2026",
      pdfUrl: "https://psa-directus-prod.azurewebsites.net/assets/b3a99498-8d9f-4275-aa00-fcf73274d2ce.pdf",
      previousPdfs: [
        {
          year: "2025",
          title: "2025 Public Safety Workforce Insights Report",
          url: "https://publicskillsaustralia.org.au",
        },
      ],
    },
    "federal-state": {
      slug: "federal-state-territory-wir-2026",
      pdfUrl: "https://psa-directus-prod.azurewebsites.net/assets/51b5fe57-c571-427b-ae72-917b57603b4b.pdf",
      previousPdfs: [
        {
          year: "2025",
          title: "2025 Federal and State/Territory Government Workforce Insights Report",
          url: "https://publicskillsaustralia.org.au",
        },
      ],
    },
    "correctional-services": {
      slug: "correctional-services-wir-2026",
      pdfUrl: "https://psa-directus-prod.azurewebsites.net/assets/d5e36137-5d7a-4012-bd9e-c2b33b0bf232.pdf",
      previousPdfs: [
        {
          year: "2025",
          title: "2025 Correctional Services Workforce Insights Report",
          url: "https://publicskillsaustralia.org.au",
        },
      ],
    },
  };

  for (const s of SECTOR_SEEDS) {
    const sector = await prisma.sector.upsert({
      where: { code: s.code },
      update: {},
      create: {
        code: s.code,
        slug: s.slug,
        name: s.name,
        badgeText: s.badgeText,
        shortCode: s.shortCode,
        subtitle: s.subtitle,
        primaryColor: s.primaryColor,
        secondaryColor: s.secondaryColor,
        accentColor: s.accentColor,
        surfaceTint: s.surfaceTint,
        borderTint: s.borderTint,
        headerBg: s.headerBg,
        defaultCoverImage: s.defaultCoverImage,
        subSectorsJson: JSON.stringify(s.subSectors),
      },
    });

    const cfg = reportSeedConfigs[s.code];
    const existingReport = await prisma.report.findUnique({
      where: { slug: cfg.slug },
    });

    if (!existingReport) {
      const defaultPages = buildDefaultPagesForSector(s.code, s.name, 2026);
      await prisma.report.create({
        data: {
          sectorId: sector.id,
          year: 2026,
          title: `2026 ${s.name} Workforce Insights Report`,
          slug: cfg.slug,
          shortDescription: s.subtitle,
          coverImageUrl: s.defaultCoverImage,
          pdfFileUrl: cfg.pdfUrl,
          previousPdfsJson: JSON.stringify(cfg.previousPdfs),
          psaSectorPageUrl: "https://publicskillsaustralia.org.au",
          contactUrl: "https://publicskillsaustralia.org.au/contact",
          landingIntroDesc:
            "For readers who want the report background — how it was developed, the methodology and the full report structure.",
          landingExecDesc:
            "Straight to the key insights and strategies — the workforce story on one page, built for large screens and briefings.",
          status: "PUBLISHED",
          isFeatured: true,
          pages: {
            create: defaultPages,
          },
        },
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
