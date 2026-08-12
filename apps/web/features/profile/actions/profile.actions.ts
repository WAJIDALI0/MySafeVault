"use server";

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { revalidatePath } from 'next/cache';

export async function updateProfile({ full_name, avatar }: { full_name?: string; avatar?: string }) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (avatar !== undefined) updateData.avatar = avatar;


    if (Object.keys(updateData).length === 0) {
      return { error: 'No data provided to update' };
    }

    await prisma.profile.update({
      where: { id: user.id },
      data: updateData,
    });

    revalidatePath('/settings/account');
    revalidatePath('/profile');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { error: 'Failed to update profile' };
  }
}
