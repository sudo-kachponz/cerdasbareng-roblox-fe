/**
 * Data dummy in-memory untuk mode mock. Ganti modul ini dengan repository/DB asli
 * (Prisma/Drizzle/REST backend CB) — bentuk fungsinya sengaja dibuat mirip service.
 */
import type {
  CreateSessionInput,
  EnrollmentStatus,
  RobloxLink,
  RobloxSession,
  SessionStatus,
  StudentSession,
  ValidateJoinResponse,
} from "./types";
import { JOIN_WINDOW_BEFORE_MIN, PROVISION_BEFORE_MIN, buildLaunchUrl } from "./roblox";

const MIN = 60_000;
const now = () => Date.now();
const iso = (offsetMin: number) => new Date(now() + offsetMin * MIN).toISOString();

interface DB {
  link: RobloxLink;
  sessions: (RobloxSession & { forcedStatus?: SessionStatus })[];
  enrollments: Record<string, EnrollmentStatus>; // sessionId -> status untuk siswa demo
}

function seed(): DB {
  return {
    link: { linked: false },
    sessions: [
      {
        id: "ses_live01",
        code: "CB-7Q2K",
        title: "Percakapan di Stasiun Kereta",
        subject: "Bahasa Mandarin",
        gradeLevel: "SMA",
        world: "neo-beijing",
        startAt: iso(5),
        durationMin: 60,
        capacity: 10,
        enrolled: 8,
        paid: 7,
        status: "READY",
        tutorName: "Laoshi Mei",
      },
      {
        id: "ses_unpaid",
        code: "CB-L0ND",
        title: "Ordering Food & Small Talk",
        subject: "Bahasa Inggris",
        gradeLevel: "SMP",
        world: "london-quest",
        startAt: iso(40),
        durationMin: 60,
        capacity: 5,
        enrolled: 5,
        paid: 3,
        status: "SCHEDULED",
        tutorName: "Ms. Rina",
      },
      {
        id: "ses_later1",
        code: "CB-PSR8",
        title: "Pecahan di Pasar Angka",
        subject: "Matematika",
        gradeLevel: "SD",
        world: "pasar-angka",
        startAt: iso(60 * 26),
        durationMin: 45,
        capacity: 10,
        enrolled: 6,
        paid: 6,
        status: "SCHEDULED",
        tutorName: "Kak Dimas",
      },
      {
        id: "ses_failed",
        code: "CB-LAB3",
        title: "Gaya & Gerak",
        subject: "IPA",
        gradeLevel: "SMP",
        world: "lab-sains",
        startAt: iso(12),
        durationMin: 60,
        capacity: 10,
        enrolled: 4,
        paid: 4,
        status: "FAILED",
        forcedStatus: "FAILED",
        failReason: "Lobby server tidak merespons saat reserve (timeout 30 dtk)",
        tutorName: "Kak Dimas",
      },
      {
        id: "ses_ended1",
        code: "CB-OLD1",
        title: "Salam & Perkenalan",
        subject: "Bahasa Mandarin",
        gradeLevel: "SMA",
        world: "neo-beijing",
        startAt: iso(-60 * 24),
        durationMin: 60,
        capacity: 10,
        enrolled: 9,
        paid: 9,
        status: "ENDED",
        tutorName: "Laoshi Mei",
      },
    ],
    enrollments: {
      ses_live01: "PAID",
      ses_unpaid: "UNPAID",
      ses_later1: "PAID",
      ses_ended1: "PAID",
    },
  };
}

const g = globalThis as unknown as { __cbMockDb?: DB };
const db: DB = (g.__cbMockDb ??= seed());

/** Status diturunkan dari waktu (simulasi queue provisioning di T-15 menit). */
function deriveStatus(s: DB["sessions"][number]): SessionStatus {
  if (s.forcedStatus) return s.forcedStatus;
  const start = new Date(s.startAt).getTime();
  const end = start + s.durationMin * MIN;
  const t = now();
  if (t >= end) return "ENDED";
  if (t >= start) return "LIVE";
  if (t >= start - PROVISION_BEFORE_MIN * MIN) return "READY";
  if (t >= start - (PROVISION_BEFORE_MIN + 2) * MIN) return "PROVISIONING";
  return "SCHEDULED";
}

const withStatus = (s: DB["sessions"][number]): RobloxSession => {
  const { forcedStatus: _f, ...rest } = s;
  return { ...rest, status: deriveStatus(s) };
};

// ---------- Akun Roblox tutor ----------
export const getLink = () => db.link;
export function linkAccount(code: string): RobloxLink {
  // Mock: di produksi, tukar `code` ke token di https://apis.roblox.com/oauth/v1/token
  // lalu ambil profil di https://apis.roblox.com/oauth/v1/userinfo
  db.link = {
    linked: true,
    robloxUserId: "4829173650",
    username: "tutor_cerdasbareng",
    displayName: "Tutor Demo",
    avatarUrl: null,
    linkedAt: new Date().toISOString(),
  };
  return db.link;
}
export function unlinkAccount() {
  db.link = { linked: false };
  return db.link;
}

// ---------- Sesi (tutor) ----------
export const listTutorSessions = () =>
  db.sessions.map(withStatus).sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));

export function createSession(input: CreateSessionInput): RobloxSession {
  // input.date + time dianggap WIB (UTC+7)
  const startAt = new Date(`${input.date}T${input.time}:00+07:00`).toISOString();
  const id = "ses_" + Math.random().toString(36).slice(2, 8);
  const code = "CB-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  const s = {
    id,
    code,
    title: input.title,
    subject: input.subject,
    gradeLevel: input.gradeLevel,
    world: input.world,
    startAt,
    durationMin: input.durationMin,
    capacity: input.capacity,
    enrolled: 0,
    paid: 0,
    status: "SCHEDULED" as SessionStatus,
    tutorName: db.link.displayName ?? "Tutor",
  };
  db.sessions.push(s);
  // Produksi: enqueue job `provision-session` dengan delay = startAt - 15 menit
  return withStatus(s);
}

export function retryProvision(id: string) {
  const s = db.sessions.find((x) => x.id === id);
  if (!s) return null;
  delete s.forcedStatus;
  delete s.failReason;
  return withStatus(s);
}

// ---------- Siswa ----------
export const listStudentSessions = (): StudentSession[] =>
  db.sessions
    .filter((s) => db.enrollments[s.id])
    .map((s) => ({ ...withStatus(s), enrollment: db.enrollments[s.id] }))
    .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));

export const findByCode = (code: string) =>
  db.sessions.find((s) => s.code.toLowerCase() === code.trim().toLowerCase());

export function validateJoin(sessionIdOrCode: string): ValidateJoinResponse {
  const s = db.sessions.find((x) => x.id === sessionIdOrCode) ?? findByCode(sessionIdOrCode);
  if (!s) return { allowed: false, reason: "SESSION_NOT_FOUND", message: "Kode kelas tidak ditemukan." };

  const enrollment = db.enrollments[s.id] ?? "NOT_ENROLLED";
  if (enrollment === "NOT_ENROLLED")
    return { allowed: false, reason: "NOT_ENROLLED", message: "Kamu belum terdaftar di kelas ini." };
  if (enrollment === "UNPAID")
    return { allowed: false, reason: "UNPAID", message: "Selesaikan pembayaran dulu untuk masuk kelas." };

  const status = deriveStatus(s);
  const start = new Date(s.startAt).getTime();
  if (status === "ENDED") return { allowed: false, reason: "SESSION_ENDED", message: "Sesi ini sudah selesai." };
  if (now() < start - JOIN_WINDOW_BEFORE_MIN * MIN)
    return {
      allowed: false,
      reason: "TOO_EARLY",
      message: "Pintu kelas belum dibuka.",
      opensAt: new Date(start - JOIN_WINDOW_BEFORE_MIN * MIN).toISOString(),
    };
  if (status !== "READY" && status !== "LIVE")
    return { allowed: false, reason: "SERVER_NOT_READY", message: "Ruang kelas sedang disiapkan, coba lagi sebentar." };

  // Produksi: token pendek bertanda tangan HMAC, sekali pakai, TTL ~5 menit,
  // disimpan di DB/Redis agar Lobby bisa memverifikasinya via HttpService.
  const joinToken = "jt_" + Math.random().toString(36).slice(2, 12);
  return {
    allowed: true,
    joinToken,
    expiresAt: new Date(now() + 5 * MIN).toISOString(),
    launchUrl: buildLaunchUrl(joinToken),
  };
}
