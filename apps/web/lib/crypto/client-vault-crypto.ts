/**
 * MySafeVault - Client-Side Cryptographic Engine
 * Zero-Knowledge Architecture using Web Crypto API (SubtleCrypto)
 * PBKDF2-HMAC-SHA256 (100,000 iterations) + AES-256-GCM (128-bit authentication tag)
 */

export interface EncryptedPayload {
  salt: string;        // Base64 encoded 16-byte salt
  iv: string;          // Base64 encoded 12-byte IV
  ciphertext: string;  // Base64 encoded ciphertext including 16-byte auth tag
  version: number;
}

const KDF_ITERATIONS = 100000;
const KDF_HASH = 'SHA-256';
const ALGORITHM_NAME = 'AES-GCM';
const KEY_LENGTH_BITS = 256;
const IV_LENGTH_BYTES = 12; // 96-bit IV recommended for GCM
const SALT_LENGTH_BYTES = 16; // 128-bit salt

/**
 * Safely access the crypto subtle API across client and edge/node environments.
 */
function getSubtleCrypto(): SubtleCrypto {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    return window.crypto.subtle;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle;
  }
  throw new Error('Web Crypto API (crypto.subtle) is not available in this environment.');
}

/**
 * Generates cryptographically secure random bytes.
 */
export function getRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(bytes);
  } else if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    throw new Error('Cryptographically secure RNG is not available.');
  }
  return bytes;
}

/**
 * ArrayBuffer / Uint8Array to Base64
 */
export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Base64 to Uint8Array
 */
export function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derives an AES-GCM-256 CryptoKey from a passphrase and salt using PBKDF2.
 */
export async function deriveKeyFromPassphrase(
  passphrase: string,
  salt: Uint8Array,
  iterations: number = KDF_ITERATIONS
): Promise<CryptoKey> {
  const subtle = getSubtleCrypto();
  const encoder = new TextEncoder();
  const passphraseBytes = encoder.encode(passphrase);

  // Import raw passphrase as key material
  const baseKey = await subtle.importKey(
    'raw',
    passphraseBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // Derive AES-GCM 256-bit encryption/decryption key
  return await subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: iterations,
      hash: KDF_HASH,
    },
    baseKey,
    {
      name: ALGORITHM_NAME,
      length: KEY_LENGTH_BITS,
    },
    false, // Non-extractable for memory protection
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a plaintext string using a passphrase.
 * Generates fresh random salt and IV for every single encryption.
 */
export async function encryptWithPassphrase(
  plaintext: string,
  passphrase: string,
  iterations: number = KDF_ITERATIONS
): Promise<EncryptedPayload> {
  const subtle = getSubtleCrypto();
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const salt = getRandomBytes(SALT_LENGTH_BYTES);
  const iv = getRandomBytes(IV_LENGTH_BYTES);

  const key = await deriveKeyFromPassphrase(passphrase, salt, iterations);

  const encryptedBuffer = await subtle.encrypt(
    {
      name: ALGORITHM_NAME,
      iv: iv as any,
      tagLength: 128, // 128-bit authentication tag
    },
    key,
    data as any
  );

  return {
    salt: bufferToBase64(salt),
    iv: bufferToBase64(iv),
    ciphertext: bufferToBase64(encryptedBuffer),
    version: 1,
  };
}

/**
 * Decrypts an EncryptedPayload using a passphrase.
 * Throws an explicit error if the passphrase is wrong or data has been tampered with.
 */
export async function decryptWithPassphrase(
  payload: EncryptedPayload,
  passphrase: string,
  iterations: number = KDF_ITERATIONS
): Promise<string> {
  const subtle = getSubtleCrypto();
  const salt = base64ToBuffer(payload.salt);
  const iv = base64ToBuffer(payload.iv);
  const ciphertext = base64ToBuffer(payload.ciphertext);

  const key = await deriveKeyFromPassphrase(passphrase, salt, iterations);

  try {
    const decryptedBuffer = await subtle.decrypt(
      {
        name: ALGORITHM_NAME,
        iv: iv as any,
        tagLength: 128,
      },
      key,
      ciphertext as any
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    throw new Error('ERR_DECRYPT_FAILED: Invalid passphrase or corrupted ciphertext.');
  }
}

/**
 * Computes a SHA-256 hex checksum of a string or buffer.
 */
export async function computeSha256(content: string | Uint8Array): Promise<string> {
  const subtle = getSubtleCrypto();
  const data = typeof content === 'string' ? new TextEncoder().encode(content) : content;
  const hashBuffer = await subtle.digest('SHA-256', data as any);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a formatted 16-character alphanumeric recovery key.
 * Format: MSV-XXXX-XXXX-XXXX-XXXX
 */
export function generateRecoveryKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Safe Crockford Base32
  const bytes = getRandomBytes(16);
  let raw = '';
  for (let i = 0; i < 16; i++) {
    raw += chars[bytes[i] % chars.length];
  }
  return `MSV-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`;
}

