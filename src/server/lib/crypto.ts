import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const ALG = "aes-256-gcm";

function getKey(): Buffer {
  const hex = process.env.ROBLOX_TOKEN_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) throw new Error("ROBLOX_TOKEN_ENCRYPTION_KEY must be 64 hex chars (32 bytes)");
  return Buffer.from(hex, "hex");
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALG, key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), ct.toString("base64"), tag.toString("base64")].join(".");
}

export function decrypt(packed: string): string {
  const key = getKey();
  const [ivB64, ctB64, tagB64] = packed.split(".");
  const decipher = createDecipheriv(ALG, key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return decipher.update(Buffer.from(ctB64, "base64")) + decipher.final("utf8");
}

export function sha256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}
