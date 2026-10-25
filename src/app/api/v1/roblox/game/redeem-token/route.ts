import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyGameApiKey } from "@/server/lib/game-auth";
import { redeemToken } from "@/server/services/join-token";
import { errJson } from "@/server/lib/errors";

export const dynamic = "force-dynamic";

const Schema = z.object({
  token: z.string().min(1),
  robloxUserId: z.union([z.string(), z.number()]).transform(String),
});

export async function POST(req: Request) {
  const authErr = verifyGameApiKey(req);
  if (authErr) return authErr;

  const parsed = Schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return errJson("VALIDATION", "token dan robloxUserId wajib diisi.", 400);

  const result = await redeemToken(parsed.data.token, parsed.data.robloxUserId);
  return NextResponse.json(result);
}
