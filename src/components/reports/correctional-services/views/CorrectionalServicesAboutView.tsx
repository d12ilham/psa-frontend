"use client";

import CorrectionalServicesReportUtilityRow from "../CorrectionalServicesReportUtilityRow";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReportFooter from "@/components/layout/ReportFooter";
import ReportHeader from "@/components/layout/ReportHeader";

type CorrectionalServicesReport = {
  pdfFileUrl?: string;
  contactUrl?: string;
  year?: { label: string };
  industry?: { slug?: string; name?: string };
};

const undertakes = [
  {
    title: "Workforce Planning (Workforce Insights)",
    icon: "/images/reports/about/Workforce.svg",
    description:
      "Public Skills Australia undertakes data analysis, research and consultation to deepen understandings of contemporary workforce challenges and what can be done to mitigate these challenges.",
  },
  {
    title: "Training Product Development",
    icon: "/images/reports/about/Training.svg",
    description:
      "Public Skills Australia develops quality training products to strengthen the skills and capabilities of Public Safety and Government workforces.",
  },
  {
    title: "Implementation, Promotion and Monitoring",
    icon: "/images/reports/about/Supports.svg",
    description:
      "Public Skills Australia monitors and promotes the implementation of training products to support career pathways for the Public Safety and Government industry-sectors.",
  },
  {
    title: "Industry Stewardship",
    icon: "/images/reports/about/Industry.svg",
    description:
      "Public Skills Australia consults with, advocates for and promotes the needs of the Public Safety and Government industry-sectors.",
  },
];

export default function CorrectionalServicesAboutView({
  slug,
  report,
}: {
  slug: string;
  report: CorrectionalServicesReport;
}) {
  const undertakesRef = React.useRef<HTMLElement>(null);
  const [isUndertakesVisible, setIsUndertakesVisible] = React.useState(false);

  React.useEffect(() => {
    const node = undertakesRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsUndertakesVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-gray800 antialiased selection:bg-accent/30">
      <ReportHeader slug={slug} report={report} currentPage="about" />

      <main className="mx-auto flex w-full max-w-360 flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <CorrectionalServicesReportUtilityRow>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Link data-report-action="secondary"
              href={"/reports/" + slug + "/introduction"}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#B2DB79] bg-[#FAFAF0] px-5 text-sm font-bold text-[#598303] no-underline transition-colors hover:bg-[#F0F5DF]"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Introduction
            </Link>
            <Link data-report-action="primary"
              href={"/reports/" + slug + "/methodology"}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#8AC900] px-5 text-sm font-bold text-[#252D02] no-underline transition-colors hover:bg-[#79B600]"
            >
              Next Section: Methodology
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </CorrectionalServicesReportUtilityRow>

        <section className="relative overflow-hidden rounded-2xl border border-gray200 bg-white p-6">
          <Image
            src="/images/wave-right.png"
            alt=""
            width={392}
            height={936}
            priority
            className="absolute top-0 right-0 w-80 h-auto pointer-events-none opacity-40 z-0 object-contain object-top-right select-none animate-hero-rotate"
          />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="max-w-3xl flex flex-col gap-4 animate-slide-up">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray800">
                About Public Skills Australia
              </h1>
              <p className="text-xs sm:text-sm text-gray600 leading-relaxed font-normal">
                Public Skills Australia is the Jobs and Skills Council (JSC) for
                the Public Safety and Government industry, comprising Correctional
                Services, Defence, Federal, State/Territory and Local Government,
                Fire and Emergency Services and Police industry-sectors.
              </p>
            </div>

            <div className="flex max-w-2xl items-start gap-4 rounded-2xl border border-gray200 p-5 animate-card-entrance">
              <Image
                src="/images/reports/about/working-in-partnership.svg"
                alt=""
                width={64}
                height={64}
                className="size-16 shrink-0 object-contain animate-zoom-in"
              />
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-bold text-gray800">
                  Working in partnership
                </h2>
                <p className="text-xs text-gray600 leading-relaxed font-normal">
                  Through its work, Public Skills Australia actively supports
                  employer and employee bodies in these industries and associated
                  volunteer associations. Public Skills Australia works in
                  partnership with the Department of Employment and Workplace
                  Relations (DEWR) and other JSCs to give effect to broader
                  Ministerial and government priorities.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section ref={undertakesRef} className="flex flex-col gap-6">
          <div className="border-b border-gray200 pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray800">
              Public Skills Australia:
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {undertakes.map((item, index) => (
              <article
                key={item.title}
                style={
                  isUndertakesVisible
                    ? { animationDelay: `${index * 0.12 + 0.1}s` }
                    : undefined
                }
                className={
                  "group relative flex flex-col gap-5 rounded-2xl border border-gray200 bg-white p-6 cursor-pointer transition-all duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-2 hover:scale-[1.02] hover:border-lg-dark hover:shadow-xl " +
                  (isUndertakesVisible
                    ? "animate-card-entrance"
                    : "opacity-0 translate-y-6")
                }
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={64}
                  height={64}
                  className="size-16 shrink-0 object-contain transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                />
                <div className="flex flex-col gap-5">
                  <h3 className="text-base font-bold leading-snug text-gray800 group-hover:text-lg-dark transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col items-start gap-5 rounded-2xl border border-gray200 bg-white p-6 sm:flex-row">
            <Image
              src="/images/reports/about/Commitment.svg"
              alt=""
              width={64}
              height={64}
              className="size-16 shrink-0 object-contain"
            />
            <div className="flex flex-1 flex-col gap-2">
              <h2 className="text-base font-bold text-gray800">
                Our commitment
              </h2>
              <p className="text-sm text-gray600 leading-relaxed w-full xl:w-2/3">
                Public Skills Australia remains committed to encouraging the
                participation of First Nations people,<sup>1</sup> those from
                culturally and linguistically diverse backgrounds, those living
                with or experiencing disabilities, women and other gender
                diverse people and mature people in the Public Safety and
                Government industry workforces.
              </p>
            </div>
          </div>

          <aside data-report-surface="neutral" className="rounded-2xl border border-gray200 bg-[#F0F5DF] p-6 text-xs text-gray600 leading-relaxed font-normal">
            <ol className="w-full xl:w-2/3 list-decimal pl-5">
              <li>
                Please note, First Nations people will be used as preferred
                terminology inclusive of Aboriginal and Torres Strait Islanders.
                When citing a data source (such as government strategies or state
                of the sector reports) the terminology of the data source will be
                used to maintain accurate data representation.
              </li>
            </ol>
          </aside>
        </section>
      </main>

      <ReportFooter
        contactUrl={report.contactUrl}
        reportName="Correctional Services Workforce Insights Report"
      />
    </div>
  );
}
