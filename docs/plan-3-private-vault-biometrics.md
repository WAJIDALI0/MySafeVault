# Plan 3: Mobile Biometric Lock Folder & Private Vault Experience

## Executive Overview
Create the dedicated **Private Vault / Lock Folder** experience featuring genuine platform WebAuthn biometric unlock (Touch ID, Face ID, Windows Hello, Android Biometrics) with master passcode fallback, automatic inactivity lock timers, tab-switch protection, and a sleek, competition-ready UI.

---

## 1. Objectives & Scope
- Build genuine WebAuthn authentication for the Private Vault leveraging existing `@simplewebauthn` infrastructure.
- Provide a robust Master Passcode fallback for devices without platform authenticators.
- Implement comprehensive auto-lock logic:
  - Inactivity timers (Immediately, 1 minute, 5 minutes, 15 minutes, 30 minutes).
  - Page/Tab visibility change lock (`document.visibilityState === 'hidden'`).
  - Window blur or session expiry lock.
- Build the dedicated `/private-vault` route with quick filter by category, item counter, search, and "Move to Cloud Vault / Move to Private Vault" operations.
- State management hook (`usePrivateVault`) ensuring decrypted keys and items exist purely in transient React memory, wiped instantly upon lock.

---

## 2. Technical Architecture & File Layout

### A. Private Vault State & Memory Guard Hook
**Path:** `apps/web/features/vault/hooks/use-private-vault.ts`
- **States:** `isLocked`, `isBiometricsAvailable`, `autoLockTimeout`, `unlockedKey`, `items`, `isLoading`.
- **Memory Hygiene:** `lockVault()` immediately sets `unlockedKey = null`, `items = []`, clears any cached keys in memory, and triggers re-render to lock screen.
- **Inactivity Watcher:** `useEffect` listening to `pointerdown`, `keydown`, `scroll`, and `touchstart`. Resets countdown timer on activity.
- **Tab Protection:** Listens to `visibilitychange` — when user switches apps or minimizes browser, instantly locks or sets auto-lock flag.

### B. Biometric & Passcode Lock Screen
**Path:** `apps/web/features/vault/components/private-vault-lock-screen.tsx`
- **Visual Design:**
  - Modern, high-trust security aesthetic with emerald/slate gradients and animated biometric badge.
  - Device capability detector: "Unlock with Windows Hello / Touch ID / Face ID" if available; switches gracefully to "Enter Master Passcode".
  - Status indicator: "Private Vault is Encrypted & Locked".
  - Quick setup wizard for first-time activation (set Private Vault passcode + register biometric passkey).
- **WebAuthn Integration:** Reuses existing `/api/auth/webauthn/*` challenge-response routes to authenticate user before unlocking vault key.

### C. Private Vault Page & Components
**Path:** `apps/web/app/(dashboard)/private-vault/page.tsx`
- Dedicated page rendering:
  - If locked -> `PrivateVaultLockScreen`.
  - If unlocked -> Full Private Vault explorer with:
    - Top security header (badge showing "End-to-End Encrypted | Stored Locally & Offline", Lock Now button, Export/Import shortcuts, Auto-lock settings dropdown).
    - Category pills (All, Passwords, Documents, Secure Notes, Identity).
    - Search & Filter bar.
    - Private Vault Item Cards with quick copy, view details modal, and "Move to Cloud Vault" action.
    - Empty state: "Your Private Vault is empty. Items moved here are encrypted locally and hidden from regular views."

### D. Private Item Management Actions
**Path:** `apps/web/features/vault/actions/private-vault.actions.ts`
- Server coordination to tag or untag items:
  - `toggleItemPrivacy(itemId: string, makePrivate: boolean)`
  - Updates `VaultItem.metadata` with `{ isPrivate: true }` so cloud queries exclude it from general vault views when desired, or marks items for pure local storage.

---

## 3. Verification & Acceptance Criteria
1. **Real Biometric Verification:** Test on Windows Hello / Touch ID / Android — genuine WebAuthn prompt appears; successful scan unlocks vault.
2. **Passcode Fallback:** Test with valid passcode -> unlocks; test with invalid passcode -> rate limits and shows error.
3. **Inactivity Auto-Lock:** Set timer to 1 minute, leave tab idle -> verify automatic lock screen engagement at 60s.
4. **Tab Switch Test:** Switch tabs or minimize window -> verify immediate lock when strict privacy mode is toggled on.
5. **Memory Verification:** Check window object and local storage in DevTools — ensure no decrypted passwords or keys persist after lock.
