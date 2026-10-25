import { NextResponse } from "next/server";
import { listStudentSessions } from "@/lib/mock-db";

export const dynamic = "force-dynamic";

/** GET /api/v1/student/roblox-sessions — kelas Roblox milik siswa yang sedang login */
export async function GET() {
  return NextResponse.json(listStudentSessions());
}
