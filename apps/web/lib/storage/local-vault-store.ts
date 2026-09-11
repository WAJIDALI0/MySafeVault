/**
 * MySafeVault - Local Encrypted Vault Storage Layer (IndexedDB)
 * Zero-Knowledge Local Storage for Offline / Private Vault Items
 * 
 * Rules:
 * - Sensitive values (passwords, notes, tokens) are NEVER stored in plaintext.
 * - Always encrypted via client-vault-crypto (AES-256-GCM) prior to writing to IndexedDB.
 * - IndexedDB acts as the local offline vault store.
 */

export interface StoredEncryptedItem {
  id: string;
  userId: string;
  title: string;
  category: string;
  encryptedPayload: string; // Base64 ciphertext
  salt: string;
  iv: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

const DB_NAME = 'MySafeVault_PrivateVault';
const DB_VERSION = 1;
const STORE_NAME = 'encrypted_records';

/**
 * Opens or upgrades the IndexedDB database instance.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not supported in this environment.'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

/**
 * Saves or updates an encrypted item in IndexedDB.
 */
export async function saveLocalPrivateItem(item: StoredEncryptedItem): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record = {
      ...item,
      updatedAt: new Date().toISOString(),
    };

    const request = store.put(record);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error('Failed to save encrypted item.'));
    tx.oncomplete = () => db.close();
  });
}

/**
 * Retrieves all encrypted items belonging to a specific user.
 */
export async function getLocalPrivateItems(userId: string): Promise<StoredEncryptedItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('userId');
    const request = index.getAll(IDBKeyRange.only(userId));

    request.onsuccess = () => {
      resolve(request.result || []);
    };
    request.onerror = () => reject(request.error || new Error('Failed to fetch encrypted items.'));
    tx.oncomplete = () => db.close();
  });
}

/**
 * Deletes a single encrypted item by ID for a user.
 */
export async function deleteLocalPrivateItem(userId: string, itemId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Verify item belongs to user before deleting
    const getRequest = store.get(itemId);
    getRequest.onsuccess = () => {
      const existing = getRequest.result;
      if (!existing || existing.userId !== userId) {
        // Nothing to delete or not owned by user
        return resolve();
      }

      const delRequest = store.delete(itemId);
      delRequest.onsuccess = () => resolve();
      delRequest.onerror = () => reject(delRequest.error || new Error('Failed to delete item.'));
    };

    getRequest.onerror = () => reject(getRequest.error || new Error('Failed to query item.'));
    tx.oncomplete = () => db.close();
  });
}

/**
 * Returns the count of private items stored locally for a user.
 */
export async function countLocalPrivateItems(userId: string): Promise<number> {
  try {
    const items = await getLocalPrivateItems(userId);
    return items.length;
  } catch {
    return 0;
  }
}

/**
 * Completely clears all private vault items stored locally for a user.
 */
export async function clearLocalPrivateVault(userId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('userId');
    const request = index.openCursor(IDBKeyRange.only(userId));

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };

    request.onerror = () => reject(request.error || new Error('Failed to clear local private vault.'));
    tx.oncomplete = () => db.close();
  });
}
