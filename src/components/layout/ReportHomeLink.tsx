import Link from "next/link";

export default function ReportHomeLink() {
  return (
    <Link
      href="/reports"
      className="hidden max-w-[135px] shrink-0 border-l border-white/20 pl-3 text-xs font-normal leading-4 text-[#85CC00] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:inline-block sm:text-sm xl:text-xs"
    >
      Workforce Insights Reports
    </Link>
  );
}
