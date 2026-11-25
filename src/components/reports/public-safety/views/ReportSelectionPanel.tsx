"use client";

import { useRef, type ReactNode } from "react";
import { useReportReader } from "../../useReportReader";

export default function ReportSelectionPanel({ selection, label, children }: {
  selection: number;
  label: string;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useReportReader(panel, selection);

  return <div ref={panel} data-reader-detail role="region" aria-label={label} tabIndex={0}>
    {children}
  </div>;
}
