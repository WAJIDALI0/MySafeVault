import { NotificationsPageClient } from '@/features/notifications/components/notifications-page-client';

export const metadata = {
  title: 'Notifications | MySafeVault',
};

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto w-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white">Notification Center</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">View and manage your account and security alerts.</p>
      </div>

      <NotificationsPageClient />
    </div>
  );
}
