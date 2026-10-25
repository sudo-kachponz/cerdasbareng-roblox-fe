import type { Metadata } from "next";
import "@fontsource/ubuntu/400.css";
import "@fontsource/ubuntu/500.css";
import "@fontsource/ubuntu/700.css";
import "@fontsource-variable/inter";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CerdasBareng — Kelas Roblox",
  description: "Belajar interaktif berbasis Roblox bersama tutor CerdasBareng.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
