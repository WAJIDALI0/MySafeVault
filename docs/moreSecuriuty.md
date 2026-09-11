Yes. I understand exactly what you want now.

You want **one master prompt for Google Gravity** that tells it to redesign/extend MySafeVault, while **protecting everything that already works**. The new concept should be a **Private Vault / Lock Folder** where users can keep selected passwords, documents, secure notes, identities, etc., with encrypted local storage, encrypted backup/download, biometric/passcode unlock, and a polished industry-level UI.

Your uploaded implementation plan already establishes the existing architecture and frozen functionality, including WebAuthn, AES-256-GCM, Supabase, Prisma, Gemini, Swagger, Resend, Sentry, and the current UI system. 

## COPY & PASTE THIS MASTER PROMPT INTO GOOGLE GRAVITY

```text
You are a Senior Staff Full-Stack Engineer, Cybersecurity Architect, Product Designer, and QA Engineer.

You are working on my existing project:

PROJECT NAME:
MySafeVault

PROJECT GOAL:
Transform MySafeVault into a world-class, competition-winning cybersecurity SaaS product while preserving every existing working feature.

==================================================
🚨 CRITICAL RULE — DO NOT BREAK EXISTING FEATURES
==================================================

BEFORE MODIFYING ANYTHING:

1. Inspect the existing repository and architecture.
2. Inspect existing components, server actions, API routes, Prisma schema, authentication, encryption, WebAuthn, MFA, UI system, and existing features.
3. Reuse existing functionality wherever possible.
4. DO NOT recreate functionality that already exists.
5. DO NOT replace working implementations unnecessarily.
6. DO NOT delete working code.
7. DO NOT change database schema unless absolutely unavoidable.
8. DO NOT introduce breaking migrations.
9. DO NOT change authentication architecture unnecessarily.
10. DO NOT change existing encryption implementation unnecessarily.
11. DO NOT change existing routes unless required.
12. DO NOT change existing API contracts unless required.
13. DO NOT overwrite existing security boundaries.
14. DO NOT replace existing WebAuthn implementation with a fake biometric system.
15. DO NOT use fake security animations or fake biometric verification.
16. DO NOT use localStorage for sensitive information.
17. DO NOT expose plaintext passwords, documents, secure notes, identity data, encryption keys, or recovery secrets in logs.
18. DO NOT run destructive commands.
19. DO NOT run `pnpm audit --fix` blindly.
20. DO NOT modify frozen functionality simply for visual reasons.

If a feature already exists and works:
KEEP IT.
REUSE IT.
EXTEND IT ONLY IF NECESSARY.

If a proposed feature is already implemented:
SKIP implementation and move to the next task.

After every major task:
BUILD → TYPECHECK → LINT → VERIFY.

If something fails:
STOP and investigate the failure before continuing.

==================================================
CURRENT EXISTING SYSTEM
==================================================

The existing application already contains:

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- pnpm monorepo
- Turborepo
- Supabase PostgreSQL
- Prisma ORM
- Supabase Auth
- SSR authentication
- Email verification
- Password reset
- MFA / 2FA
- WebAuthn / Passkeys
- AES-256-GCM server-side encryption
- Vault CRUD
- Password management
- Documents
- Secure Notes
- Identity records
- Favorites
- Activity Logs
- Notifications
- Security Score
- Gemini AI Security Insights
- Resend transactional email
- Sentry error monitoring
- Swagger / OpenAPI documentation
- White-first UI
- Dark mode
- Lucide icons
- Responsive dashboard

These existing features are considered FROZEN unless there is a genuine requirement to extend them.

==================================================
NEW MAJOR FEATURE
PRIVATE VAULT / LOCK FOLDER
==================================================

Build a premium feature called:

"Private Vault"

Alternative UI label:

"Locked Vault"

The concept:

A user can select sensitive items from their normal vault and place them inside a highly protected private area.

The Private Vault can contain:

- Passwords
- Documents
- Secure Notes
- Identity information
- Receipts
- Warranties
- Other existing vault item types

The user should be able to choose:

"Move to Private Vault"

or

"Protect Locally"

from an existing vault item.

DO NOT create duplicate vault systems unnecessarily.

Reuse the existing VaultItem model and existing metadata system whenever possible.

==================================================
PRIVATE VAULT SECURITY MODEL
==================================================

The Private Vault must have multiple protection layers.

Layer 1:
Existing authenticated MySafeVault account.

Layer 2:
Private Vault lock.

Layer 3:
Biometric / WebAuthn authentication where supported.

Supported platform authentication should include:

- Windows Hello
- Touch ID
- Face ID
- Android platform authentication
- Hardware security keys where supported

Use the existing SimpleWebAuthn implementation.

DO NOT create fake biometric authentication.

The application must rely on real WebAuthn platform authentication.

Layer 4:
Fallback private-vault passcode/password.

If biometric authentication is unavailable, allow the user to unlock using the configured secure fallback method.

==================================================
IMPORTANT CRYPTOGRAPHY REQUIREMENT
==================================================

Sensitive local data must NEVER be stored as plaintext.

DO NOT store sensitive information in:

- localStorage
- sessionStorage
- plain IndexedDB
- cookies
- URL parameters
- console logs

Use:

Web Crypto API
+
AES-256-GCM
+
secure key derivation
+
random salt
+
random IV

For local encrypted storage, use IndexedDB.

Sensitive payloads stored locally must remain encrypted at rest.

The encryption/decryption key must not remain permanently exposed in browser storage.

Use session-scoped memory where appropriate.

When the Private Vault is locked:

- clear sensitive decrypted data from active state
- clear temporary encryption keys from memory where technically possible
- return the UI to the locked state

==================================================
PRIVATE VAULT AUTO-LOCK
==================================================

Implement configurable auto-lock:

- Immediately
- 1 minute
- 5 minutes
- 15 minutes

Also monitor:

- browser tab visibility
- page visibility
- device inactivity where technically possible

When the user leaves the application or the configured timeout expires:

LOCK PRIVATE VAULT.

The user must authenticate again to view protected information.

==================================================
PRIVATE VAULT UI
==================================================

Create a premium competition-level page:

/private-vault

The page should feel like a high-end cybersecurity product.

Design direction:

Apple-level simplicity
+
Stripe-level clarity
+
Enterprise cybersecurity trust
+
Modern SaaS UI

Use the existing MySafeVault design system.

Do NOT introduce a completely unrelated visual language.

Use:

- White-first design
- Emerald security accents
- Slate typography
- Soft borders
- Subtle shadows
- Rounded cards
- Excellent spacing
- Professional Lucide icons
- Responsive layout
- Full dark-mode support

==================================================
LOCK SCREEN
==================================================

When Private Vault is locked, display:

MySafeVault Private Vault

"Your most sensitive information deserves another layer of protection."

Show:

[ Shield / Lock visual ]

Status:

PRIVATE VAULT LOCKED

Buttons:

[ Unlock with Biometrics ]

[ Unlock with Passcode ]

If WebAuthn is unavailable:

"Biometric authentication isn't available on this device."

Then show the fallback method.

The design should feel premium, trustworthy, and professional.

NO fake biometric animation.

The UI should only represent a biometric action when the browser actually invokes WebAuthn.

==================================================
PRIVATE VAULT DASHBOARD
==================================================

After unlocking, display:

Private Vault

"Your most sensitive information is protected behind an additional security layer."

Top status:

● Protected
● Biometric Verified
● Auto-Lock: 5 min

Display protected items using elegant cards.

Each card should show:

- Category icon
- Item title
- Item type
- Last updated
- Private Vault badge
- Favorite status
- Three-dot menu

Sensitive information should remain masked until the user explicitly chooses to reveal it.

Actions:

View
Edit
Remove from Private Vault
Delete
Export

==================================================
ADD TO PRIVATE VAULT
==================================================

Existing vault items should receive an action:

"Add to Private Vault"

When selected:

Show confirmation dialog:

"Protect this item in your Private Vault?"

Explain:

"This adds an additional protection layer. The item will only be visible after Private Vault authentication."

Buttons:

Cancel
Protect Item

After success:

Show:

"Item protected successfully."

Do not create duplicate records unless absolutely required.

Prefer metadata such as:

privateVault: true

when compatible with the existing architecture.

==================================================
ENCRYPTED BACKUP / EXPORT
==================================================

Create a beautiful:

"Export Private Vault"

feature.

The user should be able to download their protected information as an encrypted backup file.

File extension:

.msvault

Example:

MySafeVault_Backup_2026.msvault

IMPORTANT:

The downloaded file must NOT contain readable plaintext sensitive data.

The package must be encrypted.

Use:

AES-256-GCM
+
PBKDF2-HMAC-SHA256
+
unique random salt
+
unique random IV
+
authentication/integrity protection

The export process should be:

1. Select data
2. Set backup password
3. Confirm password
4. Encrypt in memory
5. Generate .msvault
6. Download

Never log the password.

Never log the encrypted key.

Never log the plaintext payload.

==================================================
IMPORT / RESTORE
==================================================

Create:

"Import Backup"

The user selects:

MySafeVault .msvault file

Flow:

1. Select file
2. Validate file format
3. Enter backup password
4. Decrypt in memory
5. Verify integrity
6. Preview items
7. User confirms restore
8. Restore safely

If password is incorrect:

"Unable to decrypt backup. Please verify your backup password."

Do not reveal cryptographic implementation details to the user.

Reject:

- malformed files
- unsupported formats
- executable content
- unexpected structures
- invalid schemas

Never execute imported content.

==================================================
LOCAL / OFFLINE STORAGE
==================================================

The product should provide an optional local protection capability.

If the user chooses:

"Keep a protected offline copy"

store only encrypted data locally.

Use:

IndexedDB

NOT:

localStorage.

The UI should explain clearly:

"Your offline copy is encrypted on this device."

Provide controls:

Enable Offline Vault
Disable Offline Vault
Clear Local Data

"Clear Local Data" should remove the encrypted local cache from that device.

Do not delete the cloud vault unless the user explicitly chooses a separate cloud deletion action.

==================================================
MOBILE EXPERIENCE
==================================================

The Private Vault must be designed mobile-first.

On mobile:

- Large unlock button
- Biometric authentication
- Clean item cards
- Bottom-sheet actions
- Touch-friendly controls
- Responsive spacing
- No horizontal overflow

The experience should feel like a premium mobile security application.

If the user has device biometric capability, use real WebAuthn/platform authentication.

Do NOT claim that MySafeVault stores biometric fingerprints.

The biometric system should only authenticate the user through the device/platform authenticator.

==================================================
FOLDER / COLLECTION EXPERIENCE
==================================================

The Private Vault should visually feel like a secure folder.

Show:

🔒 Private Vault

Inside:

Passwords
Documents
Secure Notes
Identity
Receipts
Warranties
Favorites

Allow category filtering.

Allow:

Search
Sort
Filter
Favorite
View
Export

Make the interface extremely clean.

==================================================
DASHBOARD INTEGRATION
==================================================

Add a dashboard card:

"Private Vault"

Example:

🔒 Private Vault

"Your most sensitive items are protected by an additional security layer."

Show:

12 Protected Items

Status:

● Locked

Actions:

[ Open Private Vault ]

[ Export Backup ]

This card should visually match the existing dashboard.

DO NOT destroy the existing dashboard layout.

Only integrate the new functionality naturally.

==================================================
SIDEBAR INTEGRATION
==================================================

Add:

Private Vault

with a professional lock/shield icon.

Place it logically near Vault.

Example:

Dashboard
Vault
Private Vault
Documents
Passwords
Secure Notes
Identity

Do not reorder the entire navigation unnecessarily.

==================================================
SETTINGS INTEGRATION
==================================================

Add:

Settings → Security → Private Vault

Options:

Private Vault
[ Enable / Disable ]

Unlock Method
[ Biometrics ]
[ Passcode ]

Auto-Lock
[ Immediately ]
[ 1 min ]
[ 5 min ]
[ 15 min ]

Offline Copy
[ Enabled / Disabled ]

Local Data
[ Clear Local Data ]

Export Backup
[ Export ]

Import Backup
[ Import ]

==================================================
SECURITY STATUS
==================================================

Display meaningful security indicators:

✓ Private Vault enabled
✓ Biometric authentication available
✓ Auto-lock enabled
✓ Local storage encrypted
✓ Backup encryption enabled

Do not show a green check unless the underlying condition is actually true.

Do not fake security scores.

==================================================
SWAGGER / OPENAPI
==================================================

Extend the existing Swagger/OpenAPI documentation.

Document appropriate Private Vault endpoints such as:

GET /api/private-vault/status

POST /api/private-vault/export

POST /api/private-vault/import

Only expose APIs that actually exist.

Document:

- Authentication requirements
- Request schema
- Response schema
- Error responses
- Security requirements

Do not create fake Swagger endpoints.

Swagger must reflect the actual implementation.

==================================================
ACTIVITY LOGGING
==================================================

Reuse the existing ActivityLog system.

Log security-relevant events such as:

Private Vault Enabled
Private Vault Locked
Private Vault Unlocked
Biometric Authentication
Item Added to Private Vault
Item Removed from Private Vault
Backup Exported
Backup Imported
Local Vault Cleared

IMPORTANT:

NEVER log:

- passwords
- private notes
- document contents
- identity secrets
- encryption keys
- backup passwords
- plaintext vault data

Only safe metadata should be logged.

==================================================
AI SECURITY INSIGHTS
==================================================

Reuse the existing Gemini AI Security Insights functionality.

Do not build a completely separate AI architecture.

Extend it where useful.

Example insight:

"Your Private Vault contains 4 highly sensitive items. Consider enabling biometric unlock and automatic locking after 5 minutes."

AI should never receive unnecessary plaintext secrets.

Prefer metadata/security posture information.

Never send passwords or private documents to Gemini unless an explicit existing secure architecture supports that behavior.

==================================================
EXISTING SECURITY FEATURES
==================================================

Preserve and integrate:

- AES-256-GCM encryption
- Supabase authentication
- MFA
- WebAuthn
- Passkeys
- Password reset
- Email verification
- Resend emails
- Sentry monitoring
- Security Score
- Gemini AI
- Activity logs
- Swagger
- Prisma authorization
- Existing security headers
- Existing CSRF/XSS protections

DO NOT replace working security implementations unnecessarily.

==================================================
NEW FILE STRUCTURE
==================================================

Before creating files, inspect whether equivalent utilities/components already exist.

Only create missing files.

Potential architecture:

apps/web/lib/crypto/client-vault-crypto.ts

apps/web/lib/storage/local-vault-store.ts

apps/web/lib/crypto/msvault-package.ts

apps/web/features/private-vault/

    components/
        private-vault-lock-screen.tsx
        private-vault-status-badge.tsx
        private-vault-item-card.tsx
        export-vault-dialog.tsx
        import-vault-dialog.tsx

    hooks/
        use-private-vault.ts

    actions/
        private-vault.actions.ts

apps/web/app/(dashboard)/private-vault/page.tsx

apps/web/app/api/private-vault/

    status/route.ts
    export/route.ts
    import/route.ts

IMPORTANT:

These are suggestions only.

If equivalent files already exist:
REUSE THEM.

Do not duplicate architecture.

==================================================
DATABASE REQUIREMENT
==================================================

Avoid database migrations if possible.

First inspect existing Prisma models.

If existing VaultItem metadata supports this:

{
  privateVault: true,
  protectedAt: "..."
}

reuse it.

If existing UserPreference.security_settings supports:

{
  privateVaultAutoLock: 5,
  biometricEnabled: true
}

reuse it.

Do not create unnecessary tables.

==================================================
UI QUALITY REQUIREMENTS
==================================================

Every new page must look production-ready.

No:

- Coming Soon
- Empty blank boxes
- placeholder buttons
- fake functionality
- dead links
- generic browser alerts
- inconsistent icons
- excessive gradients
- excessive animations

Use:

- meaningful empty states
- skeleton loading
- error states
- success states
- confirmation dialogs
- accessible buttons
- keyboard navigation
- responsive design
- dark mode
- light mode

Use Lucide icons consistently.

==================================================
COMPETITION-LEVEL "WOW" DETAILS
==================================================

The Private Vault should communicate security immediately.

Use subtle details such as:

- Protected status badge
- Lock/unlock state
- Encryption status
- Auto-lock countdown when appropriate
- Device authentication indicator
- Last unlocked time
- Protected item count
- Secure backup status
- Local encrypted storage status

Animations should be subtle.

Do not make the interface look like a gaming application.

The goal is:

"Enterprise cybersecurity product."

==================================================
ACCESSIBILITY
==================================================

Ensure:

- keyboard navigation
- visible focus states
- accessible labels
- sufficient contrast
- semantic HTML
- screen-reader-friendly controls
- mobile touch targets

==================================================
ERROR HANDLING
==================================================

Every new operation needs safe error handling.

Examples:

Biometric failure
→ "Authentication was not completed."

Incorrect passcode
→ "Incorrect unlock credentials."

Invalid backup
→ "This backup file is invalid or corrupted."

Wrong backup password
→ "Unable to decrypt this backup."

Import failure
→ "The backup could not be restored."

Never expose:

stack traces
database errors
cryptographic internals
secret values

to the user.

Send unexpected exceptions to the existing Sentry system.

==================================================
VERIFICATION
==================================================

After implementation run:

pnpm --filter web exec tsc --noEmit

pnpm lint

Then verify:

1. Existing login works.
2. Existing registration works.
3. Existing password reset works.
4. Existing MFA works.
5. Existing WebAuthn works.
6. Existing vault works.
7. Existing dashboard works.
8. Existing settings work.
9. Existing dark mode works.
10. Existing light mode works.
11. Existing AI Security Insights work.
12. Existing Swagger works.
13. Existing activity logging works.

Then test:

PRIVATE VAULT TEST:

Add Password
→ Add to Private Vault
→ Lock Private Vault
→ Unlock with WebAuthn
→ View item
→ Lock again
→ Verify item is hidden

BACKUP TEST:

Export
→ Set password
→ Download .msvault
→ Open file in text editor
→ Confirm sensitive plaintext is not visible

RESTORE TEST:

Import .msvault
→ Wrong password
→ Confirm rejection
→ Correct password
→ Preview
→ Restore

AUTO-LOCK TEST:

Unlock
→ wait configured period / change tab visibility
→ confirm automatic lock

LOCAL STORAGE TEST:

Enable offline copy
→ inspect storage
→ confirm sensitive plaintext is not stored in localStorage

MOBILE TEST:

Test responsive layout
→ Android-sized viewport
→ iPhone-sized viewport
→ tablet
→ desktop

==================================================
IMPORTANT IMPLEMENTATION RULE
==================================================

DO NOT implement everything blindly in one giant change.

Work in controlled phases.

PHASE 1:
Inspect existing architecture.

PHASE 2:
Identify reusable existing code.

PHASE 3:
Implement cryptographic/local-storage foundation.

PHASE 4:
Implement encrypted .msvault export/import.

PHASE 5:
Implement Private Vault lock/unlock.

PHASE 6:
Integrate existing WebAuthn.

PHASE 7:
Create Private Vault UI.

PHASE 8:
Integrate Dashboard and Sidebar.

PHASE 9:
Integrate Settings.

PHASE 10:
Update Swagger.

PHASE 11:
Activity logs and Sentry.

PHASE 12:
QA and regression testing.

After each phase:

TYPECHECK
LINT
BUILD
VERIFY

==================================================
FINAL PRODUCT VISION
==================================================

The final MySafeVault experience should communicate:

"Not just a password manager."

It should feel like:

A complete personal digital security vault.

A user should be able to:

Secure passwords
Protect documents
Store private notes
Manage identity information
Protect selected sensitive items behind an additional vault lock
Use device authentication
Automatically lock sensitive information
Keep encrypted local/offline copies
Create encrypted backups
Restore encrypted backups
Monitor security health
Receive intelligent security recommendations
Access developer-ready API documentation

The final result must look and feel like a serious industry-level cybersecurity SaaS product suitable for:

Students
Software Engineers
Developers
Freelancers
Professionals
Small Businesses
Security-Conscious Users
Enterprise Teams

==================================================
FINAL RULE
==================================================

PRESERVE WHAT ALREADY WORKS.

EXTEND WHAT ALREADY EXISTS.

DO NOT DUPLICATE.

DO NOT BREAK.

DO NOT FAKE SECURITY.

DO NOT STORE SENSITIVE DATA IN PLAINTEXT.

DO NOT CREATE UNNECESSARY DATABASE CHANGES.

DO NOT REMOVE EXISTING FEATURES.

DO NOT MODIFY FROZEN FEATURES WITHOUT A REAL REQUIREMENT.

If something is already implemented:
SKIP IT.

If something is partially implemented:
EXTEND IT.

If something is missing:
IMPLEMENT IT.

If an implementation could create a security risk:
STOP, explain the risk, and choose the safer architecture.

The final application must be production-quality, secure, responsive, accessible, visually polished, and competition-ready.
```

### One important correction to your idea

Your **"lock folder on mobile with fingerprint"** is a very good competition feature, but present it correctly.

Don't say:

> "MySafeVault stores the user's fingerprint and uses it to encrypt the files."

Instead say:

> **"MySafeVault uses the device's native biometric authentication through WebAuthn, so the biometric credential remains protected by the user's device."**

That's much more professional and technically defensible.

Also, your `.msvault` backup is a **better competition story than simply "download your data."** The impressive part is:

**Vault → Encrypt locally → Password-protected `.msvault` → Download → Later Import → Decrypt → Verify integrity → Restore.**

That gives you a very strong 20–30 second demo segment.

And importantly, the attached plan already specifies encrypted IndexedDB, session-scoped key handling, WebAuthn, and encrypted `.msvault` export rather than plaintext local storage. 

I can also create a **single visual architecture diagram/image** showing Cloud Vault → Private Vault → Biometrics → Encrypted Local Storage → `.msvault` Backup for your competition video.
