import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { VaultPageClient } from "@/features/vault/components/vault-page-client";

export default async function VaultPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let items: any[] = [];
  if (user) {
    items = await prisma.vaultItem.findMany({
      where: { profile_id: user.id },
      orderBy: { updated_at: 'desc' },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        is_favorite: true,
        updated_at: true,
        created_at: true,
        profile_id: true,
        // We explicitly exclude 'data' to prevent downloading massive files/images for the grid view
      }
    });
  }

  return <VaultPageClient initialItems={items} />;
}
