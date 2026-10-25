"use client";
import {
  AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
  Avatar, Box, Button, Flex, HStack, Icon, List, ListIcon, ListItem, Skeleton, Stack, Text, useDisclosure, useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiCheckCircle, FiLink, FiLogOut, FiShield } from "react-icons/fi";
import { api } from "@/lib/api";
import type { RobloxLink } from "@/lib/types";

interface Props {
  link: RobloxLink | null;
  onChange: (l: RobloxLink) => void;
}

/** Komponen "Connect Roblox Account" di Dashboard Tutor (scope #1). */
export function ConnectRobloxCard({ link, onChange }: Props) {
  const confirm = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  if (!link) return <Skeleton h="180px" borderRadius="card" />;

  const doUnlink = async () => {
    setBusy(true);
    try {
      onChange(await api.unlinkRoblox());
      toast({ status: "info", title: "Akun Roblox diputuskan", position: "top" });
    } finally {
      setBusy(false);
      confirm.onClose();
    }
  };

  return (
    <Box bg="white" borderRadius="card" boxShadow="card" overflow="hidden">
      <Box h="6px" bgGradient="linear(90deg, #0C2EBB, #B52971, #FF7D39)" />
      <Box p={{ base: 5, md: 6 }}>
        {!link.linked ? (
          <Flex direction={{ base: "column", md: "row" }} gap={6} justify="space-between" align={{ md: "center" }}>
            <Stack spacing={3} maxW="560px">
              <HStack>
                <Flex w="40px" h="40px" borderRadius="10px" bg="brand.50" align="center" justify="center">
                  <Icon as={FiLink} color="brand.500" boxSize={5} />
                </Flex>
                <Text fontFamily="heading" fontWeight={700} fontSize="20px" color="black">Hubungkan Akun Roblox</Text>
              </HStack>
              <Text fontSize="15px" color="gray.600">
                Tautkan akun Roblox resmimu agar kamu tercatat sebagai tuan rumah sesi dan bisa menjadwalkan kelas di dunia Roblox CerdasBareng.
              </Text>
              <List spacing={1.5} fontSize="14px" color="gray.700">
                <ListItem><ListIcon as={FiCheckCircle} color="mint.500" />Login aman lewat halaman resmi Roblox (OAuth 2.0)</ListItem>
                <ListItem><ListIcon as={FiCheckCircle} color="mint.500" />CerdasBareng hanya membaca ID & username — tidak bisa mengakses password</ListItem>
                <ListItem><ListIcon as={FiCheckCircle} color="mint.500" />Bisa diputuskan kapan saja</ListItem>
              </List>
            </Stack>
            <Button as="a" href={api.connectRobloxUrl} size="md" leftIcon={<FiLink />} flexShrink={0}>
              Hubungkan dengan Roblox
            </Button>
          </Flex>
        ) : (
          <Flex direction={{ base: "column", md: "row" }} gap={5} justify="space-between" align={{ md: "center" }}>
            <HStack spacing={4}>
              <Avatar name={link.displayName} src={link.avatarUrl ?? undefined} bg="brand.500" color="white" size="lg" />
              <Box>
                <HStack spacing={2} mb={0.5}>
                  <Text fontFamily="heading" fontWeight={700} fontSize="20px" color="black">{link.displayName}</Text>
                  <HStack bg="mint.50" color="mint.600" px={2} py={0.5} borderRadius="6px" spacing={1}>
                    <Icon as={FiShield} boxSize={3.5} />
                    <Text fontSize="12px" fontWeight={700}>Terverifikasi</Text>
                  </HStack>
                </HStack>
                <Text fontSize="14px" color="gray.600">@{link.username} · Roblox ID {link.robloxUserId}</Text>
                <Text fontSize="13px" color="gray.500">
                  Ditautkan {link.linkedAt && new Date(link.linkedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </Text>
              </Box>
            </HStack>
            <Button variant="ghost" colorScheme="red" leftIcon={<FiLogOut />} size="sm" onClick={confirm.onOpen}>
              Putuskan Akun
            </Button>
          </Flex>
        )}
      </Box>

      <AlertDialog isOpen={confirm.isOpen} leastDestructiveRef={cancelRef} onClose={confirm.onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent mx={4}>
            <AlertDialogHeader fontFamily="heading">Putuskan akun Roblox?</AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              Kamu tidak bisa menjadwalkan kelas Roblox baru sampai akun ditautkan lagi. Sesi yang sudah terjadwal tetap berjalan.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} variant="ghostLine" onClick={confirm.onClose}>Batal</Button>
              <Button colorScheme="red" variant="solid" isLoading={busy} onClick={doUnlink}>Putuskan</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
