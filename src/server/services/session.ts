import { prisma } from "../lib/prisma";
import { generateSessionCode } from "../lib/code-gen";
import { sessionQueue } from "../lib/queue";
import type { CreateSessionInput, RobloxSession, SessionStatus } from "@/lib/types";
import { LOBBY_PLACE_ID } from "@/lib/roblox";

function toResponse(s: {
  id: string; code: string; title: string; subject: string; gradeLevel: string;
  world: string; startAt: Date; durationMin: number; capacity: number;
  status: string; failReason: string | null;
  tutor: { name: string };
  _count?: { enrollments: number };
  enrollments?: { status: string }[];
}): RobloxSession {
  const enrolled = s._count?.enrollments ?? s.enrollments?.length ?? 0;
  const paid = s.enrollments?.filter((e) => e.status === "PAID").length ?? 0;
  return {
    id: s.id,
    code: s.code,
    title: s.title,
    subject: s.subject,
    gradeLevel: s.gradeLevel as RobloxSession["gradeLevel"],
    world: s.world,
    startAt: s.startAt.toISOString(),
    durationMin: s.durationMin,
    capacity: s.capacity,
    enrolled,
    paid,
    status: s.status as SessionStatus,
    tutorName: s.tutor.name,
    ...(s.failReason ? { failReason: s.failReason } : {}),
  };
}

const sessionInclude = {
  tutor: { select: { name: true } },
  enrollments: { select: { status: true } },
} as const;

export async function listTutorSessions(tutorId: string): Promise<RobloxSession[]> {
  const sessions = await prisma.robloxSession.findMany({
    where: { tutorId },
    include: sessionInclude,
    orderBy: { startAt: "asc" },
  });
  return sessions.map(toResponse);
}

export async function createSession(tutorId: string, input: CreateSessionInput): Promise<RobloxSession> {
  const startAt = new Date(`${input.date}T${input.time}:00+07:00`);
  const code = generateSessionCode();

  const session = await prisma.robloxSession.create({
    data: {
      code,
      tutorId,
      title: input.title,
      subject: input.subject,
      gradeLevel: input.gradeLevel,
      world: input.world,
      startAt,
      durationMin: input.durationMin || 60,
      capacity: input.capacity || 10,
      placeId: LOBBY_PLACE_ID,
      status: "SCHEDULED",
    },
    include: sessionInclude,
  });

  // Enqueue provision job delayed to startAt - 15 min
  const delay = Math.max(0, startAt.getTime() - 15 * 60_000 - Date.now());
  await enqueueSessionJobs(session.id, startAt, session.durationMin, delay);

  return toResponse(session);
}

async function enqueueSessionJobs(sessionId: string, startAt: Date, durationMin: number, provisionDelay: number) {
  try {
    await sessionQueue.add("provision-session", { sessionId }, {
      jobId: `provision-${sessionId}`,
      delay: provisionDelay,
    });
    await sessionQueue.add("start-session", { sessionId }, {
      jobId: `start-${sessionId}`,
      delay: Math.max(0, startAt.getTime() - Date.now()),
    });
    await sessionQueue.add("end-session", { sessionId }, {
      jobId: `end-${sessionId}`,
      delay: Math.max(0, startAt.getTime() + durationMin * 60_000 - Date.now()),
    });
  } catch {
    // Redis unavailable — jobs won't run, fallback to cron or manual retry
    console.warn(`[session] Failed to enqueue jobs for ${sessionId} — Redis may be down`);
  }
}

export async function retryProvision(sessionId: string, tutorId: string): Promise<RobloxSession | null> {
  const session = await prisma.robloxSession.findFirst({
    where: { id: sessionId, tutorId, status: "FAILED" },
    include: sessionInclude,
  });
  if (!session) return null;

  const updated = await prisma.robloxSession.update({
    where: { id: sessionId },
    data: { status: "SCHEDULED", failReason: null },
    include: sessionInclude,
  });

  try {
    await sessionQueue.add("provision-session", { sessionId }, {
      jobId: `provision-${sessionId}-retry-${Date.now()}`,
      delay: 0, // immediate
    });
  } catch {
    console.warn(`[session] Failed to enqueue retry for ${sessionId}`);
  }

  return toResponse(updated);
}

export async function rescheduleSession(
  sessionId: string, tutorId: string, date: string, time: string,
): Promise<RobloxSession | null> {
  const session = await prisma.robloxSession.findFirst({
    where: { id: sessionId, tutorId, status: { in: ["SCHEDULED", "FAILED"] } },
  });
  if (!session) return null;

  const startAt = new Date(`${date}T${time}:00+07:00`);
  const updated = await prisma.robloxSession.update({
    where: { id: sessionId },
    data: { startAt, status: "SCHEDULED", failReason: null },
    include: sessionInclude,
  });

  // Remove old jobs and re-enqueue
  try {
    await sessionQueue.remove(`provision-${sessionId}`);
    await sessionQueue.remove(`start-${sessionId}`);
    await sessionQueue.remove(`end-${sessionId}`);
  } catch { /* ignore */ }
  const delay = Math.max(0, startAt.getTime() - 15 * 60_000 - Date.now());
  await enqueueSessionJobs(sessionId, startAt, updated.durationMin, delay);

  return toResponse(updated);
}

export async function cancelSession(sessionId: string, tutorId: string): Promise<RobloxSession | null> {
  const session = await prisma.robloxSession.findFirst({
    where: { id: sessionId, tutorId, status: { notIn: ["ENDED", "LIVE", "CANCELLED"] } },
  });
  if (!session) return null;

  const updated = await prisma.robloxSession.update({
    where: { id: sessionId },
    data: { status: "CANCELLED" },
    include: sessionInclude,
  });

  try {
    await sessionQueue.remove(`provision-${sessionId}`);
    await sessionQueue.remove(`start-${sessionId}`);
    await sessionQueue.remove(`end-${sessionId}`);
  } catch { /* ignore */ }

  // Invalidate unredeemed join tokens
  await prisma.robloxJoinToken.updateMany({
    where: { sessionId, redeemedAt: null },
    data: { expiresAt: new Date(0) },
  });

  return toResponse(updated);
}

export async function getSessionById(sessionId: string) {
  return prisma.robloxSession.findUnique({
    where: { id: sessionId },
    include: sessionInclude,
  });
}

export async function getSessionByCode(code: string) {
  return prisma.robloxSession.findFirst({
    where: { code: { equals: code, mode: "insensitive" } },
    include: sessionInclude,
  });
}

export async function setAccessCode(sessionId: string, accessCode: string): Promise<string> {
  // First-write-wins: only store if currently null
  const session = await prisma.robloxSession.findUnique({ where: { id: sessionId }, select: { accessCode: true } });
  if (session?.accessCode) return session.accessCode;

  const updated = await prisma.robloxSession.update({
    where: { id: sessionId },
    data: { accessCode },
    select: { accessCode: true },
  });
  return updated.accessCode!;
}
