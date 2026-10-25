const TZ = "Asia/Jakarta";

export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { weekday: "short", day: "numeric", month: "short", timeZone: TZ }).format(new Date(iso));

export const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(new Date(iso)) + " WIB";

export function fmtCountdown(ms: number) {
  if (ms <= 0) return "sekarang";
  const m = Math.floor(ms / 60000);
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  const mm = m % 60;
  if (d > 0) return `${d} hari ${h} jam`;
  if (h > 0) return `${h} jam ${mm} mnt`;
  const s = Math.floor((ms % 60000) / 1000);
  return `${mm}:${String(s).padStart(2, "0")}`;
}
