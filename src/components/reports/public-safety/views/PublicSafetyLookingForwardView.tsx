"use client";

import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PublicSafetyPageShell, { type PublicSafetyReport } from "./PublicSafetyPageShell";

const priorities = [
  "inclusion and participation of First Nations people, women and other genders in the Public Safety and Government workforces.",
  "the use of AI and digital transformation and the impact of these technologies on the Public Safety and Government workforces.",
];

const focusAreas = [
  { label: "Cross-Industry", path: "cross_sector_analysis", color: "#12224F", text: "Exploring the potential of recognising core skill alignment between Public Safety industry-sectors in the VET sector context." },
  { label: "Defence", path: "defence", color: "#D3992C", text: "Leveraging the VET system to complement Defence's own long term workforce planning and skills requirements that may arise through the forthcoming National Defence Strategy update." },
  { label: "Fire and Emergency Services", path: "fes", color: "#C9481A", text: "Exploring the critical challenge of maintaining capability in the use of prescribed burning and backburning during bushfire suppression and examining capability requirements for divisional commander training." },
  { label: "Police", path: "police", color: "#0D71A3", text: "Examining challenges for police in regional, rural and remote communities with a focus on police leadership responsibilities being taken on earlier in careers." },
  { label: "Drivers of Change", path: "drivers_of_change", color: "#598303", text: "Continue to consider the impact of the identified drivers of change in this year's reports on the Public Safety industry-sector workforces." },
];

export default function PublicSafetyLookingForwardView({ slug, report }: { slug: string; report: PublicSafetyReport }) {
  const prioritiesRef = useRef<HTMLElement>(null);
  const focusRef = useRef<HTMLElement>(null);
  const [prioritiesVisible, setPrioritiesVisible] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (entry.target === prioritiesRef.current) setPrioritiesVisible(true);
        if (entry.target === focusRef.current) setFocusVisible(true);
      });
    }, { threshold: 0.12 });
    if (prioritiesRef.current) observer.observe(prioritiesRef.current);
    if (focusRef.current) observer.observe(focusRef.current);
    return () => observer.disconnect();
  }, []);

  return <PublicSafetyPageShell slug={slug} report={report} currentPage="looking_forward" contentClassName="lg:py-10" navigation={{
    back: { label: "Executive Summary", href: `/reports/${slug}/executive_summary` },
    prev: { label: "Commonwealth Government Initiatives", href: `/reports/${slug}/police_federal_initiatives` },
    prevPrefix: "Previous Section:",
    pagesOrder: [
      { key: "police_federal_initiatives", label: "Commonwealth Government Initiatives" },
      { key: "looking_forward", label: "Looking Forward" },
    ],
  }}>
    <section className="grid items-center gap-6 rounded-2xl border border-[#E9EAEB] bg-white p-6 transition-shadow duration-300 hover:shadow-sm lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)]">
      <div>
        <div className="animate-slide-up motion-reduce:animate-none"><p className="text-sm font-medium uppercase text-[#598303]">Public Safety WIR 2026 · Looking Forward</p><h1 className="mt-5 text-[32px] font-bold leading-tight text-black sm:text-[40px] sm:leading-[48px]">2027 and Beyond</h1></div>
        <p className="mt-5 max-w-[744px] animate-slide-up-delay text-sm leading-6 text-[#252D02] motion-reduce:animate-none">Public Skills Australia has built on the 2024 Workforce Plans and the 2025 Public Safety Workforce Insights Report in the development and delivery of this Report. These reports continue to be the strategic centrepiece guiding annual Business Plans for Public Skills Australia, alongside Ministerial, industry-sector and other priorities (e.g. Royal Commissions and Inquiries).</p>
      </div>
      <Image
        src="/images/reports/public-safety/looking-forward-group-88.svg"
        width={512}
        height={251}
        alt=""
        loading="eager"
        className="h-auto w-full max-w-[512px] animate-zoom-in justify-self-center motion-reduce:animate-none"
      />
    </section>

    <section ref={prioritiesRef} className={`border-x border-transparent px-6 text-sm leading-6 text-[#252D02] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:animate-none ${prioritiesVisible ? "animate-slide-up" : "translate-y-5 opacity-0"}`}>
      <p>The 2027 Workforce Insights Reports will firstly focus on broader priorities detailed below and may be delivered throughout 2026/27:</p>
      <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-3">
        {[
          { label: "Line of Inquiry 1", icon: "inquiry-1.svg", text: priorities[0], colour: "#9CAA54" },
          { label: "Line of Inquiry 2", icon: "inquiry-2.svg", text: priorities[1], colour: "#9CAA54" },
          { label: "Continuing", icon: "inquiry-continuing.svg", text: "Additionally, the 2027 Workforce Insights Reports will focus on any other emerging priorities impacting Public Safety industry-sectors including:", colour: "#046D2A" },
        ].map((priority) => (
          <article key={priority.label} style={{ borderTopColor: priority.colour }} className="rounded-2xl border border-[#E9EAEB] border-t-[12px] bg-white p-6 transition-shadow duration-200 hover:shadow-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E8DA]">
              <Image src={`/images/${priority.icon}`} width={24} height={24} alt="" />
            </span>
            <p className="mt-4 text-xs font-semibold uppercase text-black">{priority.label}</p>
            <h2 className="mt-4 text-lg font-bold leading-snug text-black">{priority.text}</h2>
          </article>
        ))}
      </div>
    </section>

    <section ref={focusRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {focusAreas.map((area, index) => <article key={area.label} style={focusVisible ? { animationDelay: `${index * 0.1 + 0.08}s` } : undefined} className={`group relative min-h-[166px] overflow-hidden rounded-2xl border border-[#E9EAEB] bg-white px-6 pb-6 pt-8 motion-reduce:opacity-100 motion-reduce:animate-none motion-reduce:hover:translate-y-0 transition-all duration-300 hover:-translate-y-1 hover:border-[#B9C99A] hover:shadow-lg ${focusVisible ? "animate-card-entrance" : "opacity-0"}`}>
        <span className="absolute inset-x-0 top-0 h-[7px]" style={{ backgroundColor: area.color }}/>
        <span className="inline-flex rounded-full px-5 py-2.5 text-sm font-semibold uppercase text-white transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: area.color }}>{area.label}</span>
        <p className="mt-4 text-sm leading-6 text-black">{area.text}</p>
        <Link href={`/reports/${slug}/${area.path}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#8AC900] px-5 py-2.5 text-sm font-semibold text-[#252D02] hover:bg-[#78AF00] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#598303]">Explore {area.label} <span aria-hidden="true">→</span></Link>
      </article>)}
    </section>
    <div className="flex flex-wrap items-center justify-center gap-4 pt-2 sm:justify-start">
      <Link href={`/reports/${slug}/downloads?${new URLSearchParams({ from: `/reports/${slug}/looking_forward` })}`} className="inline-flex items-center gap-2 rounded-full bg-[#046D2A] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#035822]">
        Download {report.year?.label || "2026"} PDF <Download size={16} aria-hidden="true" />
      </Link>
      <Link href={`/reports/${slug}/executive_summary`} className="inline-flex items-center rounded-full border border-[#B2DB79] bg-[#FAFAF0] px-6 py-3 text-sm font-bold text-[#598303] transition-colors hover:bg-[#E9EAEB]">Revisit the Executive Summary</Link>
      <a href={report.contactUrl || "https://publicskillsaustralia.org.au/contact"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-[#E9EAEB] px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-[#E9EAEB]">Contact Public Skills Australia</a>
    </div>
  </PublicSafetyPageShell>;
}
