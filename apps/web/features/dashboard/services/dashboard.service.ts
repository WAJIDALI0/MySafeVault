import { prisma } from "@/lib/prisma/client";
import { VaultItemType } from "@prisma/client";

export async function getDashboardStats(userId: string) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const twoWeeksAgo = new Date();
  const currentPeriodStart = new Date();
  currentPeriodStart.setDate(currentPeriodStart.getDate() - 7);

  const previousPeriodStart = new Date();
  previousPeriodStart.setDate(previousPeriodStart.getDate() - 14);

  const [items, favoritesCount, currentPeriodCount, previousPeriodCount] = await Promise.all([
    prisma.vaultItem.groupBy({
      by: ['type'],
      where: { profile_id: userId },
      _count: { _all: true },
      orderBy: { type: 'asc' },
    }),
    prisma.vaultItem.count({
      where: { profile_id: userId, is_favorite: true }
    }),
    prisma.vaultItem.count({
      where: { profile_id: userId, created_at: { gte: currentPeriodStart } }
    }),
    prisma.vaultItem.count({
      where: { profile_id: userId, created_at: { gte: previousPeriodStart, lt: currentPeriodStart } }
    })
  ]);

  const trend = currentPeriodCount - previousPeriodCount;

  let totalItems = 0;
  let passwords = 0;
  let documents = 0;
  let secureNotes = 0;
  let identities = 0;
  let receipts = 0;
  let warranties = 0;

  items.forEach(group => {
    const count = Number((group as any)._count?._all || 0);
    totalItems += count;
    switch(group.type) {
      case 'PASSWORD': passwords = count; break;
      case 'DOCUMENT': documents = count; break;
      case 'SECURE_NOTE': secureNotes = count; break;
      case 'IDENTITY': identities = count; break;
      case 'RECEIPT': receipts = count; break;
      case 'WARRANTY': warranties = count; break;
    }
  });

  return {
    totalItems,
    passwords,
    documents,
    secureNotes,
    identities,
    receipts,
    warranties,
    favorites: favoritesCount,
    trend,
    currentPeriodCount,
  };
}
