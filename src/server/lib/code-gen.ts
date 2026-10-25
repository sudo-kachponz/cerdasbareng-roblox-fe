import { randomBytes } from "crypto";

// No ambiguous chars: 0/O, 1/I/L removed
const CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generateSessionCode(): string {
  const bytes = randomBytes(4);
  let code = "";
  for (let i = 0; i < 4; i++) code += CHARS[bytes[i] % CHARS.length];
  return `CB-${code}`;
}
