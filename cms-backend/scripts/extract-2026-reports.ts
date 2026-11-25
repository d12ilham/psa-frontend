import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import ts from "typescript";
import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";
import { buildLocalGovernment2026Report } from "./lg-2026-content";

const ROOT_DIR = path.resolve(__dirname, "../..");
const OUT_FILE = path.resolve(__dirname, "../prisma/seed-data-2026.json");
const BASE_URL = "http://127.0.0.1:3099";

type JsonObj = Record<string, unknown>;

export interface ExtractedFootnote {
  number: number;
  text: string;
  sourceName: string;
  url?: string;
  openInNewTab?: boolean;
}

export type RichBlock =
  | {
      id: string;
      type: "narrative";
      badge?: string;
      subtitle?: string;
      title?: string;
      paragraphs: string[];
      bullets?: string[];
      orderedList?: string[];
      note?: string;
      subSections?: Array<{
        title: string;
        paragraphs?: string[];
        bullets?: string[];
      }>;
      cta?: { label: string; pageType: string };
    }
  | {
      id: string;
      type: "industry_insight";
      badge?: string;
      number?: string;
      title: string;
      paragraphs: string[];
      bullets?: string[];
    }
  | {
      id: string;
      type: "kpi_grid";
      title?: string;
      columns?: number;
      items: Array<{
        label: string;
        value: string;
        sublabel?: string;
        source?: string;
      }>;
    }
  | {
      id: string;
      type: "chart";
      title: string;
      subtitle?: string;
      chartType:
        | "bar"
        | "grouped_bar"
        | "horizontal_bar"
        | "line"
        | "line_target"
        | "stacked_bar"
        | "donut";
      labels: string[];
      series: Array<{
        name: string;
        color?: string;
        values: number[];
        dashed?: boolean;
      }>;
      valueSuffix?: string;
      note?: string;
      source?: string;
    }
  | {
      id: string;
      type: "table";
      title?: string;
      subtitle?: string;
      headers: string[];
      rows: string[][];
      source?: string;
      note?: string;
    }
  | {
      id: string;
      type: "link_cards";
      title?: string;
      subtitle?: string;
      columns?: number;
      cards: Array<{
        number?: string;
        eyebrow?: string;
        title: string;
        summary?: string;
        tags?: string[];
        pageType?: string;
        url?: string;
        ctaLabel?: string;
        accentColor?: string;
        overviewParagraphs?: string[];
        items?: Array<{
          number?: string;
          eyebrow?: string;
          title: string;
          summary?: string;
          pageType?: string;
        }>;
      }>;
    }
  | {
      id: string;
      type: "master_detail";
      listTitle?: string;
      items: Array<{
        code?: string;
        eyebrow?: string;
        title: string;
        badgeText?: string;
        summaryParagraphs: string[];
        bullets?: string[];
        detailSections?: Array<{
          heading: string;
          paragraphs: string[];
          bullets?: string[];
        }>;
        tags?: string[];
        ctaLabel?: string;
        ctaPageType?: string;
      }>;
    }
  | {
      id: string;
      type: "strategy_cards";
      columns?: number;
      items: Array<{
        sectorLabel?: string;
        color?: string;
        badge: string;
        title: string;
        intro?: string;
        workforceInsight?: string;
        jscFunction?: string;
        objective?: string;
        approach?: string[];
        deliverable?: string[];
        impact?: string;
        timing?: string;
        stakeholders?: string[];
        appendixPageType?: string;
        appendixLabel?: string;
      }>;
    }
  | {
      id: string;
      type: "accordions";
      title?: string;
      intro?: string;
      items: Array<{
        id: string;
        badge?: string;
        title: string;
        subtitle?: string;
        defaultOpen?: boolean;
        summaryParagraphs?: string[];
        bullets?: string[];
        sections?: Array<{
          heading: string;
          paragraphs?: string[];
          bullets?: string[];
        }>;
        blocks?: RichBlock[];
        cta?: { label: string; pageType: string };
      }>;
    }
  | {
      id: string;
      type: "state_explorer";
      title?: string;
      intro?: string;
      legendItems?: Array<{ code: string; label: string }>;
      defaultState?: string;
      states: Record<
        string,
        {
          code: string;
          name: string;
          employees?: string;
          councils?: number;
          facilities?: number;
          expenditure?: string;
          topShortages?: string[];
          oslTable?: Array<{
            occupation: string;
            stateShortage: string;
            nationalShortage: string;
          }>;
          lgSpecificShortages?: string[];
          metrics?: Array<{ label: string; value: string }>;
          headers?: string[];
          rows?: string[][];
        }
      >;
      nationalTableTitle?: string;
      nationalHeaders?: string[];
      nationalRows?: string[][];
      source?: string;
      note?: string;
    }
  | {
      id: string;
      type: "downloads_list";
      currentReportTitle?: string;
      currentReportDescription?: string;
      currentPdfUrl?: string;
      previousReports?: Array<{ year: string; title: string; url: string }>;
      referencesNote?: string;
    };

export interface ExtractedChapterPage {
  pageType: string;
  title: string;
  slug: string;
  sortOrder: number;
  isVisible: boolean;
  paletteMode: "GLOBAL_PSA" | "SECTOR" | "SUB_SECTOR";
  subSectorCode: string | null;
  layoutVariant: string;
  content: JsonObj;
  footnotes: ExtractedFootnote[];
}

export interface ExtractedReport {
  sectorCode: string;
  year: number;
  title: string;
  slug: string;
  shortDescription: string;
  coverImageUrl: string;
  pdfFileUrl: string;
  previousPdfs: Array<{ year: string; title: string; url: string }>;
  psaSectorPageUrl: string;
  contactUrl: string;
  landingIntroDesc: string;
  landingExecDesc: string;
  pages: ExtractedChapterPage[];
}

// =========================================================================
// 1. Server Lifecycle Helpers (Next.js Production SSR on port 3099)
// =========================================================================

async function isPortAlive(url: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    return res.status < 500;
  } catch {
    return false;
  }
}

async function ensureNextServer(): Promise<{
  reused: boolean;
  child: ChildProcess | null;
}> {
  if (await isPortAlive(`${BASE_URL}/reports`)) {
    return { reused: true, child: null };
  }

  const nextCli = path.join(ROOT_DIR, "node_modules", "next", "dist", "bin", "next");
  const child = spawn(
    process.execPath,
    [nextCli, "start", "-p", "3099", "-H", "127.0.0.1"],
    {
      cwd: ROOT_DIR,
      stdio: ["ignore", "pipe", "pipe"],
      detached: false,
    }
  );

  let stderrBuf = "";
  child.stderr?.on("data", (chunk) => {
    stderrBuf += String(chunk);
  });

  const startedAt = Date.now();
  while (Date.now() - startedAt < 45000) {
    if (child.exitCode !== null) {
      throw new Error(
        `Next.js SSR server exited early (code ${child.exitCode}): ${stderrBuf}`
      );
    }
    if (await isPortAlive(`${BASE_URL}/reports`)) {
      return { reused: false, child };
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  killProcessTree(child);
  throw new Error(
    `Timed out starting temporary Next.js SSR server on 3099. stderr: ${stderrBuf}`
  );
}

function killProcessTree(child: ChildProcess | null) {
  if (!child?.pid) return;
  try {
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      });
    } else {
      child.kill("SIGTERM");
    }
  } catch {
    // ignore cleanup failures
  }
}

async function fetchRouteHtml(routePath: string): Promise<string> {
  const res = await fetch(`${BASE_URL}${routePath}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${routePath}`);
  }
  return res.text();
}

// =========================================================================
// 2. Clean Text, Citation [[N]] & Source Extraction Helpers
// =========================================================================

function cleanSpace(str: string): string {
  return str
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, " ")
    .replace(/\n[ \t]+/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .replace(/(\[\[\d+\]\])([A-Za-z])/g, "$1 $2")
    .trim();
}

const BLOCK_LIKE_TAGS = new Set([
  "div",
  "p",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "section",
  "article",
  "header",
  "footer",
  "tr",
  "td",
  "th",
  "dt",
  "dd",
]);

function serializeInlineWithFootnotes(
  $: cheerio.CheerioAPI,
  el: cheerio.Cheerio<AnyNode>
): string {
  const collectRaw = (target: cheerio.Cheerio<AnyNode>): string => {
    let out = "";
    target.contents().each((_, node) => {
      if (node.type === "text") {
        const txt = (node as unknown as { data: string }).data;
        out += txt.replace(/\u00a0/g, " ").replace(/[\r\n\t ]+/g, " ");
        return;
      }
      if (node.type !== "tag") return;
      const tagEl = node as Element;
      const tag = tagEl.name?.toLowerCase() || "";
      if (tag === "br") {
        out += " ";
        return;
      }
      if (tag === "sup") {
        const supText = cleanSpace($(tagEl).text());
        const nums = supText.match(/\d+/g);
        if (nums && nums.length > 0 && supText.length <= 10) {
          out += nums.map((n) => `[[${n}]]`).join("");
        } else if (supText) {
          out += supText;
        }
        return;
      }
      if (tag === "svg" || tag === "script" || tag === "style") return;

      const childRaw = collectRaw($(tagEl));
      if (!childRaw.trim()) {
        out += childRaw;
        return;
      }

      const cls = $(tagEl).attr("class") || "";
      const isBlockLike =
        BLOCK_LIKE_TAGS.has(tag) ||
        /\b(block|flex|inline-flex|grid|rounded-full|badge)\b/.test(cls);
      const isSpacedSpan =
        tag === "span" &&
        /[A-Za-z0-9.:)]$/.test(out.trimEnd()) &&
        /^[A-Za-z0-9(]/.test(childRaw.trimStart()) &&
        (cls.trim().length > 0 || /[0-9.:)]$/.test(out.trimEnd()));

      if (isBlockLike || isSpacedSpan) {
        if (out && !/\s$/.test(out)) out += " ";
        out += childRaw.trim();
        out += " ";
      } else {
        out += childRaw;
      }
    });
    return out;
  };
  return cleanSpace(collectRaw(el).replace(/\s+/g, " "));
}

function extractTargetPageType(href: string | undefined, slug: string): string | undefined {
  if (!href) return undefined;
  const clean = href.split("#")[0].split("?")[0];
  const prefix = `/reports/${slug}/`;
  if (clean.startsWith(prefix)) {
    return clean.slice(prefix.length).replace(/\/$/, "");
  }
  const m = clean.match(/\/reports\/[^/]+\/([^/]+)$/);
  if (m) return m[1];
  return undefined;
}

function extractFootnotesFromCheerio(
  $: cheerio.CheerioAPI
): ExtractedFootnote[] {
  const byNum = new Map<number, ExtractedFootnote>();

  const parseLi = (liEl: Element, fallbackNum?: number) => {
    const $li = $(liEl);
    const idAttr = $li.attr("id") || "";
    const valAttr = $li.attr("value");
    const cloned = $li.clone();

    let num: number | undefined = fallbackNum;
    if (valAttr && /^\d+$/.test(valAttr.trim())) {
      num = Number(valAttr.trim());
    } else if (idAttr.match(/(\d+)$/)) {
      num = Number(idAttr.match(/(\d+)$/)![1]);
    }

    // Check first badge span inside li
    const firstChild = cloned.children().first();
    const firstText = cleanSpace(firstChild.text());
    if (
      firstChild.length &&
      /^(Footnote\s*)?\d+\.?$/i.test(firstText) &&
      firstText.length <= 16
    ) {
      if (num === undefined) {
        const m = firstText.match(/(\d+)/);
        if (m) num = Number(m[1]);
      }
      firstChild.remove();
    }

    let text = cleanSpace(cloned.text());
    const leadingNum = text.match(/^(\d{1,3})\s+(?=[A-Z“"'(])/);
    if (num === undefined && leadingNum) {
      num = Number(leadingNum[1]);
      text = text.slice(leadingNum[0].length).trim();
    }
    if (num === undefined) return;

    // Avoid duplicating prefix number if still at start
    if (text.startsWith(`${num} `) && !text.startsWith(`${num} ` + "0")) {
      const rest = text.slice(String(num).length).trim();
      if (/^[A-Za-z“"'(]/.test(rest)) text = rest;
    }

    const link = $li.find("a[href]").first();
    const url = link.attr("href");
    const safeUrl = url && url.startsWith("http") ? url : undefined;
    const sourceName =
      cleanSpace(link.text()) ||
      cleanSpace(text.split(",")[0] || "").slice(0, 120) ||
      `Source ${num}`;

    if (text) {
      byNum.set(num, {
        number: num,
        text,
        sourceName,
        url: safeUrl,
        openInNewTab: Boolean(safeUrl),
      });
    }
  };

  // Source sections & lists
  $(
    '[data-report-sources], section:has(> h2:contains("Sources")), section:has(> h2:contains("References")), div:has(> h2:contains("Sources")), div:has(> h3:contains("Sources")), [id^="footnote-"], ol[start]'
  ).each((_, sec) => {
    const $sec = $(sec);
    if ($sec.is('[id^="footnote-"]')) {
      const m = ($sec.attr("id") || "").match(/(\d+)/);
      const pText = cleanSpace($sec.find("p").text() || $sec.text());
      if (m && pText) {
        const num = Number(m[1]);
        byNum.set(num, {
          number: num,
          text: pText.replace(new RegExp(`^Footnote\\s*${num}\\s*`, "i"), "").trim(),
          sourceName: `Footnote ${num}`,
          openInNewTab: false,
        });
      }
      return;
    }
    const ols = $sec.is("ol") ? $sec : $sec.find("ol");
    ols.each((__, ol) => {
      const startAttr = Number($(ol).attr("start") || 1);
      $(ol)
        .children("li")
        .each((idx, li) => parseLi(li, startAttr + idx));
    });
  });

  // Also capture numbered source pills rendered outside <ol>
  $("li[id*='source-'], [id*='-source-']").each((_, el) => {
    if (el.name === "li") parseLi(el);
  });

  return Array.from(byNum.values()).sort((a, b) => a.number - b.number);
}

// =========================================================================
// 3. TypeScript AST + JSX-to-HTML Evaluator for Interactive/Hidden States
// =========================================================================

function loadTsFile(relPath: string): ts.SourceFile {
  const abs = path.join(ROOT_DIR, relPath);
  const src = fs.readFileSync(abs, "utf8");
  return ts.createSourceFile(abs, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

type EvalEnv = Record<string, unknown>;

function collectTopLevelVars(sf: ts.SourceFile, extraEnv: EvalEnv = {}): EvalEnv {
  const env: EvalEnv = { ...extraEnv };
  // Load local data imports if present in same sector
  for (const stmt of sf.statements) {
    if (ts.isImportDeclaration(stmt) && ts.isStringLiteral(stmt.moduleSpecifier)) {
      const modPath = stmt.moduleSpecifier.text;
      if (modPath.startsWith("@/data/") && modPath.endsWith(".json")) {
        const jsonAbs = path.join(ROOT_DIR, "src", modPath.slice(2));
        if (fs.existsSync(jsonAbs)) {
          const data = JSON.parse(fs.readFileSync(jsonAbs, "utf8"));
          const def = stmt.importClause?.name?.text;
          if (def) env[def] = data;
        }
      } else if (modPath.startsWith(".")) {
        const dir = path.dirname(sf.fileName);
        for (const ext of [".ts", ".json"]) {
          const candidate = path.resolve(dir, modPath + (modPath.endsWith(ext) ? "" : ext));
          if (fs.existsSync(candidate) && candidate.endsWith(".json")) {
            const def = stmt.importClause?.name?.text;
            if (def) env[def] = JSON.parse(fs.readFileSync(candidate, "utf8"));
          } else if (fs.existsSync(candidate) && candidate.endsWith(".ts")) {
            const subSf = ts.createSourceFile(
              candidate,
              fs.readFileSync(candidate, "utf8"),
              ts.ScriptTarget.Latest,
              true,
              ts.ScriptKind.TS
            );
            const subEnv = collectTopLevelVars(subSf, {});
            if (stmt.importClause?.namedBindings && ts.isNamedImports(stmt.importClause.namedBindings)) {
              for (const spec of stmt.importClause.namedBindings.elements) {
                const name = spec.name.text;
                const propName = spec.propertyName?.text || name;
                if (propName in subEnv) env[name] = subEnv[propName];
              }
            }
          }
        }
      }
    }
  }

  for (const stmt of sf.statements) {
    if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.initializer) {
          env[decl.name.text] = evalTsNode(decl.initializer, env);
        }
      }
    }
  }
  return env;
}

function getTopLevelFunctionBody(
  sf: ts.SourceFile,
  funcName?: string
): ts.Block | ts.Expression | undefined {
  for (const stmt of sf.statements) {
    if (ts.isFunctionDeclaration(stmt) && stmt.body) {
      const isDefault = stmt.modifiers?.some(
        (m) => m.kind === ts.SyntaxKind.DefaultKeyword
      );
      if ((funcName && stmt.name?.text === funcName) || (!funcName && isDefault)) {
        return stmt.body;
      }
    }
  }
  return undefined;
}

function evalTsNode(node: ts.Node | undefined, env: EvalEnv): unknown {
  if (!node) return undefined;

  if (
    ts.isStringLiteral(node) ||
    ts.isNoSubstitutionTemplateLiteral(node)
  ) {
    return node.text;
  }
  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (node.kind === ts.SyntaxKind.UndefinedKeyword) return undefined;

  if (ts.isTemplateExpression(node)) {
    let s = node.head.text;
    for (const span of node.templateSpans) {
      const val = evalTsNode(span.expression, env);
      s += String(val ?? "");
      s += span.literal.text;
    }
    return s;
  }

  if (ts.isIdentifier(node)) {
    return node.text in env ? env[node.text] : undefined;
  }

  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isTypeAssertionExpression(node) || ts.isSatisfiesExpression(node)) {
    return evalTsNode(node.expression, env);
  }

  if (ts.isPrefixUnaryExpression(node)) {
    const val = evalTsNode(node.operand, env);
    if (node.operator === ts.SyntaxKind.MinusToken) return -Number(val);
    if (node.operator === ts.SyntaxKind.ExclamationToken) return !val;
  }

  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((el) => {
      if (ts.isSpreadElement(el)) {
        const arr = evalTsNode(el.expression, env);
        return Array.isArray(arr) ? arr : [];
      }
      return evalTsNode(el, env);
    }).flatMap((v, idx) =>
      ts.isSpreadElement(node.elements[idx]) && Array.isArray(v) ? v : [v]
    );
  }

  if (ts.isObjectLiteralExpression(node)) {
    const obj: JsonObj = {};
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const key = ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name) || ts.isNumericLiteral(prop.name)
          ? prop.name.text
          : String(evalTsNode(prop.name, env));
        obj[key] = evalTsNode(prop.initializer, env);
      } else if (ts.isShorthandPropertyAssignment(prop)) {
        obj[prop.name.text] = env[prop.name.text];
      } else if (ts.isSpreadAssignment(prop)) {
        const sp = evalTsNode(prop.expression, env);
        if (sp && typeof sp === "object") Object.assign(obj, sp);
      }
    }
    return obj;
  }

  if (ts.isPropertyAccessExpression(node)) {
    const target = evalTsNode(node.expression, env);
    if (target && typeof target === "object") {
      return (target as JsonObj)[node.name.text];
    }
    if (typeof target === "string" && node.name.text === "length") {
      return target.length;
    }
    return undefined;
  }

  if (ts.isElementAccessExpression(node)) {
    const target = evalTsNode(node.expression, env);
    const key = evalTsNode(node.argumentExpression, env);
    if (Array.isArray(target) && typeof key === "number") return target[key];
    if (target && typeof target === "object" && key !== undefined) {
      return (target as JsonObj)[String(key)];
    }
    return undefined;
  }

  if (ts.isBinaryExpression(node)) {
    const op = node.operatorToken.kind;
    if (op === ts.SyntaxKind.AmpersandAmpersandToken) {
      const left = evalTsNode(node.left, env);
      return left ? evalTsNode(node.right, env) : false;
    }
    if (op === ts.SyntaxKind.BarBarToken) {
      const left = evalTsNode(node.left, env);
      return left ? left : evalTsNode(node.right, env);
    }
    if (op === ts.SyntaxKind.QuestionQuestionToken) {
      const left = evalTsNode(node.left, env);
      return left ?? evalTsNode(node.right, env);
    }
    const left = evalTsNode(node.left, env);
    const right = evalTsNode(node.right, env);
    switch (op) {
      case ts.SyntaxKind.EqualsEqualsEqualsToken:
      case ts.SyntaxKind.EqualsEqualsToken:
        return left === right;
      case ts.SyntaxKind.ExclamationEqualsEqualsToken:
      case ts.SyntaxKind.ExclamationEqualsToken:
        return left !== right;
      case ts.SyntaxKind.LessThanToken:
        return Number(left) < Number(right);
      case ts.SyntaxKind.LessThanEqualsToken:
        return Number(left) <= Number(right);
      case ts.SyntaxKind.GreaterThanToken:
        return Number(left) > Number(right);
      case ts.SyntaxKind.GreaterThanEqualsToken:
        return Number(left) >= Number(right);
      case ts.SyntaxKind.PlusToken:
        if (typeof left === "number" && typeof right === "number") return left + right;
        return String(left ?? "") + String(right ?? "");
      case ts.SyntaxKind.MinusToken:
        return Number(left) - Number(right);
      case ts.SyntaxKind.AsteriskToken:
        return Number(left) * Number(right);
      case ts.SyntaxKind.SlashToken:
        return Number(left) / Number(right);
      default:
        return undefined;
    }
  }

  if (ts.isConditionalExpression(node)) {
    const cond = evalTsNode(node.condition, env);
    return cond
      ? evalTsNode(node.whenTrue, env)
      : evalTsNode(node.whenFalse, env);
  }

  if (ts.isCallExpression(node)) {
    // Support arr.map(...) and arr.slice(...) and arr.filter(...) and String(...), Number(...)
    if (ts.isPropertyAccessExpression(node.expression)) {
      const prop = node.expression.name.text;
      const target = evalTsNode(node.expression.expression, env);
      if (Array.isArray(target)) {
        if (prop === "slice") {
          const a = evalTsNode(node.arguments[0], env) as number | undefined;
          const b = evalTsNode(node.arguments[1], env) as number | undefined;
          return target.slice(a, b);
        }
        if (prop === "map") {
          const fn = node.arguments[0];
          if (fn && (ts.isArrowFunction(fn) || ts.isFunctionExpression(fn))) {
            return target.map((item, index) => {
              const fnEnv = { ...env };
              const p0 = fn.parameters[0];
              const p1 = fn.parameters[1];
              if (p0) bindParam(p0.name, item, fnEnv);
              if (p1 && ts.isIdentifier(p1.name)) fnEnv[p1.name.text] = index;
              if (ts.isBlock(fn.body)) {
                for (const s of fn.body.statements) {
                  if (ts.isVariableStatement(s)) {
                    for (const d of s.declarationList.declarations) {
                      if (d.initializer) bindParam(d.name, evalTsNode(d.initializer, fnEnv), fnEnv);
                    }
                  }
                  if (ts.isReturnStatement(s) && s.expression) {
                    return evalTsNode(s.expression, fnEnv);
                  }
                }
                return "";
              }
              return evalTsNode(fn.body, fnEnv);
            });
          }
        }
        if (prop === "filter") {
          const fn = node.arguments[0];
          if (fn && (ts.isArrowFunction(fn) || ts.isFunctionExpression(fn))) {
            return target.filter((item, index) => {
              const fnEnv = { ...env };
              if (fn.parameters[0]) bindParam(fn.parameters[0].name, item, fnEnv);
              if (fn.parameters[1] && ts.isIdentifier(fn.parameters[1].name)) {
                fnEnv[fn.parameters[1].name.text] = index;
              }
              return Boolean(
                ts.isBlock(fn.body) ? true : evalTsNode(fn.body, fnEnv)
              );
            });
          }
        }
        if (prop === "join") {
          const sep = String(evalTsNode(node.arguments[0], env) ?? ",");
          return target.join(sep);
        }
      }
      if (typeof target === "string") {
        if (prop === "split") {
          return target.split(evalTsNode(node.arguments[0], env) as string);
        }
        if (prop === "replace") {
          return target.replace(
            evalTsNode(node.arguments[0], env) as string,
            evalTsNode(node.arguments[1], env) as string
          );
        }
      }
      if (ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "Object") {
        const arg = evalTsNode(node.arguments[0], env);
        if (arg && typeof arg === "object") {
          if (prop === "keys") return Object.keys(arg as object);
          if (prop === "values") return Object.values(arg as object);
          if (prop === "entries") return Object.entries(arg as object);
        }
      }
    }
    if (ts.isIdentifier(node.expression)) {
      const name = node.expression.text;
      if (name === "Number") return Number(evalTsNode(node.arguments[0], env));
      if (name === "String") return String(evalTsNode(node.arguments[0], env) ?? "");
      if (name === "Array" && node.arguments.length === 0) return [];
    }
    return undefined;
  }

  if (
    ts.isJsxElement(node) ||
    ts.isJsxSelfClosingElement(node) ||
    ts.isJsxFragment(node)
  ) {
    return jsxToHtmlString(node, env);
  }

  return undefined;
}

function bindParam(name: ts.BindingName, val: unknown, env: EvalEnv) {
  if (ts.isIdentifier(name)) {
    env[name.text] = val;
  } else if (ts.isArrayBindingPattern(name) && Array.isArray(val)) {
    name.elements.forEach((el, idx) => {
      if (ts.isBindingElement(el)) bindParam(el.name, val[idx], env);
    });
  } else if (ts.isObjectBindingPattern(name) && val && typeof val === "object") {
    name.elements.forEach((el) => {
      const propKey = el.propertyName && ts.isIdentifier(el.propertyName)
        ? el.propertyName.text
        : ts.isIdentifier(el.name)
          ? el.name.text
          : "";
      if (propKey) bindParam(el.name, (val as JsonObj)[propKey], env);
    });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readJsxProps(attrs: ts.JsxAttributes, env: EvalEnv): JsonObj {
  const props: JsonObj = {};
  for (const prop of attrs.properties) {
    if (!ts.isJsxAttribute(prop)) continue;
    const key = ts.isIdentifier(prop.name) ? prop.name.text : String(prop.name.getText());
    if (!prop.initializer) {
      props[key] = true;
    } else if (ts.isStringLiteral(prop.initializer)) {
      props[key] = prop.initializer.text;
    } else if (ts.isJsxExpression(prop.initializer) && prop.initializer.expression) {
      props[key] = evalTsNode(prop.initializer.expression, env);
    }
  }
  return props;
}

function jsxToHtmlString(node: ts.Node, env: EvalEnv): string {
  if (ts.isJsxText(node)) {
    return node.getFullText();
  }
  if (ts.isJsxExpression(node)) {
    if (!node.expression) return "";
    const val = evalTsNode(node.expression, env);
    if (val === false || val === null || val === undefined || val === true) return "";
    if (Array.isArray(val)) return val.map((v) => String(v ?? "")).join("");
    return String(val);
  }
  if (ts.isJsxFragment(node)) {
    return node.children.map((c) => jsxToHtmlString(c, env)).join("");
  }
  if (ts.isJsxSelfClosingElement(node)) {
    const tag = node.tagName.getText();
    const props = readJsxProps(node.attributes, env);
    if (tag === "br") return "<br />";
    if (tag === "PublicSafetyFootnoteLink" || tag === "Footnote" || tag === "NtFootnote" || tag === "SaFootnote" || tag === "QldFootnote") {
      return `<sup>${props.number ?? ""}</sup>`;
    }
    if (tag === "TrainingDeliveryCard") {
      const title =
        props.title ??
        (props.travel
          ? "Few TAFEs and RTOs are willing to travel to geographically isolated locations to deliver training:"
          : "Limited local TAFEs or RTOs to support training delivery");
      const body =
        props.body ??
        (props.travel
          ? "Few RTOs are willing or able to deliver tailored, in-community training, especially for niche or highly contextual skills. Regional, rural and remote local councils stressed the need for more RTOs experienced in delivering training in community settings and to First Nations learners. Stakeholders also indicated that for First Nations learners, some training may not offer an appropriate level of cultural sensitivity or access to translated materials and interpreters."
          : "Regional, rural and remote local councils face acute challenges in accessing suitable VET training. Further, some qualifications require supervision in the workplace as part of their delivery (e.g., mechanic apprenticeships), which is challenging for local councils. For example, some local councils reported having to contract external trainers to supervise apprentices or alternatively, employees having to travel significant distances for face-to-face instruction under supervision.");
      return `<div class="bg-white rounded-2xl border p-6"><h3>${escapeHtml(String(title))}</h3><p>${escapeHtml(String(body))}</p></div>`;
    }
    if (tag === "DesignLines" && Array.isArray(props.lines)) {
      return `<span>${(props.lines as string[]).map(escapeHtml).join(" ")}</span>`;
    }
    if (tag === "img" || tag === "Image") {
      return props.src
        ? `<img src="${escapeHtml(String(props.src))}" alt="${escapeHtml(String(props.alt ?? ""))}" />`
        : "";
    }
    return "";
  }
  if (ts.isJsxElement(node)) {
    const tag = node.openingElement.tagName.getText();
    const props = readJsxProps(node.openingElement.attributes, env);
    const inner = node.children.map((c) => jsxToHtmlString(c, env)).join("");

    if (tag === "PublicSafetySourceText") {
      return props.text ? String(props.text) : inner;
    }
    if (tag === "PublicSafetySourceLink" || tag === "SourceLink") {
      return props.href
        ? `<a href="${escapeHtml(String(props.href))}">${inner}</a>`
        : `<span>${inner}</span>`;
    }
    if (tag === "Link") {
      return `<a href="${escapeHtml(String(props.href ?? "#"))}">${inner}</a>`;
    }
    if (tag === "IndustryInsightCard") {
      return `<div data-industry-insight="true"><h3>Industry Insight</h3>${inner}</div>`;
    }
    if (tag === "Section") {
      return `<section data-collapsible-section="true"><h2>${escapeHtml(String(props.title ?? ""))}</h2>${inner}</section>`;
    }
    if (/^[a-z]/.test(tag)) {
      const attrs: string[] = [];
      for (const [k, v] of Object.entries(props)) {
        if (typeof v === "string" || typeof v === "number") {
          const attrName = k === "className" ? "class" : k;
          attrs.push(`${attrName}="${escapeHtml(String(v))}"`);
        }
      }
      const attrStr = attrs.length ? " " + attrs.join(" ") : "";
      return `<${tag}${attrStr}>${inner}</${tag}>`;
    }
    return inner;
  }
  return "";
}

function evalComponentBodyHtml(
  sf: ts.SourceFile,
  funcName: string | undefined,
  envOverrides: EvalEnv
): string {
  const env = collectTopLevelVars(sf, envOverrides);
  const body = getTopLevelFunctionBody(sf, funcName);
  if (!body) return "";
  if (ts.isBlock(body)) {
    for (const stmt of body.statements) {
      if (ts.isVariableStatement(stmt)) {
        for (const d of stmt.declarationList.declarations) {
          if (d.initializer) bindParam(d.name, evalTsNode(d.initializer, env), env);
        }
      }
      if (ts.isReturnStatement(stmt) && stmt.expression) {
        return String(evalTsNode(stmt.expression, env) ?? "");
      }
    }
    return "";
  }
  return String(evalTsNode(body, env) ?? "");
}

function getAstConst(relPath: string, constName: string): unknown {
  const sf = loadTsFile(relPath);
  const env = collectTopLevelVars(sf);
  return env[constName];
}

function getAstConstAnywhere(relPath: string, constName: string): unknown {
  const sf = loadTsFile(relPath);
  const env = collectTopLevelVars(sf);
  if (constName in env && env[constName] !== undefined) return env[constName];

  let found: unknown;
  const visit = (node: ts.Node) => {
    if (found !== undefined) return;
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.initializer) {
          env[decl.name.text] = evalTsNode(decl.initializer, env);
          if (decl.name.text === constName) {
            found = env[decl.name.text];
            return;
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(sf, visit);
  return found;
}

// =========================================================================
// 4. HTML Container -> Semantic RichBlocks Parser
// =========================================================================

function extractBlocksFromMainCheerio(
  $: cheerio.CheerioAPI,
  $root: cheerio.Cheerio<AnyNode>,
  slug: string,
  excludeSources = true
): {
  badge?: string;
  title?: string;
  leadParagraphs: string[];
  blocks: RichBlock[];
  footnotes: ExtractedFootnote[];
} {
  const footnotes = extractFootnotesFromCheerio($);
  const working = $root.clone();

  // Remove header/nav/footer/utility bars inside main
  working.find("ReportHeader, footer").remove();
  working.find("nav").each((_, nav) => {
    const txt = cleanSpace($(nav).text());
    if (
      /Back to|Previous|Next Section|Report Structure|Download PDF/i.test(txt) &&
      $(nav).find("h1, h2").length === 0
    ) {
      $(nav).remove();
    }
  });
  // Remove top utility nav button rows (LG / COR utility row)
  working.children().each((_, child) => {
    const $c = $(child);
    const txt = cleanSpace($c.text());
    if (
      $c.find("h1, h2, h3, p, table, svg").length === 0 &&
      /Back to|Next Section|Previous|Overview|Download/i.test(txt) &&
      txt.length < 300
    ) {
      $c.remove();
    }
  });

  if (excludeSources) {
    working
      .find(
        '[data-report-sources], section:has(> h2:contains("Sources")), div:has(> h2:contains("Sources"))'
      )
      .remove();
  }

  let badge: string | undefined;
  let title: string | undefined;
  const leadParagraphs: string[] = [];
  const blocks: RichBlock[] = [];
  let seq = 1;
  const nextId = (prefix: string) => `${prefix}-${seq++}`;

  const h1 = working.find("h1").first();
  if (h1.length) {
    title = serializeInlineWithFootnotes($, h1);
    const heroContainer = h1.closest("section, header, div.rounded-2xl, div.rounded-md, div.bg-white");
    if (heroContainer.length) {
      // Find pill/eyebrow inside hero
      heroContainer
        .find("span, p")
        .each((_, el) => {
          const $el = $(el);
          if ($el.is(h1) || $el.closest("h1").length) return;
          const cls = $el.attr("class") || "";
          const txt = serializeInlineWithFootnotes($, $el);
          if (!txt) return;
          if (
            !badge &&
            (cls.includes("rounded-full") ||
              cls.includes("uppercase") ||
              cls.includes("badge") ||
              cls.includes("eyebrow") ||
              /^(Theme|DRIVER|Project|DEF|FES|POL|CS|FSTG|LG)/i.test(txt)) &&
            txt.length < 80
          ) {
            badge = txt;
            return;
          }
        });

      heroContainer.find("p").each((_, p) => {
        const txt = serializeInlineWithFootnotes($, $(p));
        if (!txt || txt === badge) return;
        const cls = $(p).attr("class") || "";
        if (cls.includes("uppercase") && txt.length < 80) return;
        leadParagraphs.push(txt);
      });

      // Extract KPI cards inside hero if present
      const heroKpis: Array<{ label: string; value: string; source?: string }> = [];
      heroContainer.find("strong").each((_, st) => {
        const val = cleanSpace($(st).text());
        if (!val || val.length > 35 || !/[\d%$]/.test(val)) return;
        const card = $(st).parent();
        const cardClone = card.clone();
        cardClone.find("strong").remove();
        const lbl = serializeInlineWithFootnotes($, cardClone);
        if (lbl && lbl.length > 2) {
          heroKpis.push({ label: lbl.slice(0, 400), value: val });
        }
      });
      if (heroKpis.length >= 2) {
        blocks.push({
          id: nextId("kpi"),
          type: "kpi_grid",
          items: heroKpis,
        });
      }

      h1.remove();
      heroContainer.remove();
    }
  }

  // Recursive walker over remaining sections/containers
  const visitContainer = ($node: cheerio.Cheerio<AnyNode>) => {
    $node.children().each((_, el) => {
      if (el.type !== "tag") return;
      const $el = $(el);
      const tag = (el as Element).name?.toLowerCase();
      const fullText = cleanSpace($el.text());
      if (!fullText) return;

      // Skip navigation link strips
      if (
        $el.is("div, nav") &&
        $el.find("h1, h2, h3, h4, p, ul, ol, table").length === 0 &&
        /Back to|Previous Section|Next Section|Previous|Next/i.test(fullText) &&
        fullText.length < 220
      ) {
        return;
      }

      // Industry insight callout box
      const insightHeading = cleanSpace(
        $el.find("h2, h3, h4, strong, p.text-xs, span.text-xs").first().text()
      );
      const isIndustryInsight =
        $el.attr("data-industry-insight") === "true" ||
        (($el.attr("class") || "").includes("border-l-") &&
          /Industry Insight|Theme \w+, Insight/i.test(fullText));

      if (isIndustryInsight && $el.find("section").length === 0) {
        const paras: string[] = [];
        $el.find("p").each((__, p) => {
          const t = serializeInlineWithFootnotes($, $(p));
          if (t && t !== insightHeading && !/^Industry Insight$/i.test(t)) {
            paras.push(t);
          }
        });
        const bullets: string[] = [];
        $el.find("li").each((__, li) => {
          const t = serializeInlineWithFootnotes($, $(li));
          if (t) bullets.push(t);
        });
        const boxTitle =
          cleanSpace($el.find("h2, h3, h4").first().text()) || "Industry Insight";
        if (paras.length || bullets.length) {
          blocks.push({
            id: nextId("insight"),
            type: "industry_insight",
            title: boxTitle,
            paragraphs: paras,
            bullets: bullets.length ? bullets : undefined,
          });
          return;
        }
      }

      // Direct HTML table
      if (tag === "table" || ($el.find("table").length === 1 && $el.find("section, article").length === 0)) {
        const $tbl = tag === "table" ? $el : $el.find("table").first();
        const tblTitle = cleanSpace(
          $el.find("caption, h2, h3, h4").first().text()
        );
        const headers: string[] = [];
        $tbl.find("thead tr").first().find("th, td").each((__, cell) => {
          headers.push(serializeInlineWithFootnotes($, $(cell)));
        });
        const rows: string[][] = [];
        $tbl.find("tbody tr").each((__, tr) => {
          const row: string[] = [];
          $(tr).find("td, th").each((___, cell) => {
            row.push(serializeInlineWithFootnotes($, $(cell)));
          });
          if (row.some(Boolean)) rows.push(row);
        });
        if (headers.length === 0 && rows.length > 0 && $tbl.find("tr").first().find("th").length) {
          $tbl.find("tr").first().find("th").each((__, cell) => {
            headers.push(serializeInlineWithFootnotes($, $(cell)));
          });
        }
        if (rows.length > 0) {
          blocks.push({
            id: nextId("tbl"),
            type: "table",
            title: tblTitle || undefined,
            headers,
            rows,
          });
          return;
        }
      }

      // Standalone strategy / project / overview section or article without deeper sections
      const hasSubSections = $el.find("section, article, table, [data-profile-chart]").length > 0;
      if (!hasSubSections || tag === "section" || tag === "article") {
        // Check if this container holds multiple child cards inside a grid
        const childCards = $el.children("article, section, div.rounded-xl, div.rounded-2xl, div.rounded-md, div.border");
        if (hasSubSections && childCards.length >= 2 && $el.children("p").length === 0) {
          visitContainer($el);
          return;
        }

        // Check if it has a link-card list (`router.push` buttons or `<a>` cards)
        const cardLinks = $el.find("a[href*='/reports/']");
        if (
          cardLinks.length >= 2 &&
          $el.find("p").length <= cardLinks.length * 2 &&
          $el.find("ul, ol").length === 0
        ) {
          const secTitle = cleanSpace($el.children("h2, h3").first().text());
          const cards: Array<{
            title: string;
            summary?: string;
            pageType?: string;
            ctaLabel?: string;
          }> = [];
          cardLinks.each((__, a) => {
            const href = $(a).attr("href");
            const pageType = extractTargetPageType(href, slug);
            const h = cleanSpace($(a).find("h2, h3, h4, strong").first().text());
            const body = cleanSpace($(a).find("p").first().text());
            cards.push({
              title: h || cleanSpace($(a).text()),
              summary: body || undefined,
              pageType,
              ctaLabel: "Open",
            });
          });
          if (cards.length) {
            blocks.push({
              id: nextId("links"),
              type: "link_cards",
              title: secTitle || undefined,
              columns: Math.min(cards.length, 3),
              cards,
            });
            return;
          }
        }

        // Check if it's a pure wrapper div containing sections/articles
        if (tag === "div" && $el.find("section, article").length > 0 && $el.children("h2, h3, p").length === 0) {
          visitContainer($el);
          return;
        }

        // Extract narrative + sub-sections + bullets + dl + nested tables
        const blockHeading = cleanSpace($el.find("> h2, > h3, > div > h2").first().text());
        const paragraphs: string[] = [];
        const bullets: string[] = [];
        const orderedList: string[] = [];
        const subSections: Array<{ title: string; paragraphs?: string[]; bullets?: string[] }> = [];

        // If this section has child cards (e.g. Methodology steps or What We Do cards)
        const subArticles = $el.children().find("> article, > div > article, > div.grid > div");
        if (subArticles.length >= 2 && $el.children("p").length <= 2) {
          const introParas: string[] = [];
          $el.children("p").each((__, p) => {
            const t = serializeInlineWithFootnotes($, $(p));
            if (t) introParas.push(t);
          });
          if (blockHeading || introParas.length) {
            blocks.push({
              id: nextId("narr"),
              type: "narrative",
              title: blockHeading || undefined,
              paragraphs: introParas,
            });
          }
          subArticles.each((__, card) => {
            const $card = $(card);
            const cTitle = cleanSpace($card.find("h2, h3, h4, strong").first().text());
            const cParas: string[] = [];
            $card.find("p").each((___, p) => {
              const t = serializeInlineWithFootnotes($, $(p));
              if (t && t !== cTitle) cParas.push(t);
            });
            const cBullets: string[] = [];
            $card.find("li").each((___, li) => {
              const t = serializeInlineWithFootnotes($, $(li));
              if (t) cBullets.push(t);
            });
            if (cTitle || cParas.length || cBullets.length) {
              subSections.push({
                title: cTitle,
                paragraphs: cParas.length ? cParas : undefined,
                bullets: cBullets.length ? cBullets : undefined,
              });
            }
          });
          if (subSections.length) {
            blocks.push({
              id: nextId("narr"),
              type: "narrative",
              paragraphs: [],
              subSections,
            });
            return;
          }
        }

        // Collect elements inside this section in order
        $el.find("p, ul, ol, dl, h3, h4").each((__, item) => {
          const $item = $(item);
          if ($item.closest("table").length) return;
          if ($item.is("p")) {
            // Avoid duplicating list item text or heading text
            if ($item.closest("li, dt, dd").length) return;
            const txt = serializeInlineWithFootnotes($, $item);
            if (!txt) return;
            if (txt === badge || txt === title || txt === blockHeading) return;
            if (/^SOURCE/i.test(txt) && $item.attr("data-citation-copy") !== undefined) return;
            if (!paragraphs.includes(txt)) paragraphs.push(txt);
          } else if ($item.is("ul")) {
            $item.children("li").each((___, li) => {
              const txt = serializeInlineWithFootnotes($, $(li));
              if (txt && !bullets.includes(txt)) bullets.push(txt);
            });
          } else if ($item.is("ol")) {
            if ($item.closest("[data-report-sources]").length) return;
            $item.children("li").each((___, li) => {
              const txt = serializeInlineWithFootnotes($, $(li));
              if (txt && !orderedList.includes(txt)) orderedList.push(txt);
            });
          } else if ($item.is("dl")) {
            $item.children("div, dt").each((___, dEl) => {
              const dtTxt = $item.is("div")
                ? cleanSpace($(dEl).find("dt").text())
                : $(dEl).is("dt")
                  ? cleanSpace($(dEl).text())
                  : "";
              const ddTxt = $item.is("div")
                ? serializeInlineWithFootnotes($, $(dEl).find("dd"))
                : $(dEl).next("dd").length
                  ? serializeInlineWithFootnotes($, $(dEl).next("dd"))
                  : "";
              if (dtTxt || ddTxt) {
                paragraphs.push(dtTxt ? `${dtTxt} ${ddTxt}`.trim() : ddTxt);
              }
            });
          }
        });

        // Also handle nested tables separately
        const nestedTables = $el.find("table");
        if (blockHeading || paragraphs.length || bullets.length || orderedList.length) {
          blocks.push({
            id: nextId("narr"),
            type: "narrative",
            title: blockHeading || undefined,
            paragraphs,
            bullets: bullets.length ? bullets : undefined,
            orderedList: orderedList.length ? orderedList : undefined,
          });
        }
        nestedTables.each((__, tbl) => {
          const headers: string[] = [];
          $(tbl).find("thead tr").first().find("th, td").each((___, c) => {
            headers.push(serializeInlineWithFootnotes($, $(c)));
          });
          const rows: string[][] = [];
          $(tbl).find("tbody tr").each((___, tr) => {
            const row: string[] = [];
            $(tr).find("td, th").each((____, c) => {
              row.push(serializeInlineWithFootnotes($, $(c)));
            });
            if (row.some(Boolean)) rows.push(row);
          });
          if (rows.length) {
            blocks.push({
              id: nextId("tbl"),
              type: "table",
              headers,
              rows,
            });
          }
        });
        return;
      }

      visitContainer($el);
    });
  };

  visitContainer(working);

  return { badge, title, leadParagraphs, blocks, footnotes };
}

function makeRichPageFromHtml(
  html: string,
  pageType: string,
  fallbackTitle: string,
  slug: string,
  opts: {
    sortOrder: number;
    paletteMode?: "GLOBAL_PSA" | "SECTOR" | "SUB_SECTOR";
    subSectorCode?: string | null;
    extraBlocks?: RichBlock[];
    replaceBlocksWith?: RichBlock[];
    extraFootnotes?: ExtractedFootnote[];
    jurisdictionNav?: Array<{ code: string; pageType: string }>;
    insightPager?: {
      label: string;
      backPageType: string;
      backLabel: string;
      prevPageType?: string;
      prevLabel?: string;
      nextPageType?: string;
      nextLabel?: string;
    };
    prevNav?: { label: string; pageType: string };
    nextNav?: { label: string; pageType: string };
  }
): ExtractedChapterPage {
  const $ = cheerio.load(html);
  const $main = $("main").first().length ? $("main").first() : $("body").first();
  const parsed = extractBlocksFromMainCheerio($, $main, slug, true);

  const footnotesMap = new Map<number, ExtractedFootnote>();
  for (const fn of [...parsed.footnotes, ...(opts.extraFootnotes ?? [])]) {
    footnotesMap.set(fn.number, fn);
  }
  const footnotes = Array.from(footnotesMap.values()).sort(
    (a, b) => a.number - b.number
  );

  const blocks = opts.replaceBlocksWith
    ? opts.replaceBlocksWith
    : [...parsed.blocks, ...(opts.extraBlocks ?? [])];

  return {
    pageType,
    title: parsed.title || fallbackTitle,
    slug: pageType,
    sortOrder: opts.sortOrder,
    isVisible: true,
    paletteMode: opts.paletteMode ?? "SECTOR",
    subSectorCode: opts.subSectorCode ?? null,
    layoutVariant: "standard",
    content: {
      renderMode: "rich_page",
      badge: parsed.badge || undefined,
      headerTitle: parsed.title || fallbackTitle,
      leadParagraphs: parsed.leadParagraphs,
      jurisdictionNav: opts.jurisdictionNav,
      insightPager: opts.insightPager,
      prevNav: opts.prevNav,
      nextNav: opts.nextNav,
      blocks,
    },
    footnotes,
  };
}

// =========================================================================
// 5. Sector Extractors (SSR + AST Exact 2026 Static Content)
// =========================================================================

function buildMasterDetailFromArray(
  listTitle: string,
  items: Array<{
    code?: string;
    eyebrow?: string;
    title: string;
    badgeText?: string;
    summaryParagraphs: string[];
    bullets?: string[];
    detailSections?: Array<{
      heading: string;
      paragraphs: string[];
      bullets?: string[];
    }>;
    tags?: string[];
    ctaLabel?: string;
    ctaPageType?: string;
  }>
): RichBlock {
  return {
    id: "md-1",
    type: "master_detail",
    listTitle,
    items,
  };
}

function htmlFragmentToParagraphsAndBullets(htmlStr: string): {
  paragraphs: string[];
  bullets: string[];
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
} {
  const $ = cheerio.load(`<div id="root">${htmlStr}</div>`);
  const $root = $("#root");
  const paragraphs: string[] = [];
  const bullets: string[] = [];
  const sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }> = [];

  $root.find("[data-report-surface='neutral']").each((_, card) => {
    const heading = cleanSpace($(card).find("h4, h5").first().text());
    const cParas: string[] = [];
    const cBullets: string[] = [];
    $(card)
      .find("p")
      .each((__, p) => {
        const t = serializeInlineWithFootnotes($, $(p));
        if (t) cParas.push(t);
      });
    $(card)
      .find("li")
      .each((__, li) => {
        const t = serializeInlineWithFootnotes($, $(li));
        if (t) cBullets.push(t);
      });
    if (heading || cParas.length || cBullets.length) {
      sections.push({
        heading,
        paragraphs: cParas,
        bullets: cBullets.length ? cBullets : undefined,
      });
    }
    $(card).remove();
  });

  $root.find("p").each((_, p) => {
    const t = serializeInlineWithFootnotes($, $(p));
    if (t) paragraphs.push(t);
  });
  $root.find("li").each((_, li) => {
    const t = serializeInlineWithFootnotes($, $(li));
    if (t) bullets.push(t);
  });

  return { paragraphs, bullets, sections };
}

async function extractLocalGovernment(): Promise<ExtractedReport> {
  return buildLocalGovernment2026Report();
}

// ---------- FEDERAL & STATE/TERRITORY GOVERNMENT ----------

async function extractFederalState(): Promise<ExtractedReport> {
  const slug = "federal-state-territory-wir-2026";
  const pdfUrl =
    "https://psa-directus-prod.azurewebsites.net/assets/51b5fe57-c571-427b-ae72-917b57603b4b.pdf";
  const pages: ExtractedChapterPage[] = [];
  let sort = 0;

  const landingHtml = await fetchRouteHtml(`/reports/${slug}`);
  const $land = cheerio.load(landingHtml);
  pages.push({
    pageType: "transition",
    title: "Report Landing / Transition",
    slug: "transition",
    sortOrder: sort++,
    isVisible: true,
    paletteMode: "SECTOR",
    subSectorCode: null,
    layoutVariant: "standard",
    content: {
      eyebrow: "2026 • PUBLIC SKILLS AUSTRALIA",
      headline:
        cleanSpace($land("h1").first().text()) ||
        "Federal and State/Territory Government Workforce Insights Report",
      subheadline: "",
      promptText:
        "Choose how you explore the digital report; begin with the introduction for a comprehensive overview, or go straight to the executive summary for the key insights and strategies.",
      introCardTitle: "Introduction",
      introCardDescription:
        "For readers who want the report background — how it was developed, the methodology and the full report structure.",
      introButtonLabel: "Explore the Introduction",
      execCardTitle: "Executive Summary",
      execCardDescription:
        "Straight to the key insights and strategies — the workforce story on one page, built for large screens and briefings.",
      execButtonLabel: "Explore the Executive Summary",
      subSectorSectionTitle: "",
      subSectorCards: [],
    },
    footnotes: [],
  });

  for (const [pageType, title, paletteMode] of [
    ["introduction", "Introduction", "SECTOR"],
    ["about", "About Public Skills Australia", "GLOBAL_PSA"],
    ["methodology", "Methodology", "GLOBAL_PSA"],
    ["executive_summary", "Executive Summary", "SECTOR"],
  ] as const) {
    const html = await fetchRouteHtml(`/reports/${slug}/${pageType}`);
    pages.push(
      makeRichPageFromHtml(html, pageType, title, slug, {
        sortOrder: sort++,
        paletteMode,
      })
    );
  }

  // Drivers of Change
  {
    const html = await fetchRouteHtml(`/reports/${slug}/drivers_of_change`);
    const drivers = (getAstConst(
      "src/components/reports/federal-state/views/FederalStateDriversOfChangeView.tsx",
      "DRIVERS"
    ) || []) as Array<{
      id: number;
      number: string;
      fullTitle: string;
      fullDesc: string;
      sources: string;
    }>;
    const megatrends = (getAstConst(
      "src/components/reports/federal-state/views/FederalStateDriversOfChangeView.tsx",
      "MEGATRENDS"
    ) || []) as Array<{ title: string; desc: string }>;

    pages.push(
      makeRichPageFromHtml(html, "drivers_of_change", "Drivers of Change", slug, {
        sortOrder: sort++,
        paletteMode: "GLOBAL_PSA",
        extraBlocks: [
          {
            id: "fstg-drivers-acc",
            type: "accordions",
            title: "The four key drivers of change",
            intro: "Select any driver below to read the analysis and cited sources.",
            items: drivers.map((d) => ({
              id: `drv-${d.id}`,
              badge: d.number,
              title: d.fullTitle,
              defaultOpen: d.id === 1,
              summaryParagraphs: [
                htmlFragmentToParagraphsAndBullets(String(d.fullDesc)).paragraphs.join(
                  " "
                ) || cleanSpace(cheerio.load(`<div>${d.fullDesc}</div>`)("div").text()),
              ].filter(Boolean),
              sections: d.sources
                ? [{ heading: "Sources", paragraphs: [d.sources] }]
                : undefined,
            })),
          },
          {
            id: "fstg-megatrends",
            type: "link_cards",
            title: "Nine Megatrends",
            columns: 3,
            cards: megatrends.map((m, idx) => ({
              number: String(idx + 1),
              title: m.title,
              summary: m.desc,
            })),
          },
        ],
      })
    );
  }

  // Industry Overview (with Federal Employment Projections chart data)
  {
    const html = await fetchRouteHtml(`/reports/${slug}/industry_overview`);
    pages.push(
      makeRichPageFromHtml(
        html,
        "industry_overview",
        "Industry-Sector Overview",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SECTOR",
          extraBlocks: [
            {
              id: "fstg-io-proj",
              type: "chart",
              title: "Employment Projections – Federal Government",
              subtitle: "Public Administration and Safety",
              chartType: "line",
              labels: ["May 2025", "May 2030", "May 2035"],
              series: [
                {
                  name: "Projected Employment",
                  values: [202200, 219400, 230300],
                  color: "#754C2D",
                  dashed: true,
                },
              ],
            },
          ],
        }
      )
    );
  }

  // Industry Profile National + 8 Jurisdiction Profiles
  const jurisdictionCodes = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];
  const jNav = jurisdictionCodes.map((code) => ({
    code,
    pageType: `industry_profile_${code.toLowerCase()}`,
  }));

  {
    const html = await fetchRouteHtml(`/reports/${slug}/industry_profile`);
    const profileDetails = (getAstConst(
      "src/components/reports/federal-state/views/FederalStateIndustryProfileView.tsx",
      "profileDetails"
    ) || {}) as Record<
      string,
      {
        name: string;
        apsEmployees: string;
        publicServiceEmployees: string;
        publicServiceLabel: string;
        workforceCode: string;
      }
    >;
    const statesMap: Record<
      string,
      {
        code: string;
        name: string;
        employees: string;
        metrics: Array<{ label: string; value: string }>;
      }
    > = {};
    for (const code of jurisdictionCodes) {
      const pd = profileDetails[code];
      if (pd) {
        statesMap[code] = {
          code,
          name: pd.name,
          employees: pd.apsEmployees,
          metrics: [
            { label: "APS Employees", value: pd.apsEmployees },
            { label: pd.publicServiceLabel, value: pd.publicServiceEmployees },
          ],
        };
      }
    }

    pages.push(
      makeRichPageFromHtml(html, "industry_profile", "Industry Profile", slug, {
        sortOrder: sort++,
        paletteMode: "SECTOR",
        jurisdictionNav: jNav,
        extraBlocks: [
          {
            id: "fstg-national-map",
            type: "state_explorer",
            title: "Australian Public Service & Jurisdiction Public Services",
            intro:
              "Select any jurisdiction to inspect APS headcount alongside the State/Territory Public Service workforce, or open the full jurisdiction profile below.",
            defaultState: "ACT",
            states: statesMap,
            nationalTableTitle: "Workforce Distribution by Jurisdiction",
            nationalHeaders: [
              "Jurisdiction",
              "APS Employees",
              "Public Service Workforce",
            ],
            nationalRows: jurisdictionCodes.map((c) => [
              statesMap[c]?.name || c,
              statesMap[c]?.metrics[0]?.value || "",
              statesMap[c]?.metrics[1]?.value || "",
            ]),
          },
          {
            id: "fstg-nat-chart",
            type: "chart",
            title: "APS Employees by Jurisdiction (2025)",
            chartType: "bar",
            labels: jurisdictionCodes,
            series: [
              {
                name: "APS Employees",
                values: jurisdictionCodes.map((c) =>
                  Number((statesMap[c]?.employees || "0").replace(/,/g, ""))
                ),
                color: "#754C2D",
              },
            ],
            source: "Australian Government, State of the Service Report 2024–25, Table 13",
          },
        ],
      })
    );
  }

  // Exact chart datasets per jurisdiction profile page
  const stateChartConfigs: Record<string, RichBlock[]> = {
    ACT: [
      {
        id: "act-rep",
        type: "chart",
        title: "Aboriginal and Torres Strait Islander Representation in the ACT Public Service (2023–2025)",
        chartType: "line_target",
        labels: ["2023", "2024", "2025"],
        series: [
          { name: "Percentage (%)", values: [2.1, 2.1, 2.0], color: "#754D32", dashed: true },
          { name: "Target (%)", values: [3.0, 3.0, 3.0], color: "#A58D7B" },
        ],
        valueSuffix: "%",
        source: "ACT Government, State of the Service Reports: 2022–23, 2023–24, 2024–25, Table A.1",
      },
      {
        id: "act-gender",
        type: "chart",
        title: "ACT Public Service Workforce — Gender Breakdown",
        chartType: "donut",
        labels: ["Female", "Male", "Other / Unspecified"],
        series: [{ name: "Share (%)", values: [64.7, 34.8, 0.5] }],
        valueSuffix: "%",
      },
    ],
    NSW: [
      {
        id: "nsw-rep",
        type: "chart",
        title: "Aboriginal and Torres Strait Islander Representation in the NSW Public Sector",
        chartType: "line_target",
        labels: ["2021", "2022", "2023", "2024", "2025"],
        series: [
          { name: "Percentage (%)", values: [3.5, 3.6, 3.7, 3.7, 3.8], color: "#754D32" },
          { name: "Target (%)", values: [3.0, 3.0, 3.0, 3.0, 3.0], color: "#A58D7B", dashed: true },
        ],
        valueSuffix: "%",
      },
      {
        id: "nsw-gender",
        type: "chart",
        title: "New South Wales Public Sector Employees — Gender",
        chartType: "donut",
        labels: ["Female", "Male", "Non-binary / Other"],
        series: [{ name: "Share (%)", values: [66.6, 33.3, 0.1] }],
        valueSuffix: "%",
      },
    ],
    NT: [
      {
        id: "nt-gender",
        type: "chart",
        title: "Northern Territory Public Sector Workforce — Gender",
        chartType: "donut",
        labels: ["Female", "Male"],
        series: [{ name: "Share (%)", values: [64.8, 35.2] }],
        valueSuffix: "%",
      },
    ],
    QLD: [
      {
        id: "qld-rep",
        type: "chart",
        title: "Aboriginal and Torres Strait Islander Representation in the Queensland Public Sector (2021–2025)",
        chartType: "line_target",
        labels: ["2021", "2022", "2023", "2024", "2025"],
        series: [
          { name: "Percentage (%)", values: [2.5, 2.5, 2.6, 2.7, 2.7], color: "#754D32" },
          { name: "Target (%)", values: [3.0, 3.0, 4.0, 4.0, 4.0], color: "#A58D7B", dashed: true },
        ],
        valueSuffix: "%",
        source: "Queensland Government, State of the Sector Report, 2025, pg. 42",
      },
      {
        id: "qld-proj",
        type: "chart",
        title: "Queensland Employment Projections to 2035 - Public Administration and Safety Industry",
        chartType: "line",
        labels: ["2025", "2030", "2035"],
        series: [{ name: "Projected Employees", values: [187041, 202717, 219138], color: "#754D32" }],
        source: "Queensland Government, Regional employment projections data, Tables 2010-11 to 2040-41",
      },
    ],
    SA: [
      {
        id: "sa-rep",
        type: "chart",
        title: "Aboriginal and Torres Strait Islander Representation in the South Australian Public Sector (2021–2025)",
        chartType: "line",
        labels: ["2021", "2022", "2023", "2024", "2025"],
        series: [{ name: "Representation (%)", values: [2.09, 2.12, 2.2, 2.2, 2.25], color: "#754D32" }],
        valueSuffix: "%",
        source: "Government of South Australia, Workforce Information Report Data Dashboard, 2025",
      },
      {
        id: "sa-gender",
        type: "chart",
        title: "South Australian Public Sector Employees – Gender",
        chartType: "donut",
        labels: ["Female", "Male", "Other"],
        series: [{ name: "Share (%)", values: [69.6, 30.3, 0.1] }],
        valueSuffix: "%",
        source: "Government of South Australia, State of the Sector Report 2025, 2025, pg. 8",
      },
      {
        id: "sa-diversity",
        type: "chart",
        title: "Diversity in the South Australian Public Sector",
        chartType: "bar",
        labels: ["Employees with disability", "Culturally and linguistically diverse", "Aboriginal"],
        series: [{ name: "Share (%)", values: [1.5, 17.4, 2.3], color: "#754D32" }],
        valueSuffix: "%",
      },
    ],
    TAS: [
      {
        id: "tas-gender",
        type: "chart",
        title: "Tasmanian State Service Employees - Gender",
        chartType: "donut",
        labels: ["Female", "Male", "Other"],
        series: [{ name: "Share (%)", values: [71.6, 28.1, 0.3] }],
        valueSuffix: "%",
        source: "Tasmanian Government, Tasmanian State Service Annual Report 2024-25, 2025, pg. 11",
      },
      {
        id: "tas-div",
        type: "chart",
        title: "Diversity in the Tasmanian State Service",
        chartType: "bar",
        labels: [
          "Born overseas",
          "Speak language other than English",
          "LGBTQIA+",
          "Aboriginal",
          "Living with a disability",
        ],
        series: [{ name: "Share (%)", values: [8, 11, 6, 3, 8], color: "#754D32" }],
        valueSuffix: "%",
        source: "Tasmanian Government, 2024 TSS Employee Survey, 2024",
      },
      {
        id: "tas-aboriginal",
        type: "chart",
        title: "Tasmanian State Service Aboriginal Employment Level against Employment Target",
        chartType: "bar",
        labels: ["Target", "Current Aboriginal employment"],
        series: [{ name: "Share (%)", values: [3.5, 3.0], color: "#754D32" }],
        valueSuffix: "%",
        source: "Tasmanian Government, Tasmania State Service Aboriginal Employment Strategy to 2022",
      },
    ],
    VIC: [
      {
        id: "vic-gender",
        type: "chart",
        title: "Percentage of Employees in the Victorian Public Service by Gender (headcount)",
        chartType: "line",
        labels: ["2020", "2021", "2022", "2023", "2024"],
        series: [
          { name: "Female", values: [59, 58.5, 59.4, 60, 59.6], color: "#754D32" },
          { name: "Male", values: [40.9, 41.4, 40.3, 39.5, 39.8], color: "#A58D7B" },
          { name: "Self Described", values: [0.1, 0.1, 0.2, 0.2, 0.3], color: "#D9BFB1" },
        ],
        valueSuffix: "%",
        source: "Victorian Government, 2024 Workforce data - Age, gender and sexuality, 2024",
      },
      {
        id: "vic-rep",
        type: "chart",
        title: "Aboriginal and Torres Strait Islander Representation in the Victorian Public Service (2021–2024)",
        chartType: "line_target",
        labels: ["2021", "2022", "2023", "2024"],
        series: [
          { name: "Percentage (%)", values: [1.2, 1.2, 1.5, 1.6], color: "#754D32" },
          { name: "Target (%)", values: [2.0, 2.0, 2.0, 2.0], color: "#A58D7B", dashed: true },
        ],
        valueSuffix: "%",
        source: "Victorian Government, Workforce data 2024-25",
      },
      {
        id: "vic-growth",
        type: "chart",
        title: "10-Year Growth Rate for Top 10 Employed Occupations in Public Administration",
        chartType: "horizontal_bar",
        labels: [
          "Intelligence and Policy Analysts",
          "Human Resource Professionals",
          "Inspectors and Regulatory Officers",
          "Policy and Planning Managers",
          "Other Information and Organisation Professionals",
          "General Clerks",
          "Welfare, Recreation and Community Arts Workers",
          "Contract, Program and Project Administrators",
          "Information Officers",
          "Welfare Support Workers",
        ],
        series: [{ name: "10-Yr Growth (%)", values: [1.8, 1.6, 1.6, 1.6, 1.6, 1.4, 1.2, 0.9, 0.5, 0.2], color: "#754D32" }],
        valueSuffix: "%",
        source: "Victorian Skills Authority, Employment Projections Dashboard 2025-35",
      },
    ],
    WA: [
      {
        id: "wa-div",
        type: "chart",
        title: "Diversity in the Western Australia Public Sector - 2025",
        chartType: "bar",
        labels: [
          "Women",
          "Culturally and linguistically diverse",
          "Aboriginal and Torres Strait Islander",
          "Person with a disability",
          "Diverse sexualities and genders",
        ],
        series: [{ name: "Share (%)", values: [73.2, 18.5, 2.8, 1.7, 0.2], color: "#754D32" }],
        valueSuffix: "%",
        source: "Government of Western Australia, State of the WA Government Sector Workforce 2024-25",
      },
      {
        id: "wa-rep",
        type: "chart",
        title: "Proportion of Western Australia Public Sector Employees Who Identify as Aboriginal and Torres Strait Islander (2021–2025)",
        chartType: "line_target",
        labels: ["2021", "2022", "2023", "2024", "2025"],
        series: [
          { name: "Percentage (%)", values: [2.7, 2.8, 2.7, 2.8, 2.8], color: "#754D32" },
          { name: "Target (%)", values: [3.7, 3.7, 3.7, 3.7, 3.7], color: "#A58D7B", dashed: true },
        ],
        valueSuffix: "%",
        source: "Government of Western Australia, State of the WA Government Sector Workforce 2024-25, Figure 14",
      },
    ],
  };

  for (let i = 0; i < jurisdictionCodes.length; i++) {
    const code = jurisdictionCodes[i];
    const pageType = `industry_profile_${code.toLowerCase()}`;
    const html = await fetchRouteHtml(`/reports/${slug}/${pageType}`);
    pages.push(
      makeRichPageFromHtml(html, pageType, `${code} Workforce Profile`, slug, {
        sortOrder: sort++,
        paletteMode: "SECTOR",
        jurisdictionNav: jNav,
        extraBlocks: stateChartConfigs[code] || [],
        prevNav:
          i > 0
            ? { label: `${jurisdictionCodes[i - 1]} Workforce Overview`, pageType: `industry_profile_${jurisdictionCodes[i - 1].toLowerCase()}` }
            : { label: "National Industry Profile", pageType: "industry_profile" },
        nextNav:
          i < jurisdictionCodes.length - 1
            ? { label: `${jurisdictionCodes[i + 1]} Workforce Overview`, pageType: `industry_profile_${jurisdictionCodes[i + 1].toLowerCase()}` }
            : { label: "Workforce Insights", pageType: "workforce_insights" },
      })
    );
  }

  // Workforce Insights + 3 insight sub-pages
  {
    const html = await fetchRouteHtml(`/reports/${slug}/workforce_insights`);
    const theme = String(
      getAstConst(
        "src/components/reports/federal-state/workforceInsightsContent.ts",
        "workforceInsightsTheme"
      ) || "Future of the Public Service"
    );
    const summaries = (getAstConst(
      "src/components/reports/federal-state/workforceInsightsContent.ts",
      "workforceInsightSummaries"
    ) || []) as Array<{ title: string; summary: string }>;

    const base = makeRichPageFromHtml(
      html,
      "workforce_insights",
      "Workforce Insights",
      slug,
      {
        sortOrder: sort++,
        paletteMode: "SECTOR",
        replaceBlocksWith: [
          {
            id: "fstg-wfi-theme",
            type: "link_cards",
            title: "Overarching Theme",
            columns: 1,
            cards: [
              {
                eyebrow: "THEME 1 · 3 INSIGHTS",
                title: theme,
                overviewParagraphs: [
                  "ABS data indicates that the Federal and State/Territory Government public sector has increased between 2024-25 by 3.3 per cent.[[85]] According to Jobs and Skills Australia's employment projections, employment in the Public Administration industry group is projected to steadily grow over the next 10 years from the current baseline of 505,200 in May 2025 to 574,900 in May 2035.[[86]] These projections encompass government activities at the federal, state and territory levels only.[[87]] The future public service workforce will continue to have effects on national economic growth and productivity.",
                ],
                items: summaries.map((s, idx) => ({
                  number: String(idx + 1),
                  eyebrow: `Insight ${idx + 1}`,
                  title: s.title,
                  summary: s.summary,
                  pageType: `workforce_insight_${idx + 1}`,
                })),
              },
            ],
          },
        ],
      }
    );
    pages.push(base);

    for (const idx of [1, 2, 3]) {
      const pt = `workforce_insight_${idx}`;
      const subHtml = await fetchRouteHtml(`/reports/${slug}/${pt}`);
      pages.push(
        makeRichPageFromHtml(subHtml, pt, `Insight ${idx} — ${theme}`, slug, {
          sortOrder: sort++,
          paletteMode: "SECTOR",
          insightPager: {
            label: `Insight ${idx} of 3 · ${theme}`,
            backPageType: "workforce_insights",
            backLabel: "Back to Workforce Insights",
            prevPageType: idx > 1 ? `workforce_insight_${idx - 1}` : undefined,
            prevLabel: idx > 1 ? `Insight ${idx - 1}` : undefined,
            nextPageType: idx < 3 ? `workforce_insight_${idx + 1}` : "workforce_strategies",
            nextLabel: idx < 3 ? `Insight ${idx + 1}` : "Workforce Strategy",
          },
        })
      );
    }
  }

  // Proposed Strategies + Update 2025 Strategies + 3 Project Pages
  {
    const html = await fetchRouteHtml(`/reports/${slug}/workforce_strategies`);
    pages.push(
      makeRichPageFromHtml(
        html,
        "workforce_strategies",
        "2026 Proposed Federal and State/Territory Government Workforce Strategy",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SECTOR",
          replaceBlocksWith: [
            {
              id: "fstg-strat-1",
              type: "strategy_cards",
              columns: 1,
              items: [
                {
                  badge: "STRATEGY 1",
                  color: "#694834",
                  title: "Identify future skills needs for Federal and State/Territory Government",
                  workforceInsight: "Future of the Public Service",
                  jscFunction: "Industry Stewardship",
                  objective:
                    "To support the Federal and State/Territory public service in identifying future workforce skilling needs.",
                  approach: [
                    "Using a strategic-foresight approach, convene 'Future Skills for the Public Service' workshops to identify future skilling needs across jurisdictions to support clarifying emerging skills gaps and identify where nationally accredited VET can support capability development.",
                  ],
                  deliverable: ["Findings report"],
                  impact:
                    "To support the Federal and State/Territory Government public service by providing critical insight to the future needs of public service workforces which can support workforce planning.",
                  timing: "12-month project",
                  stakeholders: ["Public Sector Commissions or equivalent"],
                },
              ],
            },
          ],
        }
      )
    );
  }

  {
    const html = await fetchRouteHtml(`/reports/${slug}/update_2025_strategies`);
    const pNames = (getAstConst(
      "src/components/reports/federal-state/views/FederalStateUpdate2025StrategiesView.tsx",
      "projects"
    ) || []) as string[];
    const updPage = makeRichPageFromHtml(
      html,
      "update_2025_strategies",
      "Update on 2025 Strategies",
      slug,
      {
        sortOrder: sort++,
        paletteMode: "SECTOR",
        extraBlocks: [
          {
            id: "fstg-upd-projects",
            type: "link_cards",
            title: "2024 Workforce Plan Project Updates",
            columns: 1,
            cards: pNames.map((name, i) => ({
              number: String(i + 1),
              eyebrow: `PROJECT ${i + 1}`,
              title: name,
              pageType: `update_2025_project_${i + 1}`,
              ctaLabel: "Open",
            })),
          },
        ],
      }
    );
    pages.push(updPage);

    for (const idx of [1, 2, 3]) {
      const pt = `update_2025_project_${idx}`;
      const pHtml = await fetchRouteHtml(`/reports/${slug}/${pt}`);
      pages.push(
        makeRichPageFromHtml(
          pHtml,
          pt,
          pNames[idx - 1] || `Project ${idx}`,
          slug,
          {
            sortOrder: sort++,
            paletteMode: "SECTOR",
            prevNav: {
              label: "Update on 2025 Strategies",
              pageType: "update_2025_strategies",
            },
            nextNav: {
              label: "Existing Industry-Sector Strategies",
              pageType: "existing_strategies",
            },
          }
        )
      );
    }
  }

  // Existing Industry-Sector Strategies (11 items via AST)
  {
    const html = await fetchRouteHtml(`/reports/${slug}/existing_strategies`);
    const esSf = loadTsFile(
      "src/components/reports/federal-state/views/FederalStateExistingStrategiesFrameView.tsx"
    );
    const list = (getAstConst(
      "src/components/reports/federal-state/views/FederalStateExistingStrategiesFrameView.tsx",
      "strategies"
    ) || []) as Array<{ source: string; title: string }>;

    const items = list.map((st, idx) => {
      const frag = evalComponentBodyHtml(esSf, undefined, {
        slug,
        report: { slug, title: "2026 Federal and State/Territory Government Workforce Insights Report" },
        selected: idx,
        setSelected: () => {},
        selectStrategy: () => {},
      });
      const $f = cheerio.load(frag);
      const panelHtml = $f("#existing-strategy-panel .animate-content-switch").html() || frag;
      const parsed = htmlFragmentToParagraphsAndBullets(panelHtml);
      const period =
        idx === 1
          ? "2022 – 2025"
          : idx === 3 || idx === 8
            ? "2024 – 2028"
            : idx === 4
              ? "2019 – 2025"
              : idx === 5
                ? "2021 – 2026"
                : idx === 6
                  ? "2022 – 2032"
                  : idx === 9 || idx === 10
                    ? "2023 – 2026"
                    : "Ongoing";
      return {
        code: String(idx + 1).padStart(2, "0"),
        eyebrow: st.source,
        title: st.title,
        badgeText: period,
        summaryParagraphs: parsed.paragraphs,
        bullets: parsed.bullets.length ? parsed.bullets : undefined,
        detailSections: parsed.sections,
      };
    });

    pages.push(
      makeRichPageFromHtml(
        html,
        "existing_strategies",
        "Existing Industry-Sector Strategies",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SECTOR",
          replaceBlocksWith: [
            buildMasterDetailFromArray(
              `STRATEGIES · ${items.length} · SELECT TO OPEN`,
              items
            ),
          ],
        }
      )
    );
  }

  // Federal Government Initiatives (14 items from AST)
  {
    const html = await fetchRouteHtml(`/reports/${slug}/federal_initiatives`);
    const fedSf = loadTsFile(
      "src/components/reports/federal-state/views/FederalStateInitiativesView.tsx"
    );
    const constNames = [
      "closingTheGap",
      "strategicPriorities",
      "workingForWomen",
      "cleanEnergyGeneration",
      "cyberSecurityStrategy",
      "unlockingVET",
      "occupationClassification",
      "coreSkillsList",
      "betterTogether",
      "trainingPackageFramework",
      "productivityCommission",
      "tertiaryHarmonisation",
      "genderEconomicEquality",
      "occupationalShortageList",
    ];
    const fedEnv = collectTopLevelVars(fedSf);
    const items = constNames
      .map((name, idx) => {
        const obj = fedEnv[name] as {
          title?: string;
          source?: string;
          period?: string;
          paragraphs?: string[];
          priorityAreas?: string[];
        } | undefined;
        if (!obj) return null;
        return {
          code: String(idx + 1).padStart(2, "0"),
          eyebrow: obj.source,
          title: obj.title || `Initiative ${idx + 1}`,
          badgeText: obj.period,
          summaryParagraphs: obj.paragraphs || [],
          bullets: obj.priorityAreas,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    pages.push(
      makeRichPageFromHtml(
        html,
        "federal_initiatives",
        "Federal Government Initiatives",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "GLOBAL_PSA",
          replaceBlocksWith: [
            buildMasterDetailFromArray(
              `INITIATIVES · ${items.length} · SELECT TO OPEN`,
              items
            ),
          ],
        }
      )
    );
  }

  for (const [pageType, title] of [
    ["looking_forward", "Looking Forward"],
    ["downloads", "Downloads & References"],
  ] as const) {
    const html = await fetchRouteHtml(`/reports/${slug}/${pageType}`);
    const page = makeRichPageFromHtml(html, pageType, title, slug, {
      sortOrder: sort++,
      paletteMode: "SECTOR",
    });
    if (pageType === "downloads") {
      const blocks = (page.content.blocks as RichBlock[]) || [];
      blocks.unshift({
        id: "fstg-dl-card",
        type: "downloads_list",
        currentReportTitle:
          "2026 Federal and State/Territory Government Workforce Insights Report",
        currentReportDescription:
          "Download the full Federal and State/Territory Government Workforce Insights Report in PDF format.",
        currentPdfUrl: pdfUrl,
        previousReports: [
          {
            year: "2025",
            title:
              "2025 Federal and State/Territory Government Workforce Insights Report",
            url: "https://publicskillsaustralia.org.au",
          },
        ],
      });
      page.content.blocks = blocks;
    }
    pages.push(page);
  }

  return {
    sectorCode: "federal-state",
    year: 2026,
    title: "2026 Federal and State/Territory Government Workforce Insights Report",
    slug,
    shortDescription: "Federal Agencies and State/Territory Public Services",
    coverImageUrl: "/images/reports/sector-card-federal-state.png",
    pdfFileUrl: pdfUrl,
    previousPdfs: [
      {
        year: "2025",
        title:
          "2025 Federal and State/Territory Government Workforce Insights Report",
        url: "https://publicskillsaustralia.org.au",
      },
    ],
    psaSectorPageUrl: "https://publicskillsaustralia.org.au",
    contactUrl: "https://publicskillsaustralia.org.au/contact",
    landingIntroDesc:
      "For readers who want the report background — how it was developed, the methodology and the full report structure.",
    landingExecDesc:
      "Straight to the key insights and strategies — the workforce story on one page, built for large screens and briefings.",
    pages,
  };
}

// ---------- CORRECTIONAL SERVICES ----------

async function extractCorrectionalServices(): Promise<ExtractedReport> {
  const slug = "correctional-services-wir-2026";
  const pdfUrl =
    "https://psa-directus-prod.azurewebsites.net/assets/d5e36137-5d7a-4012-bd9e-c2b33b0bf232.pdf";
  const pages: ExtractedChapterPage[] = [];
  let sort = 0;

  const landingHtml = await fetchRouteHtml(`/reports/${slug}`);
  const $land = cheerio.load(landingHtml);
  pages.push({
    pageType: "transition",
    title: "Report Landing / Transition",
    slug: "transition",
    sortOrder: sort++,
    isVisible: true,
    paletteMode: "SECTOR",
    subSectorCode: null,
    layoutVariant: "standard",
    content: {
      eyebrow: "2026 • PUBLIC SKILLS AUSTRALIA",
      headline:
        cleanSpace($land("h1").first().text()) ||
        "2026 Correctional Services Workforce Insights Report",
      subheadline: "",
      promptText:
        "Choose how you explore the digital report; begin with the introduction for a comprehensive overview, or go straight to the executive summary for the key insights and strategies.",
      introCardTitle: "Introduction",
      introCardDescription:
        "For readers who want the report background — how it was developed, the methodology and the full report structure.",
      introButtonLabel: "Open the Introduction",
      execCardTitle: "Executive Summary",
      execCardDescription:
        "Straight to the key insights and strategies — the workforce story on one page, built for large screens and briefings.",
      execButtonLabel: "Open the Executive Summary",
      subSectorSectionTitle: "",
      subSectorCards: [],
    },
    footnotes: [],
  });

  for (const [pageType, title, paletteMode] of [
    ["introduction", "Introduction", "SECTOR"],
    ["about", "About Public Skills Australia", "GLOBAL_PSA"],
    ["methodology", "Methodology", "GLOBAL_PSA"],
    ["executive_summary", "Executive Summary", "SECTOR"],
    ["drivers_of_change", "Drivers of Change", "GLOBAL_PSA"],
    ["industry_overview", "Industry-Sector Overview", "SECTOR"],
  ] as const) {
    const html = await fetchRouteHtml(`/reports/${slug}/${pageType}`);
    pages.push(
      makeRichPageFromHtml(html, pageType, title, slug, {
        sortOrder: sort++,
        paletteMode,
      })
    );
  }

  // State & Territory Jurisdictions
  {
    const html = await fetchRouteHtml(`/reports/${slug}/state_territory`);
    const jurisdictions = (getAstConst(
      "src/components/reports/correctional-services/views/CorrectionalServicesStateTerritoryView.tsx",
      "jurisdictions"
    ) || []) as Array<{
      code: string;
      name: string;
      employees: string;
      facilities: number;
      expenditure: string;
    }>;
    const statesMap: Record<
      string,
      {
        code: string;
        name: string;
        employees: string;
        facilities: number;
        expenditure: string;
        metrics: Array<{ label: string; value: string }>;
      }
    > = {};
    for (const j of jurisdictions) {
      statesMap[j.code] = {
        code: j.code,
        name: j.name,
        employees: j.employees,
        facilities: j.facilities,
        expenditure: j.expenditure,
        metrics: [
          { label: "Correctional Services Employees", value: j.employees },
          { label: "Custodial Facilities", value: String(j.facilities) },
          { label: "Real Net Operating Expenditure", value: j.expenditure },
        ],
      };
    }

    pages.push(
      makeRichPageFromHtml(
        html,
        "state_territory",
        "State and Territory Profile",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SECTOR",
          extraBlocks: [
            {
              id: "cor-state-exp",
              type: "state_explorer",
              title: "Correctional Services Profile by Jurisdiction",
              defaultState: "NSW",
              states: statesMap,
              nationalTableTitle: "National Summary by Jurisdiction",
              nationalHeaders: [
                "Jurisdiction",
                "Employees (2025)",
                "Custodial Facilities",
                "Operating Expenditure",
              ],
              nationalRows: jurisdictions.map((j) => [
                `${j.name} (${j.code})`,
                j.employees,
                String(j.facilities),
                j.expenditure,
              ]),
            },
          ],
        }
      )
    );
  }

  // Industry Profile (3 charts)
  {
    const html = await fetchRouteHtml(`/reports/${slug}/industry_profile`);
    const emp = (getAstConst(
      "src/components/reports/correctional-services/views/CorrectionalServicesIndustryProfileView.tsx",
      "employment"
    ) || []) as Array<{ period: string; detail?: string; first: number; second: number }>;
    const corr = (getAstConst(
      "src/components/reports/correctional-services/views/CorrectionalServicesIndustryProfileView.tsx",
      "corrections"
    ) || []) as Array<{ period: string; first: number; second: number }>;
    const head = (getAstConst(
      "src/components/reports/correctional-services/views/CorrectionalServicesIndustryProfileView.tsx",
      "headcounts"
    ) || []) as Array<{ jurisdiction: string; value: number }>;

    pages.push(
      makeRichPageFromHtml(
        html,
        "industry_profile",
        "Workforce Growth vs. Demand",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SECTOR",
          nextNav: {
            label: "Community Corrections Profile",
            pageType: "industry_profile_community",
          },
          extraBlocks: [
            {
              id: "cor-ip-emp",
              type: "chart",
              title: "Correctional Services and Correctional Officer – Employment Projected Growth ('000)",
              chartType: "grouped_bar",
              labels: emp.map((e) => (e.detail ? `${e.period} (${e.detail})` : e.period)),
              series: [
                { name: "Correctional Officers", values: emp.map((e) => e.first), color: "#9DA8D0" },
                { name: "Correctional Services", values: emp.map((e) => e.second), color: "#424996" },
              ],
              source: "Jobs and Skills Australia 2026, Employment 10 year projections ('000)",
            },
            {
              id: "cor-ip-corr",
              type: "chart",
              title: "Persons in Custody and Serving Community Corrections Orders",
              chartType: "grouped_bar",
              labels: corr.map((c) => c.period),
              series: [
                { name: "Community Corrections", values: corr.map((c) => c.first), color: "#9DA8D0" },
                { name: "Custodial Corrections", values: corr.map((c) => c.second), color: "#424996" },
              ],
              source: "Australian Bureau of Statistics 2026, Corrective Services Australia Dec 2025, Table 1",
            },
            {
              id: "cor-ip-head",
              type: "chart",
              title: "Correctional Services Employment Headcount by Jurisdiction (2025)",
              chartType: "horizontal_bar",
              labels: head.map((h) => h.jurisdiction),
              series: [{ name: "Employees", values: head.map((h) => h.value), color: "#9DA8D0" }],
              source: "State/Territory Correctional Services annual reports",
            },
          ],
        }
      )
    );
  }

  // Industry Profile Community
  {
    const html = await fetchRouteHtml(`/reports/${slug}/industry_profile_community`);
    const ratios = (getAstConst(
      "src/components/reports/correctional-services/views/CorrectionalServicesIndustryProfileCommunityView.tsx",
      "nationalRatios"
    ) || []) as Array<{ year: string; value: number }>;
    const jRatios = (getAstConst(
      "src/components/reports/correctional-services/views/CorrectionalServicesIndustryProfileCommunityView.tsx",
      "jurisdictions"
    ) || []) as Array<{ name: string; value: number }>;
    const orders = (getAstConst(
      "src/components/reports/correctional-services/views/CorrectionalServicesIndustryProfileCommunityView.tsx",
      "orders"
    ) || []) as Array<{ year: string; values: number[] }>;

    pages.push(
      makeRichPageFromHtml(
        html,
        "industry_profile_community",
        "Community Corrections Profile",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SECTOR",
          prevNav: {
            label: "Workforce Growth vs. Demand",
            pageType: "industry_profile",
          },
          nextNav: {
            label: "Industry Profile — Presentation",
            pageType: "industry_profile_presentation",
          },
          extraBlocks: [
            {
              id: "cor-com-nat",
              type: "chart",
              title: "National Offender-to-Operational Staff Ratio (Community Corrections)",
              chartType: "line",
              labels: ratios.map((r) => r.year),
              series: [{ name: "Offenders per Staff Member", values: ratios.map((r) => r.value), color: "#424996" }],
              source: "Productivity Commission 2026, ROGS Part C – 8 Corrective Services, Table 8A.9",
            },
            {
              id: "cor-com-jur",
              type: "chart",
              title: "Offender-to-Operational Staff Ratio by Jurisdiction (2024–25)",
              chartType: "bar",
              labels: jRatios.map((r) => r.name),
              series: [{ name: "Offenders per Staff Member", values: jRatios.map((r) => r.value), color: "#424996" }],
            },
            {
              id: "cor-com-ord",
              type: "chart",
              title: "Persons Serving Community Corrections Orders by Order Type",
              chartType: "grouped_bar",
              labels: orders.map((o) => o.year),
              series: [
                { name: "Post-sentence", values: orders.map((o) => o.values[0]), color: "#788EDE" },
                { name: "Supervision", values: orders.map((o) => o.values[1]), color: "#9DA8D0" },
                { name: "Reparation", values: orders.map((o) => o.values[2]), color: "#6869A7" },
                { name: "Restricted movement", values: orders.map((o) => o.values[3]), color: "#424996" },
              ],
            },
          ],
        }
      )
    );
  }

  // Industry Profile Presentation (8 interactive charts)
  {
    const html = await fetchRouteHtml(`/reports/${slug}/industry_profile_presentation`);
    const presPath =
      "src/components/reports/correctional-services/views/CorrectionalServicesIndustryProfilePresentationView.tsx";
    const ages = (getAstConst(presPath, "ages") || []) as Array<{ label: string; value: number }>;
    const characteristics = (getAstConst(presPath, "characteristics") || []) as Array<{
      label: string;
      custodial: number;
      community: number;
    }>;
    const enrolments = (getAstConst(presPath, "enrolments") || []) as Array<{
      qualification: string;
      color: string;
      values: number[];
    }>;
    const imprisonmentRates = (getAstConst(presPath, "imprisonmentRates") || []) as Array<{
      label: string;
      value: number;
    }>;
    const expenditure = (getAstConst(presPath, "expenditure") || []) as Array<{
      label: string;
      value: number;
      display: string;
    }>;
    const stateImprisonmentRates = (getAstConst(
      "src/components/reports/correctional-services/data/imprisonmentRates.ts",
      "stateImprisonmentRates"
    ) || []) as Array<{ jurisdiction: string; values: number[] }>;
    const prisonCapacity = (getAstConst(
      "src/components/reports/correctional-services/data/prisonCapacity.ts",
      "prisonCapacity"
    ) || []) as Array<{ jurisdiction: string; values: number[] }>;

    const presBlocks: RichBlock[] = [
      {
        id: "cor-pres-ages",
        type: "chart",
        title: "Corrections Prisons Officers Workforce by Age",
        chartType: "horizontal_bar",
        labels: ages.map((a) => a.label),
        series: [{ name: "Percentage (%)", values: ages.map((a) => a.value), color: "#424996" }],
        valueSuffix: "%",
      },
      {
        id: "cor-pres-char",
        type: "chart",
        title: "Workforce Characteristics – Custodial Settings and Community Corrections",
        chartType: "grouped_bar",
        labels: characteristics.map((c) => c.label),
        series: [
          { name: "Custodial (%)", values: characteristics.map((c) => c.custodial), color: "#9DA8D0" },
          { name: "Community (%)", values: characteristics.map((c) => c.community), color: "#424996" },
        ],
        valueSuffix: "%",
      },
      {
        id: "cor-pres-enrol",
        type: "chart",
        title: "Correctional Services Training Package Enrolments (2019–2024)",
        chartType: "line",
        labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
        series: enrolments.map((e) => ({
          name: e.qualification,
          color: e.color,
          values: e.values,
        })),
      },
      {
        id: "cor-pres-aus-imp",
        type: "chart",
        title: "Average Daily Imprisonment Rate (per 100,000 adult population) – Australia",
        chartType: "line",
        labels: imprisonmentRates.map((r) => r.label),
        series: [{ name: "Imprisonment Rate", values: imprisonmentRates.map((r) => r.value), color: "#424996" }],
      },
      {
        id: "cor-pres-cap",
        type: "table",
        title: "Prison Capacity Utilisation by State and Territory (ROGS 2026 Table 8A.15)",
        headers: ["Jurisdiction", "2022–23 (%)", "2023–24 (%)", "2024–25 (%)"],
        rows: prisonCapacity.map((p) => [
          p.jurisdiction,
          ...p.values.map((v) => `${v}%`),
        ]),
      },
      {
        id: "cor-pres-st-imp",
        type: "table",
        title: "Average Daily Imprisonment Rate (per 100,000 adult population) – State and Territory",
        headers: ["Jurisdiction", "Dec 2021", "Dec 2022", "Dec 2023", "Dec 2024", "Dec 2025"],
        rows: stateImprisonmentRates.map((r) => [
          r.jurisdiction,
          ...r.values.map((v) => String(v)),
        ]),
      },
      {
        id: "cor-pres-exp",
        type: "chart",
        title: "Real Net Prisons and Community Corrections Operating Expenditure 2024–25FY ($M)",
        chartType: "bar",
        labels: expenditure.map((e) => e.label),
        series: [{ name: "Expenditure ($ million)", values: expenditure.map((e) => e.value), color: "#424996" }],
      },
    ];

    pages.push(
      makeRichPageFromHtml(
        html,
        "industry_profile_presentation",
        "Industry Profile — Presentation Charts",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SECTOR",
          prevNav: {
            label: "Community Corrections Profile",
            pageType: "industry_profile_community",
          },
          nextNav: {
            label: "Workforce Insights",
            pageType: "workforce_insights",
          },
          extraBlocks: presBlocks,
        }
      )
    );
  }

  // Workforce Insights Introduction & Overview + 3 Insight Pages + Detail
  {
    const html = await fetchRouteHtml(`/reports/${slug}/workforce_insights`);
    pages.push(
      makeRichPageFromHtml(
        html,
        "workforce_insights",
        "Workforce Insights — Community Corrections Introduction",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SECTOR",
          extraBlocks: [
            {
              id: "cor-wfi-next-links",
              type: "link_cards",
              title: "Explore 2026 Correctional Services Insights",
              columns: 2,
              cards: [
                {
                  eyebrow: "THEME OVERVIEW",
                  title: "CSC Correctional Services Training Package",
                  summary:
                    "Explore all three approved industry insights into community corrections skills and training pathways.",
                  pageType: "workforce_insights_2026",
                  ctaLabel: "Open",
                },
                {
                  eyebrow: "COMBINED VIEW",
                  title: "Community Corrections Interactive Overview & Charts",
                  summary:
                    "Interactive view of all three CCO insights and Certificate III vs IV enrolment comparisons.",
                  pageType: "workforce_insights_detail",
                  ctaLabel: "Open",
                },
              ],
            },
          ],
        }
      )
    );
  }

  {
    const html = await fetchRouteHtml(`/reports/${slug}/workforce_insights_2026`);
    const corInsights = (getAstConst(
      "src/components/reports/correctional-services/data/workforceInsights.ts",
      "correctionalInsights"
    ) || []) as Array<{ number: number; label: string; lead: string; detail: string }>;
    const targets = [
      "workforce_insights_skills_capabilities",
      "workforce_insights_specialisations",
      "workforce_insights_career_pathways",
    ];
    pages.push(
      makeRichPageFromHtml(
        html,
        "workforce_insights_2026",
        "Workforce Insights 2026",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SECTOR",
          replaceBlocksWith: [
            {
              id: "cor-wfi-cards",
              type: "link_cards",
              title: "Theme 1 · 3 Insights",
              columns: 1,
              cards: [
                {
                  eyebrow: "THEME 1 · 3 INSIGHTS",
                  title: "CSC Correctional Services Training Package",
                  items: corInsights.map((ins, i) => ({
                    number: String(ins.number ?? i + 1),
                    eyebrow: ins.label,
                    title: ins.lead,
                    summary: ins.detail,
                    pageType: targets[i],
                  })),
                },
              ],
            },
          ],
        }
      )
    );
  }

  for (const [pt, title, num] of [
    ["workforce_insights_skills_capabilities", "Theme 1 · Insight 1", 1],
    ["workforce_insights_specialisations", "Theme 1 · Insight 2", 2],
    ["workforce_insights_career_pathways", "Theme 1 · Insight 3", 3],
  ] as const) {
    const html = await fetchRouteHtml(`/reports/${slug}/${pt}`);
    const extraBlocks: RichBlock[] = [];
    if (num === 2) {
      extraBlocks.push(
        {
          id: "cor-cert3-chart",
          type: "chart",
          title: "Certificate III in Correctional Practice — Enrolments vs Completions",
          chartType: "grouped_bar",
          labels: ["2020", "2021", "2022", "2023", "2024"],
          series: [
            { name: "Enrolments", values: [5229, 4419, 3952, 5301, 5762], color: "#596990" },
            { name: "Completions", values: [3275, 2540, 2060, 2180, 2298], color: "#12224F" },
          ],
          source: "NCVER 2025, Total VET students and courses 2024",
        },
        {
          id: "cor-cert4-chart",
          type: "chart",
          title: "Certificate IV in Correctional Practice — Enrolments vs Completions",
          chartType: "grouped_bar",
          labels: ["2020", "2021", "2022", "2023", "2024"],
          series: [
            { name: "Enrolments", values: [1516, 1648, 1288, 1167, 1558], color: "#596990" },
            { name: "Completions", values: [670, 809, 716, 561, 763], color: "#12224F" },
          ],
          source: "NCVER 2025, Total VET students and courses 2024",
        }
      );
    }
    pages.push(
      makeRichPageFromHtml(html, pt, title, slug, {
        sortOrder: sort++,
        paletteMode: "SECTOR",
        extraBlocks,
        insightPager: {
          label: `Insight ${num} of 3 · CSC Correctional Services Training Package`,
          backPageType: "workforce_insights_2026",
          backLabel: "Back to Workforce Insights",
          prevPageType:
            num === 2
              ? "workforce_insights_skills_capabilities"
              : num === 3
                ? "workforce_insights_specialisations"
                : undefined,
          prevLabel: num > 1 ? `Insight ${num - 1}` : undefined,
          nextPageType:
            num === 1
              ? "workforce_insights_specialisations"
              : num === 2
                ? "workforce_insights_career_pathways"
                : "workforce_strategies",
          nextLabel: num < 3 ? `Insight ${num + 1}` : "2026 Proposed Strategy",
        },
      })
    );
  }

  // workforce_insights_detail
  {
    const html = await fetchRouteHtml(`/reports/${slug}/workforce_insights_detail`);
    const detPath =
      "src/components/reports/correctional-services/views/CorrectionalServicesWorkforceInsightsView.tsx";
    const insights = (getAstConst(detPath, "insights") || []) as Array<{
      id: string;
      number: string;
      title: string;
      short: string;
      detailTitle: string;
      detail: string;
      sections: [string, string][];
    }>;

    pages.push(
      makeRichPageFromHtml(
        html,
        "workforce_insights_detail",
        "Workforce Insights Supporting Details",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SECTOR",
          extraBlocks: [
            {
              id: "cor-det-md",
              type: "master_detail",
              listTitle: "CSC COMMUNITY CORRECTIONS INSIGHTS · 3 · SELECT TO OPEN",
              items: insights.map((ins) => ({
                code: `0${ins.number}`,
                eyebrow: `INSIGHT ${ins.number}`,
                title: ins.title,
                summaryParagraphs: [ins.detail],
                detailSections: ins.sections.map(([h, p]) => ({
                  heading: h,
                  paragraphs: [p],
                })),
              })),
            },
          ],
        }
      )
    );
  }

  // 2026 Proposed Strategy
  {
    const html = await fetchRouteHtml(`/reports/${slug}/workforce_strategies`);
    pages.push(
      makeRichPageFromHtml(
        html,
        "workforce_strategies",
        "2026 Proposed Correctional Services Workforce Strategy",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SECTOR",
          replaceBlocksWith: [
            {
              id: "cor-strat-1",
              type: "strategy_cards",
              columns: 1,
              items: [
                {
                  badge: "STRATEGY 1",
                  color: "#424996",
                  title:
                    "Collaborate with HumanAbility to analyse recent updates to the CHC Community Services Training Package to identify contemporary practice that could inform future updates to the Community Corrections specialisations in the officers Certificate III and Certificate IV in Correctional Practice.",
                  workforceInsight: "Community Corrections",
                  jscFunction:
                    "Training Product Development and Implementation, Promotion and Monitoring",
                  objective:
                    "to provide the Correctional Services Subcommittee an analysis of contemporary community services practice that could inform the Community Corrections specialisations in the Certificate III and Certificate IV in Correctional Practice.",
                  approach: [
                    "In collaboration with HumanAbility, undertake an analysis of the recent updates to CHC Community Services Training Package addressing the following capability areas to consider contemporary practice in community services and case management and identify whether this may support CCO skills requirements: community services, alcohol and other drugs, behavioural change management, trauma-informed response, training for working with First Nations people, training for dealing with sex offenders.",
                    "The findings report will be presented to the Correctional Services Subcommittee for further action.",
                  ],
                  deliverable: ["Findings Report"],
                  impact:
                    "Support the Correctional Services by providing analysis of contemporary practice in similar capability areas in different industry-sectors.",
                  timing: "18-month project",
                  stakeholders: [
                    "HumanAbility",
                    "State and Territory Correctional Services",
                    "Private Correctional Service organisations",
                    "Public Sector Unions",
                    "Enterprise RTOs/RTOs",
                  ],
                },
              ],
            },
          ],
        }
      )
    );
  }

  // Update on 2024 & 2025 Strategies + sub-project views
  for (const [pt, title] of [
    ["update_2024_strategies", "Update on 2024 Strategies"],
    ["update_2024_demand_management", "Demand Management (2024 Strategy Update)"],
    ["update_2024_workforce_mobility", "Workforce Mobility (2024 Strategy Update)"],
    ["update_2025_strategies", "Update on 2025 Strategies"],
    [
      "update_2025_training_pathways",
      "Correctional Services Skills and Training Pathways",
    ],
    [
      "update_2025_first_nations_participation",
      "First Nations Workforce Participation",
    ],
  ] as const) {
    const html = await fetchRouteHtml(`/reports/${slug}/${pt}`);
    pages.push(
      makeRichPageFromHtml(html, pt, title, slug, {
        sortOrder: sort++,
        paletteMode: "SECTOR",
      })
    );
  }

  // Existing Industry-Sector Strategies (via AST eval for each item)
  {
    const html = await fetchRouteHtml(`/reports/${slug}/existing_strategies`);
    const pathEs =
      "src/components/reports/correctional-services/views/CorrectionalServicesExistingStrategiesView.tsx";
    const strategies = (getAstConst(pathEs, "strategies") || []) as Array<{
      number: string;
      jurisdiction: string;
      period: string;
      title: string;
      summary: string;
      consultation: string;
      update2024: string;
      update2025: string;
      update2026: string;
    }>;

    pages.push(
      makeRichPageFromHtml(
        html,
        "existing_strategies",
        "Existing Industry-Sector Strategies",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SECTOR",
          replaceBlocksWith: [
            buildMasterDetailFromArray(
              `STRATEGIES · ${strategies.length} · SELECT TO OPEN`,
              strategies.map((st) => ({
                code: st.number,
                eyebrow: st.jurisdiction,
                title: st.title,
                badgeText: st.period,
                summaryParagraphs: st.summary
                  .split(/\n\n+/)
                  .map(cleanSpace)
                  .filter(Boolean),
                detailSections: [
                  {
                    heading: "Consultation and engagement",
                    paragraphs: st.consultation.split(/\n\n+/).map(cleanSpace).filter(Boolean),
                  },
                  {
                    heading: "2024 Workforce Strategies",
                    paragraphs: st.update2024.split(/\n\n+/).map(cleanSpace).filter(Boolean),
                  },
                  {
                    heading: "2025 Workforce Strategies",
                    paragraphs: st.update2025.split(/\n\n+/).map(cleanSpace).filter(Boolean),
                  },
                  {
                    heading: "2026 Workforce Strategies",
                    paragraphs: st.update2026.split(/\n\n+/).map(cleanSpace).filter(Boolean),
                  },
                ],
              }))
            ),
          ],
        }
      )
    );
  }

  // Federal Government Initiatives
  {
    const html = await fetchRouteHtml(`/reports/${slug}/federal_initiatives`);
    const pathFed =
      "src/components/reports/correctional-services/views/CorrectionalServicesFederalInitiativesView.tsx";
    const initiatives = (getAstConst(pathFed, "initiatives") || []) as Array<{
      number: string;
      owner: string;
      period: string;
      title: string;
      summary: string[];
      priorities?: string[];
    }>;

    pages.push(
      makeRichPageFromHtml(
        html,
        "federal_initiatives",
        "Federal Government Initiatives",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "GLOBAL_PSA",
          replaceBlocksWith: [
            buildMasterDetailFromArray(
              `INITIATIVES · ${initiatives.length} · SELECT TO OPEN`,
              initiatives.map((it) => ({
                code: it.number,
                eyebrow: it.owner,
                title: it.title,
                badgeText: it.period,
                summaryParagraphs: it.summary,
                bullets: it.priorities,
              }))
            ),
          ],
        }
      )
    );
  }

  for (const [pageType, title] of [
    ["looking_forward", "Looking Forward"],
    ["downloads", "Downloads & References"],
  ] as const) {
    const html = await fetchRouteHtml(`/reports/${slug}/${pageType}`);
    const page = makeRichPageFromHtml(html, pageType, title, slug, {
      sortOrder: sort++,
      paletteMode: "SECTOR",
    });
    if (pageType === "downloads") {
      const blocks = (page.content.blocks as RichBlock[]) || [];
      blocks.unshift({
        id: "cor-dl-card",
        type: "downloads_list",
        currentReportTitle: "2026 Correctional Services Workforce Insights Report",
        currentReportDescription:
          "Download the full Correctional Services Workforce Insights Report in PDF format.",
        currentPdfUrl: pdfUrl,
        previousReports: [
          {
            year: "2025",
            title: "2025 Correctional Services Workforce Insights Report",
            url: "https://publicskillsaustralia.org.au",
          },
        ],
      });
      page.content.blocks = blocks;
    }
    pages.push(page);
  }

  return {
    sectorCode: "correctional-services",
    year: 2026,
    title: "2026 Correctional Services Workforce Insights Report",
    slug,
    shortDescription: "Custodial and Community Corrections across Australia",
    coverImageUrl: "/images/reports/sector-card-correctional-services.png",
    pdfFileUrl: pdfUrl,
    previousPdfs: [
      {
        year: "2025",
        title: "2025 Correctional Services Workforce Insights Report",
        url: "https://publicskillsaustralia.org.au",
      },
    ],
    psaSectorPageUrl: "https://publicskillsaustralia.org.au",
    contactUrl: "https://publicskillsaustralia.org.au/contact",
    landingIntroDesc:
      "For readers who want the report background — how it was developed, the methodology and the full report structure.",
    landingExecDesc:
      "Straight to the key insights and strategies — the workforce story on one page, built for large screens and briefings.",
    pages,
  };
}

// ---------- PUBLIC SAFETY ----------

async function extractPublicSafety(): Promise<ExtractedReport> {
  const slug = "public-safety-wir-2026";
  const pdfUrl =
    "https://psa-directus-prod.azurewebsites.net/assets/b3a99498-8d9f-4275-aa00-fcf73274d2ce.pdf";
  const pages: ExtractedChapterPage[] = [];
  let sort = 0;

  // Landing
  const landingHtml = await fetchRouteHtml(`/reports/${slug}`);
  const $land = cheerio.load(landingHtml);
  pages.push({
    pageType: "transition",
    title: "Report Landing / Transition",
    slug: "transition",
    sortOrder: sort++,
    isVisible: true,
    paletteMode: "SECTOR",
    subSectorCode: null,
    layoutVariant: "standard",
    content: {
      eyebrow: "2026 • PUBLIC SKILLS AUSTRALIA",
      headline:
        cleanSpace($land("h1").first().text()) ||
        "2026 Public Safety Workforce Insights Report",
      subheadline:
        "Covering the Defence, Fire and Emergency Services and Police industry-sectors — with cross-sector analysis of the skills that connect them.",
      promptText:
        "Choose how you explore the digital report; begin with the introduction for a comprehensive overview, or go straight to the executive summary for the key insights and strategies.",
      introCardTitle: "Introduction",
      introCardDescription:
        "For readers who want the report background — how it was developed, the methodology and the full report structure.",
      introButtonLabel: "Open the Introduction",
      execCardTitle: "Executive Summary",
      execCardDescription:
        "Straight to the key insights and strategies — the workforce story on one page, built for large screens and briefings.",
      execButtonLabel: "Open the Executive Summary",
      subSectorSectionTitle: "Or go straight to a sector chapter",
      subSectorCards: [
        { code: "DEF", title: "Defence", pageType: "defence", color: "#D3992C" },
        {
          code: "FES",
          title: "Fire and Emergency Services",
          pageType: "fes",
          color: "#C9481A",
        },
        { code: "POL", title: "Police", pageType: "police", color: "#0D71A3" },
      ],
    },
    footnotes: [],
  });

  // Top-level & Cross-sector core pages
  for (const [pt, title, pm] of [
    ["introduction", "Introduction", "SECTOR"],
    ["about", "About Public Skills Australia", "GLOBAL_PSA"],
    ["methodology", "Methodology", "GLOBAL_PSA"],
    ["executive_summary", "Executive Summary", "SECTOR"],
    ["drivers_of_change", "Drivers of Change", "GLOBAL_PSA"],
    ["driver_1", "Driver 1", "GLOBAL_PSA"],
    ["driver_2", "Driver 2", "GLOBAL_PSA"],
    ["driver_3", "Driver 3", "GLOBAL_PSA"],
    ["driver_4", "Driver 4", "GLOBAL_PSA"],
    ["cross_sector_analysis", "Public Safety Cross-Sector Analysis", "GLOBAL_PSA"],
    ["cross_sector_core_skill_alignment", "Core Skill Alignment", "GLOBAL_PSA"],
    [
      "cross_sector_specialist_skill_alignment",
      "Specialist Skill Alignment",
      "GLOBAL_PSA",
    ],
    ["cross_sector_skills_recognition", "Skills Recognition", "GLOBAL_PSA"],
  ] as const) {
    const html = await fetchRouteHtml(`/reports/${slug}/${pt}`);
    const extraBlocks: RichBlock[] = [];
    if (pt === "drivers_of_change") {
      const psDrivers = (getAstConst(
        "src/components/reports/public-safety/views/PublicSafetyDriverDetailView.tsx",
        "drivers"
      ) || []) as Array<{ key: string; title: string; summary: string }>;
      extraBlocks.push({
        id: "ps-drivers-nav",
        type: "link_cards",
        title: "Open Detailed Driver Analysis",
        columns: 2,
        cards: psDrivers.map((d, idx) => ({
          number: String(idx + 1),
          eyebrow: `DRIVER ${idx + 1}`,
          title: d.title,
          summary: d.summary,
          pageType: d.key,
          ctaLabel: "Open Driver",
        })),
      });
    }
    if (/^driver_[1-4]$/.test(pt)) {
      const psDriverPath =
        "src/components/reports/public-safety/views/PublicSafetyDriverDetailView.tsx";
      const psDrivers = (getAstConst(psDriverPath, "drivers") || []) as Array<{
        key: string;
        title: string;
        summary: string;
        detailTitle: string;
        body: Array<{ text: string; reference?: string }>;
      }>;
      const psMega = (getAstConst(psDriverPath, "megatrends") || []) as Array<{
        title: string;
      }>;
      const match = psDrivers.find((d) => d.key === pt) || psDrivers[0];
      const baseParsed = makeRichPageFromHtml(html, pt, title, slug, {
        sortOrder: sort++,
        paletteMode: pm,
      });
      if (match) {
        const driverBlock: RichBlock = {
          id: `ps-${pt}-detail`,
          type: "narrative",
          badge: `DRIVER ${pt.split("_")[1]}`,
          title: match.detailTitle,
          paragraphs: match.body.map(
            (b) => `${b.text}${b.reference ? `[[${b.reference}]]` : ""}`
          ),
        };
        const switcherBlock: RichBlock = {
          id: `ps-${pt}-switch`,
          type: "link_cards",
          title: "Explore All Four Drivers of Change",
          columns: 4,
          cards: psDrivers.map((d, idx) => ({
            number: String(idx + 1),
            eyebrow: `DRIVER ${idx + 1}`,
            title: d.title,
            summary: d.summary,
            pageType: d.key,
            ctaLabel: d.key === pt ? "Selected" : "Open",
          })),
        };
        const megaBlock: RichBlock = {
          id: `ps-${pt}-mega`,
          type: "link_cards",
          title: "Nine Megatrends",
          subtitle:
            "These megatrends were identified in previous Workforce Insights Reports and will continue to have longer term implications for workforce planning and development across the Public Safety and Government industry-sectors.",
          columns: 3,
          cards: psMega.map((m, idx) => ({
            number: String(idx + 1),
            title: m.title,
          })),
        };
        baseParsed.title = match.detailTitle;
        baseParsed.content.headerTitle = match.detailTitle;
        baseParsed.content.badge = `Driver ${pt.split("_")[1]} of 4 · Common to all WIRs`;
        baseParsed.content.blocks = [driverBlock, switcherBlock, megaBlock];
      }
      pages.push(baseParsed);
      continue;
    }
    if (pt === "cross_sector_analysis") {
      const csThemes = (getAstConst(
        "src/components/reports/public-safety/views/PublicSafetyCrossSectorAnalysisView.tsx",
        "themes"
      ) || []) as Array<{ label: string; title: string; body: string }>;
      extraBlocks.push({
        id: "ps-cs-themes",
        type: "accordions",
        title: "Four Cross-Sector Themes",
        items: csThemes.map((t, idx) => ({
          id: `cs-th-${idx + 1}`,
          badge: t.label,
          title: t.title,
          defaultOpen: idx === 0,
          summaryParagraphs: [t.body],
        })),
      });
    }
    if (pt === "executive_summary") {
      const esData = (getAstConst(
        "src/components/reports/public-safety/data/executiveSummary.ts",
        "executiveSummaryInsights"
      ) || []) as Array<{
        title: string;
        color: string;
        items: Array<{
          number: string;
          title: string;
          details: Array<{ number?: string; text: string; page: string }>;
        }>;
      }>;
      extraBlocks.push({
        id: "ps-es-sectors",
        type: "link_cards",
        title: "Public Safety Workforce Themes & Insights Across Sectors",
        columns: 3,
        cards: esData.map((sec) => ({
          eyebrow: sec.title.toUpperCase(),
          title: sec.title,
          accentColor: sec.color,
          items: sec.items.flatMap((it) =>
            it.details.map((d) => ({
              number: d.number || it.number,
              eyebrow: it.title,
              title: d.text,
              pageType: d.page,
            }))
          ),
        })),
      });
    }
    const page = makeRichPageFromHtml(html, pt, title, slug, {
      sortOrder: sort++,
      paletteMode: pm,
      extraBlocks,
    });
    pages.push(page);
  }

  // ---- DEFENCE SUB-SECTOR (DEF) ----
  {
    const defChapterHtml = await fetchRouteHtml(`/reports/${slug}/defence`);
    pages.push(
      makeRichPageFromHtml(defChapterHtml, "defence", "Defence Chapter", slug, {
        sortOrder: sort++,
        paletteMode: "SUB_SECTOR",
        subSectorCode: "DEF",
      })
    );

    // defence_industry_overview: extract all 3 openGroup accordions + charts!
    const defOvSf = loadTsFile(
      "src/components/reports/public-safety/views/PublicSafetyDefenceOverviewView.tsx"
    );
    const defOvHtml = await fetchRouteHtml(`/reports/${slug}/defence_industry_overview`);
    const defAccordions: RichBlock = {
      id: "def-ov-groups",
      type: "accordions",
      title: "Defence Workforce Overview Groups",
      items: [0, 1, 2].map((grpIdx) => {
        const titles = ["Current Workforce", "Future Workforce", "Veterans"];
        const grpHtml = evalComponentBodyHtml(
          defOvSf,
          grpIdx === 0
            ? "CurrentWorkforceCharts"
            : grpIdx === 1
              ? "FutureWorkforceCharts"
              : "VeteransCharts",
          {}
        );
        const parsed = htmlFragmentToParagraphsAndBullets(grpHtml);
        const grpBlocks: RichBlock[] = [];
        if (grpIdx === 0) {
          grpBlocks.push(
            {
              id: "def-curr-bars",
              type: "chart",
              title: "Defence Workforce Headcount, 30 June 2025",
              chartType: "bar",
              labels: [
                "Australian Public Service Employees",
                "Reserves (Navy, Army, Air Force)",
                "Permanent Force (Navy, Army, Air Force)",
              ],
              series: [{ name: "Headcount", values: [20545, 33269, 58909], color: "#D3992C" }],
              source: "Defence Annual Report 2024-25, 2025",
            },
            {
              id: "def-curr-stats",
              type: "kpi_grid",
              title: "Australian Defence Force Key Enlistment Demographics 2024-25",
              items: [
                {
                  value: "6,228",
                  label: "The ADF enlisted 6,228 members entering into the Permanent workforce in 2024-25",
                },
                { value: "1,296", label: "had prior military service in the Reserves" },
                {
                  value: "4,932",
                  label: "had no prior military experience. This inflow is an increase on 2023-24",
                },
                {
                  value: "20.6%",
                  label: "Women represented 20.6% of enlistments, and Indigenous people represented 5.8% of enlistments",
                },
              ],
            }
          );
        } else if (grpIdx === 1) {
          grpBlocks.push({
            id: "def-fut-sep",
            type: "chart",
            title: "Australian Defence Force Separation Rate, June 2019 – June 2025",
            chartType: "bar",
            labels: ["2019", "2020", "2021", "2022", "2023", "2024", "2025"],
            series: [
              { name: "Separation Rate (%)", values: [9.7, 9, 9.5, 11.2, 11.1, 9.5, 7.9], color: "#D3992C" },
            ],
            valueSuffix: "%",
            source: "DEFENCE ANNUAL REPORTS 2019–20 – 2024–25",
          });
        } else {
          grpBlocks.push({
            id: "def-vet-stats",
            type: "kpi_grid",
            title: "Veterans Transition Training Support 2024-25",
            items: [
              { value: "1,057", label: "RPL assessments conducted in 2024-25" },
              { value: "2,093", label: "Managed over 2,093 enquiries" },
              { value: "2,439", label: "Issued 2,439 qualifications" },
              { value: "2,174", label: "Issued 2,174 micro-credentials" },
            ],
          });
        }
        return {
          id: `def-grp-${grpIdx}`,
          title: titles[grpIdx],
          defaultOpen: grpIdx === 0,
          summaryParagraphs: parsed.paragraphs,
          blocks: grpBlocks,
        };
      }),
    };
    pages.push(
      makeRichPageFromHtml(
        defOvHtml,
        "defence_industry_overview",
        "Defence Industry-Sector Overview",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SUB_SECTOR",
          subSectorCode: "DEF",
          extraBlocks: [defAccordions],
        }
      )
    );

    // defence_industry_profile: 6 charts + location explorer
    const defProfHtml = await fetchRouteHtml(`/reports/${slug}/defence_industry_profile`);
    const defLocs = (getAstConst(
      "src/components/reports/public-safety/views/PublicSafetyDefenceLocationMap.tsx",
      "defenceLocations"
    ) || {}) as Record<string, { name: string; values: [string, string, string] }>;
    const defLocStates: Record<
      string,
      {
        code: string;
        name: string;
        metrics: Array<{ label: string; value: string }>;
      }
    > = {};
    for (const [k, v] of Object.entries(defLocs)) {
      defLocStates[k] = {
        code: k,
        name: v.name,
        metrics: [
          { label: "Permanent ADF", value: v.values[0] },
          { label: "ADF Reserves", value: v.values[1] },
          { label: "Major Defence bases*", value: v.values[2] },
        ],
      };
    }

    pages.push(
      makeRichPageFromHtml(
        defProfHtml,
        "defence_industry_profile",
        "Defence Industry Profile",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SUB_SECTOR",
          subSectorCode: "DEF",
          replaceBlocksWith: [
            {
              id: "def-p-headcount",
              type: "chart",
              title: "Total Yearly Headcount for Each Military Service Branch & Combined ADF (2024–2025)",
              chartType: "grouped_bar",
              labels: ["Total ADF", "ADF Reserves", "Army", "Air Force", "Navy"],
              series: [
                { name: "2024", values: [57245, 32560, 27239, 15261, 14745], color: "#64645E" },
                { name: "2025", values: [58909, 33269, 27701, 16085, 15123], color: "#D3992C" },
              ],
              source: "Defence Annual Report 2024-25 & 2023-24",
            },
            {
              id: "def-p-sep",
              type: "chart",
              title: "Yearly Separation Rate for ADF Service Branches and ADF Combined (2024–2025)",
              chartType: "grouped_bar",
              labels: ["Navy", "Total ADF", "Army", "Air Force"],
              series: [
                { name: "2024 (%)", values: [11.5, 9.5, 7.7, 7.6], color: "#64645E" },
                { name: "2025 (%)", values: [9.4, 7.9, 6.9, 6.2], color: "#D3992C" },
              ],
              valueSuffix: "%",
            },
            {
              id: "def-p-gender",
              type: "chart",
              title: "Proportion of Male and Female ADF and ADF Reserve Members in 2025",
              chartType: "grouped_bar",
              labels: ["Army", "ADF Reserves", "Total ADF", "Navy", "Air Force"],
              series: [
                { name: "Male (%)", values: [84.6, 81.3, 79.1, 75.7, 72.7], color: "#64645E" },
                { name: "Female (%)", values: [15.3, 18.7, 20.9, 24.3, 27.3], color: "#D3992C" },
              ],
              valueSuffix: "%",
            },
            {
              id: "def-p-fn",
              type: "chart",
              title: "Proportion of First Nations Participation in the ADF and ADF Reserves Across 2024 and 2025",
              chartType: "grouped_bar",
              labels: ["Total ADF", "ADF Reserves"],
              series: [
                { name: "2024 (%)", values: [3.9, 3.1], color: "#64645E" },
                { name: "2025 (%)", values: [3.9, 3.0], color: "#D3992C" },
              ],
              valueSuffix: "%",
            },
            {
              id: "def-p-loc",
              type: "state_explorer",
              title: "ADF Employees and Major Facilities by Location",
              defaultState: "NSW",
              states: defLocStates,
              nationalTableTitle: "ADF Workforce & Major Defence Bases by Jurisdiction",
              nationalHeaders: ["Jurisdiction", "Permanent ADF", "ADF Reserves", "Major Bases*"],
              nationalRows: Object.entries(defLocs).map(([k, v]) => [
                `${v.name} (${k})`,
                v.values[0],
                v.values[1],
                v.values[2],
              ]),
              source: "Defence Annual Report 2024-25, 2025",
              note: "*Major Defence bases. Total number of bases may change aligned with the Defence Estate Audit.",
            },
          ],
        }
      )
    );

    // Defence Workforce Insights & 4 supporting insight pages
    for (const [pt, title] of [
      ["defence_workforce_insights", "Defence Workforce Insights"],
      ["defence_emerging_technology", "Emerging Technology — Insight 1"],
      ["defence_emerging_technology_2", "Emerging Technology — Insight 2"],
      ["defence_transitioning_veterans", "Transitioning Veterans — Insight 1"],
      ["defence_transitioning_veterans_2", "Transitioning Veterans — Insight 2"],
    ] as const) {
      const html = await fetchRouteHtml(`/reports/${slug}/${pt}`);
      const extraBlocks: RichBlock[] = [];
      if (pt === "defence_workforce_insights") {
        extraBlocks.push({
          id: "def-wfi-themes",
          type: "link_cards",
          title: "Defence Workforce Insights",
          columns: 2,
          cards: [
            {
              eyebrow: "Theme 1 · 2 insights",
              title: "1. Emerging Technology",
              items: [
                {
                  number: "1",
                  eyebrow: "Theme One, Insight One",
                  title:
                    "Challenges in rapid adoption of emerging technology remains, due to significant security screening requirements for any new technology adoption. Limitations exist for the speed of being able to upskill employees in the use of any new technology.",
                  pageType: "defence_emerging_technology",
                },
                {
                  number: "2",
                  eyebrow: "Theme One, Insight Two",
                  title:
                    "Provisioning targeted training faster through short courses (often referred to as micro-credentials). Leveraging Vocational Education and Training Units of Competency could be effective in responding to emerging technologies.",
                  pageType: "defence_emerging_technology_2",
                },
              ],
            },
            {
              eyebrow: "Theme 2 · 2 insights",
              title: "2. Transitioning Veterans",
              items: [
                {
                  number: "1",
                  eyebrow: "Theme Two, Insight One",
                  title:
                    "The Vocational Education and Training (VET) system remains important for the ADF as it provides a national standard, with meaningful qualifications written by industry, for industry.",
                  pageType: "defence_transitioning_veterans",
                },
                {
                  number: "2",
                  eyebrow: "Theme Two, Insight Two",
                  title:
                    "Greater focus is required to support those transitioning (including veterans) to articulate the transferability of their VET qualifications and the relevance of their ADF experience to the civilian workforce. Where support is available, the information provided could be bolstered.",
                  pageType: "defence_transitioning_veterans_2",
                },
              ],
            },
          ],
        });
      }
      pages.push(
        makeRichPageFromHtml(html, pt, title, slug, {
          sortOrder: sort++,
          paletteMode: "SUB_SECTOR",
          subSectorCode: "DEF",
          replaceBlocksWith: pt === "defence_workforce_insights" ? extraBlocks : undefined,
        })
      );
    }

    // Defence Proposed Strategies
    {
      const html = await fetchRouteHtml(`/reports/${slug}/defence_workforce_strategies`);
      pages.push(
        makeRichPageFromHtml(
          html,
          "defence_workforce_strategies",
          "Defence 2026 Proposed Workforce Strategies",
          slug,
          {
            sortOrder: sort++,
            paletteMode: "SUB_SECTOR",
            subSectorCode: "DEF",
            replaceBlocksWith: [
              {
                id: "def-strats",
                type: "strategy_cards",
                columns: 1,
                items: [
                  {
                    badge: "Strategy 1",
                    color: "#D3992C",
                    title:
                      "Support Defence skill and capability requirements to operationalise drones",
                    workforceInsight: "Emerging technologies",
                    jscFunction: "Training Product Development",
                    objective:
                      "Map current Defence micro-credentials on drones and unmanned aerial systems (UAS) to existing units of competency from current VET qualifications.",
                    approach: [
                      "Identify whether current units of competency relating to UAS and drones meet the skills requirements of Defence. Should gaps be found, review/develop new units of competency to address these gaps.",
                    ],
                    deliverable: ["Mapping Report"],
                    impact:
                      "Support the Defence workforce by enabling rapid, targeted upskilling in UAS and drone related technologies.",
                    timing: "12-month project",
                    stakeholders: [
                      "Civil Aviation Safety Authority (CASA)",
                      "Industry Skills Australia",
                      "Defence Education, Learning and Training Authority (DELTA)",
                    ],
                  },
                  {
                    badge: "Strategy 2",
                    color: "#64645E",
                    title: "Support transition of Defence Veterans to civilian workforce",
                    workforceInsight: "Transitioning Veterans",
                    jscFunction: "Implementation, Promotion and Monitoring",
                    objective:
                      "Support Recommendation 83(c) of the Royal Commission into Defence and Veteran Suicide by supporting up-to-date information facilitated by state and territory initiatives that assist transitioning veterans.",
                    approach: [
                      "Collaborate with Defence to map ADF job roles and training to the Australian Qualifications Framework (AQF) levels and approximate equivalent civilian qualifications.",
                      "Develop material that translates military terminology into civilian contexts, to build collective understanding for both transitioning veterans and prospective civilian employers.",
                      "Collaborate with Defence to share this information back through state and territories to be included on their websites for veterans.",
                    ],
                    deliverable: ["Mapping Report", "Military Terminology Guide"],
                    impact:
                      "Support Recommendation 83(c) by providing information through Defence, states and territories that support veterans to translate their Defence skills and experience into civilian-recognised language.",
                    timing: "12-month project",
                    stakeholders: [
                      "Australian Public Service Academy",
                      "Defence Education, Learning and Training Authority (DELTA)",
                      "Department of Veterans' Affairs",
                      "State Training Authorities/Senior Responsible Officers",
                    ],
                  },
                ],
              },
            ],
          }
        )
      );
    }

    // Defence Update 2025 Strategies (5 projects), Existing Strategies (8), Federal Initiatives (22)
    {
      const html = await fetchRouteHtml(`/reports/${slug}/defence_update_2025_strategies`);
      const projects = (getAstConst(
        "src/components/reports/public-safety/views/PublicSafetyDefenceStrategyUpdatesView.tsx",
        "projects"
      ) || []) as Array<{
        number: string;
        completion: string;
        title: string;
        summary: string;
        update: string;
        bullets: string[];
        updateEnd: string;
        stakeholders: string[];
        ministerial: string;
        strategic: string;
        drivers: string[];
        connection: string | string[];
      }>;
      pages.push(
        makeRichPageFromHtml(
          html,
          "defence_update_2025_strategies",
          "2025 Defence Strategies Updates",
          slug,
          {
            sortOrder: sort++,
            paletteMode: "SUB_SECTOR",
            subSectorCode: "DEF",
            replaceBlocksWith: [
              buildMasterDetailFromArray(
                `Projects · ${projects.length} · Select to open`,
                projects.map((p) => ({
                  code: p.number,
                  eyebrow: `Completion: ${p.completion}`,
                  title: p.title,
                  badgeText: p.completion,
                  summaryParagraphs: p.summary.split(/\n+/).filter(Boolean),
                  detailSections: [
                    {
                      heading: "Update",
                      paragraphs: [p.update, p.updateEnd].filter(Boolean),
                      bullets: p.bullets?.length ? p.bullets : undefined,
                    },
                    {
                      heading: "Ministerial Priority",
                      paragraphs: [p.ministerial],
                    },
                    {
                      heading: "Public Skills Australia Strategic Plan",
                      paragraphs: [p.strategic],
                    },
                    {
                      heading: "Drivers of Change",
                      paragraphs: [],
                      bullets: p.drivers,
                    },
                  ],
                  tags: p.stakeholders,
                }))
              ),
            ],
          }
        )
      );
    }

    {
      const html = await fetchRouteHtml(`/reports/${slug}/defence_existing_strategies`);
      const strategies = (getAstConst(
        "src/components/reports/public-safety/views/PublicSafetyDefenceExistingStrategiesView.tsx",
        "strategies"
      ) || []) as Array<{
        number: string;
        owner: string;
        period: string;
        title: string;
        summary: unknown;
        consultation?: unknown;
        update2025?: unknown;
        update2026?: unknown;
      }>;
      const flattenCopy = (val: unknown): { paragraphs: string[]; bullets: string[] } => {
        if (typeof val === "string") return { paragraphs: val.split(/\n\n+/).map(cleanSpace).filter(Boolean), bullets: [] };
        if (Array.isArray(val)) {
          const paras: string[] = [];
          const bul: string[] = [];
          for (const item of val) {
            if (typeof item === "string") paras.push(item);
            else if (Array.isArray(item)) bul.push(...item.map(String));
          }
          return { paragraphs: paras, bullets: bul };
        }
        return { paragraphs: [], bullets: [] };
      };
      pages.push(
        makeRichPageFromHtml(
          html,
          "defence_existing_strategies",
          "Defence Existing Industry-Sector Strategies",
          slug,
          {
            sortOrder: sort++,
            paletteMode: "SUB_SECTOR",
            subSectorCode: "DEF",
            replaceBlocksWith: [
              buildMasterDetailFromArray(
                `Strategies · ${strategies.length} · Select to open`,
                strategies.map((s) => {
                  const sum = flattenCopy(s.summary);
                  const sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }> = [];
                  if (s.consultation) {
                    const c = flattenCopy(s.consultation);
                    sections.push({ heading: "Consultation and engagement", paragraphs: c.paragraphs, bullets: c.bullets.length ? c.bullets : undefined });
                  }
                  if (s.update2025) {
                    const u25 = flattenCopy(s.update2025);
                    sections.push({ heading: "2025 Workforce Strategies", paragraphs: u25.paragraphs, bullets: u25.bullets.length ? u25.bullets : undefined });
                  }
                  if (s.update2026) {
                    const u26 = flattenCopy(s.update2026);
                    sections.push({ heading: "2026 Workforce Strategies", paragraphs: u26.paragraphs, bullets: u26.bullets.length ? u26.bullets : undefined });
                  }
                  return {
                    code: s.number,
                    eyebrow: s.owner,
                    title: s.title,
                    badgeText: s.period,
                    summaryParagraphs: sum.paragraphs,
                    bullets: sum.bullets.length ? sum.bullets : undefined,
                    detailSections: sections,
                  };
                })
              ),
            ],
          }
        )
      );
    }

    {
      const html = await fetchRouteHtml(`/reports/${slug}/defence_federal_initiatives`);
      const initiatives = (getAstConst(
        "src/components/reports/public-safety/views/PublicSafetyDefenceFederalInitiativesView.tsx",
        "initiatives"
      ) || []) as Array<[string, string, string, number[]]>;
      pages.push(
        makeRichPageFromHtml(
          html,
          "defence_federal_initiatives",
          "Defence Veterans' Programs and Initiatives",
          slug,
          {
            sortOrder: sort++,
            paletteMode: "SUB_SECTOR",
            subSectorCode: "DEF",
            replaceBlocksWith: [
              buildMasterDetailFromArray(
                `Strategies · ${initiatives.length} · Select to open`,
                initiatives.map(([owner, title, desc, refs], idx) => ({
                  code: String(idx + 1).padStart(2, "0"),
                  eyebrow: owner,
                  title,
                  badgeText: owner,
                  summaryParagraphs: [
                    `${desc}${refs?.length ? refs.map((r) => `[[${r}]]`).join("") : ""}`,
                  ],
                }))
              ),
            ],
          }
        )
      );
    }
  }

  // ---- FIRE AND EMERGENCY SERVICES (FES) ----
  {
    const fesHtml = await fetchRouteHtml(`/reports/${slug}/fes`);
    pages.push(
      makeRichPageFromHtml(fesHtml, "fes", "Fire and Emergency Services Chapter", slug, {
        sortOrder: sort++,
        paletteMode: "SUB_SECTOR",
        subSectorCode: "FES",
      })
    );

    const fesOvHtml = await fetchRouteHtml(`/reports/${slug}/fes_industry_overview`);
    const fesYears = ["2019–2020", "2020–2021", "2021–2022", "2022–2023", "2023–2024", "2024–2025"];
    pages.push(
      makeRichPageFromHtml(
        fesOvHtml,
        "fes_industry_overview",
        "FES Industry-Sector Overview",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SUB_SECTOR",
          subSectorCode: "FES",
          extraBlocks: [
            {
              id: "fes-ov-acc",
              type: "accordions",
              title: "Fire and Emergency Services Workforce Datapoints",
              items: [
                {
                  id: "fes-dp-1",
                  title: "Demand for Services",
                  defaultOpen: true,
                  summaryParagraphs: [
                    "Demand for services: Demand for both firefighter and state and territory emergency services (SES) increased by 7.6 per cent from 488,242 (total combined emergency response activities) in 2019–20 to 525,346 in 2023–24.[[43]] 40 major emergency incidents were documented from July 2024 to June 2025 (an increase from 30 the previous year).[[44]]",
                  ],
                  blocks: [
                    {
                      id: "fes-ch-demand",
                      type: "chart",
                      title: "Combined Total Yearly Fire and Other Emergency Incidents Responded to Across Australia",
                      chartType: "line",
                      labels: fesYears,
                      series: [{ name: "Emergency Incidents", values: [488242, 466504, 515791, 509013, 525346, 574023], color: "#C9481A", dashed: true }],
                      source: "Productivity Commission, Emergency services for fire and other events – Tables 9A.6 and 9A.7, 2026",
                    },
                    {
                      id: "fes-ch-major",
                      type: "chart",
                      title: "Documented Major Emergency Incidents Australia",
                      chartType: "line",
                      labels: ["2022–2023", "2023–2024", "2024–2025"],
                      series: [{ name: "Major Incidents", values: [27, 30, 40], color: "#C9481A" }],
                      source: "Australian Institute for Disaster Resilience (AIDR), Major Incidents Report 2024–25, 2025",
                    },
                  ],
                },
                {
                  id: "fes-dp-2",
                  title: "Career and Volunteer firefighters and emergency services employees",
                  summaryParagraphs: [
                    "Career and Volunteer firefighters and emergency services employees: In the 20 years from August 2005 to August 2025, the career Fire and Emergency Services occupation (ANZSCO 4412) experienced a 65.9 per cent growth, outpacing the wider job market at 48.4 per cent.[[45]] This is supported by growth in student enrolments from 2019 to 2024 in the two core qualifications required for firefighters. Similarly, the total career operational and support emergency services personnel have experienced year-on-year increases since 2019–20.[[46]]",
                    "Volunteer services: Compared to career firefighting, total volunteer firefighter numbers (including support staff) decreased by nearly 12,000 volunteers from 2019–20 to 2024–25.[[48]] Similarly, SES has largely experienced year-on-year declines in total volunteers since 2019–20, in line with wider decline in volunteerism trends.[[49]]",
                    "Despite relative increases in career Firefighter and operational SES members from 2019–20 to 2024–25, in absolute terms, the increases in career employees are heavily negated by the decreases experienced in volunteer cohorts. Collectively, in the five years from 2019–2025, a total of 1,130 career Firefighters and SES members were added to Australia’s emergency response capability, while a total of 10,336 volunteers were lost.",
                  ],
                  blocks: [
                    {
                      id: "fes-ch-career-ff",
                      type: "chart",
                      title: "Career Firefighters (headcount)",
                      chartType: "line",
                      labels: fesYears,
                      series: [{ name: "Career Firefighters", values: [17952, 18205, 18468, 18422, 18939, 19130], color: "#C9481A", dashed: true }],
                    },
                    {
                      id: "fes-ch-vol-ff",
                      type: "chart",
                      title: "Total Fire Volunteers (headcount)",
                      chartType: "line",
                      labels: fesYears,
                      series: [{ name: "Fire Volunteers", values: [202011, 200830, 192774, 188586, 189041, 190042], color: "#AD271B", dashed: true }],
                    },
                    {
                      id: "fes-ch-ses-car",
                      type: "chart",
                      title: "Career Operational SES Employees (FTE)",
                      chartType: "line",
                      labels: fesYears,
                      series: [{ name: "Career SES (FTE)", values: [1673, 1720, 1821, 1912, 2186, 2136], color: "#C9481A", dashed: true }],
                    },
                    {
                      id: "fes-ch-ses-vol",
                      type: "chart",
                      title: "Total SES Volunteers (FTE)",
                      chartType: "line",
                      labels: fesYears,
                      series: [{ name: "SES Volunteers (FTE)", values: [24983, 25012, 24537, 24750, 24357, 26068], color: "#AD271B", dashed: true }],
                    },
                  ],
                },
                {
                  id: "fes-dp-3",
                  title: "Surf Life Saving",
                  summaryParagraphs: [
                    "Surf Life Saving: Across 2024–2025, Surf Life Saving provided a combined total of 1.95 million hours of lifesaving patrol activity, with New South Wales and Queensland accounting for more than 70 per cent of total hours served.[[50]] This enabled a combined total of 2.19 million preventative actions, along with 65,942 administrations of first aid and 8,207 rescues across both volunteer and career surf lifesavers.[[51]]",
                  ],
                  blocks: [
                    {
                      id: "fes-ch-surf-state",
                      type: "chart",
                      title: "Total Patrolling Hours of Surf Lifesavers in 2024/25 by State/Territory",
                      chartType: "bar",
                      labels: ["NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"],
                      series: [{ name: "Patrolling Hours", values: [802226, 40130, 594988, 99525, 22190, 244138, 149287], color: "#C9481A" }],
                      source: "Surf Life Saving Australia (SLSA), 2024/25 Annual Report, 2025",
                    },
                    {
                      id: "fes-ch-surf-split",
                      type: "chart",
                      title: "Total Patrolling Hours of Career and Volunteer Surf Lifesavers in 2024–25",
                      chartType: "bar",
                      labels: ["Volunteer", "Career"],
                      series: [{ name: "Patrolling Hours", values: [1469465, 483020], color: "#C9481A" }],
                    },
                  ],
                },
              ],
            },
          ],
        }
      )
    );

    // FES Industry Profile
    const fesProfPath =
      "src/components/reports/public-safety/views/PublicSafetyFesProfileView.tsx";
    const fesProfEnv = collectTopLevelVars(loadTsFile(fesProfPath));
    const fesProfHtml = await fetchRouteHtml(`/reports/${slug}/fes_industry_profile`);
    const fesJurData = (fesProfEnv.jurisdictionData || {}) as Record<
      string,
      [string, string, string][]
    >;
    const fesStates: Record<
      string,
      {
        code: string;
        name: string;
        headers: string[];
        rows: string[][];
      }
    > = {};
    for (const [k, rows] of Object.entries(fesJurData)) {
      fesStates[k] = {
        code: k,
        name: k,
        headers: ["Workforce Cohort", "Career", "Volunteer"],
        rows: rows.map((r) => [...r]),
      };
    }

    pages.push(
      makeRichPageFromHtml(
        fesProfHtml,
        "fes_industry_profile",
        "FES Industry Profile",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SUB_SECTOR",
          subSectorCode: "FES",
          replaceBlocksWith: [
            {
              id: "fes-p-recruit-enrol",
              type: "chart",
              title: "Primary Firefighter Recruit Qualifications — Enrolments (2019–2024)",
              chartType: "grouped_bar",
              labels: fesProfEnv.years as string[],
              series: [
                { name: "Certificate II in Public Safety (Firefighting and Emergency Operations)", values: fesProfEnv.certificateTwo as number[], color: "#AD271B" },
                { name: "Certificate III in Public Safety (Firefighting and Emergency Operations)", values: fesProfEnv.certificateThree as number[], color: "#DE6B52" },
              ],
              source: "NCVER, Total VET students and courses: VOCSTATS, 2026",
            },
            {
              id: "fes-p-ops-enrol",
              type: "chart",
              title: "Firefighting Operations Qualifications — Enrolments (2019–2024)",
              chartType: "grouped_bar",
              labels: fesProfEnv.years as string[],
              series: [
                { name: "Certificate II Operations", values: fesProfEnv.operationsCertificateTwoEnrolments as number[], color: "#AD271B" },
                { name: "Certificate III Operations", values: fesProfEnv.operationsCertificateThreeEnrolments as number[], color: "#DE6B52" },
              ],
            },
            {
              id: "fes-p-ses-enrol",
              type: "chart",
              title: "SES Qualifications — Enrolments (2019–2024)",
              chartType: "grouped_bar",
              labels: fesProfEnv.years as string[],
              series: [
                { name: "Certificate II (SES)", values: fesProfEnv.sesCertificateThreeEnrolments as number[], color: "#AD271B" },
                { name: "Certificate III (SES Rescue)", values: fesProfEnv.sesCertificateThreeRescueEnrolments as number[], color: "#DE6B52" },
              ],
            },
            {
              id: "fes-p-surf-enrol",
              type: "chart",
              title: "Surf Life Saving Qualifications — Enrolments (2019–2024)",
              chartType: "grouped_bar",
              labels: fesProfEnv.years as string[],
              series: [
                { name: "Certificate II (Aquatic Rescue)", values: fesProfEnv.aquaticRescueEnrolments as number[], color: "#AD271B" },
                { name: "Certificate III (Aquatic Search & Rescue)", values: fesProfEnv.aquaticSearchRescueEnrolments as number[], color: "#DE6B52" },
              ],
            },
            {
              id: "fes-p-jur",
              type: "state_explorer",
              title: "Fire and Emergency Services Workforce by Jurisdiction",
              defaultState: "WA",
              states: fesStates,
            },
          ],
        }
      )
    );

    // FES Workforce Insights + 5 Insight Pages + Training Products Appendix B
    for (const [pt, title] of [
      ["fes_workforce_insights", "FES Workforce Insights"],
      ["fes_disaster_recovery", "Disaster Recovery — Insight 1"],
      ["fes_disaster_recovery_2", "Disaster Recovery — Insight 2"],
      ["fes_disaster_recovery_3", "Disaster Recovery — Insight 3"],
      ["fes_surf_life_saving_first_aid", "Surf Life Saving First Aid"],
      ["fes_hazardous_materials", "Hazardous Materials"],
      [
        "fes_disaster_recovery_training_products",
        "Disaster Recovery Training Products (Appendix B)",
      ],
    ] as const) {
      const html = await fetchRouteHtml(`/reports/${slug}/${pt}`);
      const extraBlocks: RichBlock[] = [];
      let replaceBlocks: RichBlock[] | undefined;

      if (pt === "fes_workforce_insights") {
        replaceBlocks = [
          {
            id: "fes-wfi-themes",
            type: "link_cards",
            title: "Fire and Emergency Services Workforce Insights",
            columns: 3,
            cards: [
              {
                eyebrow: "Theme 1 · 3 insights",
                title: "1. Disaster Recovery",
                items: [
                  {
                    number: "1",
                    eyebrow: "Theme One, Insight One",
                    title:
                      "Specialist disaster recovery functions are operationally focused, a more contemporary approach now requires capabilities related to the unique aspects of working with communities that may be grieving or socially, emotionally and financially impacted.",
                    pageType: "fes_disaster_recovery",
                  },
                  {
                    number: "2",
                    eyebrow: "Theme One, Insight Two",
                    title:
                      "Challenges in access to nationally accredited disaster recovery training products leads to inconsistencies in recovery outcomes, reduced community trust and limits the ability of communities to rebuild from the impacts of disasters.",
                    pageType: "fes_disaster_recovery_2",
                  },
                  {
                    number: "3",
                    eyebrow: "Theme One, Insight Three",
                    title:
                      "Australia is experiencing a critical challenge in maintaining capability to use fire effectively in the landscape, particularly for complex prescribed burning and backburning during bushfire suppression.",
                    pageType: "fes_disaster_recovery_3",
                  },
                ],
              },
              {
                eyebrow: "Theme 2 · 1 insight",
                title: "2. Surf Life Saving First Aid",
                items: [
                  {
                    number: "1",
                    eyebrow: "Theme Two, Insight One",
                    title:
                      "The HLTAID010 unit of competency is an entry-level first aid training product that is no longer meeting the operational needs for volunteer surf lifesavers.",
                    pageType: "fes_surf_life_saving_first_aid",
                  },
                ],
              },
              {
                eyebrow: "Theme 3 · 1 insight",
                title: "3. Hazardous Materials",
                items: [
                  {
                    number: "1",
                    eyebrow: "Theme Three, Insight One",
                    title:
                      "Incidents involving hazardous materials are becoming increasingly important while current training may be limiting in some Fire and Emergency Services organisations ability to deliver this type of service.",
                    pageType: "fes_hazardous_materials",
                  },
                ],
              },
            ],
          },
        ];
      } else if (pt === "fes_disaster_recovery") {
        extraBlocks.push({
          id: "fes-dr1-chart",
          type: "chart",
          title: "Major Emergency Incidents Reported by the Australian Institute for Disaster Resilience",
          chartType: "line",
          labels: ["2022–2023", "2023–2024", "2024–2025"],
          series: [{ name: "Major Incidents", values: [27, 30, 40], color: "#AD271B" }],
        });
      } else if (pt === "fes_surf_life_saving_first_aid") {
        extraBlocks.push({
          id: "fes-fa-chart",
          type: "chart",
          title: "First Aid Treatments Administered by Surf Lifesavers",
          chartType: "line",
          labels: ["2022–2023", "2023–2024", "2024–2025"],
          series: [{ name: "First Aid Treatments", values: [21828, 25262, 34394], color: "#AD271B" }],
        });
      } else if (pt === "fes_hazardous_materials") {
        extraBlocks.push({
          id: "fes-haz-chart",
          type: "chart",
          title: "Yearly Enrolments for all Three Hazardous Materials Units of Competency Since 2020",
          chartType: "grouped_bar",
          labels: ["2020 (Start)", "2024 (End)"],
          series: [
            { name: "PUAFIR306 Identify, detect and monitor hazardous materials at an incident", values: [1010, 2810], color: "#C9481A" },
            { name: "PUAFIR308 Employ personal protection at a hazardous materials incident", values: [850, 2320], color: "#456130" },
            { name: "PUAFIR324 Render hazardous materials incidents safe", values: [1115, 3130], color: "#AD271B" },
          ],
          source: "NCVER, Total VET students and courses 2024: DataBuilder",
        });
      }

      pages.push(
        makeRichPageFromHtml(html, pt, title, slug, {
          sortOrder: sort++,
          paletteMode: "SUB_SECTOR",
          subSectorCode: "FES",
          replaceBlocksWith: replaceBlocks,
          extraBlocks,
        })
      );
    }

    // FES Strategies + Update 2025 (5 projects) + Existing (5 strategies)
    {
      const html = await fetchRouteHtml(`/reports/${slug}/fes_workforce_strategies`);
      const fesStrats = (getAstConst(
        "src/components/reports/public-safety/views/PublicSafetyFesWorkforceStrategiesView.tsx",
        "strategies"
      ) || []) as Array<{
        number: string;
        title: string;
        insight: string;
        jsc: string;
        objective: string;
        approach: string;
        deliverables: string[];
        impact: string;
        timing: string;
        stakeholders: string[];
      }>;
      pages.push(
        makeRichPageFromHtml(
          html,
          "fes_workforce_strategies",
          "FES 2026 Proposed Workforce Strategies",
          slug,
          {
            sortOrder: sort++,
            paletteMode: "SUB_SECTOR",
            subSectorCode: "FES",
            replaceBlocksWith: [
              {
                id: "fes-strats",
                type: "strategy_cards",
                columns: 1,
                items: fesStrats.map((st, idx) => ({
                  badge: st.number,
                  color: "#C9481A",
                  title: st.title,
                  workforceInsight: st.insight,
                  jscFunction: st.jsc,
                  objective: st.objective,
                  approach: [st.approach],
                  deliverable: st.deliverables,
                  impact: st.impact,
                  timing: st.timing,
                  stakeholders: st.stakeholders,
                  appendixPageType:
                    idx === 0 ? "fes_disaster_recovery_training_products" : undefined,
                  appendixLabel: idx === 0 ? "Appendix B – training products" : undefined,
                })),
              },
            ],
          }
        )
      );
    }

    {
      const html = await fetchRouteHtml(`/reports/${slug}/fes_update_2025_strategies`);
      const projects = (getAstConst(
        "src/components/reports/public-safety/views/PublicSafetyFesStrategyUpdatesView.tsx",
        "projects"
      ) || []) as Array<{
        completion: string;
        title: string;
        summary: string;
        update: string | string[];
        stakeholders: string[];
        priority: string;
        strategic: string;
        driver: string;
      }>;
      pages.push(
        makeRichPageFromHtml(
          html,
          "fes_update_2025_strategies",
          "FES Update on 2025 Strategies",
          slug,
          {
            sortOrder: sort++,
            paletteMode: "SUB_SECTOR",
            subSectorCode: "FES",
            replaceBlocksWith: [
              buildMasterDetailFromArray(
                `Projects · ${projects.length} · Select to open`,
                projects.map((p, idx) => ({
                  code: `0${idx + 1}`,
                  eyebrow: `Completion: ${p.completion}`,
                  title: p.title,
                  badgeText: p.completion,
                  summaryParagraphs: [p.summary],
                  detailSections: [
                    {
                      heading: "Update",
                      paragraphs: Array.isArray(p.update)
                        ? p.update
                        : p.update.split(/\n+/).filter(Boolean),
                    },
                    { heading: "Ministerial Priority", paragraphs: [p.priority] },
                    { heading: "Public Skills Australia Strategic Plan", paragraphs: [p.strategic] },
                    { heading: "Drivers of Change", paragraphs: [p.driver] },
                  ],
                  tags: p.stakeholders,
                }))
              ),
            ],
          }
        )
      );
    }

    {
      const html = await fetchRouteHtml(`/reports/${slug}/fes_existing_strategies`);
      const fesEsSf = loadTsFile(
        "src/components/reports/public-safety/views/PublicSafetyFesExistingStrategiesView.tsx"
      );
      const fesEsEnv = collectTopLevelVars(fesEsSf);
      const strats = (fesEsEnv.strategies || []) as Array<{
        owner: string;
        title: string;
        period: string;
      }>;
      const contentArr = (fesEsEnv.content || []) as Array<{
        summary: string;
        notes: string[];
      }>;
      pages.push(
        makeRichPageFromHtml(
          html,
          "fes_existing_strategies",
          "FES Existing Industry-Sector Strategies",
          slug,
          {
            sortOrder: sort++,
            paletteMode: "SUB_SECTOR",
            subSectorCode: "FES",
            replaceBlocksWith: [
              buildMasterDetailFromArray(
                `Strategies · ${strats.length} · Select to open`,
                strats.map((st, i) => {
                  const c = contentArr[i] || { summary: "", notes: [] };
                  const sum = htmlFragmentToParagraphsAndBullets(String(c.summary));
                  const labels = [
                    "Consultation and engagement",
                    "2025 Workforce Strategies",
                    "2026 Workforce Strategies",
                  ];
                  return {
                    code: `0${i + 1}`,
                    eyebrow: st.owner,
                    title: st.title,
                    badgeText: st.period,
                    summaryParagraphs: sum.paragraphs,
                    bullets: sum.bullets.length ? sum.bullets : undefined,
                    detailSections: (c.notes || []).map((nHtml, ni) => {
                      const p = htmlFragmentToParagraphsAndBullets(String(nHtml));
                      return {
                        heading: labels[ni] || `Note ${ni + 1}`,
                        paragraphs: p.paragraphs,
                        bullets: p.bullets.length ? p.bullets : undefined,
                      };
                    }),
                  };
                })
              ),
            ],
          }
        )
      );
    }
  }

  // ---- POLICE SUB-SECTOR (POL) ----
  {
    const polHtml = await fetchRouteHtml(`/reports/${slug}/police`);
    pages.push(
      makeRichPageFromHtml(polHtml, "police", "Police Chapter", slug, {
        sortOrder: sort++,
        paletteMode: "SUB_SECTOR",
        subSectorCode: "POL",
      })
    );

    const polOvHtml = await fetchRouteHtml(`/reports/${slug}/police_industry_overview`);
    const jurCharts = (getAstConst(
      "src/components/reports/public-safety/views/PublicSafetyPoliceOverviewView.tsx",
      "jurisdictionCharts"
    ) || []) as Array<{ name: string; values: number[] }>;
    const polYears = ["2019-2020", "2020-2021", "2021-2022", "2022-2023", "2023-2024", "2024-2025"];
    pages.push(
      makeRichPageFromHtml(
        polOvHtml,
        "police_industry_overview",
        "Police Industry-Sector Overview",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SUB_SECTOR",
          subSectorCode: "POL",
          extraBlocks: [
            {
              id: "pol-ov-nat",
              type: "chart",
              title: "Yearly National Sworn Police Officer FTE – AUSTRALIA",
              chartType: "line",
              labels: polYears,
              series: [
                {
                  name: "Sworn Police Officer FTE",
                  values: [59750, 61031, 60589, 59376, 59359, 59600],
                  color: "#1763AD",
                },
              ],
              source: "Productivity Commission, Police services, Table 6A.2, 2026",
            },
            {
              id: "pol-ov-jurs",
              type: "accordions",
              title: "State/Territory Sworn Police Officer FTE Breakdowns (2019–2025)",
              items: jurCharts.map((jc, idx) => ({
                id: `pol-jc-${idx}`,
                title: `Yearly Sworn Police Officer FTE – ${jc.name}`,
                defaultOpen: idx === 0,
                blocks: [
                  {
                    id: `pol-j-ch-${idx}`,
                    type: "chart",
                    title: jc.name,
                    chartType: "line",
                    labels: polYears,
                    series: [{ name: "Sworn FTE", values: jc.values, color: "#1763AD" }],
                    source: "Productivity Commission, Police services, Table 6A.2, 2026",
                  },
                ],
              })),
            },
          ],
        }
      )
    );

    const polProfHtml = await fetchRouteHtml(`/reports/${slug}/police_industry_profile`);
    const polEmpData = (getAstConst(
      "src/components/reports/public-safety/views/PublicSafetyPoliceProfileView.tsx",
      "policeEmployeeData"
    ) || {}) as Record<string, string[]>;
    const polRows = [
      "Sworn operational",
      "Sworn non-operational",
      "Civilian operational (includes other)",
      "Civilian non-operational (includes other)",
    ];
    const polStates: Record<
      string,
      { code: string; name: string; headers: string[]; rows: string[][] }
    > = {};
    for (const [st, vals] of Object.entries(polEmpData)) {
      polStates[st] = {
        code: st,
        name: st,
        headers: ["Category", "2025"],
        rows: polRows.map((lbl, idx) => [lbl, vals[idx] || ""]),
      };
    }

    pages.push(
      makeRichPageFromHtml(
        polProfHtml,
        "police_industry_profile",
        "Police Industry Profile",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "SUB_SECTOR",
          subSectorCode: "POL",
          replaceBlocksWith: [
            {
              id: "pol-p-fn",
              type: "chart",
              title: "Yearly First Nations Proportion of Police Employees",
              chartType: "line",
              labels: ["2020-2021", "2021-2022", "2022-2023", "2023-2024", "2024-2025"],
              series: [
                { name: "Operational Staff (%)", values: [2.3, 2.4, 2.4, 2.5, 2.6], color: "#1C67AD" },
                { name: "Total Staff (%)", values: [2.3, 2.3, 2.3, 2.4, 2.5], color: "#5B99D2" },
              ],
              valueSuffix: "%",
            },
            {
              id: "pol-p-fem",
              type: "chart",
              title: "Yearly Female Gender Proportion of Police Staff and all Police Employees",
              chartType: "line",
              labels: ["2020-2021", "2021-2022", "2022-2023", "2023-2024", "2024-2025"],
              series: [
                { name: "Sworn Operational (%)", values: [26.7, 27.3, 27.7, 27.9, 27.8], color: "#1C67AD" },
                { name: "Total Staff (%)", values: [35, 34.5, 35.1, 35.8, 35.9], color: "#5B99D2" },
              ],
              valueSuffix: "%",
            },
            {
              id: "pol-p-map",
              type: "state_explorer",
              title: "National Police Employees by State and Territory in 2025",
              defaultState: "WA",
              states: polStates,
            },
          ],
        }
      )
    );

    // Police Workforce Insights + 3 Insight Pages
    for (const [pt, title] of [
      ["police_workforce_insights", "Police Workforce Insights"],
      ["police_digital_forensics", "Digital Forensics — Insight 1"],
      ["police_digital_forensics_2", "Digital Forensics — Insight 2"],
      ["police_regional_remote_leadership", "Rural, Regional and Remote Police Leadership"],
    ] as const) {
      const html = await fetchRouteHtml(`/reports/${slug}/${pt}`);
      const replaceBlocks: RichBlock[] | undefined =
        pt === "police_workforce_insights"
          ? [
              {
                id: "pol-wfi-themes",
                type: "link_cards",
                title: "Police Workforce Insights",
                columns: 2,
                cards: [
                  {
                    eyebrow: "Theme 1 · 2 insights",
                    title: "1. Digital Forensics",
                    items: [
                      {
                        number: "1",
                        eyebrow: "Theme One, Insight One",
                        title:
                          "Skills shortages and strong demand for similar skills may require the establishment of multiple entry pathways for digital forensic professionals into policing.",
                        pageType: "police_digital_forensics",
                      },
                      {
                        number: "2",
                        eyebrow: "Theme One, Insight Two",
                        title:
                          "The VET system is well established to deliver a nationally consistent approach to training, however, the Police Training Package currently does not contain a qualification specialising in digital forensics.",
                        pageType: "police_digital_forensics_2",
                      },
                    ],
                  },
                  {
                    eyebrow: "Theme 2 · 1 insight",
                    title: "2. Rural, Regional and Remote Police Leadership",
                    items: [
                      {
                        number: "1",
                        eyebrow: "Theme Two, Insight One",
                        title:
                          "Police officers being required to take on more leadership responsibilities earlier in their careers, particularly in regional, rural and remote areas, where workforce shortages are more pronounced. This may require more support in accelerating leadership skills development.",
                        pageType: "police_regional_remote_leadership",
                      },
                    ],
                  },
                ],
              },
            ]
          : undefined;
      pages.push(
        makeRichPageFromHtml(html, pt, title, slug, {
          sortOrder: sort++,
          paletteMode: "SUB_SECTOR",
          subSectorCode: "POL",
          replaceBlocksWith: replaceBlocks,
        })
      );
    }

    // Police Proposed Strategy
    {
      const html = await fetchRouteHtml(`/reports/${slug}/police_workforce_strategies`);
      pages.push(
        makeRichPageFromHtml(
          html,
          "police_workforce_strategies",
          "Police 2026 Proposed Strategy",
          slug,
          {
            sortOrder: sort++,
            paletteMode: "SUB_SECTOR",
            subSectorCode: "POL",
            replaceBlocksWith: [
              {
                id: "pol-strat-1",
                type: "strategy_cards",
                columns: 1,
                items: [
                  {
                    badge: "Strategy 1",
                    color: "#0D71A3",
                    title: "Develop Training Products for Digital Forensics",
                    workforceInsight: "Digital Forensics",
                    jscFunction: "Training Product Development",
                    objective:
                      "Develop a digital forensics qualification to be included in the POL Police Training Package.",
                    approach: [
                      "This strategy will engage the Australia New Zealand Policing Advisory Agency (ANZPAA) and the National Institute of Forensic Science to develop a digital forensics qualification.",
                      "The approach will be to work through ANZPAA to engage subject matter experts through specialist advisory groups.",
                    ],
                    deliverable: ["Accredited Training Products"],
                    impact:
                      "Develop nationally consistent approach to training digital forensics for policing and support addressing an area of skills shortage.",
                    timing: "18-month project",
                    stakeholders: [
                      "ANZPAA",
                      "National Institute of Forensic Science (NIFS)",
                      "State/Territory Police organisations and Australian Federal Police",
                      "Forensic Services South Australia",
                      "ACT Government Analytical Laboratory",
                      "Canberra Institute of Technology",
                    ],
                  },
                ],
              },
            ],
          }
        )
      );
    }

    // Police Update 2025 Strategies (3 projects)
    {
      const html = await fetchRouteHtml(`/reports/${slug}/police_update_2025_strategies`);
      const projects = (getAstConst(
        "src/components/reports/public-safety/views/PublicSafetyPoliceStrategyUpdatesView.tsx",
        "projects"
      ) || []) as Array<{
        completion: string;
        title: string;
        summary: string;
        update: string;
        bullets: string[];
        secondUpdate: string;
        secondBullets: string[];
        futureUpdate: string;
        stakeholders: string[];
        priority: string;
        strategic: string;
        driver: string;
        connection: string;
      }>;
      pages.push(
        makeRichPageFromHtml(
          html,
          "police_update_2025_strategies",
          "Police Update on 2025 Strategies",
          slug,
          {
            sortOrder: sort++,
            paletteMode: "SUB_SECTOR",
            subSectorCode: "POL",
            replaceBlocksWith: [
              buildMasterDetailFromArray(
                `Strategies · ${projects.length} · Select to open`,
                projects.map((p, idx) => ({
                  code: `0${idx + 1}`,
                  eyebrow: `Completion: ${p.completion}`,
                  title: p.title,
                  badgeText: p.completion,
                  summaryParagraphs: [p.summary],
                  detailSections: [
                    {
                      heading: "Update",
                      paragraphs: [p.update, p.secondUpdate, p.futureUpdate].filter(Boolean),
                      bullets: [...(p.bullets || []), ...(p.secondBullets || [])],
                    },
                    { heading: "Ministerial Priority", paragraphs: [p.priority] },
                    { heading: "Public Skills Australia Strategic Plan", paragraphs: [p.strategic] },
                    { heading: "Drivers of Change", paragraphs: [p.driver] },
                  ],
                  tags: p.stakeholders,
                }))
              ),
            ],
          }
        )
      );
    }

    // Police Existing Strategies (12 strategies via AST)
    {
      const html = await fetchRouteHtml(`/reports/${slug}/police_existing_strategies`);
      const polEsSf = loadTsFile(
        "src/components/reports/public-safety/views/PublicSafetyPoliceExistingStrategiesView.tsx"
      );
      const strats = (getAstConst(
        "src/components/reports/public-safety/views/PublicSafetyPoliceExistingStrategiesView.tsx",
        "strategies"
      ) || []) as Array<{ owner: string; publisher?: string; title: string; period: string }>;

      const items = strats.map((st, idx) => {
        const frag = evalComponentBodyHtml(polEsSf, undefined, {
          slug,
          report: { slug, title: "2026 Public Safety Workforce Insights Report" },
          active: idx,
          setActive: () => {},
        });
        const $f = cheerio.load(frag);
        const panelHtml = $f("#police-existing-strategy-panel").html() || frag;
        const parsed = htmlFragmentToParagraphsAndBullets(panelHtml);
        return {
          code: String(idx + 1).padStart(2, "0"),
          eyebrow: st.publisher || st.owner,
          title: st.title,
          badgeText: st.period,
          summaryParagraphs: parsed.paragraphs,
          bullets: parsed.bullets.length ? parsed.bullets : undefined,
        };
      });

      pages.push(
        makeRichPageFromHtml(
          html,
          "police_existing_strategies",
          "Police Existing Industry-Sector Strategies",
          slug,
          {
            sortOrder: sort++,
            paletteMode: "SUB_SECTOR",
            subSectorCode: "POL",
            replaceBlocksWith: [
              buildMasterDetailFromArray(
                `Strategies · ${items.length} · Select to open`,
                items
              ),
            ],
          }
        )
      );
    }
  }

  // ---- CROSS-SECTOR STRATEGIES & TRAILING PAGES ----
  {
    const html = await fetchRouteHtml(
      `/reports/${slug}/police_proposed_strategies_summary`
    );
    const cardPath =
      "src/components/reports/public-safety/views/PublicSafetyProposedStrategyCards.tsx";
    const cardEnv = collectTopLevelVars(loadTsFile(cardPath));
    const detail = (cardEnv.detailSections || []) as Array<Record<string, unknown>>;
    const compact = (cardEnv.compactStrategies || []) as Array<Record<string, unknown>>;
    const allCards = [...detail, ...compact].map((c) => ({
      sectorLabel: (c.sector as string) || undefined,
      color: (c.colour as string) || undefined,
      badge: String(c.label || ""),
      title: String(c.title || ""),
      intro: String(c.intro || c.text || ""),
      workforceInsight: String(c.insight || ""),
      jscFunction: String(c.jsc || ""),
      objective: String(c.objective || ""),
      approach: [
        cleanSpace(
          cheerio.load(`<div>${String(c.approach || "")}</div>`)("div").text()
        ),
      ].filter(Boolean),
      deliverable: (c.deliverables as string[]) || [],
      impact: String(c.impact || ""),
      timing: String(c.timing || ""),
      stakeholders: (c.stakeholders as string[]) || [],
    }));

    pages.push(
      makeRichPageFromHtml(
        html,
        "police_proposed_strategies_summary",
        "Proposed Strategies Summary",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "GLOBAL_PSA",
          replaceBlocksWith: [
            {
              id: "ps-summary-cards",
              type: "strategy_cards",
              columns: 3,
              items: allCards,
            },
          ],
        }
      )
    );
  }

  {
    const html = await fetchRouteHtml(`/reports/${slug}/police_federal_initiatives`);
    const fedSf = loadTsFile(
      "src/components/reports/public-safety/views/PublicSafetyFederalInitiativesView.tsx"
    );
    const list = (getAstConst(
      "src/components/reports/public-safety/views/PublicSafetyFederalInitiativesView.tsx",
      "initiatives"
    ) || []) as Array<{ owner: string; title: string }>;

    const items = list.map((it, idx) => {
      const frag = evalComponentBodyHtml(fedSf, undefined, {
        slug,
        report: { slug, title: "2026 Public Safety Workforce Insights Report" },
        active: idx,
        setActive: () => {},
      });
      const $f = cheerio.load(frag);
      const $card = $f("article .rounded-xl").first().length
        ? $f("article .rounded-xl").first()
        : $f("article").first();
      $card.find("h2").first().remove();
      const parsed = htmlFragmentToParagraphsAndBullets($card.html() || frag);
      return {
        code: String(idx + 1).padStart(2, "0"),
        eyebrow: it.owner,
        title: it.title,
        summaryParagraphs: parsed.paragraphs,
        bullets: parsed.bullets.length ? parsed.bullets : undefined,
      };
    });

    pages.push(
      makeRichPageFromHtml(
        html,
        "police_federal_initiatives",
        "Commonwealth Government Initiatives",
        slug,
        {
          sortOrder: sort++,
          paletteMode: "GLOBAL_PSA",
          replaceBlocksWith: [
            buildMasterDetailFromArray(
              `Strategies · ${items.length} · Select to open`,
              items
            ),
          ],
        }
      )
    );
  }

  for (const [pt, title] of [
    ["looking_forward", "2027 and Beyond"],
    ["downloads", "Downloads and References"],
  ] as const) {
    const html = await fetchRouteHtml(`/reports/${slug}/${pt}`);
    const page = makeRichPageFromHtml(html, pt, title, slug, {
      sortOrder: sort++,
      paletteMode: "SECTOR",
    });
    if (pt === "downloads") {
      const blocks = (page.content.blocks as RichBlock[]) || [];
      blocks.unshift({
        id: "ps-dl-card",
        type: "downloads_list",
        currentReportTitle: "2026 Public Safety Workforce Insights Report",
        currentReportDescription:
          "Download the full Public Safety Workforce Insights Report in PDF format.",
        currentPdfUrl: pdfUrl,
        previousReports: [
          {
            year: "2025",
            title: "2025 Public Safety Workforce Insights Report",
            url: "https://publicskillsaustralia.org.au",
          },
        ],
      });
      page.content.blocks = blocks;
    }
    pages.push(page);
  }

  return {
    sectorCode: "public-safety",
    year: 2026,
    title: "2026 Public Safety Workforce Insights Report",
    slug,
    shortDescription: "Defence · Fire and Emergency Services · Police",
    coverImageUrl: "/images/reports/public-safety-card-background.webp",
    pdfFileUrl: pdfUrl,
    previousPdfs: [
      {
        year: "2025",
        title: "2025 Public Safety Workforce Insights Report",
        url: "https://publicskillsaustralia.org.au",
      },
    ],
    psaSectorPageUrl: "https://publicskillsaustralia.org.au/workforce-plans",
    contactUrl: "https://publicskillsaustralia.org.au/contact",
    landingIntroDesc:
      "For readers who want the report background — how it was developed, the methodology and the full report structure.",
    landingExecDesc:
      "Straight to the key insights and strategies on one page, built for large screens and briefings.",
    pages,
  };
}

// =========================================================================
// 6. Main Orchestrator & Quality Verification
// =========================================================================

async function main() {
  console.log("Extracting 100% static 2026 report content into seed-data-2026.json...");
  const { reused, child } = await ensureNextServer();
  if (reused) {
    console.log("Using existing Next.js server on port 3099");
  } else {
    console.log("Started temporary Next.js SSR server on port 3099");
  }

  try {
    const reports: ExtractedReport[] = [];
    reports.push(await extractLocalGovernment());
    reports.push(await extractFederalState());
    reports.push(await extractCorrectionalServices());
    reports.push(await extractPublicSafety());

    // Build deduplicated sourceLinks across all extracted footnotes
    const sourceLinksMap = new Map<
      string,
      { label: string; sourceName: string; url: string; openInNewTab: boolean }
    >();
    let totalPages = 0;
    let emptyPages = 0;

    for (const r of reports) {
      totalPages += r.pages.length;
      for (const p of r.pages) {
        const blocks = Array.isArray(p.content.blocks)
          ? (p.content.blocks as unknown[])
          : [];
        const lead = Array.isArray(p.content.leadParagraphs)
          ? (p.content.leadParagraphs as unknown[])
          : [];
        const isLgStaticTemplate =
          p.content.renderMode === "lg_static_template" &&
          typeof p.content.lgTemplate === "string" &&
          p.content.lgTemplate.trim().length > 0 &&
          Object.keys(p.content).length > 2;
        if (
          p.pageType !== "transition" &&
          !isLgStaticTemplate &&
          blocks.length === 0 &&
          lead.length === 0
        ) {
          console.warn(`WARNING: Empty content on ${r.slug}/${p.pageType}`);
          emptyPages++;
        }
        for (const fn of p.footnotes) {
          if (fn.url && !sourceLinksMap.has(fn.text)) {
            sourceLinksMap.set(fn.text, {
              label: fn.text.slice(0, 200),
              sourceName: fn.sourceName.slice(0, 120),
              url: fn.url,
              openInNewTab: true,
            });
          }
        }
      }
      console.log(`  - ${r.slug}: ${r.pages.length} pages`);
    }

    const payload = {
      generatedAt: new Date().toISOString(),
      reports,
      sourceLinks: Array.from(sourceLinksMap.values()),
    };

    fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), "utf8");
    console.log(
      `Done! Extracted ${reports.length} reports, ${totalPages} pages (${emptyPages} warnings), ${sourceLinksMap.size} unique source links -> ${OUT_FILE}`
    );

    if (emptyPages > 0) {
      throw new Error(`Extraction failed: ${emptyPages} page(s) have empty content!`);
    }
  } finally {
    if (!reused) {
      killProcessTree(child);
      console.log("Stopped temporary Next.js SSR server on port 3099");
    }
  }
}

main().catch((err) => {
  console.error("Extraction error:", err);
  process.exit(1);
});
