import { Router } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

export const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase();
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB for report PDFs
});

router.get("/", requireAuth, async (req, res) => {
  const category = req.query.category ? String(req.query.category) : undefined;
  const assets = await prisma.mediaAsset.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });
  res.json(assets);
});

router.post(
  "/",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const baseUrl =
      process.env.PUBLIC_API_BASE_URL ||
      `${req.protocol}://${req.get("host") || "localhost:4000"}`;

    const category = req.body.category
      ? String(req.body.category)
      : req.file.mimetype === "application/pdf"
        ? "pdf"
        : "graphic";

    const asset = await prisma.mediaAsset.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `${baseUrl.replace(/\/$/, "")}/uploads/${req.file.filename}`,
        category,
      },
    });

    res.status(201).json(asset);
  }
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("SUPER_ADMIN", "EDITOR"),
  async (req, res) => {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: req.params.id },
    });
    if (!asset) {
      res.status(404).json({ error: "Asset not found" });
      return;
    }

    const fullPath = path.join(uploadsDir, asset.filename);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await prisma.mediaAsset.delete({ where: { id: req.params.id } });
    res.json({ deleted: true, id: req.params.id });
  }
);

export default router;
