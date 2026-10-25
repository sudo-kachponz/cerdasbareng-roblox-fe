import { NextResponse } from "next/server";
import { retryProvision } from "@/lib/mock-db";

export const dynamic = "force-dynamic";

/** POST /api/v1/roblox/sessions/:id/retry — re-enqueue job provisioning yang gagal */
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const s = retryProvision(params.id);
  if (!s) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json(s);
}
