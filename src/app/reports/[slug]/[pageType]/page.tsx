"use client";

import React, { use } from "react";
import { getReportView } from "@/components/reports/registry";
import { getStaticReport } from "@/config/reports/sectors";
import { STATIC_2026_SLUGS } from "@/lib/cmsApi";
import { CmsReportChapterLoader } from "@/app/reports/cms/[slug]/[pageType]/page";

export default function PublicReportReaderPage({
  params,
}: {
  params: Promise<{ slug: string; pageType: string }>;
}) {
  const { slug, pageType } = use(params);

  if (!STATIC_2026_SLUGS.has(slug)) {
    return <CmsReportChapterLoader slug={slug} pageType={pageType} isCmsRoute={false} />;
  }

  const report = getStaticReport(slug);

  return getReportView({ slug, pageType, report });
}
