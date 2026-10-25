import { NextResponse } from "next/server";
import { createSession, getLink, listTutorSessions } from "@/lib/mock-db";
import type { CreateSessionInput } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/v1/roblox/sessions — daftar sesi Roblox milik tutor */
export async function GET() {
  return NextResponse.json(listTutorSessions());
}

/** POST /api/v1/roblox/sessions — jadwalkan sesi baru (+ enqueue job provisioning) */
export async function POST(req: Request) {
  if (!getLink().linked)
    return NextResponse.json({ error: "ROBLOX_NOT_LINKED", message: "Hubungkan akun Roblox dulu." }, { status: 409 });

  const body = (await req.json()) as Partial<CreateSessionInput>;
  const missing = (["title", "subject", "gradeLevel", "world", "date", "time"] as const).filter((k) => !body[k]);
  if (missing.length)
    return NextResponse.json({ error: "VALIDATION", message: `Field wajib: ${missing.join(", ")}` }, { status: 422 });

  const start = new Date(`${body.date}T${body.time}:00+07:00`).getTime();
  if (Number.isNaN(start) || start < Date.now() + 20 * 60_000)
    return NextResponse.json(
      { error: "VALIDATION", message: "Jadwal minimal 20 menit dari sekarang agar server sempat disiapkan." },
      { status: 422 },
    );

  const session = createSession({ durationMin: 60, capacity: 10, ...body } as CreateSessionInput);
  return NextResponse.json(session, { status: 201 });
}
