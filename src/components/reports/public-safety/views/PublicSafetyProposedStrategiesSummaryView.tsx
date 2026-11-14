import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PublicSafetyPageShell, { type PublicSafetyReport } from "./PublicSafetyPageShell";

const strategySummary = [
  {
    sector: "Defence",
    strategies: [
      {
        title: "Support Defence skill and capability requirements to operationalise drones",
        text: "Map current Defence micro-credentials on drones and unmanned aerial systems (UAS) to existing units of competency from current VET qualifications.",
      },
      {
        title: "Support transition of Defence Veterans to civilian workforce",
        text: "Support Recommendation 83(c) of the Royal Commission into Defence and Veteran Suicide by facilitating up-to-date information facilitated by state and territory initiatives that assist transitioning veterans.",
      },
    ],
  },
  {
    sector: "Fire and Emergency Services",
    strategies: [
      {
        title: "Support uptake of disaster recovery training products",
        text: "Strengthen capabilities of disaster recovery for Fire and Emergency Services and Government personnel by promoting the uptake of disaster recovery training products.",
      },
      {
        title: "Review first aid units of competency for Surf Life Saving in the Certificate II in Public Safety (Aquatic Rescue)",
        text: "Ensure the Certificate II in Public Safety (Aquatic Rescue) reflects the first aid requirements of Surf Life Saving.",
      },
      {
        title: "Review prerequisite requirements for PUAFIR306 Identify, detect and monitor hazardous materials at an incident",
        text: "Support increased access to hazardous materials training though reviewing a key unit of competency for the Fire and Emergency Services industry.",
      },
    ],
  },
  {
    sector: "Police",
    strategies: [
      {
        title: "Develop Training Products for Digital Forensics",
        text: "Develop a digital forensics qualification to be included in the POL Police Training Package.",
      },
    ],
  },
];

function SummaryText({ text }: { text: string }) {
  const parts = text.split(/(Recommendation 83\(c\)|Royal Commission into Defence and Veteran Suicide|Certificate II in Public Safety \(Aquatic Rescue\)|PUAFIR306 Identify, detect and monitor hazardous materials at an incident)/g);
  return <>{parts.map((part, index) => index % 2 ? <em key={index}>{part}</em> : part)}</>;
}

export default function PublicSafetyProposedStrategiesSummaryView({ slug, report }: { slug: string; report: PublicSafetyReport }) {
  return <PublicSafetyPageShell slug={slug} report={report} currentPage="police_proposed_strategies_summary" navigation={{
    back: { label: "Executive Summary", href: `/reports/${slug}/executive_summary` },
    prev: { label: "Police Existing Industry-Sector Strategies", href: `/reports/${slug}/police_existing_strategies` },
    next: { label: "Commonwealth Government Initiatives", href: `/reports/${slug}/police_federal_initiatives` },
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

    <section className="overflow-hidden rounded-2xl border border-[#E9EAEB] bg-white" aria-label="Proposed strategies by industry-sector">
      <table className="w-full table-fixed border-collapse text-left text-sm leading-6 text-black">
        <thead className="bg-[#EDF2DF]">
          <tr>
            <th scope="col" className="w-[30%] p-3 align-top font-semibold sm:w-1/4 sm:p-5">Industry-Sector</th>
            <th scope="col" className="p-3 align-top font-semibold sm:p-5">Strategy</th>
          </tr>
        </thead>
        <tbody>
          {strategySummary.map(({ sector, strategies }) => (
            <tr key={sector} className="border-t border-[#E9EAEB]">
              <th scope="row" className="break-words p-3 align-top font-semibold sm:p-5">{sector}</th>
              <td className="p-3 align-top sm:p-5">
                <div className="space-y-4">
                  {strategies.map(({ title, text }) => (
                    <p key={title}><strong className="font-semibold"><SummaryText text={title} />:</strong> <SummaryText text={text} /></p>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <div className="flex flex-wrap justify-center gap-3">
      {[{ label: "Open in the Defence Chapter", href: "defence_workforce_strategies" }, { label: "Open in the Fire and Emergency Services Chapter", href: "fes_workforce_strategies" }, { label: "Open in Police Chapter", href: "police_workforce_strategies" }].map(item => <Link key={item.href} href={`/reports/${slug}/${item.href}`} className="inline-flex items-center gap-2 rounded-full bg-[#8AC900] px-5 py-3 text-sm font-semibold text-[#253100]">{item.label}<ArrowRight size={14}/></Link>)}
    </div>
  </PublicSafetyPageShell>;
}
