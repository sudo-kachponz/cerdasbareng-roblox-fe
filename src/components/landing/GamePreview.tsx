"use client";
import { Box, Flex, HStack, Progress, Stack, Text } from "@chakra-ui/react";

/** Ilustrasi "jendela game" orisinal dari kotak-kotak CSS — placeholder sampai ada screenshot world asli. */
export function GamePreview() {
  const towers = [70, 120, 90, 150, 60, 110, 85, 130, 75];
  return (
    <Box
      position="relative"
      w="full"
      maxW="520px"
      mx="auto"
      borderRadius="20px"
      overflow="hidden"
      boxShadow="0 24px 48px rgba(12,46,187,0.35)"
      border="6px solid white"
      bg="#1E1B4B"
      aspectRatio={{ base: "4 / 3.4", md: "4 / 3" }}
    >
      {/* langit */}
      <Box position="absolute" inset={0} bgGradient="linear(180deg, #3B2EA7 0%, #B52971 70%, #FF7D39 100%)" />
      {/* matahari */}
      <Box position="absolute" w="90px" h="90px" borderRadius="full" bg="#FFD166" top="18%" right="16%" boxShadow="0 0 60px #FFD166" />
      {/* skyline kotak */}
      <Flex position="absolute" bottom="22%" left={0} right={0} align="flex-end" justify="space-around" px={2}>
        {towers.map((h, i) => (
          <Box key={i} w={`${8 + (i % 3) * 2}%`} h={`${h}px`} bg={i % 2 ? "#2A1F6E" : "#3A2C8C"} borderTopRadius="4px" position="relative">
            {Array.from({ length: Math.floor(h / 26) }).map((_, k) => (
              <Box key={k} position="absolute" left="25%" w="50%" h="6px" top={`${12 + k * 24}px`} bg={(i + k) % 3 ? "#FFC3A3" : "#6F51F8"} opacity={0.8} borderRadius="1px" />
            ))}
          </Box>
        ))}
      </Flex>
      {/* jalan */}
      <Box position="absolute" bottom={0} left={0} right={0} h="22%" bg="#04B528" bgGradient="linear(180deg, #22C55E 0%, #03932A 100%)" />
      <Box position="absolute" bottom="8%" left="10%" right="10%" h="10px" bg="#F8F9FC" borderRadius="full" opacity={0.7} />

      {/* avatar kotak */}
      {[{ l: "22%", c: "#FF7D39" }, { l: "34%", c: "#2563EB" }, { l: "62%", c: "#FC3030" }].map((a, i) => (
        <Stack key={i} position="absolute" bottom="14%" left={a.l} spacing="2px" align="center">
          <Box w="18px" h="18px" bg="#FFDDCC" borderRadius="3px" />
          <Box w="24px" h="26px" bg={a.c} borderRadius="3px" />
          <HStack spacing="2px"><Box w="10px" h="16px" bg="#1A202C" /><Box w="10px" h="16px" bg="#1A202C" /></HStack>
        </Stack>
      ))}

      {/* HUD quest */}
      <Box position="absolute" top={3} left={3} bg="whiteAlpha.900" borderRadius="10px" px={3} py={2} minW="160px" boxShadow="cardSm">
        <Text fontSize="11px" fontWeight={700} color="brand.600" textTransform="uppercase" letterSpacing="0.04em">Quest 2/5</Text>
        <Text fontSize="13px" fontWeight={600} color="black">Tanya arah ke stasiun 🚉</Text>
        <Progress value={40} size="xs" colorScheme="orange" mt={1.5} borderRadius="full" />
      </Box>

      {/* dialog NPC */}
      <Box position="absolute" bottom="34%" right={4} maxW="58%" bg="white" borderRadius="14px" borderBottomRightRadius="4px" px={3} py={2} boxShadow="card">
        <Text fontSize="11px" fontWeight={700} color="lavender.500">NPC Guide · AI</Text>
        <Text fontSize="13px" color="black" fontWeight={500}>你好! 火车站在哪里? Coba ulangi pelan-pelan ya 😊</Text>
      </Box>

      {/* badge kelas privat */}
      <HStack position="absolute" top={3} right={3} bg="blackAlpha.600" color="white" borderRadius="full" px={3} py={1} spacing={1.5}>
        <Box w="7px" h="7px" borderRadius="full" bg="#22C55E" />
        <Text fontSize="11px" fontWeight={600}>Kelas Privat · 8 siswa</Text>
      </HStack>
    </Box>
  );
}
