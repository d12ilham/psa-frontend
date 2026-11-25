"use client";

import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { SharedContentForm } from "@/components/admin/TemplateEditors";
import { getSharedTemplates, updateSharedTemplate } from "@/lib/cmsApi";
import { Save, Check } from "lucide-react";

type SharedItem = {
  id: string;
  key: string;
  title: string;
  content: Record<string, unknown>;
  updatedAt: string;
};

export default function SharedTemplatesAdminPage() {
  const [items, setItems] = useState<SharedItem[]>([]);
  const [activeKey, setActiveKey] = useState("about_psa");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    getSharedTemplates().then((res) => {
      setItems(res);
      if (res.length > 0 && !res.some((i) => i.key === activeKey)) {
        setActiveKey(res[0].key);
      }
    });
  }, []);

  const current = items.find((i) => i.key === activeKey);

  const handleSave = async () => {
    if (!current) return;
    setSaving(true);
    try {
      const updated = await updateSharedTemplate(current.key, {
        title: current.title,
        content: current.content,
      });
      setItems((prev) =>
        prev.map((it) => (it.key === updated.key ? { ...it, ...updated } : it))
      );
      setSavedMsg("Saved global shared template!");
      setTimeout(() => setSavedMsg(""), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Global Shared DWIR Templates"
      subtitle="Audit requirement: About PSA, Drivers of Change, and Federal Initiatives use PSA Green and are shared across all DWIR reports."
      actions={
        <div className="flex items-center gap-2">
          {savedMsg && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F0F5DF] text-[#416102] text-xs font-bold">
              <Check className="w-3.5 h-3.5" /> {savedMsg}
            </span>
          )}
          <button
            type="button"
            disabled={saving || !current}
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#8AC900] hover:bg-[#699A05] hover:text-white text-[#252D02] text-xs font-bold cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Shared Template"}</span>
          </button>
        </div>
      }
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActiveKey(item.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold border cursor-pointer transition-colors ${
              activeKey === item.key
                ? "bg-[#252D02] text-white border-[#252D02]"
                : "bg-white text-[#252D02] border-[#E5E8DA] hover:bg-[#F0F5DF]"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {current ? (
        <div className="bg-white rounded-2xl border border-[#E5E8DA] p-6">
          <SharedContentForm
            sharedKey={current.key}
            content={current.content}
            onChange={(nextContent) =>
              setItems((prev) =>
                prev.map((it) =>
                  it.key === current.key ? { ...it, content: nextContent } : it
                )
              )
            }
          />
        </div>
      ) : (
        <div className="p-8 bg-white rounded-2xl border border-[#E5E8DA] text-sm text-[#535862]">
          Loading shared templates...
        </div>
      )}
    </AdminShell>
  );
}
