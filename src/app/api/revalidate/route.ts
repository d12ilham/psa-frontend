import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.CMS_REVALIDATION_SECRET || "";
  const headerSecret = request.headers.get("x-revalidation-secret") || "";

  if (configuredSecret && headerSecret !== configuredSecret) {
    return NextResponse.json({ error: "Invalid revalidation secret" }, { status: 401 });
  }

  let paths: string[] = ["/reports"];
  try {
    const body = (await request.json()) as { paths?: string[] };
    if (Array.isArray(body?.paths) && body.paths.length > 0) {
      paths = body.paths;
    }
  } catch {
    // fallback to default /reports revalidation
  }

  for (const p of paths) {
    if (typeof p === "string" && p.startsWith("/")) {
      revalidatePath(p);
    }
  }

  return NextResponse.json({ revalidated: true, paths, timestamp: new Date().toISOString() });
}
