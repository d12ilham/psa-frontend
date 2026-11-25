"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  ExternalLink,
} from "lucide-react";
import LocalGovernmentReportUtilityRow from "@/components/reports/local-government/LocalGovernmentReportUtilityRow";
import ReportNavButtons from "@/components/layout/ReportNavButtons";
import AnimatedCounter from "@/components/common/AnimatedCounter";
import AustraliaInteractiveMap from "@/components/common/AustraliaInteractiveMap";
import { useReportReader } from "@/components/reports/useReportReader";
import type { CmsFootnote, PublicReportPageResponse } from "@/lib/cmsApi";

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

export const LG_CUSTOM_UTILITY_PAGES = new Set([
  "workforce_insights",
  "theme1_insight_1",
  "theme1_insight_2",
  "theme1_insight_3",
  "theme2_insight_1",
  "theme2_insight_2",
  "theme2_insight_3",
  "theme2_insight_4",
  "workforce_strategies",
  "update_2025_strategies",
  "existing_strategies",
  "federal_initiatives",
  "looking_forward",
  "downloads",
]);

function renderPlainOrEm(text: string): React.ReactNode {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((p, idx) => {
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2) {
      return <em key={idx}>{p.slice(1, -1)}</em>;
    }
    return <React.Fragment key={idx}>{p}</React.Fragment>;
  });
}

function LgRichInline({
  text,
  boldClassName = "font-semibold text-[#728C28]",
  footnoteHrefPrefix = "#footnote-",
}: {
  text: string;
  boldClassName?: string;
  footnoteHrefPrefix?: string;
}) {
  if (!text) return null;
  const tokens = text.split(
    /(\[[^\]]+\]\(https?:\/\/[^)]+\)|\[\[\d+\]\]|\*\*[^*]+\*\*|\*[^*]+\*|\n)/g
  );
  return (
    <>
      {tokens.map((tok, i) => {
        if (!tok) return null;
        if (tok === "\n") return <br key={i} />;
        const linkMatch = /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/.exec(tok);
        if (linkMatch) {
          return (
            <a
              key={i}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-active underline underline-offset-2 hover:text-lg-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-active"
            >
              {renderPlainOrEm(linkMatch[1])}
            </a>
          );
        }
        const fnMatch = /^\[\[(\d+)\]\]$/.exec(tok);
        if (fnMatch) {
          return (
            <sup key={i}>
              <a
                href={`${footnoteHrefPrefix}${fnMatch[1]}`}
                className="text-inherit no-underline hover:underline"
                aria-label={`Footnote ${fnMatch[1]}`}
              >
                {fnMatch[1]}
              </a>
            </sup>
          );
        }
        if (tok.startsWith("**") && tok.endsWith("**") && tok.length > 4) {
          return (
            <span key={i} className={boldClassName}>
              {tok.slice(2, -2)}
            </span>
          );
        }
        if (tok.startsWith("*") && tok.endsWith("*") && tok.length > 2) {
          return <em key={i}>{tok.slice(1, -1)}</em>;
        }
        return <React.Fragment key={i}>{tok}</React.Fragment>;
      })}
    </>
  );
}

function LgFootnoteRow({ fn }: { fn: CmsFootnote }) {
  const hasInlineLinks =
    fn.text.includes("](") || fn.text.includes("*");
  return (
    <div id={`footnote-${fn.number}`} className="flex items-start gap-2.5 scroll-mt-24">
      <span className="w-5 h-5 rounded-full bg-notes text-white flex items-center justify-center text-xs font-bold shrink-0">
        {fn.number}
      </span>
      <p>
        {hasInlineLinks ? (
          <LgRichInline text={fn.text} />
        ) : (
          <>
            {fn.url ? (
              <a
                href={fn.url}
                target={fn.openInNewTab === false ? "_self" : "_blank"}
                rel="noopener noreferrer"
                className="text-active underline underline-offset-2 hover:text-lg-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-active"
              >
                <em>{fn.sourceName}</em>
              </a>
            ) : (
              <em>{fn.sourceName}</em>
            )}
            {fn.text ? <> — <LgRichInline text={fn.text} /></> : null}
          </>
        )}
      </p>
    </div>
  );
}

function LgSourcesCard({
  heading = "Footnotes",
  footnotes,
  twoColumns = false,
  narrow = false,
}: {
  heading?: string;
  footnotes: CmsFootnote[];
  twoColumns?: boolean;
  narrow?: boolean;
}) {
  if (!footnotes || footnotes.length === 0) return null;

  if (twoColumns) {
    const left = footnotes.filter((_, idx) => idx % 2 === 0);
    const right = footnotes.filter((_, idx) => idx % 2 === 1);
    return (
      <div
        data-report-sources
        className="bg-white border border-gray200 rounded-2xl p-6 sm:p-8 space-y-4"
      >
        <h3 className="font-bold text-xl text-gray800">{heading}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray600 leading-relaxed">
          <div className="space-y-3">
            {left.map((fn) => (
              <LgFootnoteRow key={fn.number} fn={fn} />
            ))}
          </div>
          <div className="space-y-3">
            {right.map((fn) => (
              <LgFootnoteRow key={fn.number} fn={fn} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-report-sources
      className="bg-white border border-gray200 rounded-2xl p-6 sm:p-8 space-y-4"
    >
      <h3 className="font-bold text-xl text-gray800">{heading}</h3>
      <div
        className={`space-y-3 text-xs text-gray600 leading-relaxed ${
          narrow ? "w-full xl:w-2/3" : ""
        }`}
      >
        {footnotes.map((fn) => (
          <LgFootnoteRow key={fn.number} fn={fn} />
        ))}
      </div>
    </div>
  );
}

/* ── 1. INTRODUCTION TEMPLATE ── */
function LgIntroductionCmsView({
  data,
  content,
  onNavigate,
}: {
  data: PublicReportPageResponse;
  content: JsonObj;
  onNavigate: (pt: string) => void;
}) {
  const structureRef = useRef<HTMLDivElement>(null);
  const [isStructureVisible, setIsStructureVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsStructureVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (structureRef.current) observer.observe(structureRef.current);
    return () => observer.disconnect();
  }, []);

  const paragraphs = arr<string>(content.paragraphs);
  const glanceCells = arr<JsonObj>(content.glanceCells);
  const structureCards = arr<JsonObj>(content.structureCards);
  const featureBanners = arr<JsonObj>(content.featureBanners);

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray200 rounded-2xl p-6 flex flex-col lg:flex-row items-start gap-8 lg:gap-8 xl:gap-[100px]">
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="animate-slide-up space-y-2">
              <span className="text-xs font-semibold text-notes uppercase block">
                {str(content.eyebrow, "INTRODUCTION")}
              </span>
              <h1 className="text-3xl font-bold leading-tight text-gray800 sm:text-4xl">
                <span className="lg:block">
                  {str(content.titleLine1, `${data.report.year} Local Government`)}
                </span>{" "}
                <span className="lg:block lg:whitespace-nowrap">
                  {str(content.titleLine2, "Workforce Insights Report")}
                </span>
              </h1>
            </div>
            <div className="space-y-3 animate-slide-up-delay">
              {paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={`${
                    idx === 0 ? "text-sm" : "text-xs sm:text-sm"
                  } text-gray600 leading-relaxed font-normal`}
                >
                  <LgRichInline text={p} />
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
              <span>Download {String(data.report.year || "2026")} PDF</span>
              <Download className="h-3.5 w-3.5" />
            </button>
            <Link
              data-report-action="secondary"
              href={str(
                content.previousReportHref,
                "/reports/local-government-workforce-insights-report-2025/downloads"
              )}
              className="border border-[#B2DB79] bg-[#FAFAF0] hover:bg-gray-50 text-notes font-bold text-xs px-5 py-2.5 rounded-full transition-colors cursor-pointer no-underline"
            >
              Previous Report
            </Link>
            {data.report.psaSectorPageUrl ? (
              <a
                data-report-action="secondary"
                href={data.report.psaSectorPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray200 bg-white hover:bg-gray-50 text-[#252D02] font-bold text-xs px-5 py-2.5 rounded-full transition-colors cursor-pointer no-underline"
              >
                PSA Website
              </a>
            ) : (
              <button
                data-report-action="secondary"
                type="button"
                disabled
                className="border border-gray200 bg-white text-[#252D02] font-bold text-xs px-5 py-2.5 rounded-full"
              >
                PSA Website
              </button>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[360px] xl:w-[444px] lg:shrink-0 bg-[#F5F5F5] border border-gray200/80 rounded-2xl p-5 space-y-4 self-start animate-zoom-in">
          <div>
            <span className="text-xs font-semibold text-notes uppercase mb-4 block">
              {str(content.glanceTitle, "THIS REPORT AT A GLANCE")}
            </span>
            <div className="grid grid-cols-2 gap-3">
              {glanceCells.map((cell, ci) => {
                const pair = arr<JsonObj>(cell.pair);
                if (pair.length > 0) {
                  return (
                    <div
                      key={ci}
                      className="bg-white rounded-xl p-4 border border-gray200/60 flex items-start justify-between gap-4 transition-all duration-300 hover:shadow-xs"
                    >
                      {pair.map((sub, si) => (
                        <div key={si} className="flex flex-col items-start">
                          <span className="text-2xl font-bold text-[#8AC900]">
                            <AnimatedCounter
                              target={num(sub.value)}
                              formatNumber={bool(sub.formatNumber)}
                            />
                          </span>
                          <span className="text-xs font-semibold text-gray600 mt-2 leading-tight">
                            <LgRichInline text={str(sub.label)} />
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return (
                  <div
                    key={ci}
                    className="bg-white rounded-xl p-4 border border-gray200/60 flex flex-col items-start justify-start transition-all duration-300 hover:shadow-xs"
                  >
                    <span className="text-2xl font-bold text-[#8AC900]">
                      <AnimatedCounter
                        target={num(cell.value)}
                        formatNumber={bool(cell.formatNumber)}
                      />
                    </span>
                    <span className="text-xs font-semibold text-gray600 mt-2 leading-tight">
                      <LgRichInline text={str(cell.label)} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div ref={structureRef} id="structure" className="space-y-6">
        <h2
          className={`text-xl sm:text-2xl font-bold text-gray800 border-b border-gray200 pb-3 ${
            isStructureVisible ? "animate-slide-up" : "opacity-0"
          }`}
        >
          {str(
            content.structureHeading,
            `The ${data.report.year} Digital Report Structure`
          )}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {structureCards.map((section, index) => {
            const target = str(section.pageType, "executive_summary");
            const tags = arr<string>(section.tags);
            return (
              <div
                key={index}
                style={
                  isStructureVisible
                    ? { animationDelay: `${index * 0.12 + 0.1}s` }
                    : undefined
                }
                onClick={() => onNavigate(target)}
                className={`bg-white rounded-2xl border border-gray200 border-t-12 border-t-lg-dark p-6 flex flex-col justify-between space-y-6 cursor-pointer transition-all duration-200 hover:border-2 hover:border-[#728C28] ${
                  isStructureVisible
                    ? "animate-card-entrance"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-bold text-gray800 leading-snug mt-1">
                      {str(section.title)}
                    </h3>
                    {str(section.subtitle) && (
                      <p className="text-xs font-medium text-notes leading-relaxed">
                        {str(section.subtitle)}
                      </p>
                    )}
                    <p className="text-xs text-gray600 leading-relaxed">
                      {str(section.description)}
                    </p>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-[#F0F5DF] text-notes text-[10px] font-bold px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 pt-0.5">
                    <img
                      src={str(section.icon, "/images/reports/introduction/Summary.svg")}
                      alt={str(section.title)}
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                </div>

                <div>
                  <button
                    data-report-action="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(target);
                    }}
                    className="bg-lg-light text-[#1B240E] font-bold text-xs px-5 py-2 rounded-full flex items-center gap-1.5 cursor-pointer"
                  >
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featureBanners.map((b, bi) => (
          <div
            key={bi}
            data-report-surface="neutral"
            className="bg-[#F0F5DF] border border-gray200 rounded-2xl p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={str(b.icon, "/images/reports/introduction/About.svg")}
                alt={str(b.title)}
                className="w-12 h-12 shrink-0 object-contain"
              />
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-sm text-gray800">{str(b.title)}</h4>
                <p className="text-xs text-gray600">{str(b.description)}</p>
              </div>
            </div>
            <button
              data-report-action="primary"
              onClick={() => onNavigate(str(b.pageType, "about"))}
              className="bg-[#8AC900] hover:bg-[#77A60D] text-[#252D02] font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              View <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 2. ABOUT PSA TEMPLATE ── */
function LgAboutCmsView({
  data,
  content,
}: {
  data: PublicReportPageResponse;
  content: JsonObj;
}) {
  const undertakesRef = useRef<HTMLDivElement>(null);
  const [isUndertakesVisible, setIsUndertakesVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsUndertakesVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (undertakesRef.current) observer.observe(undertakesRef.current);
    return () => observer.disconnect();
  }, []);

  const partnership = (content.partnership || {}) as JsonObj;
  const cards = arr<JsonObj>(content.cards);
  const commitment = (content.commitment || {}) as JsonObj;
  const footnotes = data.page.footnotes || [];

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray200 rounded-2xl p-6 relative overflow-hidden space-y-6">
        <img
          src={str(content.waveImage, "/images/wave-right.png")}
          alt=""
          className="absolute top-0 right-0 w-80 pointer-events-none opacity-40 z-0 object-contain object-top-right select-none animate-hero-rotate"
        />

        <div className="relative z-10 max-w-3xl space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray800 animate-slide-up">
            {str(content.title, "About Public Skills Australia")}
          </h1>
          <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal animate-slide-up-delay">
            <LgRichInline text={str(content.intro)} />
          </p>
        </div>

        <div className="relative z-10 border border-gray200 rounded-2xl p-5 max-w-2xl flex items-start gap-4">
          <img
            src={str(
              partnership.icon,
              "/images/reports/about/working-in-partnership.svg"
            )}
            alt={str(partnership.title, "Working in partnership")}
            className="w-16 h-16 shrink-0 object-contain animate-zoom-in"
          />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-gray800">
              {str(partnership.title, "Working in partnership")}
            </h3>
            <p className="text-xs text-gray600 leading-relaxed">
              <LgRichInline text={str(partnership.text)} />
            </p>
          </div>
        </div>
      </div>

      <div ref={undertakesRef} className="space-y-6">
        <div className="border-b border-gray200 pb-3">
          <h2
            className={`text-xl sm:text-2xl font-bold text-gray800 ${
              isUndertakesVisible ? "animate-slide-up" : "opacity-0"
            }`}
          >
            {str(content.sectionHeading, "Public Skills Australia:")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              style={
                isUndertakesVisible
                  ? { animationDelay: `${0.1 + idx * 0.12}s` }
                  : undefined
              }
              className={`bg-white rounded-2xl border border-gray200 p-6 space-y-4 flex flex-col justify-between cursor-pointer group relative transition-all duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] hover:border-lg-dark hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] ${
                isUndertakesVisible
                  ? "animate-card-entrance"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <div className="space-y-5">
                <img
                  src={str(card.icon, "/images/reports/about/Workforce.svg")}
                  alt={str(card.title)}
                  className="w-16 h-16 shrink-0 object-contain group-hover:scale-110 transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)]"
                />
                <h3 className="font-bold text-base text-gray800 group-hover:text-lg-dark transition-colors duration-500 leading-snug">
                  {str(card.title)}
                </h3>
                <p className="text-xs text-gray600 leading-relaxed">
                  <LgRichInline text={str(card.text)} />
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray200 p-6 flex flex-col sm:flex-row items-start gap-5">
          <img
            src={str(commitment.icon, "/images/reports/about/Commitment.svg")}
            alt={str(commitment.title, "Our commitment")}
            className="w-16 h-16 shrink-0 object-contain"
          />
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-base text-gray800">
              {str(commitment.title, "Our commitment")}
            </h3>
            <p className="text-sm text-gray600 leading-relaxed w-full xl:w-2/3">
              <LgRichInline text={str(commitment.text)} />
            </p>
          </div>
        </div>

        {footnotes.map((fn) => (
          <div
            key={fn.number}
            id={`footnote-${fn.number}`}
            data-report-surface="neutral"
            className="bg-[#F0F5DF] border border-gray200 rounded-2xl p-6 text-xs text-gray600 leading-relaxed scroll-mt-24"
          >
            <p className="w-full xl:w-2/3">
              {fn.number}. <LgRichInline text={fn.text} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 3. METHODOLOGY TEMPLATE ── */
function LgMethodologyCmsView({
  data,
  content,
  onNavigate,
}: {
  data: PublicReportPageResponse;
  content: JsonObj;
  onNavigate: (pt: string) => void;
}) {
  const researchRef = useRef<HTMLDivElement>(null);
  const governanceRef = useRef<HTMLDivElement>(null);
  const sourcesRef = useRef<HTMLDivElement>(null);
  const [isResearchVisible, setIsResearchVisible] = useState(true);
  const [isGovernanceVisible, setIsGovernanceVisible] = useState(true);
  const [isSourcesVisible, setIsSourcesVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === researchRef.current) setIsResearchVisible(true);
            else if (entry.target === governanceRef.current) setIsGovernanceVisible(true);
            else if (entry.target === sourcesRef.current) setIsSourcesVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (researchRef.current) observer.observe(researchRef.current);
    if (governanceRef.current) observer.observe(governanceRef.current);
    if (sourcesRef.current) observer.observe(sourcesRef.current);
    return () => observer.disconnect();
  }, []);

  const steps = arr<JsonObj>(content.steps);
  const topSteps = steps.slice(0, 3);
  const bottomSteps = steps.slice(3);
  const repsCard = (content.representativesCard || {}) as JsonObj;
  const research = (content.researchSection || {}) as JsonObj;
  const gov = (content.governanceSection || {}) as JsonObj;
  const bottomCards = arr<JsonObj>(content.bottomCards);
  const footnotes = data.page.footnotes || [];

  const renderStep = (s: JsonObj, idx: number) => (
    <div
      key={idx}
      style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
      className="animate-card-entrance border border-gray200 rounded-xl p-3.5 bg-white space-y-5"
    >
      <span className="text-xs font-bold text-[#8AC900] uppercase block">
        {str(s.stepLabel, `STEP ${idx + 1}`)}
      </span>
      <div className="flex items-center gap-2">
        <img
          src={str(s.icon, "/images/reports/methodology/Data-sources.svg")}
          alt={str(s.title)}
          className="w-12 h-12 shrink-0 object-contain animate-zoom-in"
        />
        <div>
          <h4 className="font-bold text-xs text-gray800 mb-1">{str(s.title)}</h4>
          {typeof s.count === "number" ? (
            <p className="text-xs text-gray600 font-medium">
              <span className="font-bold text-[#8AC900]">
                <AnimatedCounter target={s.count} />
              </span>{" "}
              {str(s.suffixText)}
            </p>
          ) : (
            <p className="text-xs text-gray600 font-medium">{str(s.subtitle)}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray200 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray800 animate-slide-up">
              {str(content.title, "Methodology")}
            </h1>
            <div className="space-y-3 animate-slide-up-delay">
              {arr<string>(content.introParagraphs).map((p, idx) => (
                <p
                  key={idx}
                  className={`text-xs sm:text-sm text-gray600 leading-relaxed font-normal ${
                    idx === 0 ? "font-medium" : ""
                  }`}
                >
                  <LgRichInline text={p} boldClassName="text-lg-dark" />
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topSteps.map((s, idx) => renderStep(s, idx))}
            </div>
            {bottomSteps.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                {bottomSteps.map((s, idx) => renderStep(s, idx + 3))}
              </div>
            )}
          </div>
        </div>

        <div
          data-report-surface="neutral"
          className="lg:col-span-5 bg-[#F0F5DF] border border-gray200 rounded-2xl p-5 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-bold text-xl text-gray800 leading-snug w-1/2">
                {str(repsCard.title, "Key industry-sector representatives")}
              </h3>
              <img
                src={str(
                  repsCard.icon,
                  "/images/reports/methodology/industry-sector representatives.svg"
                )}
                alt={str(repsCard.title)}
                className="w-16 h-16 shrink-0 object-contain ml-auto animate-zoom-in"
              />
            </div>

            <p className="text-sm font-medium text-gray600 leading-relaxed">
              {str(repsCard.intro)}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {arr<string>(repsCard.items).map((rep, idx) => (
                <div
                  key={idx}
                  style={{ animationDelay: `${idx * 0.04 + 0.15}s` }}
                  className="animate-card-entrance bg-white rounded-lg p-2.5 text-xs font-semibold text-gray700 border border-gray200/60 hover:border-lg-dark hover:shadow-lg hover:-translate-y-1 hover:scale-[1.04] hover:text-lg-dark cursor-pointer relative hover:z-10 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                >
                  {rep}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={researchRef}
        className="bg-white border border-gray200 rounded-2xl p-6 space-y-6"
      >
        <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-medium">
          <LgRichInline text={str(research.paragraph)} />
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {arr<JsonObj>(research.stats).map((st, idx) => (
            <div
              key={idx}
              data-report-surface="neutral"
              style={
                isResearchVisible
                  ? { animationDelay: `${0.1 + idx * 0.12}s` }
                  : undefined
              }
              className={`bg-[#F0F5DF] border border-gray200 rounded-xl p-4 flex items-center gap-3 ${
                isResearchVisible
                  ? "animate-card-entrance"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <span className="text-3xl font-bold text-gray800">
                <AnimatedCounter target={num(st.value)} />
              </span>
              <span className="text-sm font-semibold text-gray600 leading-tight">
                <LgRichInline
                  text={str(st.label)}
                  footnoteHrefPrefix="#methodology-footnote-"
                />
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
          <p className="text-sm text-gray600 font-medium">
            {str(research.appendixText)}
          </p>
          <button
            data-report-action="download"
            onClick={() => onNavigate("downloads")}
            className="bg-lg-dark hover:bg-[#046D2A] text-white font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <span>Download {String(data.report.year || "2026")} PDF</span>
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={governanceRef}
        className="space-y-6 bg-white rounded-2xl border border-gray200 p-6"
      >
        <div>
          <h2
            className={`text-xl font-bold text-gray800 ${
              isGovernanceVisible ? "animate-slide-up" : "opacity-0"
            }`}
          >
            {str(gov.heading)}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {arr<JsonObj>(gov.stages).map((stage, idx) => (
            <div
              key={idx}
              data-report-surface="neutral"
              style={
                isGovernanceVisible
                  ? { animationDelay: `${0.1 + idx * 0.12}s` }
                  : undefined
              }
              className={`bg-[#F0F5DF] rounded-lg p-6 space-y-4 ${
                isGovernanceVisible
                  ? "animate-card-entrance"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <h3 className="font-bold text-xl text-gray800">
                {str(stage.title)}
              </h3>
              {arr<string>(stage.paragraphs).map((p, pi) => (
                <p
                  key={pi}
                  className="text-sm font-medium text-gray600 leading-relaxed"
                >
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div ref={sourcesRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bottomCards.map((bc, idx) => (
          <div
            key={idx}
            style={
              isSourcesVisible
                ? { animationDelay: `${0.1 + idx * 0.12}s` }
                : undefined
            }
            className={`bg-white rounded-2xl border border-gray200 p-6 flex items-start gap-4 ${
              isSourcesVisible
                ? "animate-card-entrance"
                : "opacity-0 translate-y-6"
            }`}
          >
            <img
              src={str(bc.icon)}
              alt={str(bc.title)}
              className="w-16 h-16 shrink-0 object-contain"
            />
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-gray800">{str(bc.title)}</h3>
              <p className="text-sm font-medium text-gray600 leading-relaxed">
                {str(bc.text)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {footnotes.map((fn) => (
        <div
          key={fn.number}
          data-report-surface="neutral"
          id={`methodology-footnote-${fn.number}`}
          className="bg-[#F0F5DF] border border-gray200 rounded-2xl p-6 text-sm font-medium text-gray600 leading-relaxed scroll-mt-24"
        >
          <p className="w-full xl:w-1/2">
            <sup>{fn.number}</sup> <LgRichInline text={fn.text} />
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── SHARED STRATEGY EXPANDED BODY (EXACT STATIC PARITY) ── */
function LgStrategyCardDetails({ strategy }: { strategy: JsonObj }) {
  const approach = str(strategy.approach);
  const approachPartA = str(strategy.approachPartA);
  const approachPartB = str(strategy.approachPartB);
  const deliverable = str(strategy.deliverable);
  const deliverablePartA = str(strategy.deliverablePartA);
  const deliverablePartB = str(strategy.deliverablePartB);
  const anticipatedTiming = str(strategy.anticipatedTiming);
  const anticipatedTimingPartA = str(strategy.anticipatedTimingPartA);
  const anticipatedTimingPartB = str(strategy.anticipatedTimingPartB);
  const keyStakeholders = arr<string>(strategy.keyStakeholders);

  return (
    <>
      <div className="space-y-1">
        <h5 className="text-xs sm:text-sm font-bold text-gray800">
          JSC Function:
        </h5>
        <p className="text-xs sm:text-sm text-gray600">
          {str(strategy.jscFunction)}
        </p>
      </div>

      {approach && (
        <div className="space-y-1">
          <h5 className="text-xs sm:text-sm font-bold text-gray800">Approach:</h5>
          <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
            {approach}
          </p>
        </div>
      )}

      {approachPartA && (
        <div className="space-y-1">
          <h5 className="text-xs sm:text-sm font-bold text-gray800">
            Approach – Part A:
          </h5>
          <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
            {approachPartA}
          </p>
        </div>
      )}

      {approachPartB && (
        <div className="space-y-1">
          <h5 className="text-xs sm:text-sm font-bold text-gray800">
            Approach – Part B (optional):
          </h5>
          <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
            {approachPartB}
          </p>
        </div>
      )}

      {(deliverable || deliverablePartA || deliverablePartB) && (
        <div className="space-y-1">
          <h5 className="text-xs sm:text-sm font-bold text-gray800">
            Deliverable:
          </h5>
          <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
            {deliverable ? (
              deliverable
            ) : (
              <>
                Part A: {deliverablePartA}
                {deliverablePartB && (
                  <>
                    <br />
                    Part B: {deliverablePartB}
                  </>
                )}
              </>
            )}
          </p>
        </div>
      )}

      <div className="space-y-1">
        <h5 className="text-xs sm:text-sm font-bold text-gray800">Impact:</h5>
        <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
          {str(strategy.impact)}
        </p>
      </div>

      {(anticipatedTiming || anticipatedTimingPartA || anticipatedTimingPartB) && (
        <div className="space-y-1">
          <h5 className="text-xs sm:text-sm font-bold text-gray800">
            Anticipated timing:
          </h5>
          <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
            {anticipatedTiming ? (
              anticipatedTiming
            ) : (
              <>
                Part A: {anticipatedTimingPartA}
                {anticipatedTimingPartB && (
                  <>
                    <br />
                    Part B: {anticipatedTimingPartB}
                  </>
                )}
              </>
            )}
          </p>
        </div>
      )}

      {keyStakeholders.length > 0 && (
        <div className="space-y-1">
          <h5 className="text-xs sm:text-sm font-bold text-gray800">
            Key stakeholders:
          </h5>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray600 leading-relaxed">
            {keyStakeholders.map((stakeholder) => (
              <li key={stakeholder}>{stakeholder}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

/* ── 4. EXECUTIVE SUMMARY TEMPLATE ── */
function LgExecutiveSummaryCmsView({
  data,
  content,
  onNavigate,
}: {
  data: PublicReportPageResponse;
  content: JsonObj;
  onNavigate: (pt: string) => void;
}) {
  const [openThemeOverviews, setOpenThemeOverviews] = useState<Record<number, boolean>>({});
  const [openStrategies, setOpenStrategies] = useState<Record<number, boolean>>({});
  const flowImages = arr<JsonObj>(content.flowImages);
  const driversBanner = (content.driversBanner || {}) as JsonObj;
  const themesHeader = (content.themesHeader || {}) as JsonObj;
  const themes = arr<JsonObj>(content.themes);
  const strategiesHeader = (content.strategiesHeader || {}) as JsonObj;
  const strategies = arr<JsonObj>(content.strategies);
  const lookingForwardBanner = (content.lookingForwardBanner || {}) as JsonObj;
  const supportingLinks = arr<JsonObj>(content.supportingLinks);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray200 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-lg-dark animate-slide-up">
            {str(content.title, "Executive Summary")}
          </h1>
          <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal animate-slide-up-delay">
            <LgRichInline
              text={str(content.intro)}
              boldClassName="font-semibold text-lg-dark"
            />
          </p>
        </div>

        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end overflow-x-auto py-2">
          <div className="flex items-center justify-center shrink-0">
            {flowImages.map((img, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <div
                    className="animate-flow-separator flex flex-col justify-center gap-1 w-5 sm:w-7 md:w-8 lg:w-6 xl:w-8 -mx-[1px] relative z-0 shrink-0"
                    style={{ animationDelay: `${0.35 + (idx - 1) * 0.5}s` }}
                  >
                    <div className="h-[2px] w-full bg-[#8AC900]" />
                    <div className="h-[2px] w-full bg-[#8AC900]" />
                  </div>
                )}
                <div
                  className="animate-flow-item relative z-10 shrink-0"
                  style={{ animationDelay: `${0.1 + idx * 0.5}s` }}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-18 lg:h-18 xl:w-22 xl:h-22 rounded-full select-none">
                    <img
                      src={str(img.src)}
                      alt={str(img.alt)}
                      className="w-full h-full object-contain select-none pointer-events-none"
                    />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Section Banner 1: Drivers of Change */}
      <div className="bg-white rounded-2xl border border-gray200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E5E8DA] text-notes flex items-center justify-center shrink-0">
            <img
              src={str(driversBanner.icon, "/images/drivers-of-change-icon.svg")}
              alt={str(driversBanner.title, "Drivers of Change")}
              className="h-7 object-contain"
            />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray800 pb-2">
              {str(driversBanner.title, "Drivers of Change")}
            </h3>
            <p className="text-xs text-gray600 leading-relaxed w-full xl:w-2/3">
              <LgRichInline text={str(driversBanner.description)} />
            </p>
          </div>
        </div>
        <button
          data-report-action="primary"
          onClick={() =>
            onNavigate(str(driversBanner.targetPageType, "drivers_of_change"))
          }
          className="bg-[#8AC900] text-gray800 font-bold text-xs px-5 py-2.5 rounded-full hidden md:flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          {str(driversBanner.buttonLabel, "Present Drivers of Change")}{" "}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Section 2: Two Themes, Seven Workforce Insights */}
      <div className="bg-white rounded-2xl border border-gray200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray200">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E5E8DA] text-notes flex items-center justify-center shrink-0">
              <img
                src={str(themesHeader.icon, "/images/work-force.svg")}
                alt={str(themesHeader.title)}
                className="h-7 object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray800 pb-2">
                {str(themesHeader.title, "Two Themes, Seven Workforce Insights")}
              </h3>
              <p className="text-xs text-gray600 leading-relaxed max-w-3xl">
                <LgRichInline text={str(themesHeader.description)} />
              </p>
            </div>
          </div>
          <button
            data-report-action="primary"
            onClick={() =>
              onNavigate(str(themesHeader.targetPageType, "workforce_insights"))
            }
            className="bg-[#8AC900] text-gray800 font-bold text-xs px-5 py-2.5 rounded-full hidden md:flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {str(themesHeader.buttonLabel, "Present Workforce Insights")}{" "}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {themes.map((theme, tIdx) => {
            const isOpen = !!openThemeOverviews[tIdx];
            const borderCol = str(theme.borderColor, tIdx === 0 ? "#9CAA54" : "#046D2A");
            const insights = arr<JsonObj>(theme.insights);
            return (
              <div
                key={tIdx}
                style={{
                  animationDelay: `${0.1 + tIdx * 0.12}s`,
                  borderTopColor: borderCol,
                }}
                className="animate-card-entrance bg-white rounded-2xl border border-gray200 border-t-12 p-6 space-y-6"
              >
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#728C28] uppercase block">
                    {str(theme.eyebrow)}
                  </span>
                  <h3 className="text-xl font-bold text-gray800">
                    {str(theme.title)}
                  </h3>
                  <button
                    data-report-action="primary"
                    onClick={() =>
                      setOpenThemeOverviews((prev) => ({
                        ...prev,
                        [tIdx]: !prev[tIdx],
                      }))
                    }
                    className="bg-[#8AC900] text-gray800 text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer flex items-center gap-1"
                  >
                    Theme Overview {isOpen ? "▴" : "▾"}
                  </button>

                  <div
                    className={`grid transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="overflow-hidden min-h-0">
                      <div
                        className={`transition-opacity duration-[1000ms] ease-out pt-2 text-xs text-gray600 leading-relaxed space-y-2 font-normal ${
                          isOpen ? "opacity-100 delay-150" : "opacity-0"
                        }`}
                      >
                        {arr<string>(theme.overviewParagraphs).map((p, pi) => (
                          <p key={pi}>
                            <LgRichInline text={p} />
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {insights.map((ins, iIdx) => {
                    const target = str(ins.targetPageType);
                    return (
                      <div
                        key={iIdx}
                        style={{ animationDelay: `${0.15 + iIdx * 0.12}s` }}
                        onClick={() => target && onNavigate(target)}
                        className="animate-card-entrance theme-insight-item bg-[#FAFAF0] border border-gray200 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-[50px] font-bold text-notes/10 leading-none">
                            {str(ins.number, String(iIdx + 1))}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-[#728C28] block mb-1">
                              {str(ins.eyebrow)}
                            </span>
                            <p className="text-xs text-gray600 leading-relaxed">
                              <LgRichInline text={str(ins.text)} />
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {str(content.terminologyNote) && (
          <p className="text-xs text-gray600 leading-relaxed pt-3">
            <LgRichInline text={str(content.terminologyNote)} />
          </p>
        )}
      </div>

      {/* Section 3: 2026 Proposed Strategies */}
      <div className="bg-white rounded-2xl border border-gray200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray200">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E5E8DA] text-notes flex items-center justify-center shrink-0">
              <img
                src={str(strategiesHeader.icon, "/images/stratergies.svg")}
                alt={str(strategiesHeader.title)}
                className="h-6 object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray800 pb-2">
                {str(
                  strategiesHeader.title,
                  "2026 Proposed Local Government Workforce Strategies"
                )}
              </h3>
              <p className="text-xs text-gray600 leading-relaxed">
                {str(strategiesHeader.description)}
              </p>
            </div>
          </div>
          <button
            data-report-action="primary"
            onClick={() =>
              onNavigate(
                str(strategiesHeader.targetPageType, "workforce_strategies")
              )
            }
            className="bg-[#8AC900] text-gray800 font-bold text-xs px-5 py-2.5 rounded-full hidden md:flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {str(strategiesHeader.buttonLabel, "Present 2026 Strategies")}{" "}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {strategies.map((st, si) => {
            const isOpen = !!openStrategies[si];
            const borderCol = str(st.borderColor, si === 0 ? "#9CAA54" : "#046D2A");
            return (
              <div
                key={si}
                style={{
                  animationDelay: `${0.1 + si * 0.12}s`,
                  borderTopColor: borderCol,
                }}
                className="animate-card-entrance bg-white rounded-2xl border border-gray200 border-t-12 p-6 space-y-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="text-white text-xs font-bold px-3 py-1 rounded-full uppercase"
                    style={{ backgroundColor: borderCol }}
                  >
                    {str(st.badge, `STRATEGY ${si + 1}`)}
                  </span>
                  <button
                    data-report-action="primary"
                    onClick={() =>
                      setOpenStrategies((prev) => ({ ...prev, [si]: !prev[si] }))
                    }
                    className="bg-[#8AC900] text-[#1B240E] text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer flex items-center gap-1"
                  >
                    {isOpen ? "Close ▴" : "Open ▾"}
                  </button>
                </div>

                <h4 className="font-bold text-base text-gray800 leading-snug">
                  {str(st.title)}
                </h4>

                <p className="text-xs text-gray600 leading-relaxed">
                  <span className="font-bold text-gray800">Objective: </span>
                  {str(st.objective)}
                </p>

                <div
                  className={`grid transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden min-h-0">
                    <div
                      className={`transition-opacity duration-[1000ms] ease-out pt-4 border-t border-gray200 space-y-4 ${
                        isOpen ? "opacity-100 delay-150" : "opacity-0"
                      }`}
                    >
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-[#F0F5DF] text-notes text-xs font-bold px-3.5 py-1.5 rounded-full">
                          Workforce Insight: {str(st.workforceInsight)}
                        </span>
                      </div>
                      <LgStrategyCardDetails strategy={st} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Banner 4: 2027 and Beyond */}
      <div className="bg-white rounded-2xl border border-gray200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E5E8DA] text-notes flex items-center justify-center shrink-0">
            <img
              src={str(lookingForwardBanner.icon, "/images/2027-and-beyond.svg")}
              alt={str(lookingForwardBanner.title, "2027 and Beyond")}
              className="h-6 object-contain"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-base text-gray800">
              {str(lookingForwardBanner.title, "2027 and Beyond")}
            </h3>
            <p className="text-xs text-gray600 leading-relaxed max-w-3xl">
              <LgRichInline text={str(lookingForwardBanner.description)} />
            </p>
          </div>
        </div>
        <button
          data-report-action="primary"
          onClick={() =>
            onNavigate(str(lookingForwardBanner.targetPageType, "looking_forward"))
          }
          className="bg-[#8AC900] text-gray800 font-bold text-xs px-5 py-2.5 rounded-full hidden md:flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          {str(lookingForwardBanner.buttonLabel, "View 2027 and Beyond")}{" "}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Supporting Sections Row */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <span className="font-semibold text-2xl text-gray800 mr-2">
          Supporting Sections:
        </span>
        {supportingLinks.map((lnk, li) => (
          <button
            key={li}
            data-report-action="secondary"
            onClick={() => onNavigate(str(lnk.pageType))}
            className="border border-[#B2DB79] bg-[#FAFAF0] text-notes font-semibold text-xs px-4 py-2 rounded-full cursor-pointer"
          >
            {str(lnk.label)}
          </button>
        ))}
      </div>

      <LgSourcesCard heading="Footnotes" footnotes={data.page.footnotes || []} />
    </div>
  );
}

/* ── 5. DRIVERS OF CHANGE TEMPLATE ── */
function LgDriversOfChangeCmsView({
  data,
  content,
}: {
  data: PublicReportPageResponse;
  content: JsonObj;
}) {
  const [activeDriverId, setActiveDriverId] = useState<number | null>(null);
  const [activeMegatrendId, setActiveMegatrendId] = useState<string | null>(null);
  const [isHeroMounted, setIsHeroMounted] = useState(false);

  useEffect(() => {
    setIsHeroMounted(true);
    if (
      typeof window !== "undefined" &&
      (window.location.hash === "#nine-megatrends" ||
        window.location.hash === "#megatrends")
    ) {
      const el = document.getElementById("nine-megatrends");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, []);

  const drivers = arr<JsonObj>(content.drivers);
  const megatrends = arr<JsonObj>(content.megatrends);
  const activeDriver = drivers.find((d) => num(d.id) === activeDriverId);
  const activeMegatrend = megatrends.find((m) => str(m.id) === activeMegatrendId);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray200 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray800 animate-slide-up">
            {str(content.title, "Drivers of Change")}
          </h1>
          <div className="space-y-3 animate-slide-up-delay">
            {arr<string>(content.introParagraphs).map((p, idx) => (
              <p
                key={idx}
                className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal"
              >
                <LgRichInline text={p} />
              </p>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 flex justify-center lg:justify-end p-2">
          <div
            className={`flex items-center justify-center ${
              isHeroMounted ? "animate-drivers-pop-settle" : "opacity-0"
            }`}
          >
            <img
              src={str(
                content.diagramImage,
                "/images/reports/drivers-of-change-diagram.png"
              )}
              alt="Drivers of Change Diagram"
              className={`h-auto max-h-48 object-contain select-none pointer-events-none ${
                isHeroMounted ? "animate-drivers-spin" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: FOUR KEY DRIVERS */}
      <div className="space-y-6">
        <div className="border-b border-gray200 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray800">
            Four Key Drivers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {drivers.map((driver, index) => {
            const dId = num(driver.id, index + 1);
            const isActive = activeDriverId === dId;
            return (
              <React.Fragment key={dId}>
                <div
                  data-report-surface={isActive ? undefined : "neutral"}
                  style={{ animationDelay: `${index * 0.12}s` }}
                  onClick={() => setActiveDriverId(isActive ? null : dId)}
                  className={`animate-card-entrance h-full rounded-2xl border p-6 space-y-4 flex flex-col justify-between cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-[#EBF1E4] border-active border-2 border-t-8"
                      : "bg-white border-gray200 border-t-8 border-t-[#8AC900] hover:border-2 hover:border-[#728C28]"
                  }`}
                >
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-notes uppercase block">
                      {str(driver.number)}
                    </span>
                    <h3 className="font-bold text-base text-gray800 leading-snug">
                      {str(driver.shortTitle)}
                    </h3>
                    <p className="text-xs text-gray600 leading-relaxed">
                      {str(driver.shortDesc)}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      data-report-action="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDriverId(isActive ? null : dId);
                      }}
                      className="bg-[#8AC900] hover:bg-[#77A60D] text-[#1B240E] font-bold text-xs px-4 py-1.5 rounded-full cursor-pointer transition-colors"
                    >
                      {isActive ? "Close ▴" : "Open ▾"}
                    </button>
                  </div>
                </div>

                <div
                  className={`md:hidden grid transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive
                      ? "grid-rows-[1fr] opacity-100 mt-3"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none mt-0"
                  }`}
                >
                  <div className="overflow-hidden min-h-0">
                    {isActive && (
                      <div className="animate-content-switch bg-[#EBF1E4] border-2 border-active border-l-8 rounded-2xl p-5 space-y-4">
                        <span className="bg-active text-white font-bold text-xs px-4 py-1.5 rounded-full uppercase inline-block">
                          NOW PRESENTING - {str(driver.number)}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-gray800">
                          {str(driver.fullTitle)}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                          <LgRichInline text={str(driver.fullDesc)} />
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div
          className={`hidden md:grid transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            activeDriver
              ? "grid-rows-[1fr] opacity-100 mt-6"
              : "grid-rows-[0fr] opacity-0 pointer-events-none mt-0"
          }`}
        >
          <div className="overflow-hidden min-h-0">
            {activeDriver && (
              <div
                key={`desktop-driver-${activeDriverId}`}
                className="animate-content-switch bg-[#EBF1E4] border-2 border-active border-l-8 rounded-2xl p-6"
              >
                <div className="space-y-4">
                  <span className="bg-active text-white font-bold text-xs px-5 py-1.5 rounded-full uppercase inline-block">
                    NOW PRESENTING - {str(activeDriver.number)}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-gray800 w-2/3">
                    {str(activeDriver.fullTitle)}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray600 leading-relaxed w-full xl:w-2/3">
                    <LgRichInline text={str(activeDriver.fullDesc)} />
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: NINE MEGATRENDS */}
      <div id="nine-megatrends" className="space-y-6">
        <div className="border-b border-gray200 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray800">
            Nine Megatrends
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2 items-stretch">
          {megatrends.map((item, index) => {
            const mId = str(item.id, `m-${index}`);
            const isActive = activeMegatrendId === mId;
            const iconPath = str(item.icon);
            return (
              <React.Fragment key={mId}>
                <div
                  data-report-surface={isActive ? undefined : "neutral"}
                  style={{ animationDelay: `${index * 0.06}s` }}
                  onClick={() => setActiveMegatrendId(isActive ? null : mId)}
                  className={`animate-card-entrance h-full rounded-2xl border px-2 py-4 flex flex-col items-center justify-between text-center space-y-3 cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-[#EBF1E4] border-active border-2"
                      : "bg-white border-gray200 hover:border-2 hover:border-[#728C28]"
                  }`}
                >
                  <img
                    src={
                      isActive ? iconPath.replace(".svg", "-active.svg") : iconPath
                    }
                    alt={str(item.title)}
                    className="w-17 h-17 shrink-0 object-contain"
                  />
                  <p
                    className={`w-full min-h-9 text-balance break-normal hyphens-none text-xs font-semibold leading-normal ${
                      isActive ? "text-active" : "text-gray600"
                    }`}
                  >
                    {str(item.title)}
                  </p>
                </div>

                <div
                  className={`col-span-2 md:hidden grid transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive
                      ? "grid-rows-[1fr] opacity-100 mt-2"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none mt-0"
                  }`}
                >
                  <div className="overflow-hidden min-h-0">
                    {isActive && (
                      <div className="animate-content-switch bg-[#EBF1E4] border-2 border-active border-l-8 rounded-2xl p-5 space-y-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray800">
                          {str(item.title)}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                          {str(item.desc)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div
          className={`hidden md:grid transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            activeMegatrend
              ? "grid-rows-[1fr] opacity-100 mt-4"
              : "grid-rows-[0fr] opacity-0 pointer-events-none mt-0"
          }`}
        >
          <div className="overflow-hidden min-h-0">
            {activeMegatrend && (
              <div
                key={`desktop-megatrend-${activeMegatrendId}`}
                className="animate-content-switch bg-[#EBF1E4] border-2 border-active border-l-8 rounded-2xl p-6 space-y-2"
              >
                <h3 className="text-xl font-bold text-gray800">
                  {str(activeMegatrend.title)}
                </h3>
                <p className="text-sm text-gray600 leading-relaxed w-full">
                  {str(activeMegatrend.desc)}
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray800 leading-relaxed pt-2 w-full xl:w-2/3">
          <LgRichInline
            text={str(content.closingParagraph)}
            boldClassName="font-semibold text-lg-dark"
          />
        </p>
      </div>

      <LgSourcesCard
        heading="Sources"
        footnotes={data.page.footnotes || []}
        narrow
      />
    </div>
  );
}

/* ── 6. INDUSTRY OVERVIEW TEMPLATE ── */
function LgIndustryOverviewCmsView({
  data,
  content,
  shellSlug,
  onNavigate,
}: {
  data: PublicReportPageResponse;
  content: JsonObj;
  shellSlug: string;
  onNavigate: (pt: string) => void;
}) {
  const [isHeroMounted, setIsHeroMounted] = useState(false);
  useEffect(() => setIsHeroMounted(true), []);

  const stats = arr<JsonObj>(content.stats);
  const wf = (content.workforceSection || {}) as JsonObj;
  const callouts = arr<JsonObj>(content.callouts);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray200 rounded-2xl p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-lg-dark animate-slide-up">
              <Link
                href={`/reports/${shellSlug}/industry_profile`}
                className="text-inherit"
              >
                {str(content.title, "Local Government Industry-Sector Overview")}
              </Link>
            </h1>
            <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal animate-slide-up-delay">
              <LgRichInline text={str(content.intro)} />
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end p-2">
            <img
              src={str(
                content.heroImage,
                "/images/reports/industry-overview/hero.svg"
              )}
              alt="Industry Overview Diagram"
              className={`h-auto max-h-48 object-contain select-none pointer-events-none ${
                isHeroMounted ? "animate-hero-pulse-settle" : "opacity-0"
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((st, idx) => (
            <div
              key={idx}
              style={{ animationDelay: `${0.15 + idx * 0.12}s` }}
              className="animate-card-entrance bg-white border border-gray200 rounded-xl p-4 flex items-start gap-3.5 transition-all duration-300 hover:shadow-xs"
            >
              <img
                src={str(st.icon)}
                alt=""
                className="w-14 h-14 shrink-0 object-contain"
              />
              <div className="space-y-1">
                {str(st.type) === "split" ? (
                  <>
                    <span className="text-xl sm:text-2xl font-bold text-gray800 block leading-none">
                      <AnimatedCounter target={num(st.targetA)} suffix="%" /> /{" "}
                      <AnimatedCounter target={num(st.targetB)} suffix="%" />
                    </span>
                    <p className="text-xs text-gray600 leading-normal">
                      {str(st.line1)}
                      <br />
                      {str(st.line2)}
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-gray800 block leading-none">
                      <AnimatedCounter
                        target={num(st.target)}
                        formatNumber={bool(st.formatNumber)}
                        suffix={str(st.suffix)}
                      />
                    </span>
                    <p className="text-xs text-gray600 leading-normal">
                      {str(st.description)}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray200 p-6 space-y-4">
        <img
          src={str(
            wf.icon,
            "/images/reports/industry-overview/multidisciplinary.svg"
          )}
          alt={str(wf.title, "A multidisciplinary workforce")}
          className="w-16 h-16 shrink-0 object-contain"
        />
        <h3 className="font-bold text-lg text-gray800">
          {str(wf.title, "A multidisciplinary workforce")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-xs text-gray600 leading-relaxed">
          <p>
            <LgRichInline text={str(wf.leftParagraph)} />
          </p>
          <p>
            <LgRichInline text={str(wf.rightParagraph)} />
          </p>
        </div>
      </div>

      <p className="max-w-4xl text-sm text-gray600 leading-relaxed">
        {str(content.datapointsLead)}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {callouts.map((c, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-gray200 p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <h3 className="font-bold text-base text-gray800">{str(c.title)}</h3>
              <p className="text-xs text-gray600 leading-relaxed">
                <LgRichInline text={str(c.description)} />
              </p>
            </div>
            <div>
              <button
                data-report-action="primary"
                onClick={() => onNavigate(str(c.targetPageType))}
                className="bg-[#8AC900] hover:bg-[#78B300] text-gray800 font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {str(c.buttonLabel)} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <LgSourcesCard
        heading="Sources"
        footnotes={data.page.footnotes || []}
        twoColumns
      />
    </div>
  );
}

/* ── 7. STATE AND TERRITORY WORKFORCE PROFILE TEMPLATE ── */
function LgStateTerritoryCmsView({ content }: { content: JsonObj }) {
  const [viewMode, setViewMode] = useState<"single" | "compare">("single");
  const [compareChartsLoaded, setCompareChartsLoaded] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("NATIONAL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"alpha" | "shortages">("alpha");
  const [ratingFilter, setRatingFilter] = useState<
    "all" | "shortage" | "regional" | "noshortage"
  >("all");

  useEffect(() => {
    if (viewMode === "compare") {
      setCompareChartsLoaded(false);
      const timer = setTimeout(() => setCompareChartsLoaded(true), 150);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  const absUrl = str(content.absSourceUrl);
  const algaUrl = str(content.algaSurveyUrl);
  const statesRaw = (content.statesData || {}) as Record<string, JsonObj>;
  const councilSources = (content.councilSources || {}) as Record<string, JsonObj>;
  const nationalOccupations = arr<JsonObj>(content.nationalOccupations);
  const compareOccupations = arr<JsonObj>(content.compareOccupations);

  const statesForMap: Record<
    string,
    { name: string; employees: string; councils: number }
  > = {};
  for (const [k, v] of Object.entries(statesRaw)) {
    statesForMap[k] = {
      name: str(v.name, k),
      employees: str(v.employees),
      councils: num(v.councils),
    };
  }
  const currentState = statesRaw[selectedState] || statesRaw.NSW || {};
  const maxEmployees = Math.max(
    1,
    ...Object.values(statesRaw).map(
      (s) => Number(str(s.employees).replace(/,/g, "")) || 0
    )
  );

  const selectedRating = {
    all: null,
    shortage: "S",
    regional: "R",
    noshortage: "NS",
  }[ratingFilter];

  const renderBadge = (status: string, badgeType?: string) => {
    if (status === "NS") {
      return (
        <span className="inline-flex items-center justify-center w-10 h-7 rounded-full bg-[#B2DB79] text-gray-900 font-bold text-xs">
          NS
        </span>
      );
    }
    if (status === "R") {
      return (
        <span className="inline-flex items-center justify-center w-10 h-7 rounded-full bg-[#F4F26E] text-gray-900 font-bold text-xs">
          R
        </span>
      );
    }
    if (status === "S") {
      return (
        <span className="inline-flex items-center justify-center w-10 h-7 rounded-full bg-[#AF3800] text-white font-bold text-xs">
          S
        </span>
      );
    }
    if (status === "-" || !status) {
      return (
        <span className="text-gray-400 font-normal text-xs sm:text-sm">-</span>
      );
    }
    if (!isNaN(Number(status))) {
      const colorClass =
        badgeType === "S"
          ? "bg-[#AF3800] text-white"
          : badgeType === "R"
            ? "bg-[#F4F26E] text-gray-900"
            : "bg-[#B2DB79] text-gray-900";
      return (
        <span
          className={`inline-flex items-center justify-center w-10 h-7 rounded-full font-bold text-xs ${colorClass}`}
        >
          {status}
        </span>
      );
    }
    return <span className="text-foreground/40 font-mono text-xs">{status}</span>;
  };

  const renderNationalRating = (status: string) => {
    if (selectedRating && status !== "-" && status !== selectedRating) {
      return <span className="sr-only">Filtered out</span>;
    }
    return renderBadge(status);
  };

  const getCellRatingStyle = (status: string) => {
    if (status === "NS") return "bg-[#B2DB79] text-[#1B240E]";
    if (status === "R") return "bg-[#F4F26E] text-[#1B240E]";
    if (status === "S") return "bg-[#AF3800] text-white";
    return "bg-gray-100 text-gray600";
  };

  const filteredOccupations = nationalOccupations
    .map((item): JsonObj & { shortageCount: number } => {
      const ratings = [
        str(item.aus),
        str(item.nsw),
        str(item.nt),
        str(item.qld),
        str(item.sa),
        str(item.tas),
        str(item.vic),
        str(item.wa),
      ];
      return {
        ...item,
        shortageCount: ratings.filter((r) => r === "S").length,
      };
    })
    .filter((item) => {
      const matchesSearch = str(item.name)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (selectedRating) {
        return [
          item.aus,
          item.nsw,
          item.nt,
          item.qld,
          item.sa,
          item.tas,
          item.vic,
          item.wa,
        ].includes(selectedRating);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "shortages" && a.shortageCount !== b.shortageCount) {
        return b.shortageCount - a.shortageCount;
      }
      return str(a.name).localeCompare(str(b.name), "en-AU");
    });

  const alphabeticalCompare = [...compareOccupations].sort((a, b) =>
    str(a.name).localeCompare(str(b.name), "en-AU")
  );

  const sourceLinkClass =
    "text-active underline underline-offset-2 hover:text-lg-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-active";

  const activeCouncilSource = councilSources[selectedState];
  const renderCouncilCitation = (cs: JsonObj) => {
    const citation = str(cs.citation);
    const title = str(cs.title);
    const href = str(cs.href);
    const pos = citation.indexOf(title);
    if (pos < 0 || !href) return citation;
    return (
      <>
        {citation.slice(0, pos)}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={sourceLinkClass}
        >
          {title}
        </a>
        {citation.slice(pos + title.length)}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray200 rounded-2xl p-6 space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-lg-dark animate-slide-up">
          {str(content.title, "State and Territory Workforce Profile")}
        </h1>

        <div className="pt-2">
          <div className="inline-flex items-center bg-[#F0F5DF] p-1.5 rounded-full border border-gray200">
            <button
              onClick={() => setViewMode("single")}
              className={`px-6 py-2 rounded-full text-sm font-bold cursor-pointer ${
                viewMode === "single"
                  ? "bg-[#8AC900] text-[#252D02]"
                  : "bg-transparent text-notes hover:text-[#1B240E]"
              }`}
            >
              Single state
            </button>
            <button
              onClick={() => setViewMode("compare")}
              className={`px-6 py-2 rounded-full text-sm font-bold cursor-pointer ${
                viewMode === "compare"
                  ? "bg-[#8AC900] text-[#252D02]"
                  : "bg-transparent text-notes hover:text-[#1B240E]"
              }`}
            >
              Compare all states
            </button>
          </div>
        </div>
      </div>

      {viewMode === "single" && (
        <div className="bg-white border border-gray200 rounded-2xl p-6 space-y-8">
          <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-gray200">
            <span className="text-xs font-bold text-notes uppercase mr-3">
              CHOOSE A STATE OR TERRITORY
            </span>
            {["NATIONAL", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"].map(
              (code) => (
                <button
                  key={code}
                  onClick={() => setSelectedState(code)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer text-gray800 ${
                    selectedState === code
                      ? "bg-[#8AC900] border border-[#8AC900]"
                      : "bg-white border border-gray200"
                  }`}
                >
                  {code}
                </button>
              )
            )}
          </div>

          {selectedState === "NATIONAL" ? (
            <div key="NATIONAL" className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  style={{ animationDelay: "0.10s" }}
                  className="animate-card-entrance border border-gray200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-3xl font-bold text-lg-dark block">
                      <AnimatedCounter target={218000} formatNumber={true} />
                    </span>
                    <p className="text-sm font-semibold text-gray600">
                      Local Government employees as of June 2025<sup>25</sup>
                    </p>
                  </div>
                  <div>
                    <div className="border-t border-gray200 mb-3" />
                    <p className="text-xs text-[#416102] leading-relaxed">
                      <sup>25</sup> ABS,{" "}
                      <a
                        href={absUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={sourceLinkClass}
                      >
                        Public Sector Employment and Earnings
                      </a>
                      , 2025, Table 1.
                    </p>
                  </div>
                </div>

                <div
                  style={{ animationDelay: "0.22s" }}
                  className="animate-card-entrance border border-gray200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1">
                    <span className="text-3xl font-bold text-[#9CAA54] block leading-tight">
                      <AnimatedCounter
                        target={49.1}
                        decimals={1}
                        suffix="% Female"
                      />
                    </span>
                    <span className="text-3xl font-bold text-lg-dark block leading-tight">
                      <AnimatedCounter
                        target={50.9}
                        decimals={1}
                        suffix="% Male"
                      />
                    </span>
                    <p className="text-sm font-semibold text-gray600 pt-1">
                      National Workforce Composition<sup>26</sup>
                    </p>
                  </div>
                  <div>
                    <div className="border-t border-gray200 mb-3" />
                    <p className="text-xs text-[#416102] leading-relaxed">
                      <sup>26</sup> ALGA,{" "}
                      <a
                        href={algaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={sourceLinkClass}
                      >
                        2022 Local Government Workforce Skills and Capability Survey
                      </a>
                      , 2022, Table D2.
                    </p>
                  </div>
                </div>

                <div
                  style={{ animationDelay: "0.34s" }}
                  className="animate-card-entrance border border-gray200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-3xl font-bold text-lg-dark block">
                      <AnimatedCounter target={8.2} decimals={1} suffix="%" />
                    </span>
                    <p className="text-sm font-semibold text-gray600">
                      National workforce identifies as First Nations<sup>26</sup>
                    </p>
                  </div>
                  <div>
                    <div className="border-t border-gray200 mb-3" />
                    <p className="text-xs text-[#416102] leading-relaxed">
                      <sup>26</sup> ALGA,{" "}
                      <a
                        href={algaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={sourceLinkClass}
                      >
                        2022 Local Government Workforce Skills and Capability Survey
                      </a>
                      , 2022, Table D2.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div
                  data-report-surface="neutral"
                  className="lg:col-span-5 bg-[#F0F5DF] border border-[#252D02]/13 rounded-2xl p-6 relative flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold text-gray800 pt-1">
                      National
                    </h3>
                  </div>

                  <div className="w-full flex items-center justify-center p-0">
                    <div
                      data-report-surface="neutral"
                      className="w-full border border-[#252D0221] rounded-[12px] overflow-hidden bg-[#F0F5DF]/60"
                    >
                      <AustraliaInteractiveMap
                        selectedState="NATIONAL"
                        stateNameScale={2}
                        onSelectState={setSelectedState}
                        statesData={statesForMap}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-active leading-relaxed pt-1">
                    Source: Australian Bureau of Statistics (ABS),{" "}
                    <a
                      href={absUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={sourceLinkClass}
                    >
                      Public sector employment and earnings
                    </a>
                    , 2025, Table 2 · state and territory Local Government
                    associations (see state profiles for full references).
                  </p>
                </div>

                <div className="lg:col-span-7 bg-white space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 max-w-2xl">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        National Occupation Shortage Comparison
                      </h3>
                    </div>
                    <div className="text-right text-xs text-[#416102] shrink-0 pt-1">
                      <div className="text-[#416102]">
                        {filteredOccupations.length} of{" "}
                        {nationalOccupations.length}
                      </div>
                      <div>occupations shown</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray600 font-normal leading-relaxed">
                    Occupations identified in shortage through the Local
                    Government Skills Audit, compared against the Jobs and Skills
                    Australia Occupational Shortage List (OSL) — Australia-wide
                    and by state and territory.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-lg">
                      <input
                        type="text"
                        placeholder="Search by Occupation"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#FAFAF0] border border-gray200 rounded-full px-5 py-3 text-xs text-gray800 placeholder:text-gray800 focus:outline-none focus:ring-1 focus:ring-[#85B810]"
                      />
                    </div>

                    <div className="inline-flex items-center bg-[#FAFAF0] p-1 rounded-full border border-gray200 shrink-0">
                      <button
                        onClick={() => setSortBy("alpha")}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          sortBy === "alpha"
                            ? "bg-[#8AC900] text-[#252D02]"
                            : "bg-transparent text-notes hover:text-[#1B240E]"
                        }`}
                      >
                        A-Z
                      </button>
                      <button
                        onClick={() => setSortBy("shortages")}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          sortBy === "shortages"
                            ? "bg-[#8AC900] text-[#252D02]"
                            : "bg-transparent text-notes hover:text-[#1B240E]"
                        }`}
                      >
                        Most shortages
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="inline-flex flex-wrap items-center bg-[#FAFAF0] p-1 rounded-full border border-gray200 gap-1">
                      {[
                        ["all", "All Ratings"],
                        ["shortage", "Shortages"],
                        ["regional", "Regional shortage"],
                        ["noshortage", "No Shortage"],
                      ].map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() =>
                            setRatingFilter(
                              key as "all" | "shortage" | "regional" | "noshortage"
                            )
                          }
                          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            ratingFilter === key
                              ? "bg-[#8AC900] text-[#252D02]"
                              : "bg-transparent text-notes hover:text-[#1B240E]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray600 leading-relaxed">
                    Rating filters show matching cells across all jurisdictions.
                    Blank cells are filtered out; dashes mean the occupation was
                    not identified through the Skills Audit. Select All Ratings to
                    restore every rating.
                  </p>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-gray800 pt-1">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-4 h-4 rounded-xs bg-[#B2DB79] inline-block shrink-0" />
                      <span>
                        <strong className="font-bold">NS</strong> = No Shortage
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-4 h-4 rounded-xs bg-[#F4F26E] inline-block shrink-0" />
                      <span>
                        <strong className="font-bold">R</strong> = Regional Shortage
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-4 h-4 rounded-xs bg-[#AF3800] inline-block shrink-0" />
                      <span>
                        <strong className="font-bold">S</strong> = Shortage
                      </span>
                    </div>
                    <div className="text-sm text-gray800 font-normal leading-normal">
                      — = not identified through the Skills Audit in that state or
                      territory
                    </div>
                  </div>

                  <div
                    style={{
                      height: "480px",
                      maxHeight: "480px",
                      overflowY: "auto",
                      overflowX: "auto",
                    }}
                    className="border border-gray200 rounded-xl"
                  >
                    <table
                      style={{
                        borderCollapse: "separate",
                        borderSpacing: 0,
                        width: "100%",
                      }}
                      className="text-left text-xs sm:text-sm"
                    >
                      <thead className="bg-[#F5F5F5]">
                        <tr className="bg-[#F5F5F5] text-[#252D02] font-bold text-xs uppercase">
                          {[
                            "OCCUPATION",
                            "AUS",
                            "NSW",
                            "NT",
                            "QLD",
                            "SA",
                            "TAS",
                            "VIC",
                            "WA",
                          ].map((col, ci) => (
                            <th
                              key={col}
                              style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 20,
                                backgroundColor: "#F5F5F5",
                              }}
                              className={
                                ci === 0
                                  ? "p-4 font-bold text-left tracking-wider border-b border-gray-200 shadow-xs"
                                  : "p-3 text-center border-l border-b border-gray-200 w-16 shadow-xs"
                              }
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {filteredOccupations.map((item) => (
                          <tr
                            key={str(item.name)}
                            className="hover:bg-gray-50/50"
                          >
                            <td className="p-4 font-medium text-gray600 text-xs border-b border-gray-200">
                              <div>{str(item.name)}</div>
                              {str(item.lgSpecific) && (
                                <div className="text-[11px] font-semibold text-notes mt-2">
                                  {str(item.lgSpecific)}
                                </div>
                              )}
                            </td>
                            {["aus", "nsw", "nt", "qld", "sa", "tas", "vic", "wa"].map(
                              (colKey) => (
                                <td
                                  key={colKey}
                                  className="p-2 text-center border-l border-b border-gray-200"
                                >
                                  {renderNationalRating(str((item as JsonObj)[colKey]))}
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-gray200 pt-4">
                    <p className="text-xs text-[#416102] leading-relaxed">
                      Source: Local Government Skills Audit, 2026 · Jobs and
                      Skills Australia Occupational Shortage List (OSL). Open a
                      state or territory profile for the full shortage matrix.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              key={selectedState}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in"
            >
              <div
                data-report-surface="neutral"
                className="lg:col-span-5 bg-[#F0F5DF] border border-[#252D02]/13 rounded-2xl p-6 relative flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold text-gray800 pt-1">
                    {str(currentState.name)}
                  </h3>
                  <div className="shrink-0 -mr-2 flex justify-end">
                    <img
                      src={`/images/reports/state-territory/${selectedState.toLowerCase()}-country.png`}
                      alt={`${str(currentState.name)} Australia Map`}
                      className="w-36 h-24 sm:w-44 sm:h-28 object-contain animate-zoom-in cursor-pointer hover:opacity-85 transition-opacity"
                      title="Click to view full Australia map"
                      onClick={() => setSelectedState("NATIONAL")}
                    />
                  </div>
                </div>

                <div className="relative w-full -mt-2 flex items-center justify-center">
                  <AustraliaInteractiveMap
                    selectedState={selectedState}
                    onSelectState={setSelectedState}
                    statesData={statesForMap}
                  />
                </div>

                <p className="text-xs text-active leading-relaxed pt-2">
                  Zoomed in from the national map — switch jurisdictions with the
                  selector above, or return to National for the Australia-wide
                  dashboard.
                </p>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray800">
                    {str(currentState.name)}
                  </h2>
                  <span className="bg-lg-dark text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase">
                    LOCAL GOVERNMENT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    style={{ animationDelay: "0.10s" }}
                    className="animate-card-entrance bg-white border border-gray200 rounded-2xl p-5 space-y-2"
                  >
                    <span className="text-3xl font-bold text-lg-dark block">
                      <AnimatedCounter
                        key={`${selectedState}-emp`}
                        target={
                          Number(str(currentState.employees).replace(/,/g, "")) ||
                          0
                        }
                        formatNumber={true}
                      />
                    </span>
                    <p className="text-xs font-bold text-gray600">Employees</p>
                    <div className="border-t border-gray-100 my-2" />
                    <p className="text-xs text-active">
                      Source: Australian Bureau of Statistics (ABS),{" "}
                      <a
                        href={absUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={sourceLinkClass}
                      >
                        Public sector employment and earnings
                      </a>
                      , 2025, Table 2.
                    </p>
                  </div>

                  <div
                    style={{ animationDelay: "0.22s" }}
                    className="animate-card-entrance bg-white border border-gray200 rounded-2xl p-5 space-y-2"
                  >
                    <span className="text-3xl font-bold text-lg-dark block">
                      <AnimatedCounter
                        key={`${selectedState}-councils`}
                        target={num(currentState.councils)}
                      />
                    </span>
                    <p className="text-xs font-bold text-gray600">
                      Local councils
                      {activeCouncilSource && (
                        <sup>{num(activeCouncilSource.footnote)}</sup>
                      )}
                    </p>
                    <div className="border-t border-gray-100 my-2" />
                    {activeCouncilSource && (
                      <p className="text-xs text-active">
                        <sup>{num(activeCouncilSource.footnote)}</sup>{" "}
                        {renderCouncilCitation(activeCouncilSource)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Section 1 */}
                <div
                  style={{ animationDelay: "0.30s" }}
                  className="animate-card-entrance space-y-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-[#9CAA54] text-white font-bold text-xl flex items-center justify-center shrink-0">
                      1
                    </span>
                    <h4 className="font-bold text-xl text-[#9CAA54]">
                      Skills Audit List
                    </h4>
                  </div>

                  <div
                    data-report-surface="neutral"
                    className="bg-[#EBF1E4] border border-lg-dark border-l-8 border-l-lg-dark rounded-2xl p-5 space-y-5"
                  >
                    <span className="text-xl font-bold text-lg-dark uppercase block">
                      TOP 5 OCCUPATIONAL SHORTAGES
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {arr<string>(currentState.topShortages).map((item, idx) => (
                        <span
                          key={idx}
                          style={{ animationDelay: `${0.35 + idx * 0.06}s` }}
                          className="animate-card-entrance bg-lg-dark text-white text-[11px] font-semibold px-4 py-2 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-active pt-4 mt-5 border-t border-[#D5D7DA]">
                      Source : Local Government Skills Audit consultations, 2026.
                    </p>
                  </div>
                </div>

                {/* Section 2 */}
                <div
                  style={{ animationDelay: "0.42s" }}
                  className="animate-card-entrance space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-[#9CAA54] text-white font-bold text-xl flex items-center justify-center shrink-0">
                      2
                    </span>
                    <h4 className="font-bold text-xl text-[#9CAA54]">
                      Validation against the Jobs and Skills Australia Occupation
                      Shortage List (OSL)
                    </h4>
                  </div>

                  <div className="bg-white border border-gray200 rounded-2xl p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <span className="uppercase text-notes font-semibold text-sm">
                        NATIONAL SHORTAGES — {str(currentState.code)}
                      </span>
                      <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-[#252D02]">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-xs bg-[#B2DB79] inline-block shrink-0" />
                          <span>
                            <strong className="font-bold">NS</strong> = No Shortage
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-xs bg-[#F4F26E] inline-block shrink-0" />
                          <span>
                            <strong className="font-bold">R</strong> = Regional
                            Shortage
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-xs bg-[#AF3800] inline-block shrink-0" />
                          <span>
                            <strong className="font-bold">S</strong> = Shortage
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        height: "260px",
                        maxHeight: "260px",
                        overflowY: "auto",
                      }}
                      className="border border-gray200 rounded-xl"
                    >
                      <table
                        style={{
                          borderCollapse: "separate",
                          borderSpacing: 0,
                          width: "100%",
                        }}
                        className="text-left text-sm"
                      >
                        <thead className="bg-[#F5F5F5]">
                          <tr className="bg-[#F5F5F5] text-[#252D02] font-bold">
                            <th
                              style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 20,
                                backgroundColor: "#F5F5F5",
                              }}
                              className="p-4 font-bold leading-snug border-b border-gray-200 shadow-xs"
                            >
                              Occupation identified in shortage in{" "}
                              {str(currentState.code)} through Skills Audit
                            </th>
                            <th
                              style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 20,
                                backgroundColor: "#F5F5F5",
                              }}
                              className="p-4 font-bold leading-snug border-l border-b border-gray-200 w-[140px] sm:w-[200px] min-w-[140px] sm:min-w-[200px] max-w-[200px] text-center shadow-xs"
                            >
                              OSL — {str(currentState.code)} specific shortage
                            </th>
                            <th
                              style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 20,
                                backgroundColor: "#F5F5F5",
                              }}
                              className="p-4 font-bold leading-snug border-l border-b border-gray-200 w-[140px] sm:w-[200px] min-w-[140px] sm:min-w-[200px] max-w-[200px] text-center shadow-xs"
                            >
                              OSL — Australia wide shortage
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {arr<JsonObj>(currentState.oslTable).map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50">
                              <td className="p-4 text-xs font-medium text-gray600 bg-white border-b border-gray-200">
                                {str(row.occupation)}
                              </td>
                              <td className="p-0 border-l border-b border-gray-200 w-[200px] min-w-[200px] max-w-[200px]">
                                <div
                                  className={`w-full h-full min-h-12 py-4 font-bold text-sm flex items-center justify-center ${getCellRatingStyle(
                                    str(row.stateShortage)
                                  )}`}
                                >
                                  {str(row.stateShortage)}
                                </div>
                              </td>
                              <td className="p-0 border-l border-b border-gray-200 w-[200px] min-w-[200px] max-w-[200px]">
                                <div
                                  className={`w-full h-full min-h-12 py-4 font-bold text-xs sm:text-sm flex items-center justify-center ${getCellRatingStyle(
                                    str(row.nationalShortage)
                                  )}`}
                                >
                                  {str(row.nationalShortage)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="text-xs text-active font-normal leading-relaxed">
                      Source: Local Government Skills Audit, 2026 · JSA
                      Occupational Shortage List (OSL).
                    </p>
                  </div>
                </div>

                {/* Section 3 */}
                <div
                  style={{ animationDelay: "0.54s" }}
                  className="animate-card-entrance space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-[#9CAA54] text-white font-bold text-xl flex items-center justify-center shrink-0">
                      3
                    </span>
                    <h4 className="font-bold text-xl text-[#9CAA54]">
                      Relevant Local Government-specific Occupations List
                    </h4>
                  </div>

                  <div
                    data-report-surface="neutral"
                    className="bg-[#EBF1E4] border border-l-8 border-l-lg-dark rounded-2xl p-5 space-y-3.5"
                  >
                    <span className="text-sm font-bold text-notes uppercase block">
                      LOCAL GOVERNMENT SPECIFIC OCCUPATIONAL SHORTAGES
                    </span>
                    <p className="text-sm text-gray600 font-normal">
                      Occupations in shortage specific to Local Government when
                      compared with the National Occupation Shortage List:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {arr<string>(currentState.lgSpecificShortages).map(
                        (item, idx) => (
                          <span
                            key={idx}
                            style={{ animationDelay: `${0.58 + idx * 0.06}s` }}
                            className="animate-card-entrance bg-lg-dark text-white text-xs font-medium px-4 py-2 rounded-full"
                          >
                            {item}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === "compare" && (
        <div
          key="compare-mode"
          className="animate-fade-in flex flex-col lg:flex-row gap-8 items-start"
        >
          <div className="w-full lg:w-[330px] lg:min-w-[330px] lg:max-w-[330px] bg-lg-dark text-white rounded-2xl p-6 flex flex-col justify-between space-y-6 shrink-0">
            <div className="space-y-4">
              <span className="text-sm font-semibold text-white/90 block">
                National
              </span>
              <div className="w-14 h-14 sm:w-16 sm:h-16">
                <img
                  src="/images/reports/national-workforce-icon.png"
                  alt="National Workforce Icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="pt-2 space-y-1">
                <h2 className="text-4xl font-bold tracking-tight text-white">
                  <AnimatedCounter target={218000} formatNumber={true} />
                </h2>
                <p className="text-xs text-white/80">
                  employees as of June 2025
                </p>
              </div>
            </div>

            <div
              data-report-surface="neutral"
              className="bg-[#F0F5DF] rounded-xl p-3 flex items-center justify-around gap-2"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-28 sm:w-30 sm:h-30 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-[#9CAA54]/30"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#9CAA54] transition-all duration-1000 ease-out"
                      strokeDasharray={compareChartsLoaded ? "49.1, 100" : "0, 100"}
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg sm:text-xl font-bold text-[#9CAA54] leading-tight">
                      <AnimatedCounter
                        target={49.1}
                        decimals={1}
                        suffix="%"
                      />
                    </span>
                    <span className="text-xs text-[#33380F] font-medium">
                      Female
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-28 h-28 sm:w-30 sm:h-30 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-[#0C582B]/30"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#0C582B] transition-all duration-1000 ease-out"
                      strokeDasharray={compareChartsLoaded ? "50.9, 100" : "0, 100"}
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg sm:text-xl font-bold text-[#0C582B] leading-tight">
                      <AnimatedCounter
                        target={50.9}
                        decimals={1}
                        suffix="%"
                      />
                    </span>
                    <span className="text-xs text-[#33380F] font-medium">
                      Male
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#9CAA54] rounded-full py-2 px-4">
              <span className="text-xs font-bold text-white">
                <AnimatedCounter
                  target={8.2}
                  decimals={1}
                  suffix="% identify as First Nations"
                />
              </span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-8 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                style={{ animationDelay: "0.10s" }}
                className="animate-card-entrance bg-white border border-gray200 rounded-2xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-xs text-notes uppercase block">
                    SOURCE: ABS, PUBLIC SECTOR EMPLOYMENT AND EARNINGS, 2025,
                    TABLE 2
                  </span>
                  <h3 className="font-bold text-base text-gray800">
                    Employees by state and territory
                  </h3>
                  <div className="space-y-4 pt-2">
                    {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT"].map(
                      (code, idx) => {
                        const rawVal = str(statesRaw[code]?.employees, "0");
                        const numVal = Number(rawVal.replace(/,/g, "")) || 0;
                        const pct = `${(numVal / maxEmployees) * 100}%`;
                        return (
                          <div
                            key={code}
                            className="flex items-center gap-3 text-xs"
                          >
                            <span className="w-8 font-bold text-gray-800">
                              {code}
                            </span>
                            <div className="flex-1 bg-[#F2F3EC] h-4 rounded-md rounded-l-none overflow-hidden">
                              <div
                                className="bg-[#9CAA54] h-full rounded-md rounded-l-none transition-all duration-1000 ease-out"
                                style={{
                                  width: compareChartsLoaded ? pct : "0%",
                                  transitionDelay: `${idx * 80}ms`,
                                }}
                              />
                            </div>
                            <span className="w-12 text-right font-semibold text-gray-700">
                              <AnimatedCounter
                                target={numVal}
                                formatNumber={true}
                              />
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
                <p className="text-xs text-active pt-3">
                  Figure: Local Government employees by state and territory, June
                  2025. Select any bar to open that state&apos;s profile.
                </p>
              </div>

              <div
                style={{ animationDelay: "0.22s" }}
                className="animate-card-entrance bg-white border border-gray200 rounded-2xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-xs text-notes uppercase block">
                    SOURCE: STATE AND TERRITORY LOCAL GOVERNMENT ASSOCIATIONS
                  </span>
                  <h3 className="font-bold text-base text-gray800">
                    Councils by state and territory
                  </h3>
                  <div className="space-y-4 pt-2">
                    {[
                      { code: "WA", val: "139", pct: "95%" },
                      { code: "NSW", val: "128", pct: "88%" },
                      { code: "VIC", val: "79", pct: "55%" },
                      { code: "QLD", val: "77", pct: "53%" },
                      { code: "SA", val: "68", pct: "46%" },
                      { code: "TAS", val: "29", pct: "20%" },
                      { code: "NT", val: "18", pct: "12%" },
                    ].map((item, idx) => (
                      <div
                        key={item.code}
                        className="flex items-center gap-3 text-xs"
                      >
                        <span className="w-8 font-bold text-gray-800">
                          {item.code}
                        </span>
                        <div className="flex-1 bg-[#F2F3EC] h-4 rounded-md rounded-l-none overflow-hidden">
                          <div
                            className="bg-[#0C582B] h-full rounded-md rounded-l-none transition-all duration-1000 ease-out"
                            style={{
                              width: compareChartsLoaded ? item.pct : "0%",
                              transitionDelay: `${idx * 80}ms`,
                            }}
                          />
                        </div>
                        <span className="w-8 text-right font-semibold text-gray-700">
                          <AnimatedCounter target={Number(item.val) || 0} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-active pt-3">
                  Figure: Local councils by state and territory (537 nationally).
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-foreground">
                Top Occupation Shortages Comparison by State and Territory
              </h3>
              <div className="space-y-2 text-xs text-gray600 leading-relaxed">
                <p>
                  This table brings together the top occupation shortages
                  identified through the Local Government Skills Audit for each
                  state and territory. Numbers 1–5 show an occupation’s position
                  in that jurisdiction’s list. The lists were compiled state by
                  state; the row order does not represent an agreed national
                  priority ranking.
                </p>
                <p>
                  The AUS column shows the Australia-wide Jobs and Skills
                  Australia Occupational Shortage List (OSL) rating. Badge colours
                  show the corresponding national or state/territory OSL rating:
                  green = NS (No Shortage), yellow = R (Regional Shortage), and
                  orange = S (Shortage). A dash (–) means the occupation was not
                  identified in that jurisdiction’s top shortage list; it does not
                  mean No Shortage.
                </p>
              </div>
            </div>

            <div
              style={{
                height: "480px",
                maxHeight: "480px",
                overflowY: "auto",
                overflowX: "auto",
              }}
              className="border border-gray200 rounded-xl"
            >
              <table
                style={{
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  width: "100%",
                }}
                className="text-left text-xs sm:text-sm"
              >
                <thead className="bg-[#F5F5F5]">
                  <tr className="bg-[#F5F5F5] text-[#252D02] font-bold text-xs uppercase">
                    {[
                      "OCCUPATION",
                      "AUS",
                      "NSW",
                      "NT",
                      "QLD",
                      "SA",
                      "TAS",
                      "VIC",
                      "WA",
                    ].map((col, ci) => (
                      <th
                        key={col}
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 20,
                          backgroundColor: "#F5F5F5",
                        }}
                        className={
                          ci === 0
                            ? "p-4 font-bold text-left tracking-wider border-b border-gray-200 shadow-xs"
                            : "p-3 text-center border-l border-b border-gray-200 w-16 shadow-xs"
                        }
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {alphabeticalCompare.map((item) => (
                    <tr key={str(item.name)} className="hover:bg-gray-50/50">
                      <td className="p-4 font-medium text-gray600 text-xs border-b border-gray-200">
                        {str(item.name)}
                      </td>
                      {["aus", "nsw", "nt", "qld", "sa", "tas", "vic", "wa"].map(
                        (colKey) => {
                          const cell = (item as JsonObj)[colKey];
                          const rendered =
                            typeof cell === "string"
                              ? renderBadge(cell)
                              : cell && typeof cell === "object"
                                ? renderBadge(
                                    str((cell as JsonObj).val),
                                    str((cell as JsonObj).type)
                                  )
                                : renderBadge("-");
                          return (
                            <td
                              key={colKey}
                              className="p-2 text-center border-l border-b border-gray-200"
                            >
                              {rendered}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 8. INDUSTRY PROFILE TEMPLATE ── */
function LgReportBarChart({
  years,
  series,
  min,
  max,
  loaded,
  activeIndex,
  onActiveIndexChange,
}: {
  years: string[];
  series: Array<{ name: string; values: number[]; color: string; colors?: string[] }>;
  min: number;
  max: number;
  loaded: boolean;
  activeIndex: number | null;
  onActiveIndexChange: (index: number | null) => void;
}) {
  const left = 16;
  const right = 604;
  const top = 42;
  const bottom = 210;
  const groupWidth = (right - left) / Math.max(1, years.length);
  const barGap = series.length > 1 ? 7 : 0;
  const barWidth =
    (groupWidth - 14 - barGap * (series.length - 1)) / Math.max(1, series.length);
  const selectedBar =
    activeIndex === null
      ? null
      : {
          yearIndex: Math.floor(activeIndex / series.length),
          seriesIndex: activeIndex % series.length,
        };
  const barHeight = (value: number) =>
    Math.max(4, ((value - min) / Math.max(1, max - min)) * (bottom - top));
  const barX = (yearIndex: number, seriesIndex: number) =>
    left + yearIndex * groupWidth + 7 + seriesIndex * (barWidth + barGap);

  return (
    <div
      className="overflow-x-auto"
      onMouseLeave={() =>
        onActiveIndexChange(series.length === 1 ? years.length - 1 : null)
      }
    >
      <svg
        viewBox="0 0 620 255"
        className="w-full min-w-[520px] h-auto"
        role="img"
        aria-label={`${series.map((item) => item.name).join(" and ")} by year`}
      >
        {years.map((year, index) => (
          <text
            key={year}
            x={left + index * groupWidth + groupWidth / 2}
            y="239"
            textAnchor="middle"
            className="fill-gray800 text-[11px]"
          >
            {year}
          </text>
        ))}
        {years.flatMap((year, yearIndex) =>
          series.map((item, seriesIndex) => {
            const value = item.values[yearIndex] ?? 0;
            const height = barHeight(value);
            const x = barX(yearIndex, seriesIndex);
            return (
              <rect
                key={`${item.name}-${year}`}
                x={x}
                y={bottom - height}
                width={barWidth}
                height={height}
                rx="7"
                fill={item.colors?.[yearIndex] ?? item.color}
                className="outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-active"
                tabIndex={0}
                aria-label={`${year}: ${item.name} ${value.toLocaleString("en-AU")}`}
                onMouseEnter={() =>
                  onActiveIndexChange(yearIndex * series.length + seriesIndex)
                }
                onFocus={() =>
                  onActiveIndexChange(yearIndex * series.length + seriesIndex)
                }
                onBlur={() => onActiveIndexChange(null)}
                style={{
                  transform: loaded ? "scaleY(1)" : "scaleY(0)",
                  transformOrigin: "center bottom",
                  transformBox: "fill-box",
                  transition: `transform 750ms ease-out ${yearIndex * 90}ms`,
                  cursor: "pointer",
                }}
              />
            );
          })
        )}
        {loaded &&
          selectedBar &&
          series[selectedBar.seriesIndex] &&
          (() => {
            const { yearIndex, seriesIndex } = selectedBar;
            const value = series[seriesIndex].values[yearIndex] ?? 0;
            const centerX = barX(yearIndex, seriesIndex) + barWidth / 2;
            const label = `${years[yearIndex]} · ${value.toLocaleString("en-AU")}`;
            const tooltipWidth = series.length > 1 ? 124 : 152;
            const tooltipX = Math.min(
              620 - tooltipWidth - 4,
              Math.max(4, centerX - tooltipWidth / 2)
            );
            const tooltipY = Math.max(2, bottom - barHeight(value) - 41);
            return (
              <g pointerEvents="none">
                <rect
                  x={tooltipX}
                  y={tooltipY}
                  width={tooltipWidth}
                  height="32"
                  rx="6"
                  fill="#252D02"
                />
                <path
                  d={`M${centerX - 6} ${tooltipY + 32} L${centerX + 6} ${tooltipY + 32} L${centerX} ${tooltipY + 39} Z`}
                  fill="#252D02"
                />
                <text
                  x={tooltipX + tooltipWidth / 2}
                  y={tooltipY + 21}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="600"
                >
                  {label}
                </text>
              </g>
            );
          })()}
      </svg>
    </div>
  );
}

function LgIndustryProfileCmsView({ content }: { content: JsonObj }) {
  const [activeGrowthBar, setActiveGrowthBar] = useState<number | null>(4);
  const [activeTrainingBar, setActiveTrainingBar] = useState<number | null>(null);
  const [chartsLoaded, setChartsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setChartsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const growthChart = (content.growthChart || {}) as JsonObj;
  const trainingChart = (content.trainingChart || {}) as JsonObj;
  const assetSection = (content.assetSection || {}) as JsonObj;

  const mapSeries = (raw: unknown) =>
    arr<JsonObj>(raw).map((s) => ({
      name: str(s.name),
      values: arr<number>(s.values).map((n) => Number(n) || 0),
      color: str(s.color, "#598303"),
      colors: arr<string>(s.colors).length ? arr<string>(s.colors) : undefined,
    }));

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray200 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-lg-dark animate-slide-up">
            {str(content.title, "Industry Profile")}
          </h1>
          <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal animate-slide-up-delay">
            <LgRichInline text={str(content.intro)} />
          </p>
        </div>

        <div className="lg:col-span-4 flex items-center justify-center lg:justify-end p-2">
          <img
            src={str(content.heroImage, "/images/reports/industry-profile/hero.png")}
            alt="Industry Profile Illustration"
            className="h-auto max-h-36 object-contain select-none pointer-events-none animate-hero-pulse-settle"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          style={{ animationDelay: "0.15s" }}
          className="animate-card-entrance bg-white rounded-2xl border border-gray200 border-t-12 border-t-[#9CAA54] p-6 space-y-2 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-gray800 mb-6">
              {str(growthChart.title)}
            </h3>
            <LgReportBarChart
              years={arr<string>(growthChart.years)}
              series={mapSeries(growthChart.series)}
              min={num(growthChart.min, 160000)}
              max={num(growthChart.max, 218000)}
              loaded={chartsLoaded}
              activeIndex={activeGrowthBar}
              onActiveIndexChange={setActiveGrowthBar}
            />
          </div>
          <p className="text-xs text-active leading-relaxed border-t border-gray200 pt-3">
            <LgRichInline text={str(growthChart.sourceMarkdown)} />
          </p>
        </div>

        <div
          style={{ animationDelay: "0.30s" }}
          className="animate-card-entrance bg-white rounded-2xl border border-gray200 border-t-12 border-t-lg-dark p-6 space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-gray800 mb-6">
              {str(trainingChart.title)}
            </h3>
            <div className="flex items-center gap-5 text-xs font-semibold text-gray800 pt-1">
              {mapSeries(trainingChart.series).map((s, si) => (
                <span key={si} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.name}
                </span>
              ))}
            </div>
            <LgReportBarChart
              years={arr<string>(trainingChart.years)}
              series={mapSeries(trainingChart.series)}
              min={num(trainingChart.min, 0)}
              max={num(trainingChart.max, 1000)}
              loaded={chartsLoaded}
              activeIndex={activeTrainingBar}
              onActiveIndexChange={setActiveTrainingBar}
            />
          </div>
          <p className="text-xs text-active leading-relaxed border-t border-gray200 pt-3">
            <LgRichInline text={str(trainingChart.sourceMarkdown)} />
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray200 rounded-2xl p-6 space-y-6">
        <div className="space-y-2.5">
          <h3 className="font-bold text-xl text-gray800">
            {str(assetSection.heading, "Asset Management")}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {arr<JsonObj>(assetSection.cards).map((c, ci) => (
            <div
              key={ci}
              style={{ animationDelay: `${0.15 + ci * 0.12}s` }}
              className="animate-card-entrance bg-white border border-gray200 rounded-xl p-5 flex items-center gap-4"
            >
              <img
                src={str(c.icon)}
                alt={str(c.alt)}
                className="w-14 h-14 shrink-0 object-contain"
              />
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray600 leading-tight">
                  {str(c.topLabel)}
                </p>
                <span className="text-2xl sm:text-3xl font-semibold text-lg-dark block leading-none">
                  <AnimatedCounter
                    target={num(c.target)}
                    prefix={str(c.prefix)}
                    suffix={str(c.suffix)}
                  />
                </span>
                {str(c.bottomLabel) && (
                  <p className="text-xs font-semibold text-gray600 leading-tight">
                    {str(c.bottomLabel)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-active leading-relaxed border-t border-gray200 pt-3">
          <LgRichInline text={str(assetSection.sourceMarkdown)} />
        </p>
      </div>
    </div>
  );
}

/* ── 9. WORKFORCE INSIGHTS OVERVIEW TEMPLATE ── */
function LgWorkforceInsightsCmsView({
  data,
  content,
  shellSlug,
  onNavigate,
}: {
  data: PublicReportPageResponse;
  content: JsonObj;
  shellSlug: string;
  onNavigate: (pt: string) => void;
}) {
  const [openOverviews, setOpenOverviews] = useState<Record<number, boolean>>({});
  const themes = arr<JsonObj>(content.themes);
  const navPagesOrder = (data.navigation || [])
    .filter(
      (n) =>
        !n.pageType.startsWith("theme1_insight_") &&
        !n.pageType.startsWith("theme2_insight_") &&
        n.pageType !== "workforce_insights_detail"
    )
    .map((n) => ({ key: n.pageType, label: n.title }));

  return (
    <div className="space-y-5">
      <LocalGovernmentReportUtilityRow>
        <ReportNavButtons
          slug={shellSlug}
          currentPage="workforce_insights"
          pagesOrder={navPagesOrder}
          prev={{
            label: "Executive Summary",
            href: `/reports/${shellSlug}/executive_summary`,
          }}
        />
      </LocalGovernmentReportUtilityRow>

      <div className="bg-white border border-gray200 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-lg-dark animate-slide-up">
            {str(content.title, "Workforce Insights")}
          </h1>
          <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal animate-slide-up-delay">
            {str(content.intro)}
          </p>
        </div>
        <div className="lg:col-span-4 flex items-center justify-center lg:justify-end p-2">
          <img
            src={str(content.heroImage, "/images/reports/workforce-insights.png")}
            alt="Workforce Insights"
            className="h-auto max-h-36 max-w-full object-contain select-none pointer-events-none animate-hero-pulse-settle"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {themes.map((theme, tIdx) => {
          const isOpen = !!openOverviews[tIdx];
          const borderCol = str(theme.borderColor, tIdx === 0 ? "#9CAA54" : "#046D2A");
          const insights = arr<JsonObj>(theme.insights);
          return (
            <div
              key={tIdx}
              style={{
                animationDelay: `${0.15 + tIdx * 0.1}s`,
                borderTopColor: borderCol,
              }}
              className="animate-card-entrance bg-white rounded-2xl border border-gray200 border-t-12 p-6 space-y-6"
            >
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#728C28] uppercase block">
                  {str(theme.eyebrow)}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray800">
                  {str(theme.title)}
                </h2>
                <button
                  data-report-action="primary"
                  onClick={() =>
                    setOpenOverviews((prev) => ({
                      ...prev,
                      [tIdx]: !prev[tIdx],
                    }))
                  }
                  className="bg-[#85B810] text-[#1B240E] text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer flex items-center gap-1"
                >
                  Theme Overview {isOpen ? "▴" : "▾"}
                </button>

                <div
                  className={`grid transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden min-h-0">
                    <div
                      className={`transition-opacity duration-[1000ms] ease-out pt-2 text-xs text-gray600 leading-relaxed space-y-2 font-normal ${
                        isOpen ? "opacity-100 delay-150" : "opacity-0"
                      }`}
                    >
                      {arr<string>(theme.overviewParagraphs).map((p, pi) => (
                        <p key={pi}>
                          <LgRichInline text={p} />
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {insights.map((ins, iIdx) => (
                  <div
                    key={iIdx}
                    style={{ animationDelay: `${0.25 + iIdx * 0.08}s` }}
                    onClick={() => onNavigate(str(ins.targetPageType))}
                    className="animate-card-entrance theme-insight-item bg-[#FAFAF0] border border-gray200 rounded-2xl p-6 flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-[50px] font-bold text-notes/10 group-hover:text-[#728C28]/20 leading-none transition-colors">
                        {str(ins.number, String(iIdx + 1))}
                      </span>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[#728C28] block">
                          {str(ins.eyebrow)}
                        </span>
                        <p className="text-xs text-gray600 leading-relaxed">
                          <LgRichInline text={str(ins.text)} />
                        </p>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#85B810] group-hover:bg-[#77A60D] text-[#1B240E] flex items-center justify-center shrink-0 transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <LgSourcesCard heading="Footnotes" footnotes={data.page.footnotes || []} />
    </div>
  );
}

/* ── 10-16. THEME 1 & THEME 2 INSIGHT DETAIL TEMPLATES ── */
function LgInsightDetailCmsView({
  data,
  content,
  onNavigate,
}: {
  data: PublicReportPageResponse;
  content: JsonObj;
  onNavigate: (pt: string) => void;
}) {
  const layoutVariant = str(content.layoutVariant, "t1_i1");
  const themeNumber = num(content.themeNumber, 1);
  const insightNumber = num(content.insightNumber, 1);
  const totalInTheme = num(content.totalInTheme, 3);
  const borderColor = str(
    content.accentBorderColor,
    themeNumber === 1 ? "#9CAA54" : "#046D2A"
  );
  const prevPageType = str(content.prevPageType);
  const nextPageType = str(content.nextPageType);
  const nextSectionCta = (content.nextSectionCta || null) as JsonObj | null;
  const pageFootnotes = data.page.footnotes || [];
  const findFootnote = (n: number) => pageFootnotes.find((f) => f.number === n);

  const renderIndustryInsightCard = (
    card: JsonObj,
    opts: { withBorder?: boolean; delay?: string } = {}
  ) => (
    <div
      data-report-surface="neutral"
      style={opts.delay ? { animationDelay: opts.delay } : undefined}
      className={`animate-card-entrance bg-[#F0F5DF] rounded-2xl ${
        opts.withBorder !== false ? "border border-gray200" : ""
      } border-l-12 p-6 space-y-5 flex flex-col justify-between`}
    >
      <style jsx>{`
        div[data-report-surface="neutral"] {
          border-left-color: ${borderColor};
        }
      `}</style>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0">
            <img
              src={str(card.icon, "/images/frame-7.svg")}
              alt=""
              className="w-8 h-8 object-contain animate-zoom-in"
            />
          </div>
          <h3 className="text-xl font-bold text-gray800">
            {str(card.title, "Industry Insight")}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
          <LgRichInline text={str(card.paragraph)} />
        </p>
        {arr<string>(card.bullets).length > 0 && (
          <ul className="space-y-2 text-xs sm:text-sm text-gray600 pl-4 list-disc">
            {arr<string>(card.bullets).map((b, bi) => (
              <li key={bi}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <LocalGovernmentReportUtilityRow>
        <div className="flex flex-wrap items-center justify-end gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              data-report-action="secondary"
              onClick={() => onNavigate("workforce_insights")}
              className="border border-gray200 bg-[#FAFAF0] hover:bg-gray200 text-[#728C28] font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Workforce Insights</span>
            </button>
            {nextSectionCta && str(nextSectionCta.pageType) && (
              <button
                data-report-action="primary"
                onClick={() => onNavigate(str(nextSectionCta.pageType))}
                className="bg-[#85B810] hover:bg-[#77A60D] text-[#1B240E] font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>{str(nextSectionCta.label)}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <span className="text-xs font-semibold text-notes">
              Insight {insightNumber} of {totalInTheme} · Theme {themeNumber}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => prevPageType && onNavigate(prevPageType)}
                disabled={!prevPageType}
                className={`border border-gray200 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 transition-colors ${
                  !prevPageType
                    ? "opacity-40 cursor-not-allowed text-gray600"
                    : "hover:bg-gray200 text-[#252D02] cursor-pointer"
                }`}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => nextPageType && onNavigate(nextPageType)}
                disabled={!nextPageType}
                className={`border border-gray200 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 transition-colors ${
                  !nextPageType
                    ? "opacity-40 cursor-not-allowed text-gray600"
                    : "hover:bg-gray200 text-[#252D02] cursor-pointer"
                }`}
              >
                <span>Next</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </LocalGovernmentReportUtilityRow>

      {/* HERO BANNER */}
      <div className="bg-white border border-gray200 rounded-2xl p-6">
        <div
          className="bg-[#FAFAF0] border border-gray200 border-l-12 rounded-2xl p-6 flex gap-6 items-start relative overflow-hidden"
          style={{ borderLeftColor: borderColor }}
        >
          <span className="text-5xl font-bold text-notes/10 select-none shrink-0 leading-none">
            {insightNumber}
          </span>
          <div className="space-y-3 flex-1">
            <span className="text-xs font-semibold text-notes block">
              {str(content.eyebrow)}
            </span>
            <p className="text-sm sm:text-base font-bold text-gray800">
              {str(content.themeTitle)}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-gray800 w-full xl:w-2/3 animate-slide-up">
              {str(content.headline)}
            </h1>
          </div>
        </div>
      </div>

      {layoutVariant === "t1_i1" && (() => {
        const left = (content.leftCard || {}) as JsonObj;
        const right = (content.rightInsightCard || {}) as JsonObj;
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray200 p-6 space-y-5 flex flex-col">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#F0F5DF] flex items-center justify-center shrink-0">
                  <img
                    src={str(left.icon, "/images/frame-6.svg")}
                    alt={str(left.title)}
                    className="w-8 h-8 object-contain animate-zoom-in"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray800">{str(left.title)}</h3>
                <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                  <LgRichInline text={str(left.paragraph)} />
                </p>
              </div>
            </div>
            {renderIndustryInsightCard(right, { delay: "0.22s" })}
          </div>
        );
      })()}

      {layoutVariant === "t1_i2" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {arr<JsonObj>(content.leftCards).map((card, ci) => {
              const fnNums = arr<number>(card.footnoteNumbers);
              return (
                <div
                  key={ci}
                  className="bg-white rounded-2xl border border-gray200 p-6 space-y-5 flex flex-col"
                >
                  <h3 className="text-xl font-bold text-gray800">
                    {str(card.title)}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                    <LgRichInline text={str(card.paragraph)} />
                  </p>
                  {fnNums.length > 0 && (
                    <div className="pt-4 border-t border-gray200 mt-auto space-y-1">
                      {fnNums.map((fnNum) => {
                        const fn = findFootnote(fnNum);
                        if (!fn) return null;
                        return (
                          <p
                            key={fnNum}
                            id={`footnote-${fnNum}`}
                            className="text-xs text-notes font-normal leading-normal scroll-mt-24"
                          >
                            <sup>{fnNum}</sup> <LgRichInline text={fn.text} />
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="space-y-6">
            {arr<JsonObj>(content.rightInsightCards).map((rc, rci) => (
              <React.Fragment key={rci}>
                {renderIndustryInsightCard(rc, {
                  delay: rci === 0 ? "0.15s" : "0.28s",
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {layoutVariant === "t1_i3" && (() => {
        const sp = (content.shortagePanel || {}) as JsonObj;
        const states = arr<JsonObj>(sp.states);
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {arr<JsonObj>(content.leftCards).map((card, ci) => {
                const fnNums = arr<number>(card.footnoteNumbers);
                return (
                  <div
                    key={ci}
                    className="bg-white rounded-2xl border border-gray200 p-6 space-y-5 flex flex-col"
                  >
                    <h3 className="text-xl font-bold text-gray800">
                      {str(card.title)}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                      <LgRichInline text={str(card.paragraph)} />
                    </p>
                    {fnNums.length > 0 && (
                      <div className="pt-4 border-t border-gray200 mt-auto">
                        {fnNums.map((fnNum) => {
                          const fn = findFootnote(fnNum);
                          if (!fn) return null;
                          return (
                            <p
                              key={fnNum}
                              id={`footnote-${fnNum}`}
                              className="text-xs text-notes font-normal scroll-mt-24"
                            >
                              <sup>{fnNum}</sup> <LgRichInline text={fn.text} />
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-[#F0F5DF] rounded-2xl border border-gray200 border-l-12 border-l-[#9CAA54] p-6 space-y-5">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray800">{str(sp.title)}</h3>
                <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                  {str(sp.intro)}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {states.map((st, si) => (
                  <div
                    key={si}
                    className={`rounded-xl overflow-hidden border border-gray200 ${
                      bool(st.fullWidthLg) ? "sm:col-span-2 w-full xl:w-1/2" : ""
                    }`}
                  >
                    <div className="bg-lg-dark text-white font-bold text-xs p-6 py-2.5">
                      {str(st.name)}
                    </div>
                    <div className="bg-white p-6 space-y-1.5 text-xs text-gray600 h-full">
                      {arr<string>(st.items).map((it, ii) => (
                        <div key={ii} className="flex items-start gap-2">
                          <span className="font-bold">•</span>
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {layoutVariant === "t2_i1" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray200 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray800">
                {str((content.topLeftCard as JsonObj)?.title)}
              </h3>
              <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal">
                {str((content.topLeftCard as JsonObj)?.paragraph)}
              </p>
            </div>
          </div>
          {renderIndustryInsightCard(
            (content.topRightInsightCard || {}) as JsonObj,
            { delay: "0.22s" }
          )}
          {arr<JsonObj>(content.bottomCards).map((bc, bci) => (
            <div
              key={bci}
              className="bg-white rounded-2xl border border-gray200 p-6 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray800">{str(bc.title)}</h3>
                <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal">
                  {str(bc.paragraph)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {(layoutVariant === "t2_i2" || layoutVariant === "t2_i3") && (() => {
        const left = (content.leftCard || {}) as JsonObj;
        const right = (content.rightInsightCard || {}) as JsonObj;
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray200 p-6 flex flex-col justify-between gap-5">
              <h3 className="text-xl font-bold text-gray800">{str(left.title)}</h3>
              <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal">
                {str(left.paragraph)}
              </p>
            </div>
            {renderIndustryInsightCard(right, { delay: "0.22s" })}
          </div>
        );
      })()}

      {layoutVariant === "t2_i4" && (() => {
        const left = (content.leftCard || {}) as JsonObj;
        const rightSec = (content.rightSection || {}) as JsonObj;
        const innerInsight = (rightSec.insightCard || {}) as JsonObj;
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="bg-white rounded-2xl border border-gray200 p-6 space-y-5">
              <h3 className="text-xl font-bold text-gray800">{str(left.title)}</h3>
              <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal">
                {str(left.paragraph)}
              </p>
            </div>
            <section className="bg-white rounded-2xl border border-gray200 p-6 space-y-5">
              <h2 className="text-xl font-bold text-gray800">
                {str(rightSec.heading)}
              </h2>
              <div className="space-y-5">
                <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                  {str(rightSec.listIntro)}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-gray600 leading-relaxed">
                  {arr<string>(rightSec.bullets).map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </div>
              {renderIndustryInsightCard(innerInsight, { withBorder: false })}
              <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                {str(rightSec.closingParagraph)}
              </p>
            </section>
          </div>
        );
      })()}
    </div>
  );
}

/* ── 17. 2026 PROPOSED WORKFORCE STRATEGIES TEMPLATE ── */
function LgWorkforceStrategiesCmsView({
  content,
  onNavigate,
}: {
  content: JsonObj;
  onNavigate: (pt: string) => void;
}) {
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});
  const prevCta = (content.prevCta || {}) as JsonObj;
  const nextCta = (content.nextCta || {}) as JsonObj;
  const strategies = arr<JsonObj>(content.strategies);

  return (
    <div className="space-y-8">
      <LocalGovernmentReportUtilityRow>
        <div className="flex flex-wrap items-center gap-3">
          <button
            data-report-action="secondary"
            onClick={() => onNavigate(str(prevCta.pageType, "workforce_insights"))}
            className="border border-[#B2DB79] bg-[#FAFAF0] hover:bg-gray200 text-[#728C28] font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />{" "}
            {str(prevCta.label, "Back to Workforce Insights")}
          </button>
          <button
            data-report-action="primary"
            onClick={() =>
              onNavigate(str(nextCta.pageType, "update_2025_strategies"))
            }
            className="bg-[#8AC900] hover:bg-[#77A60D] text-gray800 font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
          >
            {str(nextCta.label, "Next Section: Update on 2025 Strategies")}{" "}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </LocalGovernmentReportUtilityRow>

      <div className="bg-white border border-gray200 rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <span className="text-xs font-semibold text-notes uppercase tracking-wider block">
            {str(content.eyebrow, "THE CULMINATION OF THIS REPORT")}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#046D2A] leading-tight animate-slide-up">
            {str(content.titleLine1, "2026 Proposed Local Government")}
            <br />
            {str(content.titleLine2, "Workforce Strategies")}
          </h1>
          <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal w-full lg:w-5/6 animate-slide-up-delay">
            {str(content.intro)}
          </p>
        </div>
        <div className="shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
          <img
            src={str(content.heroImage, "/images/hero-graphic-2026.png")}
            alt="2026 Proposed Strategies Diagram"
            className="w-full max-w-[340px] sm:max-w-[380px] object-contain animate-zoom-in"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {strategies.map((st, si) => {
          const isOpen = !!openMap[si];
          const borderCol = str(st.borderColor, si === 0 ? "#9CAA54" : "#046D2A");
          return (
            <div
              key={si}
              style={{
                animationDelay: `${0.15 + si * 0.15}s`,
                borderTopColor: borderCol,
              }}
              className="animate-card-entrance bg-white rounded-2xl border border-gray200 border-t-12 p-6 space-y-5"
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className="text-white text-xs font-bold px-3 py-1 rounded-full uppercase"
                  style={{ backgroundColor: borderCol }}
                >
                  {str(st.badge, `STRATEGY ${si + 1}`)}
                </span>
                <button
                  data-report-action="primary"
                  onClick={() => setOpenMap((p) => ({ ...p, [si]: !p[si] }))}
                  aria-expanded={isOpen}
                  className="bg-[#8AC900] hover:bg-[#77A60D] text-[#1B240E] text-sm font-bold min-h-10 shrink-0 px-5 py-2 rounded-full cursor-pointer transition-colors flex items-center gap-1"
                >
                  {isOpen ? "Close ▴" : "Open ▾"}
                </button>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-gray800 leading-snug">
                {str(st.title)}
              </h2>

              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                  <span className="font-bold text-gray800">Objective:</span>{" "}
                  {str(st.objective)}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="bg-[#F0F5DF] text-notes text-xs font-bold px-3.5 py-1.5 rounded-full">
                    Workforce Insight: {str(st.workforceInsight)}
                  </span>
                </div>
              </div>

              <div
                className={`grid transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0 pointer-events-none"
                }`}
              >
                <div className="overflow-hidden min-h-0">
                  <div
                    className={`transition-opacity duration-[1000ms] ease-out pt-4 border-t border-gray200 space-y-4 ${
                      isOpen ? "opacity-100 delay-150" : "opacity-0"
                    }`}
                  >
                    <LgStrategyCardDetails strategy={st} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 18. UPDATE ON 2025 STRATEGIES TEMPLATE ── */
function LgUpdate2025StrategiesCmsView({
  content,
  onNavigate,
}: {
  content: JsonObj;
  onNavigate: (pt: string) => void;
}) {
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({});
  const prevCta = (content.prevCta || {}) as JsonObj;
  const nextCta = (content.nextCta || {}) as JsonObj;
  const challengeCards = arr<JsonObj>(content.challengeCards);
  const projects = arr<JsonObj>(content.projects);

  return (
    <div className="space-y-8">
      <LocalGovernmentReportUtilityRow>
        <div className="flex flex-wrap items-center gap-3">
          <button
            data-report-action="secondary"
            onClick={() => onNavigate(str(prevCta.pageType, "workforce_strategies"))}
            className="border border-[#B2DB79] bg-[#FAFAF0] hover:bg-gray200 text-[#728C28] font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {str(prevCta.label)}
          </button>
          <button
            data-report-action="primary"
            onClick={() => onNavigate(str(nextCta.pageType, "existing_strategies"))}
            className="bg-[#8AC900] hover:bg-[#77A60D] text-gray800 font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
          >
            {str(nextCta.label)} <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </LocalGovernmentReportUtilityRow>

      <div className="bg-white border border-gray200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#046D2A] animate-slide-up">
            {str(content.title, "Workforce Insights: Update on 2025 Strategies")}
          </h1>
          <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal animate-slide-up-delay">
            {str(content.intro)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challengeCards.map((c, ci) => (
            <div
              key={ci}
              style={{ animationDelay: `${0.35 + ci * 0.5}s` }}
              className="border border-gray200 rounded-2xl p-5 flex items-start gap-4 animate-card-entrance-slow"
            >
              <div className="w-14 h-14 rounded-full bg-[#F0F5DF] flex items-center justify-center shrink-0 border border-gray200">
                <img
                  src={str(c.icon)}
                  alt={str(c.title)}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray800">{str(c.title)}</h3>
                <p className="text-xs text-gray600 leading-relaxed">
                  {str(c.text)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal w-full xl:w-2/3">
          {str(content.closingIntro)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {projects.map((proj, pi) => {
          const isOpen = !!openMap[pi];
          const borderCol = str(proj.borderColor, pi === 0 ? "#9CAA54" : "#046D2A");
          return (
            <div
              key={pi}
              style={{
                animationDelay: `${0.15 + pi * 0.15}s`,
                borderTopColor: borderCol,
              }}
              className="animate-card-entrance bg-white rounded-2xl border border-gray200 border-t-12 p-6 space-y-5"
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className="text-white text-xs font-bold px-3 py-1 rounded-full uppercase"
                  style={{ backgroundColor: borderCol }}
                >
                  {str(proj.badge)}
                </span>
                <button
                  data-report-action="primary"
                  onClick={() => setOpenMap((p) => ({ ...p, [pi]: !p[pi] }))}
                  aria-expanded={isOpen}
                  className="bg-[#8AC900] hover:bg-[#77A60D] text-[#1B240E] text-sm font-bold min-h-10 shrink-0 px-5 py-2 rounded-full cursor-pointer transition-colors flex items-center gap-1"
                >
                  {isOpen ? "Close ▴" : "Open ▾"}
                </button>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-gray800 leading-snug">
                {str(proj.title)}
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-gray600 leading-relaxed">
                {arr<string>(proj.introParagraphs).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {isOpen && (
                <div className="animate-expand-down pt-4 border-t border-gray200 space-y-5">
                  <span
                    className="text-white text-xs font-bold px-2.5 py-1 rounded-full inline-block"
                    style={{ backgroundColor: borderCol }}
                  >
                    Update
                  </span>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray800">
                      Ministerial Priority 2026
                    </h3>
                    <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                      {str(proj.ministerialPriority)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray800">
                      Public Skills Australia Strategic Plan
                    </h3>
                    <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                      {str(proj.strategicPlan)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray800">
                      Drivers of Change
                    </h3>
                    <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                      {str(proj.driversIntro)}
                    </p>
                    <ul className="space-y-1 text-xs sm:text-sm text-gray600 pl-5 list-disc leading-relaxed">
                      {arr<string>(proj.driversBullets).map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div
                    data-report-surface="neutral"
                    style={{ borderLeftColor: borderCol }}
                    className="bg-[#F0F5DF] border border-gray200 border-l-12 rounded-2xl p-5 space-y-2"
                  >
                    <span className="text-xs font-bold text-lg-dark uppercase block">
                      NEXT STEPS
                    </span>
                    <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                      {str(proj.nextSteps)}
                    </p>
                  </div>

                  <div className="flex flex-col items-stretch sm:items-start gap-3 pt-2">
                    <button
                      onClick={() =>
                        onNavigate(str(proj.ctaPageType, "industry_overview"))
                      }
                      className="border border-gray200 hover:bg-gray200 text-gray800 text-xs font-bold px-5 py-2.5 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>{str(proj.ctaLabel)}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 19. EXISTING INDUSTRY-SECTOR STRATEGIES TEMPLATE ── */
function LgExistingStrategiesCmsView({
  content,
  onNavigate,
}: {
  content: JsonObj;
  onNavigate: (pt: string) => void;
}) {
  const strategies = arr<JsonObj>(content.strategies);
  const [selectedId, setSelectedId] = useState<number | null>(
    num(strategies[0]?.id, 1)
  );
  const detailPanelRef = useRef<HTMLDivElement>(null);
  useReportReader(detailPanelRef, selectedId, false);

  const selectedStrategy =
    strategies.find((s) => num(s.id) === selectedId) || strategies[0] || {};
  const prevCta = (content.prevCta || {}) as JsonObj;
  const nextCta = (content.nextCta || {}) as JsonObj;

  return (
    <div className="space-y-8">
      <LocalGovernmentReportUtilityRow>
        <div className="flex flex-wrap items-center gap-3">
          <button
            data-report-action="secondary"
            onClick={() =>
              onNavigate(str(prevCta.pageType, "update_2025_strategies"))
            }
            className="border border-[#B2DB79] bg-[#FAFAF0] hover:bg-gray200 text-[#728C28] font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {str(prevCta.label)}
          </button>
          <button
            data-report-action="primary"
            onClick={() =>
              onNavigate(str(nextCta.pageType, "federal_initiatives"))
            }
            className="bg-[#8AC900] hover:bg-[#77A60D] text-gray800 font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
          >
            {str(nextCta.label)} <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </LocalGovernmentReportUtilityRow>

      <div className="bg-white border border-gray200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#046D2A] leading-tight animate-slide-up">
            {str(content.title, "Existing Industry-Sector Strategies")}
          </h1>
          <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal w-full lg:w-5/6 animate-slide-up-delay">
            {str(content.intro)}
          </p>
        </div>
        <div className="shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
          <img
            src={str(content.heroImage, "/images/hero-graphic-existing.png")}
            alt="Existing Industry-Sector Strategies Graphic"
            className="w-full max-w-[340px] sm:max-w-[420px] object-contain select-none pointer-events-none animate-hero-pulse-settle"
          />
        </div>
      </div>

      <div
        data-report-reader="standard"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
      >
        <div
          data-reader-list
          role="region"
          aria-label="Available selections"
          tabIndex={0}
          className="lg:col-span-1 space-y-3 p-1"
        >
          {strategies.map((item, idx) => {
            const idVal = num(item.id, idx + 1);
            const isSelected = idVal === selectedId;
            return (
              <React.Fragment key={idVal}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  data-report-surface="neutral"
                  style={{ animationDelay: `${0.06 + idx * 0.04}s` }}
                  onClick={() =>
                    setSelectedId(
                      isSelected
                        ? typeof window !== "undefined" &&
                          window.innerWidth < 1024
                          ? null
                          : idVal
                        : idVal
                    )
                  }
                  className={`animate-card-entrance rounded-2xl p-5 border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer flex w-full text-left items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-[#046D2A]/10 border-2 border-lg-dark shadow-xs"
                      : "bg-white border-gray200 hover:border-[#9CAA54] hover:bg-[#FAFAF0] hover:shadow-xs"
                  }`}
                >
                  <span className="space-y-4 flex-1">
                    <span className="text-xs font-semibold text-lg-dark uppercase block">
                      {str(item.code)}
                    </span>
                    <span className="font-bold text-gray800 leading-normal">
                      {str(item.title)}
                    </span>
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isSelected
                        ? "bg-white text-gray800 border border-[#9CAA54] rotate-90 lg:rotate-0"
                        : "bg-[#8AC900] text-gray800"
                    }`}
                  >
                    <ArrowRight className="h-4 w-4 text-gray800" />
                  </span>
                </button>

                {isSelected && (
                  <div className="lg:hidden bg-[#E5E8DA] rounded-2xl p-4 sm:p-5 space-y-4 animate-content-switch">
                    <div className="bg-[#FAFAF0] rounded-2xl p-5 sm:p-6 space-y-4">
                      <div className="space-y-2">
                        <h2 className="text-base sm:text-lg font-bold text-gray800 leading-snug">
                          {String(idVal).padStart(2, "0")} · {str(item.title)}
                        </h2>
                        {arr<string>(item.owners).length > 0 ? (
                          <div className="flex items-start justify-between gap-3 text-xs sm:text-sm font-semibold text-notes">
                            <div className="space-y-0.5">
                              {arr<string>(item.owners).map((o) => (
                                <p key={o}>{o}</p>
                              ))}
                            </div>
                            <span className="shrink-0">{str(item.status)}</span>
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm font-semibold text-notes block">
                            {str(item.subtitle)}
                          </p>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal">
                        <LgRichInline text={str(item.description)} />
                      </p>
                      <hr className="border-t border-gray200 my-3" />
                      <div className="space-y-4 pt-1">
                        <span className="text-xs font-bold text-notes uppercase block">
                          HOW THIS INFORMS PUBLIC SKILLS AUSTRALIA&apos;S WORK
                        </span>
                        <div className="space-y-3">
                          {arr<JsonObj>(item.impactItems).map((imp, ii) => (
                            <div
                              key={ii}
                              data-report-surface="neutral"
                              className="bg-[#F0F5DF] rounded-xl border-l-8 sm:border-l-12 border-l-[#9CAA54] p-3.5 sm:p-4 space-y-2"
                            >
                              <h3 className="font-medium text-xs sm:text-sm text-gray800">
                                {str(imp.title)}
                              </h3>
                              <p className="text-xs text-gray600 leading-relaxed">
                                <LgRichInline text={str(imp.description)} />
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div
          ref={detailPanelRef}
          data-reader-detail
          role="region"
          aria-label="Selected strategy details"
          tabIndex={0}
          className="hidden lg:block lg:col-span-2 bg-[#E5E8DA] rounded-2xl p-5 sm:p-6 space-y-5"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-[#E5E8DA] pb-2">
            <span className="bg-lg-dark text-white text-xs font-semibold px-5 py-2.5 rounded-full uppercase">
              {str(selectedStrategy.code)}
            </span>
            <div className="flex items-center gap-3">
              {(selectedId ?? 1) > 1 && (
                <button
                  onClick={() => setSelectedId((selectedId ?? 1) - 1)}
                  className={`text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 flex items-center gap-1.5 ${
                    (selectedId ?? 1) === strategies.length
                      ? "bg-[#8AC900] hover:bg-[#77A60D] text-gray800"
                      : "border border-[#B2DB79] bg-[#FAFAF0] hover:bg-gray200 text-[#728C28]"
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>
              )}
              {(selectedId ?? 1) < strategies.length && (
                <button
                  data-report-action="primary"
                  onClick={() => setSelectedId((selectedId ?? 1) + 1)}
                  className="bg-[#8AC900] hover:bg-[#77A60D] text-gray800 text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray800" />
                </button>
              )}
            </div>
          </div>

          <div
            key={`desktop-strategy-${selectedId}`}
            className="bg-[#FAFAF0] rounded-2xl p-6 sm:p-8 space-y-5 animate-content-switch"
          >
            <div className="space-y-5">
              <h2 className="text-lg sm:text-xl font-bold text-gray800 leading-snug">
                {String(num(selectedStrategy.id, 1)).padStart(2, "0")} ·{" "}
                {str(selectedStrategy.title)}
              </h2>
              {arr<string>(selectedStrategy.owners).length > 0 ? (
                <div className="flex items-start justify-between gap-4 text-sm font-semibold text-notes">
                  <div className="space-y-0.5">
                    {arr<string>(selectedStrategy.owners).map((o) => (
                      <p key={o}>{o}</p>
                    ))}
                  </div>
                  <span className="shrink-0">{str(selectedStrategy.status)}</span>
                </div>
              ) : (
                <p className="text-sm font-semibold text-notes block">
                  {str(selectedStrategy.subtitle)}
                </p>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal">
              <LgRichInline text={str(selectedStrategy.description)} />
            </p>

            <hr className="border-t border-gray200 my-4" />

            <div className="space-y-5 pt-1">
              <span className="text-xs font-bold text-notes uppercase block">
                HOW THIS INFORMS PUBLIC SKILLS AUSTRALIA&apos;S WORK
              </span>
              <div className="space-y-5">
                {arr<JsonObj>(selectedStrategy.impactItems).map((imp, idx) => (
                  <div
                    key={idx}
                    data-report-surface="neutral"
                    className="bg-[#F0F5DF] rounded-xl border-l-12 border-l-[#9CAA54] p-4 sm:p-5 space-y-3"
                  >
                    <h3 className="font-medium text-gray800">{str(imp.title)}</h3>
                    <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                      <LgRichInline text={str(imp.description)} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 20. FEDERAL GOVERNMENT INITIATIVES TEMPLATE ── */
function LgInitiativeFormattedText({
  text,
  pattern,
}: {
  text: string;
  pattern: RegExp;
}) {
  return (
    <>
      {text.split(pattern).map((part, idx) =>
        idx % 2 === 1 ? <em key={idx}>{part}</em> : part
      )}
    </>
  );
}

function LgInitiativeDescription({ item }: { item: JsonObj }) {
  const numStr = str(item.number);
  const desc = str(item.description);
  if (numStr === "08") {
    return (
      <div className="whitespace-pre-line">
        <LgInitiativeFormattedText
          text={desc}
          pattern={/(2024 CSOL Key Findings Report)/g}
        />
      </div>
    );
  }
  if (numStr === "05") {
    return (
      <div className="whitespace-pre-line">
        <LgInitiativeFormattedText
          text={desc}
          pattern={/(2023–2030 Australian Cyber Security Strategy|2026 Local Government Workforce Insights Report)/g}
        />
      </div>
    );
  }
  if (numStr === "04") {
    return (
      <div className="whitespace-pre-line">
        <LgInitiativeFormattedText
          text={desc}
          pattern={/(The Clean Energy Generation|Local Government Emergency Management Skills Project)/g}
        />
      </div>
    );
  }
  if (numStr === "03") {
    return (
      <div className="whitespace-pre-line">
        <LgInitiativeFormattedText
          text={desc}
          pattern={/(Working for Women Strategy|2026 Local Government Workforce Insights Report)/g}
        />
      </div>
    );
  }
  if (numStr === "02") {
    return (
      <div className="whitespace-pre-line">
        <LgInitiativeFormattedText
          text={desc}
          pattern={/(Australian Government's Strategic Priorities|Australian Government Strategic Priorities|2026 Local Government Workforce Insights Report)/g}
        />
      </div>
    );
  }
  if (numStr === "06") {
    const [advice = "", ...following] = desc.split("\n\n");
    const [introduction = "", ...recommendations] = advice.split("\n");
    return (
      <div className="space-y-4">
        <p>{introduction}</p>
        <ul className="space-y-2">
          {recommendations.map((rec) => (
            <li key={rec} className="flex items-start gap-2">
              <span aria-hidden="true" className="shrink-0">
                ›
              </span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
        {following.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    );
  }
  if (numStr === "13") {
    const [chSec = "", recSec = ""] = desc.split("\n\n");
    const [chIntro = "", ...challenges] = chSec.split("\n");
    const [recIntro = "", ...recommendations] = recSec.split("\n");
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <p>{chIntro}</p>
          <ul className="space-y-1">
            {challenges.map((ch) => (
              <li key={ch} className="flex items-start gap-2">
                <span aria-hidden="true" className="shrink-0">
                  ›
                </span>
                <span>{ch}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <p>
            <LgInitiativeFormattedText
              text={recIntro}
              pattern={/(Speeding up progress towards gender economic equality)/g}
            />
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            {recommendations.map((rec) => (
              <li key={rec} className="pl-1">
                {rec.replace(/^\d+\.\s*/, "")}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }
  if (numStr !== "09" && numStr !== "11") {
    return <div className="whitespace-pre-line">{desc}</div>;
  }

  const [pillarSection = "", closing = ""] = desc.split("\n\n");
  const [introduction = "", ...pillars] = pillarSection.split("\n");
  return (
    <div className="space-y-4">
      <p>
        {numStr === "09" ? (
          <LgInitiativeFormattedText text={introduction} pattern={/(Better Together)/g} />
        ) : (
          introduction
        )}
      </p>
      <ul className="space-y-2">
        {pillars.map((pillar) => {
          const sep = numStr === "09" ? pillar.indexOf(": ") : -1;
          return (
            <li key={pillar} className="flex items-start gap-2">
              <span aria-hidden="true" className="shrink-0">
                ›
              </span>
              <span>
                {sep >= 0 ? (
                  <>
                    <strong className="font-bold text-gray800">
                      {pillar.slice(0, sep + 1)}
                    </strong>{" "}
                    {pillar.slice(sep + 2)}
                  </>
                ) : (
                  pillar
                )}
              </span>
            </li>
          );
        })}
      </ul>
      <p>
        {numStr === "09" ? (
          <LgInitiativeFormattedText text={closing} pattern={/(Better Together)/g} />
        ) : (
          closing
        )}
      </p>
    </div>
  );
}

function LgInitiativeImpactDescription({ item }: { item: JsonObj }) {
  const numStr = str(item.number);
  const text = str(item.impactDescription);
  if (numStr === "14") {
    return <LgInitiativeFormattedText text={text} pattern={/(Local Government Skills Audit)/g} />;
  }
  if (numStr === "09") {
    return <LgInitiativeFormattedText text={text} pattern={/(Better Together)/g} />;
  }
  if (numStr === "08") {
    return <LgInitiativeFormattedText text={text} pattern={/(2024 CSOL Key Findings Report)/g} />;
  }
  if (numStr === "07" || numStr === "10") {
    return (
      <LgInitiativeFormattedText
        text={text}
        pattern={/(2026 Local Government Workforce Insights Report)/g}
      />
    );
  }
  if (numStr === "05") {
    return (
      <LgInitiativeFormattedText
        text={text}
        pattern={/(2023–2030 Australian Cyber Security Strategy|2026 Local Government Workforce Insights Report)/g}
      />
    );
  }
  if (numStr === "04") {
    return (
      <LgInitiativeFormattedText
        text={text}
        pattern={/(The Clean Energy Generation|Local Government Emergency Management Skills Project)/g}
      />
    );
  }
  if (numStr === "03") {
    return (
      <LgInitiativeFormattedText
        text={text}
        pattern={/(Working for Women Strategy|2026 Local Government Workforce Insights Report)/g}
      />
    );
  }
  if (numStr === "02") {
    return (
      <LgInitiativeFormattedText
        text={text}
        pattern={/(Australian Government's Strategic Priorities|Australian Government Strategic Priorities|2026 Local Government Workforce Insights Report)/g}
      />
    );
  }
  const title =
    "Local Government Skills Audit and uptake and utility of the Local Government Training Package";
  const pos = text.indexOf(title);
  if (numStr !== "01" || pos < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, pos)}
      <em>{title}</em>
      {text.slice(pos + title.length)}
    </>
  );
}

function LgFederalInitiativesCmsView({
  content,
  onNavigate,
}: {
  content: JsonObj;
  onNavigate: (pt: string) => void;
}) {
  const initiatives = arr<JsonObj>(content.initiatives);
  const [selectedId, setSelectedId] = useState<number | null>(
    initiatives.length > 0 ? num(initiatives[0].id, 0) : null
  );
  const detailPanelRef = useRef<HTMLDivElement>(null);
  useReportReader(detailPanelRef, selectedId, false);

  const selectedItem =
    initiatives.find((s) => num(s.id) === selectedId) || initiatives[0] || {};
  const selectedIndex = Math.max(
    0,
    initiatives.findIndex((s) => num(s.id) === num(selectedItem.id))
  );
  const prevCta = (content.prevCta || {}) as JsonObj;
  const nextCta = (content.nextCta || {}) as JsonObj;

  return (
    <div className="space-y-8">
      <LocalGovernmentReportUtilityRow>
        <div className="flex flex-wrap items-center gap-3">
          <button
            data-report-action="secondary"
            onClick={() => onNavigate(str(prevCta.pageType, "existing_strategies"))}
            className="border border-[#B2DB79] bg-[#FAFAF0] hover:bg-gray200 text-[#728C28] font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {str(prevCta.label)}
          </button>
          <button
            data-report-action="primary"
            onClick={() => onNavigate(str(nextCta.pageType, "looking_forward"))}
            className="bg-[#8AC900] hover:bg-[#77A60D] text-gray800 font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
          >
            {str(nextCta.label)} <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </LocalGovernmentReportUtilityRow>

      <div className="bg-white border border-gray200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray800 leading-tight animate-slide-up">
            {str(content.title, "Federal Government Initiatives")}
          </h1>
          <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal w-full lg:w-5/6 animate-slide-up-delay">
            {str(content.intro)}
          </p>
        </div>
        <div className="shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
          <img
            src={str(content.heroImage, "/images/hero-graphic-federal.png")}
            alt="Federal Government Initiatives Graphic"
            className="w-full max-w-[340px] sm:max-w-[420px] object-contain select-none pointer-events-none animate-hero-pulse-settle"
          />
        </div>
      </div>

      <div
        data-report-reader="standard"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
      >
        <div
          data-reader-list
          role="region"
          aria-label="Available selections"
          tabIndex={0}
          className="lg:col-span-1 space-y-3 p-1"
        >
          {initiatives.map((item, idx) => {
            const idVal = num(item.id, idx);
            const isSelected = idVal === selectedId;
            return (
              <React.Fragment key={idVal}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  data-report-surface="neutral"
                  style={{ animationDelay: `${0.06 + idx * 0.04}s` }}
                  onClick={() =>
                    setSelectedId(
                      isSelected
                        ? typeof window !== "undefined" &&
                          window.innerWidth < 1024
                          ? null
                          : idVal
                        : idVal
                    )
                  }
                  className={`animate-card-entrance rounded-2xl p-5 border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer flex w-full text-left items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-[#8AC900]/15 border-2 border-[#8AC900] shadow-xs"
                      : "bg-white border-gray200 hover:border-[#8AC900] hover:bg-[#FAFAF0] hover:shadow-xs"
                  }`}
                >
                  <span className="space-y-4 flex-1">
                    <span className="text-xs font-semibold text-notes block">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="font-bold text-gray800 leading-normal">
                      {str(item.title)}
                    </span>
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isSelected
                        ? "bg-white text-gray800 border border-[#8AC900] rotate-90 lg:rotate-0"
                        : "bg-[#8AC900] text-gray800"
                    }`}
                  >
                    <ArrowRight className="h-4 w-4 text-gray800" />
                  </span>
                </button>

                {isSelected && (
                  <div className="lg:hidden bg-[#E5E8DA] rounded-2xl p-4 sm:p-5 space-y-4 animate-content-switch">
                    <div className="bg-[#FAFAF0] rounded-2xl p-5 sm:p-6 space-y-4">
                      <div className="space-y-2">
                        <h2 className="text-base sm:text-lg font-bold text-gray800 leading-snug">
                          {String(idx + 1).padStart(2, "0")} · {str(item.title)}
                        </h2>
                        <p className="text-xs sm:text-sm font-semibold text-notes block">
                          {str(item.subtitle)}
                        </p>
                      </div>
                      <div className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal">
                        <LgInitiativeDescription item={item} />
                      </div>
                      <hr className="border-t border-gray200 my-3" />
                      <div className="space-y-4 pt-1">
                        <span className="text-xs font-bold text-notes uppercase block">
                          HOW THIS INFORMS PUBLIC SKILLS AUSTRALIA&apos;S WORK
                        </span>
                        <div
                          data-report-surface="neutral"
                          className="bg-[#F0F5DF] rounded-xl border-l-8 sm:border-l-12 border-l-[#9CAA54] p-3.5 sm:p-4 space-y-2"
                        >
                          <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                            <LgInitiativeImpactDescription item={item} />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div
          ref={detailPanelRef}
          data-reader-detail
          role="region"
          aria-label="Selected government initiative"
          tabIndex={0}
          className="hidden lg:block lg:col-span-2 bg-[#E5E8DA] rounded-2xl p-5 sm:p-6 space-y-5 scroll-mt-20"
        >
          <div className="sticky top-0 z-10 bg-[#E5E8DA] flex items-center justify-between gap-4">
            <span className="bg-lg-dark text-white text-xs font-semibold px-5 py-2.5 rounded-full uppercase">
              {String(selectedIndex + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-3">
              {selectedIndex > 0 && (
                <button
                  onClick={() =>
                    setSelectedId(num(initiatives[selectedIndex - 1]?.id))
                  }
                  className={`text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 flex items-center gap-1.5 ${
                    selectedIndex === initiatives.length - 1
                      ? "bg-[#8AC900] hover:bg-[#77A60D] text-gray800"
                      : "border border-[#B2DB79] bg-[#FAFAF0] hover:bg-gray200 text-[#728C28]"
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>
              )}
              {selectedIndex < initiatives.length - 1 && (
                <button
                  data-report-action="primary"
                  onClick={() =>
                    setSelectedId(num(initiatives[selectedIndex + 1]?.id))
                  }
                  className="bg-[#8AC900] hover:bg-[#77A60D] text-gray800 text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray800" />
                </button>
              )}
            </div>
          </div>

          <div
            key={`desktop-init-${selectedId}`}
            className="bg-[#FAFAF0] rounded-2xl p-6 sm:p-8 space-y-5 animate-content-switch"
          >
            <div className="space-y-5">
              <h2 className="text-lg sm:text-xl font-bold text-gray800 leading-snug">
                {String(selectedIndex + 1).padStart(2, "0")} ·{" "}
                {str(selectedItem.title)}
              </h2>
              <p className="text-sm font-semibold text-notes block">
                {str(selectedItem.subtitle)}
              </p>
            </div>
            <div className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal">
              <LgInitiativeDescription item={selectedItem} />
            </div>
            <hr className="border-t border-gray200 my-4" />
            <div className="space-y-5 pt-1">
              <span className="text-xs font-bold text-notes uppercase block">
                HOW THIS INFORMS PUBLIC SKILLS AUSTRALIA&apos;S WORK
              </span>
              <div
                data-report-surface="neutral"
                className="bg-[#F0F5DF] rounded-xl border-l-12 border-l-[#9CAA54] p-4 sm:p-5 space-y-3"
              >
                <p className="text-xs sm:text-sm text-gray600 leading-relaxed">
                  <LgInitiativeImpactDescription item={selectedItem} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 21. LOOKING FORWARD TEMPLATE ── */
function LgLookingForwardCmsView({
  data,
  content,
  onNavigate,
}: {
  data: PublicReportPageResponse;
  content: JsonObj;
  onNavigate: (pt: string) => void;
}) {
  const prevCta = (content.prevCta || {}) as JsonObj;
  const cards = arr<JsonObj>(content.cards);

  return (
    <div className="space-y-8">
      <LocalGovernmentReportUtilityRow>
        <div className="flex items-center">
          <button
            data-report-action="secondary"
            onClick={() => onNavigate(str(prevCta.pageType, "executive_summary"))}
            className="border border-[#B2DB79] bg-[#FAFAF0] hover:bg-gray200 text-[#728C28] font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-sm motion-reduce:hover:translate-y-0 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />{" "}
            {str(prevCta.label, "Back to Executive Summary")}
          </button>
        </div>
      </LocalGovernmentReportUtilityRow>

      <div className="group bg-white border border-gray200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 transition-[border-color,box-shadow] duration-300 hover:border-[#B2DB79] hover:shadow-md">
        <div className="space-y-3 flex-1">
          <span className="text-xs font-semibold text-notes uppercase tracking-wider block">
            {str(content.eyebrow, "LOOKING FORWARD")}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#046D2A] leading-tight animate-slide-up">
            {str(content.title, "2027 and Beyond")}
          </h1>
          <div className="space-y-3 animate-slide-up-delay">
            {arr<string>(content.introParagraphs).map((p, idx) => (
              <p
                key={idx}
                className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal w-full lg:w-5/6"
              >
                <LgRichInline
                  text={p}
                  boldClassName="font-bold text-[#728C28]"
                />
              </p>
            ))}
          </div>
        </div>
        <div className="shrink-0 w-full lg:w-auto flex justify-center lg:justify-end transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none">
          <img
            src={str(
              content.heroImage,
              "/images/hero-graphic-looking-forward.png"
            )}
            alt="2027 and Beyond Diagram"
            className="w-full max-w-[340px] sm:max-w-[440px] object-contain select-none pointer-events-none animate-hero-pulse-settle"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {cards.map((c, ci) => (
          <div
            key={ci}
            style={{
              animationDelay: `${0.35 + ci * 0.5}s`,
              borderTopColor: str(
                c.borderColor,
                ci < 2 ? "#9CAA54" : "#046D2A"
              ),
            }}
            className="group bg-white rounded-2xl border border-gray200 border-t-12 p-6 space-y-4 flex flex-col justify-between transition-all duration-200 hover:border-2 hover:border-[#728C28] animate-card-entrance-slow"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#E5E8DA] flex items-center justify-center shrink-0 transition-[background-color,transform] duration-300 group-hover:scale-110 group-hover:bg-[#EAF1D6] motion-reduce:transform-none">
                <img
                  src={str(c.icon)}
                  alt={str(c.eyebrow)}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-notes uppercase block">
                {str(c.eyebrow)}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-gray800 leading-snug">
                {str(c.title)}
              </h3>
              {str(c.description) && (
                <p className="text-xs text-gray600 leading-relaxed font-normal">
                  {str(c.description)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          animationDelay: "1.85s",
          backgroundColor: "rgba(138, 201, 0, 0.1)",
          borderWidth: 2,
        }}
        className="border border-[#B2DB79] rounded-2xl p-5 transition-[border-color,box-shadow] duration-300 hover:border-[#728C28] hover:shadow-md animate-card-entrance-slow"
      >
        <p className="text-sm text-gray600 leading-relaxed w-full xl:w-1/2">
          <LgRichInline
            text={str(content.summaryBoxText)}
            boldClassName="font-bold text-lg-dark"
          />
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
        <button
          data-report-action="download"
          onClick={() => onNavigate("downloads")}
          className="bg-[#046D2A] hover:bg-[#035822] text-white text-sm font-bold px-6 py-3 rounded-full flex items-center gap-2 transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-md motion-reduce:hover:translate-y-0 cursor-pointer"
        >
          <span>Download {String(data.report.year || "2026")} PDF</span>
          <Download className="h-4 w-4" />
        </button>

        <button
          data-report-action="secondary"
          onClick={() => onNavigate("executive_summary")}
          className="border border-[#B2DB79] bg-[#FAFAF0] hover:bg-gray200 text-notes text-sm font-bold px-6 py-3 rounded-full cursor-pointer transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-sm motion-reduce:hover:translate-y-0"
        >
          Revisit the Executive Summary
        </button>

        <a
          href={
            data.report.contactUrl || "https://publicskillsaustralia.org.au/contact"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray200 hover:bg-gray200 text-gray800 text-sm font-bold px-6 py-3 rounded-full cursor-pointer transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-sm motion-reduce:hover:translate-y-0 no-underline inline-flex items-center justify-center"
        >
          Contact Public Skills Australia
        </a>
      </div>
    </div>
  );
}

/* ── 22. DOWNLOADS & REFERENCES TEMPLATE ── */
function LgDownloadsCmsView({
  content,
  onNavigate,
}: {
  content: JsonObj;
  onNavigate: (pt: string) => void;
}) {
  const prevCta = (content.prevCta || {}) as JsonObj;
  const full = (content.fullReport || {}) as JsonObj;
  const previous = arr<JsonObj>(content.previousReports);

  return (
    <div className="space-y-8">
      <LocalGovernmentReportUtilityRow>
        <div>
          <button
            data-report-action="secondary"
            onClick={() => onNavigate(str(prevCta.pageType, "introduction"))}
            className="border border-[#B2DB79] bg-[#FAFAF0] hover:bg-gray200 text-[#728C28] font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />{" "}
            {str(prevCta.label, "Back to Introduction")}
          </button>
        </div>
      </LocalGovernmentReportUtilityRow>

      <div className="relative bg-white border border-gray200 rounded-2xl p-6 overflow-hidden flex items-center justify-between min-h-[140px]">
        <div className="space-y-1 relative z-10 min-w-0 flex-1">
          <span className="text-xs font-bold text-[#9CAA54] uppercase tracking-wider block">
            {str(content.eyebrow, "Download PDF")}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-[clamp(1.5rem,2.5vw,2.25rem)] lg:whitespace-nowrap font-bold text-[#046D2A] leading-tight animate-slide-up">
            {str(content.title, "Local Government Workforce Insights Reports PDFs")}
          </h1>
        </div>
        <div className="absolute right-0 top-0 bottom-0 h-full flex items-center justify-end pointer-events-none">
          <img
            src={str(content.heroImage, "/images/hero-graphic-downloads.png")}
            alt="Downloads and reference Graphic"
            className="h-full w-auto object-contain object-right animate-zoom-in"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div
          data-report-surface="neutral"
          style={{ animationDelay: "0.15s" }}
          className="animate-card-entrance bg-[#046D2A] border border-gray200 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-6">
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider block">
              {str(full.badge, "FULL REPORT")}
            </span>
            <div className="w-16 h-16 flex items-center justify-center shrink-0">
              <img
                src={str(full.icon, "/images/downloads-full-report-icon.png")}
                alt="Full Report Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white leading-snug">
                {str(full.title)}
              </h2>
              <p className="text-sm text-white/90 leading-relaxed font-normal">
                {str(full.description)}
              </p>
            </div>
          </div>
          <div>
            <a
              href={str(full.url, "#")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sweep-white-notes text-gray800 font-bold text-xs px-6 py-3 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-xs no-underline"
            >
              <span>{str(full.buttonLabel, "Open 2026 PDF")}</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div
          style={{ animationDelay: "0.27s" }}
          className="animate-card-entrance bg-white border border-gray200 border-t-[12px] border-t-[#9CAA54] rounded-2xl p-6 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-6">
            <span className="text-xs font-semibold text-gray600 uppercase tracking-wider block">
              {str(content.previousHeading, "PREVIOUS REPORTS")}
            </span>
            <div className="space-y-4">
              {previous.map((pr, idx) => (
                <a
                  key={idx}
                  href={str(pr.url, "#")}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ animationDelay: `${0.33 + idx * 0.06}s` }}
                  className="animate-card-entrance bg-[#9CAA5433] border border-[#9CAA54] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors hover:bg-[#EAF1D6] hover:border-[#728C28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#728C28] no-underline"
                >
                  <span className="text-xs sm:text-sm font-bold text-gray800">
                    {str(pr.title)}
                  </span>
                  <ExternalLink
                    className="h-4 w-4 text-[#728C28] shrink-0"
                    aria-hidden="true"
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

/* ── MAIN LG STATIC PARITY DISPATCHER ── */
export function LocalGovernmentCmsPageView({
  data,
  content,
  shellSlug,
  onNavigate,
}: {
  data: PublicReportPageResponse;
  content: JsonObj;
  shellSlug: string;
  onNavigate: (pt: string) => void;
}) {
  const tpl = str(content.lgTemplate, data.page.pageType.toLowerCase());

  switch (tpl) {
    case "introduction":
      return (
        <LgIntroductionCmsView
          data={data}
          content={content}
          onNavigate={onNavigate}
        />
      );
    case "about":
      return <LgAboutCmsView data={data} content={content} />;
    case "methodology":
      return (
        <LgMethodologyCmsView
          data={data}
          content={content}
          onNavigate={onNavigate}
        />
      );
    case "executive_summary":
      return (
        <LgExecutiveSummaryCmsView
          data={data}
          content={content}
          onNavigate={onNavigate}
        />
      );
    case "drivers_of_change":
      return <LgDriversOfChangeCmsView data={data} content={content} />;
    case "industry_overview":
      return (
        <LgIndustryOverviewCmsView
          data={data}
          content={content}
          shellSlug={shellSlug}
          onNavigate={onNavigate}
        />
      );
    case "state_territory":
      return <LgStateTerritoryCmsView content={content} />;
    case "industry_profile":
      return <LgIndustryProfileCmsView content={content} />;
    case "workforce_insights":
      return (
        <LgWorkforceInsightsCmsView
          data={data}
          content={content}
          shellSlug={shellSlug}
          onNavigate={onNavigate}
        />
      );
    case "insight_detail":
      return (
        <LgInsightDetailCmsView
          data={data}
          content={content}
          onNavigate={onNavigate}
        />
      );
    case "workforce_strategies":
      return (
        <LgWorkforceStrategiesCmsView
          content={content}
          onNavigate={onNavigate}
        />
      );
    case "update_2025_strategies":
      return (
        <LgUpdate2025StrategiesCmsView
          content={content}
          onNavigate={onNavigate}
        />
      );
    case "existing_strategies":
      return (
        <LgExistingStrategiesCmsView
          content={content}
          onNavigate={onNavigate}
        />
      );
    case "federal_initiatives":
      return (
        <LgFederalInitiativesCmsView
          content={content}
          onNavigate={onNavigate}
        />
      );
    case "looking_forward":
      return (
        <LgLookingForwardCmsView
          data={data}
          content={content}
          onNavigate={onNavigate}
        />
      );
    case "downloads":
      return (
        <LgDownloadsCmsView content={content} onNavigate={onNavigate} />
      );
    default:
      return null;
  }
}
