/**
 * Private Vault Constants & LocalStorage Keys
 */
export const VAULT_PASSCODE_HASH_KEY = "msv_pv_hash";
export const VAULT_AUTOLOCK_KEY = "msv_pv_autolock";
export const VAULT_BIO_KEY = "msv_pv_bio_cached_key";
export const VAULT_CREDENTIAL_KEY = "msv_pv_credential_id";
export const VAULT_RECOVERY_KEY = "msv_pv_recovery_key";
export const VAULT_RECOVERY_ESCROW = "msv_pv_recovery_escrow";

export const DEFAULT_AUTOLOCK_MINUTES = 5;

/**
 * Validates if a hostname is an IP address where WebAuthn rpId must be omitted
 */
export const isIpAddress = (host: string): boolean =>
  /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(host) || host.includes(":");
