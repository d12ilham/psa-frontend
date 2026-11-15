"use client";

import { useState } from "react";
import { prisonCapacity } from "../data/prisonCapacity";

const series = [
  { year: "2022–23", color: "#424996" },
  { year: "2023–24", color: "#E0E4F1" },
  { year: "2024–25", color: "#AFB8DC" },
] as const;

export default function PrisonCapacityChart({ visible }: { visible: boolean }) {
  const [highlight, setHighlight] = useState<string | null>(null);
  return (
    <figure className="mt-2">
      <p className="text-[11px] text-[#667085]">Prison capacity utilisation · All prisons · Percentage</p>
      <div role="status" className="mt-3 min-h-8 text-sm font-semibold text-[#424996]">
        {highlight ?? "Hover over or focus a bar to view its exact percentage."}
      </div>
      <div className="overflow-x-auto">
        <svg viewBox="0 0 900 490" className="min-w-[620px] w-full" role="group" aria-label="Prison capacity utilisation by jurisdiction and financial year">
          <text x="20" y="240" transform="rotate(-90 20 240)" textAnchor="middle" fill="#252D02" fontSize="13">Percentage</text>
          {Array.from({ length: 11 }, (_, index) => 100 - index * 10).map((tick) => {
            const y = 42 + ((100 - tick) / 100) * 390;
            return <g key={tick}><line x1="82" x2="882" y1={y} y2={y} stroke="#E5E7EB" /><text x="72" y={y + 5} textAnchor="end" fill="#252D02" fontSize="15">{tick}%</text></g>;
          })}
          {prisonCapacity.map(({ jurisdiction, values }, index) => (
            <g key={jurisdiction}>
              {values.map((value, seriesIndex) => {
                const label = `${jurisdiction} · ${series[seriesIndex].year}: ${value.toFixed(1)}%`;
                return (
                  <rect key={series[seriesIndex].year}
                    x={95 + index * 100 + seriesIndex * 24} y={432 - value * 3.9} width="22" height={value * 3.9}
                    fill={series[seriesIndex].color} tabIndex={0} role="img" aria-label={label}
                    onMouseEnter={() => setHighlight(label)} onMouseLeave={() => setHighlight(null)}
                    onFocus={() => setHighlight(label)} onBlur={() => setHighlight(null)}
                    className="origin-bottom cursor-default transition-[transform,filter] duration-700 ease-out hover:brightness-90 focus:brightness-90 focus:outline focus:outline-2 focus:outline-[#424996] motion-reduce:transform-none motion-reduce:transition-none"
                    style={{ transformBox: "fill-box", transform: visible ? "scaleY(1)" : "scaleY(0)", transitionDelay: `${index * 55 + seriesIndex * 40}ms` }}
                  ><title>{label}</title></rect>
                );
              })}
              <text x={130 + index * 100} y="463" textAnchor="middle" fill="#252D02" fontSize="14">{jurisdiction}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-[#535862]">
        {series.map(({ year, color }) => <span key={year} className="inline-flex items-center gap-2"><i className="size-3" style={{ backgroundColor: color }} />{year}</span>)}
      </div>
      <figcaption className="mt-3 text-[11px] leading-5 text-[#68723E]">Source: Productivity Commission 2026, Report on Government Services, Justice Part C – 8 Corrective Services, Table 8A.15, All prisons. Underlying source: State and territory governments (unpublished).</figcaption>
    </figure>
  );
}
