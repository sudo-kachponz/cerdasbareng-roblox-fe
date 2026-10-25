"use client";
import {
  Alert, AlertIcon, Box, Button, FormControl, FormHelperText, FormLabel, HStack, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SimpleGrid, Stack, Text, useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { api } from "@/lib/api";
import { PROVISION_BEFORE_MIN, WORLDS } from "@/lib/roblox";
import type { CreateSessionInput, GradeLevel, RobloxSession } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (s: RobloxSession) => void;
}

const tomorrow = () => {
  const d = new Date(Date.now() + 86400000);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
};

/** Form penjadwalan kelas -> POST /api/v1/roblox/sessions (scope #2). */
export function ScheduleClassModal({ isOpen, onClose, onCreated }: Props) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [f, setF] = useState<CreateSessionInput>({
    title: "",
    subject: "Bahasa Mandarin",
    gradeLevel: "SMA",
    world: "neo-beijing",
    date: tomorrow(),
    time: "16:00",
    durationMin: 60,
    capacity: 10,
  });
  const set = <K extends keyof CreateSessionInput>(k: K, v: CreateSessionInput[K]) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setBusy(true);
    setErr(null);
    try {
      const s = await api.createSession(f);
      onCreated(s);
      toast({
        status: "success",
        position: "top",
        title: "Kelas dijadwalkan",
        description: `Kode kelas ${s.code}. Ruang kelas Roblox disiapkan otomatis ${PROVISION_BEFORE_MIN} menit sebelum mulai.`,
      });
      onClose();
      setF((p) => ({ ...p, title: "" }));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
      <ModalContent mx={4}>
        <ModalHeader fontFamily="heading" fontSize="22px">
          Jadwalkan Kelas Roblox
          <Text fontFamily="body" fontSize="14px" fontWeight={400} color="gray.600" mt={1}>
            Server privat dibuat otomatis — kamu cukup isi jadwal.
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            {err && <Alert status="error" borderRadius="10px"><AlertIcon />{err}</Alert>}
            <FormControl isRequired>
              <FormLabel fontSize="14px">Judul sesi</FormLabel>
              <Input placeholder="mis. Percakapan di Stasiun Kereta" value={f.title} onChange={(e) => set("title", e.target.value)} />
            </FormControl>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="14px">Mata pelajaran</FormLabel>
                <Select value={f.subject} onChange={(e) => set("subject", e.target.value)}>
                  {["Bahasa Mandarin", "Bahasa Inggris", "Matematika", "IPA"].map((s) => <option key={s}>{s}</option>)}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="14px">Jenjang</FormLabel>
                <Select value={f.gradeLevel} onChange={(e) => set("gradeLevel", e.target.value as GradeLevel)}>
                  {["SD", "SMP", "SMA"].map((s) => <option key={s}>{s}</option>)}
                </Select>
              </FormControl>
            </SimpleGrid>
            <FormControl isRequired>
              <FormLabel fontSize="14px">World Roblox</FormLabel>
              <SimpleGrid columns={2} spacing={3}>
                {WORLDS.map((w) => {
                  const active = f.world === w.id;
                  return (
                    <Box
                      key={w.id}
                      as="button"
                      type="button"
                      textAlign="left"
                      onClick={() => set("world", w.id)}
                      border="1.5px solid"
                      borderColor={active ? "brand.500" : "gray.200"}
                      bg={active ? "brand.50" : "white"}
                      borderRadius="10px"
                      p={3}
                      transition="all .15s"
                    >
                      <Text fontWeight={700} fontSize="14px" color="black">{w.name}</Text>
                      <Text fontSize="12px" color="gray.600">{w.subject} · {w.level}</Text>
                    </Box>
                  );
                })}
              </SimpleGrid>
            </FormControl>
            <SimpleGrid templateColumns={{ base: "1fr 1fr", sm: "1.6fr 1.3fr 1fr" }} spacing={4}>
              <FormControl isRequired gridColumn={{ base: "span 2", sm: "auto" }}>
                <FormLabel fontSize="14px">Tanggal</FormLabel>
                <Input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="14px">Jam (WIB)</FormLabel>
                <Input type="time" value={f.time} onChange={(e) => set("time", e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="14px">Durasi</FormLabel>
                <Select value={f.durationMin} onChange={(e) => set("durationMin", Number(e.target.value))}>
                  {[45, 60, 90].map((m) => <option key={m} value={m}>{m} mnt</option>)}
                </Select>
              </FormControl>
            </SimpleGrid>
            <FormControl>
              <FormLabel fontSize="14px">Kapasitas siswa</FormLabel>
              <Select value={f.capacity} onChange={(e) => set("capacity", Number(e.target.value))}>
                <option value={1}>Privat · 1 murid</option>
                <option value={5}>Semi privat · 2–5 murid</option>
                <option value={10}>Grup kecil · 6–10 murid</option>
              </Select>
              <FormHelperText fontSize="12px">Mengikuti tipe kelas CerdasBareng.</FormHelperText>
            </FormControl>
            <HStack bg="surface.soft" borderRadius="10px" p={3} align="flex-start" spacing={3}>
              <Text fontSize="18px">⏱️</Text>
              <Text fontSize="13px" color="gray.700">
                Sistem memasukkan sesi ke antrean. {PROVISION_BEFORE_MIN} menit sebelum mulai, ruang kelas privat disiapkan,
                lalu siswa yang sudah lunas bisa masuk 10 menit sebelum mulai.
              </Text>
            </HStack>
          </Stack>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghostLine" onClick={onClose}>Batal</Button>
          <Button onClick={submit} isLoading={busy} isDisabled={!f.title.trim()}>Jadwalkan</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
