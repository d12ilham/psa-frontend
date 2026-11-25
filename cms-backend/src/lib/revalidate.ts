export async function triggerFrontendRevalidation(paths: string[] = ["/reports"]) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const secret = process.env.REVALIDATION_SECRET || "";

  if (!frontendUrl || !secret) {
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch(`${frontendUrl.replace(/\/$/, "")}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidation-secret": secret,
      },
      body: JSON.stringify({ paths }),
      signal: AbortSignal.timeout(2500),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    // Frontend may not be running during offline backend edits or tests
    return { ok: false, offline: true };
  }
}
