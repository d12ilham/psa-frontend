"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus2,
  Palette,
  Layers,
  Link2,
  FolderOpen,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import {
  clearCmsSession,
  getCmsMe,
  getCmsToken,
  getCmsUser,
  type CmsUser,
} from "@/lib/cmsApi";

const NAV_ITEMS = [
  { href: "/admin", label: "Reports & Years", icon: LayoutDashboard },
  { href: "/admin/reports/new", label: "New Year / Clone", icon: FilePlus2 },
  { href: "/admin/shared", label: "Shared Templates", icon: Layers },
  { href: "/admin/theme", label: "Colours & Home", icon: Palette },
  { href: "/admin/sources", label: "Sources Library", icon: Link2 },
  { href: "/admin/media", label: "PDFs & Media", icon: FolderOpen },
];

export default function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CmsUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = getCmsToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    const cached = getCmsUser();
    if (cached) setUser(cached);

    getCmsMe()
      .then((res) => {
        setUser(res.user);
        setChecking(false);
      })
      .catch(() => {
        clearCmsSession();
        router.replace("/admin/login");
      });
  }, [router]);

  const handleLogout = () => {
    clearCmsSession();
    router.push("/admin/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#FAFAF0] flex items-center justify-center text-[#252D02]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#8AC900] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-[#535862]">
            Verifying CMS session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF0] text-[#252D02] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#252D02] text-white flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="no-underline text-white">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#B2DB79]">
              Public Skills Australia
            </div>
            <div className="text-base font-extrabold tracking-tight mt-0.5">
              DWIR CMS Admin
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white/70 hover:text-white cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === "/admin" ||
                  (pathname.startsWith("/admin/reports/") &&
                    pathname !== "/admin/reports/new")
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors ${
                  active
                    ? "bg-[#8AC900] text-[#252D02] font-bold"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            href="/reports"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white no-underline transition-colors"
          >
            <span>View Public Reports</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {user && (
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">{user.name}</div>
                <div className="flex items-center gap-1 text-[10px] text-[#B2DB79]">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{user.role}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#E5E8DA] px-4 sm:px-8 py-4 sticky top-0 z-30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg border border-[#E5E8DA] text-[#252D02] cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#252D02] leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-[#535862] mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {actions && <div className="flex items-center gap-2.5">{actions}</div>}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
