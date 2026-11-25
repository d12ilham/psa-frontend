export interface ContrastResult {
  ratio: number;
  aaNormal: boolean; // >= 4.5:1
  aaLarge: boolean;  // >= 3.0:1
}

export interface CtaColours {
  primaryBg: string;
  primaryText: string;
  hoverBg: string;
  hoverText: string;
  downloadBg: string;
  downloadText: string;
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

export function normalizeHex(input: string, fallback = "#046D2A"): string {
  const cleaned = (input || "").trim();
  const match = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.exec(cleaned);
  if (!match) return fallback;
  let hex = match[1];
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return `#${hex.toUpperCase()}`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const norm = normalizeHex(hex).slice(1);
  return {
    r: parseInt(norm.slice(0, 2), 16),
    g: parseInt(norm.slice(2, 4), 16),
    b: parseInt(norm.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export function evaluateContrast(fgHex: string, bgHex: string): ContrastResult {
  const ratio = getContrastRatio(fgHex, bgHex);
  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
  };
}

export function blendWithWhite(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    255 - (255 - r) * amount,
    255 - (255 - g) * amount,
    255 - (255 - b) * amount
  );
}

export function deriveTints(primaryHex: string): {
  surfaceTint: string;
  borderTint: string;
} {
  return {
    surfaceTint: blendWithWhite(primaryHex, 0.08),
    borderTint: blendWithWhite(primaryHex, 0.28),
  };
}

export function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function resolvePageTheme(params: {
  paletteMode: string;
  subSectorCode?: string | null;
  sector: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    surfaceTint: string;
    borderTint: string;
    headerBg: string;
    subSectorsJson: string;
  };
  cta: CtaColours;
}): ResolvedThemeTokens {
  const mode =
    params.paletteMode === "GLOBAL_PSA" || params.paletteMode === "SUB_SECTOR"
      ? params.paletteMode
      : "SECTOR";

  // Audit PDF Page 3 Rule 9: All pages share the same PSA background colour (#FAFAF0).
  const basePageBg = "#FAFAF0";
  const psaNotesColor = "#598303";

  if (mode === "GLOBAL_PSA") {
    return {
      paletteMode: "GLOBAL_PSA",
      headerBg: "#252D02",
      primaryColor: "#699A05",
      secondaryColor: "#416102",
      accentColor: "#8AC900",
      surfaceTint: "#F0F5DF",
      borderTint: "#E5E8DA",
      notesColor: psaNotesColor,
      pageBg: basePageBg,
      cta: params.cta,
    };
  }

  if (mode === "SUB_SECTOR" && params.subSectorCode) {
    const subSectors = safeJsonParse<
      Array<{
        code: string;
        name: string;
        primaryColor: string;
        secondaryColor?: string;
        accentColor?: string;
        surfaceTint?: string;
        borderTint?: string;
      }>
    >(params.sector.subSectorsJson, []);

    const match = subSectors.find(
      (s) => s.code.toLowerCase() === params.subSectorCode!.toLowerCase()
    );
    if (match) {
      const derived = deriveTints(match.primaryColor);
      return {
        paletteMode: "SUB_SECTOR",
        subSectorCode: match.code,
        headerBg: params.sector.headerBg || "#252D02",
        primaryColor: match.primaryColor,
        secondaryColor: match.secondaryColor || match.primaryColor,
        accentColor: match.accentColor || match.primaryColor,
        surfaceTint: match.surfaceTint || derived.surfaceTint,
        borderTint: match.borderTint || derived.borderTint,
        notesColor: psaNotesColor,
        pageBg: basePageBg,
        cta: params.cta,
      };
    }
  }

  return {
    paletteMode: "SECTOR",
    headerBg: params.sector.headerBg || "#252D02",
    primaryColor: params.sector.primaryColor,
    secondaryColor: params.sector.secondaryColor,
    accentColor: params.sector.accentColor,
    surfaceTint: params.sector.surfaceTint,
    borderTint: params.sector.borderTint,
    notesColor: psaNotesColor,
    pageBg: basePageBg,
    cta: params.cta,
  };
}
