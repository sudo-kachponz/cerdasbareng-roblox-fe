"use client";
import { Box, Heading, SimpleGrid, Skeleton, Stack, Text, useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { JoinClassCard } from "@/components/student/JoinClassCard";
import { JoinByCode } from "@/components/student/JoinByCode";
import { LaunchRobloxModal } from "@/components/student/LaunchRobloxModal";
import { api } from "@/lib/api";
import type { StudentSession } from "@/lib/types";

export default function StudentDashboard() {
  const [list, setList] = useState<StudentSession[] | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [launch, setLaunch] = useState<{ url: string; title?: string } | null>(null);
  const toast = useToast();

  useEffect(() => {
    api.listStudentSessions().then(setList);
    const t = setInterval(() => api.listStudentSessions().then(setList), 30_000);
    return () => clearInterval(t);
  }, []);

  const join = async (s: StudentSession) => {
    setJoiningId(s.id);
    try {
      const r = await api.validateJoin({ sessionId: s.id });
      if (r.allowed && r.launchUrl) setLaunch({ url: r.launchUrl, title: s.title });
      else toast({ status: "warning", title: r.message ?? "Belum bisa masuk kelas", position: "top" });
    } finally {
      setJoiningId(null);
    }
  };

  const validateCode = async (code: string) => {
    const r = await api.validateJoin({ code });
    if (r.allowed && r.launchUrl) setLaunch({ url: r.launchUrl });
    return r;
  };

  const active = useMemo(() => (list ?? []).filter((s) => s.status !== "ENDED"), [list]);
  const ended = useMemo(() => (list ?? []).filter((s) => s.status === "ENDED"), [list]);

  return (
    <DashboardShell title="Kelas Roblox Saya" subtitle="Masuk ke kelas Roblox-mu langsung dari sini.">
      <Stack spacing={8}>
        <JoinByCode onValidate={validateCode} />

        <Box>
          <Heading as="h2" fontSize="20px" mb={4}>Kelas Mendatang</Heading>
          {list ? (
            active.length ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                {active.map((s) => <JoinClassCard key={s.id} s={s} onJoin={join} joining={joiningId === s.id} />)}
              </SimpleGrid>
            ) : (
              <Text color="gray.600">Belum ada kelas Roblox. Yuk cari kelas dulu!</Text>
            )
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>{[0, 1, 2].map((i) => <Skeleton key={i} h="240px" borderRadius="card" />)}</SimpleGrid>
          )}
        </Box>

        {ended.length > 0 && (
          <Box>
            <Heading as="h2" fontSize="20px" mb={4}>Riwayat</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
              {ended.map((s) => <JoinClassCard key={s.id} s={s} onJoin={join} joining={false} />)}
            </SimpleGrid>
          </Box>
        )}
      </Stack>
      <LaunchRobloxModal launchUrl={launch?.url ?? null} title={launch?.title} onClose={() => setLaunch(null)} />
    </DashboardShell>
  );
}
