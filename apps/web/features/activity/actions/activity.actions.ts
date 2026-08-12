"use server";

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';

export async function getActivities(filter?: string, cursor?: string, take = 20) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const where: any = { profile_id: user.id };

  if (filter && filter !== 'All') {
    if (filter === 'Security' || filter === 'Account') {
      where.action = { in: ['login', 'logout', 'item_favorited'] };
    } else if (filter === 'Passwords') {
      where.action = { startsWith: 'create_password' };
    } else if (filter === 'Documents') {
      where.action = { startsWith: 'create_document' };
    } else if (filter === 'Notes') {
      where.action = { startsWith: 'create_secure_note' };
    } else if (filter === 'Identity') {
      where.action = { startsWith: 'create_identity' };
    } else if (filter === 'Vault') {
      where.action = { notIn: ['login', 'logout'] };
    }
  }

  try {
    const activities = await prisma.activityLog.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: take + 1, // Fetch one extra to determine if there are more
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    let nextCursor = undefined;
    if (activities.length > take) {
      const nextItem = activities.pop();
      nextCursor = nextItem?.id;
    }

    return { success: true, data: activities, nextCursor };
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    return { error: 'Failed to fetch activities' };
  }
}
