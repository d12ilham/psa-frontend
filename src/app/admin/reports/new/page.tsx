"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import {
  cloneAdminReport,
  createAdminReport,
  getAdminReports,
  getAdminSectors,
  type CmsReport,
  type CmsSector,
} from "@/lib/cmsApi";
import { CopyPlus, Sparkles, ArrowLeft } from "lucide-react";

export default function NewReportWizardPage() {
  const router = useRouter();
  const [sectors, setSectors] = useState<CmsSector[]>([]);
  const [reports, setReports] = useState<CmsReport[]>([]);
  const [mode, setMode] = useState<"template" | "clone">("template");

  const [sectorId, setSectorId] = useState("");
  const [sourceReportId, setSourceReportId] = useState("");
  const [year, setYear] = useState<number>(2027);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [pdfFileUrl, setPdfFileUrl] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAdminSectors(), getAdminReports()]).then(([secs, reps]) => {
      setSectors(secs);
      setReports(reps);
      if (secs.length > 0) {
        setSectorId(secs[0].id);
        setTitle(`2027 ${secs[0].name} Workforce Insights Report`);
        setSlug(`${secs[0].slug}-wir-2027`);
        setShortDescription(secs[0].subtitle || "");
      }
      if (reps.length > 0) {
        setSourceReportId(reps[0].id);
      }
    });
  }, []);

  const updateDefaultsForSectorAndYear = (nextSectorId: string, nextYear: number) => {
    const sec = sectors.find((s) => s.id === nextSectorId);
    if (!sec) return;
    setTitle(`${nextYear} ${sec.name} Workforce Insights Report`);
    setSlug(`${sec.slug}-wir-${nextYear}`);
    setShortDescription(sec.subtitle || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      let created: CmsReport;
      if (mode === "clone") {
        if (!sourceReportId) throw new Error("Select a source report to clone");
        created = await cloneAdminReport(sourceReportId, {
          targetYear: year,
          title: title || undefined,
          slug: slug || undefined,
          status,
        });
      } else {
        if (!sectorId) throw new Error("Select a sector");
        created = await createAdminReport({
          sectorId,
          year,
          title,
          slug: slug || undefined,
          shortDescription,
          pdfFileUrl,
          status,
          scaffoldTemplates: true,
        });
      }
      router.push(`/admin/reports/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell
      title="Create Future-Year Report"
      subtitle="Generate a complete multi-chapter Workforce Insights Report for 2027, 2028+ from standardized DWIR templates or by cloning an existing year."
      actions={
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#E5E8DA] bg-white text-xs font-bold text-[#252D02] no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Reports</span>
        </Link>
      }
    >
      <div className="max-w-3xl bg-white rounded-2xl border border-[#E5E8DA] p-6 sm:p-8">
        {/* Creation Mode Switch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setMode("template")}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-colors ${
              mode === "template"
                ? "border-[#8AC900] bg-[#F0F5DF]"
                : "border-[#E5E8DA] bg-white hover:bg-[#FAFAF0]"
            }`}
          >
            <div className="flex items-center gap-2 font-extrabold text-sm text-[#252D02]">
              <Sparkles className="w-4 h-4 text-[#598303]" />
              <span>Fresh Standardized Templates</span>
            </div>
            <p className="text-xs text-[#535862] mt-1">
              Scaffolds all 18 standardized DWIR templates (Transition, Intro, Exec Summary, Insights, Strategies, etc.) for a sector & year.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMode("clone")}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-colors ${
              mode === "clone"
                ? "border-[#8AC900] bg-[#F0F5DF]"
                : "border-[#E5E8DA] bg-white hover:bg-[#FAFAF0]"
            }`}
          >
            <div className="flex items-center gap-2 font-extrabold text-sm text-[#252D02]">
              <CopyPlus className="w-4 h-4 text-[#598303]" />
              <span>Clone Existing Year Report</span>
            </div>
            <p className="text-xs text-[#535862] mt-1">
              Duplicates all chapters, blocks, and footnotes from a prior year and automatically archives its PDF in Previous Reports.
            </p>
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "template" ? (
            <div>
              <label className="block text-xs font-bold uppercase text-[#535862] mb-1.5">
                Sector Template
              </label>
              <select
                value={sectorId}
                onChange={(e) => {
                  setSectorId(e.target.value);
                  updateDefaultsForSectorAndYear(e.target.value, year);
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E8DA] text-sm bg-white"
              >
                {sectors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.shortCode})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase text-[#535862] mb-1.5">
                Source Report to Clone
              </label>
              <select
                value={sourceReportId}
                onChange={(e) => {
                  const rep = reports.find((r) => r.id === e.target.value);
                  setSourceReportId(e.target.value);
                  if (rep) {
                    const nextY = rep.year + 1;
                    setYear(nextY);
                    setTitle(`${nextY} ${rep.sector?.name || ""} Workforce Insights Report`.trim());
                    setSlug(`${rep.sector?.slug || "report"}-wir-${nextY}`);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E8DA] text-sm bg-white"
              >
                {reports.map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.year}] {r.title} ({r.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#535862] mb-1.5">
                Report Year
              </label>
              <input
                type="number"
                required
                min={2020}
                max={2100}
                value={year}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  setYear(y);
                  if (mode === "template") {
                    updateDefaultsForSectorAndYear(sectorId, y);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E8DA] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#535862] mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E8DA] text-sm bg-white"
              >
                <option value="DRAFT">DRAFT (Preview before publishing)</option>
                <option value="PUBLISHED">PUBLISHED (Live immediately)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#535862] mb-1.5">
              Report Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E8DA] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#535862] mb-1.5">
              URL Slug
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E8DA] text-sm font-mono"
            />
            <p className="text-[11px] text-[#535862] mt-1">
              Public URL will be: <code>/reports/{slug || "..."}</code>
            </p>
          </div>

          {mode === "template" && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase text-[#535862] mb-1.5">
                  Short Description
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E8DA] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#535862] mb-1.5">
                  Full Report PDF URL (Optional — can be uploaded later)
                </label>
                <input
                  type="text"
                  value={pdfFileUrl}
                  onChange={(e) => setPdfFileUrl(e.target.value)}
                  placeholder="https://... or upload in PDFs & Media"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E8DA] text-sm"
                />
              </div>
            </>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-full border border-[#E5E8DA] text-sm font-bold text-[#535862] no-underline"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-[#8AC900] hover:bg-[#699A05] hover:text-white text-[#252D02] text-sm font-bold cursor-pointer disabled:opacity-50"
            >
              {submitting
                ? "Creating..."
                : mode === "clone"
                  ? `Clone Report for ${year}`
                  : `Create ${year} Report`}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
