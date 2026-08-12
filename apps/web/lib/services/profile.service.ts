import { prisma } from "@/lib/prisma/client";
import { cache } from "react";

export const getCachedProfile = cache(async (userId: string) => {
  return await prisma.profile.findUnique({
    where: { id: userId }
  });
});
