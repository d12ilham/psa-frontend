import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import type {
  ExtractedChapterPage,
  ExtractedFootnote,
  ExtractedReport,
} from "./extract-2026-reports";

const ROOT_DIR = path.resolve(__dirname, "../..");
type JsonObj = Record<string, unknown>;

function evalSimpleTsExpr(node: ts.Expression): unknown {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (
    ts.isParenthesizedExpression(node) ||
    ts.isAsExpression(node) ||
    ts.isTypeAssertionExpression(node) ||
    ts.isSatisfiesExpression(node)
  ) {
    return evalSimpleTsExpr(node.expression);
  }
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) {
    return -Number(evalSimpleTsExpr(node.operand));
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((el) => evalSimpleTsExpr(el));
  }
  if (ts.isObjectLiteralExpression(node)) {
    const out: JsonObj = {};
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const key =
          ts.isIdentifier(prop.name) ||
          ts.isStringLiteral(prop.name) ||
          ts.isNumericLiteral(prop.name)
            ? prop.name.text
            : String(evalSimpleTsExpr(prop.name as ts.Expression));
        out[key] = evalSimpleTsExpr(prop.initializer);
      }
    }
    return out;
  }
  return undefined;
}

function readTsConstFromFile<T = unknown>(relPath: string, constName: string): T {
  const fullPath = path.join(ROOT_DIR, relPath);
  const src = fs.readFileSync(fullPath, "utf8");
  const sf = ts.createSourceFile(fullPath, src, ts.ScriptTarget.Latest, true);
  let result: unknown;
  const visit = (node: ts.Node) => {
    if (result !== undefined) return;
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === constName && decl.initializer) {
          result = evalSimpleTsExpr(decl.initializer);
          return;
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(sf, visit);
  if (result === undefined) {
    throw new Error(`Could not evaluate ${constName} from ${relPath}`);
  }
  return result as T;
}

export function buildLocalGovernment2026Report(): ExtractedReport {
  const slug = "local-government-workforce-insights-report";
  const pdfUrl =
    "https://psa-directus-prod.azurewebsites.net/assets/895e9b7a-2c55-4531-95a1-dafa90b60a1c.pdf";

  const strategyOne = readTsConstFromFile<JsonObj>(
    "src/components/reports/local-government/strategyOneContent.ts",
    "strategyOneContent"
  );
  const strategyTwo = readTsConstFromFile<JsonObj>(
    "src/components/reports/local-government/strategyTwoContent.ts",
    "strategyTwoContent"
  );
  const statesData = readTsConstFromFile<Record<string, JsonObj>>(
    "src/components/reports/local-government/views/StateTerritoryView.tsx",
    "STATES_DATA"
  );
  const councilSources = readTsConstFromFile<Record<string, JsonObj>>(
    "src/components/reports/local-government/views/StateTerritoryView.tsx",
    "COUNCIL_SOURCES"
  );
  const nationalOccupations = readTsConstFromFile<JsonObj[]>(
    "src/components/reports/local-government/views/StateTerritoryView.tsx",
    "NATIONAL_OCCUPATIONS"
  );
  const compareOccupations = readTsConstFromFile<JsonObj[]>(
    "src/components/reports/local-government/views/StateTerritoryView.tsx",
    "COMPARE_OCCUPATIONS"
  );
  const federalInitiatives = JSON.parse(
    fs.readFileSync(path.join(ROOT_DIR, "src/data/federalInitiatives.json"), "utf8")
  ) as JsonObj[];

  const lg2025Url =
    "https://psa-directus-prod.azurewebsites.net/assets/27231b35-4c58-42d7-87ce-5b9cc24d0408";
  const lg2024Url =
    "https://psa-directus-prod.azurewebsites.net/assets/acd96fb3-8c56-4df4-9670-6a92e6eb696d";
  const absUrl =
    "https://www.abs.gov.au/statistics/labour/employment-and-unemployment/public-sector-employment-and-earnings/latest-release";
  const algaSurveyUrl =
    "https://alga.com.au/wp-content/uploads/2025/04/2022-Local-Government-Workforce-Skills-and-Capability-Survey-National-Report.pdf";
  const interimSustainabilityUrl =
    "https://parlinfo.aph.gov.au/parlInfo/download/committees/reportrep/RB000536/toc_pdf/Interimreportintolocalgovernmentsustainability.pdf";

  const themesSharedFn: ExtractedFootnote[] = [
    {
      number: 27,
      sourceName:
        "Parliamentary Inquiry into Local Government Funding and Fiscal Sustainability / Local Government Sustainability",
      text: `Standing Committee on Regional Development, Infrastructure and Transport, [*Parliamentary Inquiry into Local Government Funding and Fiscal Sustainability*](https://www.aph.gov.au/Parliamentary_Business/Committees/House/Regional_Development_Infrastructure_and_Transport/LocalGovernmentFunding/Terms_of_Reference), Standing Committee on Regional Development, Infrastructure and Transport, 2026, accessed 11 February 2026; Standing Committee on Regional Development, Infrastructure and Transport, [*Parliamentary Inquiry into Local Government Sustainability*](https://www.aph.gov.au/LocalGovernmentSustainability), Standing Committee on Regional Development, Infrastructure and Transport, 2024, accessed 11 February 2026.`,
      url: "https://www.aph.gov.au/Parliamentary_Business/Committees/House/Regional_Development_Infrastructure_and_Transport/LocalGovernmentFunding/Terms_of_Reference",
      openInNewTab: true,
    },
    {
      number: 28,
      sourceName: "Interim Report into Local Government Sustainability",
      text: `Standing Committee on Regional Development, Infrastructure and Transport, [*Interim Report into Local Government Sustainability*](${interimSustainabilityUrl}), Standing Committee on Regional Development, Infrastructure and Transport, 2025, pages 5 and 21, accessed 11 February 2026.`,
      url: interimSustainabilityUrl,
      openInNewTab: true,
    },
    {
      number: 34,
      sourceName: "Interim Report into Local Government Sustainability",
      text: `Standing Committee on Regional Development, Infrastructure and Transport, [*Interim Report into Local Government Sustainability*](${interimSustainabilityUrl}), Standing Committee on Regional Development, Infrastructure and Transport, 2025, page 21, accessed 11 February 2026.`,
      url: interimSustainabilityUrl,
      openInNewTab: true,
    },
    {
      number: 35,
      sourceName: "Local Government Workforce Insights Report 2025",
      text: `PSA, [*Local Government Workforce Insights Report 2025*](${lg2025Url}), PSA, 2025, page 19, accessed 11 February 2026.`,
      url: lg2025Url,
      openInNewTab: true,
    },
    {
      number: 36,
      sourceName: "2022 Local Government Workforce Skills and Capability Survey",
      text: `ALGA, [*2022 Local Government Workforce Skills and Capability Survey*](${algaSurveyUrl}), ALGA, 2022, page 10, accessed 11 February 2026.`,
      url: algaSurveyUrl,
      openInNewTab: true,
    },
  ];

  const lgThemesOverview = {
    theme1Overview:
      "In support of both the *2024 Federal, State/Territory & Local Government Workforce Plan* and the *2025 Local Government Workforce Insights Report*, local council employers continue to emphasise the broad scope of occupations employed in their workforce. Role expansion in local councils has been a consistent theme identified during consultations which has been further examined through two Parliamentary inquiries examining Local Government sustainability and Local Government funding and fiscal sustainability.[[27]] These inquiries confirmed that the role of local councils has expanded over time and that this expansion is impacting both financial and workforce sustainability.[[28]]",
    theme2OverviewParagraphs: [
      "Access to training has consistently been raised as a challenge for local council employers located in regional, rural and remote locations. This challenge is affirmed in the *Interim Report into Local Government Sustainability*,[[34]] Public Skills Australia’s *2025 Local Government Workforce Insights Report*,[[35]] and the Australian Local Government Association’s *2022 Local Government Workforce Skills and Capability Survey*.[[36]]",
      "Throughout consultation for the *Local Government Skills Audit and Uptake and Utility of the LGA Local Government Training Package* project, VET was consistently identified as the most relevant pathway for roles requiring technical expertise and compliance assurance. Local councils emphasised the importance of VET’s role where formal qualifications underpin regulatory compliance and risk management in functions such as water treatment and civil construction, and for several technical positions that require *Certificate III or IV* such as Water Operator, Mechanic and Childcare Educator. However, while they acknowledged VET overwhelmingly supports work-related training, some stakeholders noted concerns about their ability to access TAFEs and RTOs to obtain qualifications that are contextualised to the Local Government industry-sector.",
    ],
  };

  let sort = 0;
  const pages: ExtractedChapterPage[] = [
    // 0. Transition / Landing
    {
      pageType: "transition",
      title: "Report Landing / Transition",
      slug: "transition",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        eyebrow: "2026 • PUBLIC SKILLS AUSTRALIA",
        headline: "2026 Local Government Workforce Insights Report",
        subheadline: "",
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
        subSectorSectionTitle: "",
        subSectorCards: [],
      },
      footnotes: [],
    },

    // 1. Introduction
    {
      pageType: "introduction",
      title: "Introduction",
      slug: "introduction",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "introduction",
        eyebrow: "INTRODUCTION",
        titleLine1: "2026 Local Government",
        titleLine2: "Workforce Insights Report",
        paragraphs: [
          "The 2026 Local Government Workforce Insights Report (the Report) is the fourth report generated by Public Skills Australia for the Local Government industry-sector since 2023. It builds on the previous iterations to identify workforce challenges and proposes strategic initiatives to mitigate them. This Report represents the insights, commitment and efforts of the Local Government industry-sector, shared with Public Skills Australia.",
          "Public Skills Australia’s Workforce Insights Reports are developed using a combination of qualitative and quantitative data obtained from primary and secondary sources and supported by stakeholder consultations.",
          "Choose to download the PDF report or read on to our interactive digital version.",
        ],
        previousReportHref: "/reports/local-government-workforce-insights-report-2025/downloads",
        glanceTitle: "THIS REPORT AT A GLANCE",
        glanceCells: [
          {
            pair: [
              { value: 4, label: "Drivers of\nChange" },
              { value: 9, label: "Megatrends" },
            ],
          },
          { value: 218000, formatNumber: true, label: "Workforce\nEmployees" },
          {
            pair: [
              { value: 2, label: "Workforce\nThemes" },
              { value: 7, label: "Workforce\nInsights" },
            ],
          },
          { value: 2, label: "Proposed 2026\nStrategies" },
        ],
        structureHeading: "The 2026 Digital Report Structure",
        structureCards: [
          {
            title: "Executive Summary",
            icon: "/images/reports/introduction/Executive.svg",
            description: "An executive overview of the workforce insights and strategies.",
            tags: [],
            pageType: "executive_summary",
          },
          {
            title: "Drivers of Change",
            icon: "/images/reports/introduction/Drivers.svg",
            description:
              "Identifies four key drivers of change that will impact Public Safety and Government industry-sectors in the short to medium term. Provides a recap of the nine megatrends identified in previous Workforce Insights Reports that remain relevant to long term workforce trends.",
            tags: ["Drivers of Change", "Nine Megatrends"],
            pageType: "drivers_of_change",
          },
          {
            title: "Industry Overview",
            icon: "/images/reports/introduction/Overview.svg",
            description:
              "Examines the Local Government workforce, providing data analysis, identifying workforce insights and detailing strategies aimed at addressing workforce challenges.",
            tags: [
              "Industry-Sector Overview",
              "State and Territory Profile",
              "Industry Profile",
            ],
            pageType: "industry_overview",
          },
          {
            title: "Workforce Insights",
            icon: "/images/reports/introduction/Insights.svg",
            description:
              "Examines the Local Government workforce, providing data analysis, identifying workforce insights and detailing strategies aimed at addressing workforce challenges.",
            tags: ["Industry-Sector Analysis"],
            pageType: "workforce_insights",
          },
          {
            title: "Workforce Strategies",
            icon: "/images/reports/introduction/Strategies.svg",
            description:
              "Outlines the 2026 Workforce Strategies proposed through this Report. Details current strategic work being undertaken within the industry-sector and how this informs Public Skills Australia’s work. Details Federal Government initiatives containing critical recommendations, strategic directions and national objectives that informs the planning and delivery of Public Skills Australia’s projects.",
            tags: [
              "Proposed Strategies Summary",
              "Update on 2025 Strategies",
              "Existing Industry-Sector Strategies",
              "Federal Government Initiatives",
            ],
            pageType: "workforce_strategies",
          },
          {
            title: "Looking Forward",
            icon: "/images/reports/introduction/Summary.svg",
            description:
              "Concludes the Report by outlining key lines of inquiry that will support the shaping of the 2027 Local Government Workforce Insights Report.",
            tags: ["Looking Forward to 2027"],
            pageType: "looking_forward",
          },
        ],
        featureBanners: [
          {
            title: "About Public Skills Australia",
            description: "Who we are and how we support the sector.",
            icon: "/images/reports/introduction/About.svg",
            pageType: "about",
          },
          {
            title: "Methodology",
            description: "How the insights and strategies were developed.",
            icon: "/images/reports/introduction/Methodology.svg",
            pageType: "methodology",
          },
        ],
      },
      footnotes: [],
    },

    // 2. About Public Skills Australia
    {
      pageType: "about",
      title: "About Public Skills Australia",
      slug: "about",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "about",
        title: "About Public Skills Australia",
        intro:
          "Public Skills Australia is the Jobs and Skills Council (JSC) for the Public Safety and Government industry, comprising Correctional Services, Defence, Federal, State/Territory and Local Government, Fire and Emergency Services and Police industry-sectors. Through its work, Public Skills Australia actively supports employer and employee bodies in these industries and associated volunteer associations.",
        waveImage: "/images/wave-right.png",
        partnership: {
          icon: "/images/reports/about/working-in-partnership.svg",
          title: "Working in partnership",
          text: "Public Skills Australia works in partnership with the Department of Employment and Workplace Relations (DEWR) and other JSCs to give effect to broader ministerial and government priorities.",
        },
        sectionHeading: "Public Skills Australia:",
        cards: [
          {
            icon: "/images/reports/about/Workforce.svg",
            title: "Workforce Planning (Workforce Insights)",
            text: "Undertakes data analysis, research and consultation to deepen understandings of contemporary workforce challenges and what can be done to mitigate these challenges.",
          },
          {
            icon: "/images/reports/about/Training.svg",
            title: "Training Product Development",
            text: "Develops quality training products to strengthen the skills and capabilities of Public Safety and Government workforces.",
          },
          {
            icon: "/images/reports/about/Supports.svg",
            title: "Implementation, Promotion and Monitoring",
            text: "Monitors and promotes the implementation of training products to support career pathways for the Public Safety and Government industry-sectors.",
          },
          {
            icon: "/images/reports/about/Industry.svg",
            title: "Industry Stewardship",
            text: "Consults with, advocates for and promotes the needs of the Public Safety and Government industry-sectors.",
          },
        ],
        commitment: {
          icon: "/images/reports/about/Commitment.svg",
          title: "Our commitment",
          text: "Public Skills Australia remains committed to encouraging the participation of First Nations people,[[1]] those from culturally and linguistically diverse backgrounds, those living with or experiencing disabilities, women and other gender diverse people and mature people in the Public Safety and Government industry workforces.",
        },
      },
      footnotes: [
        {
          number: 1,
          sourceName: "First Nations terminology note",
          text: "Please note, First Nations people will be used as preferred terminology inclusive of Aboriginal and Torres Strait Islanders. When citing a data source (such as government strategies or state of the sector reports) the terminology of the data source will be used to maintain accurate data representation.",
        },
      ],
    },

    // 3. Methodology
    {
      pageType: "methodology",
      title: "Methodology",
      slug: "methodology",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "methodology",
        title: "Methodology",
        introParagraphs: [
          "Public Skills Australia's **Workforce Insights Reports** are developed using a combination of qualitative and quantitative methods obtained from primary and secondary sources. This 2026 Local Government Workforce Insights Report is supported by data obtained through stakeholder consultations and engagements.",
          "These consultations were used to gain insight into challenges the Local Government industry-sector is facing with the development and maintenance of a skilled workforce. The challenges identified through consultations were thematically analysed to identify trends and priority areas to address for the industry-sector. Specific to the Local Government industry-sector, and in alignment with the tripartite approach for Jobs and Skills Councils (JSCs), consultations were held with employers, employee bodies and Government organisations, both in-person and through online meetings, workshops and presentations.",
        ],
        steps: [
          {
            stepLabel: "STEP 1",
            icon: "/images/reports/methodology/Data-sources.svg",
            title: "Data sources",
            subtitle: "JSA · ABS · NCVER datasets",
          },
          {
            stepLabel: "STEP 2",
            icon: "/images/reports/methodology/National-survey.svg",
            title: "National survey",
            count: 210,
            suffixText: "councils responded",
          },
          {
            stepLabel: "STEP 3",
            icon: "/images/reports/methodology/Workshops.svg",
            title: "Workshops",
            count: 137,
            suffixText: "councils attended",
          },
          {
            stepLabel: "STEP 4",
            icon: "/images/reports/methodology/Representatives.svg",
            title: "Representatives",
            count: 11,
            suffixText: "Industry-sector bodies",
          },
          {
            stepLabel: "STEP 5",
            icon: "/images/reports/methodology/Governance.svg",
            title: "Governance",
            subtitle: "Review, endorsement, approval",
          },
        ],
        representativesCard: {
          title: "Key industry-sector representatives",
          icon: "/images/reports/methodology/industry-sector representatives.svg",
          intro:
            "Public Skills Australia undertook targeted workforce planning consultation with key industry-sector representatives as below:",
          items: [
            "Australian Local Government Association (ALGA)",
            "Local Government New South Wales (LGNSW)",
            "Local Government Association of the Northern Territory (LGANT)",
            "Local Government Association of Queensland (LGAQ)",
            "Local Government Association of South Australia (LGA SA)",
            "Local Government Association Tasmania (LGAT)",
            "Local Government Professionals Victoria (LGPro VIC)",
            "Municipal Association of Victoria (MAV)",
            "WA Local Government Association (WALGA)",
            "Local Government Professionals WA (LGPro WA)",
            "United Services Union (USU)",
          ],
        },
        researchSection: {
          paragraph:
            "Following these consultations, Public Skills Australia conducted secondary qualitative and quantitative research to verify the challenges raised. In addition to these consultations, the findings and views presented in this Report are also drawn from consultations undertaken in the conduct of the Public Skills Australia Local Government Skills Audit and Review of Uptake and Utility of the LGA Local Government Training Package project. Face-to-face and online consultations were undertaken across late 2025 and early 2026 as well as a broad national survey on workforce challenges, skills and training.",
          stats: [
            {
              value: 280,
              label:
                "In total, Public Skills Australia engaged with a total of 280 councils[[3]]",
            },
            { value: 137, label: "Councils attended workshops" },
            { value: 210, label: "Councils responded to the survey" },
          ],
          appendixText:
            "A full list of councils that participated in these activities is provided at Appendix A.",
        },
        governanceSection: {
          heading:
            "Drafts were subsequently progressed through Public Skills Australia's governance process that includes:",
          stages: [
            {
              title: "1 · Government Subcommittee",
              paragraphs: [
                "The Subcommittee is responsible for recommending this Report to the Industry Advisory Group (IAG) for endorsement.",
                "This recommendation is made on the basis that the Subcommittee is satisfied that sufficient consultation and engagement has been undertaken, and that consultation feedback was appropriately actioned.",
              ],
            },
            {
              title: "2 · Industry Advisory Group",
              paragraphs: [
                "The IAG is responsible for endorsing this Report to the Public Skills Australia Board for approval to be submitted to DEWR.",
                "This endorsement is made on the basis that the IAG is satisfied with the Government Subcommittee's recommendation for endorsement. The IAG further provides its strategic guidance and endorsement if comfortable that the strategic priorities of Public Safety and Government industry-sectors are also captured.",
              ],
            },
            {
              title: "3 · Public Skills Australia Board",
              paragraphs: [
                "The Public Skills Australia Board (the Board) is responsible to approve the submission of this Report to DEWR.",
                "This approval is made on the basis that the Board is satisfied that an appropriate development and consultation process was followed and that the Report has been progressed in line with the internal governance requirements of Public Skills Australia.",
              ],
            },
          ],
        },
        bottomCards: [
          {
            icon: "/images/reports/methodology/Data-sources-bottom.svg",
            title: "Data sources",
            text: "The Report uses publicly available datasets accessible from Jobs and Skills Australia (JSA), the Australian Bureau of Statistics (ABS), the National Centre for Vocational Education Research (NCVER) and other supporting online sources. Due to the complexity of large-scale workforce data, no single source provides an accurate or complete picture. Therefore, multiple data sources are used to provide the most accurate representation of the workforce as possible, supported by qualitative research. This research was bolstered by literature reviews of government reports and documents, online sources, annual reports, departmental documentation, legislation, research articles and relevant Royal Commission Reports.",
          },
          {
            icon: "/images/reports/methodology/With-thanks.svg",
            title: "With thanks",
            text: "Public Skills Australia thanks the contributors, including industry representatives, its Board and governance group representatives, Department of Employment and Workplace Relations (DEWR) and JSA for sharing their views and data generously, and supporting the development of this Report.",
          },
        ],
      },
      footnotes: [
        {
          number: 3,
          sourceName: "Consultation participation note",
          text: "Note: councils were able to participate in both consultation and the survey. Councils who engaged in both have only been counted once. Public Skills Australia did not meet with stakeholders from the ACT as they do not have local councils. Insights related to the ACT Government industry-sector are included in the 2026 Federal and State/Territory Workforce Insights Report.",
        },
      ],
    },

    // 4. Executive Summary
    {
      pageType: "executive_summary",
      title: "Executive Summary",
      slug: "executive_summary",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "executive_summary",
        title: "Executive Summary",
        intro:
          "Public Skills Australia's 2026 Local Government Workforce Insights Report considers the wider operational contexts impacting Public Safety and Government industry-sectors. It identifies four drivers of change that will impact workforce planning in the short to medium term, aligned with the nine megatrends detailed in previous **Workforce Insights Reports**, that remain relevant to long term workforce trends.",
        flowImages: [
          { src: "/images/reports/executive-summary/flow-1-workforce.png", alt: "Workforce" },
          { src: "/images/reports/executive-summary/flow-2-insights.png", alt: "Insights" },
          { src: "/images/reports/executive-summary/flow-3-strategies.png", alt: "Strategies" },
          { src: "/images/reports/executive-summary/flow-4-forward.png", alt: "Looking Forward" },
        ],
        driversBanner: {
          icon: "/images/drivers-of-change-icon.svg",
          title: "Drivers of Change",
          description:
            "It identifies four drivers of change that will impact workforce planning in the short to medium term, aligned with the nine megatrends detailed in previous Workforce Insights Reports, that remain relevant to long term workforce trends.",
          buttonLabel: "Present Drivers of Change",
          targetPageType: "drivers_of_change",
        },
        themesHeader: {
          icon: "/images/work-force.svg",
          title: "Two Themes, Seven Workforce Insights",
          description:
            "This Report identifies seven insights within the Local Government industry-sector, across two themes (Local Government Specific Occupational Shortages and Access to Vocational Education and Training (VET) Qualifications and Training Delivery Partners):",
          buttonLabel: "Present Workforce Insights",
          targetPageType: "workforce_insights",
        },
        themes: [
          {
            eyebrow: "THEME 1 · 3 INSIGHTS",
            title: "Local Government Specific Occupational Shortages",
            borderColor: "#9CAA54",
            overviewParagraphs: [lgThemesOverview.theme1Overview],
            insights: [
              {
                number: "1",
                eyebrow: "Theme One, Insight One",
                text: "Local Government employers require a diverse range of skills to maintain the breadth of responsibilities undertaken by local councils.[[2]]",
                targetPageType: "theme1_insight_1",
              },
              {
                number: "2",
                eyebrow: "Theme One, Insight Two",
                text: "Skills needs are changing due to workforce pressures, technological advances and shifting community expectations.",
                targetPageType: "theme1_insight_2",
              },
              {
                number: "3",
                eyebrow: "Theme One, Insight Three",
                text: "While local council employers are experiencing some shortages in identified national shortage occupations, several Local Government specific shortages were also identified.",
                targetPageType: "theme1_insight_3",
              },
            ],
          },
          {
            eyebrow: "THEME 2 · 4 INSIGHTS",
            title: "Access to VET Qualifications and Training Delivery Partners",
            borderColor: "#046D2A",
            overviewParagraphs: lgThemesOverview.theme2OverviewParagraphs,
            insights: [
              {
                number: "1",
                eyebrow: "Theme Two, Insight One",
                text: "Access to Technical and Further Education (TAFE) or Registered Training Organisations (RTOs) in regional, rural and remote locations is limited.",
                targetPageType: "theme2_insight_1",
              },
              {
                number: "2",
                eyebrow: "Theme Two, Insight Two",
                text: "Few TAFEs and RTOs are willing to travel to geographically isolated locations.",
                targetPageType: "theme2_insight_2",
              },
              {
                number: "3",
                eyebrow: "Theme Two, Insight Three",
                text: "Local councils have limited training budgets to support financial impost of course enrolment as well as travel to and from training.",
                targetPageType: "theme2_insight_3",
              },
              {
                number: "4",
                eyebrow: "Theme Two, Insight Four",
                text: "Course delivery is often not tailored to regional, rural and remote areas.",
                targetPageType: "theme2_insight_4",
              },
            ],
          },
        ],
        terminologyNote:
          "[[2]] In this report, Public Skills Australia uses Local Government to refer to the national Local Government industry-sector. Local councils, or local council, is used as a preferred term when referring to a specific council or councils.",
        strategiesHeader: {
          icon: "/images/stratergies.svg",
          title: "2026 Proposed Local Government Workforce Strategies",
          description:
            "The following strategies have been developed to support efforts to address challenges identified through the above industry insights.",
          buttonLabel: "Present 2026 Strategies",
          targetPageType: "workforce_strategies",
        },
        strategies: [
          {
            badge: "STRATEGY 1",
            borderColor: "#9CAA54",
            ...strategyOne,
          },
          {
            badge: "STRATEGY 2",
            borderColor: "#046D2A",
            ...strategyTwo,
          },
        ],
        lookingForwardBanner: {
          icon: "/images/2027-and-beyond.svg",
          title: "2027 and Beyond",
          description:
            "This Report concludes by looking towards the 2027 **Workforce Insights Reports** and beyond. Future work will firstly focus on broader priorities, including the participation of First Nations people, women and other genders in the Public Safety and Government workforces, in addition to examining the implications of artificial intelligence (AI) and digital transformation.",
          buttonLabel: "View 2027 and Beyond",
          targetPageType: "looking_forward",
        },
        supportingLinks: [
          { label: "Update on 2025 Strategies", pageType: "update_2025_strategies" },
          { label: "Existing Industry-Sector Strategies", pageType: "existing_strategies" },
          { label: "State and Territory Workforce Profile", pageType: "state_territory" },
        ],
      },
      footnotes: themesSharedFn,
    },

    // 5. Drivers of Change
    {
      pageType: "drivers_of_change",
      title: "Drivers of Change",
      slug: "drivers_of_change",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "drivers_of_change",
        title: "Drivers of Change",
        diagramImage: "/images/reports/drivers-of-change-diagram.png",
        introParagraphs: [
          "In 2024, Public Skills Australia identified nine megatrends impacting the Public Safety and Government industry-sectors. These megatrends were further considered in the development of the 2025 **Workforce Insights Reports**.",
          "While these megatrends will continue to have longer term implications for workforce planning and development across the Public Safety and Government industry-sectors, the 2026 **Workforce Insights Reports** have built on these and analysed four key drivers of change that cut across most megatrends. This is important as these drivers of change will likely impact the Public Safety and Government industry-sectors in the short to medium term.",
        ],
        drivers: [
          {
            id: 1,
            number: "DRIVER 1",
            shortTitle: "Resilience of organisations to respond to strategic shocks",
            shortDesc: "Compounding crises have exposed structural vulnerabilities...",
            fullTitle: "Driver 1 — Resilience of organisations to respond to strategic shocks",
            fullDesc:
              "Organisational resilience is emerging as a critical driver of change across Australia's Public Safety and Government industry-sectors, particularly as agencies confront increasingly frequent and complex strategic shocks. Recent experience with compounding crises (such as increasingly intense bushfires, major cyberattacks and intensifying geopolitical tensions) have exposed structural vulnerabilities and highlighted the need for more adaptive, anticipatory and integrated capabilities. Investment will be required to deepen organisational capabilities that support systemwide preparedness, robust governance and the ability to maintain critical functions under stress.[[4]]",
          },
          {
            id: 2,
            number: "DRIVER 2",
            shortTitle: "Challenges to workforce productivity",
            shortDesc: "Australia's slowest productivity growth in 60 years...",
            fullTitle: "Driver 2 — Challenges to workforce productivity",
            fullDesc:
              "In its Five Pillars of Productivity inquiry reports, the Productivity Commission observed that productivity growth has been slowing globally since the mid-2000s, with Australia experiencing the slowest productivity growth in 60 years. The Productivity Commission identified long-standing pressures that have contributed to the productivity slowdown, including market stagnation, a persistently tight labour market and slower uptake of technological innovations.[[5]] These factors are further exacerbated by emerging challenges linked to the megatrends including an ageing population, technological development, climate change and competition for labour.[[6]]",
          },
          {
            id: 3,
            number: "DRIVER 3",
            shortTitle:
              "Emergence of Artificial Intelligence (AI), greater automation and broader digital transformation",
            shortDesc: "Capability uplift — and a growing security risk...",
            fullTitle:
              "Driver 3 — Emergence of Artificial Intelligence (AI), greater automation and broader digital transformation",
            fullDesc:
              "AI, automation and accelerated digital transformation are powerful drivers of organisational and system-level change in the short term. This is reinforced by a push from the Federal Government for greater adoption of AI and digital initiatives across federal agencies.[[7]] These initiatives signal a shift toward embedding AI into core service delivery, regulatory functions and operational decision making. AI, automation and digital transformation represent an opportunity for significant capability uplift through AI-enabled analytics, automation of high-volume processes and advanced digital platforms that enhance situational awareness, threat detection and emergency response coordination. Conversely, they represent a growing security risk as they are also being leveraged by threat actors to disrupt government services, facilitate foreign interference, enable disinformation, promote false narratives through deepfakes and erode trust in government institutions.[[8]]",
          },
          {
            id: 4,
            number: "DRIVER 4",
            shortTitle: "Workforce inclusivity",
            shortDesc: "Recruiting and retaining diverse cohorts...",
            fullTitle: "Driver 4 — Workforce inclusivity",
            fullDesc:
              "Workforce inclusivity has been a key focus across the labour market. In the Public Safety and Government industry-sectors this is likely to translate into a continued focus on recruiting, retaining and developing employees from diverse cultural, linguistic, gender, disability and neurodivergent backgrounds. As organisations seek to increase workforce participation from these cohorts, they will be required to adapt and change legacy systems and processes to respond to the needs of the modern workforce.",
          },
        ],
        megatrends: [
          {
            id: "pathways",
            icon: "/images/reports/drivers-of-change/Limitations.svg",
            title: "Limitations in career pathways",
            desc: "Career pathway opportunities for young professionals require further promotion, as potential employees are often unaware of Local Government career opportunities and pathways.",
          },
          {
            id: "climate",
            icon: "/images/reports/drivers-of-change/Climate.svg",
            title: "Climate change",
            desc: "Climate change impacts many functions of Local Government, such as emergency management and environmental planning.",
          },
          {
            id: "labour",
            icon: "/images/reports/drivers-of-change/Competition.svg",
            title: "Competition for labour",
            desc: "Local Government is competing for labour with the private sector and other parts of the public sector. There is also competition for labour between Local Government organisations.",
          },
          {
            id: "duties",
            icon: "/images/reports/drivers-of-change/Expansion.svg",
            title: "Expansion of core duties",
            desc: "Local Government employees are increasingly taking on multiple roles to meet community needs in the Local Government industry sector.",
          },
          {
            id: "diversity",
            icon: "/images/reports/drivers-of-change/Diversity.svg",
            title: "Diversity and inclusion",
            desc: "Equitable gender composition and meaningful participation of a diverse workforce is an ongoing goal for Local Government workforces, particularly in leadership roles.",
          },
          {
            id: "demographics",
            icon: "/images/reports/drivers-of-change/Demographic.svg",
            title: "Demographic shifts",
            desc: "Ageing workforces can impact the transfer of institutional knowledge and further create skills gaps in Local Government workforces.",
          },
          {
            id: "tech",
            icon: "/images/reports/drivers-of-change/Technological.svg",
            title: "Technological development",
            desc: "The implementation of new technology in the Local Government workforce can be impacted by resource constraints and the availability of training.",
          },
          {
            id: "recruitment",
            icon: "/images/reports/drivers-of-change/Recruitment.svg",
            title: "Recruitment and retention",
            desc: "There are several barriers to the attraction and retention of Local Government workforces in remote, regional and rural locations.",
          },
          {
            id: "trust",
            icon: "/images/reports/drivers-of-change/Public.svg",
            title: "Public trust and perceptions",
            desc: "Local Governments are required to balance resourcing constraints with meeting community needs, which can impact public trust and perception.",
          },
        ],
        closingParagraph:
          "These megatrends were identified in previous **Workforce Insights Reports** and will continue to have longer term implications for workforce planning and development across the Public Safety and Government industry-sectors.",
      },
      footnotes: [
        {
          number: 4,
          sourceName: "Organisational Resilience: Good Practice Guide",
          text: "Australian Government Department of Home Affairs, [Organisational Resilience: Good Practice Guide](https://www.cisc.gov.au/resources-subsite/Documents/org-res-good-practice-guide.pdf), Australian Government Department of Home Affairs, 2024, accessed 25 February 2026.",
          url: "https://www.cisc.gov.au/resources-subsite/Documents/org-res-good-practice-guide.pdf",
          openInNewTab: true,
        },
        {
          number: 5,
          sourceName: "Five pillars of productivity inquiries – final reports",
          text: "Productivity Commission, [Five pillars of productivity inquiries – final reports](https://www.pc.gov.au/inquiries-and-research/five-productivity-inquiries/), Productivity Commission, 2025, accessed 13 February 2026.",
          url: "https://www.pc.gov.au/inquiries-and-research/five-productivity-inquiries/",
          openInNewTab: true,
        },
        {
          number: 6,
          sourceName: "Five pillars of productivity inquiries",
          text: "Productivity Commission, [Five pillars of productivity inquiries](https://www.pc.gov.au/inquiries-and-research/five-productivity-inquiries/), Productivity Commission, 2025, accessed 25 February 2026.",
          url: "https://www.pc.gov.au/inquiries-and-research/five-productivity-inquiries/",
          openInNewTab: true,
        },
        {
          number: 7,
          sourceName:
            "National framework for the assurance of artificial intelligence in government / Policy for the responsible use of AI in government",
          text: "Australian Government Department of Finance, [National framework for the assurance of artificial intelligence in government](https://www.finance.gov.au/government/public-data/data-and-digital-ministers-meeting/national-framework-assurance-artificial-intelligence-government), Australian Government Department of Finance, 2024, accessed 25 February 2026; Australian Government Digital Transformation Agency, [Policy for the responsible use of AI in government](https://www.digital.gov.au/ai/ai-in-government-policy), Australian Government Digital Transformation Agency, 2025, accessed 25 February 2026.",
          url: "https://www.finance.gov.au/government/public-data/data-and-digital-ministers-meeting/national-framework-assurance-artificial-intelligence-government",
          openInNewTab: true,
        },
        {
          number: 8,
          sourceName: "Director-General’s Annual Threat Assessment 2025",
          text: "Australian Security Intelligence Organisation (ASIO), [Director-General’s Annual Threat Assessment 2025](https://www.asio.gov.au/director-generals-annual-threat-assessment-2025), ASIO, 2025, accessed 25 February 2026.",
          url: "https://www.asio.gov.au/director-generals-annual-threat-assessment-2025",
          openInNewTab: true,
        },
      ],
    },

    // 6. Industry-Sector Overview
    {
      pageType: "industry_overview",
      title: "Industry-Sector Overview",
      slug: "industry_overview",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "industry_overview",
        title: "Local Government Industry-Sector Overview",
        heroImage: "/images/reports/industry-overview/hero.svg",
        intro:
          "Across Australia, there are 537 local councils.[[9]] Of these local councils, around 55 per cent are located in regional, rural or remote areas with the other 45 per cent split across urban regions, urban fringe and urban areas.[[10]] Local councils manage approximately one-third of Australia's public infrastructure assets, including roads, airports, facilities and other assets[[11]] and make up 77 per cent of the national road network (by length). The public assets managed by local councils are valued at an estimated $643 billion.[[12]]",
        stats: [
          {
            icon: "/images/reports/industry-overview/item1.svg",
            type: "single",
            target: 537,
            description: "local councils across Australia",
          },
          {
            icon: "/images/reports/industry-overview/item2.svg",
            type: "split",
            targetA: 55,
            targetB: 45,
            line1: "55% regional, rural or remote",
            line2: "45% urban regions, urban fringe and urban areas",
          },
          {
            icon: "/images/reports/industry-overview/item3.svg",
            type: "single",
            target: 218000,
            formatNumber: true,
            description: "employees (estimated) in the Local Government workforce",
          },
          {
            icon: "/images/reports/industry-overview/item4.svg",
            type: "single",
            target: 400,
            suffix: "+",
            description: "different occupations employed",
          },
        ],
        workforceSection: {
          icon: "/images/reports/industry-overview/multidisciplinary.svg",
          title: "A multidisciplinary workforce",
          leftParagraph:
            "The Local Government workforce is multidisciplinary, employing over an estimated 400 different occupations.[[13]] Their workforces are managed individually at the local council level but are brought together and commonly represented through state and territory associations and the Australian Local Government Association (ALGA). It is estimated that the Local Government workforce is made up of approximately 218,000 employees.[[14]]",
          rightParagraph:
            "While employment projections have estimated significant growth in the Local Government workforce over the next ten years, successive Workforce Plans[[15]] and Parliamentary Commissions of Inquiry have noted extensive challenges with recruitment and retention, and a significant expansion of roles and responsibilities for the Local Government industry-sector.[[16]]",
        },
        datapointsLead:
          "The following datapoints were identified through this industry-sector overview for the Local Government workforce:",
        callouts: [
          {
            title: "State and territory Workforce Profile",
            description:
              "The Local Government workforce is spread across a diverse geographical area. The workforce profile consists of a balanced gender representation and high representation of First Nations employees (8.2 per cent of total national workforce) when compared to the total national population (3.8 per cent of total Australian population).[[17]]",
            buttonLabel: "View the interactive state profile",
            targetPageType: "state_territory",
          },
          {
            title: "Key Occupational Shortages by state and territory",
            description:
              "In consultation with stakeholders for the Local Government Skills Audit and Uptake and Utility of the LGA Local Government Training Package project, each local council identified top occupational shortages affecting their workforces. In examining these shortages against the Jobs and Skills Australia Occupational Shortage List, several Local Government specific shortages have been identified.",
            buttonLabel: "View the Industry Profile data",
            targetPageType: "industry_profile",
          },
        ],
      },
      footnotes: [
        {
          number: 9,
          sourceName: "Facts and Figures",
          text: "ALGA, [Facts and Figures](https://alga.com.au/about/local-government/facts-and-figures/), ALGA, 2025, accessed 24 September 2025.",
          url: "https://alga.com.au/about/local-government/facts-and-figures/",
          openInNewTab: true,
        },
        {
          number: 10,
          sourceName: "Facts and Figures",
          text: "ALGA, [Facts and Figures](https://alga.com.au/about/local-government/facts-and-figures/), ALGA, 2025, accessed 24 September 2025.",
          url: "https://alga.com.au/about/local-government/facts-and-figures/",
          openInNewTab: true,
        },
        {
          number: 11,
          sourceName: "2024 National State of the Assets Report",
          text: "ALGA, [2024 National State of the Assets Report](https://alga.com.au/wp-content/uploads/2025/04/ALGA-National-State-of-the-Assets-Report-2024-final.pdf), ALGA, 2024, pages 4, 5 and 8, accessed 11 February 2026.",
          url: "https://alga.com.au/wp-content/uploads/2025/04/ALGA-National-State-of-the-Assets-Report-2024-final.pdf",
          openInNewTab: true,
        },
        {
          number: 12,
          sourceName: "2024 National State of the Assets Report",
          text: "ALGA, [2024 National State of the Assets Report](https://alga.com.au/wp-content/uploads/2025/04/ALGA-National-State-of-the-Assets-Report-2024-final.pdf), ALGA, 2024, pages 4, 5 and 8, accessed 11 February 2026.",
          url: "https://alga.com.au/wp-content/uploads/2025/04/ALGA-National-State-of-the-Assets-Report-2024-final.pdf",
          openInNewTab: true,
        },
        {
          number: 13,
          sourceName: "Facts and Figures",
          text: "ALGA, [Facts and Figures](https://alga.com.au/about/local-government/facts-and-figures/), ALGA, 2025, accessed 24 September 2025.",
          url: "https://alga.com.au/about/local-government/facts-and-figures/",
          openInNewTab: true,
        },
        {
          number: 14,
          sourceName: "Public Sector Employment and Earnings",
          text: "Australian Bureau of Statistics (ABS), [Public Sector Employment and Earnings](https://www.abs.gov.au/statistics/labour/employment-and-unemployment/public-sector-employment-and-earnings/latest-release), ABS, 2025, accessed 11 February 2026.",
          url: absUrl,
          openInNewTab: true,
        },
        {
          number: 15,
          sourceName: "Workforce Plans 2024 & 2025",
          text: `Public Skills Australia (PSA), [Federal, State/Territory and Local Government Workforce Plan 2024](${lg2024Url}), PSA, 2024, accessed 11 February 2026; PSA, [2025 Local Government Workforce Insights Report](${lg2025Url}), PSA, 2025, accessed 11 February 2026.`,
          url: lg2024Url,
          openInNewTab: true,
        },
        {
          number: 16,
          sourceName: "Inquiry into Local Government Sustainability Interim Report",
          text: "Parliament of Australia, [Inquiry into Local Government Sustainability Interim Report](https://www.aph.gov.au/Parliamentary_Business/Committees/House/Regional_Development_Infrastructure_and_Transport/Localgovernmentsustaina/Interim_Report), Parliament of Australia, 2025, accessed 11 February 2026.",
          url: "https://www.aph.gov.au/Parliamentary_Business/Committees/House/Regional_Development_Infrastructure_and_Transport/Localgovernmentsustaina/Interim_Report",
          openInNewTab: true,
        },
        {
          number: 17,
          sourceName: "Estimates of Aboriginal and Torres Strait Islander Australians / ALGA 2022 Survey",
          text: `ABS, [Estimates of Aboriginal and Torres Strait Islander Australians](https://www.abs.gov.au/statistics/people/aboriginal-and-torres-strait-islander-peoples/estimates-aboriginal-and-torres-strait-islander-australians/latest-release), ABS, 2021, accessed 12 February 2026; ALGA, [2022 Local Government Workforce Skills and Capability Survey](${algaSurveyUrl}), ALGA, 2022, page 39, accessed 11 February 2026.`,
          url: "https://www.abs.gov.au/statistics/people/aboriginal-and-torres-strait-islander-peoples/estimates-aboriginal-and-torres-strait-islander-australians/latest-release",
          openInNewTab: true,
        },
      ],
    },

    // 7. State and Territory Profile
    {
      pageType: "state_territory",
      title: "State and Territory Profile",
      slug: "state_territory",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "state_territory",
        title: "State and Territory Workforce Profile",
        absSourceUrl: absUrl,
        algaSurveyUrl,
        statesData,
        councilSources,
        nationalOccupations,
        compareOccupations,
      },
      footnotes: [
        ...Object.entries(councilSources).map(([code, cs]) => ({
          number: Number(cs.footnote),
          sourceName: `${code} Councils Directory — ${String(cs.title)}`,
          text: String(cs.citation),
          url: String(cs.href),
          openInNewTab: true,
        })),
        {
          number: 25,
          sourceName: "Public Sector Employment and Earnings",
          text: "ABS, Public Sector Employment and Earnings, 2025, Table 1.",
          url: absUrl,
          openInNewTab: true,
        },
        {
          number: 26,
          sourceName: "2022 Local Government Workforce Skills and Capability Survey",
          text: "ALGA, 2022 Local Government Workforce Skills and Capability Survey, 2022, Table D2.",
          url: algaSurveyUrl,
          openInNewTab: true,
        },
      ],
    },

    // 8. Industry Profile
    {
      pageType: "industry_profile",
      title: "Industry Profile",
      slug: "industry_profile",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "industry_profile",
        title: "Industry Profile",
        heroImage: "/images/reports/industry-profile/hero.png",
        intro:
          "Key industry data from the 2026 Report: employment growth, asset management and Local Government Training Package activity. For sector-wide figures, see the Industry-Sector Overview; for state-level data, see the State and Territory Workforce Profile.",
        growthChart: {
          title: "2020–2025 Employment Growth in Local Government",
          years: ["2020–2021", "2021–2022", "2022–2023", "2023–2024", "2024–2025"],
          series: [
            {
              name: "Employees",
              values: [190800, 192500, 208200, 213500, 218000],
              color: "#598303",
              colors: ["#B2DB79", "#B2DB79", "#8AC900", "#8AC900", "#598303"],
            },
          ],
          min: 160000,
          max: 218000,
          sourceMarkdown: `Source: ABS, [Public sector employment and earnings](${absUrl}), 2025, releases 2020–2025`,
        },
        trainingChart: {
          title: "Local Government Training Package Enrolments and Completions",
          years: ["2019", "2020", "2021", "2022", "2023", "2024"],
          series: [
            {
              name: "Enrolments",
              values: [945, 735, 555, 365, 470, 600],
              color: "#9CAA54",
            },
            {
              name: "Completions",
              values: [285, 300, 220, 155, 90, 135],
              color: "#086B37",
            },
          ],
          min: 0,
          max: 1000,
          sourceMarkdown:
            "Source: NCVER, [Total VET students and courses 2024: DataBuilder](https://www.ncver.edu.au/research-and-statistics/data/databuilder) [dataset], 2024",
        },
        assetSection: {
          heading: "Asset Management",
          cards: [
            {
              icon: "/images/reports/industry-profile/item-2.svg",
              alt: "77%",
              topLabel: "Local Government roads make up",
              target: 77,
              prefix: "",
              suffix: "%",
              bottomLabel: "of the national road network (by length)",
            },
            {
              icon: "/images/reports/industry-profile/item-3.svg",
              alt: "$643bn",
              topLabel:
                "Public assets managed by Local Government are valued at an estimated",
              target: 643,
              prefix: "$",
              suffix: " billion",
              bottomLabel: "",
            },
          ],
          sourceMarkdown:
            "Source: ALGA, [2024 National State of the Assets Report](https://alga.com.au/wp-content/uploads/2025/04/ALGA-National-State-of-the-Assets-Report-2024-final.pdf), 2024, pg. 5 & 8",
        },
      },
      footnotes: [],
    },

    // 9. Workforce Insights Overview
    {
      pageType: "workforce_insights",
      title: "Workforce Insights",
      slug: "workforce_insights",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "workforce_insights",
        title: "Workforce Insights",
        heroImage: "/images/reports/workforce-insights.png",
        intro:
          "This Report identifies the following themes and industry-sector insights relating to Local Government. Select any insight to open its detail page.",
        themes: [
          {
            eyebrow: "THEME 1 · 3 INSIGHTS",
            title: "Local Government Specific Occupational Shortages",
            borderColor: "#9CAA54",
            overviewParagraphs: [lgThemesOverview.theme1Overview],
            insights: [
              {
                number: "1",
                eyebrow: "Theme One, Insight One",
                text: "Local council employers require a diverse range of skills to maintain the breadth of responsibilities undertaken by local councils.",
                targetPageType: "theme1_insight_1",
              },
              {
                number: "2",
                eyebrow: "Theme One, Insight Two",
                text: "Skills needs are changing due to workforce pressures, technological advancements and shifting community expectations.",
                targetPageType: "theme1_insight_2",
              },
              {
                number: "3",
                eyebrow: "Theme One, Insight Three",
                text: "While local council employers are experiencing some shortages in identified national shortage occupations, several Local Government specific shortages were also identified.",
                targetPageType: "theme1_insight_3",
              },
            ],
          },
          {
            eyebrow: "THEME 2 · 4 INSIGHTS",
            title: "Access to VET Qualifications and Training Delivery Partners",
            borderColor: "#046D2A",
            overviewParagraphs: lgThemesOverview.theme2OverviewParagraphs,
            insights: [
              {
                number: "1",
                eyebrow: "Theme Two, Insight One",
                text: "Access to TAFE or RTO in regional, rural and remote locations is limited.",
                targetPageType: "theme2_insight_1",
              },
              {
                number: "2",
                eyebrow: "Theme Two, Insight Two",
                text: "Few TAFEs and RTOs are willing to travel to geographically isolated locations to deliver required qualifications.",
                targetPageType: "theme2_insight_2",
              },
              {
                number: "3",
                eyebrow: "Theme Two, Insight Three",
                text: "Local councils have limited training budgets to support financial impost of course enrolment as well as travel to and from training.",
                targetPageType: "theme2_insight_3",
              },
              {
                number: "4",
                eyebrow: "Theme Two, Insight Four",
                text: "Course delivery is often not tailored to suit those from regional, rural or remote locations.",
                targetPageType: "theme2_insight_4",
              },
            ],
          },
        ],
      },
      footnotes: themesSharedFn,
    },

    // 10. Theme 1 Insight 1
    {
      pageType: "theme1_insight_1",
      title:
        "Local council employers require a diverse range of skills to maintain the breadth of responsibilities undertaken by local councils.",
      slug: "theme1_insight_1",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "insight_detail",
        layoutVariant: "t1_i1",
        themeNumber: 1,
        insightNumber: 1,
        totalInTheme: 3,
        accentBorderColor: "#9CAA54",
        eyebrow: "Theme One, Insight One",
        themeTitle: "Local Government Specific Occupational Shortages",
        headline:
          "Local council employers require a diverse range of skills to maintain the breadth of responsibilities undertaken by local councils.",
        nextPageType: "theme1_insight_2",
        leftCard: {
          icon: "/images/frame-6.svg",
          title: "A diverse, multidisciplinary workforce",
          paragraph:
            "As a diverse workforce, local councils require access to a broad range of skills to deliver services. Similar to other employers, Local Government stakeholders noted that technological advancements, shifting community expectations and workforce pressures are changing the role of local councils, the nature of their service delivery and the skills their employees require.",
        },
        rightInsightCard: {
          icon: "/images/frame-7.svg",
          title: "Industry Insight",
          paragraph:
            "Responsibilities differ between states and territories as well as regional, rural, remote and metropolitan local councils. During consultations held for the Local Government Skills Audit and Uptake and Utility of the LGA Local Government Training Package, stakeholders described the following key services delivered by the industry-sector:",
          bullets: [
            "local infrastructure maintenance, utilities and asset management",
            "waste management",
            "ordinance enforcement",
            "community services and safety",
            "community planning, infrastructure and programs",
            "environmental health, parks and community recreation space management and tree management",
            "transport delivery and fleet management",
            "community services, such as childcare, aged care, cultural support services and NDIS programs",
          ],
        },
      },
      footnotes: [],
    },

    // 11. Theme 1 Insight 2
    {
      pageType: "theme1_insight_2",
      title:
        "Skills needs are changing due to workforce pressures, technological advancements and shifting community expectations.",
      slug: "theme1_insight_2",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "insight_detail",
        layoutVariant: "t1_i2",
        themeNumber: 1,
        insightNumber: 2,
        totalInTheme: 3,
        accentBorderColor: "#9CAA54",
        eyebrow: "Theme One, Insight Two",
        themeTitle: "Local Government Specific Occupational Shortages",
        headline:
          "Skills needs are changing due to workforce pressures, technological advancements and shifting community expectations.",
        prevPageType: "theme1_insight_1",
        nextPageType: "theme1_insight_3",
        leftCards: [
          {
            title: "Technological Advancement",
            paragraph:
              "Across the broader Australian labour market, technological advancement is changing the core skills required in certain occupations. Adopting new technologies requires rapid skilling/upskilling which may challenge traditional approaches to training,[[29]] particularly for local council employers that have previously expressed their challenges with access to TAFE and RTOs.[[30]]",
            footnoteNumbers: [29, 30],
          },
          {
            title: "Increased Regulator and Community Expectations",
            paragraph:
              "Stakeholders generally reported that community expectations of local council services have continued to increase. Some reported that increased access to technology and technological transformation has led to public expectations of local councils to provide 24/7 access to flexible, digital-first support which can be challenging for smaller or regional, rural and remote local councils to accommodate. Where community expectations cannot be met, stakeholders noted that rising reports of customer aggression toward frontline employees was driving investment in conflict resolution training, safety protocols and engagement strategies, reducing budgets for VET training investment. Waste services and aged care support (delivered by some local councils) are facing increasing complexity in their compliance and governance requirements. Legislative changes, including to the Aged Care Act 2024[[31]] and commitments to mandated Food Organics and Garden Organics (FOGO) recycling for households by 2030,[[32]] increase complexity for project officers, engineers and compliance employees in local councils.",
            footnoteNumbers: [31, 32],
          },
        ],
        rightInsightCards: [
          {
            icon: "/images/frame-7.svg",
            title: "Industry Insight",
            paragraph:
              "Fleet management, water operations and infrastructure services are facing significant technological transformation as automation and electrification are reshaping operational roles. Local councils are adopting smart meters, digital planning tools and AI-driven solutions. AI-enabled planning tools, automation in plant operations and heightened cybersecurity risks demand new technical competencies which will require significant upskilling. Roles once considered manual, such as trades and multi-skilled operators, now require digital literacy, remote operation skills and familiarity with advanced diagnostic tools.",
          },
          {
            icon: "/images/frame-7.svg",
            title: "Industry Insight",
            paragraph:
              "Local councils noted that there are challenges attracting employees skilled in navigating regulatory requirements and working in dynamic environments, making it difficult to anticipate and plan for training and skilling requirements.",
          },
        ],
      },
      footnotes: [
        {
          number: 29,
          sourceName: "Connecting for Impact – The Jobs and Skills Report 2025",
          text: "Jobs and Skills Australia (JSA), [*Connecting for Impact – The Jobs and Skills Report 2025*](https://www.jobsandskills.gov.au/news/connecting-impact-jobs-and-skills-report-2025), JSA, 2025, page 81, accessed 19 November 2025.",
          url: "https://www.jobsandskills.gov.au/news/connecting-impact-jobs-and-skills-report-2025",
          openInNewTab: true,
        },
        {
          number: 30,
          sourceName: "Local Government Workforce Insights Report 2025",
          text: `PSA, [*Local Government Workforce Insights Report 2025*](${lg2025Url}), PSA, 2025, page 14-15, accessed 11 February 2026.`,
          url: lg2025Url,
          openInNewTab: true,
        },
        {
          number: 31,
          sourceName: "About the new rights-based Aged Care Act",
          text: "Australian Government, Department of Health, Disability and Ageing, [*About the new rights-based Aged Care Act*](https://www.health.gov.au/our-work/aged-care-act/about?language=en), Australian Government, Department of Health, Disability and Ageing, 2025, accessed 11 February 2026.",
          url: "https://www.health.gov.au/our-work/aged-care-act/about?language=en",
          openInNewTab: true,
        },
        {
          number: 32,
          sourceName: "FOGO mandates and rollout",
          text: "New South Wales Environmental Protection Agency (NSW EPA), [*FOGO mandates and rollout*](https://www.epa.nsw.gov.au/Your-environment/Recycling-and-reuse/business-government-recycling/Food-organics-and-garden-organics/fogo-mandates-and-rollout), NSW EPA, 2025, accessed 11 February 2026.",
          url: "https://www.epa.nsw.gov.au/Your-environment/Recycling-and-reuse/business-government-recycling/Food-organics-and-garden-organics/fogo-mandates-and-rollout",
          openInNewTab: true,
        },
      ],
    },

    // 12. Theme 1 Insight 3
    {
      pageType: "theme1_insight_3",
      title:
        "While local council employers are experiencing some shortages in identified national shortage occupations, several Local Government specific shortages were also identified.",
      slug: "theme1_insight_3",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "insight_detail",
        layoutVariant: "t1_i3",
        themeNumber: 1,
        insightNumber: 3,
        totalInTheme: 3,
        accentBorderColor: "#9CAA54",
        eyebrow: "Theme One, Insight Three",
        themeTitle: "Local Government Specific Occupational Shortages",
        headline:
          "While local council employers are experiencing some shortages in identified national shortage occupations, several Local Government specific shortages were also identified.",
        prevPageType: "theme1_insight_2",
        leftCards: [
          {
            title: "Workforce pressures",
            paragraph:
              "Resourcing and recruitment were previously raised as challenging for local councils.[[33]] Key occupations continuing to be identified as in shortage include community service officers, tradespersons, managers, finance officers and project managers. Further, local councils are also struggling to secure specialists, particularly Information Technology (IT) and cyber security experts, arborists, environmental officers and town planners. These shortages are particularly pronounced in regional, rural and remote areas where they may be competing with private industry. These challenges are further compounded as local councils are also experiencing challenges with upskilling of their existing employees (particularly where expectations or technological skills have changed the core competencies of an occupation). Consultation conducted throughout the Local Government Skills Audit and Update and Utility of the LGA Local Government Training Package project, identified differences between recognised occupational shortages between states and territories and, in some cases, among regional, rural and remote communities. Comparisons with the Jobs and Skills Australia Skills Priority List (see data presented in the State and Territory Workforce Profile of this Report) indicate that while some specialist occupations – such as engineers, civil engineers, arborists, maternal health nurses and building surveyors – are in national shortage, other shortages may be more specific to the Local Government industry-sector.",
            footnoteNumbers: [33],
          },
          {
            title: "What is needed",
            paragraph:
              "Support to connect local council employers with VET providers who can deliver timely and appropriate skilling training courses to address Local Government-specific occupational shortages is needed to enable the sector to meet expanding and increasing service delivery requirements.",
          },
        ],
        shortagePanel: {
          title: "The jurisdictional Local Government-specific shortage list",
          intro:
            "Occupations which appear to be in shortage specific to the Local Government industry-sector in states and territories (when compared to National Occupation Shortage List) include:",
          states: [
            {
              name: "New South Wales",
              items: ["IT Officer/Cyber Specialist", "Planner", "Tradesperson"],
            },
            {
              name: "Northern Territory",
              items: [
                "Community Service Roles",
                "Managerial Roles",
                "Tradesperson",
                "Works Officer",
                "Community Program Coordinator",
              ],
            },
            {
              name: "Queensland",
              items: [
                "Town Planner",
                "Tradesperson",
                "Water Operations Officer",
                "IT Officer",
              ],
            },
            {
              name: "South Australia",
              items: [
                "Project Manager/Business Analyst",
                "Community Development Officer",
              ],
            },
            {
              name: "Tasmania",
              items: ["Plumbing Inspector"],
            },
            {
              name: "Victoria",
              items: ["Mechanic", "Planner", "Human Resources"],
            },
            {
              name: "Western Australia",
              fullWidthLg: true,
              items: [
                "Corporate Performance",
                "IT/Cyber/AI/ERP Specialist",
                "Environmental Officer",
                "Finance (rates) Officer",
                "Urban Planner",
              ],
            },
          ],
        },
      },
      footnotes: [
        {
          number: 33,
          sourceName: "Local Government Workforce Insights Report 2025",
          text: `PSA, [*Local Government Workforce Insights Report 2025*](${lg2025Url}), PSA, 2025, page 19, accessed 11 February 2026.`,
          url: lg2025Url,
          openInNewTab: true,
        },
      ],
    },

    // 13. Theme 2 Insight 1
    {
      pageType: "theme2_insight_1",
      title:
        "Access to TAFE or RTO in regional, rural and remote locations is limited.",
      slug: "theme2_insight_1",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "insight_detail",
        layoutVariant: "t2_i1",
        themeNumber: 2,
        insightNumber: 1,
        totalInTheme: 4,
        accentBorderColor: "#046D2A",
        eyebrow: "Theme Two, Insight One",
        themeTitle: "Access to VET Qualifications and Training Delivery Partners",
        headline:
          "Access to TAFE or RTO in regional, rural and remote locations is limited.",
        nextPageType: "theme2_insight_2",
        topLeftCard: {
          title: "Access to VET Training",
          paragraph:
            "The consultations for the 2024 Federal, State/Territory & Local Government Workforce Plan and the 2025 Local Government Workforce Insights Report, as well as the Local Government Skills Audit and Uptake and Utility of the LGA Local Government Training Package project, re-affirmed the challenges relating to access to qualifications and training delivery. These are further detailed below:",
        },
        topRightInsightCard: {
          icon: "/images/frame-7.svg",
          title: "Industry Insight",
          paragraph:
            "Stakeholders noted that closer engagement with government decision makers, TAFEs, RTOs and councils to consider solutions to challenges such as access to training, delivery options and costs may support local councils to build the technical capability they need for the future.",
        },
        bottomCards: [
          {
            title: "Limited local TAFEs or RTOs to support training delivery",
            paragraph:
              "Regional, rural and remote local councils face acute challenges in accessing suitable VET training. Further, some qualifications require supervision in the workplace as part of their delivery (e.g., mechanic apprenticeships), which is challenging for local councils. For example, some local councils reported having to contract external trainers to supervise apprentices or alternatively, employees having to travel significant distances for face-to-face instruction under supervision.",
          },
          {
            title:
              "Few TAFEs and RTOs are willing to travel to geographically isolated locations to deliver training:",
            paragraph:
              "Few RTOs are willing or able to deliver tailored, in-community training, especially for niche or highly contextual skills. Regional, rural and remote local councils stressed the need for more RTOs experienced in delivering training in community settings and to First Nations learners. Stakeholders also indicated that for First Nations learners, some training may not offer an appropriate level of cultural sensitivity or access to translated materials and interpreters.",
          },
        ],
      },
      footnotes: [],
    },

    // 14. Theme 2 Insight 2
    {
      pageType: "theme2_insight_2",
      title:
        "Few TAFEs and RTOs are willing to travel to geographically isolated locations to deliver required qualifications.",
      slug: "theme2_insight_2",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "insight_detail",
        layoutVariant: "t2_i2",
        themeNumber: 2,
        insightNumber: 2,
        totalInTheme: 4,
        accentBorderColor: "#046D2A",
        eyebrow: "Theme Two, Insight Two",
        themeTitle: "Access to VET Qualifications and Training Delivery Partners",
        headline:
          "Few TAFEs and RTOs are willing to travel to geographically isolated locations to deliver required qualifications.",
        prevPageType: "theme2_insight_1",
        nextPageType: "theme2_insight_3",
        leftCard: {
          title:
            "Few TAFEs and RTOs are willing to travel to geographically isolated locations to deliver training:",
          paragraph:
            "Few RTOs are willing or able to deliver tailored, in-community training, especially for niche or highly contextual skills. Regional, rural and remote local councils stressed the need for more RTOs experienced in delivering training in community settings and to First Nations learners. Stakeholders also indicated that for First Nations learners, some training may not offer an appropriate level of cultural sensitivity or access to translated materials and interpreters.",
        },
        rightInsightCard: {
          icon: "/images/frame-7.svg",
          title: "Industry Insight",
          paragraph:
            "Stakeholders noted that closer engagement with government decision makers, TAFEs, RTOs and councils to consider solutions to challenges such as access to training, delivery options and costs may support local councils to build the technical capability they need for the future.",
        },
      },
      footnotes: [],
    },

    // 15. Theme 2 Insight 3
    {
      pageType: "theme2_insight_3",
      title:
        "Local councils have limited training budgets to support financial impost of course enrolment as well as travel to and from training",
      slug: "theme2_insight_3",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "insight_detail",
        layoutVariant: "t2_i3",
        themeNumber: 2,
        insightNumber: 3,
        totalInTheme: 4,
        accentBorderColor: "#046D2A",
        eyebrow: "Theme Two, Insight Three",
        themeTitle: "Access to VET Qualifications and Training Delivery Partners",
        headline:
          "Local councils have limited training budgets to support financial impost of course enrolment as well as travel to and from training",
        prevPageType: "theme2_insight_2",
        nextPageType: "theme2_insight_4",
        leftCard: {
          title:
            "Limited training budgets to support course enrolment and travel to access training:",
          paragraph:
            "Several VET programs require travel to urban centres, which is costly and disruptive, especially for remote employees and their families. For example, on Tiwi Islands, it is culturally appropriate for families to travel together, increasing costs. Local councils reported spending more on travel than on actual training. In addition, for accessing full qualifications, some noted high costs and limited access to accredited training. For example, one local council body reported spending approximately $40,000 for water operator training for six participants.",
        },
        rightInsightCard: {
          icon: "/images/frame-7.svg",
          title: "Industry Insight",
          paragraph:
            "Stakeholders noted that closer engagement with government decision makers, TAFEs, RTOs and councils to consider solutions to challenges such as access to training, delivery options and costs may support local councils to build the technical capability they need for the future.",
        },
      },
      footnotes: [],
    },

    // 16. Theme 2 Insight 4
    {
      pageType: "theme2_insight_4",
      title:
        "Course delivery is often not tailored to suit those from regional, rural or remote locations",
      slug: "theme2_insight_4",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "insight_detail",
        layoutVariant: "t2_i4",
        themeNumber: 2,
        insightNumber: 4,
        totalInTheme: 4,
        accentBorderColor: "#046D2A",
        eyebrow: "Theme Two, Insight Four",
        themeTitle: "Access to VET Qualifications and Training Delivery Partners",
        headline:
          "Course delivery is often not tailored to suit those from regional, rural or remote locations",
        prevPageType: "theme2_insight_3",
        nextSectionCta: {
          label: "Next: Workforce Strategies",
          pageType: "workforce_strategies",
        },
        leftCard: {
          title: "Non-Tailored delivery options:",
          paragraph:
            "Local councils consistently reported that self-paced online learning, which may be offered by both TAFEs and RTOs, is ineffective for practical, hands-on roles, such as horticulture or construction. Blended or face-to-face approaches are preferred, but high qualification costs and travel expenses often result in employees seeking and selecting non-accredited options outside VET. In addition, delivery models are not always suitable for all, particularly for those with low English language, literacy, numeracy and/or digital (LLND) skills. As local council employers aim to maintain a diverse workforce, stakeholders noted challenges with VET training delivery. For example, some Northern Territory stakeholders highlighted that several First Nations employees speak English as a third or fourth language and find the standard of English used in VET courses a significant barrier to participation. The level of evidence that RTOs are required to collect to certify competency was considered restrictive for learners with limited literacy. One stakeholder recounted a VET unit requiring a learner to rewrite an example report 17 times, which was seen as unnecessary and intimidating and had deterred other employees from undertaking training. Local council employees reported a desire to see the level of language reviewed to make courses more accessible, as well as exploring different delivery options that accommodate people from non-English speaking backgrounds.",
        },
        rightSection: {
          heading:
            "Contextualisation of Qualifications to Local Government Service Delivery",
          listIntro:
            "Stakeholders expressed concern with the ability of qualifications to be contextualised to accommodate the unique operating environments of local councils. Some indicated a preference for training that:",
          bullets: [
            "Includes cultural, geographic and operational contexts of working in regional, rural and remote, and First Nations communities, with case studies drawn from real-world experiences",
            "Accurately reflects the realities of local council work and aligned with operational priorities",
            "Reflects jurisdiction-specific requirements, particularly for modules covering regulations and local laws, which may differ across LGAs",
          ],
          insightCard: {
            icon: "/images/frame-7.svg",
            title: "Industry Insight",
            paragraph:
              "Stakeholders from New South Wales noted challenges with delivery of some civil qualifications which were deemed not sufficiently flexible and included modules that did not align with operational needs. Stakeholders indicated a preference for tailored electives that directly address workforce requirements and ensure modules are specific to LGA contexts, since regulatory demands differ across regions.",
          },
          closingParagraph:
            "While some stakeholders expressed interest in an expansion of the LGA Local Government Training Package to host contextualised qualifications, challenges with qualification duplication could emerge. Bringing together state and territory decision makers, State and Territory Training Authorities/Senior Responsible Officers (STTA/SRO), Local Government partner TAFEs and RTOs to discuss solutions to training access, delivery styles, financial implications and contextualisation of learning materials, may support more sustainable and targeted training outcomes for Local Government industry-sector occupational shortages.",
        },
      },
      footnotes: [],
    },

    // 17. 2026 Proposed Workforce Strategies
    {
      pageType: "workforce_strategies",
      title: "2026 Proposed Strategies",
      slug: "workforce_strategies",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "workforce_strategies",
        eyebrow: "THE CULMINATION OF THIS REPORT",
        titleLine1: "2026 Proposed Local Government",
        titleLine2: "Workforce Strategies",
        intro:
          "Public Skills Australia proposes the following strategies aligned to the workforce insights identified to support the Local Government industry-sector. Select a strategy to explore its detail.",
        heroImage: "/images/hero-graphic-2026.png",
        prevCta: { label: "Back to Workforce Insights", pageType: "workforce_insights" },
        nextCta: {
          label: "Next Section: Update on 2025 Strategies",
          pageType: "update_2025_strategies",
        },
        strategies: [
          {
            badge: "STRATEGY 1",
            borderColor: "#9CAA54",
            ...strategyOne,
          },
          {
            badge: "STRATEGY 2",
            borderColor: "#046D2A",
            ...strategyTwo,
          },
        ],
      },
      footnotes: [],
    },

    // 18. Update on 2025 Strategies
    {
      pageType: "update_2025_strategies",
      title: "Update on 2025 Strategies",
      slug: "update_2025_strategies",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "update_2025_strategies",
        title: "Workforce Insights: Update on 2025 Strategies",
        intro:
          "Public Skills Australia's 2025 Local Government Workforce Insights Report identified three challenges that are currently impacting Local Government workforces:",
        prevCta: {
          label: "Back to 2026 Proposed Workforce Strategies",
          pageType: "workforce_strategies",
        },
        nextCta: {
          label: "Next Section: Existing Industry-Sector Strategies",
          pageType: "existing_strategies",
        },
        challengeCards: [
          {
            icon: "/images/frame-teacher.svg",
            title: "Access to Training",
            text: "Accessing training is a key challenge for local councils, particularly in regional, rural and remote LGAs.",
          },
          {
            icon: "/images/frame-briefcase.svg",
            title: "Skills Gaps",
            text: "The local councils are experiencing significant occupational shortages in job roles that have long training pathways, or occupations that are emerging, such as emergency management.",
          },
          {
            icon: "/images/frame-search.svg",
            title: "Resourcing and Recruitment",
            text: "Recruitment is a continuous challenge for local councils, particularly due to resourcing limitations such as access to housing and infrastructure.",
          },
        ],
        closingIntro:
          "To support the Local Government industry-sector with these challenges, Public Skills Australia commenced two projects in 2025. These projects provide deeper insights into how these challenges arose, what the key indicators of these challenges are and recommended tools for mitigating these challenges.",
        projects: [
          {
            badge: "PROJECT 1 - 2025",
            borderColor: "#9CAA54",
            title:
              "Local Government Skills Audit and Review of Uptake and Utility of the LGA Local Government Training Package",
            introParagraphs: [
              "The aim of the Local Government Skills Audit and Review of Uptake and Utility of the LGA Local Government Training Package (this Project) is to reach as many local councils, in as many LGAs as possible, to gain a thorough understanding of the occupational, skills and training challenges within the Local Government industry-sector. This work provided Public Skills Australia with insight into the current occupations employed, and skills needed in local councils, and therefore where the occupational shortages and skills gaps are. This Project also provides an understanding of the emerging skills and occupational needs in the Local Government workforce by categorising these needs based on regional, rural remote, and metropolitan LGAs.",
              "Public Skills Australia concluded the qualitative research phase of this Project, engaging with 137 councils across Australia from every state and the Northern Territory. A Local Government Workforce Skills and Capability Survey was deployed in collaboration with the Australian Local Government Association, which had 210 respondents. This Survey provided longitudinal data for the Local Government industry-sector, following on from its deployment in 2018 and 2022. The project will continue in 2026 by reviewing the current qualifications and units of competency in the LGA Local Government Training Package. It will also review, where appropriate, content from other relevant training packages to identify whether this content can assist in addressing identified shortages.",
              "This Project continues to support several other priorities for Public Skills Australia, including:",
            ],
            ministerialPriority:
              "This Project will contribute to building a shared, evidence-based view of the workforce challenges and opportunities, improving the sustainability of the Local Government workforce and progressing the priority reforms under the Closing the Gap National Agreement, by leveraging insights from First Nations local councils.",
            strategicPlan:
              "Support the Local Government industry-sector through working toward reviewing, developing and implementing high-quality training products.",
            driversIntro:
              "Resilience of local councils to respond to strategic shocks and drivers of change, particularly:",
            driversBullets: [
              "expansion of core duties",
              "recruitment and retention",
              "competition for labour",
            ],
            nextSteps:
              "Publication of the qualitative research from this Project, as well as the National Local Government Workforce Skills and Capability Survey results, will be made available to the public in mid-2026. Public Skills Australia is undertaking analysis of these findings to provide appropriate recommendations back to the industry-sector, including further insights into the uptake and utility of the LGA Local Government Training Package. This will provide findings on refinement to the VET Training Package, ensuring its effectiveness in addressing identified occupational shortages, skills gaps and training needs. It will also inform what further research can be undertaken to meet the needs of the Local Government workforce.",
            ctaLabel: "View Local Government Skills Audit project",
            ctaPageType: "industry_overview",
          },
          {
            badge: "PROJECT 2 - 2025",
            borderColor: "#046D2A",
            title: "Local Government Emergency Management Skills",
            introParagraphs: [
              "The aim of the Local Government Emergency Management Skills Project (Skills Project) is to address urgent skilling and upskilling needs of the Local Government industry-sector. The 2025 Local Government Workforce Insights Report identified emerging occupational shortages and skills gaps which are impacting the service delivery of councils to their communities, particularly in areas such as emergency management and disaster recovery. This Report found that drivers of change such as climate change, are impacting the skills and training needs of Local Government workforces through the acceleration and increased frequency of emergency events and natural disasters.",
              "The Skills Project will refer to the findings of the Local Government Skills Audit and Uptake and Utility of the LGA Local Government Training Package, to identify opportunities to bolster the offerings in VET for occupations such as emergency management. The Skills Project will also identify where skill sets may be used from other Training Packages, or where the creation of new skill sets may be required.",
              "The Skills Project continues to support several broad priorities for Public Skills Australia:",
            ],
            ministerialPriority:
              "The Skills Project will contribute to embedding of Qualifications Reform principles, strengthening capabilities of the Public Safety and Government workforces, in preparing for and responding to emergency events and the sustainability of the Local Government workforce into the future.",
            strategicPlan:
              "Support the Local Government industry-sector through working toward reviewing, developing and implementing high-quality training products.",
            driversIntro:
              "Resilience of local councils to respond to strategic shocks and drivers of change, particularly:",
            driversBullets: [
              "expansion of core duties",
              "recruitment and retention",
              "competition for labour",
              "technological development",
              "climate change",
            ],
            nextSteps:
              "Public Skills Australia is currently engaging with stakeholders in the Local Government industry-sector, to confirm the priority areas for skilling, and identify other potential occupational focus areas beyond emergency management for the Skills Project to work toward. Initial research and findings of the Skills Project will be used to assess whether an Activity Project Submission will be developed for May 2026.",
            ctaLabel: "View Emergency Management Skills project",
            ctaPageType: "industry_overview",
          },
        ],
      },
      footnotes: [],
    },

    // 19. Existing Industry-Sector Strategies
    {
      pageType: "existing_strategies",
      title: "Existing Industry-Sector Strategies",
      slug: "existing_strategies",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "existing_strategies",
        title: "Existing Industry-Sector Strategies",
        intro:
          "Public Skills Australia's work is informed and guided by the existing Industry-Sector Strategies detailed below. Select any strategy on the left — its detail opens immediately beside the list.",
        heroImage: "/images/hero-graphic-existing.png",
        prevCta: {
          label: "Back to Update on 2025 Strategies",
          pageType: "update_2025_strategies",
        },
        nextCta: {
          label: "Next Section: Federal Government Initiatives",
          pageType: "federal_initiatives",
        },
        strategies: [
          {
            id: 1,
            code: "01-NATIONAL SURVEY",
            title: "2026 Local Government Workforce Skills and Capability Survey",
            subtitle:
              "Australian Local Government Association (ALGA) · Anticipated mid-2026",
            description:
              "ALGA has run the *Local Government Workforce Skills and Capabilities Survey* since 2018. For the 2026 survey, Public Skills Australia collaborated with ALGA to include new questions on local council skills, occupations, and training needs. The 2026 survey received 210 responses from across Australia. The results of this survey will be integrated into national and state/territory reports in 2026 through Public Skills Australia's delivery of the *Local Government Skills Audit and Review of Uptake and Utility of the LGA Local Government Training Package* project.",
            impactItems: [
              {
                title: "Consultation and engagement",
                description:
                  "Over 200 local councils responded to the survey. The rich data and contributions provided by these local councils informed detailed consultation with Local Government industry-sector stakeholders particularly through engagement with the research process and findings.",
              },
              {
                title: "2025 Workforce Strategies",
                description:
                  "Collaborating with ALGA on this survey bolstered the *Local Government Skills Audit and Review of Uptake and Utility of the LGA Local Government Training Package* project by providing an evidence base. This survey provided detailed insights and data, particularly for jurisdictional-specific occupational shortages and current training needs.",
              },
              {
                title: "2026 Workforce Strategies",
                description:
                  "This survey will positively impact the *Mapping of Local Government occupational shortages to relevant VET training products* and *Facilitate a roundtable on whole of VET system responses to Local Government challenges* strategies, by providing up-to-date data and analysis.",
              },
            ],
          },
          {
            id: 2,
            code: "02-PARLIAMENTARY INQUIRY",
            title: "Parliamentary Inquiry into Local Government Sustainability",
            subtitle:
              "Standing Committee on Regional Development, Infrastructure and Transport · Lapsed",
            description:
              "The Parliamentary Inquiry into Local Government Sustainability, conducted by a House of Representatives Committee, is examining the sustainability of the Local Government industry-sector. Through submissions and hearings, it has gathered insights from Local Government stakeholders on key challenges. This includes ongoing issues relating to financial sustainability and funding, increasing infrastructure and service delivery obligations, structural barriers that affect local council employees and the services they provide, and workforce trends, particularly in attracting and retaining skilled employees, and the impacts of labourhire practices. The inquiry received 287 submissions, held 16 public hearings and examined the sustainability of service delivery in the Local Government industry-sector, with emphasis on the constant expansion of roles and responsibilities that local councils perform.",
            impactItems: [
              {
                title: "Consultation and engagement",
                description:
                  "This inquiry has provided greater context and focus on the future of the Local Government industry-sector. Public Skills Australia's consultations and engagements have benefited from the interim report findings, which align to the challenges from the ongoing expansion of roles and responsibilities of local councils across Australia.",
              },
              {
                title: "2025 Workforce Strategies",
                description:
                  "The *Local Government Skills Audit and uptake and utility of the LGA Local Government Training Package* highlighted similar findings to this inquiry which contribute to ongoing skills challenges for the Local Government workforce, such as the expansion of core duties, increased service delivery needs and structural barriers to employment.",
              },
              {
                title: "2026 Workforce Strategies",
                description:
                  "The inquiry will inform Public Skills Australia's research on the *Facilitate a roundtable on whole of VET system responses to Local Government challenges* strategy by identifying potential systemic responses to the current and emerging challenges local councils are experiencing.",
              },
            ],
          },
          {
            id: 3,
            code: "03-PARLIAMENTARY INQUIRY",
            title:
              "Parliamentary Inquiry into Local Government Funding and Fiscal Sustainability",
            subtitle:
              "Standing Committee on Regional Development, Infrastructure and Transport · Ongoing",
            description:
              "The Inquiry is being undertaken by referral from the Minister of Emergency Management; Minister for Regional Development Local Government and Territories, to examine how current funding arrangements affect the ability of local councils to deliver services and invest in infrastructure. This Inquiry notes the evidence provided in the previous *Parliamentary Inquiry into Local Government Sustainability*, which will be considered in this inquiry as per the terms of reference. This Inquiry seeks submissions that provide further information into this issue. Submissions have been closed at time of publishing this Report.",
            impactItems: [
              {
                title: "Consultation and engagement",
                description:
                  "This Inquiry informed and aligned to recurring themes in Public Skills Australia's ongoing consultation with stakeholders. Stakeholders consistently identified challenges with sustainability in the Local Government industry-sector.",
              },
              {
                title: "2025 Workforce Strategies",
                description:
                  "Expanding roles and responsibilities is a consistent theme identified in Public Skills Australia's research and this Inquiry provides context about funding and fiscal elements of workforce skills shortages across the Local Government industry-sector. This was highlighted in the *Local Government Skills Audit and uptake and utility of the LGA Local Government Training Package*, noting the obligations local councils have to their communities.",
              },
              {
                title: "2026 Workforce Strategies",
                description:
                  "The Inquiry will inform the research into the *Facilitate a roundtable on whole of VET system responses to Local Government challenges* proposed strategy, that will seek to resolve resourcing and cost based challenges when accessing accredited VET training.",
              },
            ],
          },
          {
            id: 4,
            code: "04-NATIONAL",
            title: "National Housing Accord 2024 - 2029",
            subtitle: "The Australian Government · Ongoing",
            description:
              "The federal and state/territory governments have all agreed to deliver 1.2 million homes over five years commencing in mid-2024, as part of a broader housing agenda supporting social housing, renters and homebuyers. National Cabinet has endorsed $3.5 billion in federal funding to assist state/territory governments and local councils in delivering the National Housing Accord 2024-2029 (The Accord).",
            impactItems: [
              {
                title: "Consultation and engagement",
                description:
                  "Access to housing continues to be a key challenge for Local Government Workforces, particularly in attraction and retention in regional, rural and remote LGAs. The Accord will continue to be monitored to assess impact to the Local Government workforces.",
              },
              {
                title: "2025 Workforce Strategies",
                description:
                  "The Accord provided valuable context for understanding how housing supply impacts skills and occupational shortages across diverse regional, rural and remote contexts as part Public Skills Australia's scoping research for the *Local Government Skills Audit and review of the uptake and utility of the LGA Local Government Training Package*.",
              },
              {
                title: "2026 Workforce Strategies",
                description:
                  "Public Skills Australia will continue to monitor the progress of the Accord and factor this progress into the *Facilitate a roundtable on whole of VET system responses to Local Government challenges*. Whilst housing is not directly in the remit of Jobs and Skills Councils, challenges facing regional, rural and remote Local Government workforces such as attraction and retention, as well as access to training, may be impacted by this strategy.",
              },
            ],
          },
          {
            id: 5,
            code: "05-QUEENSLAND",
            title: "Queensland Local Government Workforce Strategy 2024 - 2028",
            subtitle: "Local Government Association Queensland · 2024 - 2028",
            description:
              "The *LGAQ Workforce Strategy 2024-2028* (The Strategy) provides a succinct plan for developing and strengthening the Local Government industry-sector in Queensland and its workforce. It sets out objectives, strategies and measures, and identifies risks and opportunities. Key themes centre around support for the work conducted, building a capable workforce and ensuring a safe working environment.",
            impactItems: [
              {
                title: "Consultation and engagement",
                description:
                  "This strategy informed engagement with Queensland Local Government stakeholders and provided insights specific to Queensland's Local Government workforce.",
              },
              {
                title: "2025 Workforce Strategies",
                description:
                  "Queensland-specific objectives and strategies were considered throughout the process of research for the *Local Government Skills Audit and review of the uptake and utility of the LGA Local Government Training Package* and will inform the jurisdictional report for Queensland, published as part of this work.",
              },
              {
                title: "2026 Workforce Strategies",
                description:
                  "Jurisdictional context is important for the *Facilitate a roundtable on whole of VET system responses to Local Government challenges*. Connecting the LGAQ's Workforce Strategy to the broader influential organisations, including RTOs, TAFEs, STTAs/SROs may provide greater opportunity for Queensland local councils to overcome their access to training challenges.",
              },
            ],
          },
          {
            id: 6,
            code: "06-SOUTH AUSTRALIA",
            title:
              "Workforce and Gender Equality in South Australian Local Government",
            subtitle: "Local Government Professionals South Australia · 2025",
            description:
              "The *Workforce Gender and Equality in South Australian Local Government Report* (This Report), provides an in-depth overview of the current gender equity landscape in South Australia, and more specifically in its local councils. The Report highlights an almost equal gender balance in South Australia's Local Government workforce but acknowledges that there are still disparities. This Report goes further to highlight gender pay gap issues, segregation by workforce streams (e.g. women making up more part-time, casual and short-term contract roles) and that the length of service is generally longer for males.",
            impactItems: [
              {
                title: "Consultation and engagement",
                description:
                  "This Report provided specific jurisdictional information for the Local Government industry-sector in South Australia on a key priority area. It provides valuable context in engagements with stakeholders addressing diversity and inclusion challenges.",
              },
              {
                title: "2025 Workforce Strategies",
                description:
                  "The *Local Government Skills Audit and review of the uptake and utility of the LGA Local Government Training Package* addressed challenges with workplace gender equality identified in this Report, through the National Survey and workshops undertaken for this project.",
              },
              {
                title: "2026 Workforce Strategies",
                description:
                  "Addressing themes of diversity and inclusion, in this case, gender equality, are leading themes for the *Facilitate a roundtable on whole of VET system responses to Local Government challenges*. This Report will inform Public Skills Australia's broader understanding of gender parity and different gendered workforce experiences in Local Government, and the challenges and opportunities these present.",
              },
            ],
          },
          {
            id: 7,
            code: "07-WESTERN AUSTRALIA",
            title:
              "2023 Local Government Workforce Shortages Survey in Western Australia",
            subtitle: "Local Government Professionals Western Australia · 2023",
            description:
              "The *2023 Local Government Workforce Shortage Survey in Western Australia* (This Survey) found significant recruitment and retention challenges, driven by persistent skills shortages, geographic constraints and strong competition from other industries. It also highlighted the growing role of social media in recruitment and upskilling and recommended more targeted, flexible training to strengthen the workforce and support effective service delivery.",
            impactItems: [
              {
                title: "Consultation and engagement",
                description:
                  "This survey informed engagement with Western Australian Local Government Stakeholders, supporting Public Skills Australia to understand jurisdictional-specific skills and training challenges.",
              },
              {
                title: "2025 Workforce Strategies",
                description:
                  "This survey was valuable in identifying the key aspects in Public Skills Australia's development of industry-sector-wide surveys for the *Local Government Skills Audit and uptake and utility of the LGA Local Government Training Package*. This survey provided context in Public Skills Australia's engagement with Western Australian stakeholders for this project and is a reference point of comparison as the jurisdictional report for Western Australia it publishes.",
              },
              {
                title: "2026 Workforce Strategies",
                description:
                  "Findings from this survey will provide specific data for Western Australian local councils and will be informative in the project to *Map Local Government occupational shortages to relevant VET training product*, to identify opportunities for Local Government in Western Australia.",
              },
            ],
          },
          {
            id: 8,
            code: "08-NATIONAL",
            title: "Careers at Council",
            owners: [
              "Local Government NSW",
              "Local Government Association of South Australia",
              "Municipal Association of Victoria",
              "Local Government Association Tasmania",
              "Western Australian Local Government Association",
              "Local Government Association Queensland",
              "Local Government Association of the Northern Territory",
            ],
            status: "Ongoing",
            description:
              "The *Careers at Council Hub* (The Hub) is an online database that showcases the career areas and occupations employed by local councils, and what potential employees can expect from having a career in the Local Government industry-sector. It is informed and run by seven Local Government Associations and the Australian Local Government Association. Potential employees can also search for current job opportunities and register to be informed of opportunities.",
            impactItems: [
              {
                title: "Consultation and engagement",
                description:
                  "The Hub has informed consultation as several Local Government stakeholders have referred to insights and information garnered through this recruitment initiative. These insights have provided specific understanding for how local councils organise their workforces.",
              },
              {
                title: "2025 Workforce Strategies",
                description:
                  "The Hub informed the *Local Government Skills Audit and uptake and utility of the LGA Local Government Training Package*, to understand the breadth of occupations currently employed in the Local Government industry-sector.",
              },
              {
                title: "2026 Workforce Strategies",
                description:
                  "The categories of occupations provided by the Hub will inform research for the project to *Map Local Government occupational shortages to relevant VET training products* project, by providing a list of occupations employed by local councils nationally. This will then be mapped against the LGA Local Government Training Package to identify greater training pathways and opportunities for occupations that are currently in shortage across the Local Government industry-sector.",
              },
            ],
          },
          {
            id: 9,
            code: "09-VICTORIA",
            title: "Earn and Learn Program",
            subtitle:
              "RMIT, Swinburne, Victoria University and Federation University · 2024 - ongoing",
            description:
              "The *Earn and Learn Program* (This Program) is designed to address skills shortages that are critical to Australia's future economic prosperity. It is a nationally recognised work-based-learning qualification to be delivered in collaboration with industry. Students will earn a wage while completing their degree and be partially sponsored through the employer and learn skills of the job-role at the same time. For the Local Government industry-sector, it is an opportunity to fill critical skills shortages by creating pathways into occupations in collaboration with higher-education institutions.",
            impactItems: [
              {
                title: "Consultation and engagement",
                description:
                  "This program has informed engagement with Local Government stakeholders, particularly when discussing apprenticeship and traineeship opportunities in Local Government workforces, and how this program may provide an opportunity for the Local Government industry-sector.",
              },
              {
                title: "2025 Workforce Strategies",
                description:
                  "The *Local Government Skills Audit and uptake and utility of the LGA Local Government Training Package* was informed by this program, by providing findings on the industry-sector's demand for these types of training programs.",
              },
              {
                title: "2026 Workforce Strategies",
                description:
                  "The *Mapping of Local Government occupational shortages to relevant VET training products* project, will be informed by this program to understand the current training landscape in VET, and in higher education institutions.",
              },
            ],
          },
          {
            id: 10,
            code: "10-NEW SOUTH WALES",
            title: "Fresh Start Program",
            subtitle: "NSW Office of Local Government · 2025 - 2031",
            description:
              "The New South Wales Government aims to increase the Local Government workforce through the employment of apprentices for a period of six years, starting January 2026, through the *Fresh Start Program* (This Program). Through a grant program with councils, the NSW Government will provide local councils with funding for wages and ongoing costs of employment. This aims to increase the capacity of the NSW Local Government workforce, generate local knowledge, training and employment opportunities, and contribute to the National Agreement on Closing the Gap.",
            impactItems: [
              {
                title: "Consultation and engagement",
                description:
                  "This program provided context on current workforce needs for NSW local councils, and potential challenge mitigation opportunities through further training and employment opportunities in collaboration with other levels of Government.",
              },
              {
                title: "2025 Workforce Strategies",
                description:
                  "This program informed the *Local Government Skills Audit and uptake and utility of the LGA Local Government Training Package*, by providing specific jurisdictional data for NSW. This program also contributed to a broader understanding around different and novel approaches to training attraction and promotion.",
              },
              {
                title: "2026 Workforce Strategies",
                description:
                  "This program will inform the *Mapping of Local Government Occupational Shortages to relevant VET training products* by providing comparative data and the opportunity for knowledge sharing among other states and territories.",
              },
            ],
          },
          {
            id: 11,
            code: "11-NORTHERN TERRITORY",
            title:
              "Local Government Association of the Northern Territory Strategic Plan",
            subtitle:
              "Local Government Association of the Northern Territory · 2025 - 2028",
            description:
              "The *Local Government Association of the Northern Territory Strategic Plan* (This Plan) outlines LGANT's purpose, vision, values and focus areas. The main priorities to support the Local Government workforces in the Northern Territory include advocacy, development, engagement and performance. Included in these areas of support include strategies to connect workforces to further training and technical expertise and facilitate strong engagement to understand ongoing operational needs of local councils and their workforces.",
            impactItems: [
              {
                title: "Consultation and engagement",
                description:
                  "This Plan provided context when engaging with stakeholders in the Northern Territory, informing current challenges faced by their Local Government Workforces, and future initiatives being conducted to mitigate these challenges.",
              },
              {
                title: "2025 Workforce Strategies",
                description:
                  "This Plan informed the development phase of the *Local Government Skills Audit and uptake and utility of the Local Government Training Package* by providing specific jurisdictional data and workforce challenges.",
              },
              {
                title: "2026 Workforce Strategies",
                description:
                  "This Plan will provide insights specific to the Northern Territory for the *Facilitate a roundtable on whole of VET system responses to Local Government challenges*. This will ensure engagement with stakeholders for this *Project* are robust and sensitive to specific opportunities and challenges in the Northern Territory. This Plan will be important for key stakeholders to connect to as part of this strategy, to ensure that any whole-of-system response meets the needs and goals of LGANT and the local councils.",
              },
            ],
          },
          {
            id: 12,
            code: "12-TASMANIA",
            title: "Local Government Association of Tasmania Strategic Plan",
            subtitle: "Local Government Association Tasmania · 2025 - 2030",
            description:
              "The *Local Government Association of Tasmania's Strategic Plan* (This Plan) highlights key outcomes for the mitigation of local council challenges for this cycle of planning until 2030. This will be achieved through advocacy, leadership, support and representation of Tasmania's local councils. This Plan includes outcomes specific to the skills and training needs of the workforces to ensure the needs to Tasmanian communities are being met.",
            impactItems: [
              {
                title: "Consultation and engagement",
                description:
                  "This *Plan* provided valuable context for stakeholder engagement in Tasmania, outlining current workforce challenges and the initiatives being developed to address them.",
              },
              {
                title: "2025 Workforce Strategies",
                description:
                  "This *Plan* informed the development of the *Local Government Skills Audit and uptake and utility of the Local Government Training Package* by bolstering the specific state-based data for Tasmania. This was valuable in identifying specific workforce planning challenges and opportunities addressed in the audit.",
              },
              {
                title: "2026 Workforce Strategies",
                description:
                  "This *Plan* will provide insights specific to Tasmania in the *Facilitate a roundtable on whole of VET system responses to Local Government challenges*. This will inform Public Skills Australia's consultation on the roundtable, by informing discussions of workforce planning opportunities and challenges in the Tasmanian context and ensuring that any whole-of-system response meets the needs and goals of LGAT and the local councils.",
              },
            ],
          },
        ],
      },
      footnotes: [],
    },

    // 20. Federal Government Initiatives
    {
      pageType: "federal_initiatives",
      title: "Federal Government Initiatives",
      slug: "federal_initiatives",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "federal_initiatives",
        title: "Federal Government Initiatives",
        intro:
          "Public Skills Australia's work is informed and guided by the Federal Government Initiatives detailed below. Select any initiative on the left — its detail opens immediately beside the list.",
        heroImage: "/images/hero-graphic-federal.png",
        prevCta: {
          label: "Back to Existing Industry-Sector Strategies",
          pageType: "existing_strategies",
        },
        nextCta: {
          label: "Next Section: 2027 and Beyond",
          pageType: "looking_forward",
        },
        initiatives: federalInitiatives,
      },
      footnotes: [],
    },

    // 21. Looking Forward
    {
      pageType: "looking_forward",
      title: "Looking Forward",
      slug: "looking_forward",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "looking_forward",
        eyebrow: "LOOKING FORWARD",
        title: "2027 and Beyond",
        heroImage: "/images/hero-graphic-looking-forward.png",
        prevCta: { label: "Back to Executive Summary", pageType: "executive_summary" },
        introParagraphs: [
          "Public Skills Australia has built on the 2024 Workforce Plans and the 2025 Local Government Workforce Insights Reports to deliver the 2026 Local Government Workforce Insights Report. These reports continue to be the strategic centrepiece guiding annual Business Plans for Public Skills Australia, alongside Ministerial, industry-sector and other priorities (e.g. Royal Commissions and Inquiries).",
          "The 2027 **Workforce Insights Reports** will firstly focus on broader priorities detailed below and may be delivered throughout 2026/27:",
        ],
        cards: [
          {
            icon: "/images/inquiry-1.svg",
            borderColor: "#9CAA54",
            eyebrow: "LINE OF INQUIRY 1",
            title:
              "Inclusion and participation of First Nations people, women and other genders in the Public Safety and Government workforces.",
          },
          {
            icon: "/images/inquiry-2.svg",
            borderColor: "#9CAA54",
            eyebrow: "LINE OF INQUIRY 2",
            title:
              "The use of AI and digital transformation and the impact of these technologies on the Public Safety and Government workforces.",
          },
          {
            icon: "/images/inquiry-continuing.svg",
            borderColor: "#046D2A",
            eyebrow: "CONTINUING",
            title:
              "Additionally, the 2027 Workforce Insights Reports will focus on any other emerging priorities impacting the Local Government industry-sector.",
            description:
              "The Local Government Skills Audit will continue to provide a holistic national picture of the Local Government workforce. Outcomes of this project will likely highlight key priority areas for further examination and consideration in future reports.",
          },
        ],
        summaryBoxText:
          "Beyond these focused lines of inquiry, the 2027 **Workforce Insights Reports** will seek to examine the impact of the Drivers of Change identified in this year's reports on our industry-sector workforces.",
      },
      footnotes: [],
    },

    // 22. Downloads & References
    {
      pageType: "downloads",
      title: "Downloads & References",
      slug: "downloads",
      sortOrder: sort++,
      isVisible: true,
      paletteMode: "SECTOR",
      subSectorCode: null,
      layoutVariant: "standard",
      content: {
        renderMode: "lg_static_template",
        lgTemplate: "downloads",
        eyebrow: "Download PDF",
        title: "Local Government Workforce Insights Reports PDFs",
        heroImage: "/images/hero-graphic-downloads.png",
        prevCta: { label: "Back to Introduction", pageType: "introduction" },
        fullReport: {
          badge: "FULL REPORT",
          icon: "/images/downloads-full-report-icon.png",
          title: "2026 Local Government Workforce Insights Report",
          description:
            "Includes Appendix A: participants in the Local Government Skills Audit — the full list of participating councils by state.",
          buttonLabel: "Open 2026 PDF",
          url: pdfUrl,
        },
        previousHeading: "PREVIOUS REPORTS",
        previousReports: [
          {
            year: "2025",
            title: "2025 Local Government Workforce Insights Report",
            url: lg2025Url,
          },
          {
            year: "2024",
            title: "2024 Federal, State/Territory & Local Government Workforce Plan",
            url: lg2024Url,
          },
        ],
      },
      footnotes: [],
    },
  ];

  return {
    sectorCode: "local-government",
    year: 2026,
    title: "2026 Local Government Workforce Insights Report",
    slug,
    shortDescription: "Councils and Regional Authorities across Australia",
    coverImageUrl: "/images/reports/sector-card-local-government.png",
    pdfFileUrl: pdfUrl,
    previousPdfs: [
      {
        year: "2025",
        title: "2025 Local Government Workforce Insights Report",
        url: lg2025Url,
      },
      {
        year: "2024",
        title: "2024 Federal, State/Territory & Local Government Workforce Plan",
        url: lg2024Url,
      },
    ],
    psaSectorPageUrl: "https://publicskillsaustralia.org.au",
    contactUrl: "https://publicskillsaustralia.org.au/contact",
    landingIntroDesc:
      "For readers who want the report background — how it was developed, the methodology and the full report structure.",
    landingExecDesc:
      "Straight to the key insights and strategies — the workforce story on one page, built for large screens and briefings.",
    pages,
  };
}
