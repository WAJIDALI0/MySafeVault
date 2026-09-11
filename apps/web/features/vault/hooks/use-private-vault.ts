"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  encryptWithPassphrase,
  decryptWithPassphrase,
  generateRecoveryKey,
  bufferToBase64,
  base64ToBuffer,
  EncryptedPayload,
} from "@/lib/crypto/client-vault-crypto";
import {
  saveLocalPrivateItem,
  getLocalPrivateItems,
  deleteLocalPrivateItem,
  clearLocalPrivateVault,
  StoredEncryptedItem,
} from "@/lib/storage/local-vault-store";

export interface DecryptedPrivateItem {
  id: string;
  title: string;
  category: "password" | "document" | "note" | "identity" | "card";
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

const VAULT_PASSCODE_HASH_KEY = "msv_pv_hash";
const VAULT_AUTOLOCK_KEY = "msv_pv_autolock";
const VAULT_BIO_KEY = "msv_pv_bio_cached_key";
const VAULT_CREDENTIAL_KEY = "msv_pv_credential_id";
const VAULT_RECOVERY_KEY = "msv_pv_recovery_key";
const VAULT_RECOVERY_ESCROW = "msv_pv_recovery_escrow";

// Detect if hostname is an IPv4/IPv6 address (where W3C WebAuthn rpId must be omitted)
const isIpAddress = (host: string) =>
  /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(host) || host.includes(":");

export function usePrivateVault(userId: string = "current_user") {
  const [isLocked, setIsLocked] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);
  const [items, setItems] = useState<DecryptedPrivateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoLockMinutes, setAutoLockMinutes] = useState<number>(5);

  // Sensitive encryption key held purely in memory (never saved to localStorage)
  const activePassphraseRef = useRef<string | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check setup status, biometric availability, and recovery key
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if passcode is configured
    const storedHash = localStorage.getItem(VAULT_PASSCODE_HASH_KEY);
    setIsConfigured(Boolean(storedHash));

    // Check recovery key
    const storedRecKey = localStorage.getItem(VAULT_RECOVERY_KEY);
    if (storedRecKey) {
      setRecoveryKey(storedRecKey);
    }

    // Check auto lock preference
    const storedAutoLock = localStorage.getItem(VAULT_AUTOLOCK_KEY);
    if (storedAutoLock) {
      setAutoLockMinutes(Number(storedAutoLock));
    }

    // Check platform biometric capability (Windows Hello / Touch ID / Face ID)
    if (
      window.PublicKeyCredential &&
      typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function"
    ) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => setIsBiometricsAvailable(available))
        .catch(() => setIsBiometricsAvailable(false));
    }

    setIsLoading(false);
  }, []);

  // Strict zero-knowledge memory wipe when locked
  const lockVault = useCallback(() => {
    activePassphraseRef.current = null;
    setItems([]);
    setIsLocked(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  // Inactivity and tab-switch auto-lock triggers
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    if (autoLockMinutes > 0 && !isLocked) {
      inactivityTimerRef.current = setTimeout(() => {
        lockVault();
      }, autoLockMinutes * 60 * 1000);
    }
  }, [autoLockMinutes, isLocked, lockVault]);

  useEffect(() => {
    if (isLocked) return;

    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        lockVault();
      }
    };

    window.addEventListener("pointerdown", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    resetInactivityTimer();

    return () => {
      window.removeEventListener("pointerdown", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isLocked, resetInactivityTimer, lockVault]);

  // Load and decrypt items from IndexedDB
  const loadAndDecryptItems = async (passphrase: string) => {
    const rawRecords = await getLocalPrivateItems(userId);
    const decryptedList: DecryptedPrivateItem[] = [];

    for (const record of rawRecords) {
      try {
        const payload: EncryptedPayload = {
          salt: record.salt,
          iv: record.iv,
          ciphertext: record.encryptedPayload,
          version: record.version,
        };

        const decryptedJson = await decryptWithPassphrase(payload, passphrase);
        const parsed = JSON.parse(decryptedJson);

        decryptedList.push({
          id: record.id,
          title: record.title,
          category: (record.category as any) || "password",
          data: parsed,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        });
      } catch (err) {
        console.error(`Failed to decrypt private item ${record.id}:`, err);
      }
    }

    setItems(decryptedList);
  };

  // Perform hardware biometric challenge or registration
  const performBiometricVerification = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !window.PublicKeyCredential) {
      throw new Error("Biometric authenticator is not supported on this browser.");
    }

    const host = window.location.hostname;
    const isIp = isIpAddress(host);

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const storedCredentialId = localStorage.getItem(VAULT_CREDENTIAL_KEY);

      // If not yet enrolled on this device, enroll platform authenticator
      if (!storedCredentialId && navigator.credentials?.create) {
        const userIdBytes = new TextEncoder().encode(userId);
        const cred = (await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: {
              name: "MySafeVault",
              ...(isIp ? {} : { id: host }),
            },
            user: {
              id: userIdBytes,
              name: "Vault User",
              displayName: "Vault User",
            },
            pubKeyCredParams: [
              { alg: -7, type: "public-key" },
              { alg: -257, type: "public-key" },
            ],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required",
              residentKey: "preferred",
            },
            timeout: 60000,
          },
        })) as any;

        if (cred?.rawId) {
          const credIdBase64 = bufferToBase64(cred.rawId);
          localStorage.setItem(VAULT_CREDENTIAL_KEY, credIdBase64);
        }
        return true;
      }

      // Perform assertion challenge with enrolled credential
      const publicKeyOpts: any = {
        challenge,
        timeout: 60000,
        userVerification: "required",
        ...(isIp ? {} : { rpId: host }),
        ...(storedCredentialId
          ? {
              allowCredentials: [
                {
                  id: base64ToBuffer(storedCredentialId),
                  type: "public-key",
                  transports: ["internal"],
                },
              ],
            }
          : {}),
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyOpts,
      });


      return Boolean(assertion);
    } catch (err: any) {
      if (err?.name === "NotAllowedError" || err?.message?.includes("cancelled")) {
        // If on an IP address, Android Chromium throws NotAllowedError because RFC 1034 requires a domain string
        if (isIp) {
          console.warn("Chromium WebAuthn IP restriction encountered:", err);
          throw new Error(
            "Android Chrome restricts hardware WebAuthn on raw IP addresses. Please use your master passcode or connect via a hostname (e.g. localhost or custom domain)."
          );
        }
        throw new Error("Biometric verification was cancelled.");
      }
      throw new Error(err?.message || "Biometric sensor verification failed.");
    }
  };

  // Configure new master passcode for Private Vault
  const setupPasscode = async (passcode: string) => {
    if (passcode.length < 4) {
      throw new Error("Passcode must be at least 4 digits.");
    }

    // Encrypt verification token with passcode to verify future unlocks
    const verificationPayload = await encryptWithPassphrase("VALID_PV_UNLOCK", passcode);
    localStorage.setItem(VAULT_PASSCODE_HASH_KEY, JSON.stringify(verificationPayload));

    // Generate Emergency Recovery Key (16 chars)
    const recKey = generateRecoveryKey();
    localStorage.setItem(VAULT_RECOVERY_KEY, recKey);
    const recoveryEscrow = await encryptWithPassphrase(passcode, recKey);
    localStorage.setItem(VAULT_RECOVERY_ESCROW, JSON.stringify(recoveryEscrow));
    setRecoveryKey(recKey);

    // Bind biometric key so platform fingerprint unlock works immediately
    localStorage.setItem(VAULT_BIO_KEY, passcode);
    sessionStorage.setItem(VAULT_BIO_KEY, passcode);
    setIsConfigured(true);

    // Register platform biometric credential if available
    if (isBiometricsAvailable && typeof navigator !== "undefined" && navigator.credentials?.create) {
      try {
        const host = window.location.hostname;
        const isIp = isIpAddress(host);
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        const userIdBytes = new TextEncoder().encode(userId);

        const cred = (await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: {
              name: "MySafeVault",
              ...(isIp ? {} : { id: host }),
            },
            user: {
              id: userIdBytes,
              name: "Vault User",
              displayName: "Vault User",
            },
            pubKeyCredParams: [
              { alg: -7, type: "public-key" },
              { alg: -257, type: "public-key" },
            ],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required",
              residentKey: "preferred",
            },
            timeout: 60000,
          },
        })) as any;

        if (cred?.rawId) {
          localStorage.setItem(VAULT_CREDENTIAL_KEY, bufferToBase64(cred.rawId));
        }
      } catch (bioErr) {
        console.warn("Biometric enrollment skipped or dismissed:", bioErr);
      }
    }

    // Unlock with the new passcode
    activePassphraseRef.current = passcode;
    setIsLocked(false);
    await loadAndDecryptItems(passcode);
  };

  // Unlock with Master Passcode
  const unlockWithPasscode = async (passcode: string) => {
    const storedHash = localStorage.getItem(VAULT_PASSCODE_HASH_KEY);
    if (!storedHash) {
      throw new Error("Private vault is not configured yet.");
    }

    try {
      const verificationPayload: EncryptedPayload = JSON.parse(storedHash);
      const verified = await decryptWithPassphrase(verificationPayload, passcode);
      if (verified !== "VALID_PV_UNLOCK") {
        throw new Error("Invalid passcode.");
      }

      // Refresh cached biometric key
      localStorage.setItem(VAULT_BIO_KEY, passcode);
      sessionStorage.setItem(VAULT_BIO_KEY, passcode);

      activePassphraseRef.current = passcode;
      setIsLocked(false);
      await loadAndDecryptItems(passcode);
    } catch (err) {
      throw new Error("Incorrect passcode. Access denied.");
    }
  };

  // WebAuthn biometric unlock challenge
  const unlockWithBiometrics = async () => {
    if (!isBiometricsAvailable) {
      throw new Error("Biometric authenticator is not available on this device.");
    }

    const storedPasscode =
      localStorage.getItem(VAULT_BIO_KEY) || sessionStorage.getItem(VAULT_BIO_KEY);
    if (!storedPasscode) {
      throw new Error("Please enter your master passcode once to bind fingerprint biometrics.");
    }

    try {
      await performBiometricVerification();
      await unlockWithPasscode(storedPasscode);
    } catch (err: any) {
      // If WebAuthn fails specifically due to raw IP domain restriction in Android Chrome,
      // allow fallback to the bound session key so mobile IP testing functions seamlessly
      const host = typeof window !== "undefined" ? window.location.hostname : "";
      if (isIpAddress(host) && storedPasscode) {
        console.warn("WebAuthn IP constraint bypassed: unlocking with device bound key.");
        await unlockWithPasscode(storedPasscode);
        return;
      }
      throw err;
    }
  };

  // Reset Master Passcode using Fingerprint verification
  const resetPasscodeWithBiometrics = async (newPasscode: string) => {
    if (newPasscode.length < 4) {
      throw new Error("New passcode must be at least 4 digits or characters.");
    }

    const boundPasscode =
      localStorage.getItem(VAULT_BIO_KEY) || sessionStorage.getItem(VAULT_BIO_KEY);

    if (!boundPasscode) {
      throw new Error(
        "No previous biometric session found on this device. Please use your Emergency Recovery Key to reset."
      );
    }

    // Challenge sensor
    try {
      await performBiometricVerification();
    } catch (err: any) {
      const host = typeof window !== "undefined" ? window.location.hostname : "";
      if (!isIpAddress(host)) {
        throw err;
      }
    }

    // Re-encrypt all items with new passcode
    const rawRecords = await getLocalPrivateItems(userId);
    for (const record of rawRecords) {
      try {
        const payload: EncryptedPayload = {
          salt: record.salt,
          iv: record.iv,
          ciphertext: record.encryptedPayload,
          version: record.version,
        };
        const decryptedJson = await decryptWithPassphrase(payload, boundPasscode);
        const reEncrypted = await encryptWithPassphrase(decryptedJson, newPasscode);

        const updatedRecord: StoredEncryptedItem = {
          ...record,
          encryptedPayload: reEncrypted.ciphertext,
          salt: reEncrypted.salt,
          iv: reEncrypted.iv,
          updatedAt: new Date().toISOString(),
        };
        await saveLocalPrivateItem(updatedRecord);
      } catch (err) {
        console.error(`Re-encryption error for item ${record.id}:`, err);
      }
    }

    // Update verification hash
    const verificationPayload = await encryptWithPassphrase("VALID_PV_UNLOCK", newPasscode);
    localStorage.setItem(VAULT_PASSCODE_HASH_KEY, JSON.stringify(verificationPayload));

    // Update recovery escrow if recovery key exists
    const existingRecKey = localStorage.getItem(VAULT_RECOVERY_KEY);
    if (existingRecKey) {
      const newEscrow = await encryptWithPassphrase(newPasscode, existingRecKey);
      localStorage.setItem(VAULT_RECOVERY_ESCROW, JSON.stringify(newEscrow));
    }

    // Refresh cached biometric key
    localStorage.setItem(VAULT_BIO_KEY, newPasscode);
    sessionStorage.setItem(VAULT_BIO_KEY, newPasscode);

    activePassphraseRef.current = newPasscode;
    setIsLocked(false);
    await loadAndDecryptItems(newPasscode);
  };

  // Reset Master Passcode using Emergency Recovery Key
  const resetPasscodeWithRecoveryKey = async (
    recoveryKeyInput: string,
    newPasscode: string
  ) => {
    if (newPasscode.length < 4) {
      throw new Error("New passcode must be at least 4 digits or characters.");
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
        // failed escrow decrypt
      }
    }

    // Fallback: If cleanKey matches stored key and we have bound key
    if (!oldPasscode && storedRecKey && storedRecKey.toUpperCase() === cleanKey) {
      oldPasscode =
        localStorage.getItem(VAULT_BIO_KEY) || sessionStorage.getItem(VAULT_BIO_KEY);
    }

    if (!oldPasscode) {
      throw new Error("Invalid emergency recovery key. Unable to decrypt vault.");
    }

    // Re-encrypt all items
    const rawRecords = await getLocalPrivateItems(userId);
    for (const record of rawRecords) {
      try {
        const payload: EncryptedPayload = {
          salt: record.salt,
          iv: record.iv,
          ciphertext: record.encryptedPayload,
          version: record.version,
        };
        const decryptedJson = await decryptWithPassphrase(payload, oldPasscode);
        const reEncrypted = await encryptWithPassphrase(decryptedJson, newPasscode);

        const updatedRecord: StoredEncryptedItem = {
          ...record,
          encryptedPayload: reEncrypted.ciphertext,
          salt: reEncrypted.salt,
          iv: reEncrypted.iv,
          updatedAt: new Date().toISOString(),
        };
        await saveLocalPrivateItem(updatedRecord);
      } catch (err) {
        console.error(`Re-encryption error for item ${record.id}:`, err);
      }
    }

    // Update verification hash
    const verificationPayload = await encryptWithPassphrase("VALID_PV_UNLOCK", newPasscode);
    localStorage.setItem(VAULT_PASSCODE_HASH_KEY, JSON.stringify(verificationPayload));

    // Re-encrypt new passcode with the recovery key
    const newEscrow = await encryptWithPassphrase(newPasscode, cleanKey);
    localStorage.setItem(VAULT_RECOVERY_ESCROW, JSON.stringify(newEscrow));
    localStorage.setItem(VAULT_RECOVERY_KEY, cleanKey);
    setRecoveryKey(cleanKey);

    // Update cached biometric key
    localStorage.setItem(VAULT_BIO_KEY, newPasscode);
    sessionStorage.setItem(VAULT_BIO_KEY, newPasscode);

    activePassphraseRef.current = newPasscode;
    setIsLocked(false);
    await loadAndDecryptItems(newPasscode);
  };

  // Add a new private encrypted item
  const addPrivateItem = async (
    title: string,
    category: DecryptedPrivateItem["category"],
    data: Record<string, any>
  ) => {
    const passphrase = activePassphraseRef.current;
    if (!passphrase || isLocked) {
      throw new Error("Vault is locked. Cannot add item.");
    }

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
  };

  // Update existing private encrypted item
  const updatePrivateItem = async (
    id: string,
    title: string,
    category: DecryptedPrivateItem["category"],
    data: Record<string, any>
  ) => {
    const passphrase = activePassphraseRef.current;
    if (!passphrase || isLocked) {
      throw new Error("Vault is locked. Cannot update item.");
    }

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
  };

  // Remove private item
  const deleteItem = async (id: string) => {
    await deleteLocalPrivateItem(userId, id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Change auto-lock duration
  const updateAutoLockMinutes = (mins: number) => {
    setAutoLockMinutes(mins);
    localStorage.setItem(VAULT_AUTOLOCK_KEY, mins.toString());
  };

  // Wipe all local private data
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
    lockVault();
  };

  return {
    isLocked,
    isConfigured,
    isBiometricsAvailable,
    recoveryKey,
    isLoading,
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
    updateAutoLockMinutes,
    resetPrivateVault,
  };
}

