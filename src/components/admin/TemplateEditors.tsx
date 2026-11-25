"use client";

import React from "react";
import Link from "next/link";
import { Plus, Trash2, AlertTriangle, ExternalLink } from "lucide-react";

type JsonObj = Record<string, unknown>;

function str(val: unknown, fallback = ""): string {
  return typeof val === "string" ? val : fallback;
}

function bool(val: unknown, fallback = false): boolean {
  return typeof val === "boolean" ? val : fallback;
}

function num(val: unknown, fallback = 0): number {
  return typeof val === "number" ? val : fallback;
}

function arr<T = JsonObj>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : [];
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-wide text-[#535862] mb-1">
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8AC900]"
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8AC900]"
    />
  );
}

export function SharedContentForm({
  sharedKey,
  content,
  onChange,
}: {
  sharedKey: string;
  content: JsonObj;
  onChange: (next: JsonObj) => void;
}) {
  const patch = (p: JsonObj) => onChange({ ...content, ...p });

  if (sharedKey === "about_psa") {
    const boxes = arr<JsonObj>(content.whatWeDoBoxes);
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Header Title</FieldLabel>
            <Input
              value={str(content.headerTitle)}
              onChange={(v) => patch({ headerTitle: v })}
            />
          </div>
          <div>
            <FieldLabel>What We Do Heading (Audit: &ldquo;What we do&rdquo;)</FieldLabel>
            <Input
              value={str(content.whatWeDoHeading, "What we do")}
              onChange={(v) => patch({ whatWeDoHeading: v })}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Introduction Text</FieldLabel>
          <Textarea
            rows={3}
            value={str(content.introText)}
            onChange={(v) => patch({ introText: v })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Working in Partnership Title</FieldLabel>
            <Input
              value={str(content.workingInPartnershipTitle)}
              onChange={(v) => patch({ workingInPartnershipTitle: v })}
            />
          </div>
          <div>
            <FieldLabel>Working in Partnership Description</FieldLabel>
            <Textarea
              rows={2}
              value={str(content.workingInPartnershipText)}
              onChange={(v) => patch({ workingInPartnershipText: v })}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FieldLabel>What We Do Boxes (PSA Green #699A05 Graphics)</FieldLabel>
            <button
              type="button"
              onClick={() =>
                patch({
                  whatWeDoBoxes: [
                    ...boxes,
                    {
                      id: `wwd-${Date.now()}`,
                      title: "New Capability Box",
                      description: "",
                      icon: "compass",
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Box
            </button>
          </div>
          {boxes.map((box, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Input
                  value={str(box.title)}
                  onChange={(v) => {
                    const next = [...boxes];
                    next[i] = { ...box, title: v };
                    patch({ whatWeDoBoxes: next });
                  }}
                  placeholder="Box Title"
                />
                <button
                  type="button"
                  onClick={() =>
                    patch({ whatWeDoBoxes: boxes.filter((_, idx) => idx !== i) })
                  }
                  className="p-2 text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Textarea
                rows={2}
                value={str(box.description)}
                onChange={(v) => {
                  const next = [...boxes];
                  next[i] = { ...box, description: v };
                  patch({ whatWeDoBoxes: next });
                }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Our Commitment Title</FieldLabel>
            <Input
              value={str(content.commitmentTitle)}
              onChange={(v) => patch({ commitmentTitle: v })}
            />
          </div>
          <div>
            <FieldLabel>Footnote Note</FieldLabel>
            <Input
              value={str(content.footnoteNote)}
              onChange={(v) => patch({ footnoteNote: v })}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Our Commitment Text</FieldLabel>
          <Textarea
            rows={2}
            value={str(content.commitmentText)}
            onChange={(v) => patch({ commitmentText: v })}
          />
        </div>
      </div>
    );
  }

  if (sharedKey === "drivers_of_change") {
    const drivers = arr<JsonObj>(content.keyDrivers);
    const megatrends = arr<JsonObj>(content.megatrends);
    const intros = arr<string>(content.introParagraphs);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FieldLabel>Header Title</FieldLabel>
            <Input
              value={str(content.headerTitle)}
              onChange={(v) => patch({ headerTitle: v })}
            />
          </div>
          <div>
            <FieldLabel>Key Drivers Section Title</FieldLabel>
            <Input
              value={str(content.keyDriversHeading)}
              onChange={(v) => patch({ keyDriversHeading: v })}
            />
          </div>
          <div>
            <FieldLabel>Megatrends Section Title</FieldLabel>
            <Input
              value={str(content.megatrendsHeading)}
              onChange={(v) => patch({ megatrendsHeading: v })}
            />
          </div>
        </div>

        <div>
          <FieldLabel>Intro Paragraphs (one per line)</FieldLabel>
          <Textarea
            rows={3}
            value={intros.join("\n")}
            onChange={(v) => patch({ introParagraphs: v.split("\n") })}
          />
        </div>

        {/* Drivers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FieldLabel>Key Drivers (Add / Edit / Delete per year)</FieldLabel>
            <button
              type="button"
              onClick={() =>
                patch({
                  keyDrivers: [
                    ...drivers,
                    {
                      id: `drv-${Date.now()}`,
                      numberLabel: `DRIVER ${drivers.length + 1}`,
                      title: "New Driver of Change",
                      summary: "",
                      description: "",
                      icon: "compass",
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Driver
            </button>
          </div>
          {drivers.map((d, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <Input
                  value={str(d.numberLabel)}
                  onChange={(v) => {
                    const next = [...drivers];
                    next[i] = { ...d, numberLabel: v };
                    patch({ keyDrivers: next });
                  }}
                  placeholder="DRIVER 1"
                />
                <div className="sm:col-span-2">
                  <Input
                    value={str(d.title)}
                    onChange={(v) => {
                      const next = [...drivers];
                      next[i] = { ...d, title: v };
                      patch({ keyDrivers: next });
                    }}
                    placeholder="Driver Title"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      patch({ keyDrivers: drivers.filter((_, idx) => idx !== i) })
                    }
                    className="p-2 text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <Textarea
                rows={2}
                value={str(d.description)}
                onChange={(v) => {
                  const next = [...drivers];
                  next[i] = { ...d, description: v };
                  patch({ keyDrivers: next });
                }}
                placeholder="Driver description (extends across two-thirds width per audit)"
              />
            </div>
          ))}
        </div>

        {/* Megatrends */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FieldLabel>Megatrends (Add / Edit / Delete per year)</FieldLabel>
            <button
              type="button"
              onClick={() =>
                patch({
                  megatrends: [
                    ...megatrends,
                    {
                      id: `mt-${Date.now()}`,
                      title: "New Megatrend",
                      description: "",
                      icon: "sparkles",
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Megatrend
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {megatrends.map((m, i) => (
              <div key={i} className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={str(m.title)}
                    onChange={(v) => {
                      const next = [...megatrends];
                      next[i] = { ...m, title: v };
                      patch({ megatrends: next });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      patch({
                        megatrends: megatrends.filter((_, idx) => idx !== i),
                      })
                    }
                    className="p-1.5 text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Textarea
                  rows={2}
                  value={str(m.description)}
                  onChange={(v) => {
                    const next = [...megatrends];
                    next[i] = { ...m, description: v };
                    patch({ megatrends: next });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // federal_initiatives
  const initiatives = arr<JsonObj>(content.initiatives);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <FieldLabel>Anchor Badge</FieldLabel>
          <Input
            value={str(content.anchorBadge, "Workforce Strategies")}
            onChange={(v) => patch({ anchorBadge: v })}
          />
        </div>
        <div>
          <FieldLabel>Header Title</FieldLabel>
          <Input
            value={str(content.headerTitle)}
            onChange={(v) => patch({ headerTitle: v })}
          />
        </div>
        <div>
          <FieldLabel>List Heading Prefix (auto-counts items)</FieldLabel>
          <Input
            value={str(content.listHeadingPrefix, "Strategies")}
            onChange={(v) => patch({ listHeadingPrefix: v })}
          />
        </div>
      </div>

      <div>
        <FieldLabel>Introduction</FieldLabel>
        <Textarea
          rows={2}
          value={str(content.introText)}
          onChange={(v) => patch({ introText: v })}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FieldLabel>Initiatives ({initiatives.length} auto-calculated)</FieldLabel>
          <button
            type="button"
            onClick={() =>
              patch({
                initiatives: [
                  ...initiatives,
                  {
                    id: `fed-${Date.now()}`,
                    code: String(initiatives.length + 1).padStart(2, "0"),
                    listSubtitle: "Department / Authority",
                    title: "New Federal Government Initiative",
                    dateRange: "2026 - 2030",
                    paragraphs: [""],
                    howItInformsHeading: "HOW THIS INFORMS PUBLIC SKILLS AUSTRALIA'S WORK",
                    howItInformsText: "",
                  },
                ],
              })
            }
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Initiative
          </button>
        </div>

        {initiatives.map((item, i) => (
          <div key={i} className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <Input
                value={str(item.code)}
                onChange={(v) => {
                  const next = [...initiatives];
                  next[i] = { ...item, code: v };
                  patch({ initiatives: next });
                }}
                placeholder="01"
              />
              <Input
                value={str(item.dateRange)}
                onChange={(v) => {
                  const next = [...initiatives];
                  next[i] = { ...item, dateRange: v };
                  patch({ initiatives: next });
                }}
                placeholder="2020 - 2031"
              />
              <div className="sm:col-span-2 flex gap-2">
                <Input
                  value={str(item.listSubtitle)}
                  onChange={(v) => {
                    const next = [...initiatives];
                    next[i] = { ...item, listSubtitle: v };
                    patch({ initiatives: next });
                  }}
                  placeholder="Subtitle / Agency"
                />
                <button
                  type="button"
                  onClick={() =>
                    patch({
                      initiatives: initiatives.filter((_, idx) => idx !== i),
                    })
                  }
                  className="p-2 text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <Input
              value={str(item.title)}
              onChange={(v) => {
                const next = [...initiatives];
                next[i] = { ...item, title: v };
                patch({ initiatives: next });
              }}
              placeholder="Initiative Title"
            />
            <Textarea
              rows={2}
              value={arr<string>(item.paragraphs).join("\n")}
              onChange={(v) => {
                const next = [...initiatives];
                next[i] = { ...item, paragraphs: v.split("\n") };
                patch({ initiatives: next });
              }}
              placeholder="Summary paragraphs (one per line)"
            />
            <Textarea
              rows={2}
              value={str(item.howItInformsText)}
              onChange={(v) => {
                const next = [...initiatives];
                next[i] = { ...item, howItInformsText: v };
                patch({ initiatives: next });
              }}
              placeholder="How this informs Public Skills Australia's work"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TemplateEditor({
  pageType,
  content,
  onChange,
}: {
  pageType: string;
  content: JsonObj;
  onChange: (next: JsonObj) => void;
}) {
  const patch = (p: JsonObj) => onChange({ ...content, ...p });

  // Shared-capable pages
  if (
    pageType === "about" ||
    pageType === "drivers_of_change" ||
    pageType === "federal_initiatives"
  ) {
    const sharedKey =
      pageType === "about"
        ? "about_psa"
        : pageType === "drivers_of_change"
          ? "drivers_of_change"
          : "federal_initiatives";
    const useShared = bool(content.useSharedTemplate, true);
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-[#B2DB79] bg-[#F0F5DF] flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-extrabold text-[#252D02]">
              Global Shared DWIR Template
            </div>
            <p className="text-xs text-[#535862]">
              Audit guideline: About PSA, Drivers of Change, and Federal Initiatives are shared across all DWIRs using PSA Green colours.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={useShared}
                onChange={(e) =>
                  patch({ useSharedTemplate: e.target.checked, sharedKey })
                }
              />
              <span>Use Global Shared Content</span>
            </label>
            <Link
              href="/admin/shared"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#252D02] text-white text-xs font-bold no-underline"
            >
              <span>Edit Global Shared Content</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {!useShared && (
          <SharedContentForm
            sharedKey={sharedKey}
            content={content}
            onChange={onChange}
          />
        )}
      </div>
    );
  }

  if (pageType === "transition") {
    const subCards = arr<JsonObj>(content.subSectorCards);
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Eyebrow (PSA Green #699A05)</FieldLabel>
            <Input value={str(content.eyebrow)} onChange={(v) => patch({ eyebrow: v })} />
          </div>
          <div>
            <FieldLabel>Headline (Black Font)</FieldLabel>
            <Input value={str(content.headline)} onChange={(v) => patch({ headline: v })} />
          </div>
        </div>
        <div>
          <FieldLabel>Subheadline (Optional)</FieldLabel>
          <Input value={str(content.subheadline)} onChange={(v) => patch({ subheadline: v })} />
        </div>
        <div>
          <FieldLabel>Prompt Text</FieldLabel>
          <Textarea rows={2} value={str(content.promptText)} onChange={(v) => patch({ promptText: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
            <FieldLabel>Introduction Card</FieldLabel>
            <Input value={str(content.introCardTitle, "Introduction")} onChange={(v) => patch({ introCardTitle: v })} />
            <Textarea rows={2} value={str(content.introCardDescription)} onChange={(v) => patch({ introCardDescription: v })} />
            <Input value={str(content.introButtonLabel, "Explore the Introduction")} onChange={(v) => patch({ introButtonLabel: v })} />
          </div>
          <div className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
            <FieldLabel>Executive Summary Card</FieldLabel>
            <Input value={str(content.execCardTitle, "Executive Summary")} onChange={(v) => patch({ execCardTitle: v })} />
            <Textarea rows={2} value={str(content.execCardDescription)} onChange={(v) => patch({ execCardDescription: v })} />
            <Input value={str(content.execButtonLabel, "Explore the Executive Summary")} onChange={(v) => patch({ execButtonLabel: v })} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FieldLabel>Optional Sub-Sector Quick Links (e.g. Public Safety DEF/FES/POL)</FieldLabel>
            <button
              type="button"
              onClick={() =>
                patch({
                  subSectorCards: [
                    ...subCards,
                    { code: "DEF", title: "Sub-Sector", pageType: "industry_overview", color: "#D3992C" },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Sub-Sector Link
            </button>
          </div>
          {subCards.map((sc, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center">
              <Input value={str(sc.code)} onChange={(v) => { const n = [...subCards]; n[i] = { ...sc, code: v }; patch({ subSectorCards: n }); }} placeholder="Code" />
              <Input value={str(sc.title)} onChange={(v) => { const n = [...subCards]; n[i] = { ...sc, title: v }; patch({ subSectorCards: n }); }} placeholder="Title" />
              <Input value={str(sc.color)} onChange={(v) => { const n = [...subCards]; n[i] = { ...sc, color: v }; patch({ subSectorCards: n }); }} placeholder="#HEX" />
              <button type="button" onClick={() => patch({ subSectorCards: subCards.filter((_, idx) => idx !== i) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pageType === "introduction") {
    const stats = arr<JsonObj>(content.keyStats);
    const cards = arr<JsonObj>(content.structureCards);
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <Input value={str(content.eyebrow, "INTRODUCTION")} onChange={(v) => patch({ eyebrow: v })} />
          </div>
          <div>
            <FieldLabel>Header Title</FieldLabel>
            <Input value={str(content.headerTitle)} onChange={(v) => patch({ headerTitle: v })} />
          </div>
        </div>
        <div>
          <FieldLabel>Introduction Paragraphs (one per line)</FieldLabel>
          <Textarea rows={4} value={arr<string>(content.paragraphs).join("\n")} onChange={(v) => patch({ paragraphs: v.split("\n") })} />
        </div>

        {/* Report at a Glance Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FieldLabel>Report at a Glance — Key Stats</FieldLabel>
            <button
              type="button"
              onClick={() => patch({ keyStats: [...stats, { label: "Stat Label", value: "0" }] })}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Stat
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {stats.map((st, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-[#E5E8DA] bg-[#FAFAF0] space-y-1.5">
                <div className="flex justify-between gap-1">
                  <Input value={str(st.value)} onChange={(v) => { const n = [...stats]; n[i] = { ...st, value: v }; patch({ keyStats: n }); }} placeholder="Value" />
                  <button type="button" onClick={() => patch({ keyStats: stats.filter((_, idx) => idx !== i) })} className="text-red-600 p-1 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <Input value={str(st.label)} onChange={(v) => { const n = [...stats]; n[i] = { ...st, label: v }; patch({ keyStats: n }); }} placeholder="Label" />
              </div>
            ))}
          </div>
        </div>

        {/* Digital Report Structure Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FieldLabel>Digital Report Structure Cards (Configurable Top Line &amp; Graphic)</FieldLabel>
            <button
              type="button"
              onClick={() =>
                patch({
                  structureCards: [
                    ...cards,
                    {
                      id: `str-${Date.now()}`,
                      title: "Custom Chapter Card",
                      description: "Chapter summary",
                      pageType: "one_off_page",
                      lineColorMode: "SECTOR",
                      icon: "layers",
                      ctaLabel: "Explore",
                      tags: [],
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Structure Card
            </button>
          </div>
          {cards.map((c, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <Input value={str(c.title)} onChange={(v) => { const n = [...cards]; n[i] = { ...c, title: v }; patch({ structureCards: n }); }} placeholder="Card Title" />
                <Input value={str(c.pageType)} onChange={(v) => { const n = [...cards]; n[i] = { ...c, pageType: v }; patch({ structureCards: n }); }} placeholder="Target pageType" />
                <select
                  value={str(c.lineColorMode, "SECTOR")}
                  onChange={(e) => { const n = [...cards]; n[i] = { ...c, lineColorMode: e.target.value }; patch({ structureCards: n }); }}
                  className="px-2.5 py-2 rounded-lg border border-[#E5E8DA] text-xs bg-white"
                >
                  <option value="SECTOR">Sector Line Colour</option>
                  <option value="GLOBAL_PSA">PSA Green Line Colour</option>
                </select>
                <div className="flex gap-2">
                  <Input value={str(c.icon, "file-text")} onChange={(v) => { const n = [...cards]; n[i] = { ...c, icon: v }; patch({ structureCards: n }); }} placeholder="Icon" />
                  <button type="button" onClick={() => patch({ structureCards: cards.filter((_, idx) => idx !== i) })} className="text-red-600 p-1.5 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <Input value={str(c.description)} onChange={(v) => { const n = [...cards]; n[i] = { ...c, description: v }; patch({ structureCards: n }); }} placeholder="Description" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pageType === "downloads") {
    return (
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-[#F0F5DF] border border-[#B2DB79] text-xs text-[#252D02]">
          Sector Name and Sector Line Colour auto-populate from the Report&apos;s Sector configuration. Upload or update PDF links in <strong>Report Settings</strong>.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <Input value={str(content.eyebrow, "DOWNLOAD PDF")} onChange={(v) => patch({ eyebrow: v })} />
          </div>
          <div>
            <FieldLabel>Header Title</FieldLabel>
            <Input value={str(content.headerTitle)} onChange={(v) => patch({ headerTitle: v })} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Current Report Label</FieldLabel>
            <Input value={str(content.currentReportLabel)} onChange={(v) => patch({ currentReportLabel: v })} />
          </div>
          <div>
            <FieldLabel>Previous Reports Heading</FieldLabel>
            <Input value={str(content.previousReportsHeading, "PREVIOUS REPORTS")} onChange={(v) => patch({ previousReportsHeading: v })} />
          </div>
        </div>
        <div>
          <FieldLabel>Current Report Description</FieldLabel>
          <Textarea rows={2} value={str(content.currentReportDescription)} onChange={(v) => patch({ currentReportDescription: v })} />
        </div>
      </div>
    );
  }

  if (pageType === "methodology") {
    const steps = arr<JsonObj>(content.processSteps);
    const reps = arr<string>(content.keyRepresentatives);
    const govSteps = arr<JsonObj>(content.governanceSteps);
    const extraBoxes = arr<JsonObj>(content.extraBoxes);
    return (
      <div className="space-y-5">
        <div>
          <FieldLabel>Header Title</FieldLabel>
          <Input value={str(content.headerTitle, "Methodology")} onChange={(v) => patch({ headerTitle: v })} />
        </div>
        <div>
          <FieldLabel>Methodology Intro Paragraphs (one per line)</FieldLabel>
          <Textarea rows={3} value={arr<string>(content.introParagraphs).join("\n")} onChange={(v) => patch({ introParagraphs: v.split("\n") })} />
        </div>

        <div className="flex flex-wrap gap-6 p-3 rounded-xl bg-[#FAFAF0] border border-[#E5E8DA]">
          <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
            <input type="checkbox" checked={bool(content.showProcessSteps, true)} onChange={(e) => patch({ showProcessSteps: e.target.checked })} />
            <span>Show Process Steps Boxes (optional per DWIR)</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
            <input type="checkbox" checked={bool(content.showKeyRepresentatives, true)} onChange={(e) => patch({ showKeyRepresentatives: e.target.checked })} />
            <span>Show Key Industry-Sector Representatives (optional per DWIR)</span>
          </label>
        </div>

        {bool(content.showProcessSteps, true) && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <FieldLabel>Process Steps</FieldLabel>
              <button type="button" onClick={() => patch({ processSteps: [...steps, { stepLabel: `STEP ${steps.length + 1}`, title: "Step Title", detail: "", icon: "check" }] })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer">
                <Plus className="w-3 h-3" /> Add Step
              </button>
            </div>
            {steps.map((s, i) => (
              <div key={i} className="grid grid-cols-4 gap-2">
                <Input value={str(s.stepLabel)} onChange={(v) => { const n = [...steps]; n[i] = { ...s, stepLabel: v }; patch({ processSteps: n }); }} />
                <Input value={str(s.title)} onChange={(v) => { const n = [...steps]; n[i] = { ...s, title: v }; patch({ processSteps: n }); }} />
                <Input value={str(s.detail)} onChange={(v) => { const n = [...steps]; n[i] = { ...s, detail: v }; patch({ processSteps: n }); }} />
                <button type="button" onClick={() => patch({ processSteps: steps.filter((_, idx) => idx !== i) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
              </div>
            ))}
          </div>
        )}

        {bool(content.showKeyRepresentatives, true) && (
          <div>
            <FieldLabel>Key Industry-Sector Representatives (one per line)</FieldLabel>
            <Textarea rows={3} value={reps.join("\n")} onChange={(v) => patch({ keyRepresentatives: v.split("\n") })} />
          </div>
        )}

        <div className="space-y-2">
          <FieldLabel>Governance Process Heading &amp; Steps</FieldLabel>
          <Input value={str(content.governanceHeading, "Governance Process")} onChange={(v) => patch({ governanceHeading: v })} />
          {govSteps.map((g, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input value={str(g.title)} onChange={(v) => { const n = [...govSteps]; n[i] = { ...g, title: v }; patch({ governanceSteps: n }); }} />
              <div className="sm:col-span-2">
                <Input value={str(g.description)} onChange={(v) => { const n = [...govSteps]; n[i] = { ...g, description: v }; patch({ governanceSteps: n }); }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Data Sources Text</FieldLabel>
            <Textarea rows={3} value={str(content.dataSourcesText)} onChange={(v) => patch({ dataSourcesText: v })} />
          </div>
          <div>
            <FieldLabel>Acknowledgement Text (PSA #598303 Top Line)</FieldLabel>
            <Textarea rows={3} value={str(content.acknowledgementText)} onChange={(v) => patch({ acknowledgementText: v })} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <FieldLabel>Flexible Additional Content Boxes with Graphic</FieldLabel>
            <button type="button" onClick={() => patch({ extraBoxes: [...extraBoxes, { title: "Additional Note", text: "", icon: "info" }] })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer">
              <Plus className="w-3 h-3" /> Add Content Box
            </button>
          </div>
          {extraBoxes.map((b, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <Input value={str(b.title)} onChange={(v) => { const n = [...extraBoxes]; n[i] = { ...b, title: v }; patch({ extraBoxes: n }); }} />
              <Input value={str(b.text)} onChange={(v) => { const n = [...extraBoxes]; n[i] = { ...b, text: v }; patch({ extraBoxes: n }); }} />
              <button type="button" onClick={() => patch({ extraBoxes: extraBoxes.filter((_, idx) => idx !== i) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pageType === "executive_summary") {
    const ctas = arr<JsonObj>(content.supportingSectionCtas);
    return (
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-[#F0F5DF] border border-[#B2DB79] text-xs text-[#252D02]">
          Workforce Themes/Insights and Proposed Workforce Strategies are automatically mirrored from their dedicated chapter pages using the standardized Always-Open &amp; Expandable card layout.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Header Title</FieldLabel>
            <Input value={str(content.headerTitle, "Executive Summary")} onChange={(v) => patch({ headerTitle: v })} />
          </div>
          <div>
            <FieldLabel>Themes &amp; Strategies Column Format (1, 2, or 3)</FieldLabel>
            <select
              value={num(content.themesColumnsLayout, 2)}
              onChange={(e) => patch({ themesColumnsLayout: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm bg-white"
            >
              <option value={1}>1 Theme / Single Full-Width Layout (FSTG &amp; COR style)</option>
              <option value={2}>2 Themes / Side-by-Side Layout (LG style)</option>
              <option value={3}>3 Themes / Multi-Column Layout (PS style)</option>
            </select>
          </div>
        </div>
        <div>
          <FieldLabel>Executive Summary Intro</FieldLabel>
          <Textarea rows={3} value={str(content.introText)} onChange={(v) => patch({ introText: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Drivers of Change Summary</FieldLabel>
            <Textarea rows={2} value={str(content.driversSummaryText)} onChange={(v) => patch({ driversSummaryText: v })} />
          </div>
          <div>
            <FieldLabel>Looking Forward Summary</FieldLabel>
            <Textarea rows={2} value={str(content.lookingForwardText)} onChange={(v) => patch({ lookingForwardText: v })} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <FieldLabel>Supporting Sections CTAs</FieldLabel>
            <button type="button" onClick={() => patch({ supportingSectionCtas: [...ctas, { label: "New Section CTA", pageType: "existing_strategies" }] })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer">
              <Plus className="w-3 h-3" /> Add CTA
            </button>
          </div>
          {ctas.map((c, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <Input value={str(c.label)} onChange={(v) => { const n = [...ctas]; n[i] = { ...c, label: v }; patch({ supportingSectionCtas: n }); }} />
              <Input value={str(c.pageType)} onChange={(v) => { const n = [...ctas]; n[i] = { ...c, pageType: v }; patch({ supportingSectionCtas: n }); }} />
              <button type="button" onClick={() => patch({ supportingSectionCtas: ctas.filter((_, idx) => idx !== i) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pageType === "industry_overview") {
    const dataBoxes = arr<JsonObj>(content.dataBoxes);
    const contentBoxes = arr<JsonObj>(content.contentBoxes);
    const charts = arr<JsonObj>(content.charts);
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Header Title</FieldLabel>
            <Input value={str(content.headerTitle)} onChange={(v) => patch({ headerTitle: v })} />
          </div>
          <div>
            <FieldLabel>Sector Graphic Icon</FieldLabel>
            <Input value={str(content.headerGraphic, "globe")} onChange={(v) => patch({ headerGraphic: v })} />
          </div>
        </div>
        <div>
          <FieldLabel>Introduction Paragraph</FieldLabel>
          <Textarea rows={2} value={str(content.introText)} onChange={(v) => patch({ introText: v })} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <FieldLabel>Industry Data Boxes</FieldLabel>
            <button type="button" onClick={() => patch({ dataBoxes: [...dataBoxes, { id: `io-${Date.now()}`, dataPoint: "100%", text: "Data description", icon: "users" }] })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer">
              <Plus className="w-3 h-3" /> Add Data Box
            </button>
          </div>
          {dataBoxes.map((b, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <Input value={str(b.dataPoint)} onChange={(v) => { const n = [...dataBoxes]; n[i] = { ...b, dataPoint: v }; patch({ dataBoxes: n }); }} placeholder="Data point" />
              <div className="col-span-2"><Input value={str(b.text)} onChange={(v) => { const n = [...dataBoxes]; n[i] = { ...b, text: v }; patch({ dataBoxes: n }); }} placeholder="Text" /></div>
              <button type="button" onClick={() => patch({ dataBoxes: dataBoxes.filter((_, idx) => idx !== i) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <FieldLabel>Content Boxes (with optional CTA)</FieldLabel>
            <button type="button" onClick={() => patch({ contentBoxes: [...contentBoxes, { id: `cb-${Date.now()}`, title: "Highlight", dataPoint: "", text: "", ctaLabel: "", ctaPageType: "industry_profile" }] })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer">
              <Plus className="w-3 h-3" /> Add Content Box
            </button>
          </div>
          {contentBoxes.map((b, i) => (
            <div key={i} className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <Input value={str(b.title)} onChange={(v) => { const n = [...contentBoxes]; n[i] = { ...b, title: v }; patch({ contentBoxes: n }); }} placeholder="Title" />
                <Input value={str(b.dataPoint)} onChange={(v) => { const n = [...contentBoxes]; n[i] = { ...b, dataPoint: v }; patch({ contentBoxes: n }); }} placeholder="Data point" />
                <button type="button" onClick={() => patch({ contentBoxes: contentBoxes.filter((_, idx) => idx !== i) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
              </div>
              <Textarea rows={2} value={str(b.text)} onChange={(v) => { const n = [...contentBoxes]; n[i] = { ...b, text: v }; patch({ contentBoxes: n }); }} />
            </div>
          ))}
        </div>

        <ChartListEditor
          label="Industry Overview Charts (List view with Present Full-Screen)"
          charts={charts}
          onChange={(next) => patch({ charts: next })}
        />
      </div>
    );
  }

  if (pageType === "industry_profile") {
    const kpis = arr<JsonObj>(content.kpis);
    const charts = arr<JsonObj>(content.chartLibrary);
    return (
      <div className="space-y-5">
        <div>
          <FieldLabel>Header Title</FieldLabel>
          <Input value={str(content.headerTitle, "Industry Profile")} onChange={(v) => patch({ headerTitle: v })} />
        </div>
        <div>
          <FieldLabel>Text Under Header Title (Audit Requirement p. 46)</FieldLabel>
          <Textarea rows={2} value={str(content.introText)} onChange={(v) => patch({ introText: v })} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <FieldLabel>Profile KPIs</FieldLabel>
            <button type="button" onClick={() => patch({ kpis: [...kpis, { id: `kpi-${Date.now()}`, label: "Metric", value: "0", note: "" }] })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer">
              <Plus className="w-3 h-3" /> Add KPI
            </button>
          </div>
          {kpis.map((k, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <Input value={str(k.value)} onChange={(v) => { const n = [...kpis]; n[i] = { ...k, value: v }; patch({ kpis: n }); }} placeholder="Value" />
              <Input value={str(k.label)} onChange={(v) => { const n = [...kpis]; n[i] = { ...k, label: v }; patch({ kpis: n }); }} placeholder="Label" />
              <Input value={str(k.note)} onChange={(v) => { const n = [...kpis]; n[i] = { ...k, note: v }; patch({ kpis: n }); }} placeholder="Note" />
              <button type="button" onClick={() => patch({ kpis: kpis.filter((_, idx) => idx !== i) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>
        <ChartListEditor
          label="Standardized Chart Library (List View + Big Screen Present)"
          charts={charts}
          onChange={(next) => patch({ chartLibrary: next })}
        />
      </div>
    );
  }

  if (pageType === "workforce_insights") {
    const themes = arr<JsonObj>(content.themes);
    const cols = num(content.columnsLayout, 2);
    const charLimit = num(content.singleThemeCharLimit, 450);
    const totalInsights = themes.reduce(
      (sum, t) => sum + arr(t.insights).length,
      0
    );

    return (
      <div className="space-y-5">
        <div className="p-3 rounded-xl bg-[#F0F5DF] border border-[#B2DB79] flex flex-wrap items-center justify-between gap-2 text-xs text-[#252D02]">
          <span>
            Auto-calculated totals: <strong>{themes.length} Themes</strong>,{" "}
            <strong>{totalInsights} Insights</strong>
          </span>
          <span>Theme sector colours stay aligned across Exec Summary, WFI, and Supporting Details.</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Header Title</FieldLabel>
            <Input value={str(content.headerTitle, "Workforce Insights")} onChange={(v) => patch({ headerTitle: v })} />
          </div>
          <div>
            <FieldLabel>Theme Column Format (1, 2, or 3 Themes)</FieldLabel>
            <select
              value={cols}
              onChange={(e) => patch({ columnsLayout: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm bg-white"
            >
              <option value={1}>1 Theme Format (character limit enforced)</option>
              <option value={2}>2 Themes Format</option>
              <option value={3}>3 Themes Format</option>
            </select>
          </div>
        </div>

        <div>
          <FieldLabel>Workforce Insights Intro</FieldLabel>
          <Textarea rows={2} value={str(content.introText)} onChange={(v) => patch({ introText: v })} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FieldLabel>Themes &amp; Insights</FieldLabel>
            <button
              type="button"
              onClick={() =>
                patch({
                  themes: [
                    ...themes,
                    {
                      id: `theme-${Date.now()}`,
                      number: themes.length + 1,
                      name: "New Workforce Theme",
                      sectorColor: "",
                      showOverview: true,
                      overviewText: "",
                      insights: [],
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Theme
            </button>
          </div>

          {themes.map((t, tIdx) => {
            const insights = arr<JsonObj>(t.insights);
            const overviewLen = str(t.overviewText).length;
            const overLimit = cols === 1 && overviewLen > charLimit;
            return (
              <div key={tIdx} className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                  <input
                    type="number"
                    min={1}
                    value={num(t.number, tIdx + 1)}
                    onChange={(e) => {
                      const n = [...themes];
                      n[tIdx] = { ...t, number: Number(e.target.value) };
                      patch({ themes: n });
                    }}
                    className="px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm bg-white"
                    placeholder="Theme #"
                  />
                  <div className="sm:col-span-2">
                    <Input
                      value={str(t.name)}
                      onChange={(v) => {
                        const n = [...themes];
                        n[tIdx] = { ...t, name: v };
                        patch({ themes: n });
                      }}
                      placeholder="Theme Name"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={str(t.sectorColor)}
                      onChange={(v) => {
                        const n = [...themes];
                        n[tIdx] = { ...t, sectorColor: v };
                        patch({ themes: n });
                      }}
                      placeholder="Optional #HEX"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        patch({ themes: themes.filter((_, i) => i !== tIdx) })
                      }
                      className="p-2 text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bool(t.showOverview, true)}
                      onChange={(e) => {
                        const n = [...themes];
                        n[tIdx] = { ...t, showOverview: e.target.checked };
                        patch({ themes: n });
                      }}
                    />
                    <span>Show Theme Overview CTA &amp; Details (uncheck to hide)</span>
                  </label>
                  {cols === 1 && (
                    <span className={`text-xs font-bold flex items-center gap-1 ${overLimit ? "text-red-600" : "text-[#598303]"}`}>
                      {overLimit && <AlertTriangle className="w-3.5 h-3.5" />}
                      {overviewLen}/{charLimit} chars (1-Theme limit)
                    </span>
                  )}
                </div>

                {bool(t.showOverview, true) && (
                  <Textarea
                    rows={2}
                    value={str(t.overviewText)}
                    onChange={(v) => {
                      const n = [...themes];
                      n[tIdx] = { ...t, overviewText: v };
                      patch({ themes: n });
                    }}
                    placeholder="Theme Overview detailed content"
                  />
                )}

                <div className="pl-3 border-l-2 border-[#8AC900] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#252D02]">
                      Insights ({insights.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const n = [...themes];
                        n[tIdx] = {
                          ...t,
                          insights: [
                            ...insights,
                            {
                              id: `ins-${Date.now()}`,
                              number: insights.length + 1,
                              title: "New Insight",
                              summary: "",
                            },
                          ],
                        };
                        patch({ themes: n });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#B2DB79] text-[#416102] text-xs font-bold cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Insight
                    </button>
                  </div>
                  {insights.map((ins, iIdx) => (
                    <div key={iIdx} className="p-2.5 rounded-lg bg-white border border-[#E5E8DA] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#598303]">#{iIdx + 1}</span>
                        <Input
                          value={str(ins.title)}
                          onChange={(v) => {
                            const nextIns = [...insights];
                            nextIns[iIdx] = { ...ins, title: v, number: iIdx + 1 };
                            const n = [...themes];
                            n[tIdx] = { ...t, insights: nextIns };
                            patch({ themes: n });
                          }}
                          placeholder="Insight Title"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const nextIns = insights.filter((_, idx) => idx !== iIdx);
                            const n = [...themes];
                            n[tIdx] = { ...t, insights: nextIns };
                            patch({ themes: n });
                          }}
                          className="p-1.5 text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Input
                        value={str(ins.summary)}
                        onChange={(v) => {
                          const nextIns = [...insights];
                          nextIns[iIdx] = { ...ins, summary: v };
                          const n = [...themes];
                          n[tIdx] = { ...t, insights: nextIns };
                          patch({ themes: n });
                        }}
                        placeholder="Insight card summary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (pageType === "workforce_insights_detail") {
    const items = arr<JsonObj>(content.items);
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#535862]">
            Flexible WFI Supporting Details builder: combine any number of Text, Industry Insight, Chart, Table, and Graphics blocks per Insight.
          </p>
          <button
            type="button"
            onClick={() =>
              patch({
                items: [
                  ...items,
                  {
                    themeNumber: 1,
                    themeName: "Theme Name",
                    insightNumber: items.length + 1,
                    insightName: "Insight Title",
                    insightDescription: "Insight description",
                    themeGraphic: "lightbulb",
                    blocks: [],
                  },
                ],
              })
            }
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Supporting Detail Entry
          </button>
        </div>

        {items.map((item, idx) => {
          const blocks = arr<JsonObj>(item.blocks);
          const updateItem = (p: JsonObj) => {
            const next = [...items];
            next[idx] = { ...item, ...p };
            patch({ items: next });
          };
          return (
            <div key={idx} className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#252D02]">
                  Theme {num(item.themeNumber, 1)} · Insight {num(item.insightNumber, idx + 1)}
                </span>
                <button type="button" onClick={() => patch({ items: items.filter((_, i) => i !== idx) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove Entry</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input type="number" min={1} value={num(item.themeNumber, 1)} onChange={(e) => updateItem({ themeNumber: Number(e.target.value) })} className="px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm bg-white" placeholder="Theme #" />
                <div className="sm:col-span-2"><Input value={str(item.themeName)} onChange={(v) => updateItem({ themeName: v })} placeholder="Theme Name" /></div>
                <input type="number" min={1} value={num(item.insightNumber, 1)} onChange={(e) => updateItem({ insightNumber: Number(e.target.value) })} className="px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm bg-white" placeholder="Insight #" />
              </div>
              <Input value={str(item.insightName)} onChange={(v) => updateItem({ insightName: v })} placeholder="Insight Name" />
              <Textarea rows={2} value={str(item.insightDescription)} onChange={(v) => updateItem({ insightDescription: v })} placeholder="Insight Description" />

              {/* Content Blocks */}
              <div className="space-y-2 pt-2 border-t border-[#E5E8DA]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#252D02]">Supporting Evidence Blocks</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(["text", "industry_insight", "chart", "table", "graphics"] as const).map((bType) => (
                      <button
                        key={bType}
                        type="button"
                        onClick={() => {
                          const base: JsonObj = { id: `blk-${Date.now()}`, type: bType, title: `New ${bType.replace("_", " ")}` };
                          if (bType === "chart") {
                            base.chartType = "bar";
                            base.labels = ["2024", "2025", "2026"];
                            base.series = [{ name: "Value", values: [10, 20, 30] }];
                          } else if (bType === "table") {
                            base.headers = ["Column A", "Column B"];
                            base.rows = [["Row 1", "Value 1"]];
                          } else if (bType === "graphics") {
                            base.items = [{ label: "Capability item", icon: "check-circle" }];
                          } else {
                            base.body = "";
                          }
                          updateItem({ blocks: [...blocks, base] });
                        }}
                        className="px-2.5 py-1 rounded-full bg-white border border-[#B2DB79] text-[#416102] text-[11px] font-bold cursor-pointer hover:bg-[#F0F5DF]"
                      >
                        + {bType.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {blocks.map((blk, bIdx) => {
                  const updateBlk = (bp: JsonObj) => {
                    const nextB = [...blocks];
                    nextB[bIdx] = { ...blk, ...bp };
                    updateItem({ blocks: nextB });
                  };
                  const bType = str(blk.type, "text");
                  return (
                    <div key={bIdx} className="p-3 rounded-lg bg-white border border-[#E5E8DA] space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#F0F5DF] text-[#416102]">
                          {bType.replace("_", " ")}
                        </span>
                        <div className="flex-1">
                          <Input value={str(blk.title)} onChange={(v) => updateBlk({ title: v })} placeholder="Block Title" />
                        </div>
                        <button type="button" onClick={() => updateItem({ blocks: blocks.filter((_, i) => i !== bIdx) })} className="p-1 text-red-600 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>

                      {(bType === "text" || bType === "industry_insight") && (
                        <Textarea rows={2} value={str(blk.body)} onChange={(v) => updateBlk({ body: v })} placeholder="Body copy..." />
                      )}

                      {bType === "chart" && (
                        <div className="grid grid-cols-2 gap-2">
                          <Input value={arr<string>(blk.labels).join(", ")} onChange={(v) => updateBlk({ labels: v.split(",").map((s) => s.trim()) })} placeholder="Labels: 2024, 2025, 2026" />
                          <Input
                            value={arr<number>(arr<JsonObj>(blk.series)[0]?.values).join(", ")}
                            onChange={(v) =>
                              updateBlk({
                                series: [
                                  {
                                    name: str(arr<JsonObj>(blk.series)[0]?.name, "Series 1"),
                                    values: v.split(",").map((x) => Number(x.trim()) || 0),
                                  },
                                ],
                              })
                            }
                            placeholder="Values: 10, 20, 30"
                          />
                        </div>
                      )}

                      {bType === "table" && (
                        <div className="space-y-1.5">
                          <Input
                            value={arr<string>(blk.headers).join(" | ")}
                            onChange={(v) => updateBlk({ headers: v.split("|").map((s) => s.trim()) })}
                            placeholder="Headers separated by |"
                          />
                          <Textarea
                            rows={2}
                            value={arr<string[]>(blk.rows).map((r) => r.join(" | ")).join("\n")}
                            onChange={(v) => updateBlk({ rows: v.split("\n").map((line) => line.split("|").map((c) => c.trim())) })}
                            placeholder="Rows (one per line, cells separated by |)"
                          />
                        </div>
                      )}

                      {bType === "graphics" && (
                        <Textarea
                          rows={2}
                          value={arr<JsonObj>(blk.items).map((gi) => str(gi.label)).join("\n")}
                          onChange={(v) => updateBlk({ items: v.split("\n").map((lbl) => ({ label: lbl, icon: "check-circle" })) })}
                          placeholder="One graphic list item per line"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (pageType === "workforce_strategies") {
    const strategies = arr<JsonObj>(content.strategies);
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Anchor Badge</FieldLabel>
            <Input value={str(content.anchorBadge, "Workforce Strategies")} onChange={(v) => patch({ anchorBadge: v })} />
          </div>
          <div>
            <FieldLabel>Header Title</FieldLabel>
            <Input value={str(content.headerTitle)} onChange={(v) => patch({ headerTitle: v })} />
          </div>
        </div>
        <div>
          <FieldLabel>Introduction</FieldLabel>
          <Textarea rows={2} value={str(content.introText)} onChange={(v) => patch({ introText: v })} />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FieldLabel>Proposed Strategies (Standardized Always-Open + Expandable Fields)</FieldLabel>
            <button
              type="button"
              onClick={() =>
                patch({
                  strategies: [
                    ...strategies,
                    {
                      id: `strat-${Date.now()}`,
                      number: strategies.length + 1,
                      name: "New Strategy",
                      objective: "",
                      workforceInsight: "",
                      jscFunction: "",
                      approach: "",
                      deliverable: "",
                      impact: "",
                      anticipatedTiming: "",
                      keyStakeholders: [],
                      customFields: [],
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Strategy
            </button>
          </div>

          {strategies.map((st, idx) => {
            const updateSt = (sp: JsonObj) => {
              const next = [...strategies];
              next[idx] = { ...st, ...sp };
              patch({ strategies: next });
            };
            return (
              <div key={idx} className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#252D02]">STRATEGY {num(st.number, idx + 1)}</span>
                  <button type="button" onClick={() => patch({ strategies: strategies.filter((_, i) => i !== idx) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
                </div>

                <div className="p-3 rounded-lg bg-white border border-[#B2DB79] space-y-2">
                  <div className="text-[10px] font-bold uppercase text-[#598303]">Always Open Fields (Audit p. 36 &amp; p. 67)</div>
                  <Input value={str(st.name)} onChange={(v) => updateSt({ name: v })} placeholder="Strategy Name" />
                  <Textarea rows={2} value={str(st.objective)} onChange={(v) => updateSt({ objective: v })} placeholder="Objective" />
                  <Input value={str(st.workforceInsight)} onChange={(v) => updateSt({ workforceInsight: v })} placeholder="Workforce Insight" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>JSC Function</FieldLabel>
                    <Input value={str(st.jscFunction)} onChange={(v) => updateSt({ jscFunction: v })} />
                  </div>
                  <div>
                    <FieldLabel>Anticipated Timing</FieldLabel>
                    <Input value={str(st.anticipatedTiming)} onChange={(v) => updateSt({ anticipatedTiming: v })} />
                  </div>
                  <div>
                    <FieldLabel>Approach</FieldLabel>
                    <Textarea rows={2} value={str(st.approach)} onChange={(v) => updateSt({ approach: v })} />
                  </div>
                  <div>
                    <FieldLabel>Deliverable</FieldLabel>
                    <Textarea rows={2} value={str(st.deliverable)} onChange={(v) => updateSt({ deliverable: v })} />
                  </div>
                  <div>
                    <FieldLabel>Impact</FieldLabel>
                    <Textarea rows={2} value={str(st.impact)} onChange={(v) => updateSt({ impact: v })} />
                  </div>
                  <div>
                    <FieldLabel>Key Stakeholders (comma-separated coloured badges)</FieldLabel>
                    <Textarea rows={2} value={arr<string>(st.keyStakeholders).join(", ")} onChange={(v) => updateSt({ keyStakeholders: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (pageType === "update_strategies") {
    const items = arr<JsonObj>(content.items);
    const introBoxes = arr<JsonObj>(content.introBoxes);
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><FieldLabel>Anchor Badge</FieldLabel><Input value={str(content.anchorBadge, "Workforce Strategies")} onChange={(v) => patch({ anchorBadge: v })} /></div>
          <div><FieldLabel>Header Title</FieldLabel><Input value={str(content.headerTitle)} onChange={(v) => patch({ headerTitle: v })} /></div>
          <div><FieldLabel>List Box Title</FieldLabel><Input value={str(content.listBoxTitle, "PROJECTS · SELECT TO OPEN")} onChange={(v) => patch({ listBoxTitle: v })} /></div>
        </div>
        <div><FieldLabel>Introduction Paragraph</FieldLabel><Textarea rows={2} value={str(content.introParagraph)} onChange={(v) => patch({ introParagraph: v })} /></div>
        <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
          <input type="checkbox" checked={bool(content.showIntroBoxes)} onChange={(e) => patch({ showIntroBoxes: e.target.checked })} />
          <span>Show Introduction Content Boxes (LG format)</span>
        </label>
        {bool(content.showIntroBoxes) && (
          <div className="space-y-2">
            {introBoxes.map((b, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <Input value={str(b.title)} onChange={(v) => { const n = [...introBoxes]; n[i] = { ...b, title: v }; patch({ introBoxes: n }); }} />
                <Input value={str(b.description)} onChange={(v) => { const n = [...introBoxes]; n[i] = { ...b, description: v }; patch({ introBoxes: n }); }} />
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <FieldLabel>Strategy Updates ({items.length})</FieldLabel>
            <button
              type="button"
              onClick={() =>
                patch({
                  items: [
                    ...items,
                    {
                      id: `upd-${Date.now()}`,
                      code: String(items.length + 1).padStart(2, "0"),
                      statusBadge: "IN PROGRESS",
                      strategyName: "New Strategy Update",
                      summary: "",
                      value: "",
                      update: "",
                      connections: { ministerialPriority: "", strategicPlanPriorities: "", driversOfChange: "" },
                      stakeholders: [],
                      nextSteps: "",
                      customSubheadings: [],
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Strategy Update
            </button>
          </div>
          {items.map((it, idx) => {
            const updateIt = (ip: JsonObj) => {
              const n = [...items];
              n[idx] = { ...it, ...ip };
              patch({ items: n });
            };
            const conns = (it.connections as JsonObj) || {};
            const customs = arr<JsonObj>(it.customSubheadings);
            return (
              <div key={idx} className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <Input value={str(it.code)} onChange={(v) => updateIt({ code: v })} placeholder="01" />
                  <Input value={str(it.statusBadge)} onChange={(v) => updateIt({ statusBadge: v })} placeholder="Status Badge" />
                  <div className="sm:col-span-2 flex gap-2">
                    <Input value={str(it.strategyName)} onChange={(v) => updateIt({ strategyName: v })} placeholder="Strategy Name" />
                    <button type="button" onClick={() => patch({ items: items.filter((_, i) => i !== idx) })} className="text-red-600 p-1.5 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <Textarea rows={2} value={str(it.summary)} onChange={(v) => updateIt({ summary: v })} placeholder="Summary" />
                <Textarea rows={2} value={str(it.value)} onChange={(v) => updateIt({ value: v })} placeholder="Value (optional)" />
                <Textarea rows={2} value={str(it.update)} onChange={(v) => updateIt({ update: v })} placeholder="Update" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input value={str(conns.ministerialPriority)} onChange={(v) => updateIt({ connections: { ...conns, ministerialPriority: v } })} placeholder="Ministerial Priority" />
                  <Input value={str(conns.strategicPlanPriorities)} onChange={(v) => updateIt({ connections: { ...conns, strategicPlanPriorities: v } })} placeholder="Strategic Plan Priorities" />
                  <Input value={str(conns.driversOfChange)} onChange={(v) => updateIt({ connections: { ...conns, driversOfChange: v } })} placeholder="Drivers of Change connections" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input value={arr<string>(it.stakeholders).join(", ")} onChange={(v) => updateIt({ stakeholders: v.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="Stakeholders (comma separated)" />
                  <Input value={str(it.nextSteps)} onChange={(v) => updateIt({ nextSteps: v })} placeholder="Next steps" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-[#598303]">Custom Subheadings (Audit p. 71)</span>
                    <button type="button" onClick={() => updateIt({ customSubheadings: [...customs, { heading: "Custom Heading", content: "" }] })} className="text-xs font-bold text-[#416102] cursor-pointer">+ Add Subheading</button>
                  </div>
                  {customs.map((cs, cIdx) => (
                    <div key={cIdx} className="grid grid-cols-3 gap-2">
                      <Input value={str(cs.heading)} onChange={(v) => { const nc = [...customs]; nc[cIdx] = { ...cs, heading: v }; updateIt({ customSubheadings: nc }); }} />
                      <Input value={str(cs.content)} onChange={(v) => { const nc = [...customs]; nc[cIdx] = { ...cs, content: v }; updateIt({ customSubheadings: nc }); }} />
                      <button type="button" onClick={() => updateIt({ customSubheadings: customs.filter((_, i) => i !== cIdx) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (pageType === "existing_strategies") {
    const items = arr<JsonObj>(content.items);
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><FieldLabel>Anchor Badge</FieldLabel><Input value={str(content.anchorBadge, "Existing Strategies")} onChange={(v) => patch({ anchorBadge: v })} /></div>
          <div><FieldLabel>Header Title</FieldLabel><Input value={str(content.headerTitle)} onChange={(v) => patch({ headerTitle: v })} /></div>
          <div><FieldLabel>List Box Title</FieldLabel><Input value={str(content.listBoxTitle, "STRATEGIES · SELECT TO OPEN")} onChange={(v) => patch({ listBoxTitle: v })} /></div>
        </div>
        <div><FieldLabel>Introduction</FieldLabel><Textarea rows={2} value={str(content.introText)} onChange={(v) => patch({ introText: v })} /></div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <FieldLabel>Existing Industry-Sector Strategies ({items.length})</FieldLabel>
            <button type="button" onClick={() => patch({ items: [...items, { id: `ex-${Date.now()}`, code: String(items.length + 1).padStart(2, "0"), organizationLabel: "AGENCY", title: "New Existing Strategy", dateOrTag: "2026", summaryParagraphs: [""], howItInformsHeading: "How this informs Public Skills Australia's work", howItInformsParagraphs: [""] }] })} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add Strategy
            </button>
          </div>
          {items.map((it, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <Input value={str(it.code)} onChange={(v) => { const n = [...items]; n[i] = { ...it, code: v }; patch({ items: n }); }} placeholder="01" />
                <Input value={str(it.organizationLabel)} onChange={(v) => { const n = [...items]; n[i] = { ...it, organizationLabel: v }; patch({ items: n }); }} placeholder="Organisation" />
                <Input value={str(it.dateOrTag)} onChange={(v) => { const n = [...items]; n[i] = { ...it, dateOrTag: v }; patch({ items: n }); }} placeholder="Date / Tag" />
                <button type="button" onClick={() => patch({ items: items.filter((_, idx) => idx !== i) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
              </div>
              <Input value={str(it.title)} onChange={(v) => { const n = [...items]; n[i] = { ...it, title: v }; patch({ items: n }); }} placeholder="Title" />
              <Textarea rows={2} value={arr<string>(it.summaryParagraphs).join("\n")} onChange={(v) => { const n = [...items]; n[i] = { ...it, summaryParagraphs: v.split("\n") }; patch({ items: n }); }} placeholder="Summary paragraphs" />
              <Textarea rows={2} value={arr<string>(it.howItInformsParagraphs).join("\n")} onChange={(v) => { const n = [...items]; n[i] = { ...it, howItInformsParagraphs: v.split("\n") }; patch({ items: n }); }} placeholder="How this informs PSA's work" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pageType === "looking_forward") {
    const psaBoxes = arr<JsonObj>(content.psaBoxes);
    const sectorBoxes = arr<JsonObj>(content.sectorBoxes);
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><FieldLabel>Anchor Badge (Sector Colour)</FieldLabel><Input value={str(content.anchorBadge, "Looking Forward")} onChange={(v) => patch({ anchorBadge: v })} /></div>
          <div><FieldLabel>Header Title</FieldLabel><Input value={str(content.headerTitle)} onChange={(v) => patch({ headerTitle: v })} /></div>
        </div>
        <div><FieldLabel>Intro Paragraphs (one per line)</FieldLabel><Textarea rows={2} value={arr<string>(content.introParagraphs).join("\n")} onChange={(v) => patch({ introParagraphs: v.split("\n") })} /></div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <FieldLabel>PSA Boxes (PSA Green Line &amp; Graphic)</FieldLabel>
            <button type="button" onClick={() => patch({ psaBoxes: [...psaBoxes, { id: `lf-p-${Date.now()}`, eyebrow: "LINE OF INQUIRY", text: "", icon: "users" }] })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"><Plus className="w-3 h-3" /> Add PSA Box</button>
          </div>
          {psaBoxes.map((b, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <Input value={str(b.eyebrow)} onChange={(v) => { const n = [...psaBoxes]; n[i] = { ...b, eyebrow: v }; patch({ psaBoxes: n }); }} />
              <div className="col-span-2"><Input value={str(b.text)} onChange={(v) => { const n = [...psaBoxes]; n[i] = { ...b, text: v }; patch({ psaBoxes: n }); }} /></div>
              <button type="button" onClick={() => patch({ psaBoxes: psaBoxes.filter((_, idx) => idx !== i) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <FieldLabel>Sector Boxes (Sector Colour Line &amp; Graphic)</FieldLabel>
            <button type="button" onClick={() => patch({ sectorBoxes: [...sectorBoxes, { id: `lf-s-${Date.now()}`, eyebrow: "CONTINUING", title: "", text: "", icon: "compass" }] })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"><Plus className="w-3 h-3" /> Add Sector Box</button>
          </div>
          {sectorBoxes.map((b, i) => (
            <div key={i} className="p-3 rounded-lg border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
              <div className="flex gap-2">
                <Input value={str(b.eyebrow)} onChange={(v) => { const n = [...sectorBoxes]; n[i] = { ...b, eyebrow: v }; patch({ sectorBoxes: n }); }} placeholder="Eyebrow" />
                <Input value={str(b.title)} onChange={(v) => { const n = [...sectorBoxes]; n[i] = { ...b, title: v }; patch({ sectorBoxes: n }); }} placeholder="Title" />
                <button type="button" onClick={() => patch({ sectorBoxes: sectorBoxes.filter((_, idx) => idx !== i) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
              </div>
              <Input value={str(b.text)} onChange={(v) => { const n = [...sectorBoxes]; n[i] = { ...b, text: v }; patch({ sectorBoxes: n }); }} placeholder="Content" />
            </div>
          ))}
        </div>

        <div><FieldLabel>Beyond Content Box</FieldLabel><Textarea rows={2} value={str(content.beyondText)} onChange={(v) => patch({ beyondText: v })} /></div>
      </div>
    );
  }

  // One-Off or Cross-Sector Page
  const boxes = arr<JsonObj>(content.contentBoxes);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><FieldLabel>Anchor Badge</FieldLabel><Input value={str(content.anchorBadge, "Special Feature")} onChange={(v) => patch({ anchorBadge: v })} /></div>
        <div><FieldLabel>Header Title</FieldLabel><Input value={str(content.headerTitle)} onChange={(v) => patch({ headerTitle: v })} /></div>
        <div>
          <FieldLabel>Sector Colour Line Placement (Audit p. 87)</FieldLabel>
          <select value={str(content.linePlacement, "side")} onChange={(e) => patch({ linePlacement: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm bg-white">
            <option value="side">Left Side Border Line</option>
            <option value="top">Top Border Line</option>
          </select>
        </div>
      </div>
      <div>
        <FieldLabel>Introduction Content</FieldLabel>
        <Textarea rows={3} value={arr<string>(content.introParagraphs).join("\n") || str(content.introText)} onChange={(v) => patch({ introParagraphs: v.split("\n"), introText: v })} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <FieldLabel>Content Boxes</FieldLabel>
          <button type="button" onClick={() => patch({ contentBoxes: [...boxes, { id: `oo-${Date.now()}`, badge: "Section", title: "New Box", text: "" }] })} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"><Plus className="w-3 h-3" /> Add Box</button>
        </div>
        {boxes.map((b, i) => (
          <div key={i} className="p-3 rounded-lg border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
            <div className="flex gap-2">
              <Input value={str(b.badge)} onChange={(v) => { const n = [...boxes]; n[i] = { ...b, badge: v }; patch({ contentBoxes: n }); }} placeholder="Badge" />
              <Input value={str(b.title)} onChange={(v) => { const n = [...boxes]; n[i] = { ...b, title: v }; patch({ contentBoxes: n }); }} placeholder="Title" />
              <button type="button" onClick={() => patch({ contentBoxes: boxes.filter((_, idx) => idx !== i) })} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
            </div>
            <Textarea rows={2} value={str(b.text)} onChange={(v) => { const n = [...boxes]; n[i] = { ...b, text: v }; patch({ contentBoxes: n }); }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartListEditor({
  label,
  charts,
  onChange,
}: {
  label: string;
  charts: JsonObj[];
  onChange: (next: JsonObj[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <FieldLabel>{label}</FieldLabel>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...charts,
              {
                id: `chart-${Date.now()}`,
                title: "New Chart",
                subtitle: "Dataset subtitle",
                chartType: "bar",
                labels: ["2024", "2025", "2026"],
                series: [{ name: "Series 1", values: [100, 120, 145] }],
              },
            ])
          }
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
        >
          <Plus className="w-3 h-3" /> Add Chart
        </button>
      </div>
      {charts.map((c, i) => {
        const seriesArr = arr<JsonObj>(c.series);
        const firstSeries = seriesArr[0] || { name: "Series 1", values: [] };
        return (
          <div key={i} className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="sm:col-span-2">
                <Input value={str(c.title)} onChange={(v) => { const n = [...charts]; n[i] = { ...c, title: v }; onChange(n); }} placeholder="Chart Title" />
              </div>
              <select
                value={str(c.chartType, "bar")}
                onChange={(e) => { const n = [...charts]; n[i] = { ...c, chartType: e.target.value }; onChange(n); }}
                className="px-3 py-2 rounded-lg border border-[#E5E8DA] text-xs bg-white"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
              <button type="button" onClick={() => onChange(charts.filter((_, idx) => idx !== i))} className="text-red-600 text-xs font-bold cursor-pointer">Remove</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input value={str(c.subtitle)} onChange={(v) => { const n = [...charts]; n[i] = { ...c, subtitle: v }; onChange(n); }} placeholder="Subtitle" />
              <Input value={arr<string>(c.labels).join(", ")} onChange={(v) => { const n = [...charts]; n[i] = { ...c, labels: v.split(",").map((s) => s.trim()) }; onChange(n); }} placeholder="Labels: 2024, 2025" />
              <Input
                value={arr<number>(firstSeries.values).join(", ")}
                onChange={(v) => {
                  const n = [...charts];
                  n[i] = {
                    ...c,
                    series: [
                      {
                        name: str(firstSeries.name, "Value"),
                        values: v.split(",").map((x) => Number(x.trim()) || 0),
                      },
                    ],
                  };
                  onChange(n);
                }}
                placeholder="Values: 100, 120"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
