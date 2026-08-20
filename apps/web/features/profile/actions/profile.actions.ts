"use server";

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/logger/activity';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name must be under 50 characters").optional(),
  avatar: z.string().optional()
});

export async function updateProfile(formData: { full_name?: string; avatar?: string }) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    const parsed = UpdateProfileSchema.safeParse(formData);
    
    if (!parsed.success) {
      return { error: parsed.error.issues?.[0]?.message || 'Invalid profile data' };
    }

    const { full_name, avatar } = parsed.data;

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

    await logActivity({
      profileId: user.id,
      action: "profile_updated",
    });

    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { error: 'Failed to update profile' };
  }
}
