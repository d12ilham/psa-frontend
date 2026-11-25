"use client";

import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  getAdminSectors,
  getAdminSiteSettings,
  updateAdminSector,
  updateAdminSiteSettings,
  type CmsSector,
  type CmsSiteSettings,
} from "@/lib/cmsApi";
import { Check, Save, ShieldCheck, AlertTriangle } from "lucide-react";

export default function ThemeAndHomeAdminPage() {
  const [settings, setSettings] = useState<CmsSiteSettings | null>(null);
  const [sectors, setSectors] = useState<CmsSector[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState("");

  useEffect(() => {
    Promise.all([getAdminSiteSettings(), getAdminSectors()]).then(([s, secs]) => {
      setSettings(s);
      setSectors(secs);
    });
  }, []);

  const toast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(""), 2500);
  };

  const handleSaveGlobal = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await updateAdminSiteSettings({
        title: settings.title,
        description: settings.description,
        introVideoUrl: settings.introVideoUrl,
        ctaColours: settings.ctaColours,
        psaBrandPalette: settings.psaBrandPalette,
        homePageConfig: settings.homePageConfig,
      });
      setSettings(updated);
      toast("Global CTA colours & WIR Home settings updated across all DWIRs!");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSector = async (sector: CmsSector) => {
    const updated = await updateAdminSector(sector.id, {
      primaryColor: sector.primaryColor,
      secondaryColor: sector.secondaryColor,
      accentColor: sector.accentColor,
      surfaceTint: sector.surfaceTint,
      borderTint: sector.borderTint,
      subSectors: sector.subSectors,
    });
    setSectors((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    toast(`Updated colours for ${updated.name}`);
  };

  if (!settings) {
    return (
      <AdminShell title="Colours & WIR Home">
        <div className="p-8 bg-white rounded-2xl border border-[#E5E8DA] text-sm text-[#535862]">
          Loading theme settings...
        </div>
      </AdminShell>
    );
  }

  const homeCfg = settings.homePageConfig || {};
  const highlights = Array.isArray(homeCfg.highlights)
    ? (homeCfg.highlights as Array<{ title: string; description: string }>)
    : [];

  return (
    <AdminShell
      title="Global Colours, CTAs & WIR Home Page"
      subtitle="Audit pp. 3–14: Update CTA colours across all DWIRs, enforce PSA vs Sector colour rules, and manage WIR Home Page content."
      actions={
        <div className="flex items-center gap-2">
          {savedToast && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F0F5DF] text-[#416102] text-xs font-bold">
              <Check className="w-3.5 h-3.5" /> {savedToast}
            </span>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveGlobal}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#8AC900] hover:bg-[#699A05] hover:text-white text-[#252D02] text-xs font-bold cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Global Settings"}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Global CTA Colour Switcher (Audit pp. 3, 6-9) */}
        <section className="bg-white rounded-2xl border border-[#E5E8DA] p-6 space-y-5">
          <div>
            <h2 className="text-lg font-extrabold text-[#252D02]">
              Global CTA Colour Switcher (Applies Across All DWIRs)
            </h2>
            <p className="text-xs text-[#535862]">
              Audit specification: Primary CTA <code>#8AC900</code>, Hover <code>#699A05</code>, Download PDF &amp; Contact <code>#416102</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
              <div className="text-xs font-bold uppercase text-[#535862]">Primary CTA Button</div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.ctaColours.primaryBg}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ctaColours: { ...settings.ctaColours, primaryBg: e.target.value },
                    })
                  }
                  className="w-10 h-9 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={settings.ctaColours.primaryBg}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ctaColours: { ...settings.ctaColours, primaryBg: e.target.value },
                    })
                  }
                  className="flex-1 px-2.5 py-1.5 rounded border border-[#E5E8DA] text-xs font-mono bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#535862]">Text:</span>
                <input
                  type="text"
                  value={settings.ctaColours.primaryText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ctaColours: { ...settings.ctaColours, primaryText: e.target.value },
                    })
                  }
                  className="flex-1 px-2.5 py-1 rounded border border-[#E5E8DA] text-xs font-mono bg-white"
                />
              </div>
              <button
                type="button"
                className="px-4 py-1.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: settings.ctaColours.primaryBg,
                  color: settings.ctaColours.primaryText,
                }}
              >
                Choose your sector →
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
              <div className="text-xs font-bold uppercase text-[#535862]">Primary CTA Hover</div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.ctaColours.hoverBg}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ctaColours: { ...settings.ctaColours, hoverBg: e.target.value },
                    })
                  }
                  className="w-10 h-9 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={settings.ctaColours.hoverBg}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ctaColours: { ...settings.ctaColours, hoverBg: e.target.value },
                    })
                  }
                  className="flex-1 px-2.5 py-1.5 rounded border border-[#E5E8DA] text-xs font-mono bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#535862]">Text:</span>
                <input
                  type="text"
                  value={settings.ctaColours.hoverText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ctaColours: { ...settings.ctaColours, hoverText: e.target.value },
                    })
                  }
                  className="flex-1 px-2.5 py-1 rounded border border-[#E5E8DA] text-xs font-mono bg-white"
                />
              </div>
              <button
                type="button"
                className="px-4 py-1.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: settings.ctaColours.hoverBg,
                  color: settings.ctaColours.hoverText,
                }}
              >
                Hover Preview →
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
              <div className="text-xs font-bold uppercase text-[#535862]">Download PDF &amp; Contact</div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.ctaColours.downloadBg}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ctaColours: { ...settings.ctaColours, downloadBg: e.target.value },
                    })
                  }
                  className="w-10 h-9 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={settings.ctaColours.downloadBg}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ctaColours: { ...settings.ctaColours, downloadBg: e.target.value },
                    })
                  }
                  className="flex-1 px-2.5 py-1.5 rounded border border-[#E5E8DA] text-xs font-mono bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#535862]">Text:</span>
                <input
                  type="text"
                  value={settings.ctaColours.downloadText}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ctaColours: { ...settings.ctaColours, downloadText: e.target.value },
                    })
                  }
                  className="flex-1 px-2.5 py-1 rounded border border-[#E5E8DA] text-xs font-mono bg-white"
                />
              </div>
              <button
                type="button"
                className="px-4 py-1.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: settings.ctaColours.downloadBg,
                  color: settings.ctaColours.downloadText,
                }}
              >
                All sector reports (PDFs) ↓
              </button>
            </div>
          </div>
        </section>

        {/* WIR Home Page CMS Editor (Audit pp. 12-14) */}
        <section className="bg-white rounded-2xl border border-[#E5E8DA] p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-[#252D02]">
            WIR Home Page Content (CMS Template)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#535862] mb-1">
                Hero Title
              </label>
              <input
                type="text"
                value={String(homeCfg.heroTitle || "")}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    homePageConfig: { ...homeCfg, heroTitle: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#535862] mb-1">
                Launch Video Embed URL
              </label>
              <input
                type="text"
                value={settings.introVideoUrl}
                onChange={(e) =>
                  setSettings({ ...settings, introVideoUrl: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#E5E8DA] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.map((h, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-2">
                <input
                  type="text"
                  value={h.title}
                  onChange={(e) => {
                    const next = [...highlights];
                    next[idx] = { ...h, title: e.target.value };
                    setSettings({
                      ...settings,
                      homePageConfig: { ...homeCfg, highlights: next },
                    });
                  }}
                  className="w-full px-3 py-1.5 rounded border border-[#E5E8DA] text-sm font-bold bg-white"
                />
                <textarea
                  rows={2}
                  value={h.description}
                  onChange={(e) => {
                    const next = [...highlights];
                    next[idx] = { ...h, description: e.target.value };
                    setSettings({
                      ...settings,
                      homePageConfig: { ...homeCfg, highlights: next },
                    });
                  }}
                  className="w-full px-3 py-1.5 rounded border border-[#E5E8DA] text-xs bg-white"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Sector & Sub-Sector Colour Manager with WCAG AA validation */}
        <section className="bg-white rounded-2xl border border-[#E5E8DA] p-6 space-y-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#252D02]">
              Sector &amp; Sub-Sector Colours + WCAG AA Guardrails
            </h2>
            <p className="text-xs text-[#535862]">
              Controls sector accents while keeping the base PSA background <code>#FAFAF0</code> consistent across all DWIRs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectors.map((sec) => {
              const aaOk = sec.contrast?.whiteOnPrimary?.aaNormal ?? true;
              return (
                <div
                  key={sec.id}
                  className="p-4 rounded-xl border border-[#E5E8DA] bg-[#FAFAF0] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: sec.primaryColor }}
                      />
                      <span className="font-extrabold text-sm">{sec.name}</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        aaOk
                          ? "bg-[#F0F5DF] text-[#416102]"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {aaOk ? (
                        <ShieldCheck className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      Contrast {sec.contrast?.whiteOnPrimary?.ratio ?? "—"}:1
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-[#535862]">
                        Primary
                      </label>
                      <input
                        type="text"
                        value={sec.primaryColor}
                        onChange={(e) =>
                          setSectors((prev) =>
                            prev.map((s) =>
                              s.id === sec.id ? { ...s, primaryColor: e.target.value } : s
                            )
                          )
                        }
                        className="w-full px-2 py-1 rounded border border-[#E5E8DA] text-xs font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#535862]">
                        Secondary
                      </label>
                      <input
                        type="text"
                        value={sec.secondaryColor}
                        onChange={(e) =>
                          setSectors((prev) =>
                            prev.map((s) =>
                              s.id === sec.id ? { ...s, secondaryColor: e.target.value } : s
                            )
                          )
                        }
                        className="w-full px-2 py-1 rounded border border-[#E5E8DA] text-xs font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#535862]">
                        Surface Tint
                      </label>
                      <input
                        type="text"
                        value={sec.surfaceTint}
                        onChange={(e) =>
                          setSectors((prev) =>
                            prev.map((s) =>
                              s.id === sec.id ? { ...s, surfaceTint: e.target.value } : s
                            )
                          )
                        }
                        className="w-full px-2 py-1 rounded border border-[#E5E8DA] text-xs font-mono bg-white"
                      />
                    </div>
                  </div>

                  {sec.subSectors?.length > 0 && (
                    <div className="pt-2 border-t border-[#E5E8DA] space-y-1.5">
                      <div className="text-[10px] font-bold uppercase text-[#535862]">
                        Sub-Sectors (DEF / FES / POL)
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sec.subSectors.map((sub) => (
                          <span
                            key={sub.code}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E5E8DA] text-xs font-semibold"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: sub.primaryColor }}
                            />
                            {sub.code}: {sub.primaryColor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveSector(sec)}
                      className="px-3.5 py-1.5 rounded-full bg-[#252D02] text-white text-xs font-bold cursor-pointer hover:bg-[#416102]"
                    >
                      Save {sec.shortCode} Colours
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
