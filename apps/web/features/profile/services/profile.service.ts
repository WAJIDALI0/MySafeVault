import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { cache } from 'react';

export const getCachedProfile = cache(async () => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    let profile = await prisma.profile.findUnique({
      where: { id: user.id }
    });

    if (!profile) {
      // Ensure profile exists
      profile = await prisma.profile.create({
        data: {
          id: user.id,
          full_name: user.email?.split('@')[0] || 'User',
        }
      });
    }

    return {
      ...profile,
      email: user.email,
      created_at: user.created_at
    };
  } catch (error) {
    console.error('Failed to get cached profile:', error);
    return null;
  }
});
