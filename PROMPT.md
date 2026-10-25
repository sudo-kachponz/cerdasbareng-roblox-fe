# Prompt UI — Integrasi Roblox CerdasBareng

Prompt siap tempel ke **Lovable / v0 / Claude**. Bahasa prompt Inggris (hasil AI lebih konsisten), copy UI Bahasa Indonesia.
Design token di bawah diambil dari inspeksi langsung **cerdasbareng.id** (computed style, Okt 2026).

---

## 1. Prompt utama (tempel semuanya)

```
You are designing new screens for CerdasBareng (cerdasbareng.id), an Indonesian online tutoring
platform for SD–SMA students (age 6–18) and their parents. We are adding Roblox-based classes:
tutors link their Roblox account, schedule a class, and the system auto-creates a private
(reserved) Roblox server; students click a button on the web, Roblox opens in a Lobby place,
and they are teleported to their class server.

The new screens MUST look like they already belong to cerdasbareng.id. Match this design system exactly:

STACK
- Next.js 14 App Router + TypeScript + Chakra UI v2 (the production site uses Chakra UI v2 + Emotion).
  If your tool only supports Tailwind/shadcn, map the tokens below 1:1 into tailwind.config.

TYPOGRAPHY
- Headings, section titles, nav links, big numbers: "Ubuntu" weight 700 (nav links 500).
  H1 36–44px, H2 32–36px, card titles 18–20px. Slight negative letter-spacing (-0.01em).
- Body, buttons, forms, badges: "Inter" (400 body, 600 labels, 700 buttons). Body 15–16px, meta 13–14px.
- Key words inside headings are highlighted in orange, e.g. "Jadi Tutor di <orange>CerdasBareng</orange>".

COLORS
- Primary orange #FF7D39 (buttons, active nav, highlight words). Hover #FC641B.
- Orange tint backgrounds #FFF0EA / #FFDDCC (hero background, soft cards).
- Text: headings #000000, body #2D3748, muted #718096. Borders #EDEEF2 / #E2E8F0.
- Footer navy #002987. Accent blue #2563EB.
- Pastel feature cards: orange #FFF0EA, green #E8FCF1 (icon #04B528), lavender #E2E2FD (icon #6F51F8),
  blue #EEF2FB.
- Promo banner gradient: linear-gradient(92deg, #0C2EBB 0%, #592E9B 31%, #B52971 67%, #681689 89%, #3B2EA7 100%).
- Pricing card top stripes: linear-gradient(270deg, <accent> 0%, #FFF5F5 100%) with accents
  #FF722D, #2563EB, #6F51F8, #04B528, #FC3030.
- Page background white; dashboard background #F8F9FC.

SHAPE & DEPTH
- Buttons: radius 10px, height ~44px, Inter 700 15px, primary = solid orange + white text,
  secondary = white with 1px orange border + orange text, tertiary = white with 1px black border
  + black text radius 8px (like "Cari Kelas" and the "Murid SD / Murid SMP / Tutor" picker).
- Cards: white, radius 12px, shadow "0 4px 8px rgba(23,25,35,.1), 0 0 1px rgba(23,25,35,.3)".
- Section tag pill above titles: small rounded-full pill, 1px black border, text + emoji
  (e.g. "Cara Daftar ✨", "Pelajaran 🎉").
- Max content width 1152–1280px. Generous vertical rhythm (80px between sections desktop).
- Friendly, playful but clean; emojis allowed sparingly. Mobile-first: everything must work at 390px.

SCREENS TO BUILD
1) Landing section "Kelas Roblox" (modular components, insertable into the existing homepage):
   - Hero: orange-tint bg, badge "🎮 Baru · Game-Based Learning", H1 "Belajar Jadi Petualangan di
     Dunia Roblox" (last two words orange), paragraph, CTAs "Coba Kelas Roblox" (primary) +
     "Lihat Cara Kerjanya" (secondary), 3 check bullets (Usia 6–18 tahun, PC/tablet/HP, Dipandu tutor).
     Right side: illustrated game window placeholder (quest HUD, AI NPC speech bubble, "Kelas Privat" badge).
   - "Cara Kerja" 4 numbered steps: Daftar & bayar → Klik "Masuk Kelas" → Roblox terbuka di Lobby →
     Teleport ke kelasmu.
   - 4 pastel feature cards: Ruang Kelas Privat, NPC Pintar Berbasis AI, Quest & Mini-Game, Dunia Tematik.
   - World gallery cards (gradient thumbnail, level + subject badges): Neo-Beijing Metropolis (Mandarin, SMA), etc.
   - Parent safety block ("Seru untuk Anak, Tenang untuk Orang Tua") with 4 items.
   - FAQ accordion, then a CTA band using the promo gradient.

2) Tutor dashboard (/tutor/dashboard):
   - "Connect Roblox Account" card with two states:
     a) Not linked: explanation, 3 trust bullets, primary button "Hubungkan dengan Roblox".
     b) Linked: avatar, display name, "Terverifikasi" green badge, @username + Roblox ID, linked date,
        ghost red "Putuskan Akun" with confirmation dialog.
   - 4 stat tiles (pastel): Kelas mendatang, Siswa terdaftar, Menunggu pembayaran, Server siap.
   - Session list with tabs Mendatang / Riwayat. Each row: date block, status badge, copyable class code
     (CB-XXXX), title, time WIB, world, "lunas / terdaftar" progress, actions.
     Statuses: Terjadwal (blue), Menyiapkan server (orange, pulsing), Server siap (green),
     Sedang berlangsung (green pulsing), Selesai (gray), Gagal disiapkan (red + reason + "Coba Lagi").
     "Masuk sebagai Tutor" only when ready/live.
   - "Jadwalkan Kelas Roblox" primary button (disabled + tooltip if Roblox not linked) opening a modal:
     judul, mapel, jenjang, world picker (selectable cards), tanggal, jam (WIB), durasi, kapasitas
     (Privat 1 / Semi privat 2–5 / Grup kecil 6–10), info note about auto-provisioning 15 min before start.

3) Student dashboard (/siswa/dashboard) "Kelas Roblox Saya":
   - "Punya kode kelas?" input + "Cek & Masuk".
   - Grid of class cards (world gradient header) with gatekeeper states:
     OPEN → orange "Masuk Kelas di Roblox"; UNPAID → red note + "Bayar Sekarang";
     TOO_EARLY → live countdown "Pintu kelas dibuka dalam 12:30" + disabled button;
     PREPARING → disabled "Ruang kelas sedang disiapkan…"; ENDED → muted "Sesi selesai".
   - Launch modal "Membuka Roblox…" with spinner; after 4s show fallback buttons
     "Coba Buka Lagi" and "Belum punya Roblox? Download dulu".

RULES
- Do not use Roblox's logo or trademarks as graphics; mention "Roblox" in text only.
- All copy in casual-polite Indonesian (kamu), times in WIB.
- Include loading skeletons, empty states, error toasts, and responsive layouts.
```

---

## 2. Prompt lanjutan (iterasi)

- **Kalau warnanya meleset:** `Use exactly #FF7D39 for primary buttons and highlighted heading words, Ubuntu 700 for headings and Inter for body. Card radius 12px, button radius 10px. Remove any other accent colors not in the palette.`
- **Kalau terlalu "template":** `Make it feel like cerdasbareng.id: pastel tinted cards, section tag pills with emoji above every section title, orange highlighted words in headings, friendly illustrations. Less gray, more warmth.`
- **Mobile:** `Check every screen at 390px width: stack columns, full-width buttons, no horizontal scroll, tap targets ≥44px.`

---

## 3. Token Tailwind (kalau tool-nya Tailwind, bukan Chakra)

```js
// tailwind.config.js -> theme.extend
fontFamily: { heading: ['Ubuntu', 'sans-serif'], sans: ['Inter', 'sans-serif'] },
colors: {
  brand: { 50: '#FFF0EA', 100: '#FFDDCC', 500: '#FF7D39', 600: '#FC641B' },
  navy: { 50: '#EEF2FB', 500: '#2563EB', 800: '#002987' },
  mint: { 50: '#E8FCF1', 500: '#04B528' },
  lavender: { 50: '#E2E2FD', 500: '#6F51F8' },
  ink: { DEFAULT: '#000000', body: '#2D3748', muted: '#718096' },
},
borderRadius: { btn: '10px', card: '12px' },
boxShadow: { card: '0 4px 8px rgba(23,25,35,.1), 0 0 1px rgba(23,25,35,.3)' },
```
Google Fonts: `Ubuntu:wght@400;500;700` dan `Inter:wght@400;500;600;700`.
