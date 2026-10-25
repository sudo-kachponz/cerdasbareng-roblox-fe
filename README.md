# CerdasBareng × Roblox — Frontend

Frontend fitur integrasi Roblox untuk CerdasBareng, dibangun dengan stack yang sama seperti cerdasbareng.id
(**Next.js 14 App Router + Chakra UI v2 + Emotion**, font **Ubuntu** untuk heading & **Inter** untuk body).
Semua API masih **mock in-memory** supaya UI bisa jalan sebelum backend & Roblox Studio siap.

## Jalankan

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_USE_MOCK=true
npm run dev                  # http://localhost:3000
```

| Halaman | Isi | Scope |
|---|---|---|
| `/` atau `/roblox` | Showcase landing Roblox (7 seksi modular) | #5 |
| `/tutor/dashboard` | Connect/Unlink Roblox, jadwalkan kelas, status provisioning | #1, #2 |
| `/siswa/dashboard` | Gatekeeper join (lunas/belum, countdown, siap), launch Roblox | #3, #4 |

Logo: salin `public/images/logo.png` & `logo-orange-white.png` dari repo CB; tanpa file itu muncul wordmark teks.

## Struktur

```
src/
  theme/index.ts                 # design token CB (warna, font, radius, shadow, varian tombol)
  lib/
    types.ts                     # kontrak data (RobloxLink, RobloxSession, ValidateJoinResponse, ...)
    api.ts                       # fetcher client — ganti base URL kalau backend terpisah
    mock-db.ts                   # data dummy; ganti dengan service/DB asli
    roblox.ts                    # buildLaunchUrl, konstanta jendela waktu, daftar world
  app/api/v1/
    roblox/oauth/authorize       # GET  mulai OAuth (PKCE) — mock: langsung ke callback
    roblox/oauth/callback        # GET  terima code -> tukar token -> simpan tautan
    roblox/account               # GET status tautan, DELETE unlink
    roblox/sessions              # GET list, POST jadwalkan (+ enqueue provisioning)
    roblox/sessions/[id]/retry   # POST ulang provisioning yang gagal
    roblox/validate-join         # POST cek terdaftar + lunas + waktu -> join token + launchUrl
    student/roblox-sessions      # GET kelas Roblox milik siswa
  components/
    landing/RobloxShowcase.tsx   # RobloxHero, RobloxHowItWorks, RobloxFeatures, RobloxWorlds, ...
    tutor/                       # ConnectRobloxCard, ScheduleClassModal, SessionList
    student/                     # JoinClassCard, JoinByCode, LaunchRobloxModal
roblox/LobbyTeleport.server.luau # referensi skrip Lobby untuk Roblox dev
```

## Alur yang diasumsikan

1. **Link akun** — Roblox OAuth 2.0 (`apis.roblox.com/oauth/v1/authorize|token|userinfo`, scope `openid profile`).
2. **Jadwalkan** — `POST /sessions` menyimpan sesi + enqueue job di T-15 menit.
3. **Provisioning** — reserved server dibuat **oleh server Lobby** (`TeleportService:ReserveServer` hanya bisa
   dipanggil dari dalam game). Job backend cukup menandai sesi siap / memicu Lobby; lihat skrip Luau.
4. **Join** — siswa klik *Masuk Kelas* → `validate-join` → join token sekali pakai (TTL 5 mnt) →
   `roblox.com/games/start?placeId=<lobby>&launchData=<token>` → Lobby menukar token → teleport.

Status yang ditampilkan UI: `SCHEDULED → PROVISIONING → READY → LIVE → ENDED` (+ `FAILED`).

## Yang perlu backend sediakan (server-to-server untuk Lobby)

- `POST /api/v1/roblox/game/redeem-token` `{ token, robloxUserId }` → `{ allowed, sessionId, role, placeId, accessCode? }`
- `POST /api/v1/roblox/game/sessions/:id/access-code` `{ accessCode }` → simpan yang pertama, kembalikan kanonik
- Keduanya diautentikasi API key khusus game server, bukan session user.
