import { NextResponse } from "next/server";
import { validateJoin } from "@/lib/mock-db";

export const dynamic = "force-dynamic";

/**
 * POST /api/v1/roblox/validate-join
 * Body: { sessionId?: string, code?: string }
 * Dipanggil dashboard siswa sebelum membuka Roblox. Mengecek: terdaftar, lunas,
 * jendela waktu, dan kesiapan reserved server. Jika lolos, mengembalikan join token
 * sekali pakai + launchUrl ke Lobby Place.
 *
 * Catatan: Lobby (Luau, HttpService) memverifikasi token ini lagi di endpoint server-to-server
 * terpisah (mis. POST /api/v1/roblox/game/redeem-token) — bukan endpoint ini.
 */
export async function POST(req: Request) {
  const { sessionId, code } = (await req.json().catch(() => ({}))) as { sessionId?: string; code?: string };
  const key = sessionId || code;
  if (!key) return NextResponse.json({ allowed: false, message: "sessionId atau code wajib diisi" }, { status: 400 });

  const result = validateJoin(key);
  return NextResponse.json(result, { status: result.allowed ? 200 : 403 });
}
