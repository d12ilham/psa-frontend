import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_CTA_COLOURS,
  DEFAULT_HOME_PAGE_CONFIG,
  DEFAULT_SHARED_TEMPLATES,
  GLOBAL_PSA_BRAND_PALETTE,
  SECTOR_SEEDS,
} from "../src/lib/templateDefaults";

interface SeedData2026 {
  reports: Array<{
    sectorCode: string;
    year: number;
    title: string;
    slug: string;
    shortDescription: string;
    coverImageUrl: string;
    pdfFileUrl: string;
    previousPdfs: Array<{ year: string; title: string; url: string }>;
    psaSectorPageUrl: string;
    contactUrl: string;
    landingIntroDesc: string;
    landingExecDesc: string;
    pages: Array<{
      pageType: string;
      title: string;
      slug: string;
      sortOrder: number;
      isVisible: boolean;
      paletteMode: string;
      subSectorCode: string | null;
      layoutVariant: string;
      content: Record<string, unknown>;
      footnotes: unknown[];
    }>;
  }>;
  sourceLinks: Array<{
    label: string;
    sourceName: string;
    url: string;
    openInNewTab?: boolean;
  }>;
}

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PSA DWIR CMS database...");

  const seedFile = path.join(__dirname, "seed-data-2026.json");
  const extracted: SeedData2026 = JSON.parse(
    fs.readFileSync(seedFile, "utf8")
  );
  const fedJsonPath = path.resolve(__dirname, "../../src/data/federalInitiatives.json");
  const fed2026Items = fs.existsSync(fedJsonPath)
    ? (JSON.parse(fs.readFileSync(fedJsonPath, "utf8")) as Array<{
        id: number;
        number: string;
        title: string;
        subtitle: string;
        description: string;
        impactDescription: string;
      }>)
    : [];

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
    let tplContent: Record<string, unknown> = tpl.content;
    if (tpl.key === "federal_initiatives" && fed2026Items.length > 0) {
      tplContent = {
        ...tpl.content,
        initiatives: fed2026Items.map((it) => ({
          id: `fed-${it.number}`,
          code: it.number,
          listSubtitle: it.subtitle,
          title: it.title,
          dateRange: "",
          paragraphs: it.description.split(/\n\n+/).filter(Boolean),
          howItInformsHeading: "HOW THIS INFORMS PUBLIC SKILLS AUSTRALIA'S WORK",
          howItInformsText: it.impactDescription,
        })),
      };
    }
    await prisma.sharedTemplateContent.upsert({
      where: { key: tpl.key },
      update: {
        title: tpl.title,
        contentJson: JSON.stringify(tplContent),
      },
      create: {
        key: tpl.key,
        title: tpl.title,
        contentJson: JSON.stringify(tplContent),
      },
    });
  }

  // 4. Seed Reusable Source Links (deduplicated)
  const baselineSources = [
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
  ];
  const existingSourceRows = await prisma.sourceLink.findMany({
    select: { label: true, url: true },
  });
  const seenLabels = new Set(existingSourceRows.map((r) => r.label.toLowerCase()));
  const seenUrls = new Set(existingSourceRows.map((r) => r.url.toLowerCase()));

  const combinedSources = [
    ...baselineSources,
    ...extracted.sourceLinks.map((s) => ({
      label: s.label,
      sourceName: s.sourceName,
      url: s.url,
      publisher: s.sourceName,
      referenceYear: 2026,
      openInNewTab: s.openInNewTab ?? true,
    })),
  ];
  const toInsertSources = [];
  for (const src of combinedSources) {
    const lk = src.label.toLowerCase();
    const uk = src.url.toLowerCase();
    if (!seenLabels.has(lk) && !seenUrls.has(uk)) {
      seenLabels.add(lk);
      seenUrls.add(uk);
      toInsertSources.push(src);
    }
  }
  if (toInsertSources.length > 0) {
    await prisma.sourceLink.createMany({ data: toInsertSources });
  }

  // 5. Seed Sectors & Verbatim 2026 Reports
  const sectorMap = new Map<string, string>();
  for (const s of SECTOR_SEEDS) {
    const sector = await prisma.sector.upsert({
      where: { code: s.code },
      update: {
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
    sectorMap.set(s.code, sector.id);
  }

  for (const r of extracted.reports) {
    const sectorId = sectorMap.get(r.sectorCode);
    if (!sectorId) {
      throw new Error(`Missing sector for extracted report ${r.slug}: ${r.sectorCode}`);
    }

    const report = await prisma.report.upsert({
      where: { slug: r.slug },
      update: {
        sectorId,
        year: r.year,
        title: r.title,
        shortDescription: r.shortDescription,
        coverImageUrl: r.coverImageUrl,
        pdfFileUrl: r.pdfFileUrl,
        previousPdfsJson: JSON.stringify(r.previousPdfs),
        psaSectorPageUrl: r.psaSectorPageUrl,
        contactUrl: r.contactUrl,
        landingIntroDesc: r.landingIntroDesc,
        landingExecDesc: r.landingExecDesc,
        status: "PUBLISHED",
        isFeatured: true,
      },
      create: {
        sectorId,
        year: r.year,
        title: r.title,
        slug: r.slug,
        shortDescription: r.shortDescription,
        coverImageUrl: r.coverImageUrl,
        pdfFileUrl: r.pdfFileUrl,
        previousPdfsJson: JSON.stringify(r.previousPdfs),
        psaSectorPageUrl: r.psaSectorPageUrl,
        contactUrl: r.contactUrl,
        landingIntroDesc: r.landingIntroDesc,
        landingExecDesc: r.landingExecDesc,
        status: "PUBLISHED",
        isFeatured: true,
      },
    });

    await prisma.$transaction([
      prisma.chapterPage.deleteMany({ where: { reportId: report.id } }),
      prisma.chapterPage.createMany({
        data: r.pages.map((p) => ({
          reportId: report.id,
          pageType: p.pageType,
          title: p.title,
          slug: p.slug,
          sortOrder: p.sortOrder,
          isVisible: p.isVisible,
          paletteMode: p.paletteMode,
          subSectorCode: p.subSectorCode,
          layoutVariant: p.layoutVariant,
          contentJson: JSON.stringify(p.content),
          footnotesJson: JSON.stringify(p.footnotes),
        })),
      }),
    ]);

    console.log(`Seeded ${r.slug} with ${r.pages.length} chapter pages`);
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
