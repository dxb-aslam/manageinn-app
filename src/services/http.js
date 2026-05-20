/**
 * http — token-authenticated HTTP layer for talking to the Manage Inn bench.
 *
 * Auth model:
 *   We use Frappe's API key + secret pattern (not session cookies). On login,
 *   the bench's `manageinn.api.token_login` returns {api_key, api_secret}. We
 *   stash them in Capacitor Preferences and attach them on every request as
 *   `Authorization: token <key>:<secret>`.
 *
 * Transport:
 *   - Native (Android/iOS): CapacitorHttp — bypasses the WebView's same-origin
 *     restrictions and avoids CORS preflight noise
 *   - Web (dev / preview / PWA): axios — Vite proxy handles cross-origin
 *
 * Error shape:
 *   We throw HttpError with `status`, `message`, and the raw `data` so callers
 *   can switch on the kind of failure. The message extractor digs out Frappe's
 *   `_server_messages` (JSON-in-JSON, naturally) when present.
 */
import axios from 'axios';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { apiUrl } from './site';
const KEYS = {
    apiKey: 'manageinn_api_key',
    apiSecret: 'manageinn_api_secret',
};
// ============================================================
// Credential storage
// ============================================================
export async function storeCreds(creds) {
    await Promise.all([
        Preferences.set({ key: KEYS.apiKey, value: creds.api_key }),
        Preferences.set({ key: KEYS.apiSecret, value: creds.api_secret }),
    ]);
}
export async function clearCreds() {
    await Promise.all([
        Preferences.remove({ key: KEYS.apiKey }),
        Preferences.remove({ key: KEYS.apiSecret }),
    ]);
}
export async function readCreds() {
    const [{ value: api_key }, { value: api_secret }] = await Promise.all([
        Preferences.get({ key: KEYS.apiKey }),
        Preferences.get({ key: KEYS.apiSecret }),
    ]);
    if (!api_key || !api_secret)
        return null;
    return { api_key, api_secret };
}
// ============================================================
// Errors
// ============================================================
export class HttpError extends Error {
    status;
    data;
    constructor(status, message, data) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.data = data;
    }
}
function httpError(status, msg, data) {
    return new HttpError(status, msg, data);
}
function extractMessage(data) {
    if (!data)
        return;
    if (typeof data === 'string')
        return data;
    // Frappe wraps errors in `_server_messages`: a stringified array of
    // stringified JSON objects. Yes, really. Pull the first object's `message`.
    if (data._server_messages) {
        try {
            const arr = JSON.parse(data._server_messages);
            if (Array.isArray(arr) && arr.length) {
                const first = JSON.parse(arr[0]);
                if (first?.message)
                    return first.message;
            }
        }
        catch {
            /* fall through */
        }
    }
    return data.exception || data.message?.message || data.message;
}
// ============================================================
// Headers
// ============================================================
async function authHeader(authed) {
    if (!authed)
        return {};
    const creds = await readCreds();
    if (!creds)
        throw httpError(401, 'No credentials');
    return { Authorization: `token ${creds.api_key}:${creds.api_secret}` };
}
// ============================================================
// POST
// ============================================================
export async function apiPost(endpoint, data = {}, { authed = true } = {}) {
    const url = await apiUrl(endpoint);
    const headers = {
        'Content-Type': 'application/json',
        ...(await authHeader(authed)),
    };
    if (Capacitor.isNativePlatform()) {
        const res = await CapacitorHttp.post({ url, headers, data });
        if (res.status < 200 || res.status >= 300) {
            throw httpError(res.status, extractMessage(res.data) || 'Request failed', res.data);
        }
        return (res.data?.message ?? res.data);
    }
    try {
        const res = await axios.post(url, data, { headers, withCredentials: false });
        return (res.data?.message ?? res.data);
    }
    catch (err) {
        const status = err?.response?.status ?? 0;
        throw httpError(status, extractMessage(err?.response?.data) || err.message, err?.response?.data);
    }
}
// ============================================================
// GET
// ============================================================
export async function apiGet(endpoint, params = {}, { authed = true } = {}) {
    const url = await apiUrl(endpoint);
    const headers = await authHeader(authed);
    if (Capacitor.isNativePlatform()) {
        const res = await CapacitorHttp.get({ url, headers, params });
        if (res.status < 200 || res.status >= 300) {
            throw httpError(res.status, extractMessage(res.data) || 'Request failed', res.data);
        }
        return (res.data?.message ?? res.data);
    }
    try {
        const res = await axios.get(url, { headers, params });
        return (res.data?.message ?? res.data);
    }
    catch (err) {
        const status = err?.response?.status ?? 0;
        throw httpError(status, extractMessage(err?.response?.data) || err.message, err?.response?.data);
    }
}
// ============================================================
// Convenience wrapper for whitelisted Frappe methods
// ============================================================
/**
 * Call a whitelisted method on the bench.
 *
 *   await api('manageinn.api.list_cleaning_tasks', { property: 'X' })
 */
export async function api(method, args = {}, opts = {}) {
    return apiPost(`/api/method/${method}`, args, opts);
}
