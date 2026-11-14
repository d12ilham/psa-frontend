import PublicSafetySourceText, { PublicSafetyFootnoteLink } from "./PublicSafetySourceText";
import Image from "next/image";
import { FileSearch, Route } from "lucide-react";
import PublicSafetyPageShell, { type PublicSafetyReport } from "./PublicSafetyPageShell";

import layout from "./PublicSafetyDefenceView.module.css";
import styles from "./PublicSafetyPoliceDigitalForensicsView.module.css";

const sources = [
  "IBM, What is computer forensics?, IBM website, n.d., accessed 12 November 2025.",
  "E Scott, Forensic science and the criminal justice system, UK Parliament House of Lords Library, 2021, accessed 5 March 2026, p 37.",
  "His Majesty's Inspectorate of Constabulary and Fire & Rescue Services (HMICFRS), An inspection into how well the police and other organisations use digital forensics in their investigations, 2022, accessed 12 November 2025.",
  "His Majesty's Inspectorate of Constabulary and Fire & Rescue Services (HMICFRS), An inspection into how well the police and other organisations use digital forensics in their investigations, 2022, accessed 12 November 2025.",
  "M Ng, J James and R Bull, A reflexive thematic analysis of current challenges and future directions of digital forensic investigations in the UK, Forensic Science International: Digital Investigation, 2024, 51:1–9.",
  "Dr. G Liddy, To research international digital forensics strategies to inform future operating models, Winston Churchill Memorial Trust, 2023, accessed 20 November 2025.",
  "IBM, What is computer forensics?, IBM website, n.d., accessed 12 November 2025.",
  "National Police Chief’s Council (NPCC), National Digital Forensic Science Strategy, NPCC, 2020, accessed 18 November 2025.",
  "Jobs and Skills Australia (JSA), Cyber security skills in demand as labour market evolves, JSA, accessed 20 November 2025. The group considered as cyber security specialists by JSA for this report was Database and Systems Administrators and ICT Security Specialists.",
  "JSA, Cyber security skills in demand as labour market evolves, JSA, accessed 20 November 2025.",
  "Jobs and Skills Australia (JSA), Australian Labour Market for Migrants – October 2025, JSA website, 2025, p 9, accessed 20 November 2025. The report notes: Cyber Governance Risk and Compliance Specialist (ANZSCO 262114), Cyber Security Architect (ANZSCO 262117) and Cyber Security Operations Coordinator (ANZSCO 262118) as being in shortage.",
];

export default function PublicSafetyPoliceDigitalForensicsView({ slug, report }: { slug: string; report: PublicSafetyReport }) {
  return <PublicSafetyPageShell slug={slug} report={report} currentPage="police_digital_forensics" contentClassName={`${layout.page} ${styles.page}`} navigation={{
    back: { label: "Police Workforce Insights", href: `/reports/${slug}/police_workforce_insights` },
    backSecondary: { label: "Executive Summary", href: `/reports/${slug}/executive_summary` },
    prev: { label: "Workforce Insights", href: `/reports/${slug}/police_workforce_insights` },
    next: { label: "Digital Forensics · Insight Two", href: `/reports/${slug}/police_digital_forensics_2` },
    prevPrefix: "Previous Section:", nextPrefix: "Next Section:",
  }}>
    <section className={`${styles.panel} ${styles.topicHero} ${layout.enter}`}>
      <div>
        <p className={styles.topicBadge}>Theme 1. Digital Forensics. Insight One</p>
        <h1>1. Digital Forensics</h1>
      </div>
      <div className={`${styles.illustration} animate-zoom-in`}>
        <Image src="/images/reports/public-safety/police-forensics-hero.png" width={90} height={90} alt="" unoptimized />
      </div>
    </section>

    <section className={`${styles.panel} ${layout.enter}`} aria-labelledby="police-forensics-insight-one">
      <div className={`${styles.banner} ${styles.insightCallout}`}>
        <span className={styles.number} aria-hidden="true">1</span>
        <div className={styles.bannerCopy}>
          <p id="police-forensics-insight-one">Theme One, Insight One</p>
          <div className={`${styles.headline} ${styles.insightOneHeadline}`}>
            <p className={styles.insightStatement}>Skills shortages and strong demand for similar skills may require the establishment of multiple entry pathways for digital forensic professionals into policing.</p>
            <Image className="animate-zoom-in" src="/images/reports/public-safety/police-forensics-insight.png" width={72} height={72} alt="" unoptimized />
          </div>
        </div>
      </div>
    </section>

    <div className={styles.columns}>
    <section className={`${styles.panel} ${layout.enter}`}><h2 className={styles.demandHeading}><span>Demand for digital forensics</span><span className={styles.demandGraphic} aria-hidden="true"><FileSearch size={48} strokeWidth={1.5} /></span></h2><p className="mt-6 text-sm leading-6 text-[#535862]">Broader digital transformation and the increasing adoption of technology means that evidence can be found on a growing array of devices, such as computer systems, mobile phones, cars, doorbells and dog collars.<sup><PublicSafetyFootnoteLink number={69} /></sup> According to testimonial evidence in the United Kingdom, most criminal investigations now contain elements of digital evidence that require retrieval and examination by digital forensic experts, whether from computers, mobile phones, CCTV, GPS systems or other digital devices.<sup><PublicSafetyFootnoteLink number={70} /></sup></p><p className="mt-4 text-sm leading-6 text-[#535862]">Despite the increased demand for digital forensics, there has not been a corresponding uplift in capability and coordination in this area.<sup><PublicSafetyFootnoteLink number={71} /></sup> This has led to a substantial backlog of digital forensics work.<sup><PublicSafetyFootnoteLink number={72} /></sup> Stakeholder consultations in Australia indicated that digital forensics required to support contemporary investigations needs a different set of skills to other forensic field sciences such as fingerprint and firearms examination. Digital evidence is more easily destroyed, can span multiple jurisdictions and is evolving at a rapid pace.<sup><PublicSafetyFootnoteLink number={73} /></sup></p></section>

    <section className={`${styles.panel} ${layout.enter}`}><h2>Three domains of digital forensic skills</h2><p className="mt-6 text-sm leading-6 text-[#535862]">Through consultations, it was identified that digital forensic skills required in policing covers three domains:</p><ul className={`${styles.domainList} mt-3 text-sm leading-6 text-[#535862]`}><li className="list-disc"><strong>Foundation skills across policing:</strong> Police working on investigations involving digital evidence require an understanding of how data has been gathered, acquired and any limitations that data may have, in the same way as they would need to understand physical forensic evidence.<sup><PublicSafetyFootnoteLink number={74} /></sup> It is critical that police involved in digital evidence collection know how to collect and store data without altering it, given that seemingly harmless actions such as opening, printing or saving files can change metadata permanently and place the evidence in question.<sup><PublicSafetyFootnoteLink number={75} /></sup></li><li className="list-disc"><strong>Core Digital Forensic Examiner Skills:</strong> Digital forensic examiners must have a core set of skills and must be adaptable and focus on problem solving as they work with ever changing digital environments. They must be able to continually adapt to changes in technology, operating system and devices.<sup><PublicSafetyFootnoteLink number={76} /></sup></li><li className="list-disc"><strong>Specialist Digital Forensics Roles:</strong> In addition to the foundational and core digital examiner skills, consultation identified that there are likely several specialist digital forensic areas requiring more advanced skills. This would include an Advanced Digital Forensic Examiner, Mobile Device Forensic Specialist, Cloud and Network Forensics Specialist and Quality Assurance / Technical Reviewer.</li></ul></section>

    <section className={`${styles.panel} ${layout.enter}`}><h2 className={styles.demandHeading}><span>Skills shortages and entry pathways</span><span className={styles.demandGraphic} aria-hidden="true"><Route size={48} strokeWidth={1.5} /></span></h2><p className="mt-6 text-sm leading-6 text-[#535862]">Cyber Security Professionals, including digital forensic specialists, is a segment of the workforce that is experiencing sustained demand, with employment in this group projected to grow 14.2 per cent between 2024 and 2029.<sup><PublicSafetyFootnoteLink number={77} /></sup> This is more than double the national average rate of growth at 6.6 per cent.<sup><PublicSafetyFootnoteLink number={78} /></sup></p><p className="mt-4 text-sm leading-6 text-[#535862]">As there is significant cross-over in the digital skills required by the private sector and those in demand for digital forensics in policing, this gives rise to competition with the private sector where wages are generally higher.</p><p className="mt-4 text-sm leading-6 text-[#535862]">Persistent shortages of skilled cyber employees have been noted, with Jobs and Skills Australia&#8217;s Occupation Shortage List analysis finding several cyber security occupations in national shortage, indicating challenges in filling vacancies for most jurisdictions.<sup><PublicSafetyFootnoteLink number={79} /></sup> This is likely compounded by the wider recruitment and retention challenge policing has faced in recent years. Skills shortages and strong demand for similar skills may require the establishment of multiple entry pathways for digital forensic professionals.</p></section>

    </div>

    <hr className={styles.rule} />
    <section data-report-sources className={`${styles.panel} ${styles.sources} ${layout.enter}`}>
      <h2>Sources</h2>
      <ol start={69}>
        {sources.map((source, index) => (
          <li key={index}><span aria-hidden="true">{index + 69}</span><span><PublicSafetySourceText number={index + 69} text={source} /></span></li>
        ))}
      </ol>
    </section>
  </PublicSafetyPageShell>;
}
