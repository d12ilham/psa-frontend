import type { ReactNode } from "react";
import sourceLinks from "../data/sourceLinks.json";
import PublicSafetySourceLink from "./PublicSafetySourceLink";

type Source = { title: string; href: string; unavailable?: boolean };
type Range = { start: number; end: number; href: string };

const numberedLinks: Record<string, Source[]> = sourceLinks.citations;
const captionLinks = [...sourceLinks.captions, ...sourceLinks.supplemental, ...Object.values(numberedLinks).flat()];

// Ignore typographic punctuation while retaining offsets into the unchanged copy.
function normalise(text: string) {
  const offsets: number[] = [];
  let value = "";
  for (let index = 0; index < text.length; index++) {
    if (/[a-z0-9]/i.test(text[index])) {
      value += text[index].toLowerCase();
      offsets.push(index);
    }
  }
  return { value, offsets };
}

export function getPublicSafetySourceRanges(text: string, number?: number | string): Range[] {
  const candidates: Source[] = (number === undefined ? captionLinks : numberedLinks[String(number)] ?? [])
    .filter((source: Source) => !source.unavailable);
  const normalised = normalise(text);
  const ranges: Range[] = [];
  const titles = [...candidates].sort((a, b) => normalise(b.title).value.length - normalise(a.title).value.length);

  for (const { title, href } of titles) {
    const needle = normalise(title).value;
    if (needle.length < 8) continue;
    let offset = normalised.value.indexOf(needle);
    while (offset !== -1) {
      const start = normalised.offsets[offset];
      const end = normalised.offsets[offset + needle.length - 1] + 1;
      if (!ranges.some((range) => start < range.end && end > range.start)) {
        ranges.push({ start, end, href });
      }
      offset = normalised.value.indexOf(needle, offset + needle.length);
    }
  }

  // A citation may abbreviate the printed title. Its approved number still
  // identifies one document; do not guess when it contains several documents.
  const destinations = [...new Set(candidates.map(({ href }) => href))];
  if (!ranges.length && number !== undefined && destinations.length === 1) {
    ranges.push({ start: 0, end: text.length, href: destinations[0] });
  }
  return ranges.sort((a, b) => a.start - b.start);
}

export default function PublicSafetySourceText({ text, number }: { text: string; number?: number | string }) {
  const ranges = getPublicSafetySourceRanges(text, number);
  if (!ranges.length) return text;
  const result: ReactNode[] = [];
  let offset = 0;
  for (const { start, end, href } of ranges) {
    result.push(text.slice(offset, start));
    result.push(<PublicSafetySourceLink key={`${start}-${href}`} href={href}>{text.slice(start, end)}</PublicSafetySourceLink>);
    offset = end;
  }
  result.push(text.slice(offset));
  return result;
}

export function PublicSafetyFootnoteLink({ number, noteHref }: { number?: number | string; noteHref?: string }) {
  if (number === undefined) return null;
  const href = numberedLinks[String(number)]?.find((source) => !source.unavailable)?.href ?? noteHref;
  if (!href) return number;
  const external = !href.startsWith("#");
  return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} aria-label={external ? `Open original source ${number}` : `Read footnote ${number}`} className="underline decoration-current underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-4">{number}</a>;
}
