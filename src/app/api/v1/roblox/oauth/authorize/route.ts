import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { getCurrentUser } from "@/server/auth/current-user";
import { err401 } from "@/server/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "TUTOR") return err401();

  const origin = new URL(req.url).origin;

  if (process.env.NEXT_PUBLIC_USE_MOCK !== "false") {
    return NextResponse.redirect(`${origin}/api/v1/roblox/oauth/callback?code=mock_code&state=mock`);
  }

  const state = randomBytes(16).toString("hex");
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  const url = new URL("https://apis.roblox.com/oauth/v1/authorize");
  url.searchParams.set("client_id", process.env.ROBLOX_OAUTH_CLIENT_ID ?? "");
  url.searchParams.set("redirect_uri", process.env.ROBLOX_OAUTH_REDIRECT_URI ?? `${origin}/api/v1/roblox/oauth/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid profile");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  const res = NextResponse.redirect(url.toString());
  const cookie = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/", maxAge: 600 };
  res.cookies.set("rbx_oauth_state", state, cookie);
  res.cookies.set("rbx_oauth_verifier", verifier, cookie);
  return res;
}
