"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronsRight,
  Compass,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileText,
  GitBranch,
  Globe,
  GraduationCap,
  Info,
  Landmark,
  Layers,
  Lightbulb,
  Maximize2,
  ShieldAlert,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import ReportHeader from "@/components/layout/ReportHeader";
import ReportFooter from "@/components/layout/ReportFooter";
import ReportNavButtons from "@/components/layout/ReportNavButtons";
import LocalGovernmentReportUtilityRow from "@/components/reports/local-government/LocalGovernmentReportUtilityRow";
import CorrectionalServicesReportUtilityRow from "@/components/reports/correctional-services/CorrectionalServicesReportUtilityRow";
import PublicSafetyPageShell from "@/components/reports/public-safety/views/PublicSafetyPageShell";
import AnimatedCounter from "@/components/common/AnimatedCounter";
import AustraliaInteractiveMap from "@/components/common/AustraliaInteractiveMap";
import {
  DEFAULT_LANDING_EXEC_DESC,
  DEFAULT_LANDING_INTRO_DESC,
  SITE_SETTINGS,
} from "@/config/reports/sectors";
import type {
  CmsFootnote,
  PublicReportLandingResponse,
  PublicReportPageResponse,
  ResolvedThemeTokens,
} from "@/lib/cmsApi";

type JsonObj = Record<string, unknown>;

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function arr<T = JsonObj>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function num(v: unknown, fallback = 0): number {
  return typeof v === "number" ? v : fallback;
}

function bool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function DynamicIcon({
  name,
  className = "w-5 h-5",
  style,
}: {
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const n = (name || "").toLowerCase();
  const props = { className, style };
  if (n.includes("book")) return <BookOpen {...props} />;
  if (n.includes("user")) return <Users {...props} />;
  if (n.includes("compass")) return <Compass {...props} />;
  if (n.includes("globe")) return <Globe {...props} />;
  if (n.includes("lightbulb")) return <Lightbulb {...props} />;
  if (n.includes("target")) return <Target {...props} />;
  if (n.includes("chevron")) return <ChevronsRight {...props} />;
  if (n.includes("cpu")) return <Cpu {...props} />;
  if (n.includes("shield-alert")) return <ShieldAlert {...props} />;
  if (n.includes("shield")) return <ShieldCheck {...props} />;
  if (n.includes("trend")) return <TrendingUp {...props} />;
  if (n.includes("briefcase")) return <Briefcase {...props} />;
  if (n.includes("building")) return <Building2 {...props} />;
  if (n.includes("database")) return <Database {...props} />;
  if (n.includes("landmark")) return <Landmark {...props} />;
  if (n.includes("graduation")) return <GraduationCap {...props} />;
  if (n.includes("git")) return <GitBranch {...props} />;
  if (n.includes("bar")) return <BarChart3 {...props} />;
  if (n.includes("layers")) return <Layers {...props} />;
  if (n.includes("check")) return <CheckCircle2 {...props} />;
  if (n.includes("info")) return <Info {...props} />;
  return <FileText {...props} />;
}

interface SectorVisualTokens {
  sectorCode: string;
  eyebrowColor: string;
  headingColor: string;
  primaryAccent: string;
  secondaryAccent: string;
  statTextColor: string;
  tagBg: string;
  tagText: string;
  badgeBg: string;
  surfaceBg: string;
  borderColor: string;
  structureGridClass: string;
  isPublicSafety: boolean;
  isFederalState: boolean;
  isCorrectionalServices: boolean;
  isLocalGovernment: boolean;
}

function getSectorVisualTokens(
  sectorCode: string,
  theme: ResolvedThemeTokens
): SectorVisualTokens {
  const isPS = sectorCode === "public-safety";
  const isFS = sectorCode === "federal-state";
  const isCS = sectorCode === "correctional-services";
  const isLG = !isPS && !isFS && !isCS;

  if (theme.paletteMode === "GLOBAL_PSA") {
    return {
      sectorCode,
      eyebrowColor: "#598303",
      headingColor: "#252B37",
      primaryAccent: "#046D2A",
      secondaryAccent: "#9CAA54",
      statTextColor: "#8AC900",
      tagBg: "#F0F5DF",
      tagText: "#598303",
      badgeBg: "#046D2A",
      surfaceBg: "#F0F5DF",
      borderColor: "#E5E8DA",
      structureGridClass: isPS
        ? "grid gap-3 md:grid-cols-2 xl:grid-cols-4"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
      isPublicSafety: isPS,
      isFederalState: isFS,
      isCorrectionalServices: isCS,
      isLocalGovernment: isLG,
    };
  }

  if (isPS) {
    return {
      sectorCode,
      eyebrowColor: "#598303",
      headingColor: "#252D02",
      primaryAccent: theme.primaryColor || "#12224F",
      secondaryAccent: theme.secondaryColor || "#56638E",
      statTextColor: "#8AC900",
      tagBg: "#F0F5DF",
      tagText: "#598303",
      badgeBg: "#122453",
      surfaceBg: theme.surfaceTint || "#EEF1F8",
      borderColor: theme.borderTint || "#B7C0DA",
      structureGridClass: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
      isPublicSafety: true,
      isFederalState: false,
      isCorrectionalServices: false,
      isLocalGovernment: false,
    };
  }

  if (isFS) {
    return {
      sectorCode,
      eyebrowColor: "#754C2D",
      headingColor: "#252B37",
      primaryAccent: "#754C2D",
      secondaryAccent: "#EED4C4",
      statTextColor: "#754C2D",
      tagBg: "#F7F1ED",
      tagText: "#754C2D",
      badgeBg: "#694834",
      surfaceBg: "#F7F1ED",
      borderColor: "#DEC7B9",
      structureGridClass: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
      isPublicSafety: false,
      isFederalState: true,
      isCorrectionalServices: false,
      isLocalGovernment: false,
    };
  }

  if (isCS) {
    return {
      sectorCode,
      eyebrowColor: "#598303",
      headingColor: "#252D02",
      primaryAccent: "#424996",
      secondaryAccent: "#9CA9D2",
      statTextColor: "#424996",
      tagBg: "#F0F0F7",
      tagText: "#424996",
      badgeBg: "#424996",
      surfaceBg: "#F0F0F7",
      borderColor: "#E9EAEB",
      structureGridClass: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
      isPublicSafety: false,
      isFederalState: false,
      isCorrectionalServices: true,
      isLocalGovernment: false,
    };
  }

  // Local Government default
  return {
    sectorCode,
    eyebrowColor: "#598303",
    headingColor: "#252B37",
    primaryAccent: "#046D2A",
    secondaryAccent: "#9CAA54",
    statTextColor: "#8AC900",
    tagBg: "#F0F5DF",
    tagText: "#598303",
    badgeBg: "#046D2A",
    surfaceBg: "#F0F5DF",
    borderColor: "#E5E8DA",
    structureGridClass: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    isPublicSafety: false,
    isFederalState: false,
    isCorrectionalServices: false,
    isLocalGovernment: true,
  };
}

function getSectionArtwork(pageType: string, isFederalState: boolean): string {
  const pt = pageType.toLowerCase();
  if (isFederalState) {
    if (pt.includes("executive")) return "/images/reports/federal-state/introduction/Executive.png";
    if (pt.includes("driver")) return "/images/reports/federal-state/introduction/Drivers.png";
    if (pt.includes("overview") || pt.includes("profile"))
      return "/images/reports/federal-state/introduction/Overview.png";
    if (pt.includes("insight")) return "/images/reports/federal-state/introduction/Insights.png";
    if (pt.includes("strateg") || pt.includes("federal"))
      return "/images/reports/federal-state/introduction/Strategies.png";
    if (pt.includes("looking")) return "/images/reports/federal-state/introduction/LookingForward.png";
  }
  if (pt === "about") return "/images/reports/introduction/About.svg";
  if (pt === "methodology") return "/images/reports/introduction/Methodology.svg";
  if (pt.includes("executive")) return "/images/reports/introduction/Executive.svg";
  if (pt.includes("driver")) return "/images/reports/introduction/Drivers.svg";
  if (pt.includes("overview") || pt.includes("profile"))
    return "/images/reports/introduction/Overview.svg";
  if (pt.includes("insight")) return "/images/reports/introduction/Insights.svg";
  if (pt.includes("strateg") || pt.includes("federal"))
    return "/images/reports/introduction/Strategies.svg";
  return "/images/reports/introduction/Summary.svg";
}

function getAboutCardArtwork(title: string, idx: number): string {
  const t = title.toLowerCase();
  if (t.includes("workforce") || t.includes("planning"))
    return "/images/reports/about/Workforce.svg";
  if (t.includes("training")) return "/images/reports/about/Training.svg";
  if (t.includes("implementation") || t.includes("monitoring"))
    return "/images/reports/about/Supports.svg";
  if (t.includes("stewardship") || t.includes("industry"))
    return "/images/reports/about/Industry.svg";
  const fallbacks = [
    "/images/reports/about/Workforce.svg",
    "/images/reports/about/Training.svg",
    "/images/reports/about/Supports.svg",
    "/images/reports/about/Industry.svg",
  ];
  return fallbacks[idx % fallbacks.length];
}

function getMethodologyStepArtwork(idx: number): string {
  const files = [
    "/images/reports/methodology/Data-sources.svg",
    "/images/reports/methodology/National-survey.svg",
    "/images/reports/methodology/Workshops.svg",
    "/images/reports/methodology/Representatives.svg",
    "/images/reports/methodology/Governance.svg",
  ];
  return files[idx % files.length];
}

function PSALogoFallback() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width="34"
        height="34"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M8 22C7 20 8 18 10 17C12 16 15 17 17 15C19 13 18 10 20 8C22 6 25 7 27 6C29 5 31 7 33 9C35 11 34 14 33 16C32 18 34 20 32 23C30 26 27 25 25 27C23 29 20 30 18 32C16 34 13 32 11 30C9 28 9 24 8 22Z"
          fill="#85B810"
        />
        <path
          d="M33 26C32 28 30 30 28 32C26 34 24 33 23 31"
          stroke="#0C582B"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="font-extrabold text-[12px] text-[#1F2B11] uppercase">
          PUBLIC SKILLS
        </span>
        <span className="font-extrabold text-[10px] text-[#85B810] uppercase">
          AUSTRALIA
        </span>
      </div>
    </div>
  );
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[\[\d+\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = /^\[\[(\d+)\]\]$/.exec(part);
        if (match) {
          return (
            <a
              key={i}
              href={`#footnote-${match[1]}`}
              className="text-[#598303] font-bold no-underline hover:underline ml-0.5"
              title={`Jump to Source ${match[1]}`}
            >
              <sup>{match[1]}</sup>
            </a>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

function formatChartNumber(v: number, suffix = ""): string {
  const rounded = Number.isInteger(v)
    ? v.toLocaleString("en-AU")
    : v.toLocaleString("en-AU", { maximumFractionDigits: 2 });
  return `${rounded}${suffix}`;
}

function SvgChart({
  chart,
  accentColor,
  large = false,
}: {
  chart: JsonObj;
  accentColor: string;
  large?: boolean;
}) {
  const labels = arr<string>(chart.labels);
  const rawSeries = arr<JsonObj>(chart.series);
  const series = rawSeries.length > 0 ? rawSeries : [{ name: "Value", values: [] }];
  const chartType = str(chart.chartType, "bar");
  const suffix = str(chart.valueSuffix, "");
  const fallbackPalette = [
    accentColor,
    "#9CAA54",
    "#64645E",
    "#A58D7B",
    "#0D71A3",
    "#C9481A",
  ];

  const allValues = series.flatMap((s) =>
    arr<number>(s.values).map((v) => Number(v) || 0)
  );
  if (labels.length === 0 || allValues.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-gray600">
        No chart series configured.
      </div>
    );
  }

  // 1. Donut chart
  if (chartType === "donut") {
    const vals = arr<number>(series[0]?.values).map((v) => Number(v) || 0);
    const total = Math.max(1, vals.reduce((a, b) => a + b, 0));
    let acc = 0;
    const stops = vals
      .map((val, idx) => {
        const start = (acc / total) * 100;
        acc += val;
        const end = (acc / total) * 100;
        const col = fallbackPalette[idx % fallbackPalette.length];
        return `${col} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
      })
      .join(", ");

    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
        <div
          className={`${large ? "w-56 h-56" : "w-44 h-44"} rounded-full relative shrink-0`}
          style={{ background: `conic-gradient(${stops})` }}
          role="img"
          aria-label={str(chart.title, "Donut chart")}
        >
          <div className="absolute inset-[22%] rounded-full bg-white" />
        </div>
        <div className="space-y-2 text-xs">
          {labels.map((lbl, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{
                  backgroundColor: fallbackPalette[idx % fallbackPalette.length],
                }}
              />
              <span className="font-semibold text-gray800">{lbl}:</span>
              <span className="font-bold text-[#252D02]">
                {formatChartNumber(vals[idx] ?? 0, suffix)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Horizontal Bar Chart
  if (chartType === "horizontal_bar") {
    const vals = arr<number>(series[0]?.values).map((v) => Number(v) || 0);
    const maxVal = Math.max(1, ...vals);
    const barColor = str(series[0]?.color) || accentColor;
    return (
      <div className="space-y-3 py-2">
        {labels.map((lbl, idx) => {
          const val = vals[idx] ?? 0;
          const pct = Math.max(3, Math.round((val / maxVal) * 100));
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="font-semibold text-gray800">{lbl}</span>
                <span className="font-bold tabular-nums text-[#252D02]">
                  {formatChartNumber(val, suffix)}
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-[#FAFAF0] border border-gray200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 3. Multi-Series / Target Line Chart
  if (chartType === "line" || chartType === "line_target") {
    const rawMin = Math.min(...allValues);
    const rawMax = Math.max(...allValues);
    const span = rawMax - rawMin;
    const minVal =
      rawMin > 0 && span > 0 && rawMin / rawMax > 0.5
        ? Math.max(0, Math.floor((rawMin - span * 0.25) * 10) / 10)
        : 0;
    const maxVal = Math.max(minVal + 1, rawMax * 1.06);

    const w = large ? 780 : 580;
    const h = large ? 340 : 250;
    const padL = 56;
    const padR = 28;
    const padT = 30;
    const padB = 36;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const getX = (i: number) =>
      labels.length === 1 ? padL + plotW / 2 : padL + (i / (labels.length - 1)) * plotW;
    const getY = (v: number) =>
      padT + plotH - ((v - minVal) / Math.max(0.0001, maxVal - minVal)) * plotH;

    return (
      <div className="space-y-3">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
          {[0, 0.25, 0.5, 0.75, 1].map((t, ti) => {
            const tv = minVal + (maxVal - minVal) * t;
            const ty = padT + plotH - t * plotH;
            return (
              <g key={ti}>
                <line x1={padL} y1={ty} x2={w - padR} y2={ty} stroke="#ECECE5" />
                <text
                  x={padL - 8}
                  y={ty + 4}
                  textAnchor="end"
                  className="fill-[#6B6E68] text-[10px]"
                >
                  {formatChartNumber(Number(tv.toFixed(1)), suffix)}
                </text>
              </g>
            );
          })}
          {labels.map((lbl, li) => (
            <text
              key={li}
              x={getX(li)}
              y={h - 10}
              textAnchor="middle"
              className="fill-[#535862] text-[10px] font-semibold"
            >
              {lbl}
            </text>
          ))}
          {series.map((s, si) => {
            const vals = arr<number>(s.values).map((v) => Number(v) || 0);
            const col = str(s.color) || fallbackPalette[si % fallbackPalette.length];
            const isDashed = Boolean(s.dashed);
            const pathD = vals
              .map((v, vi) => `${vi === 0 ? "M" : "L"} ${getX(vi)} ${getY(v)}`)
              .join(" ");
            return (
              <g key={si}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={col}
                  strokeWidth={2.8}
                  strokeDasharray={isDashed ? "6 4" : undefined}
                />
                {vals.map((v, vi) => {
                  const cx = getX(vi);
                  const cy = getY(v);
                  return (
                    <g key={vi}>
                      <circle cx={cx} cy={cy} r={4.5} fill="#fff" stroke={col} strokeWidth={2.5} />
                      {series.length <= 2 && (
                        <text
                          x={cx}
                          y={si % 2 === 0 ? cy - 10 : cy + 16}
                          textAnchor="middle"
                          className="text-[10px] font-bold"
                          fill={col}
                        >
                          {formatChartNumber(v, suffix)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
        {series.length > 1 && (
          <div className="flex flex-wrap gap-4 pt-1 text-xs">
            {series.map((s, si) => (
              <div key={si} className="inline-flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{
                    backgroundColor:
                      str(s.color) || fallbackPalette[si % fallbackPalette.length],
                  }}
                />
                <span className="text-gray600 font-medium">{str(s.name)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 4. Bar / Grouped Bar / Stacked Bar Chart
  const maxVal = Math.max(1, ...allValues);
  return (
    <div className="space-y-3 pt-2">
      <div className="overflow-x-auto">
        <div
          className={`flex items-end gap-3 ${large ? "h-72" : "h-52"} px-2 pt-8 pb-2 border-b border-gray200 min-w-[320px]`}
        >
          {labels.map((lbl, li) => (
            <div
              key={li}
              className="flex-1 flex items-end justify-center gap-1 h-full min-w-[36px]"
              title={lbl}
            >
              {series.map((s, si) => {
                const val = Number(arr<number>(s.values)[li]) || 0;
                const pct = Math.max(4, Math.round((val / maxVal) * 100));
                const col =
                  str(s.color) || fallbackPalette[si % fallbackPalette.length];
                return (
                  <div
                    key={si}
                    className="flex-1 flex flex-col items-center justify-end h-full max-w-[44px]"
                  >
                    <span className="text-[10px] font-bold text-gray800 mb-1 whitespace-nowrap">
                      {formatChartNumber(val, suffix)}
                    </span>
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{ height: `${pct}%`, backgroundColor: col }}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex gap-3 px-2 pt-1.5 min-w-[320px]">
          {labels.map((lbl, i) => (
            <div
              key={i}
              className="flex-1 text-center text-[11px] font-semibold text-gray600 leading-tight"
            >
              {lbl}
            </div>
          ))}
        </div>
      </div>

      {series.length > 1 && (
        <div className="flex flex-wrap gap-4 pt-1 text-xs">
          {series.map((s, si) => (
            <div key={si} className="inline-flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{
                  backgroundColor:
                    str(s.color) || fallbackPalette[si % fallbackPalette.length],
                }}
              />
              <span className="text-gray600 font-medium">{str(s.name)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FootnotesSection({ footnotes }: { footnotes: CmsFootnote[] }) {
  if (!footnotes || footnotes.length === 0) return null;

  return (
    <section
      aria-label="Sources and Footnotes"
      className="mt-8 bg-white rounded-2xl border border-gray200 p-6 space-y-3"
    >
      <h3 className="text-base font-bold text-gray800">Sources</h3>
      <div className="space-y-2.5">
        {footnotes.map((fn, idx) => (
          <div
            key={idx}
            id={`footnote-${fn.number}`}
            className="flex items-start gap-3 text-xs leading-relaxed text-gray600 scroll-mt-24"
          >
            <span className="inline-flex items-center justify-center min-w-[26px] h-[26px] px-1.5 rounded-full bg-notes text-white text-[11px] font-bold shrink-0 mt-0.5">
              {fn.number}
            </span>
            <div className="flex-1">
              <em className="font-semibold italic text-gray800">
                {fn.sourceName}
              </em>
              {fn.text ? <span> — {fn.text}</span> : null}
              {fn.url && (
                <>
                  {" "}
                  <a
                    href={fn.url}
                    target={fn.openInNewTab === false ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-notes font-semibold underline hover:text-lg-dark"
                  >
                    <span>View source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaThemeInjector({ theme }: { theme: ResolvedThemeTokens }) {
  return (
    <style jsx global>{`
      [data-cms-report-root] [data-report-action="primary"] {
        background-color: ${theme.cta.primaryBg};
        color: ${theme.cta.primaryText};
      }
      [data-cms-report-root] [data-report-action="primary"]:hover {
        background-color: ${theme.cta.hoverBg};
        color: ${theme.cta.hoverText};
      }
      [data-cms-report-root] [data-report-action="download"] {
        background-color: ${theme.cta.downloadBg};
        color: ${theme.cta.downloadText};
      }
    `}</style>
  );
}

/* ── LANDING / TRANSITION VIEW (100% STATIC SECTOR PARITY) ── */

export function CmsReportLandingView({
  data,
  isPreview = false,
  isCmsRoute = false,
}: {
  data: PublicReportLandingResponse;
  isPreview?: boolean;
  isCmsRoute?: boolean;
}) {
  const router = useRouter();
  const { report, sector, transitionContent, resolvedTheme, siteSettings } = data;
  const tc = transitionContent || {};
  const basePath = isCmsRoute
    ? `/reports/cms/${report.slug}`
    : `/reports/${report.slug}`;
  const previewSuffix = isPreview ? "?preview=1" : "";
  const logoUrl =
    siteSettings?.logoDarkUrl ||
    siteSettings?.logoLightUrl ||
    SITE_SETTINGS.logoDarkUrl;

  const isPublicSafety = sector.code === "public-safety";
  const isFederalState = sector.code === "federal-state";
  const isCorrectionalServices = sector.code === "correctional-services";

  const introDesc =
    str(tc.introCardDescription) ||
    report.landingIntroDesc ||
    DEFAULT_LANDING_INTRO_DESC;
  const execDesc =
    str(tc.execCardDescription) ||
    report.landingExecDesc ||
    DEFAULT_LANDING_EXEC_DESC;

  if (isPublicSafety) {
    const rawSubCards = arr<JsonObj>(tc.subSectorCards);
    const subSectorCards =
      rawSubCards.length > 0
        ? rawSubCards.map((c) => ({
            title: str(c.title),
            path: str(c.pageType || c.path, "industry_overview"),
            color: str(c.color, "#12224F"),
          }))
        : [
            { title: "Defence", path: "defence", color: "#D6A52D" },
            {
              title: "Fire and Emergency Services",
              path: "fes",
              color: "#CF4C2C",
            },
            { title: "Police", path: "police", color: "#1685AD" },
          ];

    const primaryCards = [
      {
        title: str(tc.introCardTitle, "Introduction"),
        description: introDesc,
        button: str(tc.introButtonLabel, "Open the Introduction"),
        path: "introduction",
        color: "#606D9E",
      },
      {
        title: str(tc.execCardTitle, "Executive Summary"),
        description: execDesc,
        button: str(tc.execButtonLabel, "Open the Executive Summary"),
        path: "executive_summary",
        color: "#122453",
        badge: "Presentation View",
      },
    ];

    return (
      <div
        data-cms-report-root
        className="relative flex min-h-screen flex-col overflow-hidden bg-[#FAFAF0] font-sans antialiased text-[#252D02]"
      >
        <CtaThemeInjector theme={resolvedTheme} />
        <img
          src="/images/wave-left.png"
          alt=""
          className="pointer-events-none absolute bottom-0 left-0 z-0 w-[41vw] max-w-[790px] select-none animate-zoom-in"
        />
        <img
          src="/images/wave-right.png"
          alt=""
          className="pointer-events-none absolute right-0 top-[58px] z-0 w-[24vw] max-w-[470px] select-none animate-zoom-in"
        />

        {isPreview && (
          <div className="relative z-30 bg-amber-100 border-b border-amber-300 px-4 py-1.5 text-center text-xs font-bold text-amber-900">
            CMS PREVIEW MODE ({report.status}) — Dynamic Report /{report.slug}
          </div>
        )}

        <header className="relative z-20 shrink-0 border-b border-[#E9EADC] bg-[#FAFAF0]">
          <div className="mx-auto flex max-w-360 items-center justify-between px-6 py-4 sm:px-12">
            <button
              type="button"
              onClick={() => router.push("/reports")}
              className="cursor-pointer"
              aria-label="Back to reports"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteSettings?.title || "Public Skills Australia"}
                  className="h-9 w-auto object-contain"
                />
              ) : (
                <PSALogoFallback />
              )}
            </button>
            <span className="rounded-full bg-[#122453] px-3.5 py-1.5 text-xs font-bold text-white">
              {sector.name}
            </span>
          </div>
        </header>

        <main className="relative z-10 flex flex-1 flex-col items-center px-4 pb-12 pt-10 sm:pt-14">
          <section className="w-full max-w-5xl text-center">
            <p className="animate-slide-up text-xs font-semibold uppercase tracking-wider text-[#73930B]">
              {str(tc.eyebrow, `${report.year} · Public Skills Australia`)}
            </p>
            <h1 className="animate-slide-up mt-4 text-4xl font-extrabold leading-tight text-[#252D02] sm:leading-normal">
              {str(tc.headline, report.title)}
            </h1>
            {str(tc.subheadline) && (
              <p className="animate-slide-up-delay mx-auto mt-6 max-w-[900px] text-lg font-medium leading-normal text-[#60636B]">
                {str(tc.subheadline)}
              </p>
            )}
            <p className="animate-slide-up-delay mx-auto mt-6 max-w-[800px] text-lg font-semibold leading-normal text-black">
              {str(
                tc.promptText,
                "Choose how you explore the digital report; begin with the introduction for a comprehensive overview, or go straight to the executive summary for the key insights and strategies."
              )}
            </p>
          </section>

          <section className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 sm:mt-10 sm:gap-8">
            {primaryCards.map((card, index) => (
              <article
                key={card.path}
                className="animate-card-entrance flex min-h-[190px] flex-col overflow-hidden rounded-[8px] border border-[#E0E2D8] border-t-[8px] bg-white px-6 pb-5 pt-5 shadow-[0_1px_3px_rgba(37,45,2,0.04)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(37,45,2,0.10)]"
                style={{
                  borderTopColor: card.color,
                  animationDelay: `${index * 0.12 + 0.12}s`,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2
                    className="text-left text-[18px] font-bold leading-6"
                    style={{ color: card.color }}
                  >
                    {card.title}
                  </h2>
                  {card.badge ? (
                    <span className="shrink-0 rounded-full bg-[#122453] px-2.5 py-1 text-[9px] font-semibold text-white">
                      {card.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-left text-[11px] leading-[1.7] text-[#60636B]">
                  {card.description}
                </p>
                <button
                  data-report-action="primary"
                  type="button"
                  onClick={() =>
                    router.push(`${basePath}/${card.path}${previewSuffix}`)
                  }
                  className="mt-auto flex w-fit cursor-pointer items-center gap-2 rounded-full bg-[#8AC900] px-4 py-2 text-[10px] font-bold text-[#252D02] transition-all duration-300 hover:bg-[#79B700] hover:shadow-md"
                >
                  {card.button} <span aria-hidden="true">→</span>
                </button>
              </article>
            ))}
          </section>

          {subSectorCards.length > 0 && (
            <>
              <p className="mt-8 text-lg font-semibold text-black">
                {str(
                  tc.subSectorSectionTitle,
                  "Or go straight to a sector chapter"
                )}
              </p>
              <section className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
                {subSectorCards.map((card, index) => (
                  <article
                    key={`${card.path}-${index}`}
                    className="animate-card-entrance relative flex min-h-[116px] flex-col rounded-[8px] border border-[#E0E2D8] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(37,45,2,0.04)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(37,45,2,0.10)]"
                    style={{ animationDelay: `${index * 0.1 + 0.36}s` }}
                  >
                    <span
                      className="absolute inset-y-0 left-0 w-[6px] rounded-l-[7px]"
                      style={{ backgroundColor: card.color }}
                      aria-hidden="true"
                    />
                    <h2 className="text-left text-[12px] font-bold leading-5 text-[#252D02]">
                      {card.title}
                    </h2>
                    <button
                      data-report-action="primary"
                      type="button"
                      onClick={() =>
                        router.push(`${basePath}/${card.path}${previewSuffix}`)
                      }
                      className="mt-auto flex w-fit cursor-pointer items-center gap-2 rounded-full bg-[#8AC900] px-4 py-2 text-[10px] font-bold text-[#252D02] transition-all duration-300 hover:bg-[#79B700] hover:shadow-md"
                    >
                      Open Chapter <span aria-hidden="true">→</span>
                    </button>
                  </article>
                ))}
              </section>
            </>
          )}
        </main>

        <footer className="relative z-20 flex shrink-0 items-center justify-center gap-3 border-t border-[#E9EADC] bg-white p-4">
          <button
            data-report-action="secondary"
            type="button"
            onClick={() => router.push("/reports")}
            className="cursor-pointer rounded-full border border-[#B2DB79] bg-[#FAFAF0] px-5 py-2 text-sm font-semibold text-[#598303] transition-colors hover:bg-[#F1F5E5]"
          >
            ← Back to PSA Website
          </button>
          <a
            data-report-action="secondary"
            href={
              report.contactUrl || "https://publicskillsaustralia.org.au/contact"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#B2DB79] bg-[#FAFAF0] px-5 py-2 text-sm font-semibold text-[#598303] no-underline transition-colors hover:bg-[#F1F5E5]"
          >
            Contact Us
          </a>
        </footer>
      </div>
    );
  }

  if (isFederalState) {
    return (
      <div
        data-cms-report-root
        className="min-h-screen bg-[#F7F8F0] relative overflow-hidden flex flex-col justify-between font-sans antialiased"
      >
        <CtaThemeInjector theme={resolvedTheme} />
        <img
          src="/images/wave-left.png"
          alt=""
          className="fixed bottom-0 left-0 pointer-events-none z-0 object-bottom-left select-none animate-zoom-in"
        />
        <img
          src="/images/wave-right.png"
          alt=""
          className="fixed top-0 right-0 pointer-events-none z-0 h-100 xl:h-full object-top-right select-none animate-zoom-in"
        />

        {isPreview && (
          <div className="relative z-30 bg-amber-100 border-b border-amber-300 px-4 py-1.5 text-center text-xs font-bold text-amber-900">
            CMS PREVIEW MODE ({report.status}) — Dynamic Report /{report.slug}
          </div>
        )}

        <header className="w-full bg-[#FAFAF0] z-10 relative border-b border-gray200">
          <div className="max-w-360 mx-auto px-6 sm:px-12 py-4 flex items-center justify-between">
            <div
              onClick={() => router.push("/reports")}
              className="cursor-pointer flex items-center"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteSettings?.title || "Public Skills Australia"}
                  className="h-9 w-auto object-contain"
                />
              ) : (
                <PSALogoFallback />
              )}
            </div>
            <span className="bg-[#694834] text-white text-xs font-bold px-3.5 py-1.5 rounded-full">
              {sector.name}
            </span>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-start pt-10 sm:pt-14 pb-12 z-10 relative px-4">
          <div className="max-w-5xl mx-auto text-center mb-8 sm:mb-10 space-y-6">
            <div className="animate-slide-up space-y-4">
              <p className="text-xs sm:text-xs font-semibold uppercase tracking-wider text-black">
                {str(tc.eyebrow, `${report.year} • PUBLIC SKILLS AUSTRALIA`)}
              </p>
              <h1 className="text-4xl font-bold text-black leading-tight sm:leading-normal">
                {str(tc.headline, report.title)}
              </h1>
            </div>

            <p className="text-lg font-medium text-black animate-slide-up-delay max-w-3xl mx-auto leading-relaxed">
              {str(
                tc.promptText,
                "Choose how you explore the digital report; begin with the introduction for a comprehensive overview, or go straight to the executive summary for the key insights and strategies."
              )}
            </p>
          </div>

          <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div
              style={{ animationDelay: "0.15s", borderTopColor: "#EED4C4" }}
              className="animate-card-entrance bg-white rounded-2xl border border-gray200 border-t-12 p-8 flex flex-col justify-between transition-all"
            >
              <div>
                <h2 className="text-2xl font-bold mb-4 text-black">
                  {str(tc.introCardTitle, "Introduction")}
                </h2>
                <p className="text-xs text-black leading-relaxed mb-8">
                  {introDesc}
                </p>
              </div>

              <div>
                <button
                  data-report-action="primary"
                  onClick={() =>
                    router.push(`${basePath}/introduction${previewSuffix}`)
                  }
                  className="font-bold text-sm px-6 py-2 rounded-full flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-90 bg-[#8AC900] text-black"
                >
                  <span>
                    {str(tc.introButtonLabel, "Explore the Introduction")}
                  </span>
                  <span className="text-base font-normal">→</span>
                </button>
              </div>
            </div>

            <div
              style={{ animationDelay: "0.30s", borderTopColor: "#754C2D" }}
              className="animate-card-entrance bg-white rounded-2xl border border-gray200 border-t-12 p-8 flex flex-col justify-between transition-all"
            >
              <div>
                <h2 className="text-2xl font-bold mb-4 text-black">
                  {str(tc.execCardTitle, "Executive Summary")}
                </h2>
                <p className="text-xs text-black leading-relaxed mb-8">
                  {execDesc}
                </p>
              </div>

              <div>
                <button
                  data-report-action="primary"
                  onClick={() =>
                    router.push(`${basePath}/executive_summary${previewSuffix}`)
                  }
                  className="font-bold text-sm px-6 py-2 rounded-full flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-90 bg-[#8AC900] text-black"
                >
                  <span>
                    {str(tc.execButtonLabel, "Explore the Executive Summary")}
                  </span>
                  <span className="text-base font-normal">→</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="w-full bg-white border-t border-gray200 z-10 relative py-4 px-4 flex items-center justify-center gap-3">
          <button
            data-report-action="secondary"
            onClick={() => router.push("/reports")}
            className="border border-gray200 bg-white text-black font-semibold text-sm px-5 py-2 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span>←</span> Back to PSA Website
          </button>
          <a
            data-report-action="secondary"
            href={
              report.contactUrl || "https://publicskillsaustralia.org.au/contact"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray200 bg-white text-black font-semibold text-sm px-5 py-2 rounded-full cursor-pointer no-underline hover:bg-gray-50 transition-colors"
          >
            Contact Us
          </a>
        </footer>
      </div>
    );
  }

  // Local Government & Correctional Services Landing
  return (
    <div
      data-cms-report-root
      className={`min-h-screen ${isCorrectionalServices ? "bg-[#FAFAF0]" : "bg-[#F7F8F0]"} relative overflow-hidden flex flex-col justify-between font-sans antialiased`}
    >
      <CtaThemeInjector theme={resolvedTheme} />
      <img
        src="/images/wave-left.png"
        alt=""
        className="fixed bottom-0 left-0 pointer-events-none z-0 object-bottom-left select-none animate-zoom-in"
      />
      <img
        src="/images/wave-right.png"
        alt=""
        className="fixed top-0 right-0 pointer-events-none z-0 h-100 xl:h-full object-top-right select-none animate-zoom-in"
      />

      {isPreview && (
        <div className="relative z-30 bg-amber-100 border-b border-amber-300 px-4 py-1.5 text-center text-xs font-bold text-amber-900">
          CMS PREVIEW MODE ({report.status}) — Dynamic Report /{report.slug}
        </div>
      )}

      <header
        className={`w-full bg-[#FAFAF0] z-10 relative border-b ${isCorrectionalServices ? "border-[#E9EAEB]" : "border-gray200"}`}
      >
        <div className="max-w-360 mx-auto px-6 sm:px-12 py-4 flex items-center justify-between">
          <div
            onClick={() => router.push("/reports")}
            className="cursor-pointer flex items-center"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={siteSettings?.title || "Public Skills Australia"}
                className="h-9 w-auto object-contain"
              />
            ) : (
              <PSALogoFallback />
            )}
          </div>
          <span
            className={`${isCorrectionalServices ? "bg-[#424996]" : "bg-lg-dark"} text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase`}
          >
            {sector.badgeText}
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start pt-10 sm:pt-14 pb-12 z-10 relative px-4">
        <div className="max-w-5xl mx-auto text-center mb-8 sm:mb-10 space-y-6">
          <div className="animate-slide-up space-y-4">
            <p
              className="text-xs sm:text-xs font-semibold uppercase tracking-wider"
              style={{
                color: isCorrectionalServices ? "#598303" : "#046D2A",
              }}
            >
              {str(tc.eyebrow, `${report.year} • PUBLIC SKILLS AUSTRALIA`)}
            </p>
            <h1
              className={`text-4xl font-bold leading-tight sm:leading-normal ${isCorrectionalServices ? "text-[#252D02]" : "text-gray800"}`}
            >
              {str(tc.headline, report.title)}
            </h1>
          </div>
          <p
            className={`text-lg font-medium animate-slide-up-delay ${isCorrectionalServices ? "text-[#535862]" : "text-gray-600"} max-w-3xl mx-auto`}
          >
            {str(
              tc.promptText,
              "Choose how you explore the digital report; begin with the introduction for a comprehensive overview, or go straight to the executive summary for the key insights and strategies."
            )}
          </p>
        </div>

        <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          <div
            style={{
              animationDelay: "0.15s",
              borderTopColor: isCorrectionalServices ? "#9CA9D2" : "#85CC00",
            }}
            className={`animate-card-entrance bg-white rounded-2xl border ${isCorrectionalServices ? "border-[#E9EAEB]" : "border-gray200"} border-t-12 p-8 flex flex-col justify-between transition-all`}
          >
            <div>
              {!isCorrectionalServices && sector.code !== "local-government" && (
                <div className="h-10 flex items-center justify-between gap-3 mb-1">
                  <span className="text-xs sm:text-sm font-semibold uppercase leading-normal text-gray800">
                    NEW TO THE REPORT?
                  </span>
                </div>
              )}
              <h2
                className="text-2xl font-bold mb-4"
                style={{
                  color: isCorrectionalServices ? "#9CA9D2" : "#046D2A",
                }}
              >
                {str(tc.introCardTitle, "Introduction")}
              </h2>
              <p
                className={`text-xs leading-relaxed mb-8 ${isCorrectionalServices ? "text-[#535862]" : "text-gray600"}`}
              >
                {introDesc}
              </p>
            </div>
            <div>
              <button
                data-report-action="primary"
                onClick={() =>
                  router.push(`${basePath}/introduction${previewSuffix}`)
                }
                className="font-bold text-sm px-6 py-2 rounded-full flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: isCorrectionalServices
                    ? "#8AC900"
                    : "#85CC00",
                  color: "#252D02",
                }}
              >
                {str(tc.introButtonLabel, "Explore the Introduction")}{" "}
                <span className="text-base font-normal">→</span>
              </button>
            </div>
          </div>

          <div
            style={{
              animationDelay: "0.30s",
              borderTopColor: isCorrectionalServices ? "#424996" : "#046D2A",
            }}
            className={`animate-card-entrance bg-white rounded-2xl border ${isCorrectionalServices ? "border-[#E9EAEB]" : "border-gray200"} border-t-12 p-8 flex flex-col justify-between transition-all`}
          >
            <div>
              {!isCorrectionalServices && sector.code !== "local-government" && (
                <div className="h-10 flex items-center justify-between gap-3 mb-1">
                  <span className="text-xs sm:text-sm font-semibold leading-normal text-gray800">
                    OVERVIEW
                  </span>
                </div>
              )}
              <h2
                className="text-2xl font-bold mb-4"
                style={{
                  color: isCorrectionalServices ? "#424996" : "#046D2A",
                }}
              >
                {str(tc.execCardTitle, "Executive Summary")}
              </h2>
              <p
                className={`text-xs leading-relaxed mb-8 ${isCorrectionalServices ? "text-[#535862]" : "text-gray600"}`}
              >
                {execDesc}
              </p>
            </div>
            <div>
              <button
                data-report-action="primary"
                onClick={() =>
                  router.push(`${basePath}/executive_summary${previewSuffix}`)
                }
                className={`font-bold text-sm px-6 py-2 rounded-full flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-90 ${isCorrectionalServices ? "text-[#252D02]" : "text-white"}`}
                style={{
                  backgroundColor: isCorrectionalServices
                    ? "#8AC900"
                    : "#046D2A",
                }}
              >
                {str(tc.execButtonLabel, "Explore the Executive Summary")}{" "}
                <span className="text-base font-normal">→</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer
        className={`w-full bg-white border-t ${isCorrectionalServices ? "border-[#E9EAEB]" : "border-gray200"} z-10 relative py-4 px-4 flex items-center justify-center gap-3`}
      >
        <button
          data-report-action="secondary"
          onClick={() => router.push("/reports")}
          className={`border ${isCorrectionalServices ? "border-[#E9EAEB] bg-white text-[#252D02]" : "border-[#B2DB79] bg-[#FAFAF0] text-notes"} font-semibold text-sm px-5 py-2 rounded-full flex items-center gap-1.5 cursor-pointer`}
        >
          <span>←</span> Back to PSA Website
        </button>
        <a
          data-report-action="secondary"
          href={
            report.contactUrl || "https://publicskillsaustralia.org.au/contact"
          }
          target="_blank"
          rel="noopener noreferrer"
          className={`border ${isCorrectionalServices ? "border-[#E9EAEB] bg-white text-[#252D02]" : "border-[#B2DB79] bg-[#FAFAF0] text-notes"} font-semibold text-sm px-5 py-2 rounded-full cursor-pointer no-underline`}
        >
          Contact Us
        </a>
      </footer>
    </div>
  );
}

/* ── CHAPTER PAGE RENDERER (WRAPPED IN REAL STATIC SECTOR SHELLS) ── */

export default function CmsReportRenderer({
  data,
  isPreview = false,
  isCmsRoute = false,
}: {
  data: PublicReportPageResponse;
  isPreview?: boolean;
  isCmsRoute?: boolean;
}) {
  const router = useRouter();
  const { report, sector, page, resolvedTheme, navigation } = data;
  const content = page.content || {};
  const tokens = getSectorVisualTokens(sector.code, resolvedTheme);
  const shellSlug = isCmsRoute ? `cms/${report.slug}` : report.slug;
  const basePath = `/reports/${shellSlug}`;
  const previewSuffix = isPreview ? "?preview=1" : "";

  const [presentItem, setPresentItem] = useState<{
    title: string;
    node: React.ReactNode;
  } | null>(null);

  const shellReport = {
    id: report.id,
    title: report.title,
    slug: shellSlug,
    status: "published" as const,
    pdfFileUrl: report.pdfFileUrl,
    psaSectorPageUrl: report.psaSectorPageUrl,
    contactUrl: report.contactUrl,
    year: { id: String(report.year), label: String(report.year) },
    industry: { id: sector.id, name: sector.name, slug: sector.code },
  };

  const navPagesOrder = navigation
    .filter((n) => n.pageType !== "workforce_insights_detail")
    .map((n) => ({ key: n.pageType, label: n.title }));

  const onNavigate = (targetPageType: string) => {
    router.push(`${basePath}/${targetPageType}${previewSuffix}`);
  };

  const chapterBody = (
    <>
      <TemplateBody
        data={data}
        content={content}
        theme={resolvedTheme}
        tokens={tokens}
        basePath={basePath}
        previewSuffix={previewSuffix}
        onNavigate={onNavigate}
        onPresent={(title, node) => setPresentItem({ title, node })}
      />
      <FootnotesSection footnotes={page.footnotes || []} />
    </>
  );

  const backToTopAndModal = (
    <>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full shadow-lg text-xs font-bold cursor-pointer border border-[#B2DB79] bg-white text-[#252D02] hover:bg-[#F0F5DF]"
        aria-label="Back to top"
      >
        <ArrowUp className="w-3.5 h-3.5 text-notes" />
        <span>Back to top</span>
      </button>

      {presentItem && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-6 shadow-2xl border border-gray200">
            <div className="flex items-center justify-between gap-4 border-b border-gray200 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray800">
                {presentItem.title}
              </h2>
              <button
                type="button"
                onClick={() => setPresentItem(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#252D02] text-white text-xs font-bold cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Close Presentation</span>
              </button>
            </div>
            <div>{presentItem.node}</div>
          </div>
        </div>
      )}
    </>
  );

  if (tokens.isPublicSafety) {
    return (
      <div data-cms-report-root>
        <CtaThemeInjector theme={resolvedTheme} />
        {isPreview && (
          <div className="bg-amber-100 border-b border-amber-300 px-4 py-1.5 text-center text-xs font-bold text-amber-900">
            CMS PREVIEW MODE ({report.status}) · {sector.name} ({report.year}) ·
            Palette: {resolvedTheme.paletteMode}
          </div>
        )}
        <PublicSafetyPageShell
          slug={shellSlug}
          report={shellReport}
          currentPage={page.pageType}
          navigation={{ pagesOrder: navPagesOrder }}
        >
          {chapterBody}
        </PublicSafetyPageShell>
        {backToTopAndModal}
      </div>
    );
  }

  return (
    <div
      data-cms-report-root
      className={`min-h-screen ${
        tokens.isCorrectionalServices
          ? "bg-[#FAFAF0] text-[#252D02] selection:bg-[#424996]/10"
          : tokens.isFederalState
            ? "bg-background text-gray800 selection:bg-[#EED4C4]/30"
            : "bg-background text-foreground selection:bg-accent/30"
      } font-sans flex flex-col justify-between antialiased`}
    >
      <CtaThemeInjector theme={resolvedTheme} />

      {isPreview && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-1.5 text-center text-xs font-bold text-amber-900">
          CMS PREVIEW MODE ({report.status}) · {sector.name} ({report.year}) ·
          Palette: {resolvedTheme.paletteMode}
        </div>
      )}

      <ReportHeader
        slug={shellSlug}
        report={shellReport}
        currentPage={page.pageType}
        sectorPalette={tokens.isFederalState && resolvedTheme.paletteMode !== "GLOBAL_PSA"}
      />

      <main className="max-w-360 mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {tokens.isLocalGovernment && (
          <LocalGovernmentReportUtilityRow>
            <ReportNavButtons
              slug={shellSlug}
              industrySlug={sector.code}
              currentPage={page.pageType}
              pagesOrder={navPagesOrder}
            />
          </LocalGovernmentReportUtilityRow>
        )}

        {tokens.isCorrectionalServices && (
          <CorrectionalServicesReportUtilityRow>
            <ReportNavButtons
              slug={shellSlug}
              industrySlug={sector.code}
              currentPage={page.pageType}
              pagesOrder={navPagesOrder}
            />
          </CorrectionalServicesReportUtilityRow>
        )}

        {tokens.isFederalState && (
          <ReportNavButtons
            sectorPalette
            nextButtonPalette="psa"
            slug={shellSlug}
            industrySlug={sector.code}
            currentPage={page.pageType}
            pagesOrder={navPagesOrder}
          />
        )}

        {chapterBody}
      </main>

      <ReportFooter
        contactUrl={report.contactUrl}
        reportName={`${sector.name} Workforce Insights Report`}
        year={String(report.year)}
      />

      {backToTopAndModal}
    </div>
  );
}

function PresentButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#B2DB79] bg-[#F0F5DF] text-[#416102] text-[11px] font-bold cursor-pointer hover:bg-[#E1ECC8]"
    >
      <Maximize2 className="w-3 h-3" />
      <span>Present</span>
    </button>
  );
}

/* ── ALL 18 TEMPLATES MATCHING STATIC SECTOR DESIGNS ── */

function TemplateBody({
  data,
  content,
  theme,
  tokens,
  basePath,
  previewSuffix,
  onNavigate,
  onPresent,
}: {
  data: PublicReportPageResponse;
  content: JsonObj;
  theme: ResolvedThemeTokens;
  tokens: SectorVisualTokens;
  basePath: string;
  previewSuffix: string;
  onNavigate: (pageType: string) => void;
  onPresent: (title: string, node: React.ReactNode) => void;
}) {
  const { page, report, sector } = data;
  const pt = page.pageType.toLowerCase();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(id);
  }, [page.pageType]);

  if (str(content.renderMode) === "rich_page") {
    return (
      <RichExtractedPageView
        data={data}
        content={content}
        tokens={tokens}
        onNavigate={onNavigate}
        onPresent={onPresent}
      />
    );
  }

  /* ── 1. INTRODUCTION TEMPLATE ── */
  if (pt === "introduction") {
    const stats = arr<JsonObj>(content.keyStats);
    const cards = arr<JsonObj>(content.structureCards);

    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray200 rounded-2xl p-6 flex flex-col lg:flex-row items-start gap-8 lg:gap-8 xl:gap-[100px]">
          <div className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="animate-slide-up space-y-2">
                <span
                  className="text-xs font-semibold uppercase block"
                  style={{ color: tokens.eyebrowColor }}
                >
                  {str(content.eyebrow, "INTRODUCTION")}
                </span>
                <h1
                  className="text-3xl font-bold leading-tight sm:text-4xl"
                  style={{ color: tokens.headingColor }}
                >
                  {str(content.headerTitle, report.title)}
                </h1>
              </div>
              <div className="space-y-3 animate-slide-up-delay">
                {arr<string>(content.paragraphs).map((p, i) => (
                  <p
                    key={i}
                    className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal"
                  >
                    <RichText text={p} />
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                data-report-action="download"
                onClick={() => onNavigate("downloads")}
                className="bg-lg-dark hover:bg-[#046D2A] text-white font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Download {report.year} PDF</span>
                <Download className="h-3.5 w-3.5" />
              </button>
              {report.previousPdfs && report.previousPdfs.length > 0 && (
                <a
                  data-report-action="secondary"
                  href={report.previousPdfs[0].url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#B2DB79] bg-[#FAFAF0] hover:bg-gray-50 text-notes font-bold text-xs px-5 py-2.5 rounded-full transition-colors cursor-pointer no-underline"
                >
                  Previous Report
                </a>
              )}
              {report.psaSectorPageUrl && (
                <a
                  data-report-action="secondary"
                  href={report.psaSectorPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray200 bg-white hover:bg-gray-50 text-[#252D02] font-bold text-xs px-5 py-2.5 rounded-full transition-colors cursor-pointer no-underline"
                >
                  PSA Website
                </a>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-[360px] xl:w-[444px] lg:shrink-0 bg-[#F5F5F5] border border-gray200/80 rounded-2xl p-5 space-y-4 self-start animate-zoom-in">
            <span
              className="text-xs font-semibold uppercase mb-4 block"
              style={{ color: tokens.eyebrowColor }}
            >
              {str(content.statsCardTitle, "THIS REPORT AT A GLANCE")}
            </span>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => {
                const rawVal = str(s.value, "0");
                const numeric = Number(rawVal.replace(/[^0-9]/g, ""));
                const isPureNum = !Number.isNaN(numeric) && /^[0-9,+th\s]+$/i.test(rawVal);
                return (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 border border-gray200/60 flex flex-col items-start justify-start transition-all duration-300 hover:shadow-xs"
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: tokens.statTextColor }}
                    >
                      {isPureNum ? (
                        <>
                          <AnimatedCounter
                            target={numeric}
                            formatNumber={rawVal.includes(",")}
                          />
                          {rawVal.includes("+") ? "+" : ""}
                          {rawVal.endsWith("th") ? "th" : ""}
                        </>
                      ) : (
                        rawVal
                      )}
                    </span>
                    <span className="text-xs font-semibold text-gray600 mt-2 leading-tight">
                      {str(s.label)}
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        {/* Digital Report Structure */}
        <div id="structure" className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray800 border-b border-gray200 pb-3 animate-slide-up">
            {str(
              content.structureHeading,
              `The ${report.year} Digital Report Structure`
            )}
          </h2>

          <div className={tokens.structureGridClass}>
            {cards.map((c, index) => {
              const targetType = str(c.pageType, "executive_summary");
              const lineHex =
                str(c.lineColorMode) === "GLOBAL_PSA"
                  ? "#046D2A"
                  : tokens.primaryAccent;
              const tags = arr<string>(c.tags);
              const iconSrc = getSectionArtwork(
                targetType,
                tokens.isFederalState
              );

              return (
                <article
                  key={index}
                  style={
                    isMounted
                      ? {
                          animationDelay: `${index * 0.1 + 0.05}s`,
                          borderTopColor: lineHex,
                        }
                      : { borderTopColor: lineHex }
                  }
                  onClick={() => onNavigate(targetType)}
                  className={`relative bg-white rounded-2xl border border-gray200 border-t-12 p-6 flex flex-col justify-between space-y-6 cursor-pointer transition-all duration-200 hover:border-2 hover:border-[#728C28] ${
                    isMounted
                      ? "animate-card-entrance"
                      : "opacity-0 translate-y-6"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <h3 className="text-lg sm:text-xl font-bold text-gray800 leading-snug mt-1">
                        {str(c.title)}
                      </h3>
                      <p className="text-xs text-gray600 leading-relaxed">
                        {str(c.description)}
                      </p>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-bold px-3 py-1 rounded-full"
                              style={{
                                backgroundColor: tokens.tagBg,
                                color: tokens.tagText,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 pt-0.5">
                      <img
                        src={iconSrc}
                        alt={str(c.title)}
                        className="w-14 h-14 object-contain"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      data-report-action="primary"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(targetType);
                      }}
                      className="bg-lg-light text-[#1B240E] font-bold text-xs px-5 py-2 rounded-full flex items-center gap-1.5 cursor-pointer"
                    >
                      {str(c.ctaLabel, "Explore")} <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Two Feature Banners (About PSA & Methodology) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            data-report-surface="neutral"
            className="bg-[#F0F5DF] border border-gray200 rounded-2xl p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src="/images/reports/introduction/About.svg"
                alt="About Public Skills Australia"
                className="w-12 h-12 shrink-0 object-contain"
              />
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-sm text-gray800">
                  About Public Skills Australia
                </h4>
                <p className="text-xs text-gray600">
                  Who we are and how we support the sector.
                </p>
              </div>
            </div>
            <button
              data-report-action="primary"
              type="button"
              onClick={() => onNavigate("about")}
              className="bg-[#8AC900] hover:bg-[#77A60D] text-[#252D02] font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              View <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div
            data-report-surface="neutral"
            className="bg-[#F0F5DF] border border-gray200 rounded-2xl p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src="/images/reports/introduction/Methodology.svg"
                alt="Methodology"
                className="w-12 h-12 shrink-0 object-contain"
              />
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-sm text-gray800">Methodology</h4>
                <p className="text-xs text-gray600">
                  How the insights and strategies were developed.
                </p>
              </div>
            </div>
            <button
              data-report-action="primary"
              type="button"
              onClick={() => onNavigate("methodology")}
              className="bg-[#8AC900] hover:bg-[#77A60D] text-[#252D02] font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              View <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── 2. DOWNLOAD PDFs TEMPLATE ── */
  if (pt === "downloads") {
    return (
      <div className="space-y-8">
        <div className="relative bg-white border border-gray200 rounded-2xl p-6 overflow-hidden flex items-center justify-between min-h-[140px]">
          <div className="space-y-1 relative z-10 min-w-0 flex-1">
            <span
              className="text-xs font-bold uppercase tracking-wider block"
              style={{ color: tokens.secondaryAccent }}
            >
              {str(content.eyebrow, "Download PDF")}
            </span>
            <h1
              className="text-2xl sm:text-3xl lg:text-[clamp(1.5rem,2.5vw,2.25rem)] font-bold leading-tight animate-slide-up"
              style={{ color: tokens.primaryAccent }}
            >
              {str(
                content.headerTitle,
                `${sector.name} Workforce Insights Reports PDFs`
              )}
            </h1>
          </div>

          <div className="absolute right-0 top-0 bottom-0 h-full flex items-center justify-end pointer-events-none">
            <img
              src="/images/hero-graphic-downloads.png"
              alt="Downloads Graphic"
              className="h-full w-auto object-contain object-right animate-zoom-in opacity-90"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div
            data-report-surface="neutral"
            style={{
              animationDelay: "0.15s",
              backgroundColor: tokens.primaryAccent,
            }}
            className="animate-card-entrance border border-gray200 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-6">
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider block">
                FULL REPORT
              </span>
              <div className="w-16 h-16 flex items-center justify-center shrink-0">
                <img
                  src="/images/downloads-full-report-icon.png"
                  alt="Full Report Icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-white leading-snug">
                  {str(content.currentReportLabel, report.title)}
                </h2>
                <p className="text-sm text-white/90 leading-relaxed font-normal">
                  {str(content.currentReportDescription)}
                </p>
              </div>
            </div>

            <div>
              {report.pdfFileUrl ? (
                <a
                  data-report-action="primary"
                  href={report.pdfFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sweep-white-notes text-gray800 font-bold text-xs px-6 py-3 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-xs no-underline"
                >
                  <span>Open {report.year} PDF</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <span className="text-xs text-white/75 italic">
                  PDF link not yet attached in Report Settings.
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              animationDelay: "0.27s",
              borderTopColor: tokens.secondaryAccent,
            }}
            className="animate-card-entrance bg-white border border-gray200 border-t-[12px] rounded-2xl p-6 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-6">
              <span className="text-xs font-semibold text-gray600 uppercase tracking-wider block">
                {str(content.previousReportsHeading, "PREVIOUS REPORTS")}
              </span>
              <div className="space-y-4">
                {(report.previousPdfs || []).map((pdf, i) => (
                  <a
                    key={i}
                    href={pdf.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      borderColor: tokens.secondaryAccent,
                      backgroundColor: `${tokens.secondaryAccent}33`,
                    }}
                    className="rounded-2xl border p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors hover:opacity-90 no-underline"
                  >
                    <span className="text-xs sm:text-sm font-bold text-gray800">
                      {pdf.title}
                    </span>
                    <ExternalLink
                      className="h-4 w-4 shrink-0"
                      style={{ color: tokens.primaryAccent }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── 3. ABOUT PSA TEMPLATE ── */
  if (pt === "about") {
    const boxes = arr<JsonObj>(content.whatWeDoBoxes);
    return (
      <div className="space-y-8">
        <div className="bg-white border border-gray200 rounded-2xl p-6 relative overflow-hidden space-y-6">
          <img
            src="/images/wave-right.png"
            alt=""
            className="absolute top-0 right-0 w-80 pointer-events-none opacity-40 z-0 object-contain object-top-right select-none animate-hero-rotate"
          />

          <div className="relative z-10 max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray800 animate-slide-up">
              {str(content.headerTitle, "About Public Skills Australia")}
            </h1>
            <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal animate-slide-up-delay">
              {str(content.introText)}
            </p>
          </div>

          <div className="relative z-10 border border-gray200 rounded-2xl p-5 max-w-2xl flex items-start gap-4 bg-white">
            <img
              src="/images/reports/about/working-in-partnership.svg"
              alt="Working in partnership"
              className="w-16 h-16 shrink-0 object-contain animate-zoom-in"
            />
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-gray800">
                {str(content.workingInPartnershipTitle, "Working in partnership")}
              </h3>
              <p className="text-xs text-gray600 leading-relaxed">
                {str(content.workingInPartnershipText)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-gray200 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray800 animate-slide-up">
              {str(content.whatWeDoHeading, "What we do")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boxes.map((b, i) => (
              <div
                key={i}
                style={{ animationDelay: `${0.1 + i * 0.12}s` }}
                className="animate-card-entrance bg-white rounded-2xl border border-gray200 p-6 space-y-4 flex flex-col justify-between group relative transition-all duration-500 hover:border-lg-dark hover:shadow-xl hover:-translate-y-2"
              >
                <div className="space-y-5">
                  <img
                    src={getAboutCardArtwork(str(b.title), i)}
                    alt={str(b.title)}
                    className="w-16 h-16 shrink-0 object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <h3 className="font-bold text-base text-gray800 group-hover:text-lg-dark transition-colors leading-snug">
                    {str(b.title)}
                  </h3>
                  <p className="text-xs text-gray600 leading-relaxed">
                    {str(b.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray200 p-6 flex flex-col sm:flex-row items-start gap-5">
            <img
              src="/images/reports/about/Commitment.svg"
              alt="Our commitment"
              className="w-16 h-16 shrink-0 object-contain"
            />
            <div className="space-y-2 flex-1">
              <h3 className="font-bold text-base text-gray800">
                {str(content.commitmentTitle, "Our commitment")}
              </h3>
              <p className="text-sm text-gray600 leading-relaxed w-full xl:w-2/3">
                {str(content.commitmentText)}
              </p>
            </div>
          </div>

          {str(content.footnoteNote) && (
            <div
              data-report-surface="neutral"
              className="bg-[#F0F5DF] border border-gray200 rounded-2xl p-6 text-xs text-gray600 leading-relaxed"
            >
              <p className="w-full xl:w-2/3">{str(content.footnoteNote)}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── 4. METHODOLOGY TEMPLATE ── */
  if (pt === "methodology") {
    const steps = arr<JsonObj>(content.processSteps);
    const reps = arr<string>(content.keyRepresentatives);
    const govSteps = arr<JsonObj>(content.governanceSteps);
    const extraBoxes = arr<JsonObj>(content.extraBoxes);
    return (
      <div className="space-y-8">
        <div className="bg-white border border-gray200 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div
            className={`${bool(content.showKeyRepresentatives, true) && reps.length > 0 ? "lg:col-span-7" : "lg:col-span-12"} flex flex-col justify-between space-y-6`}
          >
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray800 animate-slide-up">
                {str(content.headerTitle, "Methodology")}
              </h1>
              <div className="space-y-3 animate-slide-up-delay">
                {arr<string>(content.introParagraphs).map((p, i) => (
                  <p
                    key={i}
                    className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal"
                  >
                    <RichText text={p} />
                  </p>
                ))}
              </div>
            </div>

            {bool(content.showProcessSteps, true) && steps.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {steps.map((s, i) => (
                    <div
                      key={i}
                      style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                      className="animate-card-entrance border border-gray200 rounded-xl p-3.5 bg-white space-y-4"
                    >
                      <span className="text-xs font-bold text-[#8AC900] uppercase block">
                        {str(s.stepLabel, `STEP ${i + 1}`)}
                      </span>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getMethodologyStepArtwork(i)}
                          alt={str(s.title)}
                          className="w-12 h-12 shrink-0 object-contain animate-zoom-in"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-gray800 mb-0.5">
                            {str(s.title)}
                          </h4>
                          <p className="text-xs text-gray600 font-medium">
                            {str(s.detail)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {bool(content.showKeyRepresentatives, true) && reps.length > 0 && (
            <div className="lg:col-span-5 bg-[#FAFAF0] border border-gray200 rounded-2xl p-6 space-y-4 self-start">
              <div className="flex items-center gap-3">
                <img
                  src="/images/reports/methodology/industry-sector representatives.svg"
                  alt="Representatives"
                  className="w-12 h-12 object-contain shrink-0"
                />
                <h2 className="text-base font-bold text-gray800">
                  {str(
                    content.keyRepresentativesTitle,
                    "Key industry-sector representatives"
                  )}
                </h2>
              </div>
              {str(content.keyRepresentativesIntro) && (
                <p className="text-xs text-gray600 leading-relaxed">
                  {str(content.keyRepresentativesIntro)}
                </p>
              )}
              <div className="grid grid-cols-1 gap-2">
                {reps.map((r, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray800"
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Governance Process */}
        <div className="bg-white border border-gray200 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-black">
            {str(content.governanceHeading, "Governance Process")}
          </h2>
          <p className="text-xs sm:text-sm text-gray600">
            {str(content.governanceIntro)}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {govSteps.map((g, i) => (
              <div
                key={i}
                className="bg-[#FAFAF0] border border-gray200 rounded-xl p-4 space-y-1.5"
              >
                <div className="text-sm font-bold text-gray800">
                  {str(g.title)}
                </div>
                <p className="text-xs text-gray600 leading-relaxed">
                  {str(g.description)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources & Acknowledgement (#598303 accent line per Audit p. 30) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray200 border-t-4 border-t-[#699A05] rounded-2xl p-6 flex items-start gap-4">
            <img
              src="/images/reports/methodology/Data-sources-bottom.svg"
              alt="Data sources"
              className="w-12 h-12 shrink-0 object-contain"
            />
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-gray800">
                {str(content.dataSourcesTitle, "Data sources")}
              </h3>
              <p className="text-xs text-gray600 leading-relaxed">
                {str(content.dataSourcesText)}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray200 border-t-4 border-t-[#598303] rounded-2xl p-6 flex items-start gap-4">
            <img
              src="/images/reports/methodology/With-thanks.svg"
              alt="Acknowledgement"
              className="w-12 h-12 shrink-0 object-contain"
            />
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-gray800">
                {str(content.acknowledgementTitle, "Acknowledgement")}
              </h3>
              <p className="text-xs text-gray600 leading-relaxed">
                {str(content.acknowledgementText)}
              </p>
            </div>
          </div>
        </div>

        {extraBoxes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extraBoxes.map((b, i) => (
              <div
                key={i}
                className="bg-white border border-gray200 rounded-2xl p-5 flex items-start gap-3"
              >
                <span className="w-10 h-10 rounded-full bg-[#F0F5DF] text-[#699A05] flex items-center justify-center shrink-0">
                  <DynamicIcon name={str(b.icon)} className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-gray800">
                    {str(b.title)}
                  </h4>
                  <p className="text-xs text-gray600 mt-1">{str(b.text)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── 5. EXECUTIVE SUMMARY TEMPLATE (WITH 4-CIRCLE FLOW GRAPHIC) ── */
  if (pt === "executive_summary") {
    const linkedThemes = arr<JsonObj>(page.linkedInsights?.themes);
    const linkedStrats = arr<JsonObj>(page.linkedStrategies?.strategies);
    const cols = num(content.themesColumnsLayout, 2);
    const gridCls =
      cols === 1
        ? "grid-cols-1"
        : cols === 3
          ? "grid-cols-1 lg:grid-cols-3"
          : "grid-cols-1 lg:grid-cols-2";
    const ctas = arr<JsonObj>(content.supportingSectionCtas);

    const flowBarColor = tokens.isFederalState
      ? "#EED4C4"
      : tokens.isCorrectionalServices
        ? "#9CA9D2"
        : "#8AC900";

    return (
      <div className="space-y-6">
        {/* Hero Card + 4-Circle Flow Graphic */}
        <div className="bg-white border border-gray200 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h1
              className="text-3xl sm:text-4xl font-bold animate-slide-up"
              style={{
                color: tokens.isFederalState
                  ? "#252B37"
                  : tokens.primaryAccent,
              }}
            >
              {str(content.headerTitle, "Executive Summary")}
            </h1>
            <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal animate-slide-up-delay">
              {str(content.introText)}
            </p>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end overflow-x-auto py-2">
            <div className="flex items-center justify-center shrink-0">
              {[
                {
                  img: "/images/reports/executive-summary/flow-1-workforce.png",
                  alt: "Drivers",
                  delay: "0.10s",
                },
                {
                  img: "/images/reports/executive-summary/flow-2-insights.png",
                  alt: "Insights",
                  delay: "0.60s",
                },
                {
                  img: "/images/reports/executive-summary/flow-3-strategies.png",
                  alt: "Strategies",
                  delay: "1.10s",
                },
                {
                  img: "/images/reports/executive-summary/flow-4-forward.png",
                  alt: "Looking Forward",
                  delay: "1.60s",
                },
              ].map((step, sIdx) => (
                <React.Fragment key={sIdx}>
                  <div
                    className="animate-flow-item relative z-10 shrink-0"
                    style={{ animationDelay: step.delay }}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-18 lg:h-18 xl:w-22 xl:h-22 rounded-full select-none">
                      <img
                        src={step.img}
                        alt={step.alt}
                        className="w-full h-full object-contain select-none pointer-events-none"
                      />
                    </div>
                  </div>
                  {sIdx < 3 && (
                    <div
                      className="animate-flow-separator flex flex-col justify-center gap-1 w-5 sm:w-7 md:w-8 lg:w-6 xl:w-8 -mx-[1px] relative z-0 shrink-0"
                      style={{ animationDelay: `${0.35 + sIdx * 0.5}s` }}
                    >
                      <div
                        className="h-[2px] w-full"
                        style={{ backgroundColor: flowBarColor }}
                      />
                      <div
                        className="h-[2px] w-full"
                        style={{ backgroundColor: flowBarColor }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Drivers of Change Banner */}
        <div className="bg-white rounded-2xl border border-gray200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E5E8DA] text-notes flex items-center justify-center shrink-0">
              <img
                src="/images/drivers-of-change-icon.svg"
                alt="Drivers of Change"
                className="h-7 object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray800 pb-1">
                {str(content.driversSummaryTitle, "Drivers of Change")}
              </h3>
              <p className="text-xs text-gray600 leading-relaxed w-full xl:w-2/3">
                {str(content.driversSummaryText)}
              </p>
            </div>
          </div>
          <button
            data-report-action="primary"
            onClick={() => onNavigate("drivers_of_change")}
            className="bg-[#8AC900] text-gray800 font-bold text-xs px-5 py-2.5 rounded-full hidden md:flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            Present Drivers of Change <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mirrored Workforce Themes & Insights */}
        <div className="bg-white rounded-2xl border border-gray200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray200">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E5E8DA] text-notes flex items-center justify-center shrink-0">
                <img
                  src="/images/work-force.svg"
                  alt="Workforce Insights"
                  className="h-7 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray800 pb-1">
                  {str(
                    content.themesSectionTitle,
                    "Workforce Themes and Insights"
                  )}
                </h3>
                <p className="text-xs text-gray600 leading-relaxed max-w-3xl">
                  {str(content.themesSectionIntro)}
                </p>
              </div>
            </div>
            <button
              data-report-action="primary"
              onClick={() => onNavigate("workforce_insights")}
              className="bg-[#8AC900] text-gray800 font-bold text-xs px-5 py-2.5 rounded-full hidden md:flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              Present Workforce Insights <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className={`grid ${gridCls} gap-6 items-start`}>
            {linkedThemes.map((t, ti) => {
              const tColor = str(t.sectorColor) || tokens.secondaryAccent;
              return (
                <div
                  key={ti}
                  style={{ borderTopColor: tColor }}
                  className="bg-white rounded-2xl border border-gray200 border-t-12 p-6 space-y-5"
                >
                  <div className="space-y-2">
                    <span
                      className="text-xs font-bold uppercase block"
                      style={{ color: tokens.eyebrowColor }}
                    >
                      THEME {num(t.number, ti + 1)} ·{" "}
                      {arr(t.insights).length} INSIGHTS
                    </span>
                    <h4 className="text-xl font-bold text-gray800">
                      {str(t.name)}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {arr<JsonObj>(t.insights).map((ins, ii) => (
                      <div
                        key={ii}
                        onClick={() =>
                          onNavigate(
                            str(ins.targetPageType, "workforce_insights_detail")
                          )
                        }
                        className="theme-insight-item bg-[#FAFAF0] border border-gray200 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-[#8AC900] transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-[44px] font-bold text-notes/15 leading-none">
                            {num(ins.number, ii + 1)}
                          </span>
                          <div>
                            <span
                              className="text-xs font-bold block mb-1"
                              style={{ color: tokens.eyebrowColor }}
                            >
                              Theme {num(t.number, ti + 1)}, Insight{" "}
                              {num(ins.number, ii + 1)}
                            </span>
                            <p className="text-xs font-bold text-gray800">
                              {str(ins.title)}
                            </p>
                            <p className="text-xs text-gray600 leading-relaxed mt-0.5">
                              {str(ins.summary)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mirrored Proposed Strategies */}
        <div className="bg-white rounded-2xl border border-gray200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray200">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E5E8DA] text-notes flex items-center justify-center shrink-0">
                <img
                  src="/images/stratergies.svg"
                  alt="Strategies"
                  className="h-7 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray800 pb-1">
                  {str(
                    content.strategiesSectionTitle,
                    "Proposed Workforce Strategies"
                  )}
                </h3>
                <p className="text-xs text-gray600 leading-relaxed max-w-3xl">
                  {str(content.strategiesSectionIntro)}
                </p>
              </div>
            </div>
            <button
              data-report-action="primary"
              onClick={() => onNavigate("workforce_strategies")}
              className="bg-[#8AC900] text-gray800 font-bold text-xs px-5 py-2.5 rounded-full hidden md:flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              Present Strategies <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <StrategyCardsGrid strategies={linkedStrats} tokens={tokens} />
        </div>

        {/* Looking Forward + Supporting Sections */}
        <div className="bg-white rounded-2xl border border-gray200 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-4 max-w-3xl">
              <div className="w-12 h-12 rounded-full bg-[#E5E8DA] flex items-center justify-center shrink-0">
                <img
                  src="/images/2027-and-beyond.svg"
                  alt="Looking Forward"
                  className="h-7 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray800">
                  {str(content.lookingForwardTitle, "Looking Forward")}
                </h3>
                <p className="text-xs text-gray600 mt-1 leading-relaxed">
                  {str(content.lookingForwardText)}
                </p>
              </div>
            </div>
            <button
              data-report-action="primary"
              onClick={() => onNavigate("looking_forward")}
              className="bg-[#8AC900] text-gray800 font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              Present Looking Forward <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {ctas.length > 0 && (
            <div className="pt-4 border-t border-gray200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray600 mr-2">
                Supporting Sections:
              </span>
              {ctas.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onNavigate(str(c.pageType))}
                  className="px-4 py-1.5 rounded-full border border-[#B2DB79] bg-[#F0F5DF] text-xs font-bold text-notes cursor-pointer hover:bg-[#E1ECC8]"
                >
                  {str(c.label)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── 6. DRIVERS OF CHANGE TEMPLATE ── */
  if (pt === "drivers_of_change") {
    const drivers = arr<JsonObj>(content.keyDrivers);
    const megatrends = arr<JsonObj>(content.megatrends);
    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray200 rounded-2xl p-6 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray800 animate-slide-up">
            {str(content.headerTitle, "Drivers of Change")}
          </h1>
          <div className="max-w-4xl space-y-2 text-xs sm:text-sm text-gray600 leading-relaxed animate-slide-up-delay">
            {arr<string>(content.introParagraphs).map((p, i) => (
              <p key={i}>
                <RichText text={p} />
              </p>
            ))}
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray800">
            {str(content.keyDriversHeading, "Key Drivers")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {drivers.map((d, i) => (
              <div
                key={i}
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                className="animate-card-entrance bg-white rounded-2xl border border-gray200 border-t-12 border-t-[#416102] p-6 space-y-2.5"
              >
                <span className="inline-block px-3 py-1 rounded-full bg-[#416102] text-white text-[10px] font-bold uppercase">
                  {str(d.numberLabel, `DRIVER ${i + 1}`)}
                </span>
                <h3 className="text-base font-bold text-gray800">
                  {str(d.title)}
                </h3>
                <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                  {str(d.description || d.summary)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray800">
            {str(content.megatrendsHeading, "Megatrends")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {megatrends.map((m, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray200 border-t-4 border-t-[#699A05] p-5 space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-full bg-[#F0F5DF] text-[#699A05] flex items-center justify-center shrink-0">
                    <DynamicIcon name={str(m.icon)} className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold text-gray800">
                    {str(m.title)}
                  </h3>
                </div>
                <p className="text-xs text-gray600 leading-relaxed">
                  {str(m.description)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  /* ── 7. WORKFORCE INSIGHTS OVERVIEW ── */
  if (pt === "workforce_insights") {
    const themes = arr<JsonObj>(content.themes);
    const totalInsights = themes.reduce(
      (sum, t) => sum + arr(t.insights).length,
      0
    );
    const cols = num(content.columnsLayout, 2);
    const gridCls =
      cols === 1
        ? "grid-cols-1"
        : cols === 3
          ? "grid-cols-1 lg:grid-cols-3"
          : "grid-cols-1 lg:grid-cols-2";

    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray200 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <h1
              className="text-3xl sm:text-4xl font-bold animate-slide-up"
              style={{ color: tokens.primaryAccent }}
            >
              {str(content.headerTitle, "Workforce Insights")}
            </h1>
            <div
              className="text-xs font-bold uppercase"
              style={{ color: tokens.eyebrowColor }}
            >
              {themes.length} Themes · {totalInsights} Insights
            </div>
            <p className="text-xs sm:text-sm text-gray600 leading-relaxed max-w-4xl">
              {str(content.introText)}
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <img
              src="/images/reports/introduction/Insights.svg"
              alt="Workforce Insights"
              className="w-24 h-24 object-contain animate-zoom-in"
            />
          </div>
        </div>

        <div className={`grid ${gridCls} gap-6 items-start`}>
          {themes.map((t, ti) => {
            const tColor = str(t.sectorColor) || tokens.secondaryAccent;
            return (
              <div
                key={ti}
                style={{ borderTopColor: tColor }}
                className="animate-card-entrance bg-white rounded-2xl border border-gray200 border-t-12 p-6 space-y-5"
              >
                <div className="space-y-2">
                  <div
                    className="text-xs font-bold uppercase"
                    style={{ color: tokens.eyebrowColor }}
                  >
                    THEME {num(t.number, ti + 1)} · {arr(t.insights).length}{" "}
                    INSIGHTS
                  </div>
                  <h2 className="text-xl font-bold text-gray800">
                    {str(t.name)}
                  </h2>
                </div>
                {bool(t.showOverview, true) && str(t.overviewText) && (
                  <p className="text-xs text-gray600 leading-relaxed p-4 rounded-xl bg-[#FAFAF0] border border-gray200">
                    {str(t.overviewText)}
                  </p>
                )}
                <div className="space-y-3">
                  {arr<JsonObj>(t.insights).map((ins, ii) => (
                    <button
                      key={ii}
                      type="button"
                      onClick={() =>
                        onNavigate(
                          str(ins.targetPageType, "workforce_insights_detail")
                        )
                      }
                      className="w-full text-left p-4 rounded-xl border border-gray200 hover:border-[#8AC900] transition-colors flex items-center justify-between gap-4 cursor-pointer"
                      style={{ backgroundColor: tokens.surfaceBg }}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-[44px] font-bold text-notes/15 leading-none">
                          {num(ins.number, ii + 1)}
                        </span>
                        <div>
                          <div
                            className="text-xs font-bold"
                            style={{ color: tokens.eyebrowColor }}
                          >
                            Theme {num(t.number, ti + 1)}, Insight{" "}
                            {num(ins.number, ii + 1)}
                          </div>
                          <div className="text-sm font-bold text-gray800 mt-0.5">
                            {str(ins.title)}
                          </div>
                          <div className="text-xs text-gray600 mt-1">
                            {str(ins.summary)}
                          </div>
                        </div>
                      </div>
                      <span
                        data-report-action="primary"
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#8AC900] text-[#252D02]"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── 8. WORKFORCE INSIGHTS SUPPORTING DETAILS ── */
  if (pt === "workforce_insights_detail") {
    const items = arr<JsonObj>(content.items);
    return (
      <div className="space-y-8">
        {items.map((item, idx) => {
          const blocks = arr<JsonObj>(item.blocks);
          return (
            <div key={idx} className="space-y-5">
              <div className="space-y-2">
                <div
                  className="inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: tokens.primaryAccent }}
                >
                  Theme {num(item.themeNumber, 1)}. {str(item.themeName)}
                </div>

                <div
                  className="rounded-2xl border border-gray200 border-l-8 p-6 flex items-center justify-between gap-4 bg-white"
                  style={{
                    borderLeftColor: tokens.primaryAccent,
                    backgroundColor: tokens.surfaceBg,
                  }}
                >
                  <div>
                    <div
                      className="text-xs font-bold"
                      style={{ color: tokens.primaryAccent }}
                    >
                      Theme {num(item.themeNumber, 1)}, Insight{" "}
                      {num(item.insightNumber, 1)}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray800 mt-1">
                      {str(item.insightName)}
                    </h1>
                    <p className="text-sm text-gray600 mt-1">
                      {str(item.insightDescription)}
                    </p>
                  </div>
                  <span
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-white border"
                    style={{
                      borderColor: tokens.borderColor,
                      color: tokens.primaryAccent,
                    }}
                  >
                    <DynamicIcon
                      name={str(item.themeGraphic, "lightbulb")}
                      className="w-6 h-6"
                    />
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {blocks.map((blk, bi) => {
                  const bType = str(blk.type, "text");
                  if (bType === "text") {
                    return (
                      <div
                        key={bi}
                        className="bg-white rounded-2xl border border-gray200 p-6 space-y-2"
                      >
                        <h3 className="text-base font-bold text-gray800">
                          {str(blk.title)}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray600 leading-relaxed whitespace-pre-line">
                          <RichText text={str(blk.body)} />
                        </p>
                      </div>
                    );
                  }
                  if (bType === "industry_insight") {
                    const cardNode = (
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm text-gray600 leading-relaxed whitespace-pre-line">
                          <RichText text={str(blk.body)} />
                        </p>
                      </div>
                    );
                    return (
                      <div
                        key={bi}
                        className="bg-white rounded-2xl border border-gray200 border-l-8 p-6 space-y-3"
                        style={{ borderLeftColor: tokens.primaryAccent }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-9 h-9 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: tokens.surfaceBg,
                                color: tokens.primaryAccent,
                              }}
                            >
                              <DynamicIcon
                                name={str(blk.icon, "building")}
                                className="w-4 h-4"
                              />
                            </span>
                            <h3 className="text-base font-bold text-gray800">
                              {str(blk.title)}
                            </h3>
                          </div>
                          <PresentButton
                            onClick={() => onPresent(str(blk.title), cardNode)}
                          />
                        </div>
                        {cardNode}
                      </div>
                    );
                  }
                  if (bType === "chart") {
                    const chartNode = (
                      <SvgChart
                        chart={blk}
                        accentColor={tokens.primaryAccent}
                      />
                    );
                    const largeNode = (
                      <SvgChart
                        chart={blk}
                        accentColor={tokens.primaryAccent}
                        large
                      />
                    );
                    return (
                      <div
                        key={bi}
                        className="bg-white rounded-2xl border border-gray200 p-6 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-bold text-gray800">
                            {str(blk.title)}
                          </h3>
                          <PresentButton
                            onClick={() => onPresent(str(blk.title), largeNode)}
                          />
                        </div>
                        {chartNode}
                      </div>
                    );
                  }
                  if (bType === "table") {
                    const headers = arr<string>(blk.headers);
                    const rows = arr<string[]>(blk.rows);
                    const tableNode = (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <thead>
                            <tr style={{ backgroundColor: tokens.surfaceBg }}>
                              {headers.map((h, hi) => (
                                <th
                                  key={hi}
                                  className="py-2.5 px-3 font-bold text-gray800 border-b border-gray200"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((r, ri) => (
                              <tr key={ri} className="border-b border-gray200">
                                {r.map((cell, ci) => (
                                  <td key={ci} className="py-2.5 px-3 text-gray600">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                    return (
                      <div
                        key={bi}
                        className="bg-white rounded-2xl border border-gray200 p-6 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-bold text-gray800">
                            {str(blk.title)}
                          </h3>
                          <PresentButton
                            onClick={() => onPresent(str(blk.title), tableNode)}
                          />
                        </div>
                        {tableNode}
                      </div>
                    );
                  }
                  const gItems = arr<JsonObj>(blk.items);
                  const listNode = (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {gItems.map((gi, gii) => (
                        <div
                          key={gii}
                          className="p-3 rounded-xl bg-[#FAFAF0] border border-gray200 flex items-center gap-2.5 text-xs font-semibold"
                        >
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: tokens.surfaceBg,
                              color: tokens.primaryAccent,
                            }}
                          >
                            <DynamicIcon
                              name={str(gi.icon, "check")}
                              className="w-3.5 h-3.5"
                            />
                          </span>
                          <span>{str(gi.label)}</span>
                        </div>
                      ))}
                    </div>
                  );
                  return (
                    <div
                      key={bi}
                      className="bg-white rounded-2xl border border-gray200 p-6 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-gray800">
                          {str(blk.title)}
                        </h3>
                        <PresentButton
                          onClick={() => onPresent(str(blk.title), listNode)}
                        />
                      </div>
                      {listNode}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ── 9. PROPOSED WORKFORCE STRATEGIES ── */
  if (pt === "workforce_strategies") {
    const strategies = arr<JsonObj>(content.strategies);
    return (
      <div className="space-y-8">
        <div className="bg-white border border-gray200 rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider block"
              style={{ color: tokens.eyebrowColor }}
            >
              {str(content.anchorBadge, "THE CULMINATION OF THIS REPORT")}
            </span>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight animate-slide-up"
              style={{ color: tokens.primaryAccent }}
            >
              {str(content.headerTitle)}
            </h1>
            <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal w-full lg:w-5/6 animate-slide-up-delay">
              {str(content.introText)}
            </p>
          </div>
          <div className="shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
            <img
              src="/images/hero-graphic-2026.png"
              alt="Proposed Strategies Diagram"
              className="w-full max-w-[340px] sm:max-w-[380px] object-contain animate-zoom-in"
            />
          </div>
        </div>

        <StrategyCardsGrid strategies={strategies} tokens={tokens} />
      </div>
    );
  }

  /* ── 10 & 11. INDUSTRY OVERVIEW / INDUSTRY PROFILE ── */
  if (pt === "industry_overview" || pt === "industry_profile") {
    const dataBoxes = arr<JsonObj>(content.dataBoxes);
    const contentBoxes = arr<JsonObj>(content.contentBoxes);
    const kpis = arr<JsonObj>(content.kpis);
    const charts =
      pt === "industry_profile"
        ? arr<JsonObj>(content.chartLibrary)
        : arr<JsonObj>(content.charts);

    return (
      <IndustryChartsTemplate
        title={str(content.headerTitle)}
        intro={str(content.introText)}
        dataBoxes={dataBoxes}
        contentBoxes={contentBoxes}
        kpis={kpis}
        charts={charts}
        tokens={tokens}
        onNavigate={onNavigate}
        onPresent={onPresent}
      />
    );
  }

  /* ── 12, 13, 14. MASTER-DETAIL TEMPLATES (UPDATES, EXISTING, FEDERAL) ── */
  if (
    pt === "update_strategies" ||
    pt === "existing_strategies" ||
    pt === "federal_initiatives"
  ) {
    return (
      <MasterDetailTemplate pageType={pt} content={content} tokens={tokens} />
    );
  }

  /* ── 15. LOOKING FORWARD TEMPLATE ── */
  if (pt === "looking_forward") {
    const psaBoxes = arr<JsonObj>(content.psaBoxes);
    const sectorBoxes = arr<JsonObj>(content.sectorBoxes);
    return (
      <div className="space-y-8">
        <div className="group bg-white border border-gray200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 transition-[border-color,box-shadow] duration-300 hover:border-[#B2DB79] hover:shadow-md">
          <div className="space-y-3 flex-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider block"
              style={{ color: tokens.eyebrowColor }}
            >
              {str(content.anchorBadge, "LOOKING FORWARD")}
            </span>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight animate-slide-up"
              style={{ color: tokens.primaryAccent }}
            >
              {str(content.headerTitle)}
            </h1>
            <div className="space-y-3 animate-slide-up-delay">
              {arr<string>(content.introParagraphs).map((p, i) => (
                <p
                  key={i}
                  className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal w-full lg:w-5/6"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="shrink-0 w-full lg:w-auto flex justify-center lg:justify-end transition-transform duration-500 group-hover:scale-[1.03]">
            <img
              src="/images/hero-graphic-looking-forward.png"
              alt="Looking Forward Diagram"
              className="w-full max-w-[340px] sm:max-w-[440px] object-contain animate-hero-pulse-settle select-none pointer-events-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {psaBoxes.map((b, i) => (
            <div
              key={i}
              style={{
                animationDelay: `${0.2 + i * 0.2}s`,
                borderTopColor: "#9CAA54",
              }}
              className="animate-card-entrance group bg-white rounded-2xl border border-gray200 border-t-12 p-6 space-y-4 flex flex-col justify-between transition-all duration-200 hover:border-2 hover:border-[#728C28]"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#E5E8DA] flex items-center justify-center shrink-0">
                  <img
                    src={
                      i === 0 ? "/images/inquiry-1.svg" : "/images/inquiry-2.svg"
                    }
                    alt={str(b.eyebrow)}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span className="text-xs font-semibold text-notes uppercase block">
                  {str(b.eyebrow)}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-gray800 leading-snug">
                  {str(b.text)}
                </h3>
              </div>
            </div>
          ))}

          {sectorBoxes.map((b, i) => (
            <div
              key={i}
              style={{
                animationDelay: "0.6s",
                borderTopColor: tokens.primaryAccent,
              }}
              className="animate-card-entrance group bg-white rounded-2xl border border-gray200 border-t-12 p-6 space-y-4 flex flex-col justify-between transition-all duration-200 hover:border-2 hover:border-[#728C28]"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#E5E8DA] flex items-center justify-center shrink-0">
                  <img
                    src="/images/inquiry-continuing.svg"
                    alt={str(b.eyebrow)}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span
                  className="text-xs font-semibold uppercase block"
                  style={{ color: tokens.primaryAccent }}
                >
                  {str(b.eyebrow)}
                </span>
                {str(b.title) && (
                  <h3 className="text-base font-bold text-gray800 leading-snug">
                    {str(b.title)}
                  </h3>
                )}
                <p className="text-xs text-gray600 leading-relaxed">
                  {str(b.text)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {str(content.beyondText) && (
          <div
            data-report-surface="neutral"
            className="bg-[#F0F5DF] rounded-2xl border border-[#B2DB79] p-6 space-y-2"
          >
            <h2 className="text-lg font-bold text-[#416102]">Beyond</h2>
            <p className="text-xs sm:text-sm text-[#252D02] leading-relaxed">
              {str(content.beyondText)}
            </p>
          </div>
        )}
      </div>
    );
  }

  /* ── 16 & 17. CROSS-SECTOR OR ONE-OFF PAGE ── */
  const contentBoxes = arr<JsonObj>(content.contentBoxes);
  const subPages = arr<JsonObj>(content.subPages);
  const themesList = arr<JsonObj>(content.themes);
  const linePlacement = str(content.linePlacement, "side");

  return (
    <div className="space-y-6">
      <div
        className="bg-white rounded-2xl border border-gray200 border-t-12 p-6 sm:p-8 space-y-3"
        style={{ borderTopColor: tokens.primaryAccent }}
      >
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: tokens.badgeBg }}
        >
          {str(content.anchorBadge, page.title)}
        </span>
        <h1 className="text-3xl font-bold text-gray800 animate-slide-up">
          {str(content.headerTitle, page.title)}
        </h1>
        <div className="space-y-2 text-xs sm:text-sm text-gray600 max-w-4xl leading-relaxed">
          {arr<string>(content.introParagraphs).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {str(content.introText) && <p>{str(content.introText)}</p>}
        </div>
      </div>

      {themesList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themesList.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray200 border-t-12 border-t-[#699A05] p-5 space-y-1.5"
            >
              <h3 className="text-sm font-bold text-gray800">
                {str(t.title)}
              </h3>
              <p className="text-xs text-gray600">{str(t.description)}</p>
            </div>
          ))}
        </div>
      )}

      {subPages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subPages.map((sp, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray200 p-5 space-y-2"
            >
              <h3 className="text-base font-bold text-gray800">
                {str(sp.title)}
              </h3>
              <p className="text-xs text-gray600">{str(sp.summary)}</p>
            </div>
          ))}
        </div>
      )}

      {contentBoxes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {contentBoxes.map((b, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border border-gray200 p-6 space-y-2 ${
                linePlacement === "top" ? "border-t-12" : "border-l-8"
              }`}
              style={
                linePlacement === "top"
                  ? { borderTopColor: tokens.primaryAccent }
                  : { borderLeftColor: tokens.primaryAccent }
              }
            >
              {str(b.badge) && (
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: tokens.primaryAccent }}
                >
                  {str(b.badge)}
                </span>
              )}
              <h3 className="text-lg font-bold text-gray800">
                {str(b.title)}
              </h3>
              <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                {str(b.text)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StrategyCardsGrid({
  strategies,
  tokens,
}: {
  strategies: JsonObj[];
  tokens: SectorVisualTokens;
}) {
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {strategies.map((st, idx) => {
        const isOpen = !!openMap[idx];
        const stakeholders = arr<string>(st.keyStakeholders);
        return (
          <div
            key={idx}
            style={{
              animationDelay: `${0.15 + idx * 0.1}s`,
              borderTopColor: tokens.secondaryAccent,
            }}
            className="animate-card-entrance bg-white rounded-2xl border border-gray200 border-t-12 p-6 space-y-5"
          >
            <div className="flex items-center justify-between gap-4">
              <span
                className="text-white text-xs font-bold px-3 py-1 rounded-full uppercase"
                style={{ backgroundColor: tokens.secondaryAccent }}
              >
                STRATEGY {num(st.number, idx + 1)}
              </span>
              <button
                data-report-action="primary"
                type="button"
                onClick={() =>
                  setOpenMap((prev) => ({ ...prev, [idx]: !prev[idx] }))
                }
                aria-expanded={isOpen}
                className="bg-[#8AC900] hover:bg-[#77A60D] text-[#1B240E] text-sm font-bold min-h-10 shrink-0 px-5 py-2 rounded-full cursor-pointer transition-colors flex items-center gap-1"
              >
                <span>{isOpen ? "Close" : "Open"}</span>
                {isOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray800 leading-snug">
              {str(st.name)}
            </h2>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                <span className="font-bold text-gray800">Objective:</span>{" "}
                {str(st.objective)}
              </p>
              <div className="flex flex-col items-start gap-2 pt-1">
                <span
                  className="text-xs font-bold px-3.5 py-1.5 rounded-full"
                  style={{
                    backgroundColor: tokens.tagBg,
                    color: tokens.tagText,
                  }}
                >
                  Workforce Insight: {str(st.workforceInsight)}
                </span>
              </div>
            </div>

            {isOpen && (
              <div className="pt-4 border-t border-gray200 space-y-3 text-xs sm:text-sm text-gray600">
                {str(st.jscFunction) && (
                  <div>
                    <h3 className="font-bold text-gray800">JSC Function:</h3>
                    <p>{str(st.jscFunction)}</p>
                  </div>
                )}
                {str(st.approach) && (
                  <div>
                    <h3 className="font-bold text-gray800">Approach:</h3>
                    <p className="leading-relaxed">{str(st.approach)}</p>
                  </div>
                )}
                {str(st.deliverable) && (
                  <div>
                    <h3 className="font-bold text-gray800">Deliverable:</h3>
                    <p>{str(st.deliverable)}</p>
                  </div>
                )}
                {str(st.impact) && (
                  <div>
                    <h3 className="font-bold text-gray800">Impact:</h3>
                    <p>{str(st.impact)}</p>
                  </div>
                )}
                {str(st.anticipatedTiming) && (
                  <div>
                    <h3 className="font-bold text-gray800">
                      Anticipated Timing:
                    </h3>
                    <p>{str(st.anticipatedTiming)}</p>
                  </div>
                )}
                {stakeholders.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <h3 className="font-bold text-gray800">Key Stakeholders:</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {stakeholders.map((sk, si) => (
                        <span
                          key={si}
                          className="px-3 py-1 rounded-full text-xs font-semibold border"
                          style={{
                            backgroundColor: tokens.surfaceBg,
                            borderColor: tokens.borderColor,
                            color: tokens.primaryAccent,
                          }}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function IndustryChartsTemplate({
  title,
  intro,
  dataBoxes,
  contentBoxes,
  kpis,
  charts,
  tokens,
  onNavigate,
  onPresent,
}: {
  title: string;
  intro: string;
  dataBoxes: JsonObj[];
  contentBoxes: JsonObj[];
  kpis: JsonObj[];
  charts: JsonObj[];
  tokens: SectorVisualTokens;
  onNavigate: (pt: string) => void;
  onPresent: (title: string, node: React.ReactNode) => void;
}) {
  const [activeChartIdx, setActiveChartIdx] = useState(0);
  const activeChart = charts[activeChartIdx] || null;

  return (
    <div className="space-y-6">
      <div
        className="bg-white rounded-2xl border border-gray200 border-t-12 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6"
        style={{ borderTopColor: tokens.primaryAccent }}
      >
        <div className="space-y-2 flex-1">
          <h1
            className="text-3xl font-bold animate-slide-up"
            style={{ color: tokens.primaryAccent }}
          >
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-gray600 max-w-4xl leading-relaxed">
            {intro}
          </p>
        </div>
        <img
          src="/images/reports/introduction/Overview.svg"
          alt="Industry Overview"
          className="w-20 h-20 object-contain shrink-0 animate-zoom-in"
        />
      </div>

      {(dataBoxes.length > 0 || kpis.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dataBoxes.map((b, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray200 p-5 space-y-1.5"
            >
              <div
                className="text-2xl font-bold"
                style={{ color: tokens.primaryAccent }}
              >
                {str(b.dataPoint)}
              </div>
              <div className="text-xs text-gray600">{str(b.text)}</div>
            </div>
          ))}
          {kpis.map((k, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray200 p-5 space-y-1"
            >
              <div
                className="text-2xl font-bold"
                style={{ color: tokens.primaryAccent }}
              >
                {str(k.value)}
              </div>
              <div className="text-xs font-bold text-gray800">
                {str(k.label)}
              </div>
              <div className="text-[11px] text-gray600">{str(k.note)}</div>
            </div>
          ))}
        </div>
      )}

      {contentBoxes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentBoxes.map((cb, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray200 p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray800">
                  {str(cb.title)}
                </h3>
                {str(cb.dataPoint) && (
                  <span
                    className="text-sm font-bold"
                    style={{ color: tokens.primaryAccent }}
                  >
                    {str(cb.dataPoint)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray600 leading-relaxed">
                {str(cb.text)}
              </p>
              {str(cb.ctaLabel) && (
                <button
                  data-report-action="primary"
                  type="button"
                  onClick={() =>
                    onNavigate(str(cb.ctaPageType, "industry_profile"))
                  }
                  className="bg-[#8AC900] text-[#252D02] font-bold text-xs px-5 py-2 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{str(cb.ctaLabel)}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {charts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray200 p-4 space-y-2">
            <div className="text-xs font-bold uppercase text-gray600 px-1">
              Chart Library · Select to Open
            </div>
            {charts.map((ch, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveChartIdx(idx)}
                className="w-full text-left p-3.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors"
                style={
                  activeChartIdx === idx
                    ? {
                        backgroundColor: tokens.surfaceBg,
                        borderColor: tokens.primaryAccent,
                        color: "#252D02",
                      }
                    : {
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E5E8DA",
                        color: "#535862",
                      }
                }
              >
                {str(ch.title)}
              </button>
            ))}
          </div>

          {activeChart && (
            <div className="lg:col-span-8 bg-white rounded-2xl border border-gray200 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-gray800">
                    {str(activeChart.title)}
                  </h2>
                  <p className="text-xs text-gray600">
                    {str(activeChart.subtitle)}
                  </p>
                </div>
                <PresentButton
                  onClick={() =>
                    onPresent(
                      str(activeChart.title),
                      <SvgChart
                        chart={activeChart}
                        accentColor={tokens.primaryAccent}
                        large
                      />
                    )
                  }
                />
              </div>
              <SvgChart
                chart={activeChart}
                accentColor={tokens.primaryAccent}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MasterDetailTemplate({
  pageType,
  content,
  tokens,
}: {
  pageType: string;
  content: JsonObj;
  tokens: SectorVisualTokens;
}) {
  const items =
    pageType === "federal_initiatives"
      ? arr<JsonObj>(content.initiatives)
      : arr<JsonObj>(content.items);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = items[selectedIdx] || null;
  const introBoxes = arr<JsonObj>(content.introBoxes);

  const heroGraphic =
    pageType === "federal_initiatives"
      ? "/images/hero-graphic-federal.png"
      : "/images/hero-graphic-existing.png";

  return (
    <div className="space-y-6">
      <div
        className="bg-white rounded-2xl border border-gray200 border-t-12 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6"
        style={{ borderTopColor: tokens.primaryAccent }}
      >
        <div className="space-y-3 flex-1">
          {str(content.anchorBadge) && (
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: tokens.badgeBg }}
            >
              {str(content.anchorBadge)}
            </span>
          )}
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold animate-slide-up"
            style={{ color: tokens.primaryAccent }}
          >
            {str(content.headerTitle)}
          </h1>
          <p className="text-xs sm:text-sm text-gray600 max-w-4xl leading-relaxed">
            {str(content.introParagraph || content.introText)}
          </p>

          {bool(content.showIntroBoxes) && introBoxes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {introBoxes.map((b, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#FAFAF0] border border-gray200"
                >
                  <div className="text-sm font-bold text-gray800">
                    {str(b.title)}
                  </div>
                  <div className="text-xs text-gray600 mt-1">
                    {str(b.description)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 hidden sm:flex">
          <img
            src={heroGraphic}
            alt="Strategies Graphic"
            className="w-60 h-auto object-contain animate-zoom-in"
          />
        </div>
      </div>

      {/* Master-Detail Split with Sticky Anchored Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-bold uppercase text-gray600 px-1">
            {pageType === "federal_initiatives"
              ? `${str(content.listHeadingPrefix, "Strategies")} · ${items.length}`
              : str(content.listBoxTitle, `ITEMS · ${items.length}`)}
          </div>
          {items.map((it, idx) => {
            const active = selectedIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className="w-full text-left p-4 rounded-xl border transition-colors cursor-pointer space-y-1"
                style={
                  active
                    ? {
                        backgroundColor: tokens.surfaceBg,
                        borderColor: tokens.primaryAccent,
                      }
                    : {
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E5E8DA",
                      }
                }
              >
                <div
                  className="text-[10px] font-bold uppercase"
                  style={{ color: tokens.primaryAccent }}
                >
                  {str(it.code)} ·{" "}
                  {str(
                    it.statusBadge || it.organizationLabel || it.listSubtitle
                  )}
                </div>
                <div className="text-sm font-bold text-gray800">
                  {str(it.strategyName || it.title)}
                </div>
              </button>
            );
          })}
        </div>

        {current && (
          <div className="lg:col-span-8 lg:sticky lg:top-24 lg:max-h-[78vh] lg:overflow-y-auto bg-white rounded-2xl border border-gray200 p-6 sm:p-8 space-y-5">
            <div
              className="p-4 rounded-xl text-white flex flex-wrap items-center justify-between gap-2"
              style={{ backgroundColor: tokens.primaryAccent }}
            >
              <span className="text-xs font-bold uppercase">
                {str(current.code)} ·{" "}
                {str(
                  current.statusBadge ||
                    current.organizationLabel ||
                    current.listSubtitle
                )}
              </span>
              {str(current.dateRange || current.dateOrTag) && (
                <span className="text-xs font-semibold opacity-90">
                  {str(current.dateRange || current.dateOrTag)}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray800">
              {str(current.strategyName || current.title)}
            </h2>

            {pageType === "update_strategies" && (
              <div className="space-y-4 text-xs sm:text-sm text-gray600">
                {str(current.summary) && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-gray800 mb-1">
                      Summary
                    </h3>
                    <p>{str(current.summary)}</p>
                  </div>
                )}
                {str(current.value) && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-gray800 mb-1">
                      Value
                    </h3>
                    <p>{str(current.value)}</p>
                  </div>
                )}
                {str(current.update) && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-gray800 mb-1">
                      Update
                    </h3>
                    <p>{str(current.update)}</p>
                  </div>
                )}
                {Boolean(current.connections) && (
                  <div className="p-4 rounded-xl bg-[#FAFAF0] border border-gray200 space-y-1.5 text-xs">
                    <div className="font-bold text-gray800">
                      Connection to Strategies
                    </div>
                    {str(
                      (current.connections as JsonObj).ministerialPriority
                    ) && (
                      <div>
                        <strong>Ministerial Priority:</strong>{" "}
                        {str(
                          (current.connections as JsonObj).ministerialPriority
                        )}
                      </div>
                    )}
                    {str(
                      (current.connections as JsonObj).strategicPlanPriorities
                    ) && (
                      <div>
                        <strong>Strategic Plan Priorities:</strong>{" "}
                        {str(
                          (current.connections as JsonObj)
                            .strategicPlanPriorities
                        )}
                      </div>
                    )}
                    {str((current.connections as JsonObj).driversOfChange) && (
                      <div>
                        <strong>Drivers of Change:</strong>{" "}
                        {str((current.connections as JsonObj).driversOfChange)}
                      </div>
                    )}
                  </div>
                )}
                {arr<string>(current.stakeholders).length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-gray800 mb-1.5">
                      Stakeholders
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {arr<string>(current.stakeholders).map((s, si) => (
                        <span
                          key={si}
                          className="px-3 py-1 rounded-full text-xs font-semibold border"
                          style={{
                            backgroundColor: tokens.surfaceBg,
                            borderColor: tokens.borderColor,
                            color: tokens.primaryAccent,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {str(current.nextSteps) && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-gray800 mb-1">
                      Next Steps
                    </h3>
                    <p>{str(current.nextSteps)}</p>
                  </div>
                )}
                {arr<JsonObj>(current.customSubheadings).map((cs, ci) => (
                  <div key={ci}>
                    <h3 className="text-xs font-bold uppercase text-gray800 mb-1">
                      {str(cs.heading)}
                    </h3>
                    <p>{str(cs.content)}</p>
                  </div>
                ))}
              </div>
            )}

            {(pageType === "existing_strategies" ||
              pageType === "federal_initiatives") && (
              <div className="space-y-4 text-xs sm:text-sm text-gray600 leading-relaxed">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase text-gray800">
                    Summary
                  </h3>
                  {arr<string>(
                    current.summaryParagraphs || current.paragraphs
                  ).map((p, pi) => (
                    <p key={pi}>{p}</p>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-[#FAFAF0] border border-gray200 space-y-2">
                  <h3 className="text-xs font-bold uppercase text-gray800">
                    {str(
                      current.howItInformsHeading,
                      "How this informs Public Skills Australia's work"
                    )}
                  </h3>
                  {arr<string>(current.howItInformsParagraphs).map((p, pi) => (
                    <p key={pi}>{p}</p>
                  ))}
                  {str(current.howItInformsText) && (
                    <p>{str(current.howItInformsText)}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── EXTRACTED 2026 VERBATIM RICH PAGE RENDERER ── */

function RichTableCard({
  title,
  subtitle,
  headers,
  rows,
  source,
  note,
  tokens,
  onPresent,
}: {
  title?: string;
  subtitle?: string;
  headers: string[];
  rows: string[][];
  source?: string;
  note?: string;
  tokens: SectorVisualTokens;
  onPresent?: (title: string, node: React.ReactNode) => void;
}) {
  const renderTable = (compact = false) => (
    <div className="overflow-x-auto">
      <table className={`w-full text-left border-collapse ${compact ? "text-xs" : "text-sm"}`}>
        {headers.length > 0 && (
          <thead>
            <tr
              className="border-b border-gray200"
              style={{ backgroundColor: tokens.surfaceBg }}
            >
              {headers.map((h, hi) => (
                <th
                  key={hi}
                  className="px-3.5 py-2.5 font-bold text-gray800 whitespace-nowrap"
                >
                  <RichText text={h} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray200/80">
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-[#FAFAF0]/70 transition-colors">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-3.5 py-2.5 align-top leading-relaxed ${
                    ci === 0 ? "font-semibold text-gray800" : "text-gray600"
                  }`}
                >
                  <RichText text={String(cell ?? "")} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray200 p-6 space-y-4">
      {(title || subtitle || onPresent) && (
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title && (
              <h3
                className="text-lg font-bold"
                style={{ color: tokens.headingColor }}
              >
                <RichText text={title} />
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray600 leading-relaxed">
                <RichText text={subtitle} />
              </p>
            )}
          </div>
          {onPresent && (
            <PresentButton
              onClick={() =>
                onPresent(
                  title || "Data Table",
                  <div className="space-y-3">
                    {subtitle && (
                      <p className="text-sm text-gray600">
                        <RichText text={subtitle} />
                      </p>
                    )}
                    {renderTable(false)}
                    {source && (
                      <p className="text-xs text-gray600 italic">
                        Source: <RichText text={source} />
                      </p>
                    )}
                  </div>
                )
              }
            />
          )}
        </div>
      )}
      {renderTable(true)}
      {note && (
        <p className="text-xs text-gray600 bg-[#FAFAF0] border border-gray200 rounded-xl px-3.5 py-2.5 leading-relaxed">
          <RichText text={note} />
        </p>
      )}
      {source && (
        <p className="text-[11px] text-gray600 italic">
          Source: <RichText text={source} />
        </p>
      )}
    </div>
  );
}

function RichStateExplorerBlock({
  block,
  subSectorCode,
  pageType,
  tokens,
  onPresent,
}: {
  block: JsonObj;
  subSectorCode: string | null;
  pageType: string;
  tokens: SectorVisualTokens;
  onPresent: (title: string, node: React.ReactNode) => void;
}) {
  const defaultCode = str(block.defaultState, "NATIONAL");
  const [selectedState, setSelectedState] = useState<string>(defaultCode);

  useEffect(() => {
    setSelectedState(str(block.defaultState, "NATIONAL"));
  }, [block.defaultState, pageType]);

  const statesMap = (block.states || {}) as Record<string, JsonObj>;
  const stateCodes = Object.keys(statesMap);
  const activeDetail =
    selectedState !== "NATIONAL" ? statesMap[selectedState] : undefined;

  const pt = pageType.toLowerCase();
  const mapVariant: "default" | "defence" | "fire" | "police" =
    subSectorCode === "DEF" || pt.startsWith("defence_")
      ? "defence"
      : subSectorCode === "FES" || pt.startsWith("fes_")
        ? "fire"
        : subSectorCode === "POL" || pt.startsWith("police_")
          ? "police"
          : "default";

  const mappedStates: Record<
    string,
    { name: string; employees: string; councils: number }
  > = {};
  for (const code of stateCodes) {
    const st = statesMap[code] || {};
    const firstMetricVal = str(arr<JsonObj>(st.metrics)[0]?.value);
    mappedStates[code] = {
      name: str(st.name, code),
      employees: str(st.employees, firstMetricVal),
      councils: num(st.councils, num(st.facilities, 0)),
    };
  }

  const legendItems = arr<JsonObj>(block.legendItems);
  const nationalHeaders = arr<string>(block.nationalHeaders);
  const nationalRows = arr<string[]>(block.nationalRows);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray200 p-6 space-y-5">
        {(str(block.title) || str(block.intro)) && (
          <div className="space-y-2">
            {str(block.title) && (
              <h2
                className="text-xl font-bold"
                style={{ color: tokens.headingColor }}
              >
                <RichText text={str(block.title)} />
              </h2>
            )}
            {str(block.intro) && (
              <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                <RichText text={str(block.intro)} />
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedState("NATIONAL")}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer"
            style={
              selectedState === "NATIONAL"
                ? {
                    backgroundColor: tokens.primaryAccent,
                    borderColor: tokens.primaryAccent,
                    color: "#FFFFFF",
                  }
                : {
                    backgroundColor: "#FFFFFF",
                    borderColor: tokens.borderColor,
                    color: tokens.headingColor,
                  }
            }
          >
            National
          </button>
          {stateCodes.map((code) => {
            const active = selectedState === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setSelectedState(code)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer"
                style={
                  active
                    ? {
                        backgroundColor: tokens.primaryAccent,
                        borderColor: tokens.primaryAccent,
                        color: "#FFFFFF",
                      }
                    : {
                        backgroundColor: tokens.surfaceBg,
                        borderColor: tokens.borderColor,
                        color: tokens.headingColor,
                      }
                }
              >
                {code}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 rounded-2xl border border-gray200 bg-[#FAFAF0] p-4">
            <AustraliaInteractiveMap
              selectedState={selectedState}
              onSelectState={(code) => setSelectedState(code || "NATIONAL")}
              statesData={mappedStates}
              variant={mapVariant}
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            {activeDetail ? (
              <div className="rounded-2xl border border-gray200 bg-white p-5 space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-gray200 pb-3">
                  <div>
                    <span
                      className="text-[11px] font-bold uppercase tracking-wide block"
                      style={{ color: tokens.eyebrowColor }}
                    >
                      {str(activeDetail.code, selectedState)} JURISDICTION PROFILE
                    </span>
                    <h3
                      className="text-xl font-bold"
                      style={{ color: tokens.headingColor }}
                    >
                      {str(activeDetail.name, selectedState)}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedState("NATIONAL")}
                    className="text-xs font-semibold px-3 py-1 rounded-full border border-gray200 hover:bg-gray-50 cursor-pointer"
                  >
                    National view
                  </button>
                </div>

                {(str(activeDetail.employees) ||
                  activeDetail.councils !== undefined ||
                  activeDetail.facilities !== undefined ||
                  str(activeDetail.expenditure) ||
                  arr<JsonObj>(activeDetail.metrics).length > 0) && (
                  <div className="grid grid-cols-2 gap-3">
                    {str(activeDetail.employees) && (
                      <div
                        className="rounded-xl p-3 border"
                        style={{
                          backgroundColor: tokens.surfaceBg,
                          borderColor: tokens.borderColor,
                        }}
                      >
                        <div className="text-[11px] font-semibold text-gray600">
                          Workforce
                        </div>
                        <div
                          className="text-xl font-bold"
                          style={{ color: tokens.primaryAccent }}
                        >
                          {str(activeDetail.employees)}
                        </div>
                      </div>
                    )}
                    {activeDetail.councils !== undefined && (
                      <div
                        className="rounded-xl p-3 border"
                        style={{
                          backgroundColor: tokens.surfaceBg,
                          borderColor: tokens.borderColor,
                        }}
                      >
                        <div className="text-[11px] font-semibold text-gray600">
                          Councils
                        </div>
                        <div
                          className="text-xl font-bold"
                          style={{ color: tokens.primaryAccent }}
                        >
                          {num(activeDetail.councils).toLocaleString("en-AU")}
                        </div>
                      </div>
                    )}
                    {activeDetail.facilities !== undefined && (
                      <div
                        className="rounded-xl p-3 border"
                        style={{
                          backgroundColor: tokens.surfaceBg,
                          borderColor: tokens.borderColor,
                        }}
                      >
                        <div className="text-[11px] font-semibold text-gray600">
                          Facilities
                        </div>
                        <div
                          className="text-xl font-bold"
                          style={{ color: tokens.primaryAccent }}
                        >
                          {num(activeDetail.facilities).toLocaleString("en-AU")}
                        </div>
                      </div>
                    )}
                    {str(activeDetail.expenditure) && (
                      <div
                        className="rounded-xl p-3 border"
                        style={{
                          backgroundColor: tokens.surfaceBg,
                          borderColor: tokens.borderColor,
                        }}
                      >
                        <div className="text-[11px] font-semibold text-gray600">
                          Expenditure
                        </div>
                        <div
                          className="text-lg font-bold"
                          style={{ color: tokens.primaryAccent }}
                        >
                          {str(activeDetail.expenditure)}
                        </div>
                      </div>
                    )}
                    {arr<JsonObj>(activeDetail.metrics).map((m, mi) => (
                      <div
                        key={mi}
                        className="rounded-xl p-3 border"
                        style={{
                          backgroundColor: tokens.surfaceBg,
                          borderColor: tokens.borderColor,
                        }}
                      >
                        <div className="text-[11px] font-semibold text-gray600">
                          <RichText text={str(m.label)} />
                        </div>
                        <div
                          className="text-lg font-bold"
                          style={{ color: tokens.primaryAccent }}
                        >
                          <RichText text={str(m.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {arr<string>(activeDetail.topShortages).length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase text-gray800">
                      Top Occupational Shortages
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-gray600">
                      {arr<string>(activeDetail.topShortages).map((s, si) => (
                        <li key={si}>
                          <RichText text={s} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {arr<string>(activeDetail.lgSpecificShortages).length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase text-gray800">
                      Local Government Specific Shortages
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-gray600">
                      {arr<string>(activeDetail.lgSpecificShortages).map(
                        (s, si) => (
                          <li key={si}>
                            <RichText text={s} />
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {arr<JsonObj>(activeDetail.oslTable).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-gray800">
                      Occupation Shortage List (OSL) Comparison
                    </h4>
                    <div className="overflow-x-auto border border-gray200 rounded-xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr
                            className="border-b border-gray200"
                            style={{ backgroundColor: tokens.surfaceBg }}
                          >
                            <th className="px-3 py-2 font-bold text-gray800">
                              Occupation
                            </th>
                            <th className="px-3 py-2 font-bold text-gray800">
                              State
                            </th>
                            <th className="px-3 py-2 font-bold text-gray800">
                              National
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray200">
                          {arr<JsonObj>(activeDetail.oslTable).map(
                            (row, ri) => (
                              <tr key={ri}>
                                <td className="px-3 py-2 font-medium text-gray800">
                                  <RichText text={str(row.occupation)} />
                                </td>
                                <td className="px-3 py-2 font-bold text-gray700">
                                  {str(row.stateShortage)}
                                </td>
                                <td className="px-3 py-2 text-gray600">
                                  {str(row.nationalShortage)}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {arr<string[]>(activeDetail.rows).length > 0 && (
                  <RichTableCard
                    headers={arr<string>(activeDetail.headers)}
                    rows={arr<string[]>(activeDetail.rows)}
                    tokens={tokens}
                  />
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray200 bg-[#FAFAF0] p-5 space-y-3">
                <h3
                  className="text-base font-bold"
                  style={{ color: tokens.headingColor }}
                >
                  Jurisdictions Overview — Select a State or Territory
                </h3>
                <p className="text-xs text-gray600 leading-relaxed">
                  Click any jurisdiction on the interactive map or choose a state pill above to inspect local workforce metrics, counts, and occupational shortage tables.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {stateCodes.map((code) => {
                    const st = statesMap[code] || {};
                    const headlineVal =
                      str(st.employees) ||
                      str(arr<JsonObj>(st.metrics)[0]?.value) ||
                      (st.councils !== undefined
                        ? `${num(st.councils)} councils`
                        : str(st.facilities !== undefined ? `${num(st.facilities)} facilities` : ""));
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setSelectedState(code)}
                        className="text-left p-3 rounded-xl bg-white border border-gray200 hover:border-[#8AC900] transition-colors cursor-pointer"
                      >
                        <div className="text-[11px] font-bold text-gray600">
                          {code}
                        </div>
                        <div className="text-xs font-bold text-gray800 truncate">
                          {str(st.name, code)}
                        </div>
                        {headlineVal && (
                          <div
                            className="text-sm font-extrabold mt-0.5"
                            style={{ color: tokens.primaryAccent }}
                          >
                            {headlineVal}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {legendItems.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {legendItems.map((lg, li) => (
                  <span
                    key={li}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border border-gray200 bg-white text-gray700"
                  >
                    <span
                      className="font-extrabold"
                      style={{ color: tokens.primaryAccent }}
                    >
                      {str(lg.code)}:
                    </span>
                    <span>{str(lg.label)}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {(str(block.source) || str(block.note)) && (
          <div className="space-y-1 pt-2 border-t border-gray200 text-xs text-gray600">
            {str(block.note) && (
              <p>
                <RichText text={str(block.note)} />
              </p>
            )}
            {str(block.source) && (
              <p className="italic">
                Source: <RichText text={str(block.source)} />
              </p>
            )}
          </div>
        )}
      </div>

      {nationalRows.length > 0 && (
        <RichTableCard
          title={str(block.nationalTableTitle, "National Summary")}
          headers={nationalHeaders}
          rows={nationalRows}
          tokens={tokens}
          onPresent={onPresent}
        />
      )}
    </div>
  );
}

function RichMasterDetailBlock({
  block,
  tokens,
  onNavigate,
}: {
  block: JsonObj;
  tokens: SectorVisualTokens;
  onNavigate: (pageType: string) => void;
}) {
  const items = arr<JsonObj>(block.items);
  const [activeIdx, setActiveIdx] = useState(0);
  const current = items[activeIdx] || items[0];
  if (!current) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-24">
        {str(block.listTitle) && (
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray600 px-1 pb-1">
            {str(block.listTitle)}
          </div>
        )}
        <div className="space-y-2 max-h-[68vh] overflow-y-auto pr-1">
          {items.map((item, idx) => {
            const active = idx === activeIdx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className="w-full text-left p-4 rounded-xl border transition-all cursor-pointer space-y-1"
                style={
                  active
                    ? {
                        backgroundColor: tokens.surfaceBg,
                        borderColor: tokens.primaryAccent,
                        borderLeftWidth: "4px",
                      }
                    : {
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E5E8DA",
                      }
                }
              >
                <div className="flex items-center gap-2">
                  {str(item.code) && (
                    <span
                      className="text-[11px] font-extrabold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: tokens.tagBg,
                        color: tokens.tagText,
                      }}
                    >
                      {str(item.code)}
                    </span>
                  )}
                  {str(item.eyebrow) && (
                    <span
                      className="text-[10px] font-bold uppercase"
                      style={{ color: tokens.eyebrowColor }}
                    >
                      {str(item.eyebrow)}
                    </span>
                  )}
                </div>
                <div className="font-bold text-sm text-gray800 leading-snug">
                  <RichText text={str(item.title)} />
                </div>
                {str(item.badgeText) && (
                  <div className="text-[11px] text-gray600">
                    {str(item.badgeText)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-8 bg-white rounded-2xl border border-gray200 p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {str(current.code) && (
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                backgroundColor: tokens.primaryAccent,
                color: "#FFFFFF",
              }}
            >
              {str(current.code)}
            </span>
          )}
          {str(current.eyebrow) && (
            <span
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: tokens.eyebrowColor }}
            >
              {str(current.eyebrow)}
            </span>
          )}
          {str(current.badgeText) && (
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: tokens.tagBg, color: tokens.tagText }}
            >
              {str(current.badgeText)}
            </span>
          )}
        </div>

        <h2
          className="text-xl sm:text-2xl font-bold leading-snug"
          style={{ color: tokens.headingColor }}
        >
          <RichText text={str(current.title)} />
        </h2>

        <div className="space-y-3 text-sm text-gray600 leading-relaxed">
          {arr<string>(current.summaryParagraphs).map((p, pi) => (
            <p key={pi}>
              <RichText text={p} />
            </p>
          ))}
        </div>

        {arr<string>(current.bullets).length > 0 && (
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray600 leading-relaxed">
            {arr<string>(current.bullets).map((b, bi) => (
              <li key={bi}>
                <RichText text={b} />
              </li>
            ))}
          </ul>
        )}

        {arr<JsonObj>(current.detailSections).map((sec, si) => (
          <div
            key={si}
            className="p-4 rounded-xl border border-gray200 bg-[#FAFAF0] space-y-2"
          >
            <h3 className="text-sm font-bold text-gray800">
              <RichText text={str(sec.heading)} />
            </h3>
            {arr<string>(sec.paragraphs).map((p, pi) => (
              <p key={pi} className="text-xs sm:text-sm text-gray600 leading-relaxed">
                <RichText text={p} />
              </p>
            ))}
            {arr<string>(sec.bullets).length > 0 && (
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray600">
                {arr<string>(sec.bullets).map((b, bi) => (
                  <li key={bi}>
                    <RichText text={b} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {arr<string>(current.tags).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {arr<string>(current.tags).map((tg, ti) => (
              <span
                key={ti}
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: tokens.tagBg, color: tokens.tagText }}
              >
                {tg}
              </span>
            ))}
          </div>
        )}

        {str(current.ctaPageType) && (
          <div>
            <button
              type="button"
              data-report-action="primary"
              onClick={() => onNavigate(str(current.ctaPageType))}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white cursor-pointer"
              style={{ backgroundColor: tokens.primaryAccent }}
            >
              <span>{str(current.ctaLabel, "Explore")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RichAccordionsBlock({
  block,
  data,
  tokens,
  onNavigate,
  onPresent,
}: {
  block: JsonObj;
  data: PublicReportPageResponse;
  tokens: SectorVisualTokens;
  onNavigate: (pageType: string) => void;
  onPresent: (title: string, node: React.ReactNode) => void;
}) {
  const items = arr<JsonObj>(block.items);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    items.forEach((it, idx) => {
      init[str(it.id, `acc-${idx}`)] = bool(it.defaultOpen, idx === 0);
    });
    return init;
  });

  const toggle = (key: string) =>
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-4">
      {(str(block.title) || str(block.intro)) && (
        <div className="space-y-1">
          {str(block.title) && (
            <h2
              className="text-xl font-bold"
              style={{ color: tokens.headingColor }}
            >
              <RichText text={str(block.title)} />
            </h2>
          )}
          {str(block.intro) && (
            <p className="text-xs sm:text-sm text-gray600">
              <RichText text={str(block.intro)} />
            </p>
          )}
        </div>
      )}

      <div className="space-y-3">
        {items.map((it, idx) => {
          const itemKey = str(it.id, `acc-${idx}`);
          const isOpen = !!openMap[itemKey];
          const cta = (it.cta || null) as JsonObj | null;
          return (
            <div
              key={itemKey}
              className="bg-white rounded-2xl border border-gray200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggle(itemKey)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#FAFAF0]/70 transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  {str(it.badge) && (
                    <span
                      className="inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: tokens.tagBg,
                        color: tokens.tagText,
                      }}
                    >
                      {str(it.badge)}
                    </span>
                  )}
                  <h3 className="text-base sm:text-lg font-bold text-gray800">
                    <RichText text={str(it.title)} />
                  </h3>
                  {str(it.subtitle) && (
                    <p className="text-xs text-gray600">
                      <RichText text={str(it.subtitle)} />
                    </p>
                  )}
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 shrink-0 text-gray600" />
                ) : (
                  <ChevronDown className="w-5 h-5 shrink-0 text-gray600" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-gray200/80 space-y-4">
                  {arr<string>(it.summaryParagraphs).map((p, pi) => (
                    <p key={pi} className="text-sm text-gray600 leading-relaxed">
                      <RichText text={p} />
                    </p>
                  ))}

                  {arr<string>(it.bullets).length > 0 && (
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray600 leading-relaxed">
                      {arr<string>(it.bullets).map((b, bi) => (
                        <li key={bi}>
                          <RichText text={b} />
                        </li>
                      ))}
                    </ul>
                  )}

                  {arr<JsonObj>(it.sections).map((sec, si) => (
                    <div
                      key={si}
                      className="p-4 rounded-xl bg-[#FAFAF0] border border-gray200 space-y-2"
                    >
                      <h4 className="text-sm font-bold text-gray800">
                        <RichText text={str(sec.heading)} />
                      </h4>
                      {arr<string>(sec.paragraphs).map((p, pi) => (
                        <p key={pi} className="text-xs sm:text-sm text-gray600 leading-relaxed">
                          <RichText text={p} />
                        </p>
                      ))}
                      {arr<string>(sec.bullets).length > 0 && (
                        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray600">
                          {arr<string>(sec.bullets).map((b, bi) => (
                            <li key={bi}>
                              <RichText text={b} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  {arr<JsonObj>(it.blocks).map((childBlock, bi) => (
                    <RichSingleBlock
                      key={str(childBlock.id, `acc-${idx}-blk-${bi}`)}
                      block={childBlock}
                      data={data}
                      tokens={tokens}
                      onNavigate={onNavigate}
                      onPresent={onPresent}
                    />
                  ))}

                  {cta && str(cta.pageType) && (
                    <div>
                      <button
                        type="button"
                        data-report-action="primary"
                        onClick={() => onNavigate(str(cta.pageType))}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-white cursor-pointer"
                        style={{ backgroundColor: tokens.primaryAccent }}
                      >
                        <span>{str(cta.label, "Explore")}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RichSingleBlock({
  block,
  data,
  tokens,
  onNavigate,
  onPresent,
}: {
  block: JsonObj;
  data: PublicReportPageResponse;
  tokens: SectorVisualTokens;
  onNavigate: (pageType: string) => void;
  onPresent: (title: string, node: React.ReactNode) => void;
}) {
  const bType = str(block.type);

  if (bType === "narrative") {
    const paragraphs = arr<string>(block.paragraphs);
    const bullets = arr<string>(block.bullets);
    const orderedList = arr<string>(block.orderedList);
    const subSections = arr<JsonObj>(block.subSections);
    const cta = (block.cta || null) as JsonObj | null;
    return (
      <section className="bg-white rounded-2xl border border-gray200 p-6 space-y-4">
        {(str(block.badge) || str(block.title) || str(block.subtitle)) && (
          <div className="space-y-1.5">
            {str(block.badge) && (
              <span
                className="inline-block text-[11px] font-bold uppercase px-3 py-0.5 rounded-full"
                style={{ backgroundColor: tokens.tagBg, color: tokens.tagText }}
              >
                {str(block.badge)}
              </span>
            )}
            {str(block.title) && (
              <h2
                className="text-lg sm:text-xl font-bold"
                style={{ color: tokens.headingColor }}
              >
                <RichText text={str(block.title)} />
              </h2>
            )}
            {str(block.subtitle) && (
              <p className="text-xs text-gray600">
                <RichText text={str(block.subtitle)} />
              </p>
            )}
          </div>
        )}

        {paragraphs.length > 0 && (
          <div className="space-y-3 text-sm text-gray600 leading-relaxed">
            {paragraphs.map((p, pi) => (
              <p key={pi}>
                <RichText text={p} />
              </p>
            ))}
          </div>
        )}

        {bullets.length > 0 && (
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray600 leading-relaxed">
            {bullets.map((b, bi) => (
              <li key={bi}>
                <RichText text={b} />
              </li>
            ))}
          </ul>
        )}

        {orderedList.length > 0 && (
          <ol className="list-decimal pl-5 space-y-1.5 text-sm text-gray600 leading-relaxed">
            {orderedList.map((o, oi) => (
              <li key={oi}>
                <RichText text={o} />
              </li>
            ))}
          </ol>
        )}

        {subSections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {subSections.map((sec, si) => (
              <div
                key={si}
                className="p-4 rounded-xl border border-gray200 bg-[#FAFAF0] space-y-2"
              >
                <h3 className="text-sm font-bold text-gray800">
                  <RichText text={str(sec.title)} />
                </h3>
                {arr<string>(sec.paragraphs).map((p, pi) => (
                  <p key={pi} className="text-xs sm:text-sm text-gray600 leading-relaxed">
                    <RichText text={p} />
                  </p>
                ))}
                {arr<string>(sec.bullets).length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray600">
                    {arr<string>(sec.bullets).map((b, bi) => (
                      <li key={bi}>
                        <RichText text={b} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {str(block.note) && (
          <div
            className="rounded-xl p-4 border text-xs sm:text-sm text-gray700 leading-relaxed"
            style={{
              backgroundColor: tokens.surfaceBg,
              borderColor: tokens.borderColor,
            }}
          >
            <RichText text={str(block.note)} />
          </div>
        )}

        {cta && str(cta.pageType) && (
          <div className="pt-1">
            <button
              type="button"
              data-report-action="primary"
              onClick={() => onNavigate(str(cta.pageType))}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white cursor-pointer"
              style={{ backgroundColor: tokens.primaryAccent }}
            >
              <span>{str(cta.label, "Explore")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>
    );
  }

  if (bType === "industry_insight") {
    return (
      <section
        className="rounded-2xl border p-6 space-y-3 bg-white border-l-4"
        style={{
          borderColor: tokens.borderColor,
          borderLeftColor: tokens.primaryAccent,
          backgroundColor: tokens.surfaceBg,
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {str(block.number) && (
            <span
              className="w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-extrabold text-white"
              style={{ backgroundColor: tokens.primaryAccent }}
            >
              {str(block.number)}
            </span>
          )}
          <span
            className="text-[11px] font-bold uppercase tracking-wide px-3 py-0.5 rounded-full bg-white border"
            style={{ color: tokens.primaryAccent, borderColor: tokens.borderColor }}
          >
            {str(block.badge, "INDUSTRY INSIGHT")}
          </span>
        </div>
        <h3
          className="text-lg font-bold"
          style={{ color: tokens.headingColor }}
        >
          <RichText text={str(block.title)} />
        </h3>
        {arr<string>(block.paragraphs).map((p, pi) => (
          <p key={pi} className="text-sm text-gray700 leading-relaxed">
            <RichText text={p} />
          </p>
        ))}
        {arr<string>(block.bullets).length > 0 && (
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray700">
            {arr<string>(block.bullets).map((b, bi) => (
              <li key={bi}>
                <RichText text={b} />
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  if (bType === "kpi_grid") {
    const cols = num(block.columns, 3);
    const gridCls =
      cols === 2
        ? "grid-cols-1 md:grid-cols-2"
        : cols === 4
          ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
          : "grid-cols-1 md:grid-cols-3";
    return (
      <section className="space-y-3">
        {str(block.title) && (
          <h2
            className="text-lg font-bold"
            style={{ color: tokens.headingColor }}
          >
            <RichText text={str(block.title)} />
          </h2>
        )}
        <div className={`grid gap-4 ${gridCls}`}>
          {arr<JsonObj>(block.items).map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray200 p-5 flex flex-col justify-between gap-2"
            >
              <div
                className="text-2xl sm:text-3xl font-extrabold leading-tight"
                style={{ color: tokens.primaryAccent }}
              >
                <RichText text={str(item.value)} />
              </div>
              <div className="space-y-1">
                <div className="text-xs sm:text-sm font-semibold text-gray800 leading-snug">
                  <RichText text={str(item.label)} />
                </div>
                {str(item.sublabel) && (
                  <div className="text-xs text-gray600">
                    <RichText text={str(item.sublabel)} />
                  </div>
                )}
                {str(item.source) && (
                  <div className="text-[11px] text-gray600 italic">
                    Source: <RichText text={str(item.source)} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (bType === "chart") {
    return (
      <section className="bg-white rounded-2xl border border-gray200 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3
              className="text-lg font-bold"
              style={{ color: tokens.headingColor }}
            >
              <RichText text={str(block.title)} />
            </h3>
            {str(block.subtitle) && (
              <p className="text-xs text-gray600">
                <RichText text={str(block.subtitle)} />
              </p>
            )}
          </div>
          <PresentButton
            onClick={() =>
              onPresent(
                str(block.title, "Chart"),
                <div className="space-y-4">
                  {str(block.subtitle) && (
                    <p className="text-sm text-gray600">
                      <RichText text={str(block.subtitle)} />
                    </p>
                  )}
                  <SvgChart
                    chart={block}
                    accentColor={tokens.primaryAccent}
                    large
                  />
                  {str(block.source) && (
                    <p className="text-xs text-gray600 italic">
                      Source: <RichText text={str(block.source)} />
                    </p>
                  )}
                </div>
              )
            }
          />
        </div>
        <SvgChart chart={block} accentColor={tokens.primaryAccent} />
        {str(block.note) && (
          <p className="text-xs text-gray600 bg-[#FAFAF0] border border-gray200 rounded-xl px-3.5 py-2">
            <RichText text={str(block.note)} />
          </p>
        )}
        {str(block.source) && (
          <p className="text-[11px] text-gray600 italic">
            Source: <RichText text={str(block.source)} />
          </p>
        )}
      </section>
    );
  }

  if (bType === "table") {
    return (
      <RichTableCard
        title={str(block.title) || undefined}
        subtitle={str(block.subtitle) || undefined}
        headers={arr<string>(block.headers)}
        rows={arr<string[]>(block.rows)}
        source={str(block.source) || undefined}
        note={str(block.note) || undefined}
        tokens={tokens}
        onPresent={onPresent}
      />
    );
  }

  if (bType === "link_cards") {
    const cols = num(block.columns, 3);
    const gridCls =
      cols === 2
        ? "grid-cols-1 md:grid-cols-2"
        : cols === 4
          ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    return (
      <section className="space-y-4">
        {(str(block.title) || str(block.subtitle)) && (
          <div className="space-y-1">
            {str(block.title) && (
              <h2
                className="text-xl font-bold"
                style={{ color: tokens.headingColor }}
              >
                <RichText text={str(block.title)} />
              </h2>
            )}
            {str(block.subtitle) && (
              <p className="text-xs sm:text-sm text-gray600">
                <RichText text={str(block.subtitle)} />
              </p>
            )}
          </div>
        )}
        <div className={`grid gap-5 ${gridCls}`}>
          {arr<JsonObj>(block.cards).map((c, ci) => {
            const accent = str(c.accentColor) || tokens.primaryAccent;
            const nestedItems = arr<JsonObj>(c.items);
            const targetPage = str(c.pageType);
            const targetUrl = str(c.url);
            return (
              <article
                key={ci}
                className="bg-white rounded-2xl border border-gray200 border-t-8 p-6 flex flex-col justify-between gap-4"
                style={{ borderTopColor: accent }}
              >
                <div className="space-y-3">
                  {(str(c.number) || str(c.eyebrow)) && (
                    <div className="flex items-center gap-2">
                      {str(c.number) && (
                        <span
                          className="w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-extrabold text-white shrink-0"
                          style={{ backgroundColor: accent }}
                        >
                          {str(c.number)}
                        </span>
                      )}
                      {str(c.eyebrow) && (
                        <span
                          className="text-[11px] font-bold uppercase tracking-wide"
                          style={{ color: tokens.eyebrowColor }}
                        >
                          {str(c.eyebrow)}
                        </span>
                      )}
                    </div>
                  )}

                  <h3 className="text-base sm:text-lg font-bold text-gray800 leading-snug">
                    <RichText text={str(c.title)} />
                  </h3>

                  {str(c.summary) && (
                    <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                      <RichText text={str(c.summary)} />
                    </p>
                  )}

                  {arr<string>(c.overviewParagraphs).map((op, oi) => (
                    <p key={oi} className="text-xs text-gray600 leading-relaxed">
                      <RichText text={op} />
                    </p>
                  ))}

                  {nestedItems.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-gray200">
                      {nestedItems.map((ni, nii) => {
                        const niPage = str(ni.pageType);
                        return (
                          <div
                            key={nii}
                            className="p-3 rounded-xl border border-gray200 bg-[#FAFAF0] space-y-1"
                          >
                            {(str(ni.number) || str(ni.eyebrow)) && (
                              <div className="text-[10px] font-bold uppercase text-gray600">
                                {str(ni.number)} {str(ni.eyebrow)}
                              </div>
                            )}
                            <div className="text-xs font-bold text-gray800">
                              <RichText text={str(ni.title)} />
                            </div>
                            {str(ni.summary) && (
                              <p className="text-[11px] text-gray600 leading-relaxed">
                                <RichText text={str(ni.summary)} />
                              </p>
                            )}
                            {niPage && (
                              <button
                                type="button"
                                onClick={() => onNavigate(niPage)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer hover:underline pt-0.5"
                                style={{ color: tokens.primaryAccent }}
                              >
                                <span>Open insight</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {arr<string>(c.tags).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {arr<string>(c.tags).map((t, ti) => (
                        <span
                          key={ti}
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: tokens.tagBg,
                            color: tokens.tagText,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {(targetPage || targetUrl) && (
                  <div className="pt-1">
                    {targetPage ? (
                      <button
                        type="button"
                        data-report-action="primary"
                        onClick={() => onNavigate(targetPage)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white cursor-pointer"
                        style={{ backgroundColor: accent }}
                      >
                        <span>{str(c.ctaLabel, "Explore")}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border border-gray200 text-gray800 hover:bg-gray-50 no-underline"
                      >
                        <span>{str(c.ctaLabel, "Open Link")}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  if (bType === "master_detail") {
    return (
      <RichMasterDetailBlock
        block={block}
        tokens={tokens}
        onNavigate={onNavigate}
      />
    );
  }

  if (bType === "strategy_cards") {
    const cols = num(block.columns, 2);
    const gridCls =
      cols === 3
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 lg:grid-cols-2";
    return (
      <section className={`grid gap-6 ${gridCls}`}>
        {arr<JsonObj>(block.items).map((st, si) => {
          const accent = str(st.color) || tokens.primaryAccent;
          return (
            <article
              key={si}
              className="bg-white rounded-2xl border border-gray200 border-t-8 p-6 space-y-4 flex flex-col justify-between"
              style={{ borderTopColor: accent }}
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="text-[11px] font-bold uppercase px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {str(st.badge, `STRATEGY ${si + 1}`)}
                  </span>
                  {str(st.sectorLabel) && (
                    <span
                      className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: tokens.tagBg,
                        color: tokens.tagText,
                      }}
                    >
                      {str(st.sectorLabel)}
                    </span>
                  )}
                </div>

                <h3
                  className="text-lg font-bold leading-snug"
                  style={{ color: tokens.headingColor }}
                >
                  <RichText text={str(st.title)} />
                </h3>

                {str(st.intro) && (
                  <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                    <RichText text={str(st.intro)} />
                  </p>
                )}

                {(str(st.workforceInsight) || str(st.jscFunction)) && (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl border text-xs"
                    style={{
                      backgroundColor: tokens.surfaceBg,
                      borderColor: tokens.borderColor,
                    }}
                  >
                    {str(st.workforceInsight) && (
                      <div>
                        <span className="font-bold block text-gray800">
                          Workforce Insight
                        </span>
                        <span className="text-gray600">
                          <RichText text={str(st.workforceInsight)} />
                        </span>
                      </div>
                    )}
                    {str(st.jscFunction) && (
                      <div>
                        <span className="font-bold block text-gray800">
                          JSC Function
                        </span>
                        <span className="text-gray600">
                          <RichText text={str(st.jscFunction)} />
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {str(st.objective) && (
                  <div className="text-xs sm:text-sm text-gray600">
                    <strong className="text-gray800">Objective: </strong>
                    <RichText text={str(st.objective)} />
                  </div>
                )}

                {arr<string>(st.approach).length > 0 && (
                  <div className="space-y-1 text-xs sm:text-sm text-gray600">
                    <div className="font-bold text-gray800">Approach</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {arr<string>(st.approach).map((a, ai) => (
                        <li key={ai}>
                          <RichText text={a} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {arr<string>(st.deliverable).length > 0 && (
                  <div className="space-y-1 text-xs sm:text-sm text-gray600">
                    <div className="font-bold text-gray800">Deliverables</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {arr<string>(st.deliverable).map((d, di) => (
                        <li key={di}>
                          <RichText text={d} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {str(st.impact) && (
                  <div className="text-xs sm:text-sm text-gray600">
                    <strong className="text-gray800">Expected Impact: </strong>
                    <RichText text={str(st.impact)} />
                  </div>
                )}

                {str(st.timing) && (
                  <div className="text-xs sm:text-sm text-gray600">
                    <strong className="text-gray800">Timing: </strong>
                    <RichText text={str(st.timing)} />
                  </div>
                )}

                {arr<string>(st.stakeholders).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {arr<string>(st.stakeholders).map((sh, shi) => (
                      <span
                        key={shi}
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: tokens.tagBg,
                          borderColor: tokens.borderColor,
                          color: tokens.tagText,
                        }}
                      >
                        {sh}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {str(st.appendixPageType) && (
                <div className="pt-2">
                  <button
                    type="button"
                    data-report-action="primary"
                    onClick={() => onNavigate(str(st.appendixPageType))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white cursor-pointer"
                    style={{ backgroundColor: accent }}
                  >
                    <span>{str(st.appendixLabel, "Open Strategy Detail")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </section>
    );
  }

  if (bType === "accordions") {
    return (
      <RichAccordionsBlock
        block={block}
        data={data}
        tokens={tokens}
        onNavigate={onNavigate}
        onPresent={onPresent}
      />
    );
  }

  if (bType === "state_explorer") {
    return (
      <RichStateExplorerBlock
        block={block}
        subSectorCode={data.page.subSectorCode ?? null}
        pageType={data.page.pageType}
        tokens={tokens}
        onPresent={onPresent}
      />
    );
  }

  if (bType === "downloads_list") {
    const currentUrl = str(block.currentPdfUrl) || data.report.pdfFileUrl || "";
    const previous =
      arr<JsonObj>(block.previousReports).length > 0
        ? arr<JsonObj>(block.previousReports)
        : (data.report.previousPdfs || []).map((p) => ({
            year: p.year,
            title: p.title,
            url: p.url,
          }));
    return (
      <section className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2
              className="text-xl font-bold"
              style={{ color: tokens.headingColor }}
            >
              {str(block.currentReportTitle, data.report.title)}
            </h2>
            {str(block.currentReportDescription) && (
              <p className="text-xs sm:text-sm text-gray600">
                <RichText text={str(block.currentReportDescription)} />
              </p>
            )}
          </div>
          {currentUrl && (
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-report-action="download"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold shrink-0 no-underline"
              style={{
                backgroundColor: tokens.primaryAccent,
                color: "#FFFFFF",
              }}
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </a>
          )}
        </div>

        {previous.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray200 p-6 space-y-3">
            <h3 className="text-base font-bold text-gray800">
              Previous Editions & Reference Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {previous.map((pr, pi) => (
                <a
                  key={pi}
                  href={str(pr.url, "#")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-gray200 bg-[#FAFAF0] hover:border-[#8AC900] transition-colors no-underline"
                >
                  <div>
                    {str(pr.year) && (
                      <div
                        className="text-[11px] font-bold uppercase"
                        style={{ color: tokens.eyebrowColor }}
                      >
                        {str(pr.year)} Edition
                      </div>
                    )}
                    <div className="text-sm font-bold text-gray800">
                      {str(pr.title)}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray600 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {str(block.referencesNote) && (
          <div className="bg-white rounded-2xl border border-gray200 p-5 text-xs sm:text-sm text-gray600 leading-relaxed">
            <RichText text={str(block.referencesNote)} />
          </div>
        )}
      </section>
    );
  }

  return null;
}

function RichExtractedPageView({
  data,
  content,
  tokens,
  onNavigate,
  onPresent,
}: {
  data: PublicReportPageResponse;
  content: JsonObj;
  tokens: SectorVisualTokens;
  onNavigate: (pageType: string) => void;
  onPresent: (title: string, node: React.ReactNode) => void;
}) {
  const { page, report } = data;
  const badge = str(content.badge);
  const headerTitle = str(content.headerTitle, page.title);
  const leadParagraphs = arr<string>(content.leadParagraphs);
  const jurisdictionNav = arr<JsonObj>(content.jurisdictionNav);
  const insightPager = (content.insightPager || null) as JsonObj | null;
  const prevNav = (content.prevNav || null) as JsonObj | null;
  const nextNav = (content.nextNav || null) as JsonObj | null;
  const blocks = arr<JsonObj>(content.blocks);

  return (
    <div className="space-y-6">
      {insightPager && (
        <div
          className="bg-white rounded-2xl border px-5 py-3.5 flex flex-wrap items-center justify-between gap-3"
          style={{ borderColor: tokens.borderColor }}
        >
          <div className="flex flex-wrap items-center gap-3">
            {str(insightPager.backPageType) && (
              <button
                type="button"
                onClick={() => onNavigate(str(insightPager.backPageType))}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border cursor-pointer hover:opacity-90"
                style={{
                  backgroundColor: tokens.surfaceBg,
                  borderColor: tokens.borderColor,
                  color: tokens.headingColor,
                }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{str(insightPager.backLabel, "Back")}</span>
              </button>
            )}
            {str(insightPager.label) && (
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: tokens.tagBg, color: tokens.tagText }}
              >
                {str(insightPager.label)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {str(insightPager.prevPageType) && (
              <button
                type="button"
                onClick={() => onNavigate(str(insightPager.prevPageType))}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-gray200 bg-white hover:bg-gray-50 text-gray800 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{str(insightPager.prevLabel, "Previous")}</span>
              </button>
            )}
            {str(insightPager.nextPageType) && (
              <button
                type="button"
                data-report-action="primary"
                onClick={() => onNavigate(str(insightPager.nextPageType))}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white cursor-pointer"
                style={{ backgroundColor: tokens.primaryAccent }}
              >
                <span>{str(insightPager.nextLabel, "Next")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <header className="bg-white rounded-2xl border border-gray200 p-6 sm:p-8 space-y-4">
        {badge && (
          <span
            className="inline-block text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border"
            style={{
              backgroundColor: tokens.tagBg,
              color: tokens.tagText,
              borderColor: tokens.borderColor,
            }}
          >
            {badge}
          </span>
        )}
        <h1
          className="text-2xl sm:text-3xl font-bold leading-tight"
          style={{ color: tokens.headingColor }}
        >
          <RichText text={headerTitle} />
        </h1>
        {leadParagraphs.length > 0 && (
          <div className="space-y-3 text-sm sm:text-base text-gray600 leading-relaxed">
            {leadParagraphs.map((p, idx) => (
              <p key={idx}>
                <RichText text={p} />
              </p>
            ))}
          </div>
        )}

        {page.pageType.toLowerCase() === "introduction" && report.pdfFileUrl && (
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              data-report-action="download"
              href={report.pdfFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold no-underline"
              style={{
                backgroundColor: tokens.primaryAccent,
                color: "#FFFFFF",
              }}
            >
              <Download className="w-4 h-4" />
              <span>Download Full Report PDF</span>
            </a>
            {report.psaSectorPageUrl && (
              <a
                href={report.psaSectorPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold border border-gray200 bg-white text-gray800 hover:bg-gray-50 no-underline"
              >
                <span>Public Skills Australia Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {jurisdictionNav.length > 0 && (
          <div className="pt-2 border-t border-gray200 flex flex-wrap items-center gap-2">
            {jurisdictionNav.map((jn, ji) => {
              const jCode = str(jn.code);
              const jPage = str(jn.pageType);
              const active = jPage === page.pageType;
              return (
                <button
                  key={ji}
                  type="button"
                  onClick={() => onNavigate(jPage)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer"
                  style={
                    active
                      ? {
                          backgroundColor: tokens.primaryAccent,
                          borderColor: tokens.primaryAccent,
                          color: "#FFFFFF",
                        }
                      : {
                          backgroundColor: tokens.surfaceBg,
                          borderColor: tokens.borderColor,
                          color: tokens.headingColor,
                        }
                  }
                >
                  {jCode}
                </button>
              );
            })}
          </div>
        )}
      </header>

      <div className="space-y-6">
        {blocks.map((block, idx) => (
          <RichSingleBlock
            key={str(block.id, `blk-${idx}`)}
            block={block}
            data={data}
            tokens={tokens}
            onNavigate={onNavigate}
            onPresent={onPresent}
          />
        ))}
      </div>

      {(prevNav || nextNav) && (
        <div className="bg-white rounded-2xl border border-gray200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            {prevNav && str(prevNav.pageType) && (
              <button
                type="button"
                onClick={() => onNavigate(str(prevNav.pageType))}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border border-gray200 bg-[#FAFAF0] text-gray800 hover:bg-gray-100 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{str(prevNav.label, "Previous")}</span>
              </button>
            )}
          </div>
          <div>
            {nextNav && str(nextNav.pageType) && (
              <button
                type="button"
                data-report-action="primary"
                onClick={() => onNavigate(str(nextNav.pageType))}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-white cursor-pointer"
                style={{ backgroundColor: tokens.primaryAccent }}
              >
                <span>{str(nextNav.label, "Next")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
