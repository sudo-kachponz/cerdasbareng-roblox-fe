import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import * as mock from "@/lib/mock-db";
import { validateStudentJoin } from "@/server/services/join-token";
import { err401 } from "@/server/lib/errors";

export const dynamic = "force-dynamic";
const useMock = () => process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return err401();

  const { sessionId, code } = (await req.json().catch(() => ({}))) as { sessionId?: string; code?: string };
  const key = sessionId || code;
  if (!key)
    return NextResponse.json({ allowed: false, message: "sessionId atau code wajib diisi" }, { status: 400 });

  if (useMock()) {
    const result = mock.validateJoin(key);
    return NextResponse.json(result, { status: result.allowed ? 200 : 403 });
  }

  const result = await validateStudentJoin(user.id, key);
  return NextResponse.json(result, { status: result.allowed ? 200 : 403 });
}
