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

  if (str(content.renderMode) === "rich_page") {
    return <RichPageBlocksEditor content={content} onChange={onChange} />;
  }

  if (str(content.renderMode) === "lg_static_template") {
    return (
      <LgStaticTemplateEditor
        pageType={pageType}
        content={content}
        onChange={onChange}
      />
    );
  }

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
                      <Input
                        value={str(ins.targetPageType)}
                        onChange={(v) => {
                          const nextIns = [...insights];
                          nextIns[iIdx] = { ...ins, targetPageType: v };
                          const n = [...themes];
                          n[tIdx] = { ...t, insights: nextIns };
                          patch({ themes: n });
                        }}
                        placeholder="Optional Target Page Key (e.g. workforce_insight_1)"
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

function StringListEditor({
  label,
  items,
  onChange,
  multiline = true,
  addLabel = "Add Item",
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  multiline?: boolean;
  addLabel?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <FieldLabel>{label}</FieldLabel>
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0F5DF] border border-[#B2DB79] text-[#416102] text-[11px] font-bold cursor-pointer"
        >
          <Plus className="w-3 h-3" /> {addLabel}
        </button>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2">
          <div className="flex-1">
            {multiline ? (
              <Textarea
                rows={2}
                value={item}
                onChange={(v) => {
                  const next = [...items];
                  next[idx] = v;
                  onChange(next);
                }}
              />
            ) : (
              <Input
                value={item}
                onChange={(v) => {
                  const next = [...items];
                  next[idx] = v;
                  onChange(next);
                }}
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
            className="text-red-600 p-1.5 cursor-pointer"
            title="Remove"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function RichBlockJsonFallback({
  block,
  onChange,
}: {
  block: JsonObj;
  onChange: (next: JsonObj) => void;
}) {
  const [raw, setRaw] = React.useState(() => JSON.stringify(block, null, 2));
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    setRaw(JSON.stringify(block, null, 2));
    setErr("");
  }, [block]);

  return (
    <div className="space-y-1.5">
      <FieldLabel>Block JSON Data (for advanced / nested fields)</FieldLabel>
      <textarea
        rows={10}
        value={raw}
        onChange={(e) => {
          const val = e.target.value;
          setRaw(val);
          try {
            const parsed = JSON.parse(val);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
              setErr("");
              onChange(parsed as JsonObj);
            } else {
              setErr("Root value must be a JSON object.");
            }
          } catch (parseErr) {
            setErr(parseErr instanceof Error ? parseErr.message : "Invalid JSON");
          }
        }}
        className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] font-mono text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#8AC900]"
      />
      {err && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{err}</span>
        </div>
      )}
    </div>
  );
}

function createEmptyRichBlock(type: string): JsonObj {
  const id = `${type}-${Date.now()}`;
  switch (type) {
    case "narrative":
      return { id, type, title: "New Narrative Section", paragraphs: [""] };
    case "industry_insight":
      return { id, type, badge: "INDUSTRY INSIGHT", title: "Key Insight", paragraphs: [""] };
    case "kpi_grid":
      return { id, type, title: "Key Metrics", columns: 3, items: [{ label: "Metric", value: "0" }] };
    case "chart":
      return {
        id,
        type,
        title: "New Chart",
        subtitle: "",
        chartType: "bar",
        labels: ["2024", "2025", "2026"],
        series: [{ name: "Series 1", values: [10, 20, 30] }],
      };
    case "table":
      return {
        id,
        type,
        title: "New Table",
        headers: ["Column 1", "Column 2"],
        rows: [["Row 1", "Value 1"]],
      };
    case "strategy_cards":
      return {
        id,
        type,
        columns: 2,
        items: [{ badge: "STRATEGY 1", title: "New Strategy", objective: "" }],
      };
    case "link_cards":
      return {
        id,
        type,
        title: "Section Cards",
        columns: 3,
        cards: [{ number: "1", title: "New Card", summary: "" }],
      };
    case "master_detail":
      return {
        id,
        type,
        listTitle: "ITEMS · SELECT TO OPEN",
        items: [{ code: "01", title: "New Item", summaryParagraphs: [""] }],
      };
    case "accordions":
      return {
        id,
        type,
        title: "Details",
        items: [{ id: `item-${Date.now()}`, title: "Item 1", defaultOpen: true, summaryParagraphs: [""] }],
      };
    case "downloads_list":
      return {
        id,
        type,
        currentReportTitle: "Report PDF",
        currentReportDescription: "Download the full PDF report.",
        currentPdfUrl: "",
        previousReports: [],
      };
    default:
      return { id, type: "narrative", paragraphs: [""] };
  }
}

function RichPageBlocksEditor({
  content,
  onChange,
}: {
  content: JsonObj;
  onChange: (next: JsonObj) => void;
}) {
  const patch = (p: JsonObj) => onChange({ ...content, ...p });
  const leadParagraphs = arr<string>(content.leadParagraphs);
  const blocks = arr<JsonObj>(content.blocks);
  const [newBlockType, setNewBlockType] = React.useState("narrative");
  const [jsonModes, setJsonModes] = React.useState<Record<number, boolean>>({});

  const updateBlock = (idx: number, nextBlock: JsonObj) => {
    const copy = [...blocks];
    copy[idx] = nextBlock;
    patch({ blocks: copy });
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= blocks.length) return;
    const copy = [...blocks];
    const [item] = copy.splice(idx, 1);
    copy.splice(target, 0, item);
    patch({ blocks: copy });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Header Badge</FieldLabel>
            <Input
              value={str(content.badge)}
              onChange={(v) => patch({ badge: v })}
              placeholder="e.g. INTRODUCTION"
            />
          </div>
          <div>
            <FieldLabel>Page Header Title</FieldLabel>
            <Input
              value={str(content.headerTitle)}
              onChange={(v) => patch({ headerTitle: v })}
              placeholder="Page main title"
            />
          </div>
        </div>
        <StringListEditor
          label="Lead Paragraphs (supports [[N]] citation markers)"
          items={leadParagraphs}
          onChange={(next) => patch({ leadParagraphs: next })}
          addLabel="Add Lead Paragraph"
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <FieldLabel>Page Content Blocks ({blocks.length})</FieldLabel>
          <div className="flex items-center gap-2">
            <select
              value={newBlockType}
              onChange={(e) => setNewBlockType(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E5E8DA] text-xs bg-white"
            >
              <option value="narrative">Narrative Section</option>
              <option value="industry_insight">Industry Insight Box</option>
              <option value="kpi_grid">KPI Grid</option>
              <option value="chart">Chart (Bar / Line / Donut)</option>
              <option value="table">Data Table</option>
              <option value="strategy_cards">Strategy Cards</option>
              <option value="link_cards">Link / Card Grid</option>
              <option value="master_detail">Master-Detail List</option>
              <option value="accordions">Accordions</option>
              <option value="downloads_list">Downloads List</option>
            </select>
            <button
              type="button"
              onClick={() =>
                patch({ blocks: [...blocks, createEmptyRichBlock(newBlockType)] })
              }
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Block
            </button>
          </div>
        </div>

        {blocks.map((block, idx) => {
          const bType = str(block.type);
          const isJson = !!jsonModes[idx];
          const patchBlock = (p: JsonObj) => updateBlock(idx, { ...block, ...p });

          return (
            <div
              key={str(block.id, `blk-${idx}`)}
              className="p-4 rounded-xl border border-[#E5E8DA] bg-white space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E8DA] pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#F0F5DF] text-[#416102]">
                    #{idx + 1} · {bType}
                  </span>
                  {str(block.title) && (
                    <span className="text-xs font-semibold text-[#252D02] truncate max-w-[320px]">
                      {str(block.title)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      setJsonModes((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                    className="px-2.5 py-1 rounded-md border border-[#E5E8DA] bg-[#FAFAF0] font-semibold text-[#535862] cursor-pointer"
                  >
                    {isJson ? "Visual Editor" : "Raw JSON"}
                  </button>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveBlock(idx, -1)}
                    className="px-2 py-1 rounded-md border border-[#E5E8DA] disabled:opacity-40 cursor-pointer"
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={idx === blocks.length - 1}
                    onClick={() => moveBlock(idx, 1)}
                    className="px-2 py-1 rounded-md border border-[#E5E8DA] disabled:opacity-40 cursor-pointer"
                    title="Move Down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      patch({ blocks: blocks.filter((_, bi) => bi !== idx) })
                    }
                    className="text-red-600 px-2 py-1 font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {isJson ? (
                <RichBlockJsonFallback
                  block={block}
                  onChange={(nextB) => updateBlock(idx, nextB)}
                />
              ) : bType === "narrative" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      value={str(block.badge)}
                      onChange={(v) => patchBlock({ badge: v })}
                      placeholder="Badge (optional)"
                    />
                    <Input
                      value={str(block.title)}
                      onChange={(v) => patchBlock({ title: v })}
                      placeholder="Section Title"
                    />
                    <Input
                      value={str(block.subtitle)}
                      onChange={(v) => patchBlock({ subtitle: v })}
                      placeholder="Subtitle (optional)"
                    />
                  </div>
                  <StringListEditor
                    label="Paragraphs"
                    items={arr<string>(block.paragraphs)}
                    onChange={(next) => patchBlock({ paragraphs: next })}
                    addLabel="Add Paragraph"
                  />
                  <div>
                    <FieldLabel>Bullet Points (one per line)</FieldLabel>
                    <Textarea
                      rows={3}
                      value={arr<string>(block.bullets).join("\n")}
                      onChange={(v) =>
                        patchBlock({
                          bullets: v ? v.split("\n").filter((l) => l.length > 0) : [],
                        })
                      }
                    />
                  </div>
                  <Input
                    value={str(block.note)}
                    onChange={(v) => patchBlock({ note: v })}
                    placeholder="Callout note (optional)"
                  />
                </div>
              ) : bType === "industry_insight" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      value={str(block.badge)}
                      onChange={(v) => patchBlock({ badge: v })}
                      placeholder="Badge"
                    />
                    <Input
                      value={str(block.number)}
                      onChange={(v) => patchBlock({ number: v })}
                      placeholder="Number"
                    />
                    <Input
                      value={str(block.title)}
                      onChange={(v) => patchBlock({ title: v })}
                      placeholder="Insight Title"
                    />
                  </div>
                  <StringListEditor
                    label="Paragraphs"
                    items={arr<string>(block.paragraphs)}
                    onChange={(next) => patchBlock({ paragraphs: next })}
                    addLabel="Add Paragraph"
                  />
                  <div>
                    <FieldLabel>Bullet Points (one per line)</FieldLabel>
                    <Textarea
                      rows={3}
                      value={arr<string>(block.bullets).join("\n")}
                      onChange={(v) =>
                        patchBlock({
                          bullets: v ? v.split("\n").filter((l) => l.length > 0) : [],
                        })
                      }
                    />
                  </div>
                </div>
              ) : bType === "kpi_grid" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      value={str(block.title)}
                      onChange={(v) => patchBlock({ title: v })}
                      placeholder="KPI Grid Title (optional)"
                    />
                    <Input
                      value={String(num(block.columns, 3))}
                      onChange={(v) => patchBlock({ columns: Number(v) || 3 })}
                      placeholder="Columns (2, 3, 4)"
                    />
                  </div>
                  {arr<JsonObj>(block.items).map((kpi, ki) => (
                    <div
                      key={ki}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-2.5 rounded-lg bg-[#FAFAF0] border border-[#E5E8DA]"
                    >
                      <Input
                        value={str(kpi.value)}
                        onChange={(v) => {
                          const n = [...arr<JsonObj>(block.items)];
                          n[ki] = { ...kpi, value: v };
                          patchBlock({ items: n });
                        }}
                        placeholder="Value"
                      />
                      <Input
                        value={str(kpi.label)}
                        onChange={(v) => {
                          const n = [...arr<JsonObj>(block.items)];
                          n[ki] = { ...kpi, label: v };
                          patchBlock({ items: n });
                        }}
                        placeholder="Label"
                      />
                      <Input
                        value={str(kpi.source)}
                        onChange={(v) => {
                          const n = [...arr<JsonObj>(block.items)];
                          n[ki] = { ...kpi, source: v };
                          patchBlock({ items: n });
                        }}
                        placeholder="Source"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          patchBlock({
                            items: arr<JsonObj>(block.items).filter((_, i) => i !== ki),
                          })
                        }
                        className="text-red-600 text-xs font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      patchBlock({
                        items: [...arr<JsonObj>(block.items), { label: "", value: "" }],
                      })
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F0F5DF] border border-[#B2DB79] text-[#416102] text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add KPI Card
                  </button>
                </div>
              ) : bType === "chart" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      value={str(block.title)}
                      onChange={(v) => patchBlock({ title: v })}
                      placeholder="Chart Title"
                    />
                    <select
                      value={str(block.chartType, "bar")}
                      onChange={(e) => patchBlock({ chartType: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-[#E5E8DA] text-xs bg-white"
                    >
                      <option value="bar">Bar Chart</option>
                      <option value="grouped_bar">Grouped Bar</option>
                      <option value="horizontal_bar">Horizontal Bar</option>
                      <option value="line">Line Chart</option>
                      <option value="line_target">Line + Target</option>
                      <option value="stacked_bar">Stacked Bar</option>
                      <option value="donut">Donut Chart</option>
                    </select>
                    <Input
                      value={str(block.valueSuffix)}
                      onChange={(v) => patchBlock({ valueSuffix: v })}
                      placeholder="Suffix (e.g. %)"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      value={str(block.subtitle)}
                      onChange={(v) => patchBlock({ subtitle: v })}
                      placeholder="Subtitle"
                    />
                    <Input
                      value={str(block.source)}
                      onChange={(v) => patchBlock({ source: v })}
                      placeholder="Source"
                    />
                  </div>
                  <div>
                    <FieldLabel>X-Axis Labels (comma separated)</FieldLabel>
                    <Input
                      value={arr<string>(block.labels).join(", ")}
                      onChange={(v) =>
                        patchBlock({
                          labels: v.split(",").map((s) => s.trim()),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FieldLabel>Series Datasets</FieldLabel>
                      <button
                        type="button"
                        onClick={() =>
                          patchBlock({
                            series: [
                              ...arr<JsonObj>(block.series),
                              { name: "New Series", values: [] },
                            ],
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F0F5DF] border border-[#B2DB79] text-[#416102] text-[11px] font-bold cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Series
                      </button>
                    </div>
                    {arr<JsonObj>(block.series).map((ser, si) => (
                      <div
                        key={si}
                        className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-2.5 rounded-lg bg-[#FAFAF0] border border-[#E5E8DA]"
                      >
                        <Input
                          value={str(ser.name)}
                          onChange={(v) => {
                            const n = [...arr<JsonObj>(block.series)];
                            n[si] = { ...ser, name: v };
                            patchBlock({ series: n });
                          }}
                          placeholder="Series Name"
                        />
                        <Input
                          value={str(ser.color)}
                          onChange={(v) => {
                            const n = [...arr<JsonObj>(block.series)];
                            n[si] = { ...ser, color: v };
                            patchBlock({ series: n });
                          }}
                          placeholder="Hex Color (#046D2A)"
                        />
                        <Input
                          value={arr<number>(ser.values).join(", ")}
                          onChange={(v) => {
                            const n = [...arr<JsonObj>(block.series)];
                            n[si] = {
                              ...ser,
                              values: v.split(",").map((x) => Number(x.trim()) || 0),
                            };
                            patchBlock({ series: n });
                          }}
                          placeholder="Numbers: 10, 20, 30"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            patchBlock({
                              series: arr<JsonObj>(block.series).filter((_, i) => i !== si),
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
              ) : bType === "table" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      value={str(block.title)}
                      onChange={(v) => patchBlock({ title: v })}
                      placeholder="Table Title"
                    />
                    <Input
                      value={str(block.subtitle)}
                      onChange={(v) => patchBlock({ subtitle: v })}
                      placeholder="Subtitle"
                    />
                    <Input
                      value={str(block.source)}
                      onChange={(v) => patchBlock({ source: v })}
                      placeholder="Source"
                    />
                  </div>
                  <div className="overflow-x-auto border border-[#E5E8DA] rounded-lg">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#FAFAF0]">
                          {arr<string>(block.headers).map((h, hi) => (
                            <th key={hi} className="p-1.5">
                              <Input
                                value={h}
                                onChange={(v) => {
                                  const nh = [...arr<string>(block.headers)];
                                  nh[hi] = v;
                                  patchBlock({ headers: nh });
                                }}
                              />
                            </th>
                          ))}
                          <th className="w-16" />
                        </tr>
                      </thead>
                      <tbody>
                        {arr<string[]>(block.rows).map((row, ri) => (
                          <tr key={ri} className="border-t border-[#E5E8DA]">
                            {row.map((cell, ci) => (
                              <td key={ci} className="p-1.5">
                                <Input
                                  value={String(cell ?? "")}
                                  onChange={(v) => {
                                    const nr = arr<string[]>(block.rows).map((r) => [...r]);
                                    nr[ri][ci] = v;
                                    patchBlock({ rows: nr });
                                  }}
                                />
                              </td>
                            ))}
                            <td className="p-1.5 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  patchBlock({
                                    rows: arr<string[]>(block.rows).filter((_, i) => i !== ri),
                                  })
                                }
                                className="text-red-600 text-xs font-bold cursor-pointer"
                              >
                                Del
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const colCount = Math.max(1, arr<string>(block.headers).length);
                      patchBlock({
                        rows: [...arr<string[]>(block.rows), Array(colCount).fill("")],
                      });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F0F5DF] border border-[#B2DB79] text-[#416102] text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                </div>
              ) : bType === "strategy_cards" ? (
                <div className="space-y-3">
                  {arr<JsonObj>(block.items).map((st, si) => (
                    <div
                      key={si}
                      className="p-3 rounded-lg bg-[#FAFAF0] border border-[#E5E8DA] space-y-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Input
                          value={str(st.badge)}
                          onChange={(v) => {
                            const n = [...arr<JsonObj>(block.items)];
                            n[si] = { ...st, badge: v };
                            patchBlock({ items: n });
                          }}
                          placeholder="Badge (STRATEGY 1)"
                        />
                        <Input
                          value={str(st.title)}
                          onChange={(v) => {
                            const n = [...arr<JsonObj>(block.items)];
                            n[si] = { ...st, title: v };
                            patchBlock({ items: n });
                          }}
                          placeholder="Strategy Title"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            patchBlock({
                              items: arr<JsonObj>(block.items).filter((_, i) => i !== si),
                            })
                          }
                          className="text-red-600 text-xs font-bold cursor-pointer"
                        >
                          Remove Card
                        </button>
                      </div>
                      <Textarea
                        rows={2}
                        value={str(st.objective)}
                        onChange={(v) => {
                          const n = [...arr<JsonObj>(block.items)];
                          n[si] = { ...st, objective: v };
                          patchBlock({ items: n });
                        }}
                        placeholder="Objective"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input
                          value={str(st.workforceInsight)}
                          onChange={(v) => {
                            const n = [...arr<JsonObj>(block.items)];
                            n[si] = { ...st, workforceInsight: v };
                            patchBlock({ items: n });
                          }}
                          placeholder="Workforce Insight"
                        />
                        <Input
                          value={str(st.jscFunction)}
                          onChange={(v) => {
                            const n = [...arr<JsonObj>(block.items)];
                            n[si] = { ...st, jscFunction: v };
                            patchBlock({ items: n });
                          }}
                          placeholder="JSC Function"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      patchBlock({
                        items: [
                          ...arr<JsonObj>(block.items),
                          { badge: "NEW STRATEGY", title: "", objective: "" },
                        ],
                      })
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F0F5DF] border border-[#B2DB79] text-[#416102] text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Strategy Card
                  </button>
                </div>
              ) : bType === "downloads_list" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      value={str(block.currentReportTitle)}
                      onChange={(v) => patchBlock({ currentReportTitle: v })}
                      placeholder="Current Report Title"
                    />
                    <Input
                      value={str(block.currentPdfUrl)}
                      onChange={(v) => patchBlock({ currentPdfUrl: v })}
                      placeholder="Current PDF URL"
                    />
                  </div>
                  <Textarea
                    rows={2}
                    value={str(block.currentReportDescription)}
                    onChange={(v) => patchBlock({ currentReportDescription: v })}
                    placeholder="Description"
                  />
                </div>
              ) : (
                <RichBlockJsonFallback
                  block={block}
                  onChange={(nextB) => updateBlock(idx, nextB)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Shared Helpers for Local Government 2026 Static-Parity Editor ── */

function LgCtaPairEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: JsonObj;
  onChange: (next: JsonObj) => void;
}) {
  return (
    <div className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Input
          value={str(value.label)}
          onChange={(v) => onChange({ ...value, label: v })}
          placeholder="Button Label"
        />
        <Input
          value={str(value.pageType)}
          onChange={(v) => onChange({ ...value, pageType: v })}
          placeholder="Target Page Type (e.g. executive_summary)"
        />
      </div>
    </div>
  );
}

function LgStrategiesArrayEditor({
  strategies,
  onChange,
}: {
  strategies: JsonObj[];
  onChange: (next: JsonObj[]) => void;
}) {
  const update = (idx: number, nextItem: JsonObj) => {
    const copy = [...strategies];
    copy[idx] = nextItem;
    onChange(copy);
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FieldLabel>2026 Proposed Strategies ({strategies.length})</FieldLabel>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...strategies,
              {
                badge: `STRATEGY ${strategies.length + 1}`,
                borderColor: strategies.length % 2 === 0 ? "#9CAA54" : "#046D2A",
                title: "New Workforce Strategy",
                objective: "",
                workforceInsight: "",
                jscFunction: "",
                approach: "",
                deliverable: "",
                anticipatedTiming: "",
                keyStakeholders: [],
              },
            ])
          }
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Strategy
        </button>
      </div>
      {strategies.map((st, si) => (
        <div
          key={si}
          className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2.5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="grid grid-cols-2 gap-2 flex-1 min-w-[240px]">
              <Input
                value={str(st.badge)}
                onChange={(v) => update(si, { ...st, badge: v })}
                placeholder="Badge (STRATEGY 1)"
              />
              <Input
                value={str(st.borderColor)}
                onChange={(v) => update(si, { ...st, borderColor: v })}
                placeholder="#9CAA54 or #046D2A"
              />
            </div>
            <button
              type="button"
              onClick={() => onChange(strategies.filter((_, i) => i !== si))}
              className="p-1.5 text-red-600 cursor-pointer"
              title="Remove strategy"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <Input
            value={str(st.title)}
            onChange={(v) => update(si, { ...st, title: v })}
            placeholder="Strategy Title"
          />
          <Textarea
            rows={2}
            value={str(st.objective)}
            onChange={(v) => update(si, { ...st, objective: v })}
            placeholder="Objective"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              value={str(st.workforceInsight)}
              onChange={(v) => update(si, { ...st, workforceInsight: v })}
              placeholder="Workforce Insight Pill"
            />
            <Input
              value={str(st.jscFunction)}
              onChange={(v) => update(si, { ...st, jscFunction: v })}
              placeholder="JSC Function"
            />
          </div>
          {st.approachPartA !== undefined || st.approachPartB !== undefined ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Textarea
                rows={3}
                value={str(st.approachPartA)}
                onChange={(v) => update(si, { ...st, approachPartA: v })}
                placeholder="Approach – Part A"
              />
              <Textarea
                rows={3}
                value={str(st.approachPartB)}
                onChange={(v) => update(si, { ...st, approachPartB: v })}
                placeholder="Approach – Part B"
              />
            </div>
          ) : (
            <Textarea
              rows={3}
              value={str(st.approach)}
              onChange={(v) => update(si, { ...st, approach: v })}
              placeholder="Approach"
            />
          )}
          {st.deliverablePartA !== undefined ||
          st.deliverablePartB !== undefined ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Textarea
                rows={2}
                value={str(st.deliverablePartA)}
                onChange={(v) => update(si, { ...st, deliverablePartA: v })}
                placeholder="Deliverable – Part A"
              />
              <Textarea
                rows={2}
                value={str(st.deliverablePartB)}
                onChange={(v) => update(si, { ...st, deliverablePartB: v })}
                placeholder="Deliverable – Part B"
              />
            </div>
          ) : (
            <Textarea
              rows={2}
              value={str(st.deliverable)}
              onChange={(v) => update(si, { ...st, deliverable: v })}
              placeholder="Deliverable"
            />
          )}
          {st.anticipatedTimingPartA !== undefined ||
          st.anticipatedTimingPartB !== undefined ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                value={str(st.anticipatedTimingPartA)}
                onChange={(v) =>
                  update(si, { ...st, anticipatedTimingPartA: v })
                }
                placeholder="Timing – Part A"
              />
              <Input
                value={str(st.anticipatedTimingPartB)}
                onChange={(v) =>
                  update(si, { ...st, anticipatedTimingPartB: v })
                }
                placeholder="Timing – Part B"
              />
            </div>
          ) : (
            <Input
              value={str(st.anticipatedTiming)}
              onChange={(v) => update(si, { ...st, anticipatedTiming: v })}
              placeholder="Anticipated Timing"
            />
          )}
          <StringListEditor
            label="Key Stakeholders"
            items={arr<string>(st.keyStakeholders)}
            onChange={(nextK) => update(si, { ...st, keyStakeholders: nextK })}
            addLabel="Add Stakeholder"
          />
        </div>
      ))}
    </div>
  );
}

function LgThemesArrayEditor({
  themes,
  onChange,
}: {
  themes: JsonObj[];
  onChange: (next: JsonObj[]) => void;
}) {
  const updateTheme = (idx: number, nextT: JsonObj) => {
    const copy = [...themes];
    copy[idx] = nextT;
    onChange(copy);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FieldLabel>Workforce Themes ({themes.length})</FieldLabel>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...themes,
              {
                eyebrow: `THEME ${themes.length + 1}`,
                title: "New Theme",
                borderColor: themes.length % 2 === 0 ? "#9CAA54" : "#046D2A",
                overviewParagraphs: [""],
                insights: [],
              },
            ])
          }
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Theme
        </button>
      </div>
      {themes.map((th, ti) => {
        const insList = arr<JsonObj>(th.insights);
        return (
          <div
            key={ti}
            className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                value={str(th.eyebrow)}
                onChange={(v) => updateTheme(ti, { ...th, eyebrow: v })}
                placeholder="THEME 1 · 3 INSIGHTS"
              />
              <Input
                value={str(th.title)}
                onChange={(v) => updateTheme(ti, { ...th, title: v })}
                placeholder="Theme Title"
              />
              <div className="flex gap-2">
                <Input
                  value={str(th.borderColor)}
                  onChange={(v) => updateTheme(ti, { ...th, borderColor: v })}
                  placeholder="#9CAA54"
                />
                <button
                  type="button"
                  onClick={() => onChange(themes.filter((_, i) => i !== ti))}
                  className="p-2 text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <StringListEditor
              label="Overview Paragraphs"
              items={arr<string>(th.overviewParagraphs)}
              onChange={(nextP) =>
                updateTheme(ti, { ...th, overviewParagraphs: nextP })
              }
              addLabel="Add Overview Paragraph"
            />
            <div className="space-y-2 pt-2 border-t border-[#E5E8DA]">
              <div className="flex items-center justify-between">
                <FieldLabel>Insight Cards ({insList.length})</FieldLabel>
                <button
                  type="button"
                  onClick={() =>
                    updateTheme(ti, {
                      ...th,
                      insights: [
                        ...insList,
                        {
                          number: String(insList.length + 1),
                          eyebrow: `Theme ${ti + 1}, Insight ${insList.length + 1}`,
                          text: "",
                          targetPageType: `theme${ti + 1}_insight_${insList.length + 1}`,
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#B2DB79] text-[#416102] text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Insight Card
                </button>
              </div>
              {insList.map((ins, ii) => (
                <div
                  key={ii}
                  className="p-3 rounded-lg bg-white border border-[#E5E8DA] space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <Input
                      value={str(ins.number)}
                      onChange={(v) => {
                        const n = [...insList];
                        n[ii] = { ...ins, number: v };
                        updateTheme(ti, { ...th, insights: n });
                      }}
                      placeholder="#"
                    />
                    <Input
                      value={str(ins.eyebrow)}
                      onChange={(v) => {
                        const n = [...insList];
                        n[ii] = { ...ins, eyebrow: v };
                        updateTheme(ti, { ...th, insights: n });
                      }}
                      placeholder="Eyebrow"
                    />
                    <Input
                      value={str(ins.targetPageType)}
                      onChange={(v) => {
                        const n = [...insList];
                        n[ii] = { ...ins, targetPageType: v };
                        updateTheme(ti, { ...th, insights: n });
                      }}
                      placeholder="targetPageType"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateTheme(ti, {
                          ...th,
                          insights: insList.filter((_, x) => x !== ii),
                        })
                      }
                      className="text-red-600 text-xs font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                  <Textarea
                    rows={2}
                    value={str(ins.text)}
                    onChange={(v) => {
                      const n = [...insList];
                      n[ii] = { ...ins, text: v };
                      updateTheme(ti, { ...th, insights: n });
                    }}
                    placeholder="Insight summary text (supports [[N]] footnotes)"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LgChartEditor({
  label,
  chart,
  onChange,
}: {
  label: string;
  chart: JsonObj;
  onChange: (next: JsonObj) => void;
}) {
  const series = arr<JsonObj>(chart.series);
  return (
    <div className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-3">
      <FieldLabel>{label}</FieldLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <Input
            value={str(chart.title)}
            onChange={(v) => onChange({ ...chart, title: v })}
            placeholder="Chart Title"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            value={String(num(chart.min))}
            onChange={(v) =>
              onChange({ ...chart, min: Number(v) || 0 })
            }
            placeholder="Y Min"
          />
          <Input
            value={String(num(chart.max))}
            onChange={(v) =>
              onChange({ ...chart, max: Number(v) || 0 })
            }
            placeholder="Y Max"
          />
        </div>
      </div>
      <div>
        <FieldLabel>Years / X-Axis Labels (comma separated)</FieldLabel>
        <Input
          value={arr<string>(chart.years).join(", ")}
          onChange={(v) =>
            onChange({
              ...chart,
              years: v.split(",").map((s) => s.trim()),
            })
          }
        />
      </div>
      {series.map((s, si) => (
        <div
          key={si}
          className="p-3 rounded-lg bg-white border border-[#E5E8DA] grid grid-cols-1 md:grid-cols-3 gap-2"
        >
          <Input
            value={str(s.name)}
            onChange={(v) => {
              const n = [...series];
              n[si] = { ...s, name: v };
              onChange({ ...chart, series: n });
            }}
            placeholder="Series Name"
          />
          <Input
            value={str(s.color)}
            onChange={(v) => {
              const n = [...series];
              n[si] = { ...s, color: v };
              onChange({ ...chart, series: n });
            }}
            placeholder="Bar Color (#598303)"
          />
          <Input
            value={arr<number>(s.values).join(", ")}
            onChange={(v) => {
              const n = [...series];
              n[si] = {
                ...s,
                values: v.split(",").map((x) => Number(x.trim()) || 0),
              };
              onChange({ ...chart, series: n });
            }}
            placeholder="Numeric values (comma separated)"
          />
        </div>
      ))}
      <div>
        <FieldLabel>Source Line (Markdown links supported)</FieldLabel>
        <Input
          value={str(chart.sourceMarkdown)}
          onChange={(v) => onChange({ ...chart, sourceMarkdown: v })}
        />
      </div>
    </div>
  );
}

/* ── Main Local Government 2026 Static-Parity Admin Editor ── */
function LgStaticTemplateEditor({
  pageType,
  content,
  onChange,
}: {
  pageType: string;
  content: JsonObj;
  onChange: (next: JsonObj) => void;
}) {
  const tpl = str(content.lgTemplate, pageType);
  const patch = (p: JsonObj) => onChange({ ...content, ...p });
  const [rawJsonMode, setRawJsonMode] = React.useState(false);
  const [rawText, setRawText] = React.useState(() =>
    JSON.stringify(content, null, 2)
  );
  const [rawError, setRawError] = React.useState<string | null>(null);
  const [activeStateCode, setActiveStateCode] = React.useState("NSW");

  React.useEffect(() => {
    if (!rawJsonMode) {
      setRawText(JSON.stringify(content, null, 2));
      setRawError(null);
    }
  }, [content, rawJsonMode]);

  const headerBar = (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E8DA]">
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-[#046D2A] text-white text-[11px] font-bold uppercase tracking-wider">
          LG Static-Parity Template
        </span>
        <span className="text-xs font-semibold text-[#5C6629]">{tpl}</span>
      </div>
      <button
        type="button"
        onClick={() => {
          if (!rawJsonMode) {
            setRawText(JSON.stringify(content, null, 2));
            setRawError(null);
          }
          setRawJsonMode((m) => !m);
        }}
        className="px-3 py-1 rounded-full border border-[#B2DB79] bg-[#FAFAF0] text-[#416102] text-xs font-bold cursor-pointer"
      >
        {rawJsonMode ? "Switch to Visual Editor" : "Switch to Raw JSON"}
      </button>
    </div>
  );

  if (rawJsonMode) {
    return (
      <div className="space-y-4">
        {headerBar}
        <p className="text-xs text-[#6B7250]">
          Edit complete template JSON payload (including deep state tables,
          assets, and datasets). Supports{" "}
          <code>*italic*</code>, <code>**highlight**</code>,{" "}
          <code>[[N]]</code> citations, and{" "}
          <code>[Title](https://...)</code> links.
        </p>
        <Textarea
          rows={22}
          value={rawText}
          onChange={(v) => {
            setRawText(v);
            try {
              const parsed = JSON.parse(v) as JsonObj;
              if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                setRawError(null);
                onChange(parsed);
              } else {
                setRawError("Root JSON value must be an object.");
              }
            } catch (err) {
              setRawError(err instanceof Error ? err.message : "Invalid JSON");
            }
          }}
        />
        {rawError && (
          <p className="text-xs font-semibold text-red-600">{rawError}</p>
        )}
      </div>
    );
  }

  let body: React.ReactNode = null;

  if (tpl === "introduction") {
    const cells = arr<JsonObj>(content.glanceCells);
    const structureCards = arr<JsonObj>(content.structureCards);
    const banners = arr<JsonObj>(content.featureBanners);
    body = (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <Input
              value={str(content.eyebrow)}
              onChange={(v) => patch({ eyebrow: v })}
            />
          </div>
          <div>
            <FieldLabel>Title Line 1</FieldLabel>
            <Input
              value={str(content.titleLine1)}
              onChange={(v) => patch({ titleLine1: v })}
            />
          </div>
          <div>
            <FieldLabel>Title Line 2</FieldLabel>
            <Input
              value={str(content.titleLine2)}
              onChange={(v) => patch({ titleLine2: v })}
            />
          </div>
        </div>
        <StringListEditor
          label="Hero Paragraphs"
          items={arr<string>(content.paragraphs)}
          onChange={(nextP) => patch({ paragraphs: nextP })}
          addLabel="Add Paragraph"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Previous Report Link Path</FieldLabel>
            <Input
              value={str(content.previousReportHref)}
              onChange={(v) => patch({ previousReportHref: v })}
            />
          </div>
          <div>
            <FieldLabel>At-A-Glance Box Title</FieldLabel>
            <Input
              value={str(content.glanceTitle)}
              onChange={(v) => patch({ glanceTitle: v })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <FieldLabel>This Report At A Glance Cells ({cells.length})</FieldLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cells.map((cell, ci) => {
              const pair = arr<JsonObj>(cell.pair);
              const updateCell = (nextC: JsonObj) => {
                const n = [...cells];
                n[ci] = nextC;
                patch({ glanceCells: n });
              };
              if (pair.length > 0) {
                return (
                  <div
                    key={ci}
                    className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
                  >
                    <span className="text-[11px] font-bold text-[#728C28] uppercase">
                      Paired Stat Cell #{ci + 1}
                    </span>
                    {pair.map((sub, si) => (
                      <div key={si} className="grid grid-cols-2 gap-2">
                        <Input
                          value={String(num(sub.value))}
                          onChange={(v) => {
                            const np = [...pair];
                            np[si] = { ...sub, value: Number(v) || 0 };
                            updateCell({ ...cell, pair: np });
                          }}
                          placeholder="Value"
                        />
                        <Input
                          value={str(sub.label).replace(/\n/g, " / ")}
                          onChange={(v) => {
                            const np = [...pair];
                            np[si] = {
                              ...sub,
                              label: v.replace(/\s*\/\s*/g, "\n"),
                            };
                            updateCell({ ...cell, pair: np });
                          }}
                          placeholder="Label (use / for line break)"
                        />
                      </div>
                    ))}
                  </div>
                );
              }
              return (
                <div
                  key={ci}
                  className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
                >
                  <span className="text-[11px] font-bold text-[#728C28] uppercase">
                    Single Stat Cell #{ci + 1}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={String(num(cell.value))}
                      onChange={(v) =>
                        updateCell({ ...cell, value: Number(v) || 0 })
                      }
                      placeholder="Value"
                    />
                    <Input
                      value={str(cell.label).replace(/\n/g, " / ")}
                      onChange={(v) =>
                        updateCell({
                          ...cell,
                          label: v.replace(/\s*\/\s*/g, "\n"),
                        })
                      }
                      placeholder="Label"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <FieldLabel>Report Structure Section Heading</FieldLabel>
          <Input
            value={str(content.structureHeading)}
            onChange={(v) => patch({ structureHeading: v })}
          />
        </div>
        <div className="space-y-3">
          <FieldLabel>Structure Cards ({structureCards.length})</FieldLabel>
          {structureCards.map((card, ci) => {
            const updateCard = (nextCard: JsonObj) => {
              const n = [...structureCards];
              n[ci] = nextCard;
              patch({ structureCards: n });
            };
            return (
              <div
                key={ci}
                className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    value={str(card.title)}
                    onChange={(v) => updateCard({ ...card, title: v })}
                    placeholder="Card Title"
                  />
                  <Input
                    value={str(card.icon)}
                    onChange={(v) => updateCard({ ...card, icon: v })}
                    placeholder="Icon Path"
                  />
                  <Input
                    value={str(card.pageType)}
                    onChange={(v) => updateCard({ ...card, pageType: v })}
                    placeholder="Target PageType"
                  />
                </div>
                <Textarea
                  rows={2}
                  value={str(card.description)}
                  onChange={(v) => updateCard({ ...card, description: v })}
                  placeholder="Card Description"
                />
                <Input
                  value={arr<string>(card.tags).join(", ")}
                  onChange={(v) =>
                    updateCard({
                      ...card,
                      tags: v
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Tags (comma separated)"
                />
              </div>
            );
          })}
        </div>
        <div className="space-y-2">
          <FieldLabel>Bottom Utility Banners ({banners.length})</FieldLabel>
          {banners.map((b, bi) => (
            <div
              key={bi}
              className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] grid grid-cols-1 sm:grid-cols-4 gap-2"
            >
              <Input
                value={str(b.title)}
                onChange={(v) => {
                  const n = [...banners];
                  n[bi] = { ...b, title: v };
                  patch({ featureBanners: n });
                }}
                placeholder="Title"
              />
              <Input
                value={str(b.description)}
                onChange={(v) => {
                  const n = [...banners];
                  n[bi] = { ...b, description: v };
                  patch({ featureBanners: n });
                }}
                placeholder="Description"
              />
              <Input
                value={str(b.icon)}
                onChange={(v) => {
                  const n = [...banners];
                  n[bi] = { ...b, icon: v };
                  patch({ featureBanners: n });
                }}
                placeholder="Icon Path"
              />
              <Input
                value={str(b.pageType)}
                onChange={(v) => {
                  const n = [...banners];
                  n[bi] = { ...b, pageType: v };
                  patch({ featureBanners: n });
                }}
                placeholder="pageType"
              />
            </div>
          ))}
        </div>
      </div>
    );
  } else if (tpl === "about") {
    const partnership = (content.partnership || {}) as JsonObj;
    const cards = arr<JsonObj>(content.cards);
    const commitment = (content.commitment || {}) as JsonObj;
    body = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Page Title</FieldLabel>
            <Input
              value={str(content.title)}
              onChange={(v) => patch({ title: v })}
            />
          </div>
          <div>
            <FieldLabel>Wave Graphic Path</FieldLabel>
            <Input
              value={str(content.waveImage)}
              onChange={(v) => patch({ waveImage: v })}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Introduction</FieldLabel>
          <Textarea
            rows={3}
            value={str(content.intro)}
            onChange={(v) => patch({ intro: v })}
          />
        </div>
        <div className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
          <FieldLabel>Working in Partnership Callout</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              value={str(partnership.title)}
              onChange={(v) =>
                patch({ partnership: { ...partnership, title: v } })
              }
              placeholder="Title"
            />
            <Input
              value={str(partnership.icon)}
              onChange={(v) =>
                patch({ partnership: { ...partnership, icon: v } })
              }
              placeholder="Icon Path"
            />
          </div>
          <Textarea
            rows={2}
            value={str(partnership.text)}
            onChange={(v) =>
              patch({ partnership: { ...partnership, text: v } })
            }
          />
        </div>
        <div>
          <FieldLabel>Four Functions Section Heading</FieldLabel>
          <Input
            value={str(content.sectionHeading)}
            onChange={(v) => patch({ sectionHeading: v })}
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Four Role Cards ({cards.length})</FieldLabel>
          {cards.map((c, ci) => (
            <div
              key={ci}
              className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  value={str(c.title)}
                  onChange={(v) => {
                    const n = [...cards];
                    n[ci] = { ...c, title: v };
                    patch({ cards: n });
                  }}
                  placeholder="Card Title"
                />
                <Input
                  value={str(c.icon)}
                  onChange={(v) => {
                    const n = [...cards];
                    n[ci] = { ...c, icon: v };
                    patch({ cards: n });
                  }}
                  placeholder="Icon Path"
                />
              </div>
              <Textarea
                rows={2}
                value={str(c.text)}
                onChange={(v) => {
                  const n = [...cards];
                  n[ci] = { ...c, text: v };
                  patch({ cards: n });
                }}
              />
            </div>
          ))}
        </div>
        <div className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
          <FieldLabel>Our Commitment Box (supports [[1]] footnote)</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              value={str(commitment.title)}
              onChange={(v) =>
                patch({ commitment: { ...commitment, title: v } })
              }
            />
            <Input
              value={str(commitment.icon)}
              onChange={(v) =>
                patch({ commitment: { ...commitment, icon: v } })
              }
            />
          </div>
          <Textarea
            rows={2}
            value={str(commitment.text)}
            onChange={(v) =>
              patch({ commitment: { ...commitment, text: v } })
            }
          />
        </div>
      </div>
    );
  } else if (tpl === "methodology") {
    const steps = arr<JsonObj>(content.steps);
    const reps = (content.representativesCard || {}) as JsonObj;
    const research = (content.researchSection || {}) as JsonObj;
    const gov = (content.governanceSection || {}) as JsonObj;
    const bottomCards = arr<JsonObj>(content.bottomCards);
    body = (
      <div className="space-y-5">
        <div>
          <FieldLabel>Page Title</FieldLabel>
          <Input
            value={str(content.title)}
            onChange={(v) => patch({ title: v })}
          />
        </div>
        <StringListEditor
          label="Intro Paragraphs"
          items={arr<string>(content.introParagraphs)}
          onChange={(nextP) => patch({ introParagraphs: nextP })}
          addLabel="Add Intro Paragraph"
        />
        <div className="space-y-2">
          <FieldLabel>5 Methodology Steps</FieldLabel>
          {steps.map((s, si) => (
            <div
              key={si}
              className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] grid grid-cols-1 sm:grid-cols-5 gap-2"
            >
              <Input
                value={str(s.stepLabel)}
                onChange={(v) => {
                  const n = [...steps];
                  n[si] = { ...s, stepLabel: v };
                  patch({ steps: n });
                }}
                placeholder="STEP 1"
              />
              <Input
                value={str(s.title)}
                onChange={(v) => {
                  const n = [...steps];
                  n[si] = { ...s, title: v };
                  patch({ steps: n });
                }}
                placeholder="Title"
              />
              <Input
                value={
                  s.count !== undefined ? String(num(s.count)) : str(s.subtitle)
                }
                onChange={(v) => {
                  const n = [...steps];
                  if (s.count !== undefined) {
                    n[si] = { ...s, count: Number(v) || 0 };
                  } else {
                    n[si] = { ...s, subtitle: v };
                  }
                  patch({ steps: n });
                }}
                placeholder="Count or Subtitle"
              />
              <Input
                value={str(s.suffixText)}
                onChange={(v) => {
                  const n = [...steps];
                  n[si] = { ...s, suffixText: v };
                  patch({ steps: n });
                }}
                placeholder="Suffix text"
              />
              <Input
                value={str(s.icon)}
                onChange={(v) => {
                  const n = [...steps];
                  n[si] = { ...s, icon: v };
                  patch({ steps: n });
                }}
                placeholder="Icon SVG"
              />
            </div>
          ))}
        </div>
        <div className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
          <FieldLabel>Industry-Sector Representatives Card</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              value={str(reps.title)}
              onChange={(v) =>
                patch({ representativesCard: { ...reps, title: v } })
              }
            />
            <Input
              value={str(reps.icon)}
              onChange={(v) =>
                patch({ representativesCard: { ...reps, icon: v } })
              }
            />
          </div>
          <Textarea
            rows={2}
            value={str(reps.intro)}
            onChange={(v) =>
              patch({ representativesCard: { ...reps, intro: v } })
            }
          />
          <StringListEditor
            label="Representative Organisations"
            items={arr<string>(reps.items)}
            onChange={(nextI) =>
              patch({ representativesCard: { ...reps, items: nextI } })
            }
            multiline={false}
            addLabel="Add Representative"
          />
        </div>
        <div className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
          <FieldLabel>Secondary Research & Council Stats Section</FieldLabel>
          <Textarea
            rows={3}
            value={str(research.paragraph)}
            onChange={(v) =>
              patch({ researchSection: { ...research, paragraph: v } })
            }
          />
          {arr<JsonObj>(research.stats).map((st, si) => (
            <div key={si} className="grid grid-cols-3 gap-2">
              <Input
                value={String(num(st.value))}
                onChange={(v) => {
                  const ns = [...arr<JsonObj>(research.stats)];
                  ns[si] = { ...st, value: Number(v) || 0 };
                  patch({ researchSection: { ...research, stats: ns } });
                }}
                placeholder="Count"
              />
              <div className="col-span-2">
                <Input
                  value={str(st.label)}
                  onChange={(v) => {
                    const ns = [...arr<JsonObj>(research.stats)];
                    ns[si] = { ...st, label: v };
                    patch({ researchSection: { ...research, stats: ns } });
                  }}
                  placeholder="Label"
                />
              </div>
            </div>
          ))}
          <Input
            value={str(research.appendixText)}
            onChange={(v) =>
              patch({ researchSection: { ...research, appendixText: v } })
            }
            placeholder="Appendix Note"
          />
        </div>
        <div className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
          <FieldLabel>Governance Stages Heading & Stages</FieldLabel>
          <Input
            value={str(gov.heading)}
            onChange={(v) => patch({ governanceSection: { ...gov, heading: v } })}
          />
          {arr<JsonObj>(gov.stages).map((st, si) => (
            <div key={si} className="p-2.5 rounded-lg bg-white border border-[#E5E8DA] space-y-2">
              <Input
                value={str(st.title)}
                onChange={(v) => {
                  const ns = [...arr<JsonObj>(gov.stages)];
                  ns[si] = { ...st, title: v };
                  patch({ governanceSection: { ...gov, stages: ns } });
                }}
              />
              <Textarea
                rows={2}
                value={arr<string>(st.paragraphs).join("\n")}
                onChange={(v) => {
                  const ns = [...arr<JsonObj>(gov.stages)];
                  ns[si] = { ...st, paragraphs: v.split("\n") };
                  patch({ governanceSection: { ...gov, stages: ns } });
                }}
              />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <FieldLabel>Bottom Info Cards ({bottomCards.length})</FieldLabel>
          {bottomCards.map((bc, bi) => (
            <div
              key={bi}
              className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  value={str(bc.title)}
                  onChange={(v) => {
                    const n = [...bottomCards];
                    n[bi] = { ...bc, title: v };
                    patch({ bottomCards: n });
                  }}
                />
                <Input
                  value={str(bc.icon)}
                  onChange={(v) => {
                    const n = [...bottomCards];
                    n[bi] = { ...bc, icon: v };
                    patch({ bottomCards: n });
                  }}
                />
              </div>
              <Textarea
                rows={3}
                value={str(bc.text)}
                onChange={(v) => {
                  const n = [...bottomCards];
                  n[bi] = { ...bc, text: v };
                  patch({ bottomCards: n });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  } else if (tpl === "executive_summary") {
    const driversBanner = (content.driversBanner || {}) as JsonObj;
    const themesHeader = (content.themesHeader || {}) as JsonObj;
    const strategiesHeader = (content.strategiesHeader || {}) as JsonObj;
    const lfBanner = (content.lookingForwardBanner || {}) as JsonObj;
    const supportingLinks = arr<JsonObj>(content.supportingLinks);
    body = (
      <div className="space-y-5">
        <div>
          <FieldLabel>Page Title</FieldLabel>
          <Input
            value={str(content.title)}
            onChange={(v) => patch({ title: v })}
          />
        </div>
        <div>
          <FieldLabel>Introduction</FieldLabel>
          <Textarea
            rows={3}
            value={str(content.intro)}
            onChange={(v) => patch({ intro: v })}
          />
        </div>
        {[
          ["Drivers Banner", "driversBanner", driversBanner],
          ["Themes Banner", "themesHeader", themesHeader],
          ["Strategies Banner", "strategiesHeader", strategiesHeader],
          ["Looking Forward Banner", "lookingForwardBanner", lfBanner],
        ].map(([lbl, key, obj]) => {
          const b = obj as JsonObj;
          const k = key as string;
          return (
            <div
              key={k}
              className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
            >
              <FieldLabel>{lbl as string}</FieldLabel>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  value={str(b.title)}
                  onChange={(v) => patch({ [k]: { ...b, title: v } })}
                  placeholder="Title"
                />
                <Input
                  value={str(b.buttonLabel)}
                  onChange={(v) => patch({ [k]: { ...b, buttonLabel: v } })}
                  placeholder="Button Label"
                />
                <Input
                  value={str(b.targetPageType)}
                  onChange={(v) =>
                    patch({ [k]: { ...b, targetPageType: v } })
                  }
                  placeholder="targetPageType"
                />
              </div>
              <Textarea
                rows={2}
                value={str(b.description)}
                onChange={(v) => patch({ [k]: { ...b, description: v } })}
              />
            </div>
          );
        })}
        <LgThemesArrayEditor
          themes={arr<JsonObj>(content.themes)}
          onChange={(nextT) => patch({ themes: nextT })}
        />
        <div>
          <FieldLabel>Terminology Callout Note</FieldLabel>
          <Textarea
            rows={2}
            value={str(content.terminologyNote)}
            onChange={(v) => patch({ terminologyNote: v })}
          />
        </div>
        <LgStrategiesArrayEditor
          strategies={arr<JsonObj>(content.strategies)}
          onChange={(nextS) => patch({ strategies: nextS })}
        />
        <div className="space-y-2">
          <FieldLabel>Supporting Links ({supportingLinks.length})</FieldLabel>
          {supportingLinks.map((lnk, li) => (
            <div key={li} className="grid grid-cols-2 gap-2">
              <Input
                value={str(lnk.label)}
                onChange={(v) => {
                  const n = [...supportingLinks];
                  n[li] = { ...lnk, label: v };
                  patch({ supportingLinks: n });
                }}
              />
              <Input
                value={str(lnk.pageType)}
                onChange={(v) => {
                  const n = [...supportingLinks];
                  n[li] = { ...lnk, pageType: v };
                  patch({ supportingLinks: n });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  } else if (tpl === "drivers_of_change") {
    const drivers = arr<JsonObj>(content.drivers);
    const megatrends = arr<JsonObj>(content.megatrends);
    body = (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Page Title</FieldLabel>
            <Input
              value={str(content.title)}
              onChange={(v) => patch({ title: v })}
            />
          </div>
          <div>
            <FieldLabel>Diagram Image</FieldLabel>
            <Input
              value={str(content.diagramImage)}
              onChange={(v) => patch({ diagramImage: v })}
            />
          </div>
        </div>
        <StringListEditor
          label="Intro Paragraphs"
          items={arr<string>(content.introParagraphs)}
          onChange={(nextP) => patch({ introParagraphs: nextP })}
          addLabel="Add Paragraph"
        />
        <div className="space-y-2">
          <FieldLabel>4 Drivers of Change ({drivers.length})</FieldLabel>
          {drivers.map((d, di) => {
            const updateD = (nd: JsonObj) => {
              const n = [...drivers];
              n[di] = nd;
              patch({ drivers: n });
            };
            return (
              <div
                key={di}
                className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    value={str(d.number)}
                    onChange={(v) => updateD({ ...d, number: v })}
                    placeholder="DRIVER 1"
                  />
                  <Input
                    value={str(d.shortTitle)}
                    onChange={(v) => updateD({ ...d, shortTitle: v })}
                    placeholder="Short Title"
                  />
                  <Input
                    value={str(d.fullTitle)}
                    onChange={(v) => updateD({ ...d, fullTitle: v })}
                    placeholder="Full Title"
                  />
                </div>
                <Input
                  value={str(d.shortDesc)}
                  onChange={(v) => updateD({ ...d, shortDesc: v })}
                  placeholder="Card Preview Snippet"
                />
                <Textarea
                  rows={3}
                  value={str(d.fullDesc)}
                  onChange={(v) => updateD({ ...d, fullDesc: v })}
                  placeholder="Full Description (supports [[N]] citations)"
                />
              </div>
            );
          })}
        </div>
        <div className="space-y-2">
          <FieldLabel>9 Megatrends ({megatrends.length})</FieldLabel>
          {megatrends.map((m, mi) => {
            const updateM = (nm: JsonObj) => {
              const n = [...megatrends];
              n[mi] = nm;
              patch({ megatrends: n });
            };
            return (
              <div
                key={mi}
                className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    value={str(m.title)}
                    onChange={(v) => updateM({ ...m, title: v })}
                    placeholder="Megatrend Title"
                  />
                  <Input
                    value={str(m.icon)}
                    onChange={(v) => updateM({ ...m, icon: v })}
                    placeholder="Icon SVG"
                  />
                </div>
                <Textarea
                  rows={2}
                  value={str(m.desc)}
                  onChange={(v) => updateM({ ...m, desc: v })}
                />
              </div>
            );
          })}
        </div>
        <div>
          <FieldLabel>Closing Paragraph</FieldLabel>
          <Textarea
            rows={2}
            value={str(content.closingParagraph)}
            onChange={(v) => patch({ closingParagraph: v })}
          />
        </div>
      </div>
    );
  } else if (tpl === "industry_overview") {
    const stats = arr<JsonObj>(content.stats);
    const wf = (content.workforceSection || {}) as JsonObj;
    const callouts = arr<JsonObj>(content.callouts);
    body = (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Page Title</FieldLabel>
            <Input
              value={str(content.title)}
              onChange={(v) => patch({ title: v })}
            />
          </div>
          <div>
            <FieldLabel>Hero SVG Path</FieldLabel>
            <Input
              value={str(content.heroImage)}
              onChange={(v) => patch({ heroImage: v })}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Intro Narrative (supports [[N]] citations)</FieldLabel>
          <Textarea
            rows={4}
            value={str(content.intro)}
            onChange={(v) => patch({ intro: v })}
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>4 Stat Cards ({stats.length})</FieldLabel>
          {stats.map((st, si) => {
            const updateSt = (nst: JsonObj) => {
              const n = [...stats];
              n[si] = nst;
              patch({ stats: n });
            };
            return (
              <div
                key={si}
                className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    value={str(st.icon)}
                    onChange={(v) => updateSt({ ...st, icon: v })}
                    placeholder="Icon Path"
                  />
                  <Input
                    value={str(st.type)}
                    onChange={(v) => updateSt({ ...st, type: v })}
                    placeholder="single or split"
                  />
                  <Input
                    value={str(st.suffix)}
                    onChange={(v) => updateSt({ ...st, suffix: v })}
                    placeholder="Suffix (+ or %)"
                  />
                </div>
                {str(st.type) === "split" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <Input
                      value={String(num(st.targetA))}
                      onChange={(v) =>
                        updateSt({ ...st, targetA: Number(v) || 0 })
                      }
                      placeholder="Target A"
                    />
                    <Input
                      value={String(num(st.targetB))}
                      onChange={(v) =>
                        updateSt({ ...st, targetB: Number(v) || 0 })
                      }
                      placeholder="Target B"
                    />
                    <Input
                      value={str(st.line1)}
                      onChange={(v) => updateSt({ ...st, line1: v })}
                      placeholder="Line 1"
                    />
                    <Input
                      value={str(st.line2)}
                      onChange={(v) => updateSt({ ...st, line2: v })}
                      placeholder="Line 2"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      value={String(num(st.target))}
                      onChange={(v) =>
                        updateSt({ ...st, target: Number(v) || 0 })
                      }
                      placeholder="Target Number"
                    />
                    <div className="sm:col-span-2">
                      <Input
                        value={str(st.description)}
                        onChange={(v) => updateSt({ ...st, description: v })}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
          <FieldLabel>Multidisciplinary Workforce Section</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              value={str(wf.title)}
              onChange={(v) =>
                patch({ workforceSection: { ...wf, title: v } })
              }
            />
            <Input
              value={str(wf.icon)}
              onChange={(v) =>
                patch({ workforceSection: { ...wf, icon: v } })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Textarea
              rows={3}
              value={str(wf.leftParagraph)}
              onChange={(v) =>
                patch({ workforceSection: { ...wf, leftParagraph: v } })
              }
            />
            <Textarea
              rows={3}
              value={str(wf.rightParagraph)}
              onChange={(v) =>
                patch({ workforceSection: { ...wf, rightParagraph: v } })
              }
            />
          </div>
        </div>
        <div>
          <FieldLabel>Datapoints Lead Line</FieldLabel>
          <Input
            value={str(content.datapointsLead)}
            onChange={(v) => patch({ datapointsLead: v })}
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Bottom Profile Callouts ({callouts.length})</FieldLabel>
          {callouts.map((co, ci) => (
            <div
              key={ci}
              className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  value={str(co.title)}
                  onChange={(v) => {
                    const n = [...callouts];
                    n[ci] = { ...co, title: v };
                    patch({ callouts: n });
                  }}
                />
                <Input
                  value={str(co.buttonLabel)}
                  onChange={(v) => {
                    const n = [...callouts];
                    n[ci] = { ...co, buttonLabel: v };
                    patch({ callouts: n });
                  }}
                />
                <Input
                  value={str(co.targetPageType)}
                  onChange={(v) => {
                    const n = [...callouts];
                    n[ci] = { ...co, targetPageType: v };
                    patch({ callouts: n });
                  }}
                />
              </div>
              <Textarea
                rows={2}
                value={str(co.description)}
                onChange={(v) => {
                  const n = [...callouts];
                  n[ci] = { ...co, description: v };
                  patch({ callouts: n });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  } else if (tpl === "state_territory") {
    const statesMap = (content.statesData || {}) as Record<string, JsonObj>;
    const stateCodes = Object.keys(statesMap);
    const activeCode = statesMap[activeStateCode]
      ? activeStateCode
      : stateCodes[0] || "NSW";
    const activeState = (statesMap[activeCode] || {}) as JsonObj;
    const updateActiveState = (nextS: JsonObj) => {
      patch({
        statesData: {
          ...statesMap,
          [activeCode]: nextS,
        },
      });
    };
    body = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <FieldLabel>Page Title</FieldLabel>
            <Input
              value={str(content.title)}
              onChange={(v) => patch({ title: v })}
            />
          </div>
          <div>
            <FieldLabel>ABS Source URL</FieldLabel>
            <Input
              value={str(content.absSourceUrl)}
              onChange={(v) => patch({ absSourceUrl: v })}
            />
          </div>
          <div>
            <FieldLabel>ALGA Survey URL</FieldLabel>
            <Input
              value={str(content.algaSurveyUrl)}
              onChange={(v) => patch({ algaSurveyUrl: v })}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {stateCodes.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setActiveStateCode(code)}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer border ${
                activeCode === code
                  ? "bg-[#8AC900] text-[#252D02] border-[#8AC900]"
                  : "bg-white text-[#416102] border-[#E5E8DA]"
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        {activeCode && (
          <div className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-3">
            <FieldLabel>Jurisdiction Profile: {activeCode}</FieldLabel>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                value={str(activeState.name)}
                onChange={(v) =>
                  updateActiveState({ ...activeState, name: v })
                }
                placeholder="State Name"
              />
              <Input
                value={String(activeState.employees ?? "")}
                onChange={(v) =>
                  updateActiveState({ ...activeState, employees: v })
                }
                placeholder="Employees (e.g. 58,900)"
              />
              <Input
                value={String(activeState.councils ?? "")}
                onChange={(v) =>
                  updateActiveState({
                    ...activeState,
                    councils: Number(v) || 0,
                  })
                }
                placeholder="Council Count"
              />
            </div>
            <StringListEditor
              label="Top 5 Occupational Shortages"
              items={arr<string>(activeState.topShortages)}
              onChange={(nextList) =>
                updateActiveState({ ...activeState, topShortages: nextList })
              }
              multiline={false}
              addLabel="Add Shortage"
            />
            <StringListEditor
              label="Local Government Specific Occupational Shortages"
              items={arr<string>(activeState.lgSpecificShortages)}
              onChange={(nextList) =>
                updateActiveState({
                  ...activeState,
                  lgSpecificShortages: nextList,
                })
              }
              multiline={false}
              addLabel="Add Specific Shortage"
            />
            <p className="text-[11px] text-[#6B7250]">
              To edit full OSL shortage comparison matrices (
              <code>oslTable</code>, <code>nationalOccupations</code>,{" "}
              <code>compareOccupations</code>), click{" "}
              <strong>Switch to Raw JSON</strong> above.
            </p>
          </div>
        )}
      </div>
    );
  } else if (tpl === "industry_profile") {
    const assetSec = (content.assetSection || {}) as JsonObj;
    const assetCards = arr<JsonObj>(assetSec.cards);
    body = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Page Title</FieldLabel>
            <Input
              value={str(content.title)}
              onChange={(v) => patch({ title: v })}
            />
          </div>
          <div>
            <FieldLabel>Hero Graphic Path</FieldLabel>
            <Input
              value={str(content.heroImage)}
              onChange={(v) => patch({ heroImage: v })}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Introduction</FieldLabel>
          <Textarea
            rows={2}
            value={str(content.intro)}
            onChange={(v) => patch({ intro: v })}
          />
        </div>
        <LgChartEditor
          label="Employment Growth Chart"
          chart={(content.growthChart || {}) as JsonObj}
          onChange={(nextC) => patch({ growthChart: nextC })}
        />
        <LgChartEditor
          label="VET Enrolments & Completions Chart"
          chart={(content.trainingChart || {}) as JsonObj}
          onChange={(nextC) => patch({ trainingChart: nextC })}
        />
        <div className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-3">
          <FieldLabel>Asset Management Section</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              value={str(assetSec.heading)}
              onChange={(v) =>
                patch({ assetSection: { ...assetSec, heading: v } })
              }
            />
            <Input
              value={str(assetSec.sourceMarkdown)}
              onChange={(v) =>
                patch({ assetSection: { ...assetSec, sourceMarkdown: v } })
              }
            />
          </div>
          {assetCards.map((ac, ai) => {
            const updateAc = (nac: JsonObj) => {
              const n = [...assetCards];
              n[ai] = nac;
              patch({ assetSection: { ...assetSec, cards: n } });
            };
            return (
              <div
                key={ai}
                className="p-3 rounded-lg bg-white border border-[#E5E8DA] grid grid-cols-1 sm:grid-cols-5 gap-2"
              >
                <Input
                  value={str(ac.topLabel)}
                  onChange={(v) => updateAc({ ...ac, topLabel: v })}
                  placeholder="Top Label"
                />
                <Input
                  value={str(ac.prefix)}
                  onChange={(v) => updateAc({ ...ac, prefix: v })}
                  placeholder="Prefix ($)"
                />
                <Input
                  value={String(num(ac.target))}
                  onChange={(v) =>
                    updateAc({ ...ac, target: Number(v) || 0 })
                  }
                  placeholder="Value"
                />
                <Input
                  value={str(ac.suffix)}
                  onChange={(v) => updateAc({ ...ac, suffix: v })}
                  placeholder="Suffix (%)"
                />
                <Input
                  value={str(ac.bottomLabel)}
                  onChange={(v) => updateAc({ ...ac, bottomLabel: v })}
                  placeholder="Bottom Label"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (tpl === "workforce_insights") {
    body = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Page Title</FieldLabel>
            <Input
              value={str(content.title)}
              onChange={(v) => patch({ title: v })}
            />
          </div>
          <div>
            <FieldLabel>Hero Image Path</FieldLabel>
            <Input
              value={str(content.heroImage)}
              onChange={(v) => patch({ heroImage: v })}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Introduction</FieldLabel>
          <Textarea
            rows={2}
            value={str(content.intro)}
            onChange={(v) => patch({ intro: v })}
          />
        </div>
        <LgThemesArrayEditor
          themes={arr<JsonObj>(content.themes)}
          onChange={(nextT) => patch({ themes: nextT })}
        />
      </div>
    );
  } else if (tpl === "insight_detail") {
    const leftCard = content.leftCard as JsonObj | undefined;
    const topLeftCard = content.topLeftCard as JsonObj | undefined;
    const rightInsightCard = content.rightInsightCard as JsonObj | undefined;
    const topRightInsightCard = content.topRightInsightCard as
      | JsonObj
      | undefined;
    const leftCards = arr<JsonObj>(content.leftCards);
    const rightInsightCards = arr<JsonObj>(content.rightInsightCards);
    const bottomCards = arr<JsonObj>(content.bottomCards);
    const shortagePanel = content.shortagePanel as JsonObj | undefined;
    const rightSection = content.rightSection as JsonObj | undefined;

    body = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <Input
              value={str(content.eyebrow)}
              onChange={(v) => patch({ eyebrow: v })}
            />
          </div>
          <div>
            <FieldLabel>Theme Title</FieldLabel>
            <Input
              value={str(content.themeTitle)}
              onChange={(v) => patch({ themeTitle: v })}
            />
          </div>
          <div>
            <FieldLabel>Accent Border Colour</FieldLabel>
            <Input
              value={str(content.accentBorderColor)}
              onChange={(v) => patch({ accentBorderColor: v })}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Headline</FieldLabel>
          <Textarea
            rows={2}
            value={str(content.headline)}
            onChange={(v) => patch({ headline: v })}
          />
        </div>

        {leftCard && (
          <div className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
            <FieldLabel>Left Card</FieldLabel>
            <Input
              value={str(leftCard.title)}
              onChange={(v) =>
                patch({ leftCard: { ...leftCard, title: v } })
              }
            />
            <Textarea
              rows={4}
              value={str(leftCard.paragraph)}
              onChange={(v) =>
                patch({ leftCard: { ...leftCard, paragraph: v } })
              }
            />
          </div>
        )}

        {topLeftCard && (
          <div className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
            <FieldLabel>Top Left Card</FieldLabel>
            <Input
              value={str(topLeftCard.title)}
              onChange={(v) =>
                patch({ topLeftCard: { ...topLeftCard, title: v } })
              }
            />
            <Textarea
              rows={3}
              value={str(topLeftCard.paragraph)}
              onChange={(v) =>
                patch({ topLeftCard: { ...topLeftCard, paragraph: v } })
              }
            />
          </div>
        )}

        {leftCards.length > 0 && (
          <div className="space-y-2">
            <FieldLabel>Left Cards ({leftCards.length})</FieldLabel>
            {leftCards.map((lc, li) => (
              <div
                key={li}
                className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
              >
                <Input
                  value={str(lc.title)}
                  onChange={(v) => {
                    const n = [...leftCards];
                    n[li] = { ...lc, title: v };
                    patch({ leftCards: n });
                  }}
                />
                <Textarea
                  rows={4}
                  value={str(lc.paragraph)}
                  onChange={(v) => {
                    const n = [...leftCards];
                    n[li] = { ...lc, paragraph: v };
                    patch({ leftCards: n });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {bottomCards.length > 0 && (
          <div className="space-y-2">
            <FieldLabel>Bottom Detail Cards ({bottomCards.length})</FieldLabel>
            {bottomCards.map((bc, bi) => (
              <div
                key={bi}
                className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
              >
                <Input
                  value={str(bc.title)}
                  onChange={(v) => {
                    const n = [...bottomCards];
                    n[bi] = { ...bc, title: v };
                    patch({ bottomCards: n });
                  }}
                />
                <Textarea
                  rows={3}
                  value={str(bc.paragraph)}
                  onChange={(v) => {
                    const n = [...bottomCards];
                    n[bi] = { ...bc, paragraph: v };
                    patch({ bottomCards: n });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {(rightInsightCard || topRightInsightCard) && (
          <div className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
            <FieldLabel>
              {rightInsightCard
                ? "Right Industry Insight Card"
                : "Top Right Industry Insight Card"}
            </FieldLabel>
            {(() => {
              const targetKey = rightInsightCard
                ? "rightInsightCard"
                : "topRightInsightCard";
              const targetObj = (rightInsightCard ||
                topRightInsightCard) as JsonObj;
              return (
                <>
                  <Input
                    value={str(targetObj.title)}
                    onChange={(v) =>
                      patch({ [targetKey]: { ...targetObj, title: v } })
                    }
                  />
                  <Textarea
                    rows={3}
                    value={str(targetObj.paragraph)}
                    onChange={(v) =>
                      patch({ [targetKey]: { ...targetObj, paragraph: v } })
                    }
                  />
                  {Array.isArray(targetObj.bullets) && (
                    <StringListEditor
                      label="Service Bullets"
                      items={arr<string>(targetObj.bullets)}
                      onChange={(nb) =>
                        patch({ [targetKey]: { ...targetObj, bullets: nb } })
                      }
                      multiline={false}
                      addLabel="Add Bullet"
                    />
                  )}
                </>
              );
            })()}
          </div>
        )}

        {rightInsightCards.length > 0 && (
          <div className="space-y-2">
            <FieldLabel>
              Right Industry Insight Cards ({rightInsightCards.length})
            </FieldLabel>
            {rightInsightCards.map((rc, ri) => (
              <div
                key={ri}
                className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
              >
                <Input
                  value={str(rc.title)}
                  onChange={(v) => {
                    const n = [...rightInsightCards];
                    n[ri] = { ...rc, title: v };
                    patch({ rightInsightCards: n });
                  }}
                />
                <Textarea
                  rows={3}
                  value={str(rc.paragraph)}
                  onChange={(v) => {
                    const n = [...rightInsightCards];
                    n[ri] = { ...rc, paragraph: v };
                    patch({ rightInsightCards: n });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {shortagePanel && (
          <div className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
            <FieldLabel>Jurisdictional Shortage Panel</FieldLabel>
            <Input
              value={str(shortagePanel.title)}
              onChange={(v) =>
                patch({ shortagePanel: { ...shortagePanel, title: v } })
              }
            />
            <Textarea
              rows={2}
              value={str(shortagePanel.intro)}
              onChange={(v) =>
                patch({ shortagePanel: { ...shortagePanel, intro: v } })
              }
            />
            {arr<JsonObj>(shortagePanel.states).map((st, si) => (
              <div
                key={si}
                className="p-2.5 rounded-lg bg-white border border-[#E5E8DA] grid grid-cols-1 sm:grid-cols-3 gap-2"
              >
                <Input
                  value={str(st.name)}
                  onChange={(v) => {
                    const ns = [...arr<JsonObj>(shortagePanel.states)];
                    ns[si] = { ...st, name: v };
                    patch({ shortagePanel: { ...shortagePanel, states: ns } });
                  }}
                />
                <div className="sm:col-span-2">
                  <Input
                    value={arr<string>(st.items).join(", ")}
                    onChange={(v) => {
                      const ns = [...arr<JsonObj>(shortagePanel.states)];
                      ns[si] = {
                        ...st,
                        items: v
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean),
                      };
                      patch({
                        shortagePanel: { ...shortagePanel, states: ns },
                      });
                    }}
                    placeholder="Comma separated shortages"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {rightSection && (
          <div className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
            <FieldLabel>Contextualisation Right Section</FieldLabel>
            <Input
              value={str(rightSection.heading)}
              onChange={(v) =>
                patch({ rightSection: { ...rightSection, heading: v } })
              }
            />
            <Textarea
              rows={2}
              value={str(rightSection.listIntro)}
              onChange={(v) =>
                patch({ rightSection: { ...rightSection, listIntro: v } })
              }
            />
            <StringListEditor
              label="Preference Bullets"
              items={arr<string>(rightSection.bullets)}
              onChange={(nb) =>
                patch({ rightSection: { ...rightSection, bullets: nb } })
              }
              addLabel="Add Bullet"
            />
            <Textarea
              rows={3}
              value={str(rightSection.closingParagraph)}
              onChange={(v) =>
                patch({
                  rightSection: { ...rightSection, closingParagraph: v },
                })
              }
              placeholder="Closing Paragraph"
            />
          </div>
        )}
      </div>
    );
  } else if (tpl === "workforce_strategies") {
    body = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <Input
              value={str(content.eyebrow)}
              onChange={(v) => patch({ eyebrow: v })}
            />
          </div>
          <div>
            <FieldLabel>Title Line 1</FieldLabel>
            <Input
              value={str(content.titleLine1)}
              onChange={(v) => patch({ titleLine1: v })}
            />
          </div>
          <div>
            <FieldLabel>Title Line 2</FieldLabel>
            <Input
              value={str(content.titleLine2)}
              onChange={(v) => patch({ titleLine2: v })}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Introduction</FieldLabel>
          <Textarea
            rows={2}
            value={str(content.intro)}
            onChange={(v) => patch({ intro: v })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <LgCtaPairEditor
            label="Previous Button"
            value={(content.prevCta || {}) as JsonObj}
            onChange={(v) => patch({ prevCta: v })}
          />
          <LgCtaPairEditor
            label="Next Button"
            value={(content.nextCta || {}) as JsonObj}
            onChange={(v) => patch({ nextCta: v })}
          />
        </div>
        <LgStrategiesArrayEditor
          strategies={arr<JsonObj>(content.strategies)}
          onChange={(nextS) => patch({ strategies: nextS })}
        />
      </div>
    );
  } else if (tpl === "update_2025_strategies") {
    const challengeCards = arr<JsonObj>(content.challengeCards);
    const projects = arr<JsonObj>(content.projects);
    body = (
      <div className="space-y-4">
        <div>
          <FieldLabel>Page Title</FieldLabel>
          <Input
            value={str(content.title)}
            onChange={(v) => patch({ title: v })}
          />
        </div>
        <div>
          <FieldLabel>Intro</FieldLabel>
          <Textarea
            rows={2}
            value={str(content.intro)}
            onChange={(v) => patch({ intro: v })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <LgCtaPairEditor
            label="Previous Button"
            value={(content.prevCta || {}) as JsonObj}
            onChange={(v) => patch({ prevCta: v })}
          />
          <LgCtaPairEditor
            label="Next Button"
            value={(content.nextCta || {}) as JsonObj}
            onChange={(v) => patch({ nextCta: v })}
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>3 Challenge Cards ({challengeCards.length})</FieldLabel>
          {challengeCards.map((c, ci) => (
            <div
              key={ci}
              className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={str(c.title)}
                  onChange={(v) => {
                    const n = [...challengeCards];
                    n[ci] = { ...c, title: v };
                    patch({ challengeCards: n });
                  }}
                />
                <Input
                  value={str(c.icon)}
                  onChange={(v) => {
                    const n = [...challengeCards];
                    n[ci] = { ...c, icon: v };
                    patch({ challengeCards: n });
                  }}
                />
              </div>
              <Textarea
                rows={2}
                value={str(c.text)}
                onChange={(v) => {
                  const n = [...challengeCards];
                  n[ci] = { ...c, text: v };
                  patch({ challengeCards: n });
                }}
              />
            </div>
          ))}
        </div>
        <div>
          <FieldLabel>Closing Transition Text</FieldLabel>
          <Textarea
            rows={2}
            value={str(content.closingIntro)}
            onChange={(v) => patch({ closingIntro: v })}
          />
        </div>
        <div className="space-y-3">
          <FieldLabel>2025 Projects ({projects.length})</FieldLabel>
          {projects.map((p, pi) => {
            const updateP = (np: JsonObj) => {
              const n = [...projects];
              n[pi] = np;
              patch({ projects: n });
            };
            return (
              <div
                key={pi}
                className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2.5"
              >
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={str(p.badge)}
                    onChange={(v) => updateP({ ...p, badge: v })}
                  />
                  <Input
                    value={str(p.borderColor)}
                    onChange={(v) => updateP({ ...p, borderColor: v })}
                  />
                </div>
                <Input
                  value={str(p.title)}
                  onChange={(v) => updateP({ ...p, title: v })}
                />
                <StringListEditor
                  label="Project Intro Paragraphs"
                  items={arr<string>(p.introParagraphs)}
                  onChange={(nextI) =>
                    updateP({ ...p, introParagraphs: nextI })
                  }
                  addLabel="Add Paragraph"
                />
                <Textarea
                  rows={2}
                  value={str(p.ministerialPriority)}
                  onChange={(v) =>
                    updateP({ ...p, ministerialPriority: v })
                  }
                  placeholder="Ministerial Priority"
                />
                <Textarea
                  rows={2}
                  value={str(p.strategicPlan)}
                  onChange={(v) => updateP({ ...p, strategicPlan: v })}
                  placeholder="Strategic Plan"
                />
                <Input
                  value={str(p.driversIntro)}
                  onChange={(v) => updateP({ ...p, driversIntro: v })}
                  placeholder="Drivers Intro"
                />
                <StringListEditor
                  label="Drivers Bullets"
                  items={arr<string>(p.driversBullets)}
                  onChange={(nb) => updateP({ ...p, driversBullets: nb })}
                  multiline={false}
                  addLabel="Add Driver"
                />
                <Textarea
                  rows={3}
                  value={str(p.nextSteps)}
                  onChange={(v) => updateP({ ...p, nextSteps: v })}
                  placeholder="Next Steps"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (tpl === "existing_strategies") {
    const items = arr<JsonObj>(content.strategies);
    body = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Page Title</FieldLabel>
            <Input
              value={str(content.title)}
              onChange={(v) => patch({ title: v })}
            />
          </div>
          <div>
            <FieldLabel>Hero Graphic Path</FieldLabel>
            <Input
              value={str(content.heroImage)}
              onChange={(v) => patch({ heroImage: v })}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Introduction</FieldLabel>
          <Textarea
            rows={2}
            value={str(content.intro)}
            onChange={(v) => patch({ intro: v })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <LgCtaPairEditor
            label="Previous Button"
            value={(content.prevCta || {}) as JsonObj}
            onChange={(v) => patch({ prevCta: v })}
          />
          <LgCtaPairEditor
            label="Next Button"
            value={(content.nextCta || {}) as JsonObj}
            onChange={(v) => patch({ nextCta: v })}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FieldLabel>
              Existing Industry-Sector Strategies ({items.length})
            </FieldLabel>
            <button
              type="button"
              onClick={() =>
                patch({
                  strategies: [
                    ...items,
                    {
                      id: Date.now(),
                      code: `${String(items.length + 1).padStart(2, "0")}-NATIONAL`,
                      title: "New Existing Strategy",
                      subtitle: "",
                      description: "",
                      impactItems: [
                        { title: "Consultation and engagement", description: "" },
                        { title: "2025 Workforce Strategies", description: "" },
                        { title: "2026 Workforce Strategies", description: "" },
                      ],
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Strategy
            </button>
          </div>
          {items.map((st, si) => {
            const updateSt = (nst: JsonObj) => {
              const n = [...items];
              n[si] = nst;
              patch({ strategies: n });
            };
            return (
              <div
                key={si}
                className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Input
                    value={str(st.code)}
                    onChange={(v) => updateSt({ ...st, code: v })}
                    placeholder="01-NATIONAL SURVEY"
                  />
                  <Input
                    value={str(st.subtitle)}
                    onChange={(v) => updateSt({ ...st, subtitle: v })}
                    placeholder="Organisation · Year"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      patch({
                        strategies: items.filter((_, i) => i !== si),
                      })
                    }
                    className="p-1.5 text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Input
                  value={str(st.title)}
                  onChange={(v) => updateSt({ ...st, title: v })}
                  placeholder="Title"
                />
                <Textarea
                  rows={3}
                  value={str(st.description)}
                  onChange={(v) => updateSt({ ...st, description: v })}
                  placeholder="Description (supports *italic*)"
                />
                {arr<JsonObj>(st.impactItems).map((imp, ii) => (
                  <div key={ii} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      value={str(imp.title)}
                      onChange={(v) => {
                        const ni = [...arr<JsonObj>(st.impactItems)];
                        ni[ii] = { ...imp, title: v };
                        updateSt({ ...st, impactItems: ni });
                      }}
                    />
                    <div className="sm:col-span-2">
                      <Textarea
                        rows={2}
                        value={str(imp.description)}
                        onChange={(v) => {
                          const ni = [...arr<JsonObj>(st.impactItems)];
                          ni[ii] = { ...imp, description: v };
                          updateSt({ ...st, impactItems: ni });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (tpl === "federal_initiatives") {
    const items = arr<JsonObj>(content.initiatives);
    body = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Page Title</FieldLabel>
            <Input
              value={str(content.title)}
              onChange={(v) => patch({ title: v })}
            />
          </div>
          <div>
            <FieldLabel>Hero Graphic Path</FieldLabel>
            <Input
              value={str(content.heroImage)}
              onChange={(v) => patch({ heroImage: v })}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Introduction</FieldLabel>
          <Textarea
            rows={2}
            value={str(content.intro)}
            onChange={(v) => patch({ intro: v })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <LgCtaPairEditor
            label="Previous Button"
            value={(content.prevCta || {}) as JsonObj}
            onChange={(v) => patch({ prevCta: v })}
          />
          <LgCtaPairEditor
            label="Next Button"
            value={(content.nextCta || {}) as JsonObj}
            onChange={(v) => patch({ nextCta: v })}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FieldLabel>
              Federal Government Initiatives ({items.length})
            </FieldLabel>
            <button
              type="button"
              onClick={() =>
                patch({
                  initiatives: [
                    ...items,
                    {
                      id: Date.now(),
                      number: String(items.length + 1).padStart(2, "0"),
                      title: "New Federal Initiative",
                      subtitle: "",
                      description: "",
                      impactDescription: "",
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8AC900] text-[#252D02] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Initiative
            </button>
          </div>
          {items.map((it, ii) => {
            const updateIt = (nit: JsonObj) => {
              const n = [...items];
              n[ii] = nit;
              patch({ initiatives: n });
            };
            return (
              <div
                key={ii}
                className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <Input
                    value={str(it.number)}
                    onChange={(v) => updateIt({ ...it, number: v })}
                    placeholder="01"
                  />
                  <Input
                    value={str(it.title)}
                    onChange={(v) => updateIt({ ...it, title: v })}
                    placeholder="Title"
                  />
                  <Input
                    value={str(it.subtitle)}
                    onChange={(v) => updateIt({ ...it, subtitle: v })}
                    placeholder="Agency / Year"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      patch({
                        initiatives: items.filter((_, i) => i !== ii),
                      })
                    }
                    className="text-red-600 text-xs font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <Textarea
                  rows={3}
                  value={str(it.description)}
                  onChange={(v) => updateIt({ ...it, description: v })}
                  placeholder="Overview Description"
                />
                <Textarea
                  rows={2}
                  value={str(it.impactDescription)}
                  onChange={(v) => updateIt({ ...it, impactDescription: v })}
                  placeholder="How This Informs PSA's Work"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (tpl === "looking_forward") {
    const cards = arr<JsonObj>(content.cards);
    body = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <Input
              value={str(content.eyebrow)}
              onChange={(v) => patch({ eyebrow: v })}
            />
          </div>
          <div>
            <FieldLabel>Page Title</FieldLabel>
            <Input
              value={str(content.title)}
              onChange={(v) => patch({ title: v })}
            />
          </div>
          <div>
            <FieldLabel>Hero Graphic Path</FieldLabel>
            <Input
              value={str(content.heroImage)}
              onChange={(v) => patch({ heroImage: v })}
            />
          </div>
        </div>
        <LgCtaPairEditor
          label="Previous Button"
          value={(content.prevCta || {}) as JsonObj}
          onChange={(v) => patch({ prevCta: v })}
        />
        <StringListEditor
          label="Intro Paragraphs"
          items={arr<string>(content.introParagraphs)}
          onChange={(np) => patch({ introParagraphs: np })}
          addLabel="Add Paragraph"
        />
        <div className="space-y-2">
          <FieldLabel>Line of Inquiry Cards ({cards.length})</FieldLabel>
          {cards.map((c, ci) => {
            const updateC = (nc: JsonObj) => {
              const n = [...cards];
              n[ci] = nc;
              patch({ cards: n });
            };
            return (
              <div
                key={ci}
                className="p-3 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    value={str(c.eyebrow)}
                    onChange={(v) => updateC({ ...c, eyebrow: v })}
                    placeholder="LINE OF INQUIRY 1"
                  />
                  <Input
                    value={str(c.icon)}
                    onChange={(v) => updateC({ ...c, icon: v })}
                    placeholder="Icon Path"
                  />
                  <Input
                    value={str(c.borderColor)}
                    onChange={(v) => updateC({ ...c, borderColor: v })}
                    placeholder="#9CAA54 or #046D2A"
                  />
                </div>
                <Input
                  value={str(c.title)}
                  onChange={(v) => updateC({ ...c, title: v })}
                  placeholder="Card Title"
                />
                {c.description !== undefined && (
                  <Textarea
                    rows={2}
                    value={str(c.description)}
                    onChange={(v) => updateC({ ...c, description: v })}
                    placeholder="Description"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div>
          <FieldLabel>Summary Callout Box Text</FieldLabel>
          <Textarea
            rows={2}
            value={str(content.summaryBoxText)}
            onChange={(v) => patch({ summaryBoxText: v })}
          />
        </div>
      </div>
    );
  } else if (tpl === "downloads") {
    const full = (content.fullReport || {}) as JsonObj;
    const prev = arr<JsonObj>(content.previousReports);
    body = (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <Input
              value={str(content.eyebrow)}
              onChange={(v) => patch({ eyebrow: v })}
            />
          </div>
          <div>
            <FieldLabel>Page Title</FieldLabel>
            <Input
              value={str(content.title)}
              onChange={(v) => patch({ title: v })}
            />
          </div>
          <div>
            <FieldLabel>Hero Graphic Path</FieldLabel>
            <Input
              value={str(content.heroImage)}
              onChange={(v) => patch({ heroImage: v })}
            />
          </div>
        </div>
        <LgCtaPairEditor
          label="Back Button"
          value={(content.prevCta || {}) as JsonObj}
          onChange={(v) => patch({ prevCta: v })}
        />
        <div className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
          <FieldLabel>Full Report Dark-Green Card</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Input
              value={str(full.badge)}
              onChange={(v) => patch({ fullReport: { ...full, badge: v } })}
              placeholder="FULL REPORT"
            />
            <Input
              value={str(full.title)}
              onChange={(v) => patch({ fullReport: { ...full, title: v } })}
              placeholder="Report Title"
            />
            <Input
              value={str(full.buttonLabel)}
              onChange={(v) =>
                patch({ fullReport: { ...full, buttonLabel: v } })
              }
              placeholder="Button Label"
            />
          </div>
          <Textarea
            rows={2}
            value={str(full.description)}
            onChange={(v) =>
              patch({ fullReport: { ...full, description: v } })
            }
          />
          <Input
            value={str(full.url)}
            onChange={(v) => patch({ fullReport: { ...full, url: v } })}
            placeholder="PDF URL"
          />
        </div>
        <div>
          <FieldLabel>Previous Reports Card Heading</FieldLabel>
          <Input
            value={str(content.previousHeading)}
            onChange={(v) => patch({ previousHeading: v })}
          />
        </div>
        <div className="space-y-2">
          <FieldLabel>Previous Report Links ({prev.length})</FieldLabel>
          {prev.map((pr, pi) => (
            <div key={pi} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                value={str(pr.year)}
                onChange={(v) => {
                  const n = [...prev];
                  n[pi] = { ...pr, year: v };
                  patch({ previousReports: n });
                }}
                placeholder="Year"
              />
              <Input
                value={str(pr.title)}
                onChange={(v) => {
                  const n = [...prev];
                  n[pi] = { ...pr, title: v };
                  patch({ previousReports: n });
                }}
                placeholder="Title"
              />
              <Input
                value={str(pr.url)}
                onChange={(v) => {
                  const n = [...prev];
                  n[pi] = { ...pr, url: v };
                  patch({ previousReports: n });
                }}
                placeholder="PDF URL"
              />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    body = (
      <p className="text-xs text-[#6B7250]">
        Unknown LG template <code>{tpl}</code>. Use{" "}
        <strong>Switch to Raw JSON</strong> above to inspect or edit.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {headerBar}
      {body}
    </div>
  );
}
