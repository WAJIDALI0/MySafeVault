import { SearchBar } from "./search-bar";
import { QuickAdd } from "./quick-add";
import { NotificationButton } from "./notification-button";
import { UserMenu } from "./user-menu";
import { createClient } from "@/lib/supabase/server";
import { getCachedProfile } from "@/lib/services/profile.service";

export async function Topbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = {
    full_name: "User",
    email: user?.email || "",
    avatar: ""
  };

  if (user) {
    const dbProfile = await getCachedProfile(user.id);
    if (dbProfile) {
      profile.full_name = dbProfile.full_name || user.email?.split("@")[0] || "User";
      profile.avatar = dbProfile.avatar || "";
    }
  }

  return (
    <header className="h-16 w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-40">
      
      {/* Left side - Search */}
      <div className="flex-1 flex items-center justify-start lg:w-96">
        <SearchBar />
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <QuickAdd />
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
        <NotificationButton />
        <UserMenu profile={profile} />
      </div>
      
    </header>
  );
}
