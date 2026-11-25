import Image from "next/image";

const artworkPosition = {
  1: "object-left",
  2: "object-center",
  3: "object-right",
} as const;

export default function CorrectionalServicesInsightArtwork({ insight }: { insight: keyof typeof artworkPosition }) {
  return (
    <div className="size-[180px] shrink-0 self-center overflow-hidden rounded-full transition-transform duration-500 motion-safe:group-hover:scale-105 motion-reduce:transition-none xl:size-[220px]" aria-hidden="true">
      <Image
        src="/images/reports/correctional-workforce-insights-frame-436.svg"
        width={480}
        height={140}
        alt=""
        className={`size-full object-cover ${artworkPosition[insight]} animate-zoom-in motion-reduce:animate-none`}
      />
    </div>
  );
}
