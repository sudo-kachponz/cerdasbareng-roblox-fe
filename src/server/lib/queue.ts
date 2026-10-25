import { Queue } from "bullmq";

const connection = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : { host: process.env.REDIS_HOST ?? "127.0.0.1", port: Number(process.env.REDIS_PORT ?? 6379) };

const g = globalThis as unknown as { __sessionQueue?: Queue };
export const sessionQueue = (g.__sessionQueue ??= new Queue("roblox-sessions", {
  connection,
  defaultJobOptions: { attempts: 3, backoff: { type: "exponential", delay: 5000 } },
}));
