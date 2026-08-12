import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { NotificationPreferencesClient } from "@/features/settings/components/notification-preferences-client";

export const metadata = {
  title: 'Notification Settings | MySafeVault',
};

export default async function NotificationSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let initialSettings: Record<string, boolean> = {
    security_alerts: true,
    vault_activity: false,
    expirations: true,
    system_notifications: true
  };

  if (user) {
    const pref = await prisma.userPreference.findUnique({
      where: { profile_id: user.id }
    });
    if (pref?.notification_settings && typeof pref.notification_settings === 'object') {
      initialSettings = { ...initialSettings, ...(pref.notification_settings as Record<string, boolean>) };
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold font-outfit text-slate-900 dark:text-white">Notification Preferences</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose what you want to be notified about.</p>
      </div>

      <NotificationPreferencesClient initialSettings={initialSettings} />
    </div>
  );
}
