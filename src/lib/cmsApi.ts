export const CMS_API_BASE = (
  process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:4000/api/v1"
).replace(/\/$/, "");

export const STATIC_2026_SLUGS = new Set([
  "local-government-workforce-insights-report",
  "public-safety-wir-2026",
  "federal-state-territory-wir-2026",
  "correctional-services-wir-2026",
]);

export interface CtaColours {
  primaryBg: string;
  primaryText: string;
  hoverBg: string;
  hoverText: string;
  downloadBg: string;
  downloadText: string;
}

export interface ContrastResult {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
}

export interface SubSectorConfig {
  code: string;
  name: string;
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  surfaceTint?: string;
  borderTint?: string;
  contrastOnWhite?: ContrastResult;
  contrastOnSurface?: ContrastResult;
}

export interface CmsSector {
  id: string;
  code: string;
  slug: string;
  name: string;
  badgeText: string;
  shortCode: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceTint: string;
  borderTint: string;
  headerBg: string;
  defaultCoverImage: string;
  subSectors: SubSectorConfig[];
  contrast?: {
    whiteOnPrimary: ContrastResult;
    primaryOnPageBg: ContrastResult;
    primaryOnSurface: ContrastResult;
  };
}

export interface CmsSiteSettings {
  id?: string;
  title: string;
  description: string;
  logoLightUrl: string;
  logoDarkUrl: string;
  introVideoUrl: string;
  psaBrandPalette: Record<string, string>;
  ctaColours: CtaColours;
  ctaContrast?: {
    primary: ContrastResult;
    hover: ContrastResult;
    download: ContrastResult;
  };
  homePageConfig: Record<string, unknown>;
}

export interface PreviousPdfItem {
  year: string;
  title: string;
  url: string;
}

export interface CmsFootnote {
  number: number;
  text: string;
  sourceName: string;
  url?: string;
  openInNewTab?: boolean;
}

export interface CmsChapterPage {
  id: string;
  reportId: string;
  pageType: string;
  title: string;
  slug: string;
  sortOrder: number;
  isVisible: boolean;
  paletteMode: "GLOBAL_PSA" | "SECTOR" | "SUB_SECTOR";
  subSectorCode?: string | null;
  layoutVariant: string;
  content: Record<string, unknown>;
  footnotes: CmsFootnote[];
  updatedAt?: string;
}

export interface CmsReport {
  id: string;
  sectorId: string;
  year: number;
  title: string;
  slug: string;
  shortDescription: string;
  coverImageUrl: string;
  pdfFileUrl: string;
  previousPdfs: PreviousPdfItem[];
  psaSectorPageUrl: string;
  contactUrl: string;
  landingIntroDesc: string;
  landingExecDesc: string;
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  sector?: CmsSector;
  pages?: CmsChapterPage[];
  pagesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsSourceLink {
  id: string;
  label: string;
  sourceName: string;
  url: string;
  publisher: string;
  referenceYear: number;
  openInNewTab: boolean;
  status: string;
  lastCheckedAt?: string | null;
}

export interface CmsMediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  category: string;
  createdAt: string;
}

export interface ResolvedThemeTokens {
  paletteMode: "GLOBAL_PSA" | "SECTOR" | "SUB_SECTOR";
  subSectorCode?: string | null;
  headerBg: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceTint: string;
  borderTint: string;
  notesColor: string;
  pageBg: string;
  cta: CtaColours;
}

export interface CmsUser {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "EDITOR" | "REVIEWER";
}

export interface PublicReportLandingResponse {
  siteSettings: CmsSiteSettings;
  report: Omit<CmsReport, "sectorId">;
  sector: CmsSector;
  transitionContent: Record<string, unknown> | null;
  resolvedTheme: ResolvedThemeTokens;
  navigation: Array<{
    id: string;
    pageType: string;
    title: string;
    slug: string;
    sortOrder: number;
    paletteMode: string;
  }>;
}

export interface PublicReportPageResponse {
  siteSettings: CmsSiteSettings;
  report: Omit<CmsReport, "sectorId">;
  sector: CmsSector;
  page: CmsChapterPage & {
    linkedInsights?: Record<string, unknown> | null;
    linkedStrategies?: Record<string, unknown> | null;
    linkedInsightsMeta?: Record<string, unknown> | null;
  };
  resolvedTheme: ResolvedThemeTokens;
  navigation: Array<{
    id: string;
    pageType: string;
    title: string;
    slug: string;
    sortOrder: number;
    paletteMode: string;
  }>;
}

const TOKEN_KEY = "psa_cms_jwt";
const USER_KEY = "psa_cms_user";

export function getCmsToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getCmsUser(): CmsUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CmsUser;
  } catch {
    return null;
  }
}

export function setCmsSession(token: string, user: CmsUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearCmsSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function cmsFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (options.auth) {
    const token = getCmsToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const res = await fetch(`${CMS_API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (res.status === 401 && options.auth && typeof window !== "undefined") {
    clearCmsSession();
  }

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof payload?.error === "string"
        ? payload.error
        : `CMS API error (${res.status})`;
    throw new Error(msg);
  }
  return payload as T;
}

// Auth
export async function loginCms(email: string, password: string) {
  const data = await cmsFetch<{ token: string; user: CmsUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setCmsSession(data.token, data.user);
  return data;
}

export async function getCmsMe() {
  return cmsFetch<{ user: CmsUser }>("/auth/me", { auth: true });
}

// Site Settings & Theme
export async function getAdminSiteSettings() {
  return cmsFetch<CmsSiteSettings>("/site-settings", { auth: true });
}

export async function updateAdminSiteSettings(payload: Partial<CmsSiteSettings>) {
  return cmsFetch<CmsSiteSettings>("/site-settings", {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

// Sectors
export async function getAdminSectors() {
  return cmsFetch<CmsSector[]>("/sectors", { auth: true });
}

export async function updateAdminSector(
  id: string,
  payload: Partial<CmsSector> & { autoDeriveTints?: boolean }
) {
  return cmsFetch<CmsSector>(`/sectors/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

// Reports
export async function getAdminReports(params?: {
  year?: number;
  sectorId?: string;
  status?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.year) qs.set("year", String(params.year));
  if (params?.sectorId) qs.set("sectorId", params.sectorId);
  if (params?.status) qs.set("status", params.status);
  const q = qs.toString() ? `?${qs.toString()}` : "";
  return cmsFetch<CmsReport[]>(`/reports${q}`, { auth: true });
}

export async function getAdminReport(id: string) {
  return cmsFetch<CmsReport>(`/reports/${id}`, { auth: true });
}

export async function createAdminReport(payload: {
  sectorId: string;
  year: number;
  title: string;
  slug?: string;
  shortDescription?: string;
  pdfFileUrl?: string;
  status?: string;
  scaffoldTemplates?: boolean;
}) {
  return cmsFetch<CmsReport>("/reports", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function cloneAdminReport(
  id: string,
  payload: { targetYear: number; title?: string; slug?: string; status?: string }
) {
  return cmsFetch<CmsReport>(`/reports/${id}/clone`, {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateAdminReport(id: string, payload: Partial<CmsReport>) {
  return cmsFetch<CmsReport>(`/reports/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminReport(id: string) {
  return cmsFetch<{ deleted: boolean }>(`/reports/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

// Chapter Pages
export async function createChapterPage(
  reportId: string,
  payload: {
    pageType: string;
    title: string;
    paletteMode?: "GLOBAL_PSA" | "SECTOR" | "SUB_SECTOR";
    subSectorCode?: string | null;
  }
) {
  return cmsFetch<CmsChapterPage>(`/reports/${reportId}/pages`, {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateChapterPage(
  pageId: string,
  payload: Partial<CmsChapterPage>
) {
  return cmsFetch<CmsChapterPage>(`/pages/${pageId}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteChapterPage(pageId: string) {
  return cmsFetch<{ deleted: boolean }>(`/pages/${pageId}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function reorderChapterPages(reportId: string, pageIds: string[]) {
  return cmsFetch<CmsChapterPage[]>(`/reports/${reportId}/pages/reorder`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify({ pageIds }),
  });
}

// Shared Templates
export async function getSharedTemplates() {
  return cmsFetch<
    Array<{ id: string; key: string; title: string; content: Record<string, unknown>; updatedAt: string }>
  >("/shared-content", { auth: true });
}

export async function updateSharedTemplate(
  key: string,
  payload: { title?: string; content: Record<string, unknown> }
) {
  return cmsFetch<{ id: string; key: string; title: string; content: Record<string, unknown> }>(
    `/shared-content/${key}`,
    {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    }
  );
}

// Source Links
export async function getSourceLinks() {
  return cmsFetch<CmsSourceLink[]>("/sources", { auth: true });
}

export async function createSourceLink(payload: Partial<CmsSourceLink>) {
  return cmsFetch<CmsSourceLink>("/sources", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateSourceLink(id: string, payload: Partial<CmsSourceLink>) {
  return cmsFetch<CmsSourceLink>(`/sources/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteSourceLink(id: string) {
  return cmsFetch<{ deleted: boolean }>(`/sources/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function checkSourceLinks() {
  return cmsFetch<{ checked: number; sources: CmsSourceLink[] }>(
    "/sources/check-links",
    { method: "POST", auth: true }
  );
}

// Media
export async function getMediaAssets(category?: string) {
  const q = category ? `?category=${encodeURIComponent(category)}` : "";
  return cmsFetch<CmsMediaAsset[]>(`/media${q}`, { auth: true });
}

export async function uploadMediaAsset(file: File, category = "general") {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("category", category);
  return cmsFetch<CmsMediaAsset>("/media", {
    method: "POST",
    auth: true,
    body: fd,
  });
}

export async function deleteMediaAsset(id: string) {
  return cmsFetch<{ deleted: boolean }>(`/media/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

// Public Endpoints
export async function getPublicSiteSettings() {
  return cmsFetch<CmsSiteSettings>("/public/site-settings");
}

export async function getPublicReports(params?: {
  year?: number;
  includeAll?: boolean;
}) {
  const qs = new URLSearchParams();
  if (params?.year) qs.set("year", String(params.year));
  if (params?.includeAll) qs.set("includeAll", "1");
  const q = qs.toString() ? `?${qs.toString()}` : "";
  return cmsFetch<{ siteSettings: CmsSiteSettings; reports: CmsReport[] }>(
    `/public/reports${q}`
  );
}

export async function getPublicReport(slug: string, preview = false) {
  const q = preview ? "?preview=1" : "";
  return cmsFetch<PublicReportLandingResponse>(
    `/public/reports/${encodeURIComponent(slug)}${q}`
  );
}

export async function getPublicReportPage(
  slug: string,
  pageType: string,
  preview = false
) {
  const q = preview ? "?preview=1" : "";
  return cmsFetch<PublicReportPageResponse>(
    `/public/reports/${encodeURIComponent(slug)}/pages/${encodeURIComponent(pageType)}${q}`
  );
}
