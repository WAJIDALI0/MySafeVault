# Plan 4: Dashboard Integration, Sidebar, Settings, OpenAPI Swagger & End-to-End QA

## Executive Overview
Unify all Private Vault and Encrypted Export/Import capabilities seamlessly across the entire MySafeVault ecosystem: dashboard card, sidebar navigation, vault item context menu ("Move to Private Vault"), settings & security center controls, OpenAPI/Swagger specifications, and rigorous end-to-end competition demonstration testing.

---

## 1. Objectives & Scope
- **Dashboard Integration:** Add a modern, compact "Private Vault" status card to the main dashboard displaying lock status, local item count, and quick unlock / export action.
- **Sidebar Navigation:** Add "Private Vault" link with a shield/lock badge to the main navigation menu (`features/dashboard/components/sidebar.tsx`).
- **Vault Item Action:** Add "Protect in Private Vault" toggle / context menu item in `vault-item-card.tsx` and detail modal.
- **Settings & Security Center:** Add "Private Vault & Offline Storage" configuration section (auto-lock duration, biometric toggle, export backup, wipe local vault).
- **OpenAPI / Swagger:** Document `/api/vault/export`, `/api/vault/import`, and `/api/vault/private-status` in `apps/web/lib/swagger.ts` with complete request/response schemas.
- **Full Regression & Visual QA:** Verify light, dark, and system themes, responsive layout on mobile/tablet/desktop, and zero regressions on existing cloud vault features.

---

## 2. Technical Architecture & File Layout

### A. Dashboard Private Vault Card
**Path:** `apps/web/features/dashboard/components/cards/private-vault-card.tsx`
- Sleek card matching the emerald/slate competition theme.
- Displays:
  - Shield with biometric indicator.
  - Current status: "Locked (Encrypted)" vs "Unlocked (Active)".
  - Quick action: "Open Lock Folder" -> navigates to `/private-vault`.
  - Secondary action: "Quick Export (.msvault)".

### B. Sidebar Navigation Update
**Path:** `apps/web/features/dashboard/components/sidebar.tsx`
- Add `{ name: 'Private Vault', href: '/private-vault', icon: LockIcon, badge: 'Protected' }` to primary navigation items.
- Ensure desktop and mobile drawer menus render consistently with active route highlighting.

### C. Vault Item Context Menu
**Path:** `apps/web/features/vault/components/vault-item-card.tsx`
- Add "Move to Private Vault" / "Restore to Cloud Vault" option in the item actions dropdown.
- When an item is private, render a discrete emerald lock badge next to its title.

### D. Settings / Security Center Tab
**Path:** `apps/web/app/(dashboard)/settings/page.tsx` & `features/security/components/private-vault-settings.tsx`
- Auto-lock timeout selector: Immediately, 1m, 5m, 15m, 30m.
- Biometric authentication toggle (enable/disable platform WebAuthn).
- Storage breakdown: Cloud Vault count vs Private Vault local item count.
- Encrypted Backup: "Download Encrypted Backup (.msvault)".
- Danger Zone: "Wipe Local Encrypted Vault (IndexedDB)" with confirmation modal.

### E. OpenAPI / Swagger Specs
**Path:** `apps/web/lib/swagger.ts` and `apps/web/app/api/vault/export/route.ts`
- Complete OpenAPI 3.0 path definitions for:
  - `POST /api/vault/export`: Authenticated export payload retrieval.
  - `POST /api/vault/import`: Batch import of verified items into vault.
- Update `/api-docs` Swagger UI for competition judges to explore and test.

---

## 3. Comprehensive Verification & QA Checklist
1. **Light & Dark Theme Visual Audit:** Verify all new components (Lock screen, cards, dialogs, badges) look flawless in both dark and pure white themes.
2. **Mobile Responsiveness:** Verify drawer, dialogs, biometric prompts, and item lists fit cleanly on 375px mobile screens.
3. **No Database Migration Needed:** Verify all metadata operates within existing `Json` columns (`metadata` in `VaultItem`, `security_settings` in `UserPreference`).
4. **Frozen Features Check:** Login, Register, Cloud Vault items, 2FA, and Security Score continue to work with zero regressions.
5. **Swagger Documentation:** Load `/api-docs` and verify all endpoints return valid schemas and descriptions.
