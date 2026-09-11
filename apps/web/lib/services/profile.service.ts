import { prisma } from "@/lib/prisma/client";
import { cache } from "react";

export const getCachedProfile = cache(async (userId: string) => {
  try {
    return await prisma.profile.findUnique({
      where: { id: userId }
    });
  } catch (error) {
    console.warn("Unable to fetch profile from database (reconnecting/offline):", error);
    return null;
  }
});
