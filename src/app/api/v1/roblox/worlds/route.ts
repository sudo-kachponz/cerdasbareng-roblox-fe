import { NextResponse } from "next/server";
import { WORLDS } from "@/lib/roblox";

export async function GET() {
  return NextResponse.json(WORLDS, {
    headers: { "Cache-Control": "public, max-age=300, s-maxage=600" },
  });
}
