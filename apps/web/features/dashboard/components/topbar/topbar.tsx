import { SearchBar } from "./search-bar";
import { QuickAdd } from "./quick-add";
import { NotificationButton } from "./notification-button";
import { UserMenu } from "./user-menu";
import { MobileMenuTrigger } from "./mobile-menu-trigger";
import { createClient } from "@/lib/supabase/server";
import { getCachedProfile } from "@/lib/services/profile.service";
import { Lock } from "lucide-react";
import Link from "next/link";

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
    <header className="h-16 w-full flex items-center justify-between px-3 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-40">
      
      {/* Left side - Mobile Menu Toggle + Logo (on mobile) + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 pr-2">
        <MobileMenuTrigger />
        
        <Link href="/dashboard" className="lg:hidden flex items-center gap-1.5 text-[#10B981] font-bold text-base shrink-0">
          <Lock className="w-5 h-5" />
          <span className="hidden sm:inline font-outfit font-black">MySafeVault</span>
        </Link>

        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <QuickAdd />
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block" />
        <NotificationButton />
        <UserMenu profile={profile} />
      </div>
      
    </header>
  );
}
