"use client";
import {
  Box, Button, Flex, HStack, Icon, IconButton, Progress, Stack, Text, Tooltip, useClipboard, useToast,
} from "@chakra-ui/react";
import { FiCopy, FiPlay, FiRefreshCw, FiUsers, FiAlertTriangle } from "react-icons/fi";
import { StatusBadge } from "../common/StatusBadge";
import { fmtDate, fmtTime } from "@/lib/format";
import { buildLaunchUrl, worldName } from "@/lib/roblox";
import { api } from "@/lib/api";
import type { RobloxSession } from "@/lib/types";

function CopyCode({ code }: { code: string }) {
  const { onCopy, hasCopied } = useClipboard(code);
  return (
    <Tooltip label={hasCopied ? "Tersalin!" : "Salin kode kelas"} closeOnClick={false}>
      <HStack as="button" onClick={onCopy} spacing={1} px={2} py={0.5} borderRadius="6px" bg="gray.100" _hover={{ bg: "gray.200" }}>
        <Text fontSize="12px" fontFamily="mono" fontWeight={600} color="gray.700">{code}</Text>
        <Icon as={FiCopy} boxSize={3} color="gray.500" />
      </HStack>
    </Tooltip>
  );
}

function Row({ s, onUpdate }: { s: RobloxSession; onUpdate: (s: RobloxSession) => void }) {
  const toast = useToast();
  const canEnter = s.status === "READY" || s.status === "LIVE";
  const d = new Date(s.startAt);
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={{ base: 4, md: 6 }}
      align={{ md: "center" }}
      p={{ base: 4, md: 5 }}
      borderBottom="1px solid"
      borderColor="surface.line"
      _last={{ borderBottom: 0 }}
      opacity={s.status === "ENDED" ? 0.65 : 1}
    >
      <Stack spacing={0} align="center" justify="center" w="64px" h="64px" flexShrink={0} borderRadius="12px" bg={canEnter ? "brand.500" : "brand.50"} color={canEnter ? "white" : "brand.700"}>
        <Text fontSize="12px" fontWeight={600} lineHeight={1}>{d.toLocaleDateString("id-ID", { month: "short", timeZone: "Asia/Jakarta" })}</Text>
        <Text fontFamily="heading" fontWeight={700} fontSize="24px" lineHeight={1.1}>{d.toLocaleDateString("id-ID", { day: "numeric", timeZone: "Asia/Jakarta" })}</Text>
      </Stack>

      <Box flex={1} minW={0}>
        <HStack spacing={2} mb={1} flexWrap="wrap">
          <StatusBadge status={s.status} />
          <CopyCode code={s.code} />
        </HStack>
        <Text fontWeight={700} color="black" fontSize="16px" noOfLines={1}>{s.title}</Text>
        <Text fontSize="14px" color="gray.600">
          {fmtDate(s.startAt)} · {fmtTime(s.startAt)} · {s.durationMin} mnt · {worldName(s.world)}
        </Text>
        {s.status === "FAILED" && s.failReason && (
          <HStack mt={1.5} color="rose.600" fontSize="13px" spacing={1.5}>
            <Icon as={FiAlertTriangle} /><Text>{s.failReason}</Text>
          </HStack>
        )}
        {s.status === "PROVISIONING" && <Progress isIndeterminate size="xs" colorScheme="orange" mt={2} borderRadius="full" maxW="240px" />}
      </Box>

      <Stack spacing={1} minW="150px">
        <HStack fontSize="13px" color="gray.700" spacing={1.5}>
          <Icon as={FiUsers} />
          <Text><b>{s.paid}</b> lunas / {s.enrolled} terdaftar</Text>
        </HStack>
        <Progress value={(s.enrolled / s.capacity) * 100} size="xs" colorScheme="green" borderRadius="full" />
        <Text fontSize="12px" color="gray.500">Kapasitas {s.capacity}</Text>
      </Stack>

      <HStack spacing={2} justify={{ base: "flex-start", md: "flex-end" }} minW={{ md: "190px" }}>
        {canEnter && (
          <Button size="sm" leftIcon={<FiPlay />} as="a" href={buildLaunchUrl(`tutor_${s.id}`)}>
            Masuk sebagai Tutor
          </Button>
        )}
        {s.status === "FAILED" && (
          <Button
            size="sm"
            variant="brandOutline"
            leftIcon={<FiRefreshCw />}
            onClick={async () => {
              onUpdate(await api.retryProvision(s.id));
              toast({ status: "success", title: "Provisioning diulang", position: "top" });
            }}
          >
            Coba Lagi
          </Button>
        )}
        {s.status === "SCHEDULED" && (
          <Tooltip label="Tombol masuk aktif saat server siap (15 menit sebelum mulai)">
            <IconButton aria-label="Belum bisa masuk" icon={<FiPlay />} size="sm" variant="ghostLine" isDisabled />
          </Tooltip>
        )}
      </HStack>
    </Flex>
  );
}

export function SessionList({ sessions, onUpdate }: { sessions: RobloxSession[]; onUpdate: (s: RobloxSession) => void }) {
  if (!sessions.length)
    return (
      <Stack align="center" py={14} spacing={2} textAlign="center">
        <Text fontSize="40px">🗓️</Text>
        <Text fontWeight={700} color="black">Belum ada kelas Roblox</Text>
        <Text fontSize="14px" color="gray.600">Jadwalkan kelas pertamamu, server privatnya kami siapkan otomatis.</Text>
      </Stack>
    );
  return <Box>{sessions.map((s) => <Row key={s.id} s={s} onUpdate={onUpdate} />)}</Box>;
}
