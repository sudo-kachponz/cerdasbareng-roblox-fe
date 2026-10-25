"use client";
import {
  Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Badge, Box, Button,
  Container, Flex, Heading, HStack, Icon, SimpleGrid, Stack, Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FiCheckCircle, FiLock, FiMessageCircle, FiMap, FiAward, FiShield, FiUserCheck, FiMonitor, FiArrowRight } from "react-icons/fi";
import { GamePreview } from "./GamePreview";
import { SectionTag } from "../common/SectionTag";

/* -------------------------------------------------------------------------- */
/*  Komponen landing modular — bisa di-import satu-satu ke homepage CB.        */
/*  <RobloxHero/> <RobloxHowItWorks/> <RobloxFeatures/> <RobloxWorlds/>        */
/*  <RobloxParentSafety/> <RobloxFaq/> <RobloxCta/>                             */
/* -------------------------------------------------------------------------- */

export function RobloxHero() {
  return (
    <Box position="relative" overflow="hidden" bg="brand.50" bgGradient="linear(179deg, #FFF0EA 84%, rgba(255,255,255,0) 94%)">
      <Container maxW="1280px" py={{ base: 12, md: 20 }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 10, lg: 14 }} alignItems="center">
          <Stack spacing={6} textAlign={{ base: "center", lg: "left" }} align={{ base: "center", lg: "flex-start" }}>
            <Badge bg="white" color="brand.600" border="1px solid" borderColor="brand.200" px={3} py={1} borderRadius="full" fontSize="13px">
              🎮 Baru · Game-Based Learning
            </Badge>
            <Heading as="h1" fontSize={{ base: "32px", md: "44px" }} lineHeight={1.15}>
              Belajar Jadi Petualangan di <Text as="span" color="brand.500">Dunia Roblox</Text>
            </Heading>
            <Text fontSize={{ base: "16px", md: "18px" }} color="gray.700" maxW="540px">
              Kelas interaktif bersama tutor CerdasBareng di ruang kelas virtual yang privat. Siswa menjelajah dunia
              tematik, menyelesaikan quest, dan berlatih bahasa dengan NPC pintar — belajar terasa seperti bermain.
            </Text>
            <HStack spacing={3} flexWrap="wrap" justify={{ base: "center", lg: "flex-start" }}>
              <Button as={NextLink} href="/kelas?type=roblox" size="md" rightIcon={<FiArrowRight />}>Coba Kelas Roblox</Button>
              <Button as="a" href="#cara-kerja" variant="brandOutline">Lihat Cara Kerjanya</Button>
            </HStack>
            <HStack spacing={6} pt={2} color="gray.600" fontSize="14px" flexWrap="wrap" justify={{ base: "center", lg: "flex-start" }}>
              <HStack><Icon as={FiCheckCircle} color="mint.500" /><Text>Usia 6–18 tahun</Text></HStack>
              <HStack><Icon as={FiCheckCircle} color="mint.500" /><Text>PC, tablet & HP</Text></HStack>
              <HStack><Icon as={FiCheckCircle} color="mint.500" /><Text>Dipandu tutor</Text></HStack>
            </HStack>
          </Stack>
          <GamePreview />
        </SimpleGrid>
      </Container>
    </Box>
  );
}

const STEPS = [
  { n: 1, title: "Daftar & bayar kelas", desc: "Pilih kelas Roblox di CerdasBareng, lalu selesaikan pembayaran seperti kelas biasa." },
  { n: 2, title: "Klik “Masuk Kelas”", desc: "10 menit sebelum mulai, tombol di dashboard siswa aktif. Sistem mengecek pendaftaranmu." },
  { n: 3, title: "Roblox terbuka di Lobby", desc: "Aplikasi Roblox terbuka otomatis dan membawamu ke Lobby CerdasBareng." },
  { n: 4, title: "Teleport ke kelasmu", desc: "Dari Lobby kamu langsung dipindahkan ke ruang kelas privat bersama tutor & teman sekelas." },
];

export function RobloxHowItWorks() {
  return (
    <Box id="cara-kerja" py={{ base: 14, md: 20 }} bg="white">
      <Container maxW="1152px">
        <Stack align="center" spacing={3} mb={12} textAlign="center">
          <SectionTag emoji="🚀">Cara Kerja</SectionTag>
          <Heading as="h2" fontSize={{ base: "28px", md: "36px" }}>Dari Web ke Kelas Roblox dalam <Text as="span" color="brand.500">4 Langkah</Text></Heading>
        </Stack>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {STEPS.map((s, i) => (
            <Box key={s.n} position="relative" bg="white" borderRadius="card" boxShadow="card" p={6}>
              <Flex w="44px" h="44px" borderRadius="full" bg="brand.500" color="white" align="center" justify="center" fontFamily="heading" fontWeight={700} fontSize="20px" mb={4}>
                {s.n}
              </Flex>
              <Heading as="h3" fontSize="18px" mb={2}>{s.title}</Heading>
              <Text fontSize="14px" color="gray.600">{s.desc}</Text>
              {i < STEPS.length - 1 && (
                <Icon as={FiArrowRight} color="brand.500" boxSize={6} position="absolute" right="-22px" top="50%" display={{ base: "none", lg: "block" }} />
              )}
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

const FEATURES = [
  { icon: FiLock, bg: "brand.50", ic: "brand.500", title: "Ruang Kelas Privat", desc: "Setiap sesi punya server khusus. Hanya siswa terdaftar dan tutornya yang bisa masuk." },
  { icon: FiMessageCircle, bg: "lavender.50", ic: "lavender.500", title: "NPC Pintar Berbasis AI", desc: "Karakter pemandu yang memberi petunjuk, mengajak dialog bahasa, dan menyesuaikan level siswa." },
  { icon: FiAward, bg: "mint.50", ic: "mint.500", title: "Quest & Mini-Game", desc: "Materi Mandarin dan Inggris dikemas jadi misi seru dengan poin dan hadiah." },
  { icon: FiMap, bg: "navy.50", ic: "navy.500", title: "Dunia Tematik", desc: "Peta 3D yang dirancang sesuai topik pelajaran — dari stasiun kereta sampai pasar tradisional." },
];

export function RobloxFeatures() {
  return (
    <Box py={{ base: 14, md: 20 }} bg="surface.page">
      <Container maxW="1152px">
        <Stack align="center" spacing={3} mb={12} textAlign="center">
          <SectionTag emoji="🎉">Kenapa Roblox</SectionTag>
          <Heading as="h2" fontSize={{ base: "28px", md: "36px" }}>Belajar Aktif, Bukan Sekadar Menonton</Heading>
          <Text color="gray.600" maxW="640px">Siswa bergerak, bertanya, dan mencoba langsung. Tutor tetap memandu dari dalam game.</Text>
        </Stack>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {FEATURES.map((f) => (
            <Box key={f.title} bg={f.bg} borderRadius="card" p={6} transition="transform .2s" _hover={{ transform: "translateY(-4px)" }}>
              <Flex w="56px" h="56px" borderRadius="14px" bg="white" align="center" justify="center" mb={5} boxShadow="cardSm">
                <Icon as={f.icon} boxSize={7} color={f.ic} />
              </Flex>
              <Heading as="h3" fontSize="20px" mb={2}>{f.title}</Heading>
              <Text fontSize="15px" color="gray.700">{f.desc}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

const WORLDS = [
  { name: "Neo-Beijing Metropolis", subject: "Bahasa Mandarin", level: "SMA", grad: "linear(135deg, #0C2EBB 0%, #592E9B 45%, #B52971 100%)", emoji: "🏙️" },
  { name: "London Quest Street", subject: "Bahasa Inggris", level: "SMP", grad: "linear(135deg, #2563EB 0%, #6F51F8 100%)", emoji: "🎡" },
  { name: "Pasar Angka Nusantara", subject: "Matematika", level: "SD", grad: "linear(135deg, #FF722D 0%, #FC3030 100%)", emoji: "🛒" },
  { name: "Lab Sains Melayang", subject: "IPA", level: "SMP", grad: "linear(135deg, #04B528 0%, #2563EB 100%)", emoji: "🧪" },
];

export function RobloxWorlds() {
  return (
    <Box py={{ base: 14, md: 20 }} bg="white">
      <Container maxW="1280px">
        <Stack align="center" spacing={3} mb={12} textAlign="center">
          <SectionTag emoji="🌏">Dunia Belajar</SectionTag>
          <Heading as="h2" fontSize={{ base: "28px", md: "36px" }}>Jelajahi <Text as="span" color="brand.500">Dunia Tematik</Text> CerdasBareng</Heading>
        </Stack>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {WORLDS.map((w) => (
            <Box key={w.name} borderRadius="card" overflow="hidden" boxShadow="card" bg="white">
              <Flex h="150px" bgGradient={w.grad} align="center" justify="center" fontSize="56px">{w.emoji}</Flex>
              <Stack p={5} spacing={2}>
                <HStack spacing={2}>
                  <Badge bg="brand.50" color="brand.700">{w.level}</Badge>
                  <Badge bg="surface.soft" color="navy.500">{w.subject}</Badge>
                </HStack>
                <Heading as="h3" fontSize="18px">{w.name}</Heading>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
        <Text textAlign="center" fontSize="13px" color="gray.500" mt={6}>* Nama dan tampilan world bersifat ilustrasi, akan diganti screenshot asli dari Roblox Studio.</Text>
      </Container>
    </Box>
  );
}

const SAFETY = [
  { icon: FiUserCheck, t: "Hanya siswa terdaftar", d: "Akses kelas diverifikasi otomatis: terdaftar dan sudah lunas." },
  { icon: FiShield, t: "Dipandu tutor terverifikasi", d: "Akun Roblox tutor ditautkan ke profil CerdasBareng sebagai tuan rumah sesi." },
  { icon: FiLock, t: "Tanpa orang asing", d: "Ruang kelas privat, tidak bisa dimasuki pemain umum dari luar kelas." },
  { icon: FiMonitor, t: "Orang tua tetap terinformasi", d: "Jadwal dan riwayat sesi bisa dipantau dari dashboard CerdasBareng." },
];

export function RobloxParentSafety() {
  return (
    <Box py={{ base: 14, md: 20 }} bgGradient="linear(180deg, #F0F5FF 0%, #FFFFFF 100%)">
      <Container maxW="1152px">
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
          <Stack spacing={4}>
            <SectionTag emoji="🛡️">Untuk Orang Tua</SectionTag>
            <Heading as="h2" fontSize={{ base: "28px", md: "36px" }}>Seru untuk Anak, <Text as="span" color="brand.500">Tenang</Text> untuk Orang Tua</Heading>
            <Text color="gray.700">Kami membangun kelas Roblox dengan kontrol akses yang ketat, supaya anak fokus belajar di lingkungan yang aman.</Text>
          </Stack>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
            {SAFETY.map((s) => (
              <HStack key={s.t} align="flex-start" spacing={4} bg="white" p={5} borderRadius="card" boxShadow="cardSm">
                <Flex w="40px" h="40px" flexShrink={0} borderRadius="full" bg="mint.50" align="center" justify="center">
                  <Icon as={s.icon} color="mint.500" boxSize={5} />
                </Flex>
                <Box>
                  <Text fontWeight={700} color="black" mb={1}>{s.t}</Text>
                  <Text fontSize="14px" color="gray.600">{s.d}</Text>
                </Box>
              </HStack>
            ))}
          </SimpleGrid>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

const FAQ = [
  { q: "Apakah anak perlu punya akun Roblox?", a: "Ya, siswa masuk menggunakan akun Roblox masing-masing. Untuk anak di bawah 13 tahun, akun sebaiknya dibuat dan diawasi orang tua." },
  { q: "Apakah perlu membayar di dalam Roblox?", a: "Tidak. Pembayaran kelas dilakukan di CerdasBareng. Di dalam world kelas tidak ada pembelian." },
  { q: "Perangkat apa yang bisa dipakai?", a: "PC/laptop, tablet, atau HP yang bisa menjalankan aplikasi Roblox, dengan koneksi internet stabil." },
  { q: "Bagaimana kalau Roblox tidak terbuka?", a: "Pastikan aplikasi Roblox sudah terpasang, lalu klik lagi tombol “Masuk Kelas” di dashboard. Tim kami siap membantu lewat WhatsApp." },
];

export function RobloxFaq() {
  return (
    <Box py={{ base: 14, md: 20 }} bg="white">
      <Container maxW="720px">
        <Heading as="h2" fontSize={{ base: "26px", md: "32px" }} textAlign="center" mb={8}>Pertanyaan seputar Kelas Roblox</Heading>
        <Accordion allowToggle bg="white" borderRadius="card" boxShadow="card" px={4} py={2}>
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} borderTopWidth={i === 0 ? 0 : "1px"} borderBottomWidth={0}>
              <AccordionButton py={4} _hover={{ bg: "transparent" }}>
                <Text flex="1" textAlign="left" fontWeight={600} color="black">{f.q}</Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} color="gray.600" fontSize="15px">{f.a}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Box>
  );
}

export function RobloxCta() {
  return (
    <Box px={4} pb={{ base: 14, md: 20 }} bg="white">
      <Container maxW="1152px" borderRadius="20px" bgGradient="linear(92deg, #0C2EBB 0%, #592E9B 31%, #B52971 67%, #681689 89%, #3B2EA7 100%)" py={{ base: 10, md: 14 }} px={{ base: 6, md: 14 }}>
        <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={6} textAlign={{ base: "center", md: "left" }}>
          <Box>
            <Heading as="h2" color="white" fontSize={{ base: "24px", md: "32px" }} mb={2}>Siap belajar sambil bertualang?</Heading>
            <Text color="whiteAlpha.900">Promo launching kelas Roblox — kuota terbatas tiap sesi.</Text>
          </Box>
          <Button as={NextLink} href="/kelas?type=roblox" size="md" flexShrink={0}>Daftar Kelas Roblox</Button>
        </Flex>
      </Container>
    </Box>
  );
}

/** Semua seksi sekaligus (untuk halaman /roblox). Untuk homepage, cukup pakai RobloxHero + RobloxFeatures. */
export function RobloxShowcase() {
  return (
    <>
      <RobloxHero />
      <RobloxHowItWorks />
      <RobloxFeatures />
      <RobloxWorlds />
      <RobloxParentSafety />
      <RobloxFaq />
      <RobloxCta />
    </>
  );
}
