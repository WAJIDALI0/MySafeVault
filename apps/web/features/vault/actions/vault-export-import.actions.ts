"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { encryptData, decryptData } from "@/lib/encryption";
import { revalidatePath } from "next/cache";
import { VaultItemType } from "@prisma/client";
import { createNotification } from "@/lib/services/notification.service";

export interface ExportableItem {
  id: string;
  type: VaultItemType;
  title: string;
  description?: string | null;
  data: Record<string, any>;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetches user's vault items and decrypts them for client-side .msvault packaging.
 * The raw items are transmitted over TLS directly to browser memory.
 */
export async function fetchVaultItemsForExport(): Promise<{
  success: boolean;
  items?: ExportableItem[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  try {
    const rawItems = await prisma.vaultItem.findMany({
      where: { profile_id: user.id },
      orderBy: { created_at: "desc" },
    });

    const decryptedItems: ExportableItem[] = [];

    for (const item of rawItems) {
      let itemData: Record<string, any> = {};
      try {
        const decryptedStr = decryptData(item.encrypted_data);
        itemData = JSON.parse(decryptedStr);
      } catch (e) {
        console.error(`Failed to decrypt item ${item.id} during export preparation:`, e);
      }

      decryptedItems.push({
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        data: itemData,
        isFavorite: item.is_favorite,
        createdAt: item.created_at.toISOString(),
        updatedAt: item.updated_at.toISOString(),
      });
    }

    // Log export audit event
    await prisma.activityLog.create({
      data: {
        profile_id: user.id,
        action: "vault_export_generated",
        metadata: {
          itemCount: decryptedItems.length,
          timestamp: new Date().toISOString(),
        },
      },
    });

    return {
      success: true,
      items: decryptedItems,
    };
  } catch (error: any) {
    console.error("fetchVaultItemsForExport error:", error);
    return { success: false, error: error.message || "Failed to prepare export items." };
  }
}

export interface ImportItemInput {
  title: string;
  type?: string;
  description?: string;
  data: Record<string, any>;
  isFavorite?: boolean;
}

/**
 * Restores a batch of decrypted items back into the user's cloud vault.
 */
export async function restoreImportedVaultItems(
  items: ImportItemInput[]
): Promise<{ success: boolean; importedCount: number; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, importedCount: 0, error: "Unauthorized." };
  }

  if (!items || items.length === 0) {
    return { success: false, importedCount: 0, error: "No items provided to import." };
  }

  try {
    await prisma.profile.upsert({
      where: { id: user.id },
      update: {},
      create: { id: user.id, full_name: user.email?.split("@")[0] || "User" },
    });

    let importedCount = 0;

    for (const item of items) {
      if (!item.title || !item.data) continue;

      let vaultType: VaultItemType = VaultItemType.PASSWORD;
      if (item.type && Object.values(VaultItemType).includes(item.type as VaultItemType)) {
        vaultType = item.type as VaultItemType;
      }

      const plaintext = JSON.stringify(item.data);
      const encryptedData = encryptData(plaintext);

      await prisma.vaultItem.create({
        data: {
          profile_id: user.id,
          type: vaultType,
          title: item.title,
          description: item.description || null,
          encrypted_data: encryptedData,
          is_favorite: Boolean(item.isFavorite),
        },
      });

      importedCount++;
    }

    // Activity Log
    await prisma.activityLog.create({
      data: {
        profile_id: user.id,
        action: "vault_import_restored",
        metadata: {
          importedCount,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Notification
    await createNotification({
      profile_id: user.id,
      type: "ACTIVITY",
      title: "Encrypted Backup Restored",
      message: `Successfully imported ${importedCount} items into your vault.`,
    });

    revalidatePath("/vault");
    revalidatePath("/dashboard");

    return { success: true, importedCount };
  } catch (error: any) {
    console.error("restoreImportedVaultItems error:", error);
    return { success: false, importedCount: 0, error: error.message || "Failed to restore items." };
  }
}
