/**
 * biometric — wrap @capgo/capacitor-native-biometric in a Manage-Inn-shaped
 * API.
 *
 * Three operations:
 *   isAvailable()   — can this device do fingerprint / Face ID? Returns
 *                     {available, reason, biometryType: "FINGERPRINT"|"FACE_ID"|...}
 *   enable()        — prompt the user once, store a flag in Preferences.
 *                     Doesn't actually store credentials in the keychain —
 *                     the token is already in Capacitor Preferences (which
 *                     IS the keychain on iOS, encrypted shared prefs on
 *                     Android). We just use biometric as a *gate* on
 *                     app cold-start.
 *   verify()        — prompt with Touch ID / Face ID on app boot. Returns
 *                     true/false; the lock-screen UI uses this to gate
 *                     access to the rest of the app.
 *
 * The auth token itself doesn't move — it stays in Preferences. Biometric
 * is purely a UX layer: "is the right human in front of this phone?"
 *
 * Doesn't run on web (the plugin is no-op there). Calls return
 * {available: false} gracefully so the rest of the app keeps working
 * in `yarn dev`.
 */
import { NativeBiometric, BiometryType } from '@capgo/capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const ENABLED_KEY = 'manageinn_biometric_enabled';

export interface BiometricAvailability {
  available: boolean;
  biometryType: BiometryType | null;
  reason: string;       // human-readable reason if unavailable
}

export async function isAvailable(): Promise<BiometricAvailability> {
  if (!Capacitor.isNativePlatform()) {
    return { available: false, biometryType: null, reason: 'Only available in the installed app' };
  }
  try {
    const res = await NativeBiometric.isAvailable();
    return {
      available: !!res.isAvailable,
      biometryType: res.biometryType ?? null,
      reason: res.isAvailable ? 'Ready' : (String(res.errorCode || '') || 'Biometric not set up on this device'),
    };
  } catch (e: any) {
    return { available: false, biometryType: null, reason: e?.message || 'Unknown error' };
  }
}

/** Is biometric unlock turned on for THIS install? (set after first verify success) */
export async function isEnabled(): Promise<boolean> {
  const { value } = await Preferences.get({ key: ENABLED_KEY });
  return value === '1';
}

/**
 * Run the biometric prompt. On success, remember it (so future cold-starts
 * gate on biometric instead of nothing). Returns true if the user
 * authenticated, false if they cancelled / failed / device doesn't support.
 */
export async function enable(reason = 'Sign in to Manage Inn'): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  const ok = await verify(reason);
  if (ok) {
    await Preferences.set({ key: ENABLED_KEY, value: '1' });
  }
  return ok;
}

/** Turn off biometric unlock. Subsequent cold-starts will skip the prompt. */
export async function disable(): Promise<void> {
  await Preferences.set({ key: ENABLED_KEY, value: '0' });
}

/**
 * Show the biometric prompt. Returns true on success.
 *
 * On Android the plugin shows the system biometric dialog (fingerprint
 * sensor / face unlock). On iOS it shows Touch ID or Face ID. On web
 * it returns false silently.
 */
export async function verify(reason = 'Unlock Manage Inn'): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    await NativeBiometric.verifyIdentity({
      reason,
      title: 'Unlock Manage Inn',
      subtitle: 'Use your biometric to continue',
      description: 'Faster than typing your password each time',
    });
    return true;
  } catch (e: any) {
    // User cancelled, failed too many times, or device doesn't have biometric set up
    return false;
  }
}

/** Pretty name of the device's biometric type, for UI copy. */
export function biometryLabel(type: BiometryType | null): string {
  if (!type) return 'Biometric';
  switch (type) {
    case BiometryType.TOUCH_ID:
    case BiometryType.FINGERPRINT:
      return 'Fingerprint';
    case BiometryType.FACE_ID:
    case BiometryType.FACE_AUTHENTICATION:
      return 'Face ID';
    case BiometryType.IRIS_AUTHENTICATION:
      return 'Iris';
    default:
      return 'Biometric';
  }
}
