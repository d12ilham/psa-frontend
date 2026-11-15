export const workforceInsightsTheme = "Future of the Public Service";

// The three statements belong together in the theme table on printed p. 66.
// Keep this table separate from the detail-page summaries below.
export const workforceInsightsSectorAnalysis: {
  prefix?: string;
  sourceNumber?: number;
  text: string;
}[] = [
  {
    prefix: "The Public Administration and Safety industry",
    sourceNumber: 84,
    text: "is projected to grow steadily over the next decade, in line with broader increases in public sector workforce participation. Federal and State/Territory Governments operate under differing legislative and governance arrangements for workforce planning, resulting in variable levels of workforce planning maturity.",
  },
  {
    text: "As Australia’s productivity growth remains relatively low, the effectiveness of the APS remains critical to supporting economic performance.",
  },
  {
    text: "A skilled, adaptable and future-ready public service workforce has been identified as a priority, particularly in relation to technology, digital literacy and effective use of AI.",
  },
];

// Detail-page and Executive Summary copy follows printed pp. 66–69.
export const workforceInsightSummaries = [
  {
    title: "Productivity and Economic Growth",
    summary: "As Australia's productivity growth remains relatively low, the effectiveness of the APS remains critical to supporting economic performance.",
  },
  {
    title: "Workforce Gaps",
    summary: "All Federal and State/Territory Governments are facing persistent and increasingly acute skills gaps. These gaps are anticipated to increase as projected employment growth in the Public Administration and Safety industry continues to increase.",
  },
  {
    title: "Future Skills for the Public Service",
    summary: "A skilled, adaptable and future-ready public service workforce has been identified as a priority, particularly in relation to technology, digital literacy and effective use of AI.",
  },
];

export const themeOverviewSources = [
  { number: 85, text: "Australian Bureau of Statistics (ABS), Public sector employment and earnings, ABS, 2025, accessed 1 December 2025. This data also includes Local Government, which is classified as part of public sector employment and earnings." },
  { number: 86, text: "Jobs and Skills Australia (JSA), Jobs and Skills Australia, Employment Projections - May 2025 to May 2035 Table 5: Industry Group [data set], JSA, 2025, accessed 1 December 2025." },
  { number: 87, text: "JSA, Jobs and Skills Australia, Public Administration and Safety Overview, JSA, n.d., accessed 1 December 2025." },
];
