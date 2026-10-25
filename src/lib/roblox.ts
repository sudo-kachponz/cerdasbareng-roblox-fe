/** Helper terkait Roblox yang dipakai di client maupun server. */

export const LOBBY_PLACE_ID = process.env.NEXT_PUBLIC_ROBLOX_LOBBY_PLACE_ID || "0000000000";

/** Pintu kelas dibuka X menit sebelum mulai. */
export const JOIN_WINDOW_BEFORE_MIN = 10;
/** Worker provisioning menyiapkan server X menit sebelum mulai. */
export const PROVISION_BEFORE_MIN = 15;

/**
 * Deep link peluncuran Roblox dari browser.
 * Roblox membuka app/launcher lalu masuk ke Lobby Place; `launchData` bisa dibaca di
 * server Lobby lewat `player:GetJoinData().LaunchData` (batas ukurannya kecil, jadi
 * kirim token pendek saja — bukan payload JSON besar).
 */
export function buildLaunchUrl(joinToken: string, placeId: string = LOBBY_PLACE_ID) {
  const params = new URLSearchParams({ placeId, launchData: joinToken });
  return `https://www.roblox.com/games/start?${params.toString()}`;
}

export const ROBLOX_DOWNLOAD_URL = "https://www.roblox.com/download";

export const WORLDS = [
  { id: "neo-beijing", name: "Neo-Beijing Metropolis", subject: "Bahasa Mandarin", level: "SMA" },
  { id: "london-quest", name: "London Quest Street", subject: "Bahasa Inggris", level: "SMP" },
  { id: "pasar-angka", name: "Pasar Angka Nusantara", subject: "Matematika", level: "SD" },
  { id: "lab-sains", name: "Lab Sains Melayang", subject: "IPA", level: "SMP" },
] as const;

export function worldName(id: string) {
  return WORLDS.find((w) => w.id === id)?.name ?? id;
}
