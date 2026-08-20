"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Prevent Chrome 67 and earlier from automatically showing the prompt
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (isInstalled || !isInstallable) {
    return null; // Don't show if already installed or not supported
  }

  return (
    <button
      onClick={handleInstallClick}
      className={cn(
        "w-full flex items-center gap-2 justify-center px-4 py-2 mt-4 text-sm font-semibold rounded-lg transition-all",
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        "hover:bg-emerald-500 hover:text-white dark:hover:text-slate-900 shadow-sm"
      )}
    >
      <Download className="w-4 h-4" />
      Install Desktop App
    </button>
  );
}
