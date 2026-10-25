import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyGameApiKey } from "@/server/lib/game-auth";
import { setAccessCode } from "@/server/services/session";
import { errJson } from "@/server/lib/errors";

export const dynamic = "force-dynamic";

const Schema = z.object({ accessCode: z.string().min(1) });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const authErr = verifyGameApiKey(req);
  if (authErr) return authErr;

  const parsed = Schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return errJson("VALIDATION", "accessCode wajib diisi.", 400);

  const accessCode = await setAccessCode(params.id, parsed.data.accessCode);
  return NextResponse.json({ accessCode });
}
