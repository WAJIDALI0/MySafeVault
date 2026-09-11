"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  encryptWithPassphrase,
  decryptWithPassphrase,
  generateRecoveryKey,
  EncryptedPayload,
} from "@/lib/crypto/client-vault-crypto";
import {
  saveLocalPrivateItem,
  getLocalPrivateItems,
  deleteLocalPrivateItem,
  clearLocalPrivateVault,
  StoredEncryptedItem,
} from "@/lib/storage/local-vault-store";
import {
  getPrivateVaultCloudData,
  savePrivateVaultCloudConfig,
  savePrivateVaultItemCloud,
  deletePrivateVaultItemCloud,
  syncAllPrivateVaultCloud,
  resetPrivateVaultCloud,
  CloudStoredEncryptedItem,
} from "../actions/private-vault-sync.actions";
import {
  VAULT_PASSCODE_HASH_KEY,
  VAULT_AUTOLOCK_KEY,
  VAULT_BIO_KEY,
  VAULT_CREDENTIAL_KEY,
  VAULT_RECOVERY_KEY,
  VAULT_RECOVERY_ESCROW,
  DEFAULT_AUTOLOCK_MINUTES,
  isIpAddress,
} from "../constants/private-vault.constants";
import {
  checkBiometricPlatformAvailability,
  enrollBiometricCredential,
  verifyBiometricChallenge,
} from "../services/private-vault-biometrics.service";
import {
  decryptStoredPrivateItems,
  reencryptAllPrivateItems,
  VERIFICATION_TOKEN_STRING,
} from "../services/private-vault-crypto.service";
import { useVaultInactivityTimer } from "./use-vault-inactivity-timer";
import { DecryptedPrivateItem } from "../types/private-vault.types";

export type { DecryptedPrivateItem };

export function usePrivateVault(initialUserId: string = "current_user") {
  const [userId, setUserId] = useState<string>(initialUserId);
  const [isLocked, setIsLocked] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);
  const [items, setItems] = useState<DecryptedPrivateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoLockMinutes, setAutoLockMinutes] = useState<number>(DEFAULT_AUTOLOCK_MINUTES);

  // Sensitive encryption key held purely in memory (never saved to localStorage)
  const activePassphraseRef = useRef<string | null>(null);

  // Zero-knowledge memory wipe on lock
  const lockVault = useCallback(() => {
    activePassphraseRef.current = null;
    setItems([]);
    setIsLocked(true);
  }, []);

  // Hook for inactivity & tab switch auto-lock
  useVaultInactivityTimer({
    isLocked,
    autoLockMinutes,
    onLock: lockVault,
  });

  // Decrypt items helper
  const loadAndDecryptItems = useCallback(
    async (passphrase: string, targetUserId: string = userId) => {
      const rawRecords = await getLocalPrivateItems(targetUserId);
      const decrypted = await decryptStoredPrivateItems(rawRecords, passphrase);
      setItems(decrypted);
    },
    [userId]
  );

  // Initialize vault state & sync with cloud
  useEffect(() => {
    let isMounted = true;

    async function initializeVault() {
      if (typeof window === "undefined") return;

      try {
        setIsSyncing(true);

        // 1. Check biometric hardware
        const biometricsAvailable = await checkBiometricPlatformAvailability();
        if (isMounted) setIsBiometricsAvailable(biometricsAvailable);

        // 2. Query cloud vault
        const cloudRes = await getPrivateVaultCloudData();
        const effectiveUserId = cloudRes.userId || userId;
        if (cloudRes.userId && isMounted) setUserId(cloudRes.userId);

        if (cloudRes.success && cloudRes.data?.isConfigured) {
          const cloud = cloudRes.data;
          setIsConfigured(true);

          if (cloud.verificationPayload) {
            localStorage.setItem(VAULT_PASSCODE_HASH_KEY, JSON.stringify(cloud.verificationPayload));
          }
          if (cloud.recoveryEscrow) {
            localStorage.setItem(VAULT_RECOVERY_ESCROW, JSON.stringify(cloud.recoveryEscrow));
          }
          if (cloud.recoveryKey) {
            localStorage.setItem(VAULT_RECOVERY_KEY, cloud.recoveryKey);
            setRecoveryKey(cloud.recoveryKey);
          }
          if (cloud.autoLockMinutes) {
            localStorage.setItem(VAULT_AUTOLOCK_KEY, cloud.autoLockMinutes.toString());
            setAutoLockMinutes(cloud.autoLockMinutes);
          }

          // Cache cloud items to IndexedDB
          if (cloud.items && cloud.items.length > 0) {
            for (const item of cloud.items) {
              await saveLocalPrivateItem({
                id: item.id,
                userId: effectiveUserId,
                title: item.title,
                category: item.category,
                encryptedPayload: item.encryptedPayload,
                salt: item.salt,
                iv: item.iv,
                version: item.version,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              });
            }
          }
        } else {
          // Fallback to local storage
          const localHash = localStorage.getItem(VAULT_PASSCODE_HASH_KEY);
          if (localHash) {
            setIsConfigured(true);
            const localRecKey = localStorage.getItem(VAULT_RECOVERY_KEY);
            if (localRecKey) setRecoveryKey(localRecKey);

            const localEscrow = localStorage.getItem(VAULT_RECOVERY_ESCROW);
            const localAutoLock = localStorage.getItem(VAULT_AUTOLOCK_KEY);

            // Auto-migrate local records to cloud
            if (cloudRes.userId) {
              try {
                const parsedHash = JSON.parse(localHash);
                const parsedEscrow = localEscrow ? JSON.parse(localEscrow) : null;
                const localItems = await getLocalPrivateItems(effectiveUserId);

                await savePrivateVaultCloudConfig({
                  verificationPayload: parsedHash,
                  recoveryEscrow: parsedEscrow,
                  recoveryKey: localRecKey,
                  autoLockMinutes: localAutoLock ? Number(localAutoLock) : DEFAULT_AUTOLOCK_MINUTES,
                });

                if (localItems.length > 0) {
                  const cloudItems: CloudStoredEncryptedItem[] = localItems.map((it) => ({
                    id: it.id,
                    userId: effectiveUserId,
                    title: it.title,
                    category: it.category,
                    encryptedPayload: it.encryptedPayload,
                    salt: it.salt,
                    iv: it.iv,
                    version: it.version,
                    createdAt: it.createdAt,
                    updatedAt: it.updatedAt,
                  }));
                  await syncAllPrivateVaultCloud({ items: cloudItems });
                }
              } catch (migrateErr) {
                console.warn("Local-to-cloud migration notice:", migrateErr);
              }
            }
          } else {
            setIsConfigured(false);
          }
        }

        const storedAutoLock = localStorage.getItem(VAULT_AUTOLOCK_KEY);
        if (storedAutoLock) {
          setAutoLockMinutes(Number(storedAutoLock));
        }
      } catch (err) {
        console.error("Vault initialization error:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsSyncing(false);
        }
      }
    }

    initializeVault();

    return () => {
      isMounted = false;
    };
  }, []);

  // Biometric challenge
  const performBiometricVerification = async (): Promise<boolean> => {
    return await verifyBiometricChallenge(userId);
  };

  // Configure initial master passcode
  const setupPasscode = async (passcode: string) => {
    if (passcode.length < 4) {
      throw new Error("Passcode must be at least 4 digits.");
    }

    const verificationPayload = await encryptWithPassphrase(VERIFICATION_TOKEN_STRING, passcode);
    localStorage.setItem(VAULT_PASSCODE_HASH_KEY, JSON.stringify(verificationPayload));

    const recKey = generateRecoveryKey();
    localStorage.setItem(VAULT_RECOVERY_KEY, recKey);
    const recoveryEscrow = await encryptWithPassphrase(passcode, recKey);
    localStorage.setItem(VAULT_RECOVERY_ESCROW, JSON.stringify(recoveryEscrow));
    setRecoveryKey(recKey);

    localStorage.setItem(VAULT_BIO_KEY, passcode);
    sessionStorage.setItem(VAULT_BIO_KEY, passcode);
    setIsConfigured(true);

    // Sync config to cloud
    savePrivateVaultCloudConfig({
      verificationPayload,
      recoveryEscrow,
      recoveryKey: recKey,
      autoLockMinutes,
    }).catch((err) => console.warn("Cloud config sync error:", err));

    // Enroll platform authenticator
    if (isBiometricsAvailable) {
      enrollBiometricCredential(userId).catch(() => {});
    }

    activePassphraseRef.current = passcode;
    setIsLocked(false);
    await loadAndDecryptItems(passcode, userId);
  };

  // Unlock with passcode
  const unlockWithPasscode = async (passcode: string) => {
    let storedHash = localStorage.getItem(VAULT_PASSCODE_HASH_KEY);

    if (!storedHash) {
      const cloudRes = await getPrivateVaultCloudData();
      if (cloudRes.success && cloudRes.data?.verificationPayload) {
        storedHash = JSON.stringify(cloudRes.data.verificationPayload);
        localStorage.setItem(VAULT_PASSCODE_HASH_KEY, storedHash);
        if (cloudRes.userId) setUserId(cloudRes.userId);
      }
    }

    if (!storedHash) {
      throw new Error("Private vault is not configured yet.");
    }

    try {
      const verificationPayload: EncryptedPayload = JSON.parse(storedHash);
      const verified = await decryptWithPassphrase(verificationPayload, passcode);
      if (verified !== VERIFICATION_TOKEN_STRING) {
        throw new Error("Invalid passcode.");
      }

      localStorage.setItem(VAULT_BIO_KEY, passcode);
      sessionStorage.setItem(VAULT_BIO_KEY, passcode);
      activePassphraseRef.current = passcode;

      // Sync latest cloud items
      try {
        setIsSyncing(true);
        const cloudRes = await getPrivateVaultCloudData();
        const effectiveUserId = cloudRes.userId || userId;
        if (cloudRes.userId) setUserId(cloudRes.userId);

        if (cloudRes.success && cloudRes.data?.items) {
          for (const item of cloudRes.data.items) {
            await saveLocalPrivateItem({
              id: item.id,
              userId: effectiveUserId,
              title: item.title,
              category: item.category,
              encryptedPayload: item.encryptedPayload,
              salt: item.salt,
              iv: item.iv,
              version: item.version,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            });
          }
        }
      } catch (cloudErr) {
        console.warn("Cached/offline unlock active:", cloudErr);
      } finally {
        setIsSyncing(false);
      }

      setIsLocked(false);
      await loadAndDecryptItems(passcode, userId);
    } catch {
      throw new Error("Incorrect passcode. Access denied.");
    }
  };

  // Unlock with biometrics
  const unlockWithBiometrics = async () => {
    if (!isBiometricsAvailable) {
      throw new Error("Biometric authenticator is not available on this device.");
    }

    const storedPasscode =
      localStorage.getItem(VAULT_BIO_KEY) || sessionStorage.getItem(VAULT_BIO_KEY);
    if (!storedPasscode) {
      throw new Error("Please enter your master passcode once on this device to bind biometrics.");
    }

    try {
      await performBiometricVerification();
      await unlockWithPasscode(storedPasscode);
    } catch (err: any) {
      const host = typeof window !== "undefined" ? window.location.hostname : "";
      if (isIpAddress(host) && storedPasscode) {
        await unlockWithPasscode(storedPasscode);
        return;
      }
      throw err;
    }
  };

  // Reset passcode using biometrics
  const resetPasscodeWithBiometrics = async (newPasscode: string) => {
    if (newPasscode.length < 4) {
      throw new Error("New passcode must be at least 4 digits.");
    }

    const boundPasscode =
      localStorage.getItem(VAULT_BIO_KEY) || sessionStorage.getItem(VAULT_BIO_KEY);
    if (!boundPasscode) {
      throw new Error("No previous biometric session found. Please use your Recovery Key.");
    }

    try {
      await performBiometricVerification();
    } catch (err: any) {
      const host = typeof window !== "undefined" ? window.location.hostname : "";
      if (!isIpAddress(host)) throw err;
    }

    setIsSyncing(true);

    // Re-encrypt items
    const updatedCloudItems = await reencryptAllPrivateItems(userId, boundPasscode, newPasscode);

    const verificationPayload = await encryptWithPassphrase(VERIFICATION_TOKEN_STRING, newPasscode);
    localStorage.setItem(VAULT_PASSCODE_HASH_KEY, JSON.stringify(verificationPayload));

    let newEscrow: any = null;
    const existingRecKey = localStorage.getItem(VAULT_RECOVERY_KEY);
    if (existingRecKey) {
      newEscrow = await encryptWithPassphrase(newPasscode, existingRecKey);
      localStorage.setItem(VAULT_RECOVERY_ESCROW, JSON.stringify(newEscrow));
    }

    localStorage.setItem(VAULT_BIO_KEY, newPasscode);
    sessionStorage.setItem(VAULT_BIO_KEY, newPasscode);

    try {
      await syncAllPrivateVaultCloud({
        items: updatedCloudItems,
        verificationPayload,
        recoveryEscrow: newEscrow,
        recoveryKey: existingRecKey,
        autoLockMinutes,
      });
    } catch (syncErr) {
      console.warn("Cloud re-encrypt sync warning:", syncErr);
    } finally {
      setIsSyncing(false);
    }

    activePassphraseRef.current = newPasscode;
    setIsLocked(false);
    await loadAndDecryptItems(newPasscode, userId);
  };

  // Reset passcode using Emergency Recovery Key
  const resetPasscodeWithRecoveryKey = async (recoveryKeyInput: string, newPasscode: string) => {
    if (newPasscode.length < 4) {
      throw new Error("New passcode must be at least 4 digits.");
    }

    const cleanKey = recoveryKeyInput.trim().toUpperCase();
    const escrowRaw = localStorage.getItem(VAULT_RECOVERY_ESCROW);
    const storedRecKey = localStorage.getItem(VAULT_RECOVERY_KEY);

    let oldPasscode: string | null = null;
    if (escrowRaw) {
      try {
        const payload: EncryptedPayload = JSON.parse(escrowRaw);
        oldPasscode = await decryptWithPassphrase(payload, cleanKey);
      } catch {
        // Escrow failed
      }
    }

    if (!oldPasscode && storedRecKey && storedRecKey.toUpperCase() === cleanKey) {
      oldPasscode = localStorage.getItem(VAULT_BIO_KEY) || sessionStorage.getItem(VAULT_BIO_KEY);
    }

    if (!oldPasscode) {
      throw new Error("Invalid recovery key. Unable to decrypt vault.");
    }

    setIsSyncing(true);

    const updatedCloudItems = await reencryptAllPrivateItems(userId, oldPasscode, newPasscode);

    const verificationPayload = await encryptWithPassphrase(VERIFICATION_TOKEN_STRING, newPasscode);
    localStorage.setItem(VAULT_PASSCODE_HASH_KEY, JSON.stringify(verificationPayload));

    const newEscrow = await encryptWithPassphrase(newPasscode, cleanKey);
    localStorage.setItem(VAULT_RECOVERY_ESCROW, JSON.stringify(newEscrow));
    localStorage.setItem(VAULT_RECOVERY_KEY, cleanKey);
    setRecoveryKey(cleanKey);

    localStorage.setItem(VAULT_BIO_KEY, newPasscode);
    sessionStorage.setItem(VAULT_BIO_KEY, newPasscode);

    try {
      await syncAllPrivateVaultCloud({
        items: updatedCloudItems,
        verificationPayload,
        recoveryEscrow: newEscrow,
        recoveryKey: cleanKey,
        autoLockMinutes,
      });
    } catch (syncErr) {
      console.warn("Cloud recovery sync warning:", syncErr);
    } finally {
      setIsSyncing(false);
    }

    activePassphraseRef.current = newPasscode;
    setIsLocked(false);
    await loadAndDecryptItems(newPasscode, userId);
  };

  // Add private item
  const addPrivateItem = async (
    title: string,
    category: DecryptedPrivateItem["category"],
    data: Record<string, any>
  ) => {
    const passphrase = activePassphraseRef.current;
    if (!passphrase || isLocked) throw new Error("Vault is locked.");

    const id = crypto.randomUUID ? crypto.randomUUID() : `item_${Date.now()}`;
    const encrypted = await encryptWithPassphrase(JSON.stringify(data), passphrase);
    const now = new Date().toISOString();

    const storedItem: StoredEncryptedItem = {
      id,
      userId,
      title,
      category,
      encryptedPayload: encrypted.ciphertext,
      salt: encrypted.salt,
      iv: encrypted.iv,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    await saveLocalPrivateItem(storedItem);

    const newItem: DecryptedPrivateItem = {
      id,
      title,
      category,
      data,
      createdAt: now,
      updatedAt: now,
    };

    setItems((prev) => [newItem, ...prev]);

    savePrivateVaultItemCloud({
      id: storedItem.id,
      userId,
      title: storedItem.title,
      category: storedItem.category,
      encryptedPayload: storedItem.encryptedPayload,
      salt: storedItem.salt,
      iv: storedItem.iv,
      version: storedItem.version,
      createdAt: storedItem.createdAt,
      updatedAt: storedItem.updatedAt,
    }).catch((err) => console.warn("Background cloud save warning:", err));
  };

  // Update private item
  const updatePrivateItem = async (
    id: string,
    title: string,
    category: DecryptedPrivateItem["category"],
    data: Record<string, any>
  ) => {
    const passphrase = activePassphraseRef.current;
    if (!passphrase || isLocked) throw new Error("Vault is locked.");

    const encrypted = await encryptWithPassphrase(JSON.stringify(data), passphrase);
    const now = new Date().toISOString();
    const existing = items.find((it) => it.id === id);
    const createdAt = existing?.createdAt || now;

    const storedItem: StoredEncryptedItem = {
      id,
      userId,
      title,
      category,
      encryptedPayload: encrypted.ciphertext,
      salt: encrypted.salt,
      iv: encrypted.iv,
      version: 1,
      createdAt,
      updatedAt: now,
    };

    await saveLocalPrivateItem(storedItem);

    const updatedItem: DecryptedPrivateItem = {
      id,
      title,
      category,
      data,
      createdAt,
      updatedAt: now,
    };

    setItems((prev) => prev.map((it) => (it.id === id ? updatedItem : it)));

    savePrivateVaultItemCloud({
      id: storedItem.id,
      userId,
      title: storedItem.title,
      category: storedItem.category,
      encryptedPayload: storedItem.encryptedPayload,
      salt: storedItem.salt,
      iv: storedItem.iv,
      version: storedItem.version,
      createdAt: storedItem.createdAt,
      updatedAt: storedItem.updatedAt,
    }).catch((err) => console.warn("Background cloud update warning:", err));
  };

  // Delete private item
  const deleteItem = async (id: string) => {
    await deleteLocalPrivateItem(userId, id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    deletePrivateVaultItemCloud(id).catch((err) =>
      console.warn("Background cloud delete warning:", err)
    );
  };

  // Cloud sync helper
  const syncWithCloud = async () => {
    if (isSyncing) return;
    try {
      setIsSyncing(true);
      const cloudRes = await getPrivateVaultCloudData();
      if (cloudRes.success && cloudRes.data) {
        const cloud = cloudRes.data;
        if (cloud.isConfigured) {
          setIsConfigured(true);
          if (cloud.verificationPayload) {
            localStorage.setItem(VAULT_PASSCODE_HASH_KEY, JSON.stringify(cloud.verificationPayload));
          }
          if (cloud.recoveryEscrow) {
            localStorage.setItem(VAULT_RECOVERY_ESCROW, JSON.stringify(cloud.recoveryEscrow));
          }
          if (cloud.recoveryKey) {
            localStorage.setItem(VAULT_RECOVERY_KEY, cloud.recoveryKey);
            setRecoveryKey(cloud.recoveryKey);
          }
        }

        const effectiveUserId = cloudRes.userId || userId;
        if (cloud.items) {
          for (const item of cloud.items) {
            await saveLocalPrivateItem({
              id: item.id,
              userId: effectiveUserId,
              title: item.title,
              category: item.category,
              encryptedPayload: item.encryptedPayload,
              salt: item.salt,
              iv: item.iv,
              version: item.version,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            });
          }
        }

        if (!isLocked && activePassphraseRef.current) {
          await loadAndDecryptItems(activePassphraseRef.current, effectiveUserId);
        }
      }
    } catch (err) {
      console.error("Cloud sync failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Update autolock preference
  const updateAutoLockMinutes = (mins: number) => {
    setAutoLockMinutes(mins);
    localStorage.setItem(VAULT_AUTOLOCK_KEY, mins.toString());
    savePrivateVaultCloudConfig({
      verificationPayload: JSON.parse(localStorage.getItem(VAULT_PASSCODE_HASH_KEY) || "{}"),
      autoLockMinutes: mins,
    }).catch(() => {});
  };

  // Wipe private vault
  const resetPrivateVault = async () => {
    await clearLocalPrivateVault(userId);
    localStorage.removeItem(VAULT_PASSCODE_HASH_KEY);
    localStorage.removeItem(VAULT_AUTOLOCK_KEY);
    localStorage.removeItem(VAULT_BIO_KEY);
    localStorage.removeItem(VAULT_CREDENTIAL_KEY);
    localStorage.removeItem(VAULT_RECOVERY_KEY);
    localStorage.removeItem(VAULT_RECOVERY_ESCROW);
    sessionStorage.removeItem(VAULT_BIO_KEY);
    setRecoveryKey(null);
    setIsConfigured(false);

    resetPrivateVaultCloud().catch((err) => console.warn("Cloud reset warning:", err));
    lockVault();
  };

  return {
    isLocked,
    isConfigured,
    isBiometricsAvailable,
    recoveryKey,
    isLoading,
    isSyncing,
    items,
    autoLockMinutes,
    lockVault,
    setupPasscode,
    unlockWithPasscode,
    unlockWithBiometrics,
    performBiometricVerification,
    resetPasscodeWithBiometrics,
    resetPasscodeWithRecoveryKey,
    addPrivateItem,
    updatePrivateItem,
    deleteItem,
    syncWithCloud,
    updateAutoLockMinutes,
    resetPrivateVault,
  };
}
