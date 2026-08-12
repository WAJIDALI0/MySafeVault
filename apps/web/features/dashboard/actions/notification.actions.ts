"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // @ts-ignore - Prisma client might not be generated yet
    const notifications = await prisma.notification.findMany({
      where: { profile_id: user.id },
      orderBy: { created_at: 'desc' },
      take: 20,
    });

    // @ts-ignore
    const unreadCount = await prisma.notification.count({
      where: { profile_id: user.id, is_read: false }
    });

    return { success: true, data: notifications, unreadCount };
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return { error: "Failed to fetch notifications." };
  }
}

export async function markNotificationAsRead(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  try {
    // @ts-ignore
    await prisma.notification.updateMany({
      where: { id, profile_id: user.id },
      data: { is_read: true, read_at: new Date() }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to mark as read." };
  }
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  try {
    // @ts-ignore
    await prisma.notification.updateMany({
      where: { profile_id: user.id, is_read: false },
      data: { is_read: true, read_at: new Date() }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to mark all as read." };
  }
}
