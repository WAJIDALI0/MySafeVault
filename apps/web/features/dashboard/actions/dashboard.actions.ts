"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";

import { getDashboardStats } from "../services/dashboard.service";

export async function getDashboardCounts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const stats = await getDashboardStats(user.id);
    return {
      success: true,
      data: stats
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
