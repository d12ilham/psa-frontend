import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const sourceSchema = z.object({
  label: z.string().min(2),
  sourceName: z.string().min(2),
  url: z.string().url(),
  publisher: z.string().optional(),
  referenceYear: z.number().int().min(1990).max(2100).optional(),
  openInNewTab: z.boolean().optional(),
});

router.get("/", requireAuth, async (_req, res) => {
  const sources = await prisma.sourceLink.findMany({
    orderBy: [{ referenceYear: "desc" }, { label: "asc" }],
  });
  res.json(sources);
});

router.post(
  "/",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const parsed = sourceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const created = await prisma.sourceLink.create({
      data: {
        label: parsed.data.label,
        sourceName: parsed.data.sourceName,
        url: parsed.data.url,
        publisher: parsed.data.publisher || "",
        referenceYear: parsed.data.referenceYear ?? 2026,
        openInNewTab: parsed.data.openInNewTab ?? true,
      },
    });

    res.status(201).json(created);
  }
);

router.put(
  "/:id",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const parsed = sourceSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const existing = await prisma.sourceLink.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) {
      res.status(404).json({ error: "Source link not found" });
      return;
    }

    const updated = await prisma.sourceLink.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(updated);
  }
);

router.post(
  "/check-links",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (_req, res) => {
    const sources = await prisma.sourceLink.findMany();
    const results = [];

    for (const src of sources) {
      let status = "BROKEN";
      try {
        const resp = await fetch(src.url, {
          method: "HEAD",
          signal: AbortSignal.timeout(4000),
        });
        if (resp.ok || resp.status === 405 || resp.status === 403) {
          status = "OK";
        }
      } catch {
        status = "BROKEN";
      }

      const updated = await prisma.sourceLink.update({
        where: { id: src.id },
        data: { status, lastCheckedAt: new Date() },
      });
      results.push(updated);
    }

    res.json({ checked: results.length, sources: results });
  }
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const existing = await prisma.sourceLink.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) {
      res.status(404).json({ error: "Source link not found" });
      return;
    }
    await prisma.sourceLink.delete({ where: { id: req.params.id } });
    res.json({ deleted: true, id: req.params.id });
  }
);

export default router;
