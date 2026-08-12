import { prisma } from "@/lib/prisma/client";

interface CreateNotificationParams {
  profile_id: string;
  type: string; // e.g. "SECURITY", "ACTIVITY", "EXPIRATION", "SYSTEM"
  title: string;
  message: string;
  action_url?: string;
  metadata?: any;
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    // 1. Fetch user preferences
    const pref = await prisma.userPreference.findUnique({
      where: { profile_id: params.profile_id }
    });

    const settings = pref?.notification_settings && typeof pref.notification_settings === 'object'
      ? (pref.notification_settings as Record<string, boolean>)
      : {
          security_alerts: true,
          vault_activity: false, // Default was false based on settings page
          expirations: true,
          system_notifications: true
        };

    // 2. Check if this type of notification is enabled
    let isEnabled = true;
    switch (params.type) {
      case "SECURITY":
        isEnabled = settings.security_alerts !== false;
        break;
      case "ACTIVITY":
        isEnabled = settings.vault_activity === true; // Default false
        break;
      case "EXPIRATION":
        isEnabled = settings.expirations !== false;
        break;
      case "SYSTEM":
        isEnabled = settings.system_notifications !== false;
        break;
    }

    // 3. Create notification if enabled
    if (isEnabled) {
      await prisma.notification.create({
        data: {
          profile_id: params.profile_id,
          type: params.type,
          title: params.title,
          message: params.message,
          action_url: params.action_url,
          metadata: params.metadata || {},
        }
      });
    }
  } catch (error) {
    console.error("Failed to create notification:", error);
    // Non-blocking error
  }
}
