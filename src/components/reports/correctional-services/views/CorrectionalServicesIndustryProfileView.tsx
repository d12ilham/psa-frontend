"use client";

import CorrectionalServicesReportUtilityRow from "../CorrectionalServicesReportUtilityRow";
import React from "react";
import ReportFooter from "@/components/layout/ReportFooter";
import ReportHeader from "@/components/layout/ReportHeader";
import ReportNavButtons from "@/components/layout/ReportNavButtons";

type CorrectionalServicesReport = {
  pdfFileUrl?: string;
  contactUrl?: string;
  year?: { label: string };
  industry?: { slug?: string; name?: string };
};

type ColumnDatum = {
  period: string;
  detail?: string;
  first: number;
  second: number;
};

const employment: ColumnDatum[] = [
  { period: "May 2025 ('000)", detail: "Baseline", first: 18.6, second: 43.8 },
  { period: "May 2030 ('000)", detail: "Projected", first: 19.5, second: 46.6 },
  { period: "May 2035 ('000)", detail: "Projected", first: 20.3, second: 48.7 },
];

const corrections: ColumnDatum[] = [
  { period: "Dec 2022", first: 78927, second: 41029 },
  { period: "Dec 2023", first: 80171, second: 42274 },
  { period: "Dec 2024", first: 82626, second: 44262 },
  { period: "Dec 2025", first: 81697, second: 47379 },
];

const headcounts = [
  { jurisdiction: "ACT", value: 568 },
  { jurisdiction: "QLD", value: 8114 },
  { jurisdiction: "NSW", value: 10610 },
  { jurisdiction: "NT", value: 1443 },
  { jurisdiction: "SA", value: 2067 },
  { jurisdiction: "TAS", value: 767 },
  { jurisdiction: "VIC", value: 4419 },
  { jurisdiction: "WA", value: 3314 },
];

function useChartReveal() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function ChartFrame({ children, title, axis, source }: {
  children: React.ReactNode;
  title: string;
  axis?: string;
  source?: React.ReactNode;
}) {
  return (
    <figure className="w-full max-w-[800px] overflow-hidden rounded-xl border border-[#E9EAEB] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="h-3 bg-[#9DA8D0]" />
      <div className="px-5 pb-5 pt-6 sm:px-[29px] sm:pb-[29px]">
        <figcaption className="text-[19px] font-bold leading-7 text-[#252D02]">{title}</figcaption>
        {axis && <p className="mt-1 text-xs leading-5 text-[#667085]">{axis}</p>}
        {children}
        {source && <p className="mt-4 text-xs italic leading-5 text-[#667085]">{source}</p>}
      </div>
    </figure>
  );
}

function Legend({ first, second }: { first: string; second: string }) {
  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#424996]">
      <span className="inline-flex items-center gap-2"><i className="size-3 rounded-sm bg-[#9DA8D0]" />{first}</span>
      <span className="inline-flex items-center gap-2"><i className="size-3 rounded-sm bg-[#424996]" />{second}</span>
    </div>
  );
}

function GroupedColumns({ data, max, tickStep, axisLabel, firstLabel, secondLabel, format }: {
  data: ColumnDatum[];
  max: number;
  tickStep: number;
  axisLabel: string;
  firstLabel: string;
  secondLabel: string;
  format: (value: number) => string;
}) {
  const { ref, visible } = useChartReveal();

  return (
    <div ref={ref} className="mt-5 overflow-x-auto">
      <div className="min-w-[720px] pt-4">
        <div className="grid grid-cols-[88px_minmax(0,1fr)]">
          <div className="relative h-[282px] border-r border-[#424996]">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#424996] [writing-mode:vertical-rl] rotate-180">{axisLabel}</span>
            {Array.from({ length: Math.round(max / tickStep) + 1 }, (_, index) => index * tickStep).map((tick) => (
              <span key={tick} className="absolute right-2 translate-y-1/2 text-xs tabular-nums text-[#667085]" style={{ bottom: `${(tick / max) * 100}%` }}>{format(tick)}</span>
            ))}
          </div>
          <div className="relative h-[282px] border-b border-[#424996]">
            {Array.from({ length: Math.round(max / tickStep) }, (_, index) => (index + 1) * tickStep).map((tick) => (
              <div key={tick} aria-hidden="true" className="pointer-events-none absolute inset-x-0 border-t border-[#E9EAEB]" style={{ bottom: `${(tick / max) * 100}%` }} />
            ))}
            <div className="relative grid h-full items-end" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
              {data.map(({ period, first, second }, groupIndex) => (
                <div key={period} className="flex h-full items-end justify-center gap-2 px-1 sm:gap-3">
                  {([first, second] as const).map((value, seriesIndex) => (
                    <div
                      key={seriesIndex}
                      title={`${period}: ${seriesIndex === 0 ? firstLabel : secondLabel} ${format(value)}`}
                      className={`relative w-8 max-w-14 rounded-t-[3px] transition-[height,background-color] duration-700 ease-out hover:brightness-110 sm:w-14 ${seriesIndex === 0 ? "bg-[#9DA8D0]" : "bg-[#424996]"}`}
                      style={{
                        height: visible ? `${(value / max) * 100}%` : "0%",
                        transitionDelay: `${groupIndex * 90 + seriesIndex * 70}ms`,
                      }}
                    >
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 whitespace-nowrap pb-1 text-lg font-bold leading-6 tabular-nums text-[#424996]">{format(value)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="col-start-2 grid gap-1 pt-2 text-center text-xs leading-4 text-[#252D02]" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
            {data.map(({ period, detail }) => (
              <div key={period}><span className="block">{period}</span>{detail && <span className="block">{detail}</span>}</div>
            ))}
          </div>
        </div>
        <Legend first={firstLabel} second={secondLabel} />
      </div>
    </div>
  );
}

function HeadcountBars() {
  const { ref, visible } = useChartReveal();
  const max = 12000;
  const ticks = [0, 2000, 4000, 6000, 8000, 10000, max];

  return (
    <div ref={ref} className="mt-5 overflow-x-auto">
      <div className="relative min-w-[640px] pl-7">
        <span className="absolute bottom-10 left-0 top-0 flex items-center justify-center text-xs font-semibold text-[#424996] [writing-mode:vertical-rl] rotate-180">Jurisdiction</span>
        <div className="space-y-3">
          {headcounts.map(({ jurisdiction, value }, index) => (
            <div key={jurisdiction} className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-3 text-xs">
              <span className="text-right font-bold text-[#424996]">{jurisdiction}</span>
              <div className="relative mr-20 h-7">
                <div
                  title={`${jurisdiction}: ${value.toLocaleString()} employees`}
                  className="h-full rounded-r-[3px] bg-[#9DA8D0] transition-[width,background-color] duration-700 ease-out hover:bg-[#424996]"
                  style={{ width: visible ? `${(value / max) * 100}%` : "0%", transitionDelay: `${index * 70}ms` }}
                />
                <span className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-2 text-lg font-bold leading-6 tabular-nums text-[#424996]" style={{ left: `${(value / max) * 100}%` }}>{value.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="relative ml-[52px] mr-20 mt-4 h-7 border-t border-[#D5D7DA] text-[10px] tabular-nums text-[#667085]">
          {ticks.map((tick) => (
            <div key={tick} className="absolute top-0" style={{ left: `${(tick / max) * 100}%` }}>
              <span aria-hidden="true" className="absolute top-0 h-1.5 border-l border-[#D5D7DA]" />
              <span className="absolute top-2 -translate-x-1/2 whitespace-nowrap">{tick.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CorrectionalServicesIndustryProfileView({ slug, report }: {
  slug: string;
  report: CorrectionalServicesReport;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF0] font-sans text-[#252D02] antialiased">
      <ReportHeader slug={slug} report={report} currentPage="industry_profile" />

      <main className="mx-auto w-full max-w-[1504px] flex-1 space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <CorrectionalServicesReportUtilityRow>
          <ReportNavButtons
            slug={slug}
            currentPage="industry_profile"
            prev={{ label: "Industry-Sector Overview", href: `/reports/${slug}/industry_overview` }}
            next={{ label: "Industry Profile", href: `/reports/${slug}/industry_profile_community` }}
          />
        </CorrectionalServicesReportUtilityRow>

        <section className="rounded-2xl border border-[#E9EAEB] bg-white p-6">
          <p className="text-xs font-bold uppercase leading-6 text-[#598303]">Data Story 1</p>
          <h1 className="mt-3 text-[32px] font-bold leading-tight text-[#424996] sm:text-[40px] sm:leading-[54px]">Workforce Growth vs. Demand</h1>
        </section>

        <section aria-label="Workforce growth and demand charts" className="space-y-6 rounded-2xl bg-white px-4 py-10 sm:px-6 lg:px-0">
          <ChartFrame
            title="Correctional Services and Correctional Officer – Employment Projected Growth ('000)"
            axis="Y axis: Employment Projected Growth ('000), 0–60.0"
            source="Source: Jobs and Skills Australia 2026, Employment 10 year projections by JSCs and JSC sub-sectors ('000)"
          >
            <GroupedColumns data={employment} max={60} tickStep={10} axisLabel="Employment ('000)" firstLabel="Correctional Officers" secondLabel="Correctional Services" format={(value) => value.toFixed(1)} />
          </ChartFrame>

          <ChartFrame
            title="Persons in Custody and Serving Community Corrections Orders"
            axis="Y axis: Population, 0–90,000"
            source="Source: Australian Bureau of Statistics 2026, Corrective Services, Australia December Quarter 2025, Table 1"
          >
            <GroupedColumns data={corrections} max={90000} tickStep={10000} axisLabel="Population" firstLabel="Community Corrections" secondLabel="Custodial Corrections" format={(value) => value.toLocaleString()} />
          </ChartFrame>

          <ChartFrame title="Correctional Services Employment Headcount by Jurisdiction (2025)">
            <HeadcountBars />
            <p className="mt-4 text-xs italic leading-5 text-[#667085]">Source: State/Territory Correctional Services annual reports<sup><a href="#footnote-17" aria-label="Footnote 17" className="ml-0.5 font-bold text-[#424996] hover:underline">17</a></sup></p>
            <p className="mt-3 text-xs leading-5 text-[#598303]">Note: Variations in workforce reporting practices across jurisdictions may affect comparability and figures should be considered indicative.</p>
            <div id="footnote-17" className="mt-4 grid scroll-mt-24 gap-2 border-t border-[#E9EAEB] pt-4 text-xs leading-5 text-[#667085] sm:grid-cols-[90px_1fr]">
              <strong className="text-[#252D02]">Footnote 17</strong>
              <p>See the following annual reports of State/Territory Correctional Services and Departments of Justice, Australian Capital Territory, Queensland, New South Wales, Northern Territory, South Australia, Tasmania, Victoria and Western Australia.</p>
            </div>
          </ChartFrame>
        </section>
      </main>

      <ReportFooter contactUrl={report.contactUrl} reportName="Correctional Services Workforce Insights Report" />
    </div>
  );
}
