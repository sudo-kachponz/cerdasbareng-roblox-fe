"use client";
import { Box, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";

/**
 * Pakai logo asli dari repo CerdasBareng (`public/images/logo.png`).
 * Kalau file belum ada di project ini, fallback ke wordmark teks.
 */
export function Logo({ variant = "default" }: { variant?: "default" | "white" }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  // onError bisa terjadi sebelum hydration, jadi cek ulang setelah mount
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  const src = variant === "white" ? "/images/logo-orange-white.png" : "/images/logo.png";
  return (
    <Box as={NextLink} href="/" display="inline-flex" alignItems="center" gap={2}>
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={ref} src={src} alt="CerdasBareng" style={{ height: 32 }} onError={() => setFailed(true)} />
      ) : (
        <Text fontFamily="heading" fontWeight={500} fontSize="24px" color={variant === "white" ? "white" : "#1B2B5B"}>
          <Text as="span" color="brand.500" fontWeight={700}>
            ◡
          </Text>{" "}
          CerdasBareng
        </Text>
      )}
    </Box>
  );
}
