import { HStack, Text } from "@chakra-ui/react";

/** Pill kecil di atas judul seksi, seperti "Pelajaran 🎉" / "Cara Daftar ✨" di situs CB. */
export function SectionTag({ children, emoji = "✨" }: { children: React.ReactNode; emoji?: string }) {
  return (
    <HStack display="inline-flex" w="fit-content" spacing={2} px={4} py={1} border="1px solid" borderColor="black" borderRadius="full" bg="white">
      <Text fontSize="14px" color="black">{children}</Text>
      <span>{emoji}</span>
    </HStack>
  );
}
