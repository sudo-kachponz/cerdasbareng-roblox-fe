import { timingSafeEqual } from "crypto";
import { errJson } from "./errors";

export function verifyGameApiKey(req: Request) {
  const key = req.headers.get("x-api-key") ?? "";
  const expected = process.env.ROBLOX_GAME_SERVER_API_KEY ?? "";
  if (!expected) return errJson("SERVER_ERROR", "Game API key not configured.", 500);

  const a = Buffer.from(key);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b))
    return errJson("UNAUTHORIZED", "Invalid API key.", 401);

  return null; // ok
}
