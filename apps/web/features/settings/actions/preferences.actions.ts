"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

export async function updateNotificationPreferences(settings: any) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const existing = await prisma.userPreference.findUnique({
      where: { profile_id: user.id }
    });

    const currentSettings = existing?.notification_settings && typeof existing.notification_settings === 'object' 
      ? existing.notification_settings as Record<string, any>
      : {};

    const newSettings = { ...currentSettings, ...settings };

    await prisma.userPreference.upsert({
      where: { profile_id: user.id },
      create: {
        profile_id: user.id,
        notification_settings: newSettings,
      },
      update: {
        notification_settings: newSettings,
      }
    });

    revalidatePath("/settings/notifications");
    return { success: true };
  } catch (error) {
    console.error("Failed to update notification preferences:", error);
    return { error: "Failed to update preferences" };
  }
}
