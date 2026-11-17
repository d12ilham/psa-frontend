"use client";

import { PublicSafetyFootnoteLink } from "./PublicSafetySourceText";

import React from "react";
import Image from "next/image";
import PublicSafetyPageShell, { type PublicSafetyReport } from "./PublicSafetyPageShell";
import { PUBLIC_SAFETY_FUNCTIONS } from "../data/overview";

export default function PublicSafetyAboutView({ slug, report }: { slug: string; report: PublicSafetyReport }) {
  const undertakesRef = React.useRef<HTMLElement>(null);
  const [isUndertakesVisible, setIsUndertakesVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsUndertakesVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (undertakesRef.current) observer.observe(undertakesRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <PublicSafetyPageShell slug={slug} report={report} currentPage="about" contentClassName="max-w-360! py-8! space-y-8! lg:px-8 bg-background text-gray800">
      <section className="relative overflow-hidden rounded-2xl border border-gray200 bg-white p-6 space-y-6">
        <Image
          src="/images/wave-right.png"
          alt=""
          width={420}
          height={540}
          priority
          className="absolute top-0 right-0 w-80 h-auto pointer-events-none opacity-40 z-0 object-contain object-top-right select-none animate-hero-rotate"
        />
        <div className="relative z-10 space-y-4">
          <h1 className="max-w-3xl text-3xl sm:text-4xl font-bold text-gray800 animate-slide-up">About Public Skills Australia</h1>
          <p className="max-w-3xl text-xs sm:text-sm text-gray600 leading-relaxed font-normal animate-slide-up-delay">
            Public Skills Australia is the Jobs and Skills Council (JSC) for the Public Safety and Government industry, comprising Correctional Services, Defence, Federal, State/Territory and Local Government, Fire and Emergency Services and Police industry-sectors.
          </p>

          <div className="relative z-10 max-w-2xl flex items-start gap-4 rounded-2xl border border-gray200 p-5">
            <Image src="/images/reports/about/working-in-partnership.svg" alt="" width={64} height={64} className="h-16 w-16 shrink-0 object-contain animate-zoom-in" />
            <div className="space-y-1">
              <h2 className="font-bold text-sm text-gray800">Working in partnership</h2>
              <p className="text-xs text-gray600 leading-relaxed">
                Through its work, Public Skills Australia actively supports employer and employee bodies in these industries and associated volunteer associations. Public Skills Australia works in partnership with the Department of Employment and Workplace Relations (DEWR) and other JSCs to give effect to broader Ministerial and government priorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section ref={undertakesRef} className="space-y-6">
        <div className="border-b border-gray200 pb-3">
          <h2 className={`text-xl sm:text-2xl font-bold text-gray800 ${isUndertakesVisible ? "animate-slide-up" : "opacity-0"}`}>Public Skills Australia Undertakes:</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PUBLIC_SAFETY_FUNCTIONS.map((item, index) => (
            <article key={item.title} style={isUndertakesVisible ? { animationDelay: `${index * 0.12 + 0.1}s` } : undefined} className={`group relative flex flex-col space-y-5 cursor-pointer rounded-2xl border border-gray200 bg-white p-6 transition-all duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-2 hover:scale-[1.02] hover:border-lg-dark hover:shadow-xl ${isUndertakesVisible ? "animate-card-entrance" : "translate-y-6 opacity-0"}`}>
              <Image src={item.icon} alt="" width={64} height={64} className="h-16 w-16 shrink-0 object-contain transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110" />
              <div className="space-y-5">
                <h3 className="text-base font-bold leading-snug text-gray800 transition-colors duration-500 group-hover:text-lg-dark">{item.title}</h3>
                <p className="text-xs text-gray600 leading-relaxed">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col sm:flex-row items-start gap-5 rounded-2xl border border-gray200 bg-white p-6">
        <Image src="/images/reports/about/Commitment.svg" alt="" width={64} height={64} className="h-16 w-16 shrink-0 object-contain" />
        <div className="space-y-2 flex-1">
          <h2 className="text-base font-bold text-gray800">Our commitment</h2>
          <p className="text-sm text-gray600 leading-relaxed w-full xl:w-2/3">
            Public Skills Australia remains committed to encouraging the participation of First Nations people,<sup><PublicSafetyFootnoteLink number={1} noteHref="#public-safety-note-1" /></sup> those from culturally and linguistically diverse backgrounds, those living with or experiencing disabilities, women and other gender diverse people and mature people in the Public Safety and Government industry workforces.
          </p>
        </div>
      </section>

      <aside data-report-surface="neutral" id="public-safety-note-1" className="rounded-2xl border border-gray200 bg-[#F0F5DF] p-6 text-xs text-gray600 leading-relaxed">
        <p className="w-full xl:w-2/3">
          <sup>1.</sup> Please note, First Nations people will be used as preferred terminology inclusive of Aboriginal and Torres Strait Islanders. When citing a data source (such as government strategies or state of the sector reports) the terminology of the data source will be used to maintain accurate data representation.
        </p>
      </aside>
    </PublicSafetyPageShell>
  );
}
