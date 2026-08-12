import { getCachedProfile } from '@/features/profile/services/profile.service';
import { ProfileForm } from '@/features/profile/components/profile-form';

export const metadata = {
  title: 'Account Settings | MySafeVault',
};

export default async function AccountSettingsPage() {
  const profile = await getCachedProfile();

  if (!profile) {
    return <div>Error loading profile.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold font-outfit text-slate-900 dark:text-white">Account Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update your personal information and profile settings.</p>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
          <ProfileForm 
            initialFullName={profile.full_name || ''} 
            email={profile.email || ''} 
          avatarUrl={profile.avatar || ''} 
        />
      </div>
    </div>
  );
}
