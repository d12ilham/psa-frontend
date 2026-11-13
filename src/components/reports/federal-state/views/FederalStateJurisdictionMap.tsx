"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X, ZoomOut } from "lucide-react";
import mapDataRaw from "@/data/australia_map_data.json";

// Approved jurisdiction reference: public-service headcounts and APS location
// counts are different measures. Never add or substitute one for the other.
export const JURISDICTION_WORKFORCE = {
  ACT: { name: "Australian Capital Territory", publicService: "31,825", aps: "70,221" },
  NSW: { name: "New South Wales", publicService: "84,780", aps: "33,646" },
  NT: { name: "Northern Territory", publicService: "25,786", aps: "2,255" },
  QLD: { name: "Queensland", publicService: "74,410", aps: "26,448" },
  SA: { name: "South Australia", publicService: "122,644", aps: "14,111" },
  TAS: { name: "Tasmania", publicService: "36,168", aps: "4,734" },
  VIC: { name: "Victoria", publicService: "58,169", aps: "35,679" },
  WA: { name: "Western Australia", publicService: "179,490", aps: "9,839" },
} as const;

type Jurisdiction = keyof typeof JURISDICTION_WORKFORCE;
type ViewBox = [number, number, number, number];
const mapData = mapDataRaw as unknown as {
  nationalViewBox: ViewBox;
  states: Record<string, { code: string; d: string; center: [number, number]; zoomViewBox: ViewBox; bounds: { minX: number; minY: number; width: number; height: number } }>;
};
const labelPositions: Record<string, [number, number]> = {
  WA: [215, 312], NT: [404, 205], SA: [427, 385], QLD: [572, 258],
  NSW: [602, 420], VIC: [575, 498], TAS: [538, 608], ACT: [733, 454],
};

export default function FederalStateJurisdictionMap({ initialJurisdiction }: { initialJurisdiction: Jurisdiction }) {
  const [selected, setSelected] = useState<Jurisdiction | "NATIONAL">(initialJurisdiction);
  const [popup, setPopup] = useState<Jurisdiction | null>(initialJurisdiction);
  const [viewBox, setViewBox] = useState<ViewBox>(mapData.nationalViewBox);
  const [settledSelection, setSettledSelection] = useState<Jurisdiction | "NATIONAL" | null>(null);
  const currentViewBox = useRef<ViewBox>(mapData.nationalViewBox);
  const popupId = useId();

  useEffect(() => {
    const target: ViewBox = selected === "NATIONAL" ? mapData.nationalViewBox
      : mapData.states[selected].zoomViewBox;
    const start = [...currentViewBox.current] as ViewBox;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSame = start.every((value, index) => Math.abs(value - target[index]) < 1);
    const duration = reducedMotion || isSame ? 0 : 950;
    let frame = 0;
    const started = performance.now();
    // Match the LG camera glide, then reveal the workforce figures.
    const step = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min((now - started) / duration, 1);
      const ease = 1 - (1 - progress) ** 3;
      const next = progress === 1 ? target
        : target.map((value, index) => +(start[index] + (value - start[index]) * ease).toFixed(2)) as ViewBox;
      currentViewBox.current = next;
      setViewBox(next);
      if (progress < 1) frame = requestAnimationFrame(step);
      else setSettledSelection(selected);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [selected]);

  const open = (code: Jurisdiction) => {
    if (code !== selected) setSettledSelection(null);
    setSelected(code);
    setPopup(code);
  };
  const info = popup ? JURISDICTION_WORKFORCE[popup] : null;
  const popupVisible = selected === "NATIONAL" || (settledSelection === selected && popup === selected);

  return (
    <div data-jurisdiction-map data-zoom-complete={settledSelection === selected} className="relative isolate overflow-hidden rounded-xl border border-[#E7E3DC] bg-[#FBF5F1] text-black" onKeyDown={(event) => { if (event.key === "Escape") setPopup(null); }}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4">
        <p className="text-base font-semibold">Select a state or territory on the map</p>
        <button type="button" onClick={() => { if (selected !== "NATIONAL") setSettledSelection(null); setSelected("NATIONAL"); setPopup(null); }} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#754C2D] bg-white px-3 text-sm font-semibold hover:bg-[#EED4C4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#754C2D]">
          <ZoomOut size={16} aria-hidden="true" /> Full Australia
        </button>
      </div>
      <svg viewBox={viewBox.join(" ")} role="group" aria-label="Interactive jurisdiction workforce map" className="block h-[350px] w-full sm:h-[460px]">
        {Object.values(mapData.states).map((state) => {
          const code = state.code as Jurisdiction;
          if (!(code in JURISDICTION_WORKFORCE)) return null;
          const [x, y] = labelPositions[code];
          const active = selected === code;
          return (
            <g key={code} role="button" tabIndex={0} aria-label={`View ${JURISDICTION_WORKFORCE[code].name} workforce`} aria-pressed={active} aria-controls={popupId}
              className="group cursor-pointer outline-none"
              onMouseEnter={() => { if (selected === "NATIONAL") setPopup(code); }}
              onMouseLeave={() => { if (selected === "NATIONAL") setPopup(null); }}
              onFocus={() => { if (selected === "NATIONAL") setPopup(code); }}
              onBlur={(event) => { if (selected === "NATIONAL" && !event.currentTarget.closest("[data-jurisdiction-map]")?.contains(event.relatedTarget)) setPopup(null); }}
              onClick={() => open(code)}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(code); } }}>
              <path d={state.d} fill={active ? "#754C2D" : "#EED4C4"} opacity={selected === "NATIONAL" || active ? 1 : 0.28}
                stroke={selected === "NATIONAL" ? "#FBF5F1" : "none"} strokeWidth={selected === "NATIONAL" ? 1.5 : 0} strokeLinejoin="round"
                className={`group-focus-visible:stroke-[#252b37] group-focus-visible:stroke-[3px] motion-safe:transition-[fill,opacity] motion-safe:duration-300 ${selected === "NATIONAL" ? "group-hover:fill-[#BBA295]" : ""}`} />
              {selected === "NATIONAL" && (
                <g aria-hidden="true">
                  {code === "ACT" && <path d={`M${state.center[0]} ${state.center[1]}L690 454H711`} stroke="#754C2D" strokeWidth="1.5" />}
                  <rect x={x - 25} y={y - 22} width="50" height="30" rx="15" fill="#EED4C4" />
                  <text x={x} y={y - 2} textAnchor="middle" fontSize="18" fontWeight="700" fill="black">{code}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {info && popup && (
        <section id={popupId} data-workforce-popup aria-label={`${info.name} workforce figures`} aria-live="polite" aria-hidden={!popupVisible} inert={!popupVisible}
          className={`relative z-10 m-3 rounded-xl border border-[#D9BCAF] bg-white/95 p-4 shadow-lg sm:absolute sm:bottom-3 sm:right-3 sm:m-0 sm:w-[290px] ${popupVisible ? "opacity-100 motion-safe:transition-opacity motion-safe:duration-500" : "pointer-events-none opacity-0 transition-none"}`}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold">{info.name}</h3>
            <button type="button" aria-label="Close workforce pop-up" onClick={() => setPopup(null)} className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-[#EED4C4] focus-visible:outline-2 focus-visible:outline-[#754C2D]"><X size={18} aria-hidden="true" /></button>
          </div>
          <dl className="mt-3 space-y-3">
            <div><dt className="text-base leading-6">State/Territory <span className="whitespace-nowrap">Public Service</span> employees</dt><dd data-public-service-count className="mt-1 text-3xl font-bold tabular-nums">{info.publicService}</dd></div>
            <div className="border-t border-[#E7E3DC] pt-3"><dt className="text-base leading-6">APS employees located here</dt><dd data-aps-count className="mt-1 text-3xl font-bold tabular-nums">{info.aps}</dd></div>
          </dl>
        </section>
      )}
    </div>
  );
}
