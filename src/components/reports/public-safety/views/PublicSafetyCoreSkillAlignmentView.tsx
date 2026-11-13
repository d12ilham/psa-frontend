"use client";

import PublicSafetySourceText from "./PublicSafetySourceText";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PublicSafetyPageShell, { type PublicSafetyReport } from "./PublicSafetyPageShell";
import styles from "./PublicSafetyCoreSkillAlignmentView.module.css";

const occupations = [
  { title: "Defence Force Member – Other Ranks", code: "OSCA 451131", color: "#D3992C", background: "#FBF3E3" },
  { title: "Emergency Services Officer", code: "OSCA 451231", color: "#C9481A", background: "#FCECE8" },
  { title: "Firefighter", code: "OSCA 451232", color: "#C9481A", background: "#FCECE8" },
  { title: "General Duties Police Officer", code: "OSCA 451331", color: "#0D71A3", background: "#E7F1F6" },
];

const commonSkills = [
  { lines: ["Operating and maintaining", "equipment"], icon: "equipment" },
  { lines: ["Communication"], icon: "communication" },
  { lines: ["Community engagement"], icon: "community" },
  { lines: ["Collecting and analysing", "information"], icon: "analysis" },
  { lines: ["Responding to", "emergencies"], icon: "emergency" },
  { lines: ["Guarding or patrolling"], icon: "patrol" },
];

const sources = [
  { number: 8, text: "Australian Bureau of Statistics (ABS), OSCA – Occupation Standard Classification of Australia, ABS website, December 2024, accessed 19 January 2026." },
  { number: 9, text: "Australian Bureau of Statistics (ABS), OSCA – Occupation Standard Classification of Australia, ABS website, December 2024, accessed 19 January 2026." },
  { number: 10, text: "Jobs and Skills Australia (JSA), ‘Australian Skills Classification’, JSA, Australian Government, 2023." },
];

function Footnote({ number }: { number: number }) {
  return <sup className={styles.footnote}><a href={`#core-source-${number}`} aria-label={`Source ${number}`}>{number}</a></sup>;
}

export default function PublicSafetyCoreSkillAlignmentView({ slug, report }: { slug: string; report: PublicSafetyReport }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<string[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = (entry.target as HTMLElement).dataset.reveal;
        if (section) setVisible((current) => current.includes(section) ? current : [...current, section]);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    contentRef.current?.querySelectorAll("[data-reveal]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const reveal = (section: string) => visible.includes(section) ? styles.enter : styles.pending;

  return (
    <PublicSafetyPageShell
      slug={slug}
      report={report}
      currentPage="cross_sector_core_skill_alignment"
      contentClassName={styles.page}
      navigation={{
        back: { label: "Executive Summary", href: `/reports/${slug}/executive_summary` },
        prev: { label: "Cross-Sector Analysis", href: `/reports/${slug}/cross_sector_analysis` },
        next: { label: "Specialist Skill Alignment", href: `/reports/${slug}/cross_sector_specialist_skill_alignment` },
        prevPrefix: "Previous Section:", nextPrefix: "Next Section:",
      }}
    >
      <div ref={contentRef} className={styles.content}>
        <section className={`${styles.hero} ${styles.enter}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Cross-Sector Analysis · 01</p>
            <h1>Core Skill Alignment</h1>
            <p className={styles.heroDescription}>The Occupation Standard Classification for Australia (OSCA) recently released by the ABS, collectively categorises the following four Public Safety occupations in the Protective Service Workers Minor Group (group 45).<Footnote number={8} /></p>
          </div>
          <div className={styles.diagram}>
            <Image src="/images/reports/public-safety/core-alignment-group-92.svg" width={524} height={125} alt="Defence, police, navy, fire and air force vehicles connected by a dotted line" loading="eager" unoptimized />
          </div>
        </section>

        <section data-reveal="occupations" className={styles.occupations} aria-label="Public Safety occupations">
          {occupations.map((occupation, index) => (
            <article key={occupation.code} className={`${styles.occupation} ${reveal("occupations")}`} style={{ animationDelay: `${index * .1}s`, backgroundColor: occupation.background }}>
              <span className={styles.accent} style={{ backgroundColor: occupation.color }} />
              <h2>{occupation.title}</h2>
              <p>{occupation.code}</p>
            </article>
          ))}
        </section>

        <section data-reveal="skills" className={`${styles.skills} ${reveal("skills")}`}>
          <h2 className={styles.sectionTitle}>Common skills identified across these tasks</h2>
          <p className={styles.skillsIntro}>Tasks in this group, whether undertaken by volunteers or career employees, are characterised by the use of specialist equipment, intense physical effort and operating in high-stress emergency environments.<Footnote number={9} /> Common skills identified across these tasks include:</p>
          <div className={styles.skillGrid}>
            {commonSkills.map(({ lines, icon }, index) => (
              <div key={icon} className={`${styles.skillCard} ${reveal("skills")}`} style={{ animationDelay: `${index * .08 + .12}s` }}>
                <Image src={`/images/reports/public-safety/core-skills/${icon}.svg`} width={74} height={74} alt="" unoptimized />
                <span className={styles.skillLabel}>{lines.map((line) => <span key={line}>{line}</span>)}</span>
              </div>
            ))}
          </div>
        </section>

        <section data-reveal="graph" className={`${styles.graphPanel} ${reveal("graph")}`} aria-labelledby="core-graph-heading">
          <h2 id="core-graph-heading">Shared Core Skills · Australian Skills Classification (JSA)</h2>
          <p className={styles.skillsClosing}>The Public Safety industry-sectors occupations further share core skills as illustrated below:<Footnote number={10} /></p>
          <div className={styles.graphRow}>
            <div className={`${styles.graph} ${reveal("graph")}`}>
              <Image src="/images/reports/public-safety/core-skills-radar-approved.png" width={1416} height={786} alt="Approved ten-axis core-skills radar chart with overlapping Emergency Service Worker, Fire Fighter and Police Officer profiles: digital engagement, initiative and innovation, learning, numeracy, oral communication, planning and organising, problem solving, reading, teamwork and writing" unoptimized />
            </div>
            <div className={styles.graphDetails}>
              <div className={styles.sectorChips} role="list" aria-label="Radar chart legend">
                <span role="listitem">Emergency Service Worker</span>
                <span role="listitem">Fire Fighter</span>
                <span role="listitem">Police Officer</span>
              </div>
              <p className={styles.graphExplanation}>These three occupations encompass a range of core skills that may likely enable industry-sector cross skilling, greater interoperability and would enhance national capability to prepare for, respond to and recover from natural disasters, emergency incidents and geopolitical uncertainty.</p>
            </div>
          </div>
          <p data-source-caption className={styles.graphSource}><PublicSafetySourceText text={"Source: JSA, Australian Skills Classification, 2023 · ABS, OSCA, December 2024"} /></p>
        </section>

        <section data-report-sources data-reveal="sources" className={`${styles.sources} ${reveal("sources")}`}>
          <h2>Sources</h2>
          <ol start={8}>{sources.map(({ number, text }) => <li key={number} id={`core-source-${number}`} value={number}><span className={styles.sourceNumber} aria-hidden="true">{number}</span><span><PublicSafetySourceText number={number} text={text} /></span></li>)}</ol>
        </section>
      </div>
    </PublicSafetyPageShell>
  );
}
