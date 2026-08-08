"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma/client";
import { encryptData, decryptData } from "@/lib/encryption";
import { revalidatePath } from "next/cache";
import { VaultItemType } from "@prisma/client";
import * as fs from "fs";

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

    revalidatePath("/dashboard");
    revalidatePath("/vault");

    return { success: true, item: newItem };
  } catch (error: any) {
    console.error("Failed to add vault item:", error);
    fs.writeFileSync("last-error.log", error?.stack || error?.message || String(error));
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
