/**
 * site — manages the Frappe site URL the app talks to.
 *
 * The user picks this once on the SiteSetup screen (default points at the
 * canonical Manage Inn instance) and we persist it in Capacitor Preferences.
 * All HTTP calls read from here.
 *
 * Why a separate service? Lets users self-host or point at a staging bench
 * without changing code. Nextflow does the same — every customer's APK
 * points at their own bench.
 */
import { Preferences } from '@capacitor/preferences';
const KEY = 'manageinn_site_url';
const DEFAULT_SITE = 'https://manageinn.dxbitz.com';
let cached = null;
export async function getSiteUrl() {
    if (cached)
        return cached;
    const { value } = await Preferences.get({ key: KEY });
    cached = (value || DEFAULT_SITE).replace(/\/+$/, ''); // strip trailing /
    return cached;
}
export async function setSiteUrl(url) {
    const cleaned = url.trim().replace(/\/+$/, '');
    cached = cleaned;
    await Preferences.set({ key: KEY, value: cleaned });
}
export async function clearSiteUrl() {
    cached = null;
    await Preferences.remove({ key: KEY });
}
export function getDefaultSite() {
    return DEFAULT_SITE;
}
/** Build a full API URL from a method path. */
export async function apiUrl(methodPath) {
    const base = await getSiteUrl();
    const path = methodPath.startsWith('/') ? methodPath : `/${methodPath}`;
    return `${base}${path}`;
}
