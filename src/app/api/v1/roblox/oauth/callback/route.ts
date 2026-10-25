import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { linkAccount } from "@/lib/mock-db";

export const dynamic = "force-dynamic";

/** GET /api/v1/roblox/oauth/callback — Roblox redirect ke sini membawa ?code&state. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const back = (q: string) => NextResponse.redirect(`${url.origin}/tutor/dashboard?roblox=${q}`);

  if (url.searchParams.get("error")) return back("denied");
  if (!code) return back("error");

  if (process.env.NEXT_PUBLIC_USE_MOCK === "false") {
    const jar = cookies();
    if (state !== jar.get("rbx_oauth_state")?.value) return back("error");
    // TODO(backend): tukar code -> token
    // POST https://apis.roblox.com/oauth/v1/token  (grant_type=authorization_code, code, code_verifier,
    //      client_id, client_secret, redirect_uri)  ->  access_token, refresh_token, id_token
    // GET  https://apis.roblox.com/oauth/v1/userinfo  ->  sub (Roblox userId), preferred_username, name, picture
    // Simpan ke tabel tutor_roblox_accounts (tutor_id UNIQUE, roblox_user_id UNIQUE, ...)
  }

  linkAccount(code);
  return back("linked");
}
