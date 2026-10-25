"use client";
import { Button, Flex, Link, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ROBLOX_DOWNLOAD_URL } from "@/lib/roblox";

/**
 * Modal saat membuka Roblox dari browser (scope #3 – integrasi peluncuran).
 * Browser akan menampilkan dialog "Buka Roblox?" — setelah 4 dtk kami tampilkan
 * opsi fallback (coba lagi / download Roblox) karena web tidak bisa mendeteksi
 * pasti apakah app sudah terpasang.
 */
export function LaunchRobloxModal({ launchUrl, title, onClose }: { launchUrl: string | null; title?: string; onClose: () => void }) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!launchUrl) return;
    setShowFallback(false);
    window.location.href = launchUrl;
    const t = setTimeout(() => setShowFallback(true), 4000);
    return () => clearTimeout(t);
  }, [launchUrl]);

  return (
    <Modal isOpen={!!launchUrl} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(6px)" />
      <ModalContent mx={4} borderRadius="16px">
        <ModalBody py={8}>
          <Stack align="center" textAlign="center" spacing={4}>
            <Flex w="72px" h="72px" borderRadius="20px" bgGradient="linear(135deg, #0C2EBB, #B52971)" align="center" justify="center">
              <Spinner color="white" thickness="3px" />
            </Flex>
            <Text fontSize="26px">🥳</Text>
            <Text fontFamily="heading" fontWeight={700} fontSize="22px" color="brand.500">Membuka Roblox…</Text>
            <Text color="gray.700" fontSize="15px">
              {title ? <>Kamu akan masuk ke Lobby lalu dipindahkan otomatis ke kelas <b>{title}</b>.</> : "Kamu akan masuk ke Lobby CerdasBareng."}
              {" "}Jika browser bertanya, pilih <b>Buka Roblox</b>.
            </Text>
            {showFallback && (
              <Stack w="full" spacing={3} pt={2}>
                <Button as="a" href={launchUrl ?? "#"} w="full">Coba Buka Lagi</Button>
                <Button as={Link} href={ROBLOX_DOWNLOAD_URL} isExternal w="full" variant="ghostLine">Belum punya Roblox? Download dulu</Button>
                <Button variant="ghost" size="sm" onClick={onClose}>Tutup</Button>
              </Stack>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
