import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

/**
 * Design token CerdasBareng — diambil dari inspeksi computed style cerdasbareng.id (Okt 2026).
 * Situs aslinya: Next.js + Chakra UI v2 + Emotion.
 *  - Heading / tombol hero : Ubuntu 500/700
 *  - Body / tombol / UI    : Inter 400–700
 *  - Primary orange        : #FF7D39 (hover #FC641B)
 *  - Footer navy           : #002987
 *  - Kartu pastel          : #FFF0EA (orange), #E8FCF1 (hijau), #E2E2FD (ungu)
 *  - Teks                  : #000 (heading), #2D3748 (body), #718096 (muted)
 */

const config: ThemeConfig = { initialColorMode: "light", useSystemColorMode: false };

export const theme = extendTheme({
  config,
  fonts: {
    heading: `'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`,
    body: `'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`,
  },
  colors: {
    brand: {
      50: "#FFF0EA",
      100: "#FFDDCC",
      200: "#FFC3A3",
      300: "#FFA676",
      400: "#FF9058",
      500: "#FF7D39",
      600: "#FC641B",
      700: "#DB500C",
      800: "#A93D09",
      900: "#6E2806",
    },
    navy: {
      50: "#EEF2FB",
      100: "#D3E1FE",
      200: "#BDCBE2",
      500: "#2563EB",
      700: "#0C2EBB",
      800: "#002987",
      900: "#001A57",
    },
    mint: { 50: "#E8FCF1", 500: "#04B528", 600: "#03932A" },
    lavender: { 50: "#E2E2FD", 500: "#6F51F8" },
    rose: { 50: "#FFEBEB", 500: "#FC3030", 600: "#E33333" },
    surface: { page: "#F8F9FC", soft: "#F0F5FF", line: "#EDEEF2" },
  },
  shadows: {
    card: "0px 4px 8px rgba(23,25,35,0.1), 0px 0px 1px rgba(23,25,35,0.3)",
    cardSm: "0px 2px 4px rgba(23,25,35,0.1), 0px 0px 1px rgba(23,25,35,0.3)",
    cardLg: "0px 8px 16px rgba(23,25,35,0.1), 0px 0px 1px rgba(23,25,35,0.3)",
  },
  radii: { btn: "10px", card: "12px" },
  styles: {
    global: {
      "html, body": { bg: "white", color: "gray.700" },
      "h1, h2, h3, h4": { color: "black" },
    },
  },
  components: {
    Heading: {
      baseStyle: { fontFamily: "heading", fontWeight: 700, color: "black", letterSpacing: "-0.01em" },
    },
    Button: {
      baseStyle: { fontFamily: "body", fontWeight: 700, borderRadius: "btn" },
      sizes: {
        md: { h: "44px", px: 5, fontSize: "15px" },
        sm: { h: "36px", px: 4, fontSize: "14px" },
      },
      variants: {
        brand: {
          bg: "brand.500",
          color: "white",
          _hover: { bg: "brand.600", _disabled: { bg: "brand.500" } },
          _active: { bg: "brand.700" },
        },
        brandOutline: {
          bg: "white",
          color: "brand.500",
          border: "1px solid",
          borderColor: "brand.500",
          _hover: { bg: "brand.50" },
        },
        // tombol abu-abu bergaris seperti "Cari Kelas" & pilihan role di modal
        ghostLine: {
          bg: "white",
          color: "black",
          border: "1px solid",
          borderColor: "black",
          borderRadius: "8px",
          fontWeight: 600,
          _hover: { bg: "gray.50" },
        },
      },
      defaultProps: { variant: "brand" },
    },
    Badge: {
      baseStyle: { borderRadius: "6px", px: 2, py: 0.5, textTransform: "none", fontWeight: 600, fontSize: "12px" },
    },
    Input: { defaultProps: { focusBorderColor: "brand.500" } },
    Select: { defaultProps: { focusBorderColor: "brand.500" } },
    NumberInput: { defaultProps: { focusBorderColor: "brand.500" } },
    Modal: { baseStyle: { dialog: { borderRadius: "16px" } } },
  },
});
