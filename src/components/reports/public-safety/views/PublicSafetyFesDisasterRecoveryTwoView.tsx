import PublicSafetySourceText, { PublicSafetyFootnoteLink } from "./PublicSafetySourceText";
import Image from "next/image";
import PublicSafetySourceLink from "./PublicSafetySourceLink";
import { fesDisasterRecoverySources } from "../data/fesDisasterRecoverySources";
import PublicSafetyPageShell, { type PublicSafetyReport } from "./PublicSafetyPageShell";
import layout from "./PublicSafetyDefenceWorkforceInsightsView.module.css";
import sourceStyles from "./PublicSafetyDefenceEmergingTechnologyView.module.css";
import styles from "./PublicSafetyFesDisasterRecoveryView.module.css";

const firstSourceNumber = 57;
const insightTwoSources = fesDisasterRecoverySources.slice(firstSourceNumber - 53, 59 - 53 + 1);

const vocstatsSourceUrl = "https://www.ncver.edu.au/research-and-statistics/vocstats";
const insightTwoSourceTitles = [
  "Australian Institute for Disaster Resilience Handbook Collection: Community Recovery",
  "Training package – PUA Public Safety",
  "Total VET students and courses: VOCSTATS",
];

function InsightTwoSourceText({ source, number }: { source: string; number: number }) {
  const title = insightTwoSourceTitles[number - firstSourceNumber];
  const start = source.indexOf(title);
  return <>{source.slice(0, start)}<em>{number === 59
    ? <PublicSafetySourceLink href={vocstatsSourceUrl}>{title}</PublicSafetySourceLink>
    : <PublicSafetySourceText number={number} text={title} />}</em>{source.slice(start + title.length)}</>;
}

export default function PublicSafetyFesDisasterRecoveryTwoView({ slug, report }: { slug: string; report: PublicSafetyReport }) {
  const reportPath = `/reports/${slug}`;
  const insightsPath = `${reportPath}/fes_workforce_insights`;

  return <PublicSafetyPageShell slug={slug} report={report} currentPage="fes_disaster_recovery_2" contentClassName={`${layout.page} ${styles.page}`} navigation={{
    back: { label: "Workforce Insights", href: insightsPath },
    backSecondary: { label: "Executive Summary", href: `${reportPath}/executive_summary` },
    prev: { label: "Workforce Insights", href: insightsPath },
    next: { label: "Disaster Recovery. Insight Three.", href: `${reportPath}/fes_disaster_recovery_3` },
    prevPrefix: "Previous Section:",
    nextPrefix: "Next Section:",
  }}>
    <section className={`${layout.hero} ${styles.hero} ${styles.insightOneHero}`}>
      <div className={`${styles.heroCopy} animate-slide-up`}>
        <span className={`${layout.badge} ${styles.badge}`}>Theme 1. Disaster Recovery. Insight Two</span>
        <h1>1. Disaster Recovery</h1>
      </div>
      <div className={`${styles.house} ${styles.animatedHouse} animate-zoom-in`}>
        <Image src="/images/reports/public-safety/fes-recovery-house.png" width={111} height={122} alt="" unoptimized priority />
      </div>
    </section>

    <section className={`${styles.summary} ${styles.numberedSummary} ${styles.animatedSection} animate-slide-up-delay`} aria-labelledby="fes-recovery-insight-two">
      <span className={styles.insightNumber} aria-hidden="true">2</span>
      <div className={`${styles.summaryCopy} ${styles.wideSummaryCopy}`}>
        <p id="fes-recovery-insight-two" className={styles.insightLabel}>Theme One, Insight Two</p>
        <p>Challenges in access to nationally accredited disaster recovery training products leads to inconsistencies in recovery outcomes, reduced community trust and limits the ability of communities to rebuild from the impacts of disasters.</p>
      </div>
      <Image className={`${styles.animatedSummaryIcon} animate-zoom-in`} src="/images/reports/public-safety/fes-recovery-insight.png" width={72} height={72} alt="" unoptimized />
    </section>

    <section className={`${styles.detail} ${styles.insightTwoDetail} ${styles.animatedSection} animate-slide-up-delay`}>
      <h2>Access to disaster recovery training</h2>
      <div className={styles.narrative}>
        <div className="max-w-[900px]">
          <p>Despite the relevance and importance of disaster recovery training, there are limited TAFEs and RTOs equipped to deliver this training. For example:</p>
          <ul className="list-disc ps-5">
            <li>seven of the nine newly developed skill sets are not on scope for any RTO</li>
            <li>only one RTO has the qualification and four associated units of competency on scope</li>
            <li>only five RTOs have the <em>PUASS00098 Manage a Recovery Centre</em> skill set on scope.<sup><PublicSafetyFootnoteLink number={58} /></sup></li>
          </ul>
          <p>Additionally, there have been no enrolment or completion data for all 14 recovery training products since their release in <span className="whitespace-nowrap">2022<sup><a href={vocstatsSourceUrl} target="_blank" rel="noopener noreferrer" aria-label="Open original source 59" className="underline decoration-current underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-4">59</a></sup>.</span></p>
        </div>
      </div>
    </section>

    <hr className={styles.rule} />
    <section data-report-sources className={`${sourceStyles.sources} ${styles.animatedSection} animate-slide-up-delay`}>
      <h2>Sources</h2>
      <ol start={firstSourceNumber}>
        {insightTwoSources.map((source, index) => <li key={source}><span className={sourceStyles.sourceNumber} aria-hidden="true">{firstSourceNumber + index}</span><span><InsightTwoSourceText number={firstSourceNumber + index} source={source} /></span></li>)}
      </ol>
    </section>
  </PublicSafetyPageShell>;
}
