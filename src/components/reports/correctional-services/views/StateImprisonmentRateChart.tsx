"use client";

import { useState } from "react";
import { stateImprisonmentRates } from "../data/imprisonmentRates";

const series = [
  { year: "December 2024", color: "#424996" },
  { year: "March 2025", color: "#AEB6D7" },
  { year: "June 2025", color: "#33439D" },
  { year: "September 2025", color: "#D6DBEC" },
  { year: "December 2025", color: "#8797C9" },
] as const;

export default function StateImprisonmentRateChart({ visible }: { visible: boolean }) {
  const [highlight, setHighlight] = useState<string | null>(null);
  return (
    <figure className="mt-2">
      <p className="text-[11px] text-[#667085]">Average daily imprisonment rate per 100,000 adult population</p>
      <div role="status" className="mt-3 min-h-8 text-sm font-semibold text-[#424996]">
        {highlight ?? "Hover over or focus a bar to view its exact rate."}
      </div>
      <div className="overflow-x-auto">
        <svg viewBox="0 0 900 490" className="min-w-[620px] w-full" role="group" aria-label="Average daily imprisonment rate by jurisdiction and quarter">
          <text x="20" y="240" transform="rotate(-90 20 240)" textAnchor="middle" fill="#252D02" fontSize="13">Rate per 100,000 adults</text>
          {Array.from({ length: 9 }, (_, index) => 1600 - index * 200).map((tick) => {
            const y = 42 + ((1600 - tick) / 1600) * 390;
            return <g key={tick}><line x1="82" x2="882" y1={y} y2={y} stroke="#E5E7EB" /><text x="72" y={y + 5} textAnchor="end" fill="#252D02" fontSize="15">{tick.toLocaleString("en-AU")}</text></g>;
          })}
          {stateImprisonmentRates.map(({ jurisdiction, values }, index) => (
            <g key={jurisdiction}>
              {values.map((value, seriesIndex) => {
                const label = `${jurisdiction} · ${series[seriesIndex].year}: ${value.toLocaleString("en-AU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} per 100,000 adults`;
                return (
                  <rect key={series[seriesIndex].year}
                    x={88 + index * 100 + seriesIndex * 17} y={432 - (value / 1600) * 390} width="15" height={(value / 1600) * 390}
                    fill={series[seriesIndex].color} tabIndex={0} role="img" aria-label={label}
                    onMouseEnter={() => setHighlight(label)} onMouseLeave={(event) => { if (document.activeElement !== event.currentTarget) setHighlight(null); }}
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
      <figcaption className="mt-3 text-[11px] leading-5 text-[#68723E]">Source: <a href="https://www.abs.gov.au/statistics/people/crime-and-justice/corrective-services-australia/dec-quarter-2025" target="_blank" rel="noreferrer" className="underline hover:text-[#424996]">Australian Bureau of Statistics, Corrective Services, Australia, December quarter 2025, Table 3</a>. Persons, including sex other or unknown; rates based on Estimated Resident Population.</figcaption>
    </figure>
  );
}
