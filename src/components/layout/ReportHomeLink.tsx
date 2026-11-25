import Link from "next/link";

export default function ReportHomeLink() {
  return (
    <Link
      href="/reports"
      className="block min-w-0 max-w-[135px] border-l border-white/20 pl-2 text-xs font-normal leading-4 text-[#85CC00] [overflow-wrap:anywhere] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:pl-3 sm:text-sm xl:text-xs"
    >
      Workforce Insights Reports
    </Link>
  );
}
