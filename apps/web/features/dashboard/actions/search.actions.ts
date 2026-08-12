"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";

export async function searchVaultItems(query: string) {
  if (!query || query.length < 2) return { success: true, data: [] };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Only search safe metadata fields (title, type)
    // NEVER search decrypted sensitive content.
    const results = await prisma.vaultItem.findMany({
      where: {
        profile_id: user.id,
        title: {
          contains: query,
          mode: 'insensitive', // PostgreSQL specific
        }
      },
      select: {
        id: true,
        title: true,
        type: true,
        updated_at: true,
        is_favorite: true,
      },
      take: 10,
    });

    return { success: true, data: results };
  } catch (error) {
    console.error("Search failed:", error);
    return { error: "Failed to perform search." };
  }
}
