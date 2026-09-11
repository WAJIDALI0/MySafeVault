# Plan 1: Cryptographic Foundation & Local Encrypted Storage

## Executive Overview
Establish a battle-tested, zero-knowledge, client-side cryptography subsystem and local encrypted storage architecture for **MySafeVault Private Vault / Lock Folder**. This plan operates 100% in the browser using the native **Web Crypto API** (`window.crypto.subtle`), ensuring sensitive data is encrypted before it ever touches IndexedDB or disk, adhering to strict zero-knowledge security standards.

---

## 1. Objectives & Scope
- Implement native Web Crypto API cryptographic primitives (PBKDF2-HMAC-SHA-256, AES-256-GCM, 100,000 iterations).
- Create `.msvault` authenticated container format specification with integrity verification (IV, Salt, Auth Tag, Versioning, SHA-256 Checksum).
- Implement robust, browser-native IndexedDB encrypted storage layer (`MySafeVault_PrivateVault`) without external bloated dependencies.
- Ensure **zero plaintext leakage**: passwords, secrets, and raw notes are never saved to `localStorage` or unencrypted IndexedDB stores.
- Guarantee full backward compatibility with existing server-side crypto in `apps/web/lib/encryption/index.ts`.

---

## 2. Technical Architecture & File Layout

### A. Web Crypto Client Engine
**Path:** `apps/web/lib/crypto/client-vault-crypto.ts`
- **Key Derivation:** `deriveKeyFromPassphrase(passphrase: string, salt: Uint8Array, iterations = 100000)` using `PBKDF2` + `SHA-256` into a 256-bit `AES-GCM` CryptoKey.
- **Data Encryption:** `encryptWithPassphrase(data: string | Uint8Array, passphrase: string): Promise<EncryptedPackage>`
  - Generates 16-byte cryptographically secure random salt (`crypto.getRandomValues`).
  - Generates 12-byte cryptographically secure random IV (`crypto.getRandomValues`).
  - Encrypts payload with `AES-GCM` (128-bit authentication tag).
  - Returns formatted package with base64 encoded salt, iv, and ciphertext+tag.
- **Data Decryption:** `decryptWithPassphrase(encryptedPackage: EncryptedPackage, passphrase: string): Promise<string>`
  - Validates package structure.
  - Derives key from salt + passphrase.
  - Decrypts with `AES-GCM`; rejects invalid passwords or altered ciphertexts with explicit error `ERR_DECRYPT_FAILED`.
- **Session Memory Guard:** In-memory key caching with configurable session TTL and explicit wipe/zeroize function.

### B. Authenticated `.msvault` Container Specification
**Path:** `apps/web/lib/crypto/msvault-package.ts`
- **File Container Structure:**
  ```json
  {
    "format": "MSVAULT_ENCRYPTED_CONTAINER",
    "version": 1,
    "createdAt": "2026-09-06T10:00:00.000Z",
    "appName": "MySafeVault",
    "appVersion": "1.0.0",
    "kdf": {
      "algorithm": "PBKDF2-HMAC-SHA256",
      "iterations": 100000,
      "salt": "base64..."
    },
    "cipher": {
      "algorithm": "AES-256-GCM",
      "iv": "base64...",
      "tagLength": 128
    },
    "payload": "base64-ciphertext-with-tag",
    "checksum": "sha256-hash-of-ciphertext"
  }
  ```
- **Builder Function:** `buildMsvaultExport(items: VaultItem[], passphrase: string, metadata?: Record<string, any>): Promise<string>`
- **Parser & Verifier:** `parseAndVerifyMsvault(jsonString: string): Promise<MsvaultContainer>`
- **Integrity Validation:** Computes SHA-256 checksum of the ciphertext block before attempting key derivation.

### C. Encrypted Local Storage (IndexedDB)
**Path:** `apps/web/lib/storage/local-vault-store.ts`
- **Database Name:** `MySafeVault_PrivateVault`
- **Object Store:** `encrypted_records`
- **Schema:**
  - `id`: string (Primary Key, UUID)
  - `userId`: string (Indexed for multi-user session isolation)
  - `title`: string (Can be stored or obfuscated)
  - `category`: string (e.g. "password", "document", "note")
  - `isPrivate`: boolean (true)
  - `encryptedPayload`: string (AES-256-GCM ciphertext)
  - `salt`: string
  - `iv`: string
  - `updatedAt`: number
- **Operations:**
  - `initLocalVaultDB(): Promise<IDBDatabase>`
  - `savePrivateItem(userId: string, item: StoredPrivateItem): Promise<void>`
  - `getPrivateItems(userId: string): Promise<StoredPrivateItem[]>`
  - `deletePrivateItem(userId: string, id: string): Promise<void>`
  - `clearPrivateVault(userId: string): Promise<void>`

---

## 3. Verification & Acceptance Criteria
1. **Unit Verification Script:** Run client crypto roundtrip test (encrypt -> tamper test -> decrypt -> verify error on wrong password).
2. **IndexedDB Inspection:** Verify records in browser DevTools Application > IndexedDB show only encrypted ciphertexts and random IVs.
3. **No LocalStorage Leak:** Verify zero secret strings in `localStorage` or `sessionStorage`.
4. **TypeScript Compilation:** Zero errors under `tsc --noEmit`.
