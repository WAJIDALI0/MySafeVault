"use client";

import { useState, useEffect } from "react";
import { Laptop, Download, Check, Info, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface InstallAppButtonProps {
  className?: string;
  compact?: boolean;
}

export function InstallAppButton({ className, compact = true }: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Check if already running as installed standalone PWA
    if (
      (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches) ||
      (typeof window !== "undefined" && (window.navigator as any).standalone === true)
    ) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
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
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      setShowGuide(true);
    }
  };

  if (isInstalled) {
    return (
      <div className={cn("w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 rounded-xl text-xs font-bold", className)}>
        <Check className="w-3.5 h-3.5 text-emerald-500" />
        <span>Desktop App Installed</span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group",
          "bg-white dark:bg-[#0b1120] text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800",
          "hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:text-emerald-700 dark:hover:text-emerald-300 shadow-2xs hover:shadow-xs active:scale-[0.99]",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Laptop className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold leading-tight">Install Desktop App</span>
        </div>

        <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md border border-emerald-300/60 dark:border-emerald-800/60 shadow-2xs">
          PWA
        </span>
      </button>

      {/* Guide Dialog if prompt not directly dispatched */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="sm:max-w-[460px] p-6 bg-white dark:bg-[#0b1120] border-slate-200 dark:border-slate-800 rounded-2xl">
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Laptop className="w-5 h-5 text-emerald-500" />
            Install MySafeVault Desktop
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Enjoy instant offline-ready access, biometric auto-fill, and native window controls.
          </DialogDescription>

          <div className="space-y-3 my-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Look at your browser's address bar</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Click the <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Install App</strong> icon (usually an icon on the right side of the URL bar).</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Or use the browser menu</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Click the <strong>⋮ Menu</strong> at the top-right &rarr; select <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">"Install MySafeVault..."</strong></p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide(false)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-[0.99]"
          >
            Got It
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}

