<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg" width="90" height="90" alt="MySafeVault Shield Logo" />
  <h1>🛡️ MySafeVault</h1>
  <p><strong>Next-Generation Zero-Knowledge Digital Life Vault & Password Ecosystem</strong></p>
  <p><em>Enterprise-grade privacy, W3C WebAuthn Face ID & Fingerprint biometrics, client-side AES-256-GCM encryption, and seamless offline-first IndexedDB storage.</em></p>

  <p>
    <a href="https://github.com/WAJIDALI0/MySafeVault"><img alt="GitHub Repo" src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" /></a>
    <a href="https://nextjs.org"><img alt="Next.js 15" src="https://img.shields.io/badge/Next.js%2015-App%20Router-000000?style=for-the-badge&logo=nextdotjs" /></a>
    <a href="https://www.typescriptlang.org"><img alt="TypeScript 5" src="https://img.shields.io/badge/TypeScript%205-Strict-3178C6?style=for-the-badge&logo=typescript" /></a>
    <a href="https://tailwindcss.com"><img alt="Tailwind CSS v4" src="https://img.shields.io/badge/Tailwind_CSS%20v4-Dark_Theme-38B2AC?style=for-the-badge&logo=tailwindcss" /></a>
    <a href="https://turbo.build"><img alt="Turborepo" src="https://img.shields.io/badge/Turborepo-Monorepo-EF4444?style=for-the-badge&logo=turborepo" /></a>
    <a href="https://www.w3.org/TR/webauthn-2/"><img alt="WebAuthn" src="https://img.shields.io/badge/WebAuthn-Biometrics%20FIDO2-4285F4?style=for-the-badge" /></a>
    <a href="https://www.prisma.io"><img alt="Prisma" src="https://img.shields.io/badge/Prisma%20ORM-PostgreSQL-2D3748?style=for-the-badge&logo=prisma" /></a>
  </p>
</div>

<br/>

---

## 📑 Table of Contents
1. [Executive Summary & Core Innovations](#-executive-summary--core-innovations)
2. [System Architecture & Visual Flowcharts](#-system-architecture--visual-flowcharts)
   - [High-Level Topology](#high-level-topology)
   - [Zero-Knowledge Client-Side Cryptographic Pipeline](#zero-knowledge-client-side-cryptographic-pipeline)
   - [W3C WebAuthn Biometric & Passcode Recovery Lifecycle](#w3c-webauthn-biometric--passcode-recovery-lifecycle)
3. [Exhaustive File & Folder Structure](#-exhaustive-file--folder-structure)
4. [Cryptographic Security Standards](#-cryptographic-security-standards)
5. [Key Feature Highlights](#-key-feature-highlights)
6. [Developer Quickstart & Local Setup](#-developer-quickstart--local-setup)
   - [Prerequisites](#prerequisites)
   - [Step-by-Step Installation](#step-by-step-installation)
   - [Running HTTPS for Physical Mobile Phone Biometrics](#running-https-for-physical-mobile-phone-biometrics)
7. [API Documentation (Swagger OpenAPI 3.0)](#-api-documentation-swagger-openapi-30)
8. [Testing, Quality Assurance & Build Verification](#-testing-quality-assurance--build-verification)
9. [License & Acknowledgments](#-license--acknowledgments)

---

## 🌟 Executive Summary & Core Innovations

**MySafeVault** was engineered to eliminate the fundamental tradeoff between extreme privacy and modern consumer convenience. Unlike conventional cloud vaults where data is encrypted on servers or vulnerable to server breaches, MySafeVault operates under a **strict Zero-Knowledge protocol**:

* **Zero-Knowledge Architecture:** Cryptographic keys are generated client-side from master passcodes using **PBKDF2-HMAC-SHA256 (100,000 iterations)**. Data encryption utilizes **AES-256-GCM** with fresh cryptographic initialization vectors (IV) and cryptographic salts for every item.
* **Dual Biometric Authentication:** Implements the W3C WebAuthn Level 2/3 standard to enable native hardware-level authentication via **Face ID**, **Android Face Unlock**, **Windows Hello Face**, and **Fingerprint / Touch ID**.
* **Zero-Knowledge Passcode Recovery:** If a user forgets their master passcode, they can reset it through three cryptographic pathways without data loss:
  1. *Biometric Hardware Challenge:* Verifies face or fingerprint, decrypts local records with hardware-escrowed keys, and re-encrypts all items under the new passcode.
  2. *16-Character Emergency Recovery Key:* Generates a safe Crockford-Base32 key (`MSV-XXXX-XXXX-XXXX-XXXX`) protecting an encrypted AES escrow capsule.
  3. *Emergency Vault Re-initialization:* Clean local re-initialization if all access factors are permanently lost.
* **Offline-First IndexedDB Engine:** A completely private offline container that persists encrypted payloads in the browser's IndexedDB. Sensitive unencrypted payloads only exist in volatile RAM and lock automatically upon tab-switch or inactivity.
* **Encrypted Container Export/Import (`.msvault`):** Portable AES-256 backup package allowing safe offline migration between browsers and machines.

---

## 🏗️ System Architecture & Visual Flowcharts

### High-Level Topology

```mermaid
graph TB
    subgraph ClientLayer["🖥️ Client Browser Layer (Mobile & Desktop)"]
        UI["React 19 / Next.js 15 UI (Tailwind v4)"]
        WebCrypto["Web Crypto API (SubtleCrypto)"]
        WebAuthn["W3C WebAuthn Platform Biometrics (Face ID / Fingerprint)"]
        LocalStore["IndexedDB Encrypted Store (Offline Private Vault)"]
    end

    subgraph ServerLayer["⚙️ Next.js Server & Edge Layer"]
        ServerActions["Secure Server Actions"]
        APIRoutes["REST API & Swagger Engine (/api/docs)"]
        AuthMiddleware["Supabase Auth Middleware"]
    end

    subgraph StorageLayer["🗄️ Database & Cloud Infrastructure"]
        Postgres[(PostgreSQL Database via Prisma ORM)]
        Supabase[(Supabase Cloud Auth & Session Engine)]
    end

    UI --> WebCrypto
    UI --> WebAuthn
    UI --> LocalStore
    UI -->|HTTPS / WSS| ServerActions
    UI -->|HTTPS REST| APIRoutes
    ServerActions --> AuthMiddleware
    ServerActions --> Postgres
    AuthMiddleware --> Supabase
```

---

### Zero-Knowledge Client-Side Cryptographic Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Vault Owner
    participant Browser as 🌐 Client Browser (RAM)
    participant SubtleCrypto as 🛡️ Web Crypto API (SubtleCrypto)
    participant IndexedDB as 💾 Local IndexedDB

    User->>Browser: Enters Master Passcode / Scan Biometric
    Browser->>SubtleCrypto: Import raw password bytes (PBKDF2)
    SubtleCrypto->>SubtleCrypto: Derive AES-GCM 256-bit Key (100,000 iterations, SHA-256)
    Note over SubtleCrypto: Key marked non-extractable in memory
    
    User->>Browser: Add/Edit Sensitive Record (Card, Password, Document)
    Browser->>SubtleCrypto: Encrypt JSON payload with AES-256-GCM (12-byte random IV)
    SubtleCrypto-->>Browser: Returns Ciphertext + 16-byte Auth Tag + Salt
    Browser->>IndexedDB: Persist StoredEncryptedItem (Zero-Knowledge)
    Note over IndexedDB: Database stores ONLY ciphertext. Server never sees plaintext!
```

---

### W3C WebAuthn Biometric & Passcode Recovery Lifecycle

```mermaid
stateDiagram-v2
    [*] --> LockedVault: App Initialized / Inactivity Auto-Lock

    state LockedVault {
        [*] --> PromptBiometrics
        PromptBiometrics --> PlatformBiometrics: Tap "Unlock with Face ID / Fingerprint"
        PromptBiometrics --> PasscodeEntry: Enter Master Passcode
        PromptBiometrics --> ResetTrigger: Forgot Passcode?
    }

    PlatformBiometrics --> HardwareChallenge: WebAuthn Assertion
    HardwareChallenge --> UnlockedVault: Face / Fingerprint Verified
    PasscodeEntry --> UnlockedVault: Correct Passcode (Hash Verified)

    state ResetTrigger {
        [*] --> SelectResetPathway
        SelectResetPathway --> BiometricReset: Option 1 - Scan Face / Fingerprint
        SelectResetPathway --> RecoveryKeyReset: Option 2 - Enter MSV-XXXX-XXXX Key
        SelectResetPathway --> EmergencyWipe: Option 3 - Vault Wipe

        BiometricReset --> ReEncryptPipeline: Device Biometrics Approved
        RecoveryKeyReset --> ReEncryptPipeline: Escrow Decryption Approved
        ReEncryptPipeline --> UnlockedVault: All Items Re-Encrypted with New Passcode!
    }

    UnlockedVault --> [*]: User Locks / Inactivity / Tab Hidden
```

---

## 📂 Exhaustive File & Folder Structure

This repository follows a strict monorepo architecture with clean domain-driven feature boundaries:

```text
d:\MYinterProject\MySafeVault\
├── .editorconfig                          # Global whitespace, charset & indent standards
├── .env.example                           # Canonical environment variable template
├── .eslintrc.json                         # Monorepo static analysis & lint configurations
├── .gitignore                             # Ignores dependencies, .env, build output & certificates
├── .lintstagedrc                          # Pre-commit automated formatting & lint orchestrator
├── .prettierrc                            # Code formatting rules (quotes, trailing commas, width)
├── CHANGELOG.md                           # Version release logs and migration notices
├── commitlint.config.js                   # Conventional commit message validation
├── package.json                           # Root monorepo workspace dependencies & script registry
├── pnpm-lock.yaml                         # Deterministic dependency resolution tree
├── pnpm-workspace.yaml                    # Turborepo workspace topology definition
├── README.md                              # This competition-grade documentation guide
├── turbo.json                             # Turborepo pipeline caching rules & build stages
│
├── .husky/                                # Git Hooks Engine
│   ├── commit-msg                         # Enforces conventional commit standards
│   └── pre-commit                         # Runs lint-staged & typecheck before push
│
├── apps/                                  # Applications Directory
│   └── web/                               # Main Next.js 15 Web Application
│       ├── .env.example                   # Application-specific environment specification
│       ├── components.json                # shadcn/ui design system configuration
│       ├── middleware.ts                  # Route protection, secure headers & auth routing
│       ├── next.config.ts                 # Next.js compiler, Turbopack, CSP & HTTPS headers
│       ├── package.json                   # Web application manifest and dependencies
│       ├── postcss.config.mjs             # PostCSS plugins for Tailwind CSS v4 processing
│       ├── tsconfig.json                  # TypeScript compiler settings & path alias maps (@/*)
│       │
│       ├── app/                           # Next.js 15 App Router Architecture
│       │   ├── globals.css                # Tailwind CSS v4 design tokens, theme vars & animations
│       │   ├── layout.tsx                 # Root layout with ThemeProvider, fonts & toaster
│       │   ├── page.tsx                   # High-converting marketing landing page
│       │   │
│       │   ├── (auth)/                    # Authentication Route Group
│       │   │   ├── layout.tsx             # Centered auth container layout with luxury backdrop
│       │   │   ├── login/page.tsx         # User login form with email, password & magic link
│       │   │   ├── register/page.tsx      # Account creation form with password strength gauge
│       │   │   ├── forgot-password/page.tsx # Password recovery initiation
│       │   │   └── reset-password/page.tsx  # Secure token password update page
│       │   │
│       │   ├── (dashboard)/               # Protected Dashboard Application Group
│       │   │   ├── layout.tsx             # Dashboard shell (Sidebar, Topbar, AI Assistant)
│       │   │   │
│       │   │   ├── dashboard/             # Main Overview Dashboard
│       │   │   │   └── page.tsx           # Bento grid with security score, storage & shortcuts
│       │   │   │
│       │   │   ├── vault/                 # Cloud-Synchronized Vault
│       │   │   │   └── page.tsx           # Search, category filter & cloud item management
│       │   │   │
│       │   │   ├── private-vault/         # Zero-Knowledge Offline Private Vault
│       │   │   │   └── page.tsx           # IndexedDB container, lock screen & recovery drawer
│       │   │   │
│       │   │   ├── trash/                 # Soft-Delete Recycle Bin
│       │   │   │   └── page.tsx           # Item restoration & permanent cryptographic purge
│       │   │   │
│       │   │   └── settings/              # Settings & Preferences
│       │   │       ├── page.tsx           # General account preferences
│       │   │       └── security/page.tsx  # Biometrics, 2FA, session manager & master password
│       │   │
│       │   └── api/                       # Backend REST & Documentation Endpoints
│       │       ├── auth/                  # Authentication handler endpoints
│       │       ├── vault/
│       │       │   ├── export/route.ts    # Secure export endpoint generating .msvault package
│       │       │   └── import/route.ts    # Safe import endpoint validating & unpacking .msvault
│       │       └── docs/route.ts          # OpenAPI 3.0 / Swagger JSON specifications
│       │
│       ├── features/                      # Domain-Driven Feature Modules
│       │   ├── auth/                      # Authentication Domain
│       │   │   └── components/
│       │   │       ├── auth-layout.tsx    # Branded authentication visual shell
│       │   │       └── social-auth.tsx    # OAuth provider buttons (Google, GitHub)
│       │   │
│       │   ├── dashboard/                 # Analytics & Dashboard Domain
│       │   │   └── components/
│       │   │       ├── cards/
│       │   │       │   ├── private-vault-card.tsx      # Private Vault status & quick-unlock card
│       │   │       │   ├── quick-actions-card.tsx      # Quick item generation & tool triggers
│       │   │       │   ├── recent-activity-card.tsx    # Live audit event log
│       │   │       │   ├── security-insights-card.tsx  # Breach alerts & password vulnerability
│       │   │       │   ├── security-recommendations-card.tsx # Actionable security advice
│       │   │       │   ├── security-score-card.tsx     # Donut chart calculating security index
│       │   │       │   ├── storage-card.tsx            # Fluid quota meter & 2x2 category pills
│       │   │       │   ├── upcoming-expirations-card.tsx # Expiring cards, documents & IDs
│       │   │       │   └── vault-overview-card.tsx     # 2-column mobile-responsive stat metrics
│       │   │       ├── chat/
│       │   │       │   └── security-assistant.tsx      # Floating AI security advisor & chat drawer
│       │   │       ├── shared/
│       │   │       │   └── install-app-button.tsx      # Progressive Web App (PWA) install button
│       │   │       ├── sidebar/
│       │   │       │   ├── mobile-sidebar.tsx          # Touch-optimized slide-over navigation
│       │   │       │   └── sidebar.tsx                 # Desktop collapsible navigation rail
│       │   │       ├── topbar/
│       │   │       │   ├── mobile-menu-trigger.tsx     # Hamburger button for mobile devices
│       │   │       │   ├── quick-add.tsx               # Global '+' button with popover options
│       │   │       │   ├── search-bar.tsx              # Universal debounced search input
│       │   │       │   └── topbar.tsx                  # Top header bar with profile & theme toggle
│       │   │       └── widgets/
│       │   │           ├── dashboard-grid.tsx          # Responsive grid container
│       │   │           └── widget-error-boundary.tsx   # Granular error isolation wrapper
│       │   │
│       │   ├── landing/                   # Public Presentation & Marketing Domain
│       │   │   └── components/
│       │   │       ├── features-section.tsx # Interactive feature walkthrough grid
│       │   │       ├── footer.tsx           # Footer with links, status & compliance badges
│       │   │       ├── hero-section.tsx     # Animated headline, dynamic mockup & primary CTA
│       │   │       └── navbar.tsx           # Glassmorphic navigation with mobile menu
│       │   │
│       │   ├── settings/                  # User Settings Domain
│       │   │   └── components/
│       │   │       ├── change-password-dialog.tsx       # Master password update dialog
│       │   │       └── private-vault-security-card.tsx  # Biometric enrollment & auto-lock config
│       │   │
│       │   └── vault/                     # Core Vault Cryptography & CRUD Domain
│       │       ├── actions/
│       │       │   ├── vault-export-import.actions.ts   # Server action handling package streaming
│       │       │   └── vault-items.actions.ts           # Cloud vault database mutations
│       │       ├── components/
│       │       │   ├── add-vault-item-dialog.tsx        # Multi-tab modal for cloud items
│       │       │   ├── export-vault-dialog.tsx          # Passphrase-protected export modal
│       │       │   ├── import-vault-dialog.tsx          # Backup file selector & import preview
│       │       │   ├── private-vault-item-dialog.tsx    # Category-specific forms (Password/Card/Note/ID)
│       │       │   ├── private-vault-item-view-dialog.tsx # Decrypted item inspector & copy triggers
│       │       │   ├── private-vault-lock-screen.tsx    # Luxury Face ID/Fingerprint lock screen
│       │       │   ├── reset-passcode-dialog.tsx        # 3-way zero-knowledge passcode recovery
│       │       │   ├── vault-items-grid.tsx             # Responsive item grid with reveal toggles
│       │       │   ├── vault-page-client.tsx            # Vault state manager & active filter view
│       │       │   └── view-vault-item-dialog.tsx       # Cloud item detail inspector
│       │       └── hooks/
│       │           ├── use-private-vault.ts             # Zero-knowledge hook (IndexedDB + WebCrypto)
│       │           └── use-vault-items.ts               # Cloud items query & state synchronization
│       │
│       ├── lib/                           # Core Utilities, Cryptography & Platform Services
│       │   ├── crypto/
│       │   │   ├── client-vault-crypto.ts # PBKDF2-SHA256, AES-256-GCM, Crockford-Base32 generator
│       │   │   └── msvault-package.ts     # Format specification & packaging for .msvault files
│       │   ├── services/
│       │   │   ├── audit.service.ts       # Security event logging
│       │   │   └── profile.service.ts     # User metadata & quota calculation
│       │   ├── storage/
│       │   │   └── local-vault-store.ts   # IndexedDB transactional schema wrapper
│       │   ├── prisma.ts                  # Global Prisma client singleton instance
│       │   ├── swagger.ts                 # Swagger UI & OpenAPI 3.0 specification provider
│       │   └── supabase/                  # Supabase auth & edge storage client helpers
│       │
│       ├── prisma/                        # Database Schema & Migrations
│       │   └── schema.prisma              # PostgreSQL model schemas (Users, Items, Audits, Quotas)
│       │
│       └── public/                        # Static Assets & Progressive Web App Manifests
│           ├── favicon.ico                # Browser tab icon
│           ├── manifest.json              # PWA manifest (app name, icons, standalone display)
│           └── icons/                     # Device icon resolutions for iOS & Android
│
├── packages/                              # Shared Workspace Packages
│   ├── types/                             # Canonical TypeScript DTOs & Domain Models
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/index.ts
│   ├── ui/                                # Reusable UI Component Library (shadcn/ui primitives)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       └── badge.tsx
│   └── utils/                             # Shared Mathematical & Formatting Utilities
│       ├── package.json
│       ├── tsconfig.json
│       └── src/index.ts
│
└── docs/                                  # Architectural & Implementation Blueprints
    ├── PROJECT_HISTORY.md                 # Chronological log of all 11 development phases
    ├── plan-1-crypto-storage.md           # Zero-Knowledge & IndexedDB engineering spec
    ├── plan-2-export-import.md            # Encrypted .msvault package format spec
    ├── plan-3-private-vault-biometrics.md # W3C WebAuthn & biometric integration plan
    └── plan-4-integration-swagger-qa.md   # Swagger OpenAPI & QA test matrix
```

---

## 🔒 Cryptographic Security Standards

MySafeVault complies with modern cryptographic standards formulated by NIST and W3C:

| Component | Standard / Algorithm | Configuration | Security Benefit |
| :--- | :--- | :--- | :--- |
| **Key Derivation (KDF)** | PBKDF2-HMAC-SHA256 | 100,000 Iterations, 128-bit Salt | Immune to GPU-accelerated dictionary and rainbow table attacks. |
| **Data Encryption** | AES-GCM (Authenticated) | 256-bit Key, 96-bit Random IV, 128-bit Tag | Guarantees confidentiality and instant tamper/corruption detection. |
| **Biometric Auth** | W3C WebAuthn Level 2/3 | FIDO2 Platform Authenticator, User Verification Required | Hardware Secure Enclave backing (Apple Secure Enclave, Android TEE, TPM). |
| **Recovery Key** | Crockford Base32 Format | 16 Characters (`MSV-XXXX-XXXX-XXXX-XXXX`) | Avoids easily confused characters (`0/O`, `1/I`) for accurate offline backup. |
| **Integrity Checks** | SHA-256 Checksums | 256-bit Hex Digest | Validates cryptographic authenticity during `.msvault` container imports. |
| **Local Storage** | Browser IndexedDB | Encrypted Payloads Only | Protects data from unauthorized access across system users. |

---

## ✨ Key Feature Highlights

### 1. Zero-Knowledge Private Vault
* Accessible at `/private-vault`.
* Offline-first, fully operational without network connectivity.
* Dynamic category-specific form generation:
  - **Passwords:** Username, password with one-click generator, URL, auto-fill tags.
  - **Payment Cards:** Cardholder name, 16-digit PAN, CVV (masked), expiration date.
  - **Identities:** Full name, passport/SSN number, issuing country, expiration reminders.
  - **Secure Notes:** Formatted private text protected from shoulder surfing.

### 2. Dual Platform Biometrics (Face ID & Fingerprint)
* Native biometric integration using W3C WebAuthn.
* Recognizes **Apple Face ID**, **Windows Hello Face**, **Android Face Unlock**, and **Fingerprint / Touch ID**.
* Intelligent hostname detection: automatically adjusts parameters for both domain deployments and LAN testing environments.

### 3. Comprehensive Passcode Recovery System
* Never lose access even if a master passcode is forgotten:
  - **Biometric Sensor Verification:** Uses device sensors to re-encrypt records under a new passcode.
  - **Emergency Recovery Key:** Unlocks encrypted escrow with an offline 16-character alphanumeric key.
  - **Emergency Re-initialization:** Safe factory reset if all credentials are lost.

### 4. Portable Encrypted Vault Packages (`.msvault`)
* Export your entire local vault into an encrypted container protected with an independent passphrase.
* Seamlessly import backups across different browsers, laptops, or operating systems.

### 5. Interactive Security Score & Breach Detection
* Real-time entropy evaluation analyzing password strength, reuse, and vulnerability.
* Provides actionable security suggestions to improve overall vault health.

### 6. AI Security Assistant
* Interactive contextual security assistant available on every dashboard page.
* Provides instant guidance on password policies, encryption protocols, and safety recommendations.

---

## 🛠️ Developer Quickstart & Local Setup

Follow these instructions to run MySafeVault locally on your machine:

### Prerequisites
* **Node.js:** v18.18.0 or newer (v20+ recommended)
* **Package Manager:** `pnpm` v9.0.0 or higher (`npm install -g pnpm`)
* **Database:** PostgreSQL (local database or hosted via [Supabase](https://supabase.com))

---

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/WAJIDALI0/MySafeVault.git
cd MySafeVault
```

#### 2. Install Dependencies
```bash
pnpm install
```

#### 3. Configure Environment Variables
Copy the sample environment file in `apps/web`:
```bash
cp apps/web/.env.example apps/web/.env.local
```
Open `apps/web/.env.local` and configure your credentials:
```env
# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/mysafevault"
DIRECT_URL="postgresql://postgres:password@localhost:5432/mysafevault"

# Supabase Auth Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 4. Initialize Database Schema
Push the Prisma schema to your PostgreSQL database:
```bash
pnpm --filter web dlx prisma db push
```

#### 5. Start the Development Server

* **Standard HTTP Mode (Desktop Browser Development):**
  ```bash
  pnpm dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Running HTTPS for Physical Mobile Phone Biometrics

Mobile browsers (Chrome on Android and Safari on iOS) **strictly enforce HTTPS** for `navigator.credentials` (WebAuthn biometric sensors) and `window.crypto.subtle`. To test Face ID or Fingerprint on a real smartphone over your local Wi-Fi:

```bash
pnpm dev:https
```

1. Next.js will automatically generate local development TLS certificates.
2. The terminal will display your LAN address, for example:
   ```text
   - Local:        https://localhost:3001
   - Network (IP): https://192.168.100.6:3001
   ```
3. Open `https://192.168.100.6:3001` on your mobile phone's browser.
4. Accept the local self-signed certificate warning once.
5. **Face ID, Fingerprint sensors, and AES hardware acceleration will be fully operational!**

---

## 📖 API Documentation (Swagger OpenAPI 3.0)

MySafeVault includes built-in interactive OpenAPI 3.0 documentation:

* **Interactive Swagger UI:** Navigate to `/api/docs` or `/docs` when the app is running.
* **OpenAPI 3.0 Specification:** Raw JSON spec available at `/api/docs`.

### Key Endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/vault/export` | Generates and streams an encrypted `.msvault` backup file. |
| `POST` | `/api/vault/import` | Validates, decrypts, and unpacks an encrypted `.msvault` container. |
| `GET` | `/api/docs` | Returns the complete OpenAPI 3.0 JSON specification. |

---

## 🧪 Testing, Quality Assurance & Build Verification

MySafeVault adheres to strict code quality and compilation checks:

```bash
# Run strict TypeScript typechecking across the entire monorepo
pnpm --filter web exec tsc --noEmit

# Run ESLint static code analysis
pnpm lint

# Run production build verification
pnpm build
```

---

## 📄 License & Acknowledgments

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

### Acknowledgments
* **W3C WebAuthn Working Group** for the modern authentication standard.
* **Next.js & Vercel** for the robust React 19 application framework.
* **Shadcn/UI & Lucide Icons** for the world-class design primitives.

<br/>

<div align="center">
  <p><strong>Developed with precision for privacy, cryptography, and digital sovereignty.</strong></p>
  <sub>MySafeVault Engineering Team • September 2026</sub>
</div>
