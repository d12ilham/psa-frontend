import type { ReactNode } from "react";
import styles from "./report-design.module.css";

export default function ReportDesignLayout({ children }: { children: ReactNode }) {
  return <div className={styles.report} data-report-design="psa">{children}</div>;
}
