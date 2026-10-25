import { NextResponse } from "next/server";
import { getLink, unlinkAccount } from "@/lib/mock-db";

export const dynamic = "force-dynamic";

/** GET  /api/v1/roblox/account — status tautan akun Roblox tutor yang sedang login */
export async function GET() {
  return NextResponse.json(getLink());
}

/** DELETE /api/v1/roblox/account — unlink (produksi: revoke token di Roblox juga) */
export async function DELETE() {
  return NextResponse.json(unlinkAccount());
}
