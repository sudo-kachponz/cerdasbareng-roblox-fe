export type GradeLevel = "SD" | "SMP" | "SMA";

export interface RobloxLink {
  linked: boolean;
  robloxUserId?: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string | null;
  linkedAt?: string;
}

/**
 * Siklus hidup sesi Roblox:
 * SCHEDULED  -> dijadwalkan tutor, job provisioning ada di queue
 * PROVISIONING -> worker sedang menyiapkan reserved server (T-15 menit)
 * READY      -> access code reserved server sudah ada, pintu dibuka
 * LIVE       -> tutor/siswa sudah masuk
 * ENDED      -> sesi selesai
 * FAILED     -> provisioning gagal (perlu retry)
 */
export type SessionStatus = "SCHEDULED" | "PROVISIONING" | "READY" | "LIVE" | "ENDED" | "FAILED";

export interface RobloxSession {
  id: string;
  code: string; // kode kelas singkat, mis. CB-7Q2K
  title: string;
  subject: string;
  gradeLevel: GradeLevel;
  world: string; // template world di Roblox
  startAt: string; // ISO
  durationMin: number;
  capacity: number;
  enrolled: number;
  paid: number;
  status: SessionStatus;
  tutorName: string;
  failReason?: string;
}

export type EnrollmentStatus = "PAID" | "UNPAID" | "NOT_ENROLLED";

export interface StudentSession extends RobloxSession {
  enrollment: EnrollmentStatus;
}

export type JoinDenyReason =
  | "NOT_ENROLLED"
  | "UNPAID"
  | "TOO_EARLY"
  | "SESSION_ENDED"
  | "SERVER_NOT_READY"
  | "SESSION_NOT_FOUND";

export interface ValidateJoinResponse {
  allowed: boolean;
  reason?: JoinDenyReason;
  message?: string;
  opensAt?: string;
  joinToken?: string;
  expiresAt?: string;
  launchUrl?: string;
}

export interface CreateSessionInput {
  title: string;
  subject: string;
  gradeLevel: GradeLevel;
  world: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm (WIB)
  durationMin: number;
  capacity: number;
}
