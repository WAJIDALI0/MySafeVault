/**
 * Private Vault Crypto Service
 * Batch encryption, decryption, and re-encryption utilities for Private Vault items
 */

import {
  decryptWithPassphrase,
  encryptWithPassphrase,
  EncryptedPayload,
} from "@/lib/crypto/client-vault-crypto";
import {
  StoredEncryptedItem,
  saveLocalPrivateItem,
  getLocalPrivateItems,
} from "@/lib/storage/local-vault-store";
import { DecryptedPrivateItem } from "../types/private-vault.types";
import { CloudStoredEncryptedItem } from "../actions/private-vault-sync.actions";

export const VERIFICATION_TOKEN_STRING = "VALID_PV_UNLOCK";

/**
 * Decrypts raw stored records from IndexedDB using the provided master passphrase
 */
export async function decryptStoredPrivateItems(
  rawRecords: StoredEncryptedItem[],
  passphrase: string
): Promise<DecryptedPrivateItem[]> {
  const decryptedList: DecryptedPrivateItem[] = [];

  for (const record of rawRecords) {
    try {
      const payload: EncryptedPayload = {
        salt: record.salt,
        iv: record.iv,
        ciphertext: record.encryptedPayload,
        version: record.version,
      };

      const decryptedJson = await decryptWithPassphrase(payload, passphrase);
      const parsed = JSON.parse(decryptedJson);

      decryptedList.push({
        id: record.id,
        title: record.title,
        category: (record.category as any) || "password",
        data: parsed,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      });
    } catch (err) {
      console.error(`Failed to decrypt private item ${record.id}:`, err);
    }
  }

  return decryptedList;
}

/**
 * Re-encrypts all local private items from an old passphrase to a new passphrase
 * (Used during passcode resets via biometrics or recovery keys)
 */
export async function reencryptAllPrivateItems(
  userId: string,
  oldPassphrase: string,
  newPassphrase: string
): Promise<CloudStoredEncryptedItem[]> {
  const rawRecords = await getLocalPrivateItems(userId);
  const updatedCloudItems: CloudStoredEncryptedItem[] = [];

  for (const record of rawRecords) {
    try {
      const payload: EncryptedPayload = {
        salt: record.salt,
        iv: record.iv,
        ciphertext: record.encryptedPayload,
        version: record.version,
      };

      const decryptedJson = await decryptWithPassphrase(payload, oldPassphrase);
      const reEncrypted = await encryptWithPassphrase(decryptedJson, newPassphrase);

      const updatedRecord: StoredEncryptedItem = {
        ...record,
        encryptedPayload: reEncrypted.ciphertext,
        salt: reEncrypted.salt,
        iv: reEncrypted.iv,
        updatedAt: new Date().toISOString(),
      };

      await saveLocalPrivateItem(updatedRecord);

      updatedCloudItems.push({
        id: updatedRecord.id,
        userId,
        title: updatedRecord.title,
        category: updatedRecord.category,
        encryptedPayload: updatedRecord.encryptedPayload,
        salt: updatedRecord.salt,
        iv: updatedRecord.iv,
        version: updatedRecord.version,
        createdAt: updatedRecord.createdAt,
        updatedAt: updatedRecord.updatedAt,
      });
    } catch (err) {
      console.error(`Re-encryption error for item ${record.id}:`, err);
    }
  }

  return updatedCloudItems;
}
