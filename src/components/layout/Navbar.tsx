"use client";
import {
  Box, Button, Container, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex, HStack,
  IconButton, Link, Stack, useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiUser } from "react-icons/fi";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/kelas", label: "Kelas" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/tutor/dashboard", label: "Tutor" },
  { href: "/siswa/dashboard", label: "Kelas Saya" },
];

export function Navbar() {
  const pathname = usePathname();
  const d = useDisclosure();
  const isActive = (h: string) => (h === "/" ? pathname === "/" : pathname.startsWith(h));

  return (
    <Box as="header" position="sticky" top={0} zIndex={20} bg="whiteAlpha.900" backdropFilter="saturate(180%) blur(8px)" borderBottom="1px solid" borderColor="surface.line">
      <Container maxW="1280px" h="72px">
        <Flex h="full" align="center" justify="space-between">
          <Logo />
          <HStack as="nav" spacing={10} display={{ base: "none", lg: "flex" }}>
            {NAV.map((n) => (
              <Link
                key={n.href}
                as={NextLink}
                href={n.href}
                fontFamily="heading"
                fontWeight={500}
                fontSize="16px"
                color={isActive(n.href) ? "brand.500" : "black"}
                _hover={{ color: "brand.500", textDecoration: "none" }}
              >
                {n.label}
              </Link>
            ))}
          </HStack>
          <HStack spacing={3}>
            <Button size="sm" rightIcon={<FiUser />} fontSize="14px">
              Masuk
            </Button>
            <IconButton aria-label="Menu" icon={<FiMenu size={22} />} variant="ghost" display={{ base: "inline-flex", lg: "none" }} onClick={d.onOpen} />
          </HStack>
        </Flex>
      </Container>
      <Drawer isOpen={d.isOpen} onClose={d.onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody pt={10}>
            <Stack spacing={5}>
              {NAV.map((n) => (
                <Link key={n.href} as={NextLink} href={n.href} onClick={d.onClose} fontFamily="heading" fontWeight={500} color={isActive(n.href) ? "brand.500" : "black"}>
                  {n.label}
                </Link>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
