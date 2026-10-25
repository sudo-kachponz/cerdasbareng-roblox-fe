import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";

export interface CurrentUser {
  id: string;
  name: string;
  role: "TUTOR" | "STUDENT" | "ADMIN";
}

/**
 * Pluggable auth adapter. Replace the body with your real auth system
 * (NextAuth, Supabase, custom JWT, etc.).
 *
 * In mock mode, returns a demo user based on `cb_role` cookie.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (process.env.NEXT_PUBLIC_USE_MOCK !== "false") {
    const role = cookies().get("cb_role")?.value ?? "TUTOR";
    return {
      id: role === "STUDENT" ? "demo_student" : "demo_tutor",
      name: role === "STUDENT" ? "Siswa Demo" : "Tutor Demo",
      role: role as CurrentUser["role"],
    };
  }

  // TODO: wire to real CB auth — read session cookie/JWT, look up user
  // Example with a custom JWT:
  // const token = cookies().get("cb_session")?.value;
  // if (!token) return null;
  // const payload = verifyJwt(token);
  // return prisma.user.findUnique({ where: { id: payload.sub } });
  return null;
}
