"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import {
  cloneAdminReport,
  deleteAdminReport,
  getAdminReports,
  getAdminSectors,
  updateAdminReport,
  type CmsReport,
  type CmsSector,
} from "@/lib/cmsApi";
import {
  CopyPlus,
  Edit3,
  Eye,
  FilePlus2,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
} from "lucide-react";

const STATUS_BADGES: Record<string, string> = {
  PUBLISHED: "bg-[#F0F5DF] text-[#416102] border-[#B2DB79]",
  DRAFT: "bg-amber-50 text-amber-800 border-amber-200",
  IN_REVIEW: "bg-blue-50 text-blue-800 border-blue-200",
  ARCHIVED: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [reports, setReports] = useState<CmsReport[]>([]);
  const [sectors, setSectors] = useState<CmsSector[]>([]);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cloningReport, setCloningReport] = useState<CmsReport | null>(null);
  const [cloneYear, setCloneYear] = useState<number>(2027);
  const [cloneBusy, setCloneBusy] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [reps, secs] = await Promise.all([
        getAdminReports(),
        getAdminSectors(),
      ]);
      setReports(reps);
      setSectors(secs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load CMS data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const years = Array.from(new Set(reports.map((r) => r.year))).sort(
    (a, b) => b - a
  );

  const filtered = reports.filter((r) => {
    if (yearFilter !== "all" && String(r.year) !== yearFilter) return false;
    if (sectorFilter !== "all" && r.sectorId !== sectorFilter) return false;
    return true;
  });

  const handleQuickClone = async () => {
    if (!cloningReport) return;
    setCloneBusy(true);
    try {
      const created = await cloneAdminReport(cloningReport.id, {
        targetYear: cloneYear,
        status: "DRAFT",
      });
      setCloningReport(null);
      router.push(`/admin/reports/${created.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Clone failed");
    } finally {
      setCloneBusy(false);
    }
  };

  const handleTogglePublish = async (report: CmsReport) => {
    const nextStatus = report.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await updateAdminReport(report.id, { status: nextStatus });
    await loadData();
  };

  const handleDelete = async (report: CmsReport) => {
    if (
      !confirm(
        `Delete "${report.title}" (${report.year})? This removes all its CMS chapter pages.`
      )
    ) {
      return;
    }
    try {
      await deleteAdminReport(report.id);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete report");
    }
  };

  return (
    <AdminShell
      title="Workforce Insights Reports"
      subtitle="Create future-year reports from standardized DWIR templates, clone prior years, and edit chapter content."
      actions={
        <Link
          href="/admin/reports/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8AC900] hover:bg-[#699A05] hover:text-white text-[#252D02] text-sm font-bold no-underline transition-colors"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>Create Future Year Report</span>
        </Link>
      }
    >
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#E5E8DA] p-4">
          <div className="text-xs font-bold uppercase text-[#598303]">
            Total Reports
          </div>
          <div className="text-2xl font-extrabold mt-1">{reports.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E8DA] p-4">
          <div className="text-xs font-bold uppercase text-[#598303] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Published
          </div>
          <div className="text-2xl font-extrabold mt-1">
            {reports.filter((r) => r.status === "PUBLISHED").length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E8DA] p-4">
          <div className="text-xs font-bold uppercase text-amber-700 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Drafts / In Review
          </div>
          <div className="text-2xl font-extrabold mt-1">
            {
              reports.filter(
                (r) => r.status === "DRAFT" || r.status === "IN_REVIEW"
              ).length
            }
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E8DA] p-4">
          <div className="text-xs font-bold uppercase text-[#598303] flex items-center gap-1">
            <Archive className="w-3.5 h-3.5" /> Active Years
          </div>
          <div className="text-2xl font-extrabold mt-1">
            {years.length > 0 ? years.join(", ") : "—"}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E8DA] p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase text-[#535862]">
            Year:
          </label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E5E8DA] text-sm bg-white"
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase text-[#535862]">
            Sector:
          </label>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E5E8DA] text-sm bg-white"
          >
            <option value="all">All Sectors</option>
            {sectors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E8DA] overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-[#535862]">
            Loading CMS reports...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#535862]">
            No reports match your filter. Click &ldquo;Create Future Year Report&rdquo; to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F0F5DF]/60 border-b border-[#E5E8DA] text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">Report Title & Slug</th>
                  <th className="py-3 px-4">Chapters</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E8DA] text-sm">
                {filtered.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[#FAFAF0]/70">
                    <td className="py-3.5 px-4 font-extrabold text-[#252D02]">
                      {rep.year}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                        style={{
                          backgroundColor:
                            rep.sector?.primaryColor || "#046D2A",
                        }}
                      >
                        {rep.sector?.shortCode || rep.sector?.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#252D02]">
                        {rep.title}
                      </div>
                      <div className="text-xs text-[#535862]">
                        /{rep.slug}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-[#535862]">
                      {rep.pagesCount ?? "—"} pages
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(rep)}
                        title="Click to toggle Published/Draft"
                        className={`px-2.5 py-1 rounded-full border text-xs font-bold cursor-pointer ${
                          STATUS_BADGES[rep.status] || STATUS_BADGES.DRAFT
                        }`}
                      >
                        {rep.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/reports/${rep.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#252D02] text-white text-xs font-semibold no-underline hover:bg-[#416102]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Chapters</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setCloningReport(rep);
                            setCloneYear(rep.year + 1);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#B2DB79] bg-[#F0F5DF] text-[#416102] text-xs font-semibold cursor-pointer hover:bg-[#E2ECC8]"
                        >
                          <CopyPlus className="w-3.5 h-3.5" />
                          <span>Clone Year</span>
                        </button>

                        <Link
                          href={`/reports/cms/${rep.slug}?preview=1`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E5E8DA] text-[#535862] text-xs font-semibold no-underline hover:bg-gray-50"
                          title="Preview Dynamic CMS Report"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(rep)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clone Modal */}
      {cloningReport && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E8DA] max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-[#252D02]">
              Clone Report for Future Year
            </h2>
            <p className="text-xs text-[#535862]">
              Copies all standardized templates, chapters, and structure from{" "}
              <strong>{cloningReport.title}</strong> into a new draft report and
              automatically archives its PDF under Previous Reports.
            </p>
            <div>
              <label className="block text-xs font-bold uppercase text-[#535862] mb-1">
                Target Year
              </label>
              <input
                type="number"
                min={2020}
                max={2100}
                value={cloneYear}
                onChange={(e) => setCloneYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCloningReport(null)}
                className="px-4 py-2 rounded-full border border-[#E5E8DA] text-xs font-bold text-[#535862] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={cloneBusy}
                onClick={handleQuickClone}
                className="px-5 py-2 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer hover:bg-[#699A05] hover:text-white disabled:opacity-50"
              >
                {cloneBusy ? "Cloning..." : `Clone to ${cloneYear}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
