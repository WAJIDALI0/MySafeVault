"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";

export interface CloudStoredEncryptedItem {
  id: string;
  userId: string;
  title: string;
  category: string;
  encryptedPayload: string;
  salt: string;
  iv: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface PrivateVaultCloudState {
  isConfigured: boolean;
  verificationPayload: any | null;
  recoveryEscrow: any | null;
  recoveryKey: string | null;
  autoLockMinutes: number;
  items: CloudStoredEncryptedItem[];
  updatedAt: string | null;
}

/**
 * Fetches the encrypted Zero-Knowledge Private Vault state from the cloud for the authenticated user.
 */
export async function getPrivateVaultCloudData(): Promise<{
  success: boolean;
  data?: PrivateVaultCloudState;
  userId?: string;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const pref = await prisma.userPreference.findUnique({
      where: { profile_id: user.id },
    });

    const secSettings =
      pref?.security_settings && typeof pref.security_settings === "object"
        ? (pref.security_settings as Record<string, any>)
        : {};

    const pv = secSettings.private_vault || null;

    if (!pv || !pv.verificationPayload) {
      return {
        success: true,
        userId: user.id,
        data: {
          isConfigured: false,
          verificationPayload: null,
          recoveryEscrow: null,
          recoveryKey: null,
          autoLockMinutes: 5,
          items: [],
          updatedAt: null,
        },
      };
    }

    return {
      success: true,
      userId: user.id,
      data: {
        isConfigured: true,
        verificationPayload: pv.verificationPayload,
        recoveryEscrow: pv.recoveryEscrow || null,
        recoveryKey: pv.recoveryKey || null,
        autoLockMinutes: typeof pv.autoLockMinutes === "number" ? pv.autoLockMinutes : 5,
        items: Array.isArray(pv.items) ? pv.items : [],
        updatedAt: pv.updatedAt || null,
      },
    };
  } catch (error: any) {
    console.error("Error fetching private vault cloud data:", error);
    return { success: false, error: error?.message || "Failed to fetch cloud vault data" };
  }
}

/**
 * Saves initial or updated Private Vault configuration (passcode verification hash, recovery escrow, autolock)
 */
export async function savePrivateVaultCloudConfig(params: {
  verificationPayload: any;
  recoveryEscrow?: any;
  recoveryKey?: string | null;
  autoLockMinutes?: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const pref = await prisma.userPreference.findUnique({
      where: { profile_id: user.id },
    });

    const secSettings =
      pref?.security_settings && typeof pref.security_settings === "object"
        ? (pref.security_settings as Record<string, any>)
        : {};

    const existingPv = secSettings.private_vault || {};

    const updatedPv = {
      ...existingPv,
      verificationPayload: params.verificationPayload,
      recoveryEscrow: params.recoveryEscrow ?? existingPv.recoveryEscrow,
      recoveryKey: params.recoveryKey ?? existingPv.recoveryKey,
      autoLockMinutes: params.autoLockMinutes ?? existingPv.autoLockMinutes ?? 5,
      items: Array.isArray(existingPv.items) ? existingPv.items : [],
      updatedAt: new Date().toISOString(),
    };

    await prisma.userPreference.upsert({
      where: { profile_id: user.id },
      create: {
        profile_id: user.id,
        security_settings: {
          ...secSettings,
          private_vault: updatedPv,
        },
      },
      update: {
        security_settings: {
          ...secSettings,
          private_vault: updatedPv,
        },
      },
    });

    revalidatePath("/private-vault");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving private vault config:", error);
    return { success: false, error: error?.message || "Failed to save private vault config" };
  }
}

/**
 * Upserts an encrypted private item in the cloud vault
 */
export async function savePrivateVaultItemCloud(
  item: CloudStoredEncryptedItem
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const pref = await prisma.userPreference.findUnique({
      where: { profile_id: user.id },
    });

    const secSettings =
      pref?.security_settings && typeof pref.security_settings === "object"
        ? (pref.security_settings as Record<string, any>)
        : {};

    const pv = secSettings.private_vault || {
      items: [],
      autoLockMinutes: 5,
    };

    const existingItems: CloudStoredEncryptedItem[] = Array.isArray(pv.items) ? pv.items : [];
    const itemIndex = existingItems.findIndex((it) => it.id === item.id);

    let updatedItems: CloudStoredEncryptedItem[];
    if (itemIndex >= 0) {
      updatedItems = [...existingItems];
      updatedItems[itemIndex] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      updatedItems = [{ ...item, createdAt: item.createdAt || new Date().toISOString() }, ...existingItems];
    }

    const updatedPv = {
      ...pv,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    };

    await prisma.userPreference.upsert({
      where: { profile_id: user.id },
      create: {
        profile_id: user.id,
        security_settings: {
          ...secSettings,
          private_vault: updatedPv,
        },
      },
      update: {
        security_settings: {
          ...secSettings,
          private_vault: updatedPv,
        },
      },
    });

    revalidatePath("/private-vault");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving private vault item:", error);
    return { success: false, error: error?.message || "Failed to save item to cloud" };
  }
}

/**
 * Deletes an encrypted private item from the cloud vault
 */
export async function deletePrivateVaultItemCloud(
  itemId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const pref = await prisma.userPreference.findUnique({
      where: { profile_id: user.id },
    });

    const secSettings =
      pref?.security_settings && typeof pref.security_settings === "object"
        ? (pref.security_settings as Record<string, any>)
        : {};

    const pv = secSettings.private_vault;
    if (!pv || !Array.isArray(pv.items)) {
      return { success: true };
    }

    const updatedItems = pv.items.filter((it: CloudStoredEncryptedItem) => it.id !== itemId);

    const updatedPv = {
      ...pv,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    };

    await prisma.userPreference.update({
      where: { profile_id: user.id },
      data: {
        security_settings: {
          ...secSettings,
          private_vault: updatedPv,
        },
      },
    });

    revalidatePath("/private-vault");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting private vault item:", error);
    return { success: false, error: error?.message || "Failed to delete item from cloud" };
  }
}

/**
 * Atomically synchronizes all encrypted items and passcode credentials
 * (Used when resetting passcode with fingerprint/recovery key or performing a full sync)
 */
export async function syncAllPrivateVaultCloud(params: {
  items: CloudStoredEncryptedItem[];
  verificationPayload?: any;
  recoveryEscrow?: any;
  recoveryKey?: string | null;
  autoLockMinutes?: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const pref = await prisma.userPreference.findUnique({
      where: { profile_id: user.id },
    });

    const secSettings =
      pref?.security_settings && typeof pref.security_settings === "object"
        ? (pref.security_settings as Record<string, any>)
        : {};

    const existingPv = secSettings.private_vault || {};

    const updatedPv = {
      ...existingPv,
      items: params.items,
      ...(params.verificationPayload && { verificationPayload: params.verificationPayload }),
      ...(params.recoveryEscrow && { recoveryEscrow: params.recoveryEscrow }),
      ...(params.recoveryKey !== undefined && { recoveryKey: params.recoveryKey }),
      ...(params.autoLockMinutes !== undefined && { autoLockMinutes: params.autoLockMinutes }),
      updatedAt: new Date().toISOString(),
    };

    await prisma.userPreference.upsert({
      where: { profile_id: user.id },
      create: {
        profile_id: user.id,
        security_settings: {
          ...secSettings,
          private_vault: updatedPv,
        },
      },
      update: {
        security_settings: {
          ...secSettings,
          private_vault: updatedPv,
        },
      },
    });

    revalidatePath("/private-vault");
    return { success: true };
  } catch (error: any) {
    console.error("Error synchronizing all private vault items:", error);
    return { success: false, error: error?.message || "Failed to synchronize vault" };
  }
}

/**
 * Resets / wipes the cloud private vault for the user
 */
export async function resetPrivateVaultCloud(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    const pref = await prisma.userPreference.findUnique({
      where: { profile_id: user.id },
    });

    if (!pref) return { success: true };

    const secSettings =
      pref.security_settings && typeof pref.security_settings === "object"
        ? (pref.security_settings as Record<string, any>)
        : {};

    const { private_vault, ...restSecSettings } = secSettings;

    await prisma.userPreference.update({
      where: { profile_id: user.id },
      data: {
        security_settings: restSecSettings,
      },
    });

    revalidatePath("/private-vault");
    return { success: true };
  } catch (error: any) {
    console.error("Error resetting cloud private vault:", error);
    return { success: false, error: error?.message || "Failed to reset cloud private vault" };
  }
}
