"use client";
import { Box } from "@chakra-ui/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RobloxShowcase } from "@/components/landing/RobloxShowcase";

/** Preview halaman showcase Roblox. Di repo CB, sisipkan <RobloxHero/> + <RobloxFeatures/> ke homepage. */
export default function Home() {
  return (
    <Box>
      <Navbar />
      <RobloxShowcase />
      <Footer />
    </Box>
  );
}
