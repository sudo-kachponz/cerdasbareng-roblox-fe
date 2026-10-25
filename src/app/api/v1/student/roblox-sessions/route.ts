import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import * as mock from "@/lib/mock-db";
import { listStudentSessions } from "@/server/services/student";
import { err401 } from "@/server/lib/errors";

export const dynamic = "force-dynamic";
const useMock = () => process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return err401();

  const sessions = useMock() ? mock.listStudentSessions() : await listStudentSessions(user.id);
  return NextResponse.json(sessions);
}
