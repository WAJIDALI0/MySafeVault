/**
 * Hook to handle auto-locking the private vault on inactivity or tab switch
 */

import { useEffect, useCallback, useRef } from "react";

interface UseVaultInactivityTimerProps {
  isLocked: boolean;
  autoLockMinutes: number;
  onLock: () => void;
}

export function useVaultInactivityTimer({
  isLocked,
  autoLockMinutes,
  onLock,
}: UseVaultInactivityTimerProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (autoLockMinutes > 0 && !isLocked) {
      timerRef.current = setTimeout(() => {
        onLock();
      }, autoLockMinutes * 60 * 1000);
    }
  }, [autoLockMinutes, isLocked, onLock]);

  useEffect(() => {
    if (isLocked) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const handleUserActivity = () => {
      resetTimer();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        onLock();
      }
    };

    window.addEventListener("pointerdown", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    resetTimer();

    return () => {
      window.removeEventListener("pointerdown", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLocked, resetTimer, onLock]);
}
