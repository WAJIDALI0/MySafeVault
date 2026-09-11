/**
 * MySafeVault - .msvault Authenticated Container
 * Secure, tamper-evident container format for encrypted backup and export.
 * Specification:
 * - PBKDF2-HMAC-SHA256 (100,000 iterations)
 * - AES-256-GCM (128-bit authentication tag)
 * - SHA-256 Payload Checksum verification before key derivation
 */

import {
  encryptWithPassphrase,
  decryptWithPassphrase,
  computeSha256,
  EncryptedPayload,
} from './client-vault-crypto';

export interface MsvaultContainer {
  format: 'MSVAULT_ENCRYPTED_CONTAINER';
  version: number;
  createdAt: string;
  appName: string;
  appVersion: string;
  itemCount: number;
  passwordHint?: string;
  kdf: {
    algorithm: 'PBKDF2-HMAC-SHA256';
    iterations: number;
    salt: string;
  };
  cipher: {
    algorithm: 'AES-256-GCM';
    iv: string;
    tagLength: number;
  };
  payload: string; // Base64 ciphertext + tag
  checksum: string; // SHA-256 of payload for tamper detection
}

export interface ExportVaultItem {
  id: string;
  title: string;
  category?: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  customFields?: Record<string, any>;
  isFavorite?: boolean;
  isPrivate?: boolean;
  updatedAt?: string;
  [key: string]: any;
}

export interface ExportOptions {
  passphrase: string;
  passwordHint?: string;
  items: ExportVaultItem[];
  metadata?: Record<string, any>;
}

export interface DecryptedMsvaultResult {
  items: ExportVaultItem[];
  createdAt: string;
  itemCount: number;
  metadata?: Record<string, any>;
}

/**
 * Builds an authenticated .msvault export file string.
 */
export async function buildMsvaultExport(options: ExportOptions): Promise<string> {
  const { passphrase, passwordHint, items, metadata } = options;

  if (!passphrase || passphrase.length < 6) {
    throw new Error('Export passphrase must be at least 6 characters long.');
  }

  // Serialize payload with metadata
  const rawPayload = JSON.stringify({
    items,
    metadata: metadata || {},
    exportedAt: new Date().toISOString(),
    totalCount: items.length,
  });

  // Client-side encryption with 100,000 iterations
  const encrypted: EncryptedPayload = await encryptWithPassphrase(rawPayload, passphrase, 100000);

  // Compute checksum over the ciphertext
  const checksum = await computeSha256(encrypted.ciphertext);

  const container: MsvaultContainer = {
    format: 'MSVAULT_ENCRYPTED_CONTAINER',
    version: 1,
    createdAt: new Date().toISOString(),
    appName: 'MySafeVault',
    appVersion: '1.0.0',
    itemCount: items.length,
    passwordHint: passwordHint?.trim() || undefined,
    kdf: {
      algorithm: 'PBKDF2-HMAC-SHA256',
      iterations: 100000,
      salt: encrypted.salt,
    },
    cipher: {
      algorithm: 'AES-256-GCM',
      iv: encrypted.iv,
      tagLength: 128,
    },
    payload: encrypted.ciphertext,
    checksum: checksum,
  };

  return JSON.stringify(container, null, 2);
}

/**
 * Inspects a .msvault file header without decrypting (to get hint, item count, date).
 */
export function inspectMsvaultHeader(fileContent: string): {
  isValid: boolean;
  version?: number;
  itemCount?: number;
  createdAt?: string;
  passwordHint?: string;
  error?: string;
} {
  try {
    const container = JSON.parse(fileContent);
    if (container.format !== 'MSVAULT_ENCRYPTED_CONTAINER') {
      return { isValid: false, error: 'Not a valid MySafeVault container file.' };
    }
    return {
      isValid: true,
      version: container.version,
      itemCount: container.itemCount ?? 0,
      createdAt: container.createdAt,
      passwordHint: container.passwordHint,
    };
  } catch {
    return { isValid: false, error: 'File is not a valid JSON structure.' };
  }
}

/**
 * Verifies integrity and decrypts a .msvault container using the passphrase.
 */
export async function parseAndDecryptMsvault(
  fileContent: string,
  passphrase: string
): Promise<DecryptedMsvaultResult> {
  let container: MsvaultContainer;
  try {
    container = JSON.parse(fileContent);
  } catch {
    throw new Error('CORRUPT_FILE: Container file is corrupted or not valid JSON.');
  }

  if (container.format !== 'MSVAULT_ENCRYPTED_CONTAINER') {
    throw new Error('INVALID_FORMAT: File is not a recognized MySafeVault container.');
  }

  // 1. Verify tamper-proof checksum
  const computedChecksum = await computeSha256(container.payload);
  if (computedChecksum !== container.checksum) {
    throw new Error('TAMPER_DETECTED: File integrity check failed. The backup may have been modified or corrupted.');
  }

  // 2. Decrypt payload
  const encryptedPayload: EncryptedPayload = {
    salt: container.kdf.salt,
    iv: container.cipher.iv,
    ciphertext: container.payload,
    version: container.version,
  };

  const decryptedJson = await decryptWithPassphrase(
    encryptedPayload,
    passphrase,
    container.kdf.iterations || 100000
  );

  // 3. Parse and validate structure
  let decryptedData: any;
  try {
    decryptedData = JSON.parse(decryptedJson);
  } catch {
    throw new Error('CORRUPT_PAYLOAD: Decrypted data could not be parsed.');
  }

  if (!decryptedData || !Array.isArray(decryptedData.items)) {
    throw new Error('INVALID_DATA: Container does not contain a valid items array.');
  }

  return {
    items: decryptedData.items,
    createdAt: container.createdAt,
    itemCount: decryptedData.items.length,
    metadata: decryptedData.metadata,
  };
}
