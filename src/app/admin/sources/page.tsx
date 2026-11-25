"use client";

import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  checkSourceLinks,
  createSourceLink,
  deleteSourceLink,
  getSourceLinks,
  type CmsSourceLink,
} from "@/lib/cmsApi";
import { Plus, RefreshCw, Trash2, ExternalLink } from "lucide-react";

export default function SourcesLibraryAdminPage() {
  const [sources, setSources] = useState<CmsSourceLink[]>([]);
  const [checking, setChecking] = useState(false);
  const [label, setLabel] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [url, setUrl] = useState("");
  const [publisher, setPublisher] = useState("");
  const [referenceYear, setReferenceYear] = useState(2026);

  const load = () => getSourceLinks().then(setSources);

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSourceLink({
      label,
      sourceName,
      url,
      publisher,
      referenceYear,
      openInNewTab: true,
    });
    setLabel("");
    setSourceName("");
    setUrl("");
    setPublisher("");
    await load();
  };

  const handleCheckLinks = async () => {
    setChecking(true);
    try {
      const res = await checkSourceLinks();
      setSources(res.sources);
    } finally {
      setChecking(false);
    }
  };

  return (
    <AdminShell
      title="Reusable Source Links & Citations Library"
      subtitle="Manage verified government & research citations and validate external links across reports."
      actions={
        <button
          type="button"
          disabled={checking}
          onClick={handleCheckLinks}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#252D02] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
          <span>{checking ? "Checking URLs..." : "Check Link Health"}</span>
        </button>
      }
    >
      <form
        onSubmit={handleAdd}
        className="bg-white rounded-2xl border border-[#E5E8DA] p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end"
      >
        <div className="lg:col-span-2">
          <label className="block text-[11px] font-bold uppercase text-[#535862] mb-1">
            Citation Label
          </label>
          <input
            type="text"
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="ABS Labour Force Survey, 2026"
            className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase text-[#535862] mb-1">
            Source Name (Italicised)
          </label>
          <input
            type="text"
            required
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            placeholder="Australian Bureau of Statistics"
            className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase text-[#535862] mb-1">
            External URL
          </label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.abs.gov.au/"
            className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase text-[#535862] mb-1">
            Year
          </label>
          <input
            type="number"
            value={referenceYear}
            onChange={(e) => setReferenceYear(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#8AC900] text-[#252D02] text-sm font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Source
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-[#E5E8DA] overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#F0F5DF]/60 border-b border-[#E5E8DA] text-[11px] font-bold uppercase text-[#535862]">
              <th className="py-3 px-4">Source Name (Italics) &amp; Label</th>
              <th className="py-3 px-4">Year</th>
              <th className="py-3 px-4">Health</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E8DA]">
            {sources.map((s) => (
              <tr key={s.id}>
                <td className="py-3 px-4">
                  <div className="font-bold italic text-[#252D02]">
                    {s.sourceName}
                  </div>
                  <div className="text-xs text-[#535862]">{s.label}</div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#598303] hover:underline mt-0.5"
                  >
                    <span>{s.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="py-3 px-4 font-semibold">{s.referenceYear}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      s.status === "OK"
                        ? "bg-[#F0F5DF] text-[#416102]"
                        : s.status === "BROKEN"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteSourceLink(s.id);
                      await load();
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
