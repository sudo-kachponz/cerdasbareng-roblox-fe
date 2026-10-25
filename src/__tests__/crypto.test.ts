import { describe, it, expect, beforeAll } from "vitest";
import { encrypt, decrypt, sha256 } from "../server/lib/crypto";

beforeAll(() => {
  // Set a test encryption key (32 bytes = 64 hex)
  process.env.ROBLOX_TOKEN_ENCRYPTION_KEY = "a".repeat(64);
});

describe("encrypt/decrypt", () => {
  it("round-trips a token", () => {
    const token = "rt_abc123_refresh_token_here";
    const encrypted = encrypt(token);
    expect(encrypted).not.toContain(token);
    expect(decrypt(encrypted)).toBe(token);
  });

  it("produces different ciphertext for same input (random IV)", () => {
    const token = "same_token";
    const a = encrypt(token);
    const b = encrypt(token);
    expect(a).not.toBe(b);
    expect(decrypt(a)).toBe(decrypt(b));
  });
});

describe("sha256", () => {
  it("produces consistent hex hash", () => {
    const hash = sha256("hello");
    expect(hash).toBe(sha256("hello"));
    expect(hash).toHaveLength(64);
    expect(hash).not.toBe(sha256("world"));
  });
});
