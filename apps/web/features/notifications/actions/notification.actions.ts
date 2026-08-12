"use server";

import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", data: null };
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { profile_id: user.id },
      orderBy: { created_at: "desc" },
      take: 20
    });

    const unreadCount = await prisma.notification.count({
      where: { profile_id: user.id, is_read: false }
    });

    return { data: notifications, unreadCount, error: null };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { error: "Failed to fetch notifications", data: null };
  }
}

export async function markAsRead(notificationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // The `profile_id: user.id` check ensures a user can only update their own notification
    await prisma.notification.updateMany({
      where: { 
        id: notificationId,
        profile_id: user.id 
      },
      data: {
        is_read: true,
        read_at: new Date()
      }
    });

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { error: "Failed to update notification" };
  }
}

export async function markAllAsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.notification.updateMany({
      where: { 
        profile_id: user.id,
        is_read: false
      },
      data: {
        is_read: true,
        read_at: new Date()
      }
    });

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { error: "Failed to update notifications" };
  }
}

export async function deleteNotification(notificationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.notification.deleteMany({
      where: { 
        id: notificationId,
        profile_id: user.id 
      }
    });

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { error: "Failed to delete notification" };
  }
}

export async function clearAllReadNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.notification.deleteMany({
      where: { 
        profile_id: user.id,
        is_read: true
      }
    });

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error clearing read notifications:", error);
    return { error: "Failed to clear notifications" };
  }
}
