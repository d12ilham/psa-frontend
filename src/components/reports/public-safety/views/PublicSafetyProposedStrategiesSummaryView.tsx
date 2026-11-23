import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PublicSafetyPageShell, { type PublicSafetyReport } from "./PublicSafetyPageShell";
import PublicSafetyProposedStrategyCards from "./PublicSafetyProposedStrategyCards";

export default function PublicSafetyProposedStrategiesSummaryView({ slug, report }: { slug: string; report: PublicSafetyReport }) {
  return <PublicSafetyPageShell slug={slug} report={report} currentPage="police_proposed_strategies_summary" navigation={{
    back: { label: "Executive Summary", href: `/reports/${slug}/executive_summary` },
    prev: { label: "Police Existing Industry-Sector Strategies", href: `/reports/${slug}/police_existing_strategies` },
    next: { label: "Federal Government Initiatives", href: `/reports/${slug}/police_federal_initiatives` },
    prevPrefix: "Previous Section:", nextPrefix: "Next Section:",
  }}>
    <section className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#E9EAEB] bg-white p-6 lg:flex-row lg:items-center">
      <div>
        <p className="text-sm font-semibold uppercase text-[#527900]">Public Safety WIR 2026 · Cross-Sector Strategies</p>
        <h1 className="mt-5 text-[32px] font-bold leading-tight text-[#252D02] xl:text-[40px]">Proposed Strategies Summary</h1>
        <p className="mt-4 max-w-[800px] text-balance text-sm leading-6 text-[#252D02]">The <em>2026 Public Safety Workforce Insights Report</em> proposes six strategies across the Defence, Fire and Emergency Services and Police industry-sectors. These strategies aim to build on and/or complement the existing strategies that were proposed through the <em>2025 Public Safety Workforce Insights</em> report and have been completed or continue to be progressed.</p>
      </div>
      <Image src="/images/reports/public-safety/strategies-summary-sector-icons.svg" alt="" width={364} height={277} className="h-auto w-full max-w-[364px] self-center lg:w-[30%]" />
    </section>

    <PublicSafetyProposedStrategyCards />

    <div className="flex flex-wrap justify-center gap-3">
      {[{ label: "Open in the Defence Chapter", href: "defence_workforce_strategies" }, { label: "Open in the Fire and Emergency Services Chapter", href: "fes_workforce_strategies" }, { label: "Open in Police Chapter", href: "police_workforce_strategies" }].map(item => <Link data-report-action="primary" key={item.href} href={`/reports/${slug}/${item.href}`} className="inline-flex items-center gap-2 rounded-full bg-[#8AC900] px-5 py-3 text-sm font-semibold text-[#253100]">{item.label}<ArrowRight size={14}/></Link>)}
    </div>
  </PublicSafetyPageShell>;
}
