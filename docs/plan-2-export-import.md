# Plan 2: Encrypted Export, Backup & Secure Import System

## Executive Overview
Deliver a world-class encrypted export and import workflow for MySafeVault. Allow users to export their cloud vault, private vault, or selected categories into an encrypted, tamper-evident `.msvault` file with user-defined passphrases, and safely import items back with visual decrypt previews, conflict detection, and audit logging.

---

## 1. Objectives & Scope
- Design and implement `ExportVaultDialog` with password strength evaluation, scope selector (All, Private Vault Only, Passwords Only, Documents Only), and optional hint.
- Deliver `.msvault` download stream with SHA-256 integrity validation and formatted export metadata.
- Design and implement `ImportVaultDialog` with file dropzone, passphrase unlock prompt, visual item preview with conflict markers (Duplicate, Overwrite, Add New).
- Add server-side export/import actions for cloud items while delegating all encryption/decryption strictly to the client.
- Security enforcement: Prevent unencrypted JSON or plain CSV/TXT downloads without explicit danger warnings.

---

## 2. Technical Architecture & File Layout

### A. Export Dialog Component
**Path:** `apps/web/features/vault/components/export-vault-dialog.tsx`
- **Trigger:** Accessible from Vault header, Private Vault view, and Settings > Data Management.
- **UI State Machine:**
  1. *Scope Selection:* Choose items to export (Cloud items, Private Vault items, or specific tags/categories).
  2. *Password Protection:* Mandatory export passphrase input with real-time strength meter, confirm password input, and optional password hint.
  3. *Encryption & Package Generation:* Client executes `buildMsvaultExport()`, encodes into `.msvault` blob.
  4. *Download Trigger:* Generates sanitized filename `mysafevault-backup-[YYYY-MM-DD-HHmm].msvault`.
  5. *Audit Log:* Records `VAULT_EXPORTED` event in security activity log.

### B. Import & Restore Dialog Component
**Path:** `apps/web/features/vault/components/import-vault-dialog.tsx`
- **UI State Machine:**
  1. *File Upload:* Drag-and-drop `.msvault` or click to browse. Checks file extension and magic header `MSVAULT_ENCRYPTED_CONTAINER`.
  2. *Passphrase Unlock:* Asks for container password (displays hint if embedded in container header).
  3. *Integrity Check & In-Memory Decryption:* Verifies container checksum, decrypts payload in memory without saving to disk.
  4. *Item Preview & Conflict Resolution:*
     - Displays item list (Title, Type, Last Modified).
     - Compares against existing items: flags duplicates or items with matching titles.
     - Lets user pick: "Import All", "Skip Duplicates", or "Overwrite Existing".
  5. *Destination Target:* Option to import into Cloud Vault or directly into Private Vault / Lock Folder.
  6. *Success & Completion:* Notifies user of total imported items and triggers refresh.

### C. Server Actions & Services
**Path:** `apps/web/features/vault/actions/vault-export-import.actions.ts`
- `fetchVaultItemsForExport()`: Fetches user's cloud items in structured format ready for client-side encryption.
- `restoreImportedVaultItems(items: SanitizedVaultItem[], target: 'cloud' | 'private')`: Batch creates imported records with proper validation and audit logging.

---

## 3. Verification & Acceptance Criteria
1. **Export Flow:** Generate `.msvault` file, verify in text editor that contents are purely encrypted ciphertext and parameters.
2. **Corrupted File Test:** Alter a byte in `.msvault` and attempt import — verify clean failure with "File integrity check failed or corrupted".
3. **Wrong Password Test:** Provide incorrect password — verify clean UI feedback "Incorrect passphrase. Unable to decrypt vault container."
4. **End-to-End Roundtrip:** Export 5 items -> delete 1 item -> import `.msvault` -> verify item is restored accurately with intact credentials.
