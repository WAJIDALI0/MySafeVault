/**
 * Private Vault Domain Types
 */
export type PrivateVaultCategory = "password" | "document" | "note" | "identity" | "card";

export interface DecryptedPrivateItem {
  id: string;
  title: string;
  category: PrivateVaultCategory;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PrivateVaultState {
  isLocked: boolean;
  isConfigured: boolean;
  isBiometricsAvailable: boolean;
  recoveryKey: string | null;
  items: DecryptedPrivateItem[];
  isLoading: boolean;
  isSyncing: boolean;
  autoLockMinutes: number;
}
