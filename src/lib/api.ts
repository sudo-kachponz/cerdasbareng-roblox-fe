"use client";
import type { CreateSessionInput, RobloxLink, RobloxSession, StudentSession, ValidateJoinResponse } from "./types";

async function j<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok && !("allowed" in data)) throw new Error(data.message || `HTTP ${res.status}`);
  return data as T;
}

export const api = {
  getRobloxAccount: () => fetch("/api/v1/roblox/account", { cache: "no-store" }).then(j<RobloxLink>),
  unlinkRoblox: () => fetch("/api/v1/roblox/account", { method: "DELETE" }).then(j<RobloxLink>),
  connectRobloxUrl: "/api/v1/roblox/oauth/authorize",

  listTutorSessions: () => fetch("/api/v1/roblox/sessions", { cache: "no-store" }).then(j<RobloxSession[]>),
  createSession: (input: CreateSessionInput) =>
    fetch("/api/v1/roblox/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }).then(j<RobloxSession>),
  retryProvision: (id: string) => fetch(`/api/v1/roblox/sessions/${id}/retry`, { method: "POST" }).then(j<RobloxSession>),

  listStudentSessions: () =>
    fetch("/api/v1/student/roblox-sessions", { cache: "no-store" }).then(j<StudentSession[]>),
  validateJoin: (body: { sessionId?: string; code?: string }) =>
    fetch("/api/v1/roblox/validate-join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(j<ValidateJoinResponse>),
};
