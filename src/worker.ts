/**
 * BullMQ worker for session lifecycle jobs.
 * Run: npx tsx src/worker.ts  (or: npm run worker)
 */
import { Worker, Job } from "bullmq";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connection = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : { host: process.env.REDIS_HOST ?? "127.0.0.1", port: Number(process.env.REDIS_PORT ?? 6379) };

async function handleProvision(job: Job) {
  const { sessionId } = job.data;
  const session = await prisma.robloxSession.findUnique({ where: { id: sessionId } });
  if (!session || session.status === "CANCELLED") return;
  if (session.status !== "SCHEDULED" && session.status !== "FAILED") return; // idempotent

  await prisma.robloxSession.update({
    where: { id: sessionId },
    data: { status: "PROVISIONING" },
  });

  // The actual reserved server is created by the Lobby game server when
  // the first player joins (ReserveServer can only be called from Roblox).
  // Our "provisioning" just marks the session as READY so players can join.
  await prisma.robloxSession.update({
    where: { id: sessionId },
    data: { status: "READY" },
  });

  console.log(`[worker] Session ${sessionId} → READY`);
}

async function handleStart(job: Job) {
  const { sessionId } = job.data;
  const session = await prisma.robloxSession.findUnique({ where: { id: sessionId } });
  if (!session || session.status === "CANCELLED") return;
  if (session.status !== "READY") return; // idempotent

  await prisma.robloxSession.update({
    where: { id: sessionId },
    data: { status: "LIVE" },
  });
  console.log(`[worker] Session ${sessionId} → LIVE`);
}

async function handleEnd(job: Job) {
  const { sessionId } = job.data;
  const session = await prisma.robloxSession.findUnique({ where: { id: sessionId } });
  if (!session || session.status === "ENDED" || session.status === "CANCELLED") return;

  await prisma.robloxSession.update({
    where: { id: sessionId },
    data: { status: "ENDED" },
  });

  // Invalidate unredeemed tokens
  await prisma.robloxJoinToken.updateMany({
    where: { sessionId, redeemedAt: null },
    data: { expiresAt: new Date(0) },
  });

  console.log(`[worker] Session ${sessionId} → ENDED`);
}

const worker = new Worker(
  "roblox-sessions",
  async (job) => {
    switch (job.name) {
      case "provision-session": return handleProvision(job);
      case "start-session": return handleStart(job);
      case "end-session": return handleEnd(job);
      default: console.warn(`[worker] Unknown job: ${job.name}`);
    }
  },
  {
    connection,
    concurrency: 5,
  },
);

worker.on("failed", (job, err) => {
  console.error(`[worker] Job ${job?.name} ${job?.id} failed:`, err.message);
  // Mark session as FAILED on final attempt
  if (job && job.name === "provision-session" && job.attemptsMade >= (job.opts.attempts ?? 3)) {
    prisma.robloxSession.update({
      where: { id: job.data.sessionId },
      data: { status: "FAILED", failReason: err.message },
    }).catch(console.error);
  }
});

worker.on("ready", () => console.log("[worker] Ready, waiting for jobs..."));
process.on("SIGTERM", () => worker.close());
process.on("SIGINT", () => worker.close());
