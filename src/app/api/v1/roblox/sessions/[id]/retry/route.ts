import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import * as mock from "@/lib/mock-db";
import * as svc from "@/server/services/session";
import { err401, err404 } from "@/server/lib/errors";

export const dynamic = "force-dynamic";
const useMock = () => process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "TUTOR") return err401();

  const s = useMock()
    ? mock.retryProvision(params.id)
    : await svc.retryProvision(params.id, user.id);
  if (!s) return err404("Sesi tidak ditemukan atau tidak dalam status FAILED.");
  return NextResponse.json(s);
}
