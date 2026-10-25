import { prisma } from "../lib/prisma";
import { encrypt, decrypt } from "../lib/crypto";
import type { RobloxLink } from "@/lib/types";

export async function getLink(tutorId: string): Promise<RobloxLink> {
  const acc = await prisma.tutorRobloxAccount.findUnique({ where: { tutorId } });
  if (!acc) return { linked: false };
  return {
    linked: true,
    robloxUserId: acc.robloxUserId,
    username: acc.username,
    displayName: acc.displayName,
    avatarUrl: acc.avatarUrl,
    linkedAt: acc.linkedAt.toISOString(),
  };
}

export async function linkAccount(
  tutorId: string,
  robloxUserId: string,
  username: string,
  displayName: string,
  avatarUrl: string | null,
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
): Promise<RobloxLink> {
  const now = new Date();
  const acc = await prisma.tutorRobloxAccount.upsert({
    where: { tutorId },
    update: {
      robloxUserId,
      username,
      displayName,
      avatarUrl,
      accessTokenEnc: encrypt(accessToken),
      refreshTokenEnc: encrypt(refreshToken),
      tokenExpiresAt: new Date(now.getTime() + expiresIn * 1000),
    },
    create: {
      tutorId,
      robloxUserId,
      username,
      displayName,
      avatarUrl,
      accessTokenEnc: encrypt(accessToken),
      refreshTokenEnc: encrypt(refreshToken),
      tokenExpiresAt: new Date(now.getTime() + expiresIn * 1000),
      linkedAt: now,
    },
  });
  return {
    linked: true,
    robloxUserId: acc.robloxUserId,
    username: acc.username,
    displayName: acc.displayName,
    avatarUrl: acc.avatarUrl,
    linkedAt: acc.linkedAt.toISOString(),
  };
}

export async function unlinkAccount(tutorId: string): Promise<RobloxLink> {
  const acc = await prisma.tutorRobloxAccount.findUnique({ where: { tutorId } });
  if (acc) {
    // Best-effort revoke at Roblox
    try {
      const refreshToken = decrypt(acc.refreshTokenEnc);
      await fetch("https://apis.roblox.com/oauth/v1/token/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          token: refreshToken,
          token_type_hint: "refresh_token",
          client_id: process.env.ROBLOX_OAUTH_CLIENT_ID ?? "",
          client_secret: process.env.ROBLOX_OAUTH_CLIENT_SECRET ?? "",
        }),
      });
    } catch {
      // best effort
    }
    await prisma.tutorRobloxAccount.delete({ where: { tutorId } });
  }
  return { linked: false };
}

export async function getRobloxUserIdForTutor(tutorId: string): Promise<string | null> {
  const acc = await prisma.tutorRobloxAccount.findUnique({ where: { tutorId }, select: { robloxUserId: true } });
  return acc?.robloxUserId ?? null;
}
