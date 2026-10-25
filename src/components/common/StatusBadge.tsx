import { Badge, HStack, Box } from "@chakra-ui/react";
import type { SessionStatus } from "@/lib/types";

const MAP: Record<SessionStatus, { label: string; bg: string; color: string; dot: string; pulse?: boolean }> = {
  SCHEDULED: { label: "Terjadwal", bg: "surface.soft", color: "navy.500", dot: "navy.500" },
  PROVISIONING: { label: "Menyiapkan server", bg: "brand.50", color: "brand.700", dot: "brand.500", pulse: true },
  READY: { label: "Server siap", bg: "mint.50", color: "mint.600", dot: "mint.500" },
  LIVE: { label: "Sedang berlangsung", bg: "mint.50", color: "mint.600", dot: "mint.500", pulse: true },
  ENDED: { label: "Selesai", bg: "gray.100", color: "gray.600", dot: "gray.400" },
  FAILED: { label: "Gagal disiapkan", bg: "rose.50", color: "rose.600", dot: "rose.500" },
};

export function StatusBadge({ status }: { status: SessionStatus }) {
  const s = MAP[status];
  return (
    <Badge bg={s.bg} color={s.color}>
      <HStack spacing={1.5}>
        <Box
          w="7px" h="7px" borderRadius="full" bg={s.dot}
          sx={s.pulse ? { animation: "cbPulse 1.4s ease-in-out infinite", "@keyframes cbPulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } } } : undefined}
        />
        <span>{s.label}</span>
      </HStack>
    </Badge>
  );
}
