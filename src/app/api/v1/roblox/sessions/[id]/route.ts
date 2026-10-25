import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/server/auth/current-user";
import * as svc from "@/server/services/session";
import { err401, err404, errJson } from "@/server/lib/errors";

export const dynamic = "force-dynamic";

const RescheduleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "TUTOR") return err401();

  if (process.env.NEXT_PUBLIC_USE_MOCK !== "false")
    return errJson("NOT_IMPLEMENTED", "Reschedule belum tersedia di mock mode.", 501);

  const parsed = RescheduleSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return errJson("VALIDATION", "Format date/time tidak valid.", 422);

  const start = new Date(`${parsed.data.date}T${parsed.data.time}:00+07:00`).getTime();
  if (Number.isNaN(start) || start < Date.now() + 20 * 60_000)
    return errJson("VALIDATION", "Jadwal minimal 20 menit dari sekarang.", 422);

  const s = await svc.rescheduleSession(params.id, user.id, parsed.data.date, parsed.data.time);
  if (!s) return err404("Sesi tidak ditemukan atau tidak bisa dijadwal ulang.");
  return NextResponse.json(s);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "TUTOR") return err401();

  if (process.env.NEXT_PUBLIC_USE_MOCK !== "false")
    return errJson("NOT_IMPLEMENTED", "Cancel belum tersedia di mock mode.", 501);

  const s = await svc.cancelSession(params.id, user.id);
  if (!s) return err404("Sesi tidak ditemukan atau tidak bisa dibatalkan.");
  return NextResponse.json(s);
}
