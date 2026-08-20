import { getCachedProfile } from '@/features/profile/services/profile.service';
import { ProfileForm } from '@/features/profile/components/profile-form';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Your Profile | MySafeVault',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = await getCachedProfile();

  if (!profile || !user) {
    return <div>Error loading profile.</div>;
  }

  const isEmailVerified = !!user.email_confirmed_at;

  return (
    <div className="max-w-4xl mx-auto w-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white">Your Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your public profile and account details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <ProfileForm 
            initialFullName={profile.full_name || ''} 
            email={profile.email || ''} 
            avatarUrl={profile.avatar || ''} 
            isEmailVerified={isEmailVerified}
          />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Account Details</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Account Created</p>
                <p className="font-medium text-slate-900 dark:text-slate-200">
                  {profile.created_at ? format(new Date(profile.created_at), 'MMMM d, yyyy') : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Email Status</p>
                {isEmailVerified ? (
                  <p className="font-medium text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Verified
                  </p>
                ) : (
                  <p className="font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Unverified
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
