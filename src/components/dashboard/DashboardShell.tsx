"use client";
import { Box, Container, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { Navbar } from "../layout/Navbar";

export function DashboardShell({ title, subtitle, action, children }: {
  title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <Box minH="100vh" bg="surface.page">
      <Navbar />
      <Container maxW="1152px" py={{ base: 6, md: 10 }}>
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ md: "flex-end" }} gap={4} mb={6}>
          <Stack spacing={1}>
            <Heading as="h1" fontSize={{ base: "26px", md: "32px" }}>{title}</Heading>
            {subtitle && <Text color="gray.600">{subtitle}</Text>}
          </Stack>
          {action}
        </Flex>
        {children}
      </Container>
    </Box>
  );
}

export function StatCard({ label, value, hint, tone = "brand" }: { label: string; value: React.ReactNode; hint?: string; tone?: "brand" | "mint" | "lavender" | "navy" }) {
  const bg = { brand: "brand.50", mint: "mint.50", lavender: "lavender.50", navy: "navy.50" }[tone];
  return (
    <Box bg={bg} borderRadius="card" p={5}>
      <Text fontSize="13px" color="gray.600" fontWeight={600}>{label}</Text>
      <Text fontFamily="heading" fontWeight={700} fontSize="28px" color="black" lineHeight={1.2}>{value}</Text>
      {hint && <Text fontSize="12px" color="gray.500">{hint}</Text>}
    </Box>
  );
}
