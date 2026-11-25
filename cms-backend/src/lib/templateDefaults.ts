import type { CtaColours } from "./colourUtils";

export const GLOBAL_PSA_BRAND_PALETTE = {
  lightGreen: "#B2DB79",
  ctaGreen: "#8AC900",
  psaGreen: "#699A05",
  notesGreen: "#598303",
  downloadGreen: "#416102",
  darkOlive: "#252D02",
  background: "#FAFAF0",
  tint10: "#FEFDF3",
  tint25: "#F0F5DF",
};

export const DEFAULT_CTA_COLOURS: CtaColours = {
  primaryBg: "#8AC900",
  primaryText: "#252D02",
  hoverBg: "#699A05",
  hoverText: "#FFFFFF",
  downloadBg: "#416102",
  downloadText: "#FFFFFF",
};

export const DEFAULT_HOME_PAGE_CONFIG = {
  eyebrow: "PUBLIC SKILLS AUSTRALIA",
  heroTitle: "Welcome to the Public Skills Australia Workforce Insights Reports",
  heroParagraphs: [
    "This platform brings together workforce insights and strategies across six priority sectors.",
    "The reports are structured to help you quickly access key insights and strategies, while providing the depth of analysis supporting the strategy and plans.",
  ],
  introVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  introVideoCaption: "2026 Workforce Reports Launch, with Auslan interpretation.",
  chooseSectorLabel: "Choose your sector",
  allReportsLabel: "All sector reports (PDFs)",
  highlights: [
    {
      title: "An evidence-based view",
      description:
        "Developed through a combination of workforce data analysis, sector research and extensive consultation with industry and government stakeholders, the reports provide an evidence-based view of current workforce conditions, emerging trends, future challenges and opportunities.",
      icon: "book-open",
    },
    {
      title: "Grounded in lived experience",
      description:
        "By combining quantitative insights with the lived experience of sector leaders and practitioners, the reports identify workforce issues that matter most and the strategies needed to address them.",
      icon: "users",
    },
  ],
  reportIncludes: [
    { label: "Introduction", icon: "book-open" },
    { label: "Executive Summary", icon: "file-text" },
    { label: "Driver of Change", icon: "compass" },
    { label: "Industry Overview", icon: "globe" },
    { label: "Workforce Insights", icon: "lightbulb" },
    { label: "Workforce Strategies", icon: "target" },
    { label: "Looking Forward", icon: "chevrons-right" },
  ],
  footerPromptTitle: "Questions about the Workforce Insights Reports?",
  footerPromptSubtitle:
    "Public Skills Australia welcomes feedback and enquiries from industry-sector stakeholders.",
  contactButtonLabel: "Contact Us",
  contactUrl: "https://publicskillsaustralia.org.au/contact",
};

export const DEFAULT_SHARED_TEMPLATES = {
  about_psa: {
    key: "about_psa",
    title: "About Public Skills Australia",
    content: {
      headerTitle: "About Public Skills Australia",
      introText:
        "Public Skills Australia is the Jobs and Skills Council (JSC) for the Public Safety and Government industry, comprising Correctional Services, Defence, Federal, State/Territory and Local Government, Fire and Emergency Services and Police industry-sectors. Through its work, Public Skills Australia actively supports employer and employee bodies in these industries and associated volunteer associations.",
      workingInPartnershipTitle: "Working in partnership",
      workingInPartnershipText:
        "Public Skills Australia works in partnership with the Department of Employment and Workplace Relations (DEWR) and other JSCs to give effect to broader ministerial and government priorities.",
      whatWeDoHeading: "What we do",
      whatWeDoBoxes: [
        {
          id: "wwd-1",
          title: "Workforce Planning (Workforce Insights)",
          description:
            "Undertakes data analysis, research and consultation to deepen understandings of contemporary workforce challenges and what can be done to mitigate these challenges.",
          icon: "bar-chart-3",
        },
        {
          id: "wwd-2",
          title: "Training Product Development",
          description:
            "Develops quality training products to strengthen the skills and capabilities of Public Safety and Government workforces.",
          icon: "graduation-cap",
        },
        {
          id: "wwd-3",
          title: "Implementation, Promotion and Monitoring",
          description:
            "Monitors and promotes the implementation of training products to support career pathways for the Public Safety and Government industry sectors.",
          icon: "compass",
        },
        {
          id: "wwd-4",
          title: "Industry Stewardship",
          description:
            "Consults with, advocates for and promotes the needs of the Public Safety and Government industry sectors.",
          icon: "shield-check",
        },
      ],
      commitmentTitle: "Our commitment",
      commitmentText:
        "Public Skills Australia remains committed to encouraging the participation of First Nations people,¹ those from culturally and linguistically diverse backgrounds, those living with or experiencing disabilities, women and other gender diverse people and mature people in the Public Safety and Government industry workforces.",
      footnoteNote:
        "1. Please note, First Nations people will be used as preferred terminology inclusive of Aboriginal and Torres Strait Islanders. When citing a data source (such as government strategies or state of the sector reports), the terminology of the data source will be used to maintain accurate data representation.",
    },
  },
  drivers_of_change: {
    key: "drivers_of_change",
    title: "Drivers of Change",
    content: {
      headerTitle: "Drivers of Change",
      introParagraphs: [
        "In 2024, Public Skills Australia identified nine megatrends impacting the Public Safety and Government industry-sectors. These megatrends were further considered in the development of the Workforce Insights Reports.",
        "While these megatrends will continue to have longer-term implications for workforce planning and development across the Public Safety and Government industry-sectors, the Workforce Insights Reports have built on these and analysed four key drivers of change that cut across most megatrends.",
      ],
      keyDriversHeading: "Key Drivers",
      keyDrivers: [
        {
          id: "drv-1",
          numberLabel: "DRIVER 1",
          title: "Resilience of organisations to respond to strategic shocks",
          summary:
            "Compounding crises test operational and structural resilience across public sector agencies.",
          description:
            "Organisations are increasingly required to maintain service delivery continuity while responding to natural disasters, geopolitical uncertainty, and rapid shifts in community demand.",
          icon: "shield-alert",
        },
        {
          id: "drv-2",
          numberLabel: "DRIVER 2",
          title: "Challenges to workforce productivity",
          summary:
            "Sustained productivity requires targeted capability uplift and modern workforce planning.",
          description:
            "Tight labour markets, evolving service expectations, and regulatory demands mean productivity gains rely on capability development and retention.",
          icon: "trending-up",
        },
        {
          id: "drv-3",
          numberLabel: "DRIVER 3",
          title: "Emergence of Artificial Intelligence (AI), greater automation and broader digital transformation",
          summary:
            "Capability uplift and evolving cyber and digital skills are critical across all roles.",
          description:
            "Digital transformation is reshaping workflows, requiring foundational digital literacy alongside specialised AI governance and cybersecurity skills.",
          icon: "cpu",
        },
        {
          id: "drv-4",
          numberLabel: "DRIVER 4",
          title: "Workforce inclusivity",
          summary:
            "Broadening talent pathways and inclusive workplace practices strengthens long-term supply.",
          description:
            "Recruiting, retaining, and developing employees from diverse cultural, linguistic, gender, disability, and neurodivergent backgrounds is essential to meet modern workforce needs.",
          icon: "users",
        },
      ],
      megatrendsHeading: "Nine Megatrends",
      megatrends: [
        {
          id: "mt-1",
          title: "Limitations in career pathways",
          description:
            "Clear progression pathways and recognition of prior learning support retention and mobility across public safety and government roles.",
          icon: "briefcase",
        },
        {
          id: "mt-2",
          title: "Climate change",
          description:
            "More frequent severe weather events increase demand for disaster response, resilience planning, and sustainability capabilities.",
          icon: "cloud-sun",
        },
        {
          id: "mt-3",
          title: "Competition for labour",
          description:
            "Public sector agencies compete with private industry for technical, trades, and digital talent.",
          icon: "award",
        },
        {
          id: "mt-4",
          title: "Expansion of core duties",
          description:
            "Frontline and administrative personnel face broader responsibilities requiring multidisciplinary training.",
          icon: "layers",
        },
        {
          id: "mt-5",
          title: "Diversity and inclusion",
          description:
            "Building representative workforces improves service outcomes and expands talent pools.",
          icon: "users",
        },
        {
          id: "mt-6",
          title: "Demographic shifts",
          description:
            "An ageing workforce accelerates knowledge transfer and succession planning imperatives.",
          icon: "bar-chart-2",
        },
        {
          id: "mt-7",
          title: "Technological development",
          description:
            "Rapid innovation creates continuous upskilling requirements across operational and corporate roles.",
          icon: "cpu",
        },
        {
          id: "mt-8",
          title: "Recruitment and retention",
          description:
            "Attracting and retaining skilled personnel in regional, remote, and specialist roles remains a key focus.",
          icon: "search",
        },
        {
          id: "mt-9",
          title: "Public trust and perceptions",
          description:
            "Community expectations around transparency, responsiveness, and governance shape workforce priorities.",
          icon: "shield-check",
        },
      ],
    },
  },
  federal_initiatives: {
    key: "federal_initiatives",
    title: "Federal Government Initiatives",
    content: {
      anchorBadge: "Workforce Strategies",
      headerTitle: "Federal Government Initiatives",
      introText:
        "Public Skills Australia's work is informed and guided by the Federal Government Initiatives detailed below. Select any initiative on the left — its detail opens immediately beside the list.",
      listHeadingPrefix: "Strategies",
      initiatives: [
        {
          id: "fed-1",
          code: "01",
          listSubtitle: "National Cabinet (Formerly Council of Australian Governments)",
          title: "National Agreement on Closing the Gap (Closing the Gap)",
          dateRange: "2020 - 2031",
          paragraphs: [
            "Closing the Gap is a commitment from all Australian Governments and Aboriginal and Torres Strait Islander representatives to a fundamentally new way of developing and implementing policies and programs that impact the lives of Aboriginal and Torres Strait Islander people.",
            "Closing the Gap is jointly implemented by the Federal, State and Territory governments, along with Australian Local Government Associations and Coalitions of Peaks across four priority reforms and 19 national socio-economic targets.",
          ],
          howItInformsHeading: "HOW THIS INFORMS PUBLIC SKILLS AUSTRALIA'S WORK",
          howItInformsText:
            "The National Agreement on Closing the Gap informs research, stakeholder consultation, and training product priorities to ensure First Nations peoples and communities are reflected accurately and equitably.",
        },
        {
          id: "fed-2",
          code: "02",
          listSubtitle: "Department of the Prime Minister and Cabinet",
          title: "The Australian Government's Strategic Priorities",
          dateRange: "Ongoing",
          paragraphs: [
            "Strategic priorities set by the Australian Government guide national workforce planning, public service capability uplift, and cross-jurisdictional collaboration.",
          ],
          howItInformsHeading: "HOW THIS INFORMS PUBLIC SKILLS AUSTRALIA'S WORK",
          howItInformsText:
            "Aligns Jobs and Skills Council strategies with national productivity, clean energy transition, and inclusive employment objectives.",
        },
        {
          id: "fed-3",
          code: "03",
          listSubtitle: "Australian Government · Office for Women",
          title: "Working for Women — A Strategy for Gender Equality",
          dateRange: "2024 - 2034",
          paragraphs: [
            "Australia's first national strategy to achieve gender equality outlines priority actions across unpaid and paid care, economic equality, safety, health, and leadership.",
          ],
          howItInformsHeading: "HOW THIS INFORMS PUBLIC SKILLS AUSTRALIA'S WORK",
          howItInformsText:
            "Supports workforce strategies addressing gender representation, leadership pathways, and safe inclusive workplaces across government and public safety sectors.",
        },
        {
          id: "fed-4",
          code: "04",
          listSubtitle: "Jobs and Skills Australia",
          title: "The Clean Energy Generation: Workforce Needs for a Net Zero Economy",
          dateRange: "2023 - 2030",
          paragraphs: [
            "Identifies the skills, occupations, and training system capacity needed to support Australia's transition to net zero emissions.",
          ],
          howItInformsHeading: "HOW THIS INFORMS PUBLIC SKILLS AUSTRALIA'S WORK",
          howItInformsText:
            "Guides training package updates for sustainable operations, fleet electrification, and climate resilience planning.",
        },
      ],
    },
  },
};

export const SECTOR_SEEDS = [
  {
    code: "local-government",
    slug: "local-government",
    name: "Local Government",
    badgeText: "LOCAL GOVERNMENT",
    shortCode: "LG WIR",
    subtitle: "Councils and Regional Authorities across Australia",
    primaryColor: "#046D2A",
    secondaryColor: "#9CAA54",
    accentColor: "#9CAA54",
    surfaceTint: "#F0F5DF",
    borderTint: "#C9D8B6",
    headerBg: "#252D02",
    defaultCoverImage: "/images/reports/sector-card-local-government.png",
    subSectors: [],
  },
  {
    code: "public-safety",
    slug: "public-safety",
    name: "Public Safety",
    badgeText: "PUBLIC SAFETY",
    shortCode: "PS WIR",
    subtitle: "Defence · Fire and Emergency Services · Police",
    primaryColor: "#12224F",
    secondaryColor: "#56638E",
    accentColor: "#56638E",
    surfaceTint: "#EEF1F8",
    borderTint: "#B7C0DA",
    headerBg: "#252D02",
    defaultCoverImage: "/images/reports/public-safety-card-background.webp",
    subSectors: [
      {
        code: "DEF",
        name: "Defence",
        primaryColor: "#D3992C",
        secondaryColor: "#64645E",
        accentColor: "#D3992C",
        surfaceTint: "#FAF6EB",
        borderTint: "#E6D5A7",
      },
      {
        code: "FES",
        name: "Fire and Emergency Services",
        primaryColor: "#C9481A",
        secondaryColor: "#E7B28E",
        accentColor: "#C9481A",
        surfaceTint: "#FDF2EF",
        borderTint: "#EABCB0",
      },
      {
        code: "POL",
        name: "Police",
        primaryColor: "#0D71A3",
        secondaryColor: "#93BCD1",
        accentColor: "#0D71A3",
        surfaceTint: "#E7F1F6",
        borderTint: "#B8D4E8",
      },
    ],
  },
  {
    code: "federal-state",
    slug: "federal-state",
    name: "Federal and State/Territory Government",
    badgeText: "FEDERAL AND STATE/TERRITORY GOVERNMENT",
    shortCode: "FSTG WIR",
    subtitle: "Federal Agencies and State/Territory Public Services",
    primaryColor: "#754C2D",
    secondaryColor: "#EED4C4",
    accentColor: "#754C2D",
    surfaceTint: "#F7F1ED",
    borderTint: "#DEC7B9",
    headerBg: "#252D02",
    defaultCoverImage: "/images/reports/sector-card-federal-state.png",
    subSectors: [],
  },
  {
    code: "correctional-services",
    slug: "correctional-services",
    name: "Correctional Services",
    badgeText: "CORRECTIONAL SERVICES",
    shortCode: "COR WIR",
    subtitle: "Custodial and Community Corrections across Australia",
    primaryColor: "#424996",
    secondaryColor: "#9CA9D2",
    accentColor: "#9CA9D2",
    surfaceTint: "#F0F0F7",
    borderTint: "#B7BDE0",
    headerBg: "#252D02",
    defaultCoverImage: "/images/reports/sector-card-correctional-services.png",
    subSectors: [],
  },
];

export function getDefaultPageContent(
  pageType: string,
  sectorName: string,
  year: number,
  sectorCode = "local-government"
): Record<string, unknown> {
  switch (pageType) {
    case "transition":
      return {
        eyebrow: `${year} • PUBLIC SKILLS AUSTRALIA`,
        headline: `${year} ${sectorName} Workforce Insights Report`,
        subheadline:
          sectorCode === "public-safety"
            ? "Covering the Defence, Fire and Emergency Services and Police industry-sectors — with cross-sector analysis of the skills that connect them."
            : "",
        promptText:
          "Choose how you explore the digital report; begin with the introduction for a comprehensive overview, or go straight to the executive summary for the key insights and strategies.",
        introCardTitle: "Introduction",
        introCardDescription:
          "For readers who want the report background — how it was developed, the methodology and the full report structure.",
        introButtonLabel: "Explore the Introduction",
        execCardTitle: "Executive Summary",
        execCardDescription:
          "Straight to the key insights and strategies — the workforce story on one page, built for large screens and briefings.",
        execButtonLabel: "Explore the Executive Summary",
        subSectorSectionTitle:
          sectorCode === "public-safety" ? "Or go straight to a sector chapter" : "",
        subSectorCards:
          sectorCode === "public-safety"
            ? [
                { code: "DEF", title: "Defence", pageType: "industry_overview", color: "#D3992C" },
                { code: "FES", title: "Fire and Emergency Services", pageType: "industry_overview", color: "#C9481A" },
                { code: "POL", title: "Police", pageType: "industry_overview", color: "#0D71A3" },
              ]
            : [],
      };

    case "introduction":
      return {
        eyebrow: "INTRODUCTION",
        headerTitle: `${year} ${sectorName} Workforce Insights Report`,
        paragraphs: [
          `The ${year} ${sectorName} Workforce Insights Report builds on previous iterations to identify workforce challenges and propose strategic initiatives to mitigate them. This report represents the insights, commitment and efforts of the ${sectorName} industry-sector, shared with Public Skills Australia.`,
          "Public Skills Australia's Workforce Insights Reports are developed using a combination of qualitative and quantitative data obtained from primary and secondary sources and supported by stakeholder consultations.",
          "Choose to download the PDF report or read on to our interactive digital version.",
        ],
        statsCardTitle: "THIS REPORT AT A GLANCE",
        keyStats: [
          { label: "Drivers of Change", value: "4" },
          { label: "Megatrends", value: "9" },
          { label: "Workforce Employees", value: "218,000" },
          { label: "Workforce Themes", value: "2" },
          { label: "Workforce Insights", value: "7" },
          { label: `Proposed ${year} Strategies`, value: "2" },
        ],
        structureHeading: `The ${year} Digital Report Structure`,
        structureSubtitle: "Select any chapter card below to jump directly into that section.",
        structureCards: [
          {
            id: "str-1",
            title: "Executive Summary",
            description: "An executive overview of the workforce insights and strategies.",
            pageType: "executive_summary",
            lineColorMode: "SECTOR",
            icon: "file-text",
            ctaLabel: "Explore",
            tags: [],
          },
          {
            id: "str-2",
            title: "Drivers of Change",
            description: "Identifies key drivers of change that will impact workforce planning alongside nine megatrends.",
            pageType: "drivers_of_change",
            lineColorMode: "GLOBAL_PSA",
            icon: "compass",
            ctaLabel: "Explore",
            tags: ["Drivers of Change", "Nine Megatrends"],
          },
          {
            id: "str-3",
            title: "Industry Overview",
            description: `Examines the ${sectorName} workforce, providing data analysis and sector context.`,
            pageType: "industry_overview",
            lineColorMode: "SECTOR",
            icon: "globe",
            ctaLabel: "Explore",
            tags: ["Industry-Sector Overview", "Industry Profile"],
          },
          {
            id: "str-4",
            title: "Workforce Insights",
            description: "Explores key workforce themes, data insights and supporting evidence.",
            pageType: "workforce_insights",
            lineColorMode: "SECTOR",
            icon: "lightbulb",
            ctaLabel: "Explore",
            tags: ["Workforce Insights"],
          },
          {
            id: "str-5",
            title: "Workforce Strategies",
            description: `Outlines the ${year} Workforce Strategies, updates on previous strategies, and government initiatives.`,
            pageType: "workforce_strategies",
            lineColorMode: "SECTOR",
            icon: "target",
            ctaLabel: "Explore",
            tags: ["Proposed Strategies", "Update on Strategies", "Existing Strategies", "Federal Initiatives"],
          },
          {
            id: "str-6",
            title: "Looking Forward",
            description: `Concludes the Report by outlining key lines of inquiry for the ${year + 1} Workforce Insights Report.`,
            pageType: "looking_forward",
            lineColorMode: "SECTOR",
            icon: "chevrons-right",
            ctaLabel: "Explore",
            tags: [`Looking Forward to ${year + 1}`],
          },
          {
            id: "str-7",
            title: "About Public Skills Australia",
            description: "Who we are and how we support the sector.",
            pageType: "about",
            lineColorMode: "GLOBAL_PSA",
            icon: "info",
            ctaLabel: "View",
            tags: [],
          },
          {
            id: "str-8",
            title: "Methodology",
            description: "How the insights and strategies were developed.",
            pageType: "methodology",
            lineColorMode: "GLOBAL_PSA",
            icon: "git-branch",
            ctaLabel: "View",
            tags: [],
          },
        ],
      };

    case "downloads":
      return {
        eyebrow: "DOWNLOAD PDF",
        headerTitle: `${sectorName} Workforce Insights Reports PDFs`,
        currentReportLabel: `${year} ${sectorName} Workforce Insights Report`,
        currentReportDescription: `Full ${year} digital report and appendices in downloadable PDF format.`,
        previousReportsHeading: "PREVIOUS REPORTS",
      };

    case "about":
      return {
        useSharedTemplate: true,
        sharedKey: "about_psa",
      };

    case "methodology":
      return {
        headerTitle: "Methodology",
        introParagraphs: [
          `Public Skills Australia's Workforce Insights Reports are developed using a combination of qualitative and quantitative methods obtained from primary and secondary sources. The ${year} ${sectorName} Workforce Insights Report is supported by data obtained through stakeholder consultations and engagements.`,
        ],
        showProcessSteps: true,
        processHeading: "Process",
        processSteps: [
          { stepLabel: "STEP 1", title: "Data sources", detail: "JSA · ABS · NCVER datasets", icon: "database" },
          { stepLabel: "STEP 2", title: "National survey", detail: "Sector stakeholder responses", icon: "clipboard-list" },
          { stepLabel: "STEP 3", title: "Workshops", detail: "Consultation workshops", icon: "users" },
          { stepLabel: "STEP 4", title: "Representatives", detail: "Industry-sector bodies", icon: "building-2" },
          { stepLabel: "STEP 5", title: "Governance", detail: "Review, endorsement, approval", icon: "landmark" },
        ],
        showKeyRepresentatives: true,
        keyRepresentativesTitle: "Key industry-sector representatives",
        keyRepresentativesIntro:
          "Public Skills Australia undertook targeted workforce planning consultation with key industry-sector representatives:",
        keyRepresentatives: [
          "Australian Industry Representative Body",
          "State & Territory Sector Associations",
          "Employer & Employee Peak Bodies",
          "Government Advisory Groups",
        ],
        calloutStats: [
          { value: "280+", label: "Sector organisations engaged" },
          { value: "137", label: "Stakeholders attended workshops" },
          { value: "210", label: "Survey responses analysed" },
        ],
        governanceHeading: "Governance Process",
        governanceIntro:
          "Drafts were subsequently progressed through Public Skills Australia's governance process that includes:",
        governanceSteps: [
          {
            title: "1 · Sector Subcommittee",
            description:
              "The Subcommittee is responsible for recommending this Report to the Industry Advisory Group (IAG) for endorsement.",
          },
          {
            title: "2 · Industry Advisory Group",
            description:
              "The IAG is responsible for endorsing this Report to the Public Skills Australia Board for approval to be submitted to DEWR.",
          },
          {
            title: "3 · Public Skills Australia Board",
            description:
              "The Public Skills Australia Board is responsible to approve the submission of this Report to DEWR.",
          },
        ],
        dataSourcesTitle: "Data sources",
        dataSourcesText:
          "The Report uses publicly available datasets accessible from Jobs and Skills Australia (JSA), the Australian Bureau of Statistics (ABS), and the National Centre for Vocational Education Research (NCVER), supported by qualitative research and consultation.",
        acknowledgementTitle: "Acknowledgement",
        acknowledgementText:
          "Public Skills Australia thanks the contributors, including industry representatives, its Board and governance group representatives, DEWR and JSA for sharing their views and data generously.",
        extraBoxes: [],
      };

    case "executive_summary":
      return {
        headerTitle: "Executive Summary",
        introText: `Public Skills Australia's ${year} ${sectorName} Workforce Insights Report considers the wider operational contexts impacting the sector, drivers of change, workforce themes, insights, and proposed strategies.`,
        driversSummaryTitle: "Drivers of Change",
        driversSummaryText:
          "Identifies four key drivers of change that will impact workforce planning in the short to medium term, aligned with the nine megatrends.",
        themesColumnsLayout: 2, // 1 | 2 | 3
        themesSectionTitle: "Workforce Themes and Insights",
        themesSectionIntro: `This report identifies key workforce insights within the ${sectorName} sector.`,
        strategiesSectionTitle: `${year} Proposed Workforce Strategies`,
        strategiesSectionIntro:
          "The following strategies have been developed to support efforts to address challenges identified through the workforce insights.",
        lookingForwardTitle: "Looking Forward",
        lookingForwardText: `The report concludes by looking towards the ${year + 1} Workforce Insights Reports and key lines of inquiry.`,
        supportingSectionCtas: [
          { label: "Update on Prior Strategies", pageType: "update_strategies" },
          { label: "Existing Industry-Sector Strategies", pageType: "existing_strategies" },
          { label: "Federal Government Initiatives", pageType: "federal_initiatives" },
        ],
      };

    case "drivers_of_change":
      return {
        useSharedTemplate: true,
        sharedKey: "drivers_of_change",
      };

    case "industry_overview":
      return {
        headerTitle: `${sectorName} Industry-Sector Overview`,
        introText: `Key workforce metrics, structural trends, and industry context for the ${sectorName} sector in ${year}.`,
        headerGraphic: "globe",
        dataBoxes: [
          { id: "io-stat-1", dataPoint: "218,000", text: "Total sector workforce across Australia", icon: "users" },
          { label: "Share", id: "io-stat-2", dataPoint: "52% / 48%", text: "Regional vs Metropolitan workforce split", icon: "map-pin" },
        ],
        contentBoxes: [
          {
            id: "io-box-1",
            title: "Workforce Composition & Demand",
            dataPoint: "+4.2% YoY",
            text: "Demand for skilled personnel continues to grow across service delivery, governance, and digital transformation functions.",
            icon: "briefcase",
            ctaLabel: "View Industry Profile",
            ctaPageType: "industry_profile",
          },
        ],
        charts: [
          {
            id: "io-chart-1",
            title: `${sectorName} Employment Trend (${year - 4}–${year})`,
            subtitle: "Annual headcount projection (thousands)",
            chartType: "bar",
            labels: [`${year - 4}`, `${year - 3}`, `${year - 2}`, `${year - 1}`, `${year}`],
            series: [
              { name: "Employees (k)", values: [195, 201, 207, 213, 218] },
            ],
          },
        ],
      };

    case "industry_profile":
      return {
        headerTitle: "Industry Profile",
        introText:
          "Explore standardised workforce indicators and charts across jurisdictions. Select any chart from the library to view or present full screen.",
        headerGraphic: "bar-chart-3",
        kpis: [
          { id: "ip-kpi-1", label: "Active Workforce", value: "218,000", note: "National headcount" },
          { id: "ip-kpi-2", label: "VET Completions Growth", value: "+6.4%", note: "Year-on-year" },
        ],
        chartLibrary: [
          {
            id: "ip-chart-1",
            title: `${year - 4}–${year} Employment Growth in ${sectorName}`,
            subtitle: "ABS Labour Force & Sector Datasets",
            chartType: "bar",
            labels: [`${year - 4}`, `${year - 3}`, `${year - 2}`, `${year - 1}`, `${year}`],
            series: [{ name: "Employment (k)", values: [195, 201, 207, 213, 218] }],
          },
          {
            id: "ip-chart-2",
            title: "Training Package Enrolments and Completions",
            subtitle: "NCVER Total VET Students and Courses",
            chartType: "line",
            labels: [`${year - 4}`, `${year - 3}`, `${year - 2}`, `${year - 1}`, `${year}`],
            series: [
              { name: "Enrolments", values: [5229, 4419, 3952, 5301, 5752] },
              { name: "Completions", values: [3275, 2540, 2269, 2180, 2296] },
            ],
          },
        ],
      };

    case "workforce_insights":
      return {
        headerTitle: "Workforce Insights",
        introText: `This Report identifies the following themes and industry-sector insights relating to ${sectorName}. Select any insight to open its supporting detail page.`,
        columnsLayout: 2, // 1 | 2 | 3
        singleThemeCharLimit: 450,
        themes: [
          {
            id: "theme-1",
            number: 1,
            name: `${sectorName} Specific Occupational Shortages`,
            sectorColor: "",
            showOverview: true,
            overviewText:
              "Employers require a diverse range of multidisciplinary skills and face persistent shortages across technical, frontline, and planning occupations.",
            insights: [
              {
                id: "ins-1-1",
                number: 1,
                title: "Diverse multidisciplinary workforce requirements",
                summary:
                  "Employers require a diverse range of skills to maintain breadth of operational and community responsibilities.",
              },
              {
                id: "ins-1-2",
                number: 2,
                title: "Shifting skills driven by technology and regulation",
                summary:
                  "Skills needs are changing due to workforce pressures, technological advancements and shifting expectations.",
              },
            ],
          },
          {
            id: "theme-2",
            number: 2,
            name: "Access to VET Qualifications and Training Delivery Partners",
            sectorColor: "",
            showOverview: true,
            overviewText:
              "Regional, rural, and specialist delivery pathways require flexible training partnerships and contemporary qualification alignment.",
            insights: [
              {
                id: "ins-2-1",
                number: 1,
                title: "Regional and remote training access barriers",
                summary:
                  "Access to Registered Training Organisations (RTOs) in regional, rural and remote locations remains limited.",
              },
              {
                id: "ins-2-2",
                number: 2,
                title: "Alignment of qualifications with contemporary practice",
                summary:
                  "Training products require ongoing updates to keep pace with emerging regulatory and operational needs.",
              },
            ],
          },
        ],
      };

    case "workforce_insights_detail":
      return {
        items: [
          {
            themeNumber: 1,
            themeName: `${sectorName} Specific Occupational Shortages`,
            insightNumber: 1,
            insightName: "Diverse multidisciplinary workforce requirements",
            insightDescription:
              "Employers require a diverse range of skills to maintain breadth of operational and community responsibilities.",
            themeGraphic: "lightbulb",
            blocks: [
              {
                id: "blk-1",
                type: "text",
                title: "A diverse, multidisciplinary workforce",
                body: `Across Australia, ${sectorName} employers require access to a broad range of skills to deliver services. Similar to other sectors, technological advancements and workforce pressures are changing the role of personnel and the skills they require.`,
              },
              {
                id: "blk-2",
                type: "industry_insight",
                title: "Industry Insight",
                icon: "building-2",
                body: "Stakeholders highlighted challenges in attracting qualified specialists in regional and metropolitan locations while adapting to digital workflows and updated regulatory compliance.",
              },
              {
                id: "blk-3",
                type: "chart",
                title: "Skills Shortage Trend Across Key Roles",
                chartType: "bar",
                labels: [`${year - 2}`, `${year - 1}`, `${year}`],
                series: [{ name: "Reported Vacancy Rate (%)", values: [14, 17, 19] }],
              },
              {
                id: "blk-4",
                type: "table",
                title: "Priority Occupational Groups Summary",
                headers: ["Occupation Group", "Shortage Severity", "Primary Driver"],
                rows: [
                  ["Technical Specialists", "High", "Private sector competition"],
                  ["Frontline Operations", "Moderate-High", "Ageing workforce & retention"],
                  ["Digital & Cyber", "High", "Rapid technology adoption"],
                ],
              },
            ],
          },
        ],
      };

    case "workforce_strategies":
      return {
        anchorBadge: "Workforce Strategies",
        headerTitle: `${year} Proposed ${sectorName} Workforce Strategies`,
        introText: `Public Skills Australia proposes the following strategies aligned to the workforce insights identified to support the ${sectorName} industry-sector. Select a strategy to explore its details.`,
        strategies: [
          {
            id: "strat-1",
            number: 1,
            name: `Map ${sectorName} occupational shortages to relevant VET training products`,
            objective:
              "Identify and map the use of relevant qualifications and training packages to support VET training for key occupational shortages.",
            workforceInsight: `${sectorName} Specific Occupational Shortages`,
            jscFunction: "Implementation, Promotion and Monitoring",
            approach:
              "Analyse Jobs and Skills Australia Occupational Shortage Lists alongside stakeholder consultations to identify qualification alignment gaps and promotion opportunities.",
            deliverable: "Occupational Shortage & Qualification Mapping Report",
            impact:
              "Supports employers and training providers by clarifying qualification pathways for high-demand occupations.",
            anticipatedTiming: "12 month project",
            keyStakeholders: [
              "State/Territory Sector Associations",
              "Registered Training Organisations (RTOs)",
              "Department of Employment and Workplace Relations",
              "Industry Advisory Group",
            ],
            customFields: [],
          },
          {
            id: "strat-2",
            number: 2,
            name: `Facilitate a roundtable on whole-of-VET-system responses to ${sectorName} challenges`,
            objective:
              `Promote the ${sectorName} industry-sector as a sustainable and skilled career pathway and enhance training delivery to communities.`,
            workforceInsight: "Access to VET Qualifications and Training Delivery Partners",
            jscFunction: "Industry Stewardship",
            approach:
              "Convene employers, RTOs, and state/territory training authorities to address regional delivery barriers and thin-market training solutions.",
            deliverable: "Whole-of-VET Roundtable Outcomes & Action Plan",
            impact:
              "Improves regional training access and strengthens employer-RTO collaboration.",
            anticipatedTiming: "6–9 month project",
            keyStakeholders: [
              "TAFE Directors Australia",
              "State Training Authorities",
              "Peak Employer Bodies",
            ],
            customFields: [],
          },
        ],
      };

    case "update_strategies":
      return {
        anchorBadge: "Workforce Strategies",
        headerTitle: `${year} ${sectorName} Workforce Insights Report – Strategies Updates`,
        introParagraph: `Public Skills Australia identified workforce strategies for the ${sectorName} industry-sector in ${year - 1}. Updates on the progress of these strategies are provided below.`,
        showIntroBoxes: sectorCode === "local-government",
        introBoxes:
          sectorCode === "local-government"
            ? [
                { title: "Focus Area 1", description: "Skills Audit and Training Package Uplift" },
                { title: "Focus Area 2", description: "Regional Workforce Capability & Retention" },
              ]
            : [],
        listBoxTitle: "PROJECTS · SELECT TO OPEN",
        items: [
          {
            id: "upd-1",
            code: "01",
            statusBadge: `COMPLETION: JUNE ${year}`,
            strategyName: `${sectorName} Training Package Review & Uplift Project`,
            summary:
              "Reviewing core competency standards to ensure contemporary operational, digital, and safety skills are reflected.",
            value:
              "Provides nationally consistent recognition for specialist skills across jurisdictions.",
            update:
              "Draft qualification materials have undergone national consultation with employers, unions, and RTOs ahead of final endorsement.",
            connections: {
              ministerialPriority: "Ensuring a skilled, adaptable and inclusive workforce.",
              strategicPlanPriorities: "Building sustainable capability through high-quality training products.",
              driversOfChange: "Technological transformation and workforce productivity.",
            },
            stakeholders: [
              "Industry Advisory Group",
              "State and Territory Training Authorities",
              "Registered Training Organisations",
            ],
            nextSteps: "Finalise consultation feedback and submit revised training package for approval.",
            customSubheadings: [],
          },
        ],
      };

    case "existing_strategies":
      return {
        anchorBadge: "Existing Strategies",
        headerTitle: "Existing Industry-Sector Strategies",
        introText: "Select a strategy on the left to open its detail and see how it informs Public Skills Australia's work.",
        listBoxTitle: "STRATEGIES · SELECT TO OPEN",
        items: [
          {
            id: "ex-1",
            code: "01",
            organizationLabel: "NATIONAL SECTOR STRATEGY",
            title: `${year} National ${sectorName} Workforce Strategy`,
            dateOrTag: `Active · ${year - 1}–${year + 2}`,
            summaryParagraphs: [
              `Sets out national priorities for attraction, retention, capability development, and leadership across ${sectorName}.`,
              "Focuses on addressing skill shortages, improving diversity, and strengthening regional workforce sustainability.",
            ],
            howItInformsHeading: "How this informs Public Skills Australia's work",
            howItInformsParagraphs: [
              "Guides alignment of training package priorities, stakeholder engagement, and annual Workforce Insights Report analysis.",
            ],
          },
        ],
      };

    case "federal_initiatives":
      return {
        useSharedTemplate: true,
        sharedKey: "federal_initiatives",
      };

    case "looking_forward":
      return {
        anchorBadge: "Looking Forward",
        headerTitle: `${year + 1} and Beyond`,
        introParagraphs: [
          `Public Skills Australia has built on prior Workforce Plans and Workforce Insights Reports to deliver the ${year} ${sectorName} Workforce Insights Report.`,
          `The ${year + 1} Workforce Insights Reports will focus on broader priorities detailed below and may be delivered throughout ${year + 1}.`,
        ],
        psaBoxes: [
          {
            id: "lf-psa-1",
            eyebrow: "LINE OF INQUIRY 1",
            text: "Inclusion and participation of First Nations people, women and other genders in the Public Safety and Government workforces.",
            icon: "users",
          },
          {
            id: "lf-psa-2",
            eyebrow: "LINE OF INQUIRY 2",
            text: "The use of AI and digital transformation and the impact of these technologies on the Public Safety and Government workforces.",
            icon: "cpu",
          },
        ],
        sectorBoxes: [
          {
            id: "lf-sec-1",
            eyebrow: "CONTINUING",
            title: `Additionally, the ${year + 1} Workforce Insights Reports will focus on emerging priorities impacting the ${sectorName} industry-sector.`,
            text: "Ongoing stakeholder engagement and national skills audits will guide future focus areas.",
            icon: "compass",
          },
        ],
        beyondText: `Beyond these focused lines of inquiry, the ${year + 1} Workforce Insights Reports will seek to examine the impact of the Drivers of Change identified in this year's reports on our industry-sector workforces.`,
      };

    case "cross_sector_analysis":
      return {
        anchorBadge: "Cross-Sector Analysis",
        headerTitle: "Public Safety Cross-Sector Analysis",
        introText:
          "Cross-sector analysis examines shared skills, specialist capability alignment, and Recognition of Prior Learning (RPL) pathways across Defence, Fire and Emergency Services, and Police.",
        themes: [
          { title: "Regulatory Environment", description: "Cross-jurisdictional licensing and accreditation alignment." },
          { title: "Skill Alignment", description: "Shared core competencies across emergency and defence roles." },
          { title: "Resourcing & Mobility", description: "Facilitating workforce transitions across public safety agencies." },
        ],
        subPages: [
          { title: "Core Skill Alignment", summary: "Shared capabilities across Firefighter, Police Officer, and Defence roles." },
          { title: "Specialist Skill Alignment", summary: "Cross-sector units of competency in search, rescue, and incident command." },
          { title: "Skills Recognition", summary: "Challenges and opportunities in delivering Recognition of Prior Learning (RPL)." },
        ],
      };

    case "one_off_page":
    default:
      return {
        anchorBadge: "Special Feature",
        headerTitle: `${year} ${sectorName} Special Feature`,
        introParagraphs: [
          "This bespoke one-off page presents additional sector-specific analysis, case studies, or transitional reporting requirements.",
        ],
        headerGraphic: "layers",
        linePlacement: "side", // "top" | "side"
        contentBoxes: [
          {
            id: "one-off-1",
            badge: "Focus 1",
            title: "Key Workforce Focus Area",
            text: "Add detailed analysis, project summaries, or targeted insights with configurable top or side sector colour accent lines.",
          },
        ],
      };
  }
}

export function buildDefaultPagesForSector(
  sectorCode: string,
  sectorName: string,
  year: number
) {
  const baseOrder: Array<{
    pageType: string;
    title: string;
    paletteMode: "GLOBAL_PSA" | "SECTOR" | "SUB_SECTOR";
  }> = [
    { pageType: "transition", title: "Report Landing / Transition", paletteMode: "SECTOR" },
    { pageType: "introduction", title: "Introduction", paletteMode: "SECTOR" },
    { pageType: "about", title: "About Public Skills Australia", paletteMode: "GLOBAL_PSA" },
    { pageType: "methodology", title: "Methodology", paletteMode: "GLOBAL_PSA" },
    { pageType: "executive_summary", title: "Executive Summary", paletteMode: "SECTOR" },
    { pageType: "drivers_of_change", title: "Drivers of Change", paletteMode: "GLOBAL_PSA" },
    { pageType: "industry_overview", title: "Industry-Sector Overview", paletteMode: "SECTOR" },
    { pageType: "industry_profile", title: "Industry Profile", paletteMode: "SECTOR" },
    { pageType: "workforce_insights", title: "Workforce Insights", paletteMode: "SECTOR" },
    { pageType: "workforce_insights_detail", title: "Workforce Insights Supporting Details", paletteMode: "SECTOR" },
    { pageType: "workforce_strategies", title: `${year} Proposed Workforce Strategies`, paletteMode: "SECTOR" },
    { pageType: "update_strategies", title: "Update on Strategies", paletteMode: "SECTOR" },
    { pageType: "existing_strategies", title: "Existing Industry-Sector Strategies", paletteMode: "SECTOR" },
    { pageType: "federal_initiatives", title: "Federal Government Initiatives", paletteMode: "GLOBAL_PSA" },
    { pageType: "looking_forward", title: "Looking Forward", paletteMode: "SECTOR" },
    { pageType: "downloads", title: "Download PDFs", paletteMode: "SECTOR" },
  ];

  if (sectorCode === "public-safety") {
    baseOrder.splice(6, 0, {
      pageType: "cross_sector_analysis",
      title: "Cross-Sector Analysis",
      paletteMode: "GLOBAL_PSA",
    });
  }

  return baseOrder.map((item, idx) => ({
    pageType: item.pageType,
    title: item.title,
    slug: item.pageType,
    sortOrder: idx,
    isVisible: true,
    paletteMode: item.paletteMode,
    layoutVariant: "standard",
    contentJson: JSON.stringify(
      getDefaultPageContent(item.pageType, sectorName, year, sectorCode)
    ),
    footnotesJson: JSON.stringify([]),
  }));
}
