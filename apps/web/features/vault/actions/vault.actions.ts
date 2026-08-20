"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { encryptData, decryptData } from "@/lib/encryption";
import { revalidatePath } from "next/cache";
import { VaultItemType } from "@prisma/client";
import { createNotification } from "@/lib/services/notification.service";

interface AddVaultItemParams {
  type: VaultItemType;
  title: string;
  description?: string;
  data: Record<string, any>;
}

export async function addVaultItem({ type, title, description, data }: AddVaultItemParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Ensure profile exists (in case Supabase trigger hasn't fired or doesn't exist)
    await prisma.profile.upsert({
      where: { id: user.id },
      update: {},
      create: { id: user.id, full_name: user.email?.split('@')[0] || 'User' }
    });

    // Stringify and encrypt the sensitive data payload
    const plaintext = JSON.stringify(data);
    const encryptedData = encryptData(plaintext);

    const newItem = await prisma.vaultItem.create({
      data: {
        profile_id: user.id,
        type,
        title,
        description,
        encrypted_data: encryptedData,
      },
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        profile_id: user.id,
        action: `create_${type.toLowerCase()}`,
        metadata: { title },
      },
    });

    // Send a notification
    await createNotification({
      profile_id: user.id,
      type: "ACTIVITY",
      title: "New Vault Item Added",
      message: `You successfully added a new ${type.toLowerCase()} item: "${title}".`,
      action_url: `/vault?category=${type}`
    });

    revalidatePath("/dashboard");
    revalidatePath("/vault");

    return { success: true, item: newItem };
  } catch (error: any) {
    console.error("Failed to add vault item:", error);
    return { error: "Failed to create item securely." };
  }
}

export async function getVaultItemData(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const item = await prisma.vaultItem.findFirst({
      where: { 
        id,
        profile_id: user.id // SECURITY: Only fetch if it belongs to the user
      }
    });

    if (!item) {
      return { error: "Item not found" };
    }

    // Decrypt the payload
    const plaintext = decryptData(item.encrypted_data);
    const data = JSON.parse(plaintext);

    // Log the read activity
    await prisma.activityLog.create({
      data: {
        profile_id: user.id,
        action: "view_item",
        metadata: { title: item.title, type: item.type },
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to decrypt item:", error);
    return { error: "Failed to decrypt secure data." };
  }
}

export async function deleteVaultItem(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  try {
    await prisma.vaultItem.deleteMany({
      where: { 
        id,
        profile_id: user.id // SECURITY: Only delete if it belongs to the user
      }
    });

    await prisma.activityLog.create({
      data: { profile_id: user.id, action: "delete_item", metadata: { itemId: id } },
    });

    revalidatePath("/dashboard");
    revalidatePath("/vault");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete item:", error);
    return { error: "Failed to delete item." };
  }
}

export async function updateVaultItem(id: string, params: AddVaultItemParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  try {
    const plaintext = JSON.stringify(params.data);
    const encryptedData = encryptData(plaintext);

    await prisma.vaultItem.updateMany({
      where: { 
        id,
        profile_id: user.id
      },
      data: {
        title: params.title,
        description: params.description,
        encrypted_data: encryptedData,
      }
    });

    await prisma.activityLog.create({
      data: { profile_id: user.id, action: "update_item", metadata: { title: params.title } },
    });

    revalidatePath("/dashboard");
    revalidatePath("/vault");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update item:", error);
    return { error: "Failed to update item securely." };
  }
}

export async function toggleFavorite(id: string, is_favorite: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  try {
    await prisma.vaultItem.updateMany({
      where: { 
        id,
        profile_id: user.id
      },
      data: {
        is_favorite
      }
    });

    // We intentionally don't log a full ActivityLog for a simple favorite toggle to avoid spam,
    // or we could log it if needed. Let's log it as requested by DAY 5 Part 5 if it's true.
    if (is_favorite) {
      await prisma.activityLog.create({
        data: { profile_id: user.id, action: "item_favorited", metadata: { itemId: id } },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/vault");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
    return { error: "Failed to update favorite status." };
  }
}

export async function getStorageStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  try {
    const items = await prisma.vaultItem.findMany({
      where: { profile_id: user.id },
      select: { type: true, encrypted_data: true }
    });

    let totalBytes = 0;
    const categories = {
      Documents: 0,
      Images: 0,
      Notes: 0,
      Passwords: 0,
      Other: 0
    };

    for (const item of items) {
      const bytes = Buffer.byteLength(item.encrypted_data, 'utf8');
      totalBytes += bytes;

      switch (item.type) {
        case "DOCUMENT":
          // To strictly separate Images vs Documents we would need to decrypt and check file type.
          // For efficiency in a metadata stats call, we classify DOCUMENT as Documents.
          categories.Documents += bytes;
          break;
        case "SECURE_NOTE":
          categories.Notes += bytes;
          break;
        case "PASSWORD":
          categories.Passwords += bytes;
          break;
        default:
          categories.Other += bytes;
          break;
      }
    }

    return { 
      success: true, 
      totalBytes, 
      categories 
    };
  } catch (error) {
    console.error("Failed to get storage stats:", error);
    return { error: "Failed to calculate storage stats." };
  }
}
