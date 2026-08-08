"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";

export async function getDashboardCounts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const [totalItems, passwords, documents, secureNotes, favorites] = await Promise.all([
      prisma.vaultItem.count({ where: { profile_id: user.id } }),
      prisma.vaultItem.count({ where: { profile_id: user.id, type: "PASSWORD" } }),
      prisma.vaultItem.count({ where: { profile_id: user.id, type: "DOCUMENT" } }),
      prisma.vaultItem.count({ where: { profile_id: user.id, type: "SECURE_NOTE" } }),
      prisma.vaultItem.count({ where: { profile_id: user.id, is_favorite: true } }),
    ]);

    return {
      success: true,
      data: {
        totalItems,
        passwords,
        documents,
        secureNotes,
        favorites,
      }
    };
  } catch (error) {
    console.error("Failed to fetch dashboard counts:", error);
    return { error: "Failed to fetch dashboard counts" };
  }
}

export async function getRecentActivity() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const logs = await prisma.activityLog.findMany({
      where: { profile_id: user.id },
      orderBy: { created_at: 'desc' },
      take: 5,
    });

    return { success: true, data: logs };
  } catch (error) {
    console.error("Failed to fetch recent activity:", error);
    return { error: "Failed to fetch recent activity" };
  }
}
