import PublicSafetySourceText, { PublicSafetyFootnoteLink } from "./PublicSafetySourceText";
import Image from "next/image";
import { BookOpenCheck } from "lucide-react";
import PublicSafetyPageShell, { type PublicSafetyReport } from "./PublicSafetyPageShell";

import layout from "./PublicSafetyDefenceView.module.css";
import styles from "./PublicSafetyPoliceDigitalForensicsView.module.css";

const insight = "The VET system is well established to deliver a nationally consistent approach to training, however, the Police Training Package currently does not contain a qualification specialising in digital forensics.";

const sources = [
  "Forensic Capability Network (FCN), Second cohort of digital forensic apprentices begin work, FCN website, 2024, accessed 18 November 2025.",
  "Forensic Capability Network (FCN), Second cohort of digital forensic apprentices begin work, FCN website, 2024, accessed 18 November 2025.",
  "Winston Churchill Trust, To research international digital forensics strategies to inform future operating models, Winston Churchill Memorial Trust, 2023, accessed 20 November 2025.",
];

export default function PublicSafetyPoliceDigitalForensicsTwoView({ slug, report }: { slug: string; report: PublicSafetyReport }) {
  return <PublicSafetyPageShell slug={slug} report={report} currentPage="police_digital_forensics_2" contentClassName={`${layout.page} ${styles.page} ${styles.insightTwo}`} navigation={{
    back: { label: "Police Workforce Insights", href: `/reports/${slug}/police_workforce_insights` },
    backSecondary: { label: "Executive Summary", href: `/reports/${slug}/executive_summary` },
    prev: { label: "Digital Forensics · Insight One", href: `/reports/${slug}/police_digital_forensics` },
    next: { label: "Rural, Regional and Remote Police Leadership", href: `/reports/${slug}/police_regional_remote_leadership` },
    prevPrefix: "Previous Section:", nextPrefix: "Next Section:",
  }}>
    <section className={`${styles.panel} ${styles.topicHero} ${layout.enter}`}>
      <div>
        <p className={styles.topicBadge}>Theme 1. Digital Forensics. Insight Two</p>
        <h1>1. Digital Forensics</h1>
      </div>
      <div className={`${styles.illustration} animate-zoom-in`}>
        <Image src="/images/reports/public-safety/police-forensics-hero.png" width={90} height={90} alt="" unoptimized />
      </div>
    </section>

    <section className={`${styles.panel} ${styles.training} ${layout.enter}`}>
      <div className={`${styles.banner} ${styles.insightCallout}`} aria-labelledby="police-forensics-insight-two">
        <span className={styles.number} aria-hidden="true">2</span>
        <div className={styles.bannerCopy}>
          <p id="police-forensics-insight-two">Theme One, Insight Two</p>
          <div className={styles.headline}>
            <Image className="animate-zoom-in" src="/images/reports/public-safety/police-forensics-insight.png" width={72} height={72} alt="" unoptimized />
            <p className={styles.insightStatement}>{insight}</p>
          </div>
        </div>
      </div>

      <h2>The POL Police Training Package</h2>
      <div className={styles.trainingNarrative}>
      <div className={styles.trainingCopy}>
        <p>Internationally, alternative pathways include paid internships for ex-defence personnel with digital forensics training and apprenticeship schemes offering a pathway into digital forensics.<sup><PublicSafetyFootnoteLink number={80} /></sup> Establishing career pathways also needs consideration in workforce planning to retain younger cohorts in digital forensics roles.<sup><PublicSafetyFootnoteLink number={81} /></sup></p>
        <p>Stakeholder consultation identified that the POL Police Training Package could be leveraged to develop much needed digital forensics skills. Internationally, a lack of consistency in digital forensics training has been identified as a risk to both the efficiency and quality of digital forensic investigations. Developing training products through the VET system will provide police nationally consistent, industry-endorsed skills standards that will support mitigating the risks encountered internationally.</p>
        <p>Additionally, these skills could be developed to cover general duties police officers right through to digital forensic specialist roles, ensuring police can develop consistent skills for handling digital forensics evidence.<sup><PublicSafetyFootnoteLink number={82} /></sup></p>
      </div>
      <span className={styles.trainingGraphic} aria-hidden="true"><BookOpenCheck size={64} strokeWidth={1.5} /></span>
      </div>
    </section>

    <hr className={styles.rule} />
    <section data-report-sources className={`${styles.panel} ${styles.sources} ${layout.enter}`}>
      <h2>Sources</h2>
      <ol start={80}>
        {sources.map((source, index) => (
          <li key={index}><span aria-hidden="true">{index + 80}</span><span><PublicSafetySourceText number={index + 80} text={source} /></span></li>
        ))}
      </ol>
    </section>
  </PublicSafetyPageShell>;
}
