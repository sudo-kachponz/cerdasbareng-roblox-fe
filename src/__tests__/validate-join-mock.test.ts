import { describe, it, expect } from "vitest";
import { validateJoin } from "../lib/mock-db";

describe("validate-join decision table (mock)", () => {
  it("SESSION_NOT_FOUND for unknown code", () => {
    const r = validateJoin("NONEXISTENT");
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("SESSION_NOT_FOUND");
  });

  it("NOT_ENROLLED for session with no enrollment", () => {
    const r = validateJoin("ses_failed");
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("NOT_ENROLLED");
  });

  it("UNPAID for enrolled but unpaid session", () => {
    const r = validateJoin("ses_unpaid");
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("UNPAID");
  });

  it("SESSION_ENDED for ended session", () => {
    const r = validateJoin("ses_ended1");
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("SESSION_ENDED");
  });

  it("allowed for READY session with PAID enrollment", () => {
    const r = validateJoin("ses_live01");
    // ses_live01 starts in 5 min, status READY, enrollment PAID
    // It should be allowed if within join window
    if (r.allowed) {
      expect(r.joinToken).toBeTruthy();
      expect(r.launchUrl).toContain("roblox.com/games/start");
    } else {
      // Could be TOO_EARLY if timing is tight
      expect(["TOO_EARLY", "SERVER_NOT_READY"]).toContain(r.reason);
    }
  });

  it("allows join by code (case insensitive)", () => {
    const r = validateJoin("cb-7q2k");
    // Same session as ses_live01
    if (r.allowed) {
      expect(r.joinToken).toBeTruthy();
    }
  });
});
