"use client";
import { Box, Button, Flex, HStack, SimpleGrid, Skeleton, Stack, Tab, TabList, Tabs, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { DashboardShell, StatCard } from "@/components/dashboard/DashboardShell";
import { ConnectRobloxCard } from "@/components/tutor/ConnectRobloxCard";
import { ScheduleClassModal } from "@/components/tutor/ScheduleClassModal";
import { SessionList } from "@/components/tutor/SessionList";
import { api } from "@/lib/api";
import type { RobloxLink, RobloxSession } from "@/lib/types";

function TutorDashboard() {
  const [link, setLink] = useState<RobloxLink | null>(null);
  const [sessions, setSessions] = useState<RobloxSession[] | null>(null);
  const [tab, setTab] = useState(0);
  const modal = useDisclosure();
  const toast = useToast();
  const params = useSearchParams();
  const router = useRouter();

  const load = useCallback(async () => {
    const [l, s] = await Promise.all([api.getRobloxAccount(), api.listTutorSessions()]);
    setLink(l);
    setSessions(s);
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(() => api.listTutorSessions().then(setSessions), 30_000); // polling status provisioning
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    const r = params.get("roblox");
    if (!r) return;
    const map = {
      linked: { status: "success", title: "Akun Roblox berhasil terhubung 🎉" },
      denied: { status: "warning", title: "Kamu membatalkan izin di Roblox" },
      error: { status: "error", title: "Gagal menghubungkan akun Roblox, coba lagi" },
    } as const;
    const m = map[r as keyof typeof map];
    if (m) toast({ ...m, position: "top", isClosable: true });
    router.replace("/tutor/dashboard");
  }, [params, router, toast]);

  const upcoming = useMemo(() => (sessions ?? []).filter((s) => s.status !== "ENDED"), [sessions]);
  const past = useMemo(() => (sessions ?? []).filter((s) => s.status === "ENDED"), [sessions]);
  const shown = tab === 0 ? upcoming : past;

  const scheduleBtn = (
    <Tooltip label={link?.linked ? "" : "Hubungkan akun Roblox dulu"} isDisabled={!!link?.linked}>
      <Button leftIcon={<FiPlus />} onClick={modal.onOpen} isDisabled={!link?.linked}>Jadwalkan Kelas Roblox</Button>
    </Tooltip>
  );

  return (
    <DashboardShell title="Dashboard Tutor" subtitle="Kelola kelas Roblox-mu di satu tempat." action={scheduleBtn}>
      <Stack spacing={6}>
        <ConnectRobloxCard link={link} onChange={setLink} />

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <StatCard label="Kelas mendatang" value={sessions ? upcoming.length : "–"} tone="brand" />
          <StatCard label="Siswa terdaftar" value={sessions ? upcoming.reduce((a, s) => a + s.enrolled, 0) : "–"} tone="navy" />
          <StatCard label="Menunggu pembayaran" value={sessions ? upcoming.reduce((a, s) => a + (s.enrolled - s.paid), 0) : "–"} hint="belum bisa masuk kelas" tone="lavender" />
          <StatCard label="Server siap" value={sessions ? upcoming.filter((s) => s.status === "READY" || s.status === "LIVE").length : "–"} tone="mint" />
        </SimpleGrid>

        <Box bg="white" borderRadius="card" boxShadow="card">
          <Flex px={{ base: 4, md: 5 }} pt={4} justify="space-between" align="center" borderBottom="1px solid" borderColor="surface.line">
            <Tabs index={tab} onChange={setTab} colorScheme="orange" size="md">
              <TabList borderBottom={0}>
                <Tab fontWeight={600}>Mendatang</Tab>
                <Tab fontWeight={600}>Riwayat</Tab>
              </TabList>
            </Tabs>
            <Text fontSize="12px" color="gray.500" display={{ base: "none", md: "block" }}>Status diperbarui otomatis</Text>
          </Flex>
          {sessions ? (
            <SessionList sessions={shown} onUpdate={(u) => setSessions((p) => p!.map((x) => (x.id === u.id ? u : x)))} />
          ) : (
            <Stack p={5} spacing={4}>{[0, 1, 2].map((i) => <Skeleton key={i} h="64px" borderRadius="10px" />)}</Stack>
          )}
        </Box>

        <HStack fontSize="13px" color="gray.500" justify="center">
          <Text>Butuh bantuan? Hubungi tim CerdasBareng lewat WhatsApp.</Text>
        </HStack>
      </Stack>

      <ScheduleClassModal isOpen={modal.isOpen} onClose={modal.onClose} onCreated={(s) => setSessions((p) => [...(p ?? []), s].sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt)))} />
    </DashboardShell>
  );
}

export default function Page() {
  return (
    <Suspense>
      <TutorDashboard />
    </Suspense>
  );
}
