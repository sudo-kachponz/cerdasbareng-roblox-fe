import { describe, it, expect } from "vitest";
import { generateSessionCode } from "../server/lib/code-gen";

describe("generateSessionCode", () => {
  it("starts with CB- and has 4 chars after", () => {
    const code = generateSessionCode();
    expect(code).toMatch(/^CB-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/);
  });

  it("generates unique codes", () => {
    const codes = new Set(Array.from({ length: 100 }, generateSessionCode));
    expect(codes.size).toBeGreaterThan(90); // collisions extremely unlikely
  });

  it("does not contain ambiguous characters", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateSessionCode().slice(3);
      expect(code).not.toMatch(/[01OIL]/);
    }
  });
});
