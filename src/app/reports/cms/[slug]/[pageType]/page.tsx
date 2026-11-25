"use client";

import React, { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getPublicReportPage,
  type PublicReportPageResponse,
} from "@/lib/cmsApi";
import CmsReportRenderer from "@/components/cms/CmsReportRenderer";

export function CmsReportChapterLoader({
  slug,
  pageType,
  isPreview = false,
  isCmsRoute = false,
}: {
  slug: string;
  pageType: string;
  isPreview?: boolean;
  isCmsRoute?: boolean;
}) {
  const [data, setData] = useState<PublicReportPageResponse | null>(null);
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

    getPublicReportPage(slug, pageType, previewFlag)
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Chapter not found")
      );
  }, [slug, pageType, isPreview, isCmsRoute]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAF0] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-extrabold text-[#252D02]">
          CMS Chapter Unavailable
        </h1>
        <p className="text-sm text-[#535862] max-w-md">{error}</p>
        <Link
          href={`${isCmsRoute ? `/reports/cms/${slug}` : `/reports/${slug}`}${effectivePreview ? "?preview=1" : ""}`}
          className="px-4 py-2 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold no-underline"
        >
          Back to Report Landing
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#FAFAF0] flex items-center justify-center text-sm text-[#535862]">
        Loading chapter from CMS...
      </div>
    );
  }

  return (
    <CmsReportRenderer
      data={data}
      isPreview={effectivePreview}
      isCmsRoute={isCmsRoute}
    />
  );
}

function CmsReportChapterContent({
  slug,
  pageType,
}: {
  slug: string;
  pageType: string;
}) {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "1";

  return (
    <CmsReportChapterLoader
      slug={slug}
      pageType={pageType}
      isPreview={isPreview}
      isCmsRoute={true}
    />
  );
}

export default function CmsReportChapterPage({
  params,
}: {
  params: Promise<{ slug: string; pageType: string }>;
}) {
  const { slug, pageType } = use(params);
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF0] flex items-center justify-center text-sm text-[#535862]">
          Loading chapter...
        </div>
      }
    >
      <CmsReportChapterContent slug={slug} pageType={pageType} />
    </Suspense>
  );
}
