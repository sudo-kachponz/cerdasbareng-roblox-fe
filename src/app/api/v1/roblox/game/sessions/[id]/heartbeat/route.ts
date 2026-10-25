import { NextResponse } from "next/server";
import { verifyGameApiKey } from "@/server/lib/game-auth";
import { prisma } from "@/server/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const authErr = verifyGameApiKey(req);
  if (authErr) return authErr;

  const body = await req.json().catch(() => ({}));

  await prisma.robloxSession.updateMany({
    where: { id: params.id, status: { in: ["READY", "LIVE"] } },
    data: { status: "LIVE" },
  });

  return NextResponse.json({ ok: true });
}
