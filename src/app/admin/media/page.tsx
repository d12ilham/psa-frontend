"use client";

import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  deleteMediaAsset,
  getMediaAssets,
  uploadMediaAsset,
  type CmsMediaAsset,
} from "@/lib/cmsApi";
import { Upload, Copy, Trash2, FileText, Image as ImageIcon, Check } from "lucide-react";

export default function MediaAdminPage() {
  const [assets, setAssets] = useState<CmsMediaAsset[]>([]);
  const [category, setCategory] = useState("pdf");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState("");

  const load = () => getMediaAssets().then(setAssets);

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadMediaAsset(file, category);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  return (
    <AdminShell
      title="PDFs & Media Assets"
      subtitle="Upload official annual report PDFs (2026, 2027+) and SVG/PNG/WebP graphics."
    >
      <div className="bg-white rounded-2xl border border-[#E5E8DA] p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase text-[#535862]">
            Asset Category:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm bg-white"
          >
            <option value="pdf">Report PDF</option>
            <option value="graphic">Section Graphic / SVG</option>
            <option value="cover">Cover Image</option>
          </select>
        </div>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8AC900] hover:bg-[#699A05] hover:text-white text-[#252D02] text-sm font-bold cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          <span>{uploading ? "Uploading..." : "Upload File"}</span>
          <input type="file" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {assets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E8DA] p-10 text-center text-sm text-[#535862]">
          No uploaded assets yet. Upload a PDF or graphic above to copy its URL into any report or chapter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => {
            const isPdf = asset.mimeType === "application/pdf";
            return (
              <div
                key={asset.id}
                className="bg-white rounded-xl border border-[#E5E8DA] p-4 flex flex-col justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F0F5DF] flex items-center justify-center text-[#416102] shrink-0">
                    {isPdf ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-[#252D02] truncate">
                      {asset.originalName}
                    </div>
                    <div className="text-xs text-[#535862]">
                      {asset.category} · {(asset.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E5E8DA]">
                  <button
                    type="button"
                    onClick={() => copyUrl(asset.id, asset.url)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F0F5DF] text-[#416102] text-xs font-bold cursor-pointer"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy URL
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteMediaAsset(asset.id);
                      await load();
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
