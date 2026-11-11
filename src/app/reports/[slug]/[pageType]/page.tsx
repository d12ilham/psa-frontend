"use client";

import React, { use } from "react";
import { getReportView } from "@/components/reports/registry";
import { getStaticReport } from "@/config/reports/sectors";

export default function PublicReportReaderPage({
  params,
}: {
  params: Promise<{ slug: string; pageType: string }>;
}) {
  const { slug, pageType } = use(params);
  const report = getStaticReport(slug);

  return getReportView({ slug, pageType, report });
}
