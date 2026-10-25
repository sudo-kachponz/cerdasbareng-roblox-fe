import { randomBytes } from "crypto";
import { prisma } from "../lib/prisma";
import { sha256 } from "../lib/crypto";
import { buildLaunchUrl, JOIN_WINDOW_BEFORE_MIN } from "@/lib/roblox";
import type { ValidateJoinResponse, JoinDenyReason } from "@/lib/types";

const MIN = 60_000;
const TOKEN_TTL_MIN = 5;

function deny(reason: JoinDenyReason, message: string, extra?: { opensAt?: string }): ValidateJoinResponse {
  return { allowed: false, reason, message, ...extra };
}

export async function validateStudentJoin(
  userId: string,
  sessionIdOrCode: string,
): Promise<ValidateJoinResponse> {
  // Find session
  const session = await prisma.robloxSession.findFirst({
    where: {
      OR: [{ id: sessionIdOrCode }, { code: { equals: sessionIdOrCode, mode: "insensitive" } }],
    },
  });
  if (!session) return deny("SESSION_NOT_FOUND", "Kode kelas tidak ditemukan.");

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_sessionId: { userId, sessionId: session.id } },
  });
  if (!enrollment) return deny("NOT_ENROLLED", "Kamu belum terdaftar di kelas ini.");
  if (enrollment.status === "UNPAID") return deny("UNPAID", "Selesaikan pembayaran dulu untuk masuk kelas.");

  // Check session status
  if (session.status === "ENDED" || session.status === "CANCELLED")
    return deny("SESSION_ENDED", "Sesi ini sudah selesai.");

  const start = session.startAt.getTime();
  const now = Date.now();
  if (now < start - JOIN_WINDOW_BEFORE_MIN * MIN)
    return deny("TOO_EARLY", "Pintu kelas belum dibuka.", {
      opensAt: new Date(start - JOIN_WINDOW_BEFORE_MIN * MIN).toISOString(),
    });

  if (session.status !== "READY" && session.status !== "LIVE")
    return deny("SERVER_NOT_READY", "Ruang kelas sedang disiapkan, coba lagi sebentar.");

  // Issue one-time join token (invalidate previous)
  return issueToken(session.id, userId, "student");
}

export async function validateTutorJoin(
  tutorId: string,
  sessionId: string,
): Promise<ValidateJoinResponse> {
  const session = await prisma.robloxSession.findFirst({
    where: { id: sessionId, tutorId },
  });
  if (!session) return deny("SESSION_NOT_FOUND", "Sesi tidak ditemukan.");

  if (session.status === "ENDED" || session.status === "CANCELLED")
    return deny("SESSION_ENDED", "Sesi ini sudah selesai.");
  if (session.status !== "READY" && session.status !== "LIVE")
    return deny("SERVER_NOT_READY", "Server belum siap.");

  return issueToken(session.id, tutorId, "tutor");
}

async function issueToken(sessionId: string, userId: string, role: string): Promise<ValidateJoinResponse> {
  // Invalidate existing tokens for this user+session
  await prisma.robloxJoinToken.updateMany({
    where: { sessionId, userId, redeemedAt: null, expiresAt: { gt: new Date() } },
    data: { expiresAt: new Date(0) },
  });

  const raw = randomBytes(32).toString("base64url");
  const tokenHash = sha256(raw);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MIN * MIN);

  await prisma.robloxJoinToken.create({
    data: { tokenHash, sessionId, userId, role, expiresAt },
  });

  return {
    allowed: true,
    joinToken: raw,
    expiresAt: expiresAt.toISOString(),
    launchUrl: buildLaunchUrl(raw),
  };
}

export async function redeemToken(rawToken: string, robloxUserId: string) {
  const tokenHash = sha256(rawToken);

  // Atomic single-use redeem
  const result = await prisma.robloxJoinToken.updateMany({
    where: { tokenHash, redeemedAt: null, expiresAt: { gt: new Date() } },
    data: { redeemedAt: new Date() },
  });
  if (result.count === 0) return { allowed: false, message: "Token tidak valid atau sudah digunakan." };

  const token = await prisma.robloxJoinToken.findUnique({
    where: { tokenHash },
    include: { session: { select: { id: true, status: true, accessCode: true, placeId: true, tutorId: true } } },
  });
  if (!token) return { allowed: false, message: "Token tidak ditemukan." };

  const session = token.session;
  if (session.status !== "READY" && session.status !== "LIVE")
    return { allowed: false, message: "Sesi belum siap atau sudah selesai." };

  // For tutor, verify robloxUserId matches
  if (token.role === "tutor") {
    const tutorAccount = await prisma.tutorRobloxAccount.findUnique({
      where: { tutorId: session.tutorId },
      select: { robloxUserId: true },
    });
    if (tutorAccount?.robloxUserId !== String(robloxUserId))
      return { allowed: false, message: "Akun Roblox tidak sesuai dengan tutor sesi ini." };
  }

  return {
    allowed: true,
    sessionId: session.id,
    role: token.role,
    placeId: session.placeId,
    accessCode: session.accessCode,
  };
}
