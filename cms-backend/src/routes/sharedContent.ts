import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { safeJsonParse } from "../lib/colourUtils";
import { triggerFrontendRevalidation } from "../lib/revalidate";

const router = Router();

const updateSharedSchema = z.object({
  title: z.string().min(2).optional(),
  content: z.record(z.unknown()),
});

router.get("/", requireAuth, async (_req, res) => {
  const items = await prisma.sharedTemplateContent.findMany({
    orderBy: { key: "asc" },
  });
  res.json(
    items.map((i) => ({
      id: i.id,
      key: i.key,
      title: i.title,
      content: safeJsonParse(i.contentJson, {}),
      updatedAt: i.updatedAt,
    }))
  );
});

router.get("/:key", requireAuth, async (req, res) => {
  const item = await prisma.sharedTemplateContent.findUnique({
    where: { key: req.params.key },
  });
  if (!item) {
    res.status(404).json({ error: "Shared template content not found" });
    return;
  }
  res.json({
    id: item.id,
    key: item.key,
    title: item.title,
    content: safeJsonParse(item.contentJson, {}),
    updatedAt: item.updatedAt,
  });
});

router.put(
  "/:key",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const parsed = updateSharedSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const updated = await prisma.sharedTemplateContent.upsert({
      where: { key: req.params.key },
      update: {
        ...(parsed.data.title ? { title: parsed.data.title } : {}),
        contentJson: JSON.stringify(parsed.data.content),
      },
      create: {
        key: req.params.key,
        title: parsed.data.title || req.params.key,
        contentJson: JSON.stringify(parsed.data.content),
      },
    });

    await triggerFrontendRevalidation(["/reports"]);
    res.json({
      id: updated.id,
      key: updated.key,
      title: updated.title,
      content: safeJsonParse(updated.contentJson, {}),
      updatedAt: updated.updatedAt,
    });
  }
);

export default router;
