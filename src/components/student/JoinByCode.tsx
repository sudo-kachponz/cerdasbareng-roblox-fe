"use client";
import { Alert, AlertDescription, AlertIcon, Box, Button, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { ValidateJoinResponse } from "@/lib/types";

/** Masuk kelas pakai kode (mis. dari tutor via WhatsApp). Validasi tetap lewat /validate-join. */
export function JoinByCode({ onValidate }: { onValidate: (code: string) => Promise<ValidateJoinResponse> }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<ValidateJoinResponse | null>(null);

  const submit = async () => {
    setBusy(true);
    setRes(null);
    try { setRes(await onValidate(code)); } finally { setBusy(false); }
  };

  return (
    <Box bg="white" borderRadius="card" boxShadow="cardSm" p={5}>
      <Text fontWeight={700} color="black" mb={1}>Punya kode kelas?</Text>
      <Text fontSize="14px" color="gray.600" mb={3}>Masukkan kode dari tutormu, contoh <b>CB-7Q2K</b>.</Text>
      <Flex gap={3} direction={{ base: "column", sm: "row" }}>
        <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="CB-XXXX" fontFamily="mono" maxW={{ sm: "220px" }} onKeyDown={(e) => e.key === "Enter" && code && submit()} />
        <Button onClick={submit} isLoading={busy} isDisabled={!code}>Cek & Masuk</Button>
      </Flex>
      {res && !res.allowed && (
        <Stack mt={3}>
          <Alert status={res.reason === "TOO_EARLY" ? "info" : "warning"} borderRadius="10px" fontSize="14px">
            <AlertIcon />
            <AlertDescription>{res.message}{res.opensAt && ` Dibuka ${new Date(res.opensAt).toLocaleString("id-ID", { timeStyle: "short", dateStyle: "medium" })}.`}</AlertDescription>
          </Alert>
        </Stack>
      )}
    </Box>
  );
}
