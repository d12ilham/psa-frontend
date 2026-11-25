"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, BookOpen, ExternalLink } from "lucide-react";
import {
  getSourceLinks,
  type CmsFootnote,
  type CmsSourceLink,
} from "@/lib/cmsApi";

export default function FootnotesSourcesEditor({
  footnotes,
  onChange,
}: {
  footnotes: CmsFootnote[];
  onChange: (next: CmsFootnote[]) => void;
}) {
  const [library, setLibrary] = useState<CmsSourceLink[]>([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState("");

  useEffect(() => {
    getSourceLinks()
      .then((res) => setLibrary(res))
      .catch(() => {});
  }, []);

  const addEmptyFootnote = () => {
    const nextNum =
      footnotes.reduce((max, f) => Math.max(max, f.number), 0) + 1;
    onChange([
      ...footnotes,
      {
        number: nextNum,
        text: "Citation description and page/table reference.",
        sourceName: "Source Name",
        url: "https://publicskillsaustralia.org.au",
        openInNewTab: true,
      },
    ]);
  };

  const importFromLibrary = () => {
    const found = library.find((l) => l.id === selectedLibraryId);
    if (!found) return;
    const nextNum =
      footnotes.reduce((max, f) => Math.max(max, f.number), 0) + 1;
    onChange([
      ...footnotes,
      {
        number: nextNum,
        text: found.label,
        sourceName: found.sourceName,
        url: found.url,
        openInNewTab: found.openInNewTab,
      },
    ]);
    setSelectedLibraryId("");
  };

  const updateAt = (index: number, patch: Partial<CmsFootnote>) => {
    onChange(
      footnotes.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const removeAt = (index: number) => {
    onChange(footnotes.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t border-[#E5E8DA] pt-6 mt-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-[#252D02]">
            Page-Bottom Footnotes &amp; Sources
          </h3>
          <p className="text-xs text-[#535862]">
            Audit standard: placed at page bottom (outside content boxes),{" "}
            <em>source name</em> italicised only, clickable URLs, and circles sized for 100+.
            Type <code>[[1]]</code> inside body text to link a raised superscript footnote.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {library.length > 0 && (
            <div className="flex items-center gap-1.5">
              <select
                value={selectedLibraryId}
                onChange={(e) => setSelectedLibraryId(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#E5E8DA] text-xs bg-white max-w-[220px]"
              >
                <option value="">Import from Source Library...</option>
                {library.map((src) => (
                  <option key={src.id} value={src.id}>
                    {src.sourceName} ({src.referenceYear})
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!selectedLibraryId}
                onClick={importFromLibrary}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#B2DB79] bg-[#F0F5DF] text-xs font-bold text-[#416102] cursor-pointer disabled:opacity-40"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Insert</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={addEmptyFootnote}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Footnote</span>
          </button>
        </div>
      </div>

      {footnotes.length === 0 ? (
        <div className="p-4 rounded-xl bg-[#FAFAF0] border border-dashed border-[#E5E8DA] text-xs text-[#535862]">
          No footnotes/sources added to this chapter yet.
        </div>
      ) : (
        <div className="space-y-3">
          {footnotes.map((fn, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0]/50 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-1.5 rounded-full bg-[#598303] text-white text-xs font-bold">
                    {fn.number}
                  </span>
                  <label className="text-xs font-bold text-[#535862]">
                    Footnote #
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={fn.number}
                    onChange={(e) =>
                      updateAt(idx, { number: Number(e.target.value) || 1 })
                    }
                    className="w-20 px-2 py-1 rounded border border-[#E5E8DA] text-xs bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg cursor-pointer"
                  title="Remove footnote"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#535862] mb-1">
                    Source Name (rendered in <em>italics</em>)
                  </label>
                  <input
                    type="text"
                    value={fn.sourceName}
                    onChange={(e) => updateAt(idx, { sourceName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E5E8DA] text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#535862] mb-1">
                    Clickable Source URL
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="url"
                      value={fn.url || ""}
                      onChange={(e) => updateAt(idx, { url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E5E8DA] text-xs bg-white"
                    />
                    {fn.url && (
                      <a
                        href={fn.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-[#598303]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#535862] mb-1">
                  Full Citation / Note Text (un-italicised body)
                </label>
                <input
                  type="text"
                  value={fn.text}
                  onChange={(e) => updateAt(idx, { text: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E5E8DA] text-xs bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
