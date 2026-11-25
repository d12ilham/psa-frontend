"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import TemplateEditor from "@/components/admin/TemplateEditors";
import FootnotesSourcesEditor from "@/components/admin/FootnotesSourcesEditor";
import {
  createChapterPage,
  deleteChapterPage,
  getAdminReport,
  reorderChapterPages,
  updateAdminReport,
  updateChapterPage,
  type CmsChapterPage,
  type CmsFootnote,
  type CmsReport,
} from "@/lib/cmsApi";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Plus,
  Save,
  Settings,
  Trash2,
  Check,
  ExternalLink,
} from "lucide-react";

export default function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [report, setReport] = useState<CmsReport | null>(null);
  const [pages, setPages] = useState<CmsChapterPage[]>([]);
  const [selectedTab, setSelectedTab] = useState<"settings" | string>("settings");
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState("");
  const [error, setError] = useState("");

  // New page modal
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageType, setNewPageType] = useState("one_off_page");
  const [newPageTitle, setNewPageTitle] = useState("");

  const load = async () => {
    try {
      const data = await getAdminReport(id);
      setReport(data);
      setPages(data.pages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load report");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const showToast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(""), 2500);
  };

  const selectedPage = pages.find((p) => p.id === selectedTab) || null;

  const handleSaveSettings = async () => {
    if (!report) return;
    setSaving(true);
    try {
      const updated = await updateAdminReport(report.id, {
        title: report.title,
        year: report.year,
        slug: report.slug,
        shortDescription: report.shortDescription,
        pdfFileUrl: report.pdfFileUrl,
        previousPdfs: report.previousPdfs,
        psaSectorPageUrl: report.psaSectorPageUrl,
        contactUrl: report.contactUrl,
        landingIntroDesc: report.landingIntroDesc,
        landingExecDesc: report.landingExecDesc,
        status: report.status,
        isFeatured: report.isFeatured,
      });
      setReport((prev) => (prev ? { ...prev, ...updated } : updated));
      showToast("Report settings saved!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePage = async () => {
    if (!selectedPage) return;
    setSaving(true);
    try {
      const updated = await updateChapterPage(selectedPage.id, {
        title: selectedPage.title,
        isVisible: selectedPage.isVisible,
        paletteMode: selectedPage.paletteMode,
        subSectorCode: selectedPage.subSectorCode,
        content: selectedPage.content,
        footnotes: selectedPage.footnotes,
      });
      setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showToast(`Saved "${updated.title}"`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  const handleMovePage = async (index: number, dir: -1 | 1) => {
    if (!report) return;
    const target = index + dir;
    if (target < 0 || target >= pages.length) return;
    const next = [...pages];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setPages(next);
    await reorderChapterPages(
      report.id,
      next.map((p) => p.id)
    );
  };

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;
    const created = await createChapterPage(report.id, {
      pageType: newPageType,
      title: newPageTitle || "New Special Feature Page",
      paletteMode: "SECTOR",
    });
    setPages((prev) => [...prev, created]);
    setSelectedTab(created.id);
    setShowAddPage(false);
    setNewPageTitle("");
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm("Remove this chapter page from the report?")) return;
    await deleteChapterPage(pageId);
    setPages((prev) => prev.filter((p) => p.id !== pageId));
    setSelectedTab("settings");
  };

  const updateSelectedPage = (patch: Partial<CmsChapterPage>) => {
    if (!selectedPage) return;
    setPages((prev) =>
      prev.map((p) => (p.id === selectedPage.id ? { ...p, ...patch } : p))
    );
  };

  return (
    <AdminShell
      title={report ? report.title : "Edit Report"}
      subtitle={
        report
          ? `${report.year} · ${report.sector?.name} · Status: ${report.status}`
          : "Loading..."
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {savedToast && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F0F5DF] border border-[#B2DB79] text-[#416102] text-xs font-bold">
              <Check className="w-3.5 h-3.5" /> {savedToast}
            </span>
          )}
          {report && (
            <Link
              href={
                selectedPage && selectedPage.pageType !== "transition"
                  ? `/reports/cms/${report.slug}/${selectedPage.pageType}?preview=1`
                  : `/reports/cms/${report.slug}?preview=1`
              }
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#B2DB79] bg-[#F0F5DF] text-[#416102] text-xs font-bold no-underline"
            >
              <span>Preview Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full border border-[#E5E8DA] bg-white text-xs font-bold text-[#252D02] no-underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Reports
          </Link>
        </div>
      }
    >
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chapter List Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-3">
            <button
              type="button"
              onClick={() => setSelectedTab("settings")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-left text-sm font-bold cursor-pointer ${
                selectedTab === "settings"
                  ? "bg-[#252D02] text-white border-[#252D02]"
                  : "bg-white text-[#252D02] border-[#E5E8DA] hover:bg-[#FAFAF0]"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Report Settings &amp; PDFs</span>
            </button>

            <div className="bg-white rounded-xl border border-[#E5E8DA] p-3 space-y-1.5">
              <div className="flex items-center justify-between px-1 pb-2 border-b border-[#E5E8DA]">
                <span className="text-xs font-extrabold uppercase text-[#535862]">
                  Chapters ({pages.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddPage(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#598303] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Page
                </button>
              </div>

              <div className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
                {pages.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`group flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs border transition-colors ${
                      selectedTab === p.id
                        ? "bg-[#F0F5DF] border-[#8AC900] font-bold text-[#252D02]"
                        : "bg-white border-transparent hover:bg-[#FAFAF0] text-[#535862]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedTab(p.id)}
                      className="flex-1 text-left truncate cursor-pointer"
                    >
                      <div className="truncate">{p.title}</div>
                      <div className="text-[10px] opacity-75">
                        {p.pageType} · {p.paletteMode}
                      </div>
                    </button>

                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMovePage(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 opacity-50 hover:opacity-100 disabled:opacity-20 cursor-pointer"
                        title="Move up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMovePage(idx, 1)}
                        disabled={idx === pages.length - 1}
                        className="p-1 opacity-50 hover:opacity-100 disabled:opacity-20 cursor-pointer"
                        title="Move down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      {!p.isVisible && <EyeOff className="w-3 h-3 text-amber-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-8 xl:col-span-9">
            {selectedTab === "settings" ? (
              <div className="bg-white rounded-2xl border border-[#E5E8DA] p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#E5E8DA] pb-4">
                  <h2 className="text-lg font-extrabold text-[#252D02]">
                    Report Metadata &amp; PDF Archive
                  </h2>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSaveSettings}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#8AC900] hover:bg-[#699A05] hover:text-white text-[#252D02] text-xs font-bold cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "Saving..." : "Save Settings"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-[#535862] mb-1">
                      Report Title
                    </label>
                    <input
                      type="text"
                      value={report.title}
                      onChange={(e) => setReport({ ...report, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#535862] mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={report.year}
                      onChange={(e) =>
                        setReport({ ...report, year: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#535862] mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={report.slug}
                      onChange={(e) => setReport({ ...report, slug: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#535862] mb-1">
                      Publication Status
                    </label>
                    <select
                      value={report.status}
                      onChange={(e) =>
                        setReport({
                          ...report,
                          status: e.target.value as CmsReport["status"],
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm bg-white"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="IN_REVIEW">IN_REVIEW</option>
                      <option value="PUBLISHED">PUBLISHED</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#535862] mb-1">
                    Current Year Full PDF URL
                  </label>
                  <input
                    type="text"
                    value={report.pdfFileUrl}
                    onChange={(e) =>
                      setReport({ ...report, pdfFileUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
                  />
                </div>

                {/* Previous Reports PDFs */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold uppercase text-[#535862]">
                      Previous Reports PDFs (Shown on Download PDFs Page)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setReport({
                          ...report,
                          previousPdfs: [
                            ...(report.previousPdfs || []),
                            { year: String(report.year - 1), title: "Previous Report", url: "" },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Previous PDF
                    </button>
                  </div>
                  {(report.previousPdfs || []).map((pdf, i) => (
                    <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={pdf.year}
                        onChange={(e) => {
                          const next = [...report.previousPdfs];
                          next[i] = { ...pdf, year: e.target.value };
                          setReport({ ...report, previousPdfs: next });
                        }}
                        placeholder="Year"
                        className="px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
                      />
                      <input
                        type="text"
                        value={pdf.title}
                        onChange={(e) => {
                          const next = [...report.previousPdfs];
                          next[i] = { ...pdf, title: e.target.value };
                          setReport({ ...report, previousPdfs: next });
                        }}
                        placeholder="Title"
                        className="px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
                      />
                      <input
                        type="text"
                        value={pdf.url}
                        onChange={(e) => {
                          const next = [...report.previousPdfs];
                          next[i] = { ...pdf, url: e.target.value };
                          setReport({ ...report, previousPdfs: next });
                        }}
                        placeholder="PDF URL"
                        className="px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setReport({
                            ...report,
                            previousPdfs: report.previousPdfs.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-red-600 text-xs font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedPage ? (
              <div className="bg-white rounded-2xl border border-[#E5E8DA] p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E8DA] pb-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase text-[#598303]">
                      Template: {selectedPage.pageType}
                    </div>
                    <h2 className="text-lg font-extrabold text-[#252D02]">
                      {selectedPage.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeletePage(selectedPage.id)}
                      className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Delete chapter page"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleSavePage}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#8AC900] hover:bg-[#699A05] hover:text-white text-[#252D02] text-xs font-bold cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? "Saving..." : "Save Chapter"}</span>
                    </button>
                  </div>
                </div>

                {/* Page Meta & Colour Palette Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#FAFAF0] border border-[#E5E8DA]">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#535862] mb-1">
                      Chapter Title
                    </label>
                    <input
                      type="text"
                      value={selectedPage.title}
                      onChange={(e) =>
                        updateSelectedPage({ title: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E8DA] text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#535862] mb-1">
                      Colour Rule (PSA vs Sector vs Sub-Sector)
                    </label>
                    <select
                      value={selectedPage.paletteMode}
                      onChange={(e) =>
                        updateSelectedPage({
                          paletteMode: e.target.value as CmsChapterPage["paletteMode"],
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E8DA] text-xs bg-white"
                    >
                      <option value="GLOBAL_PSA">GLOBAL_PSA (PSA Green)</option>
                      <option value="SECTOR">SECTOR ({report.sector?.shortCode})</option>
                      <option value="SUB_SECTOR">SUB_SECTOR (DEF / FES / POL)</option>
                    </select>
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    {selectedPage.paletteMode === "SUB_SECTOR" && (
                      <select
                        value={selectedPage.subSectorCode || ""}
                        onChange={(e) =>
                          updateSelectedPage({ subSectorCode: e.target.value })
                        }
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#E5E8DA] text-xs bg-white"
                      >
                        <option value="">Select sub-sector</option>
                        {(report.sector?.subSectors || []).map((sub) => (
                          <option key={sub.code} value={sub.code}>
                            {sub.name} ({sub.code})
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        updateSelectedPage({ isVisible: !selectedPage.isVisible })
                      }
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${
                        selectedPage.isVisible
                          ? "bg-white border-[#B2DB79] text-[#416102]"
                          : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}
                    >
                      {selectedPage.isVisible ? (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Hidden
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Structured Template Form */}
                <TemplateEditor
                  pageType={selectedPage.pageType}
                  content={selectedPage.content || {}}
                  onChange={(nextContent) =>
                    updateSelectedPage({ content: nextContent })
                  }
                />

                {/* Footnotes & Sources */}
                <FootnotesSourcesEditor
                  footnotes={selectedPage.footnotes || []}
                  onChange={(nextFootnotes: CmsFootnote[]) =>
                    updateSelectedPage({ footnotes: nextFootnotes })
                  }
                />
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Add Page Modal */}
      {showAddPage && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddPage}
            className="bg-white rounded-2xl border border-[#E5E8DA] max-w-md w-full p-6 space-y-4"
          >
            <h3 className="text-lg font-extrabold text-[#252D02]">
              Add One-Off or Template Page
            </h3>
            <div>
              <label className="block text-xs font-bold uppercase text-[#535862] mb-1">
                Template Type
              </label>
              <select
                value={newPageType}
                onChange={(e) => setNewPageType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm bg-white"
              >
                <option value="one_off_page">One-Off Page (Custom Sector Feature)</option>
                <option value="cross_sector_analysis">Cross-Sector Analysis (Public Safety)</option>
                <option value="industry_overview">Additional Industry Overview</option>
                <option value="industry_profile">Additional Industry Profile</option>
                <option value="workforce_insights_detail">Supporting Details Page</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#535862] mb-1">
                Page Title
              </label>
              <input
                type="text"
                required
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder="e.g. Community Corrections Introduction"
                className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddPage(false)}
                className="px-4 py-2 rounded-full border border-[#E5E8DA] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
              >
                Add Page
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
