"use client";

import React, { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getPublicReport,
  type PublicReportLandingResponse,
} from "@/lib/cmsApi";
import { CmsReportLandingView } from "@/components/cms/CmsReportRenderer";

export function CmsReportLandingLoader({
  slug,
  isPreview = false,
  isCmsRoute = false,
}: {
  slug: string;
  isPreview?: boolean;
  isCmsRoute?: boolean;
}) {
  const [data, setData] = useState<PublicReportLandingResponse | null>(null);
  const [error, setError] = useState("");
  const [effectivePreview, setEffectivePreview] = useState(isPreview);

  useEffect(() => {
    let previewFlag = isPreview;
    if (isCmsRoute && typeof window !== "undefined") {
      const storageKey = `cms_preview_${slug}`;
      if (isPreview) {
        sessionStorage.setItem(storageKey, "1");
      } else if (sessionStorage.getItem(storageKey) === "1") {
        previewFlag = true;
      }
    }
    setEffectivePreview(previewFlag);

    getPublicReport(slug, previewFlag)
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Report not found")
      );
  }, [slug, isPreview, isCmsRoute]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAF0] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-extrabold text-[#252D02]">
          CMS Report Unavailable
        </h1>
        <p className="text-sm text-[#535862] max-w-md">{error}</p>
        <div className="flex gap-3">
          <Link
            href="/reports"
            className="px-4 py-2 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold no-underline"
          >
            Back to Reports
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 rounded-full border border-[#E5E8DA] bg-white text-[#252D02] text-xs font-bold no-underline"
          >
            Open CMS Admin
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#FAFAF0] flex items-center justify-center text-sm text-[#535862]">
        Loading report from CMS...
      </div>
    );
  }

  return (
    <CmsReportLandingView
      data={data}
      isPreview={effectivePreview}
      isCmsRoute={isCmsRoute}
    />
  );
}

function CmsReportLandingContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "1";
  return (
    <CmsReportLandingLoader
      slug={slug}
      isPreview={isPreview}
      isCmsRoute={true}
    />
  );
}

export default function CmsReportLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF0] flex items-center justify-center text-sm text-[#535862]">
          Loading report...
        </div>
      }
    >
      <CmsReportLandingContent slug={slug} />
    </Suspense>
  );
}
