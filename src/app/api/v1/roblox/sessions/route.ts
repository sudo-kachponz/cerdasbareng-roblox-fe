import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/server/auth/current-user";
import * as mock from "@/lib/mock-db";
import * as svc from "@/server/services/session";
import * as mockAccount from "@/lib/mock-db";
import * as accountSvc from "@/server/services/roblox-account";
import { err401, errJson } from "@/server/lib/errors";

export const dynamic = "force-dynamic";
const useMock = () => process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const CreateSessionSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  subject: z.string().min(1, "Mata pelajaran wajib diisi"),
  gradeLevel: z.enum(["SD", "SMP", "SMA"]),
  world: z.string().min(1, "World wajib dipilih"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal: yyyy-mm-dd"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Format waktu: HH:mm"),
  durationMin: z.number().int().min(15).max(180).optional().default(60),
  capacity: z.number().int().min(1).max(100).optional().default(10),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TUTOR") return err401();
  const sessions = useMock() ? mock.listTutorSessions() : await svc.listTutorSessions(user.id);
  return NextResponse.json(sessions);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "TUTOR") return err401();

  // Check linked
  if (useMock()) {
    if (!mockAccount.getLink().linked)
      return errJson("ROBLOX_NOT_LINKED", "Hubungkan akun Roblox dulu.", 409);
  } else {
    const link = await accountSvc.getLink(user.id);
    if (!link.linked) return errJson("ROBLOX_NOT_LINKED", "Hubungkan akun Roblox dulu.", 409);
  }

  const parsed = CreateSessionSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(", ");
    return errJson("VALIDATION", msg, 422);
  }

  const { data } = parsed;
  const start = new Date(`${data.date}T${data.time}:00+07:00`).getTime();
  if (Number.isNaN(start) || start < Date.now() + 20 * 60_000)
    return errJson("VALIDATION", "Jadwal minimal 20 menit dari sekarang agar server sempat disiapkan.", 422);

  const session = useMock()
    ? mock.createSession(data)
    : await svc.createSession(user.id, data);
  return NextResponse.json(session, { status: 201 });
}
