import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { validateTutorJoin } from "@/server/services/join-token";
import * as mock from "@/lib/mock-db";
import { buildLaunchUrl } from "@/lib/roblox";
import { err401 } from "@/server/lib/errors";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "TUTOR") return err401();

  if (process.env.NEXT_PUBLIC_USE_MOCK !== "false") {
    // Mock: generate a fake token like the frontend used to
    const joinToken = `tutor_${params.id}`;
    return NextResponse.json({
      allowed: true,
      joinToken,
      expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
      launchUrl: buildLaunchUrl(joinToken),
    });
  }

  const result = await validateTutorJoin(user.id, params.id);
  return NextResponse.json(result, { status: result.allowed ? 200 : 403 });
}
