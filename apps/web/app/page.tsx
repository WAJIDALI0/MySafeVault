import { LandingNavbar } from "@/features/landing/components/navbar";
import { HeroSection } from "@/features/landing/components/hero-section";
import { FeaturesSection } from "@/features/landing/components/features-section";
import { SecuritySection } from "@/features/landing/components/security-section";
import { LandingFooter } from "@/features/landing/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B1120] text-slate-50 selection:bg-emerald-500/30">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <SecuritySection />
      <LandingFooter />
    </main>
  );
}
