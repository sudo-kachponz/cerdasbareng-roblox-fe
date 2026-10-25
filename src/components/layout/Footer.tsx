import { Box, Container, Divider, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Logo } from "./Logo";

const col = (title: string, items: string[]) => (
  <Stack spacing={3}>
    <Text fontFamily="heading" fontWeight={700} fontSize="22px" color="white">{title}</Text>
    {items.map((i) => (
      <Text key={i} color="whiteAlpha.900" fontSize="16px">{i}</Text>
    ))}
  </Stack>
);

/** Footer ringkas mengikuti footer navy CerdasBareng (#002987). */
export function Footer() {
  return (
    <Box as="footer" bg="navy.800" bgGradient="linear(160deg, #002987 0%, #001F6B 100%)" color="white" pt={14} pb={8}>
      <Container maxW="1280px">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Stack spacing={4}>
            <Logo variant="white" />
            <Text fontWeight={700}>PT Inovasi Akademi Sukses</Text>
            <Text color="whiteAlpha.800" fontSize="15px">info@cerdasbareng.id</Text>
          </Stack>
          {col("Perusahaan", ["Tentang Kami", "Pusat Bantuan", "Kebijakan Privasi"])}
          {col("Kelas", ["Mata Pelajaran SD", "Mata Pelajaran SMP", "Mata Pelajaran SMA", "Kelas Roblox"])}
        </SimpleGrid>
        <Divider my={8} borderColor="whiteAlpha.300" />
        <Text fontSize="14px" color="whiteAlpha.700">Copyright © 2026 CerdasBareng. All Rights Reserved.</Text>
      </Container>
    </Box>
  );
}
