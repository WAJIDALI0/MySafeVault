# MySafeVault — Master Project History & Architecture Reference

> **Purpose of this document:**  
> This file is the single, authoritative source of truth for **MySafeVault**. Any developer, engineer, or AI tool reading this file will immediately understand the complete project context, architectural decisions, cryptographic protocols, completed milestones, file locations, data formats, and how to continue development without missing any details.

---

## 1. Project Overview & Technology Stack

**MySafeVault** is an enterprise-grade, zero-knowledge password manager, secure document vault, and encrypted lock folder built as a modern web application. It combines cloud storage with a local, zero-knowledge **Private Vault / Lock Folder** that encrypts all sensitive items directly in the user's browser before storing them locally in browser IndexedDB or exporting them as encrypted backups.

### Core Technology Stack
- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Lucide React icons, Radix UI primitives
- **Monorepo:** Turborepo, pnpm workspaces (`apps/web`, `packages/*`)
- **Database & Auth:** Prisma ORM, Supabase Auth / PostgreSQL, Edge Middleware
- **Cryptographic Engine:** Native Browser Web Crypto API (`window.crypto.subtle`)
- **Local Storage Layer:** Browser IndexedDB (`MySafeVault_PrivateVault`)
- **API Documentation:** OpenAPI 3.0 / Swagger UI (`/docs`, `apps/web/lib/swagger.ts`)
- **Tooling & Code Quality:** ESLint, Prettier, Husky pre-commit hooks, Commitlint

---

## 2. Zero-Knowledge Cryptographic Architecture

MySafeVault operates under strict **zero-knowledge** security principles: the server never sees, transmits, or stores plaintext passwords, notes, credit cards, or master passphrases.

### Key Derivation & Encryption Parameters
- **KDF Algorithm:** `PBKDF2-HMAC-SHA256`
- **Iterations:** `100,000` rounds
- **Salt:** 16 cryptographically secure random bytes generated via `window.crypto.getRandomValues()`
- **Cipher:** `AES-256-GCM` (Galois/Counter Mode)
- **IV (Initialization Vector):** 12 cryptographically secure random bytes per encryption operation
- **Authentication Tag:** 128-bit authentication tag appended to ciphertext
- **Checksum:** SHA-256 hash computed over the base64 ciphertext for early tampering detection

### `.msvault` Container Specification
Backups and export files are saved using the `.msvault` container format (`MSVAULT_ENCRYPTED_CONTAINER`):

```json
{
  "format": "MSVAULT_ENCRYPTED_CONTAINER",
  "version": 1,
  "createdAt": "2026-09-11T03:00:00.000Z",
  "appName": "MySafeVault",
  "appVersion": "1.0.0",
  "kdf": {
    "algorithm": "PBKDF2-HMAC-SHA256",
    "iterations": 100000,
    "salt": "<base64-encoded-salt>"
  },
  "cipher": {
    "algorithm": "AES-256-GCM",
    "iv": "<base64-encoded-iv>",
    "tagLength": 128
  },
  "payload": "<base64-encoded-ciphertext-and-auth-tag>",
  "checksum": "<sha256-hex-digest-of-payload>",
  "metadata": {
    "itemCount": 12,
    "exportScope": "all",
    "passwordHint": "My favorite pet"
  }
}
```

### In-Memory Key Hygiene & Zeroization
- Symmetric encryption keys (`CryptoKey`) are held purely in transient browser memory while the vault is active.
- Sensitive state is **zeroized** (wiped to `null` and arrays emptied) when:
  1. The user clicks **Lock Now**.
  2. Inactivity timer triggers (configurable: 1m, 5m, 15m, 30m, or immediate).
  3. The browser tab changes visibility (`document.visibilityState === 'hidden'`).
  4. The user logs out or closes the session.

---

## 3. Chronological Project Milestones (Completed Work)

### Phase 1: Project Setup & Monorepo Initialization (Days 1–2)
- Initialized Turborepo structure with pnpm workspaces.
- Configured Next.js 15 App Router, TypeScript, and Tailwind CSS v4.
- Added code formatting, linting, Husky Git pre-commit hooks, and Commitlint rules.
- Set up SEO metadata, OpenGraph tags, `robots.ts`, `sitemap.ts`, and security HTTP response headers.

### Phase 2: Authentication & Security Foundation (Day 3)
- Configured Supabase Auth client & server helpers (`apps/web/lib/supabase/`).
- Designed Prisma database schema with `Profile`, `ActivityLog`, and `UserPreference` models.
- Implemented core security libraries:
  - CSRF protection (`apps/web/lib/security/csrf.ts`)
  - Rate limiting with Redis/in-memory fallback (`apps/web/lib/security/rate-limit.ts`)
  - Server-side AES-256-GCM envelope encryption (`apps/web/lib/encryption/index.ts`)
  - Structured audit logger (`apps/web/lib/logger/`)
- Edge Middleware protection for authenticated routes (`/dashboard`, `/vault`, `/settings`).
- Complete Auth UI: `/login`, `/register`, `/forgot-password`, `/reset-password`.

### Phase 3: Dashboard & App Shell Layout (Day 4)
- Responsive App Shell layout (`apps/web/app/(dashboard)/layout.tsx`).
- Collapsible Desktop & Mobile Sidebar (`features/dashboard/components/sidebar.tsx`).
- Topbar navigation with live Search Bar, User Dropdown Menu, and Notification drawer.
- Dashboard Widget Grid:
  - Security Score Card (calculates password strength, reused credentials).
  - Vault Overview Card (item counts by category).
  - Storage & Recent Activity Widgets.
  - Quick Actions (Add Password, Add Note, Add Card, Quick Export).
- Placeholder routes for `/profile`, `/settings`, `/activity`, and `/search`.

### Phase 4: Cryptographic Engine & Local Encrypted Storage (Plan 1)
- **Web Crypto Library** (`apps/web/lib/crypto/client-vault-crypto.ts`):
  - `deriveKeyFromPassphrase()`: PBKDF2-HMAC-SHA256 key derivation.
  - `encryptWithPassphrase()`: AES-256-GCM with dynamic salt and IV.
  - `decryptWithPassphrase()`: Validates package integrity and decrypts data.
  - `computeSha256Checksum()`: Fast integrity verification before decryption.
- **Container Specification** (`apps/web/lib/crypto/msvault-package.ts`):
  - `buildMsvaultExport()`: Serializes items, calculates checksum, embeds metadata.
  - `parseAndVerifyMsvault()`: Inspects file format, checks checksum, prevents tampering.
- **IndexedDB Encrypted Storage** (`apps/web/lib/storage/local-vault-store.ts`):
  - Database: `MySafeVault_PrivateVault` (version 1).
  - Stores encrypted item blobs locally on the user device.
  - Supports `saveLocalVaultItem()`, `getLocalVaultItem()`, `listLocalVaultItems()`, `deleteLocalVaultItem()`, and `wipeLocalVault()`.

### Phase 5: Encrypted Export & Import Subsystem (Plan 2)
- **Export Dialog** (`apps/web/features/vault/components/export-vault-dialog.tsx`):
  - Scope selection: All Items, Private Vault Items Only, Passwords Only, Documents Only.
  - Passphrase protection with real-time password strength meter and optional password hint.
  - Encrypts client-side into `.msvault` container and triggers browser download.
  - Records export events in the security activity log.
- **Import Dialog** (`apps/web/features/vault/components/import-vault-dialog.tsx`):
  - Drag-and-drop `.msvault` file dropzone with container validation.
  - Passphrase verification modal with hint display.
  - In-memory payload decryption and conflict resolution (Skip duplicates, Overwrite, or Add New).
  - Imports directly into the local encrypted Private Vault or Cloud Vault.

### Phase 6: Mobile Biometric Lock Folder & Private Vault Experience (Plan 3)
- **Private Vault Lock Screen** (`apps/web/features/vault/components/private-vault-lock-screen.tsx`):
  - Visual high-trust security aesthetic with lock indicators and emerald glowing badges.
  - Master Passphrase unlock with rate limiting and clear error feedback.
  - Device platform biometric detection (Windows Hello, Apple Touch ID/Face ID, Android).
  - First-time setup wizard to configure the private vault passcode.
- **Private Vault Main Page** (`apps/web/app/(dashboard)/private-vault/page.tsx`):
  - State-driven rendering: renders lock screen if locked, unlocked explorer if unlocked.
  - Category filters: All, Passwords, Secure Notes, Cards, Private Keys, Identity.
  - Inactivity auto-lock and tab visibility lock monitoring.
  - Lock Now action, Export/Import triggers, and item search.
- **Item Management Dialogs**:
  - `add-vault-item-dialog.tsx`: Creates new encrypted private items.
  - `view-vault-item-dialog.tsx`: Displays decrypted credentials, copy-to-clipboard, edit, and delete.
  - `vault-items-grid.tsx`: Responsive grid with category icons, tags, and quick actions.

### Phase 7: Ecosystem Integration, OpenAPI Swagger & QA (Plan 4)
- **OpenAPI / Swagger 3.0 Documentation** (`apps/web/lib/swagger.ts` & `/docs`):
  - Complete endpoint definitions for Auth, Vault items, Export, Import, and Security endpoints.
  - Interactive Swagger UI for API inspection and testing.
- **Navigation Integration**:
  - "Private Vault" link in Desktop and Mobile Sidebar with lock shield badge.
  - Dashboard integration card displaying local vault status and quick-unlock button.
- **Settings & Security Center**:
  - Auto-lock timeout preferences, local storage usage statistics, and local database wipe controls.

### Phase 8: Dynamic Category Forms & Granular Field Systems (Private Vault)
- **Dynamic Creation / Edit Modal** (`apps/web/features/vault/components/private-vault-item-dialog.tsx`):
  - Category-aware polymorphic forms: selecting a category automatically switches the form to dedicated fields:
    - **Password / Login**: Website URL (with launch action), Username / Email, Password (with generator, show/hide, strength meter), 2FA / TOTP Authenticator Key, Notes.
    - **Secure Note / Recovery Seed**: Subtype selector (Freeform Secret Note, 12/24 Word Crypto Mnemonic Seed Phrase with numbered word chips, API Key with provider/secret/public keys).
    - **Payment Card**: Cardholder Name, auto-formatting card number with spacing (`4532 1234 5678 9012`), auto-detected card network badge (Visa, Mastercard, Amex, Discover), Expiration (MM/YY), CVV/CVC, ATM PIN, Billing Postal Code, Notes.
    - **Digital Identity**: Full Legal Name, Document Type (Passport, Driver's License, National ID Card, SSN / Tax ID, Residence Permit), Document Number with mask/reveal, Issuing Country / State, Dates, Registered Address.
- **Dedicated Category Item Viewer** (`apps/web/features/vault/components/private-vault-item-view-dialog.tsx`):
  - Virtual credit card mockup with chip, contactless icon, masked card number, expiry, CVV/PIN reveal and copy.
  - Numbered mnemonic seed chip grid with 1-click "Copy All Words" action.
  - Digital identity badge with document number reveal.
  - In-place editing and permanent deletion with confirmation.
- **IndexedDB Re-encryption & Update Engine**:
  - Extended `usePrivateVault` with `updatePrivateItem()` for zero-knowledge updates directly to browser IndexedDB.

### Phase 9: Dashboard Visual Polish & Full Multi-Device Responsiveness
- **Eliminated Dashboard Scrollbars & Text Clipping**:
  - `SecurityScoreCard`: Removed native Windows scrollbar by replacing cramped side-by-side list with a clean, responsive recommendation summary and clear score indicator.
  - `StorageCard`: Fixed awkward "Manage Storage" line-breaking; fixed "315.67 KB" font truncation; converted 4 squeezed columns into 2 spacious columns to eliminate "DocumentsImages" text collision.
  - `RecentActivityCard`: Replaced raw action labels (`vault_unlocked`) with human-friendly audit labels ("Unlocked Private Vault", "Exported Encrypted Backup", etc.).
  - `PrivateVaultStatusCard`: Replaced overflowing labels with clean "Offline Storage" and "AES-256-GCM" badges that fit every viewport.
- **Full-Device Responsiveness (Mobile, Tablet, Desktop)**:
  - **Single Unified Mobile Header**: Removed the duplicate static mobile header. Unified into a single topbar containing Hamburger Menu, Logo, Search Trigger, Quick Add, Notifications, and User Avatar.
  - **Slide-out Navigation Drawer**: Mobile sidebar slides smoothly over content with full navigation, PWA Install button, and Pro upgrade banner.
  - **Responsive Command Palette Search**: Added mobile search icon button to topbar so mobile users can trigger the full-vault Cmd+K search dialog with one tap.
  - **Adaptive Dashboard Grid**: Optimized layout to 1 column on mobile, 2 columns on tablet, and 3 columns on desktop.

---

## 4. Key Directory & File Layout

```text
MySafeVault/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── (auth)/                  # Auth route group (login, register, reset)
│       │   ├── (dashboard)/             # Main dashboard route group
│       │   │   ├── activity/            # Audit and security activity logs
│       │   │   ├── dashboard/           # Main user overview with widget grid
│       │   │   ├── private-vault/       # Zero-knowledge Lock Folder page
│       │   │   │   └── page.tsx         # Private vault lock screen & unlocked explorer
│       │   │   ├── profile/             # User profile management
│       │   │   ├── search/              # Global search page
│       │   │   ├── settings/            # Security preferences & auto-lock config
│       │   │   ├── vault/               # Cloud vault management
│       │   │   └── layout.tsx           # Dashboard app shell (sidebar + topbar)
│       │   ├── api/                     # Next.js route handlers
│       │   │   ├── auth/                # Supabase / WebAuthn API endpoints
│       │   │   └── vault/               # Vault CRUD, export, and import endpoints
│       │   ├── docs/                    # OpenAPI / Swagger UI page
│       │   └── layout.tsx               # Root application layout & font setup
│       ├── features/
│       │   ├── auth/                    # Auth forms, hooks, and validators
│       │   ├── dashboard/               # Sidebar, topbar, search, and widget cards
│       │   └── vault/
│       │       ├── components/
│       │       │   ├── add-vault-item-dialog.tsx       # New item modal
│       │       │   ├── export-vault-dialog.tsx         # Encrypted .msvault export
│       │       │   ├── import-vault-dialog.tsx         # Decrypt & restore modal
│       │       │   ├── private-vault-lock-screen.tsx   # PIN & biometric unlock UI
│       │       │   ├── vault-items-grid.tsx            # Item card list layout
│       │       │   ├── vault-page-client.tsx           # Cloud vault client controller
│       │       │   └── view-vault-item-dialog.tsx      # Item details & decrypt viewer
│       │       └── hooks/
│       │           └── use-private-vault.ts            # State & memory guard hook
│       └── lib/
│           ├── crypto/
│           │   ├── client-vault-crypto.ts  # Web Crypto API engine (PBKDF2/AES-GCM)
│           │   └── msvault-package.ts      # .msvault container serialization
│           ├── storage/
│           │   └── local-vault-store.ts    # Browser IndexedDB encrypted store
│           ├── encryption/                 # Server-side AES-256 envelope crypto
│           ├── security/                   # CSRF, rate limiter, headers
│           ├── supabase/                   # Supabase database & auth clients
│           └── swagger.ts                  # OpenAPI 3.0 specification definition
├── docs/
│   ├── ARCHITECTURE.md                  # High-level architecture notes
│   ├── AUTH_FLOW.md                     # Authentication flow diagrams
│   ├── FEATURES.md                      # Complete features checklist
│   ├── PROJECT_HISTORY.md               # [THIS FILE] Master historical reference
│   ├── plan-1-crypto-storage.md         # Plan 1: Web Crypto & IndexedDB spec
│   ├── plan-2-export-import.md          # Plan 2: Export/Import .msvault spec
│   ├── plan-3-private-vault-biometrics.md # Plan 3: Lock screen & memory guard spec
│   └── plan-4-integration-swagger-qa.md # Plan 4: Dashboard, Swagger & QA spec
├── CHANGELOG.md                         # Release history by version
├── package.json                         # Root monorepo dependencies & scripts
├── pnpm-workspace.yaml                  # pnpm workspace configuration
└── turbo.json                           # Turborepo task pipeline
```

---

## 5. Data Interfaces & Schemas

### A. EncryptedPackage (Web Crypto output)
```typescript
interface EncryptedPackage {
  salt: string;       // Base64 encoded 16-byte random salt
  iv: string;         // Base64 encoded 12-byte random IV
  ciphertext: string; // Base64 encoded ciphertext + 128-bit tag
  algorithm: 'AES-256-GCM';
  iterations: number; // 100000
}
```

### B. VaultItem (Decrypted representation in transient memory)
```typescript
interface VaultItem {
  id: string;
  title: string;
  category: 'login' | 'note' | 'card' | 'key' | 'identity';
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  customFields?: Array<{ label: string; value: string; isSecret: boolean }>;
  tags?: string[];
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### C. Local Encrypted Item (Stored in IndexedDB)
```typescript
interface LocalEncryptedVaultItem {
  id: string;
  encryptedBlob: string;  // JSON stringified EncryptedPackage
  category: string;
  updatedAt: string;
}
```

---

## 6. How to Run, Test, and Develop

### Environment Setup
1. Copy `.env.example` to `.env.local` in `apps/web/`:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```
2. Required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase server-side administrative key
   - `DATABASE_URL`: PostgreSQL connection string for Prisma ORM
   - `APP_ENCRYPTION_KEY`: 32-byte hex key for server-side encryption

### Running the Development Server
From the root directory:
```bash
# Install dependencies
pnpm install

# Start development server across workspace (HTTP)
pnpm dev

# Start development server with HTTPS (Required for Mobile Fingerprint & WebCrypto)
pnpm dev:https
```
The application will be accessible at:
- **Web App:** `http://localhost:3000` or `https://localhost:3000`
- **Mobile LAN Access:** `https://192.168.100.6:3000` *(Note: Android/iOS Chrome require HTTPS to enable device biometrics and `crypto.subtle`)*
- **Dashboard:** `http://localhost:3000/dashboard`
- **Private Vault / Lock Folder:** `http://localhost:3000/private-vault`
- **API Swagger Documentation:** `http://localhost:3000/docs`

---

## 7. Phase 10: Mobile Responsiveness & Platform Biometrics Architecture

### Why Mobile Browsers Blocked Fingerprint & Crypto over LAN HTTP:
When testing on a physical smartphone (Android or iPhone) over local Wi-Fi (`http://192.168.100.6:3000`), the browser engine (Blink/WebKit) classifies raw LAN IPs over unencrypted HTTP as **Insecure Contexts** (`window.isSecureContext === false`).
Under strict W3C security standards:
1. `window.crypto.subtle` is intentionally stripped/disabled to prevent plaintext packet sniffing attacks.
2. `navigator.credentials` (WebAuthn / Passkeys / Fingerprint biometrics) throws `SecurityError: The operation is not allowed in an insecure context`.

### Complete Solution:
1. **Next.js Experimental HTTPS:**
   Added `"dev:https": "next dev --turbo -H 0.0.0.0 --experimental-https"` script to `package.json`. Next.js automatically provisions local development TLS certificates, serving `https://192.168.100.6:3000`. Once loaded via HTTPS, mobile browsers treat the origin as a Secure Context, fully unlocking:
   - Platform Biometric Fingerprint authentication.
   - Hardware-accelerated AES-256-GCM and PBKDF2 WebCrypto APIs.
2. **Dynamic Insecure Context Detection & Guard:**
   Updated `PrivateVaultLockScreen` to detect when running in an insecure context and present clear instructions rather than a confusing crash.
3. **Mobile Layout & Component Responsiveness:**
   - Fixed landing page navbar padding (`px-3 sm:px-6`) and button sizing to eliminate horizontal viewport overflow.
   - Fixed `VaultOverviewCard` 2-column mobile layout to prevent stat labels ("Passwords", "Documents", "Secure Notes") from truncating to "Passwor" / "Docume".
   - Fixed `StorageCard` breakdown pills to prevent label clipping on 360px–390px mobile screens.
   - Refined floating AI assistant button to `w-12 h-12` on mobile positioned at `bottom-4 right-4` with responsive modal width `w-[calc(100vw-2rem)]` so it never overlaps forms or clips screen edges.


---

## 8. Phase 11: Platform Biometrics & Zero-Knowledge Passcode Recovery via Fingerprint

### The Issue ("Biometric verification was cancelled" on Android Phone):
When testing on a physical smartphone at `https://192.168.100.6:3001`, tapping **Unlock with Platform Biometrics** instantly triggered the red error: `"Biometric verification was cancelled."` without prompting the device fingerprint sensor.

**Root Causes:**
1. **W3C RFC 1034 Domain Restriction:** The WebAuthn specification strictly stipulates that `rpId` must be a valid domain string (e.g. `localhost` or `vault.domain.com`), and **MUST NOT** be an IPv4 or IPv6 address. Passing `rpId: "192.168.100.6"` caused Chromium on Android to immediately reject the call with `NotAllowedError` before ever contacting the Android BiometricPrompt framework.
2. **Missing Initial Registration:** On mobile, calling `navigator.credentials.get` without an existing enrolled credential throws `NotAllowedError`.
3. **Misleading Error Trapping:** Catching all `NotAllowedError` instances and reporting `"Biometric verification was cancelled"` obscured the technical IP domain limitation.

### The Complete Professional Setup:
1. **Intelligent IP / Domain Detection (`isIpAddress`):**
   - Automatically detects whether the web app is accessed via an IP address (`192.168.100.6`) or a hostname (`localhost` / domain).
   - Dynamically omits `rpId` and `rp.id` when on raw IPs, preventing Chromium RFC 1034 validation errors.
2. **Automatic Biometric Enrollment:**
   - If no biometric credential is registered on the device, the system automatically triggers `navigator.credentials.create` on the first biometric interaction, invoking the native Android/iOS biometric enrollment ceremony.
3. **Hardware Session Escrow for LAN Development:**
   - If Android Chrome's security policy restricts hardware WebAuthn on self-signed LAN IP addresses, the system gracefully falls back to the hardware-bound session key (`msv_pv_bio_cached_key`) established during master passcode verification, enabling seamless 1-touch unlock on local development phones.
4. **Master Passcode Reset with Fingerprint (`resetPasscodeWithBiometrics`):**
   - **Zero-Knowledge Data Integrity:** Items in IndexedDB are encrypted with AES-256-GCM. When the user forgets their master passcode, they can authorize a reset using their device fingerprint sensor.
   - **Seamless Re-encryption Pipeline:**
     1. Biometric sensor hardware challenge verifies user identity.
     2. All encrypted items in IndexedDB are decrypted with the hardware-bound escrow key.
     3. All items are immediately re-encrypted with the user's **New Master Passcode**.
     4. `msv_pv_hash` verification payload and recovery escrow are refreshed with the new passcode.
     5. Vault unlocks immediately with zero data loss.
5. **Emergency 16-Character Recovery Key (`MSV-XXXX-XXXX-XXXX-XXXX`):**
   - Cryptographically generated using Crockford Base32 (`generateRecoveryKey`) during vault creation.
   - Re-encrypts the master passcode in AES-256 escrow (`msv_pv_recovery_escrow`).
   - Accessible and copyable from a new "Recovery Key" button in the private vault top bar.
   - Can be used in the Reset dialog tab if fingerprint hardware is unavailable.
6. **Luxury Biometric UI & Scanner Design:**
   - Enhanced `PrivateVaultLockScreen` with an emerald glowing scanner card button, pulse animation, and subtext.
   - Added `"Forgot Passcode? Reset with Fingerprint"` trigger button.
   - Modal dialog with 3 recovery tabs: **Fingerprint**, **Recovery Key**, and **Emergency Re-initialization**.

---

## 9. Future Roadmap & Extensibility Guide

Any developer or AI agent continuing work on MySafeVault can refer to these planned extensions:

1. **WebAuthn Biometric Passkey Registration for Private Vault:**
   - Integrate with device biometric prompt via `@simplewebauthn/browser` for one-touch unlock instead of passcode entry.
2. **Encrypted Cloud Sync for Private Vault Blobs:**
   - Allow optional, zero-knowledge synchronization of the encrypted blobs across devices where the server only ever receives ciphertext.
3. **Hardware Security Key Support:**
   - Add FIDO2 / YubiKey unlock for the Private Vault container.
4. **Browser Extension Companion:**
   - Connect the web application with a Manifest V3 browser extension via secure WebSockets or native messaging to auto-fill credentials.
5. **Breach Monitoring & HaveIBeenPwned API Integration:**
   - Use k-anonymity SHA-1 prefix queries to check if saved passwords appear in public data breaches without leaking passwords to third parties.

---
*Last updated: September 2026 — Antigravity Assistant & MySafeVault Engineering Team*

