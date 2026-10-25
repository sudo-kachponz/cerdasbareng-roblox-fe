import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import * as mock from "@/lib/mock-db";
import * as svc from "@/server/services/roblox-account";
import { err401 } from "@/server/lib/errors";

export const dynamic = "force-dynamic";
const useMock = () => process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TUTOR") return err401();
  const link = useMock() ? mock.getLink() : await svc.getLink(user.id);
  return NextResponse.json(link);
}

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TUTOR") return err401();
  const link = useMock() ? mock.unlinkAccount() : await svc.unlinkAccount(user.id);
  return NextResponse.json(link);
}
