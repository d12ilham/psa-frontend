"use client";

import { useEffect, useRef, type RefObject } from "react";

const activeItem = '[aria-current="true"], [aria-current="page"], [aria-pressed="true"], [aria-selected="true"]';

export function useReportReader(
  anchor: RefObject<HTMLElement | null>,
  selection: number | null,
  revealOnMobile = true,
) {
  const previousSelection = useRef(selection);

  useEffect(() => {
    const workspace = anchor.current?.closest<HTMLElement>("[data-report-reader]");
    if (!workspace) return;

    const header = workspace.closest("main")?.parentElement?.querySelector("header");
    const list = workspace.querySelector<HTMLElement>("[data-reader-list]");
    const detail = workspace.querySelector<HTMLElement>("[data-reader-detail]");
    let frame = 0;

    const measure = () => {
      frame = 0;
      const inset = Math.ceil(header?.getBoundingClientRect().height ?? 60) + 16;
      const heightFrom = (element: HTMLElement) =>
        Math.max(200, window.innerHeight - Math.max(inset, element.getBoundingClientRect().top) - 24);

      workspace.style.setProperty("--reader-top", `${inset}px`);
      if (list) list.style.setProperty("--reader-height", `${heightFrom(list)}px`);
      if (detail) detail.style.setProperty("--reader-height", `${heightFrom(detail)}px`);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    const observer = header && typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(schedule)
      : null;
    if (header) observer?.observe(header);
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [anchor]);

  useEffect(() => {
    if (previousSelection.current === selection) return;
    previousSelection.current = selection;

    const frame = window.requestAnimationFrame(() => {
      const workspace = anchor.current?.closest<HTMLElement>("[data-report-reader]");
      const detail = workspace?.querySelector<HTMLElement>("[data-reader-detail]");
      if (!workspace || !detail || detail.getClientRects().length === 0) return;

      const list = workspace.querySelector<HTMLElement>("[data-reader-list]");
      const desktop = window.getComputedStyle(workspace).getPropertyValue("--reader-desktop").trim() === "1";
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
      detail.scrollTo({ top: 0, left: 0, behavior: "instant" });

      if (desktop && list) {
        const current = list.querySelector<HTMLElement>(activeItem);
        if (current) {
          const bounds = list.getBoundingClientRect();
          const item = current.getBoundingClientRect();
          const offset = item.top < bounds.top
            ? item.top - bounds.top
            : Math.max(0, item.bottom - bounds.bottom);
          if (offset) list.scrollBy({ top: offset, behavior });
        }
      }

      const inset = parseFloat(window.getComputedStyle(workspace).getPropertyValue("--reader-top")) || 76;
      if (desktop) {
        if (Math.abs(workspace.getBoundingClientRect().top - inset) > 4) {
          workspace.scrollIntoView({ block: "start", behavior });
        }
      } else if (revealOnMobile) {
        const top = detail.getBoundingClientRect().top;
        if (top < inset - 4 || top >= window.innerHeight - 80) {
          detail.scrollIntoView({ block: "start", behavior });
        }
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [anchor, selection, revealOnMobile]);
}
