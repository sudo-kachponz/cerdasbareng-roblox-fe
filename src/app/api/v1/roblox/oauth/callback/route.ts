import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/server/auth/current-user";
import * as mock from "@/lib/mock-db";
import * as svc from "@/server/services/roblox-account";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const back = (q: string) => NextResponse.redirect(`${url.origin}/tutor/dashboard?roblox=${q}`);

  if (url.searchParams.get("error")) return back("denied");
  if (!code) return back("error");

  const user = await getCurrentUser();
  if (!user) return back("error");

  if (process.env.NEXT_PUBLIC_USE_MOCK !== "false") {
    mock.linkAccount(code);
    return back("linked");
  }

  // Validate state
  const jar = cookies();
  if (state !== jar.get("rbx_oauth_state")?.value) return back("error");
  const verifier = jar.get("rbx_oauth_verifier")?.value;
  if (!verifier) return back("error");

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://apis.roblox.com/oauth/v1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        code_verifier: verifier,
        client_id: process.env.ROBLOX_OAUTH_CLIENT_ID ?? "",
        client_secret: process.env.ROBLOX_OAUTH_CLIENT_SECRET ?? "",
        redirect_uri: process.env.ROBLOX_OAUTH_REDIRECT_URI ?? `${url.origin}/api/v1/roblox/oauth/callback`,
      }),
    });
    if (!tokenRes.ok) return back("error");
    const tokens = await tokenRes.json();

    // Get user info
    const userRes = await fetch("https://apis.roblox.com/oauth/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!userRes.ok) return back("error");
    const userInfo = await userRes.json();

    await svc.linkAccount(
      user.id,
      userInfo.sub,
      userInfo.preferred_username ?? userInfo.sub,
      userInfo.name ?? userInfo.preferred_username ?? "Roblox User",
      userInfo.picture ?? null,
      tokens.access_token,
      tokens.refresh_token,
      tokens.expires_in ?? 900,
    );

    return back("linked");
  } catch {
    return back("error");
  }
}
