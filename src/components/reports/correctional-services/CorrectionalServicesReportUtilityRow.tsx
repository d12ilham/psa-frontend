import type { ReactNode } from "react";

export default function CorrectionalServicesReportUtilityRow({ children }: { children: ReactNode }) {
  return (
    <div data-correctional-services-report-utility className="flex w-full flex-wrap items-center justify-between gap-3 lg:flex-nowrap">
      <p className="min-w-0 max-w-full flex-none text-sm font-bold leading-5 text-gray800 sm:whitespace-nowrap">
        Correctional Services Workforce Insights Report
      </p>
      <nav aria-label="Report page navigation" className="ml-auto min-w-0 max-w-full lg:max-w-[65%] [&>div]:justify-end">
        {children}
      </nav>
    </div>
  );
}
