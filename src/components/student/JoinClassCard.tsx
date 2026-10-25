"use client";
import { Box, Button, Flex, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { FiClock, FiCreditCard, FiPlay, FiCheckCircle, FiLoader } from "react-icons/fi";
import { fmtCountdown, fmtDate, fmtTime } from "@/lib/format";
import { JOIN_WINDOW_BEFORE_MIN, worldName } from "@/lib/roblox";
import type { StudentSession } from "@/lib/types";

type Gate = "UNPAID" | "TOO_EARLY" | "PREPARING" | "OPEN" | "ENDED";

function gateOf(s: StudentSession, now: number): Gate {
  if (s.status === "ENDED") return "ENDED";
  if (s.enrollment === "UNPAID") return "UNPAID";
  const opens = new Date(s.startAt).getTime() - JOIN_WINDOW_BEFORE_MIN * 60_000;
  if (now < opens) return "TOO_EARLY";
  if (s.status === "READY" || s.status === "LIVE") return "OPEN";
  return "PREPARING";
}

const WORLD_GRAD: Record<string, string> = {
  "neo-beijing": "linear(135deg, #0C2EBB, #B52971)",
  "london-quest": "linear(135deg, #2563EB, #6F51F8)",
  "pasar-angka": "linear(135deg, #FF722D, #FC3030)",
  "lab-sains": "linear(135deg, #04B528, #2563EB)",
};

/** Kartu kelas Roblox di dashboard siswa + gatekeeper visual (scope #4). */
export function JoinClassCard({ s, onJoin, joining }: { s: StudentSession; onJoin: (s: StudentSession) => void; joining: boolean }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const gate = gateOf(s, now);
  const opensIn = new Date(s.startAt).getTime() - JOIN_WINDOW_BEFORE_MIN * 60_000 - now;

  return (
    <Box bg="white" borderRadius="card" boxShadow="card" overflow="hidden" opacity={gate === "ENDED" ? 0.7 : 1} display="flex" flexDir="column">
      <Box bgGradient={WORLD_GRAD[s.world] ?? "linear(135deg, #FF7D39, #FC641B)"} px={5} py={4} color="white" position="relative">
        <Text fontSize="12px" fontWeight={600} opacity={0.9}>{worldName(s.world)}</Text>
        <Text fontFamily="heading" fontWeight={700} fontSize="18px" noOfLines={1}>{s.title}</Text>
        {gate === "OPEN" && (
          <HStack position="absolute" top={3} right={3} bg="whiteAlpha.300" px={2} py={0.5} borderRadius="full" spacing={1.5}>
            <Box w="7px" h="7px" borderRadius="full" bg="#22C55E" />
            <Text fontSize="11px" fontWeight={700}>{s.status === "LIVE" ? "LIVE" : "Pintu dibuka"}</Text>
          </HStack>
        )}
      </Box>

      <Stack p={5} spacing={4} flex={1}>
        <Stack spacing={1} fontSize="14px" color="gray.700">
          <Text>{s.subject} · {s.gradeLevel} · bersama <b>{s.tutorName}</b></Text>
          <HStack color="gray.600"><Icon as={FiClock} /><Text>{fmtDate(s.startAt)}, {fmtTime(s.startAt)} · {s.durationMin} mnt</Text></HStack>
        </Stack>

        <Box mt="auto">
          {gate === "OPEN" && (
            <Button w="full" leftIcon={<FiPlay />} onClick={() => onJoin(s)} isLoading={joining} loadingText="Memeriksa akses…">
              Masuk Kelas di Roblox
            </Button>
          )}
          {gate === "UNPAID" && (
            <Stack spacing={2}>
              <Flex bg="rose.50" color="rose.600" borderRadius="8px" px={3} py={2} fontSize="13px" gap={2} align="center">
                <Icon as={FiCreditCard} /><Text>Selesaikan pembayaran agar bisa masuk kelas.</Text>
              </Flex>
              <Button as={NextLink} href="/keranjang" w="full" variant="brandOutline">Bayar Sekarang</Button>
            </Stack>
          )}
          {gate === "TOO_EARLY" && (
            <Stack spacing={2}>
              <Flex bg="surface.soft" borderRadius="8px" px={3} py={2} fontSize="13px" justify="space-between" align="center">
                <Text color="gray.600">Pintu kelas dibuka dalam</Text>
                <Text fontWeight={700} color="navy.500" sx={{ fontVariantNumeric: "tabular-nums" }}>{fmtCountdown(opensIn)}</Text>
              </Flex>
              <Button w="full" variant="ghostLine" isDisabled leftIcon={<FiPlay />}>Belum Dibuka</Button>
            </Stack>
          )}
          {gate === "PREPARING" && (
            <Button w="full" variant="ghostLine" isDisabled leftIcon={<Icon as={FiLoader} />}>Ruang kelas sedang disiapkan…</Button>
          )}
          {gate === "ENDED" && (
            <HStack justify="center" color="gray.500" fontSize="14px" py={2}><Icon as={FiCheckCircle} /><Text>Sesi selesai</Text></HStack>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
