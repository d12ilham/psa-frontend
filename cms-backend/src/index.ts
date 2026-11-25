import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import siteSettingsRoutes from "./routes/siteSettings";
import sectorRoutes from "./routes/sectors";
import reportRoutes from "./routes/reports";
import pageRoutes from "./routes/pages";
import sharedContentRoutes from "./routes/sharedContent";
import sourceRoutes from "./routes/sources";
import mediaRoutes, { uploadsDir } from "./routes/media";
import publicRoutes from "./routes/public";

const app = express();
const PORT = Number(process.env.PORT || 4000);

const allowedOrigins = (
  process.env.FRONTEND_URL || "http://localhost:3000"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.startsWith("http://localhost:")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(uploadsDir));

app.get("/api/v1/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "psa-dwir-cms-backend",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/v1/docs", (_req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "PSA DWIR CMS Backend API",
      version: "1.0.0",
      description:
        "Node.js + Prisma Headless CMS API for Public Skills Australia Workforce Insights Reports",
    },
    paths: {
      "/api/v1/health": { get: { summary: "Health check" } },
      "/api/v1/auth/login": { post: { summary: "Authenticate CMS admin user" } },
      "/api/v1/site-settings": { get: {}, put: {} },
      "/api/v1/sectors": { get: {}, put: {} },
      "/api/v1/reports": { get: {}, post: {} },
      "/api/v1/reports/{id}/clone": { post: { summary: "Clone report to a future year" } },
      "/api/v1/reports/{reportId}/pages": { get: {}, post: {} },
      "/api/v1/pages/{pageId}": { get: {}, put: {}, delete: {} },
      "/api/v1/shared-content/{key}": { get: {}, put: {} },
      "/api/v1/sources": { get: {}, post: {} },
      "/api/v1/sources/check-links": { post: {} },
      "/api/v1/media": { get: {}, post: {}, delete: {} },
      "/api/v1/public/site-settings": { get: {} },
      "/api/v1/public/reports": { get: {} },
      "/api/v1/public/reports/{slug}": { get: {} },
      "/api/v1/public/reports/{slug}/pages/{pageType}": { get: {} },
    },
  });
});

// Admin / Authenticated Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/site-settings", siteSettingsRoutes);
app.use("/api/v1/sectors", sectorRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1", pageRoutes);
app.use("/api/v1/shared-content", sharedContentRoutes);
app.use("/api/v1/sources", sourceRoutes);
app.use("/api/v1/media", mediaRoutes);

// Public Frontend Routes
app.use("/api/v1/public", publicRoutes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[CMS API Error]", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
);

app.listen(PORT, () => {
  console.log(`PSA DWIR CMS Backend listening on http://localhost:${PORT}`);
});
