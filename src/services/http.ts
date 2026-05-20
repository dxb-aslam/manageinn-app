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

export interface ApiCreds {
  api_key: string;
  api_secret: string;
}

const KEYS = {
  apiKey: 'manageinn_api_key',
  apiSecret: 'manageinn_api_secret',
};

// ============================================================
// Credential storage
// ============================================================

export async function storeCreds(creds: ApiCreds): Promise<void> {
  await Promise.all([
    Preferences.set({ key: KEYS.apiKey, value: creds.api_key }),
    Preferences.set({ key: KEYS.apiSecret, value: creds.api_secret }),
  ]);
}

export async function clearCreds(): Promise<void> {
  await Promise.all([
    Preferences.remove({ key: KEYS.apiKey }),
    Preferences.remove({ key: KEYS.apiSecret }),
  ]);
}

export async function readCreds(): Promise<ApiCreds | null> {
  const [{ value: api_key }, { value: api_secret }] = await Promise.all([
    Preferences.get({ key: KEYS.apiKey }),
    Preferences.get({ key: KEYS.apiSecret }),
  ]);
  if (!api_key || !api_secret) return null;
  return { api_key, api_secret };
}

// ============================================================
// Errors
// ============================================================

export class HttpError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

function httpError(status: number, msg: string, data?: unknown): HttpError {
  return new HttpError(status, msg, data);
}

function extractMessage(data: any): string | undefined {
  if (!data) return;
  if (typeof data === 'string') return data;
  // Frappe wraps errors in `_server_messages`: a stringified array of
  // stringified JSON objects. Yes, really. Pull the first object's `message`.
  if (data._server_messages) {
    try {
      const arr = JSON.parse(data._server_messages);
      if (Array.isArray(arr) && arr.length) {
        const first = JSON.parse(arr[0]);
        if (first?.message) return first.message;
      }
    } catch {
      /* fall through */
    }
  }
  return data.exception || data.message?.message || data.message;
}

// ============================================================
// Headers
// ============================================================

async function authHeader(authed: boolean): Promise<Record<string, string>> {
  if (!authed) return {};
  const creds = await readCreds();
  if (!creds) throw httpError(401, 'No credentials');
  return { Authorization: `token ${creds.api_key}:${creds.api_secret}` };
}

// ============================================================
// POST
// ============================================================

export async function apiPost<T = any>(
  endpoint: string,
  data: Record<string, any> = {},
  { authed = true }: { authed?: boolean } = {},
): Promise<T> {
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
    return (res.data?.message ?? res.data) as T;
  }

  try {
    const res = await axios.post(url, data, { headers, withCredentials: false });
    return (res.data?.message ?? res.data) as T;
  } catch (err: any) {
    const status = err?.response?.status ?? 0;
    throw httpError(status, extractMessage(err?.response?.data) || err.message, err?.response?.data);
  }
}

// ============================================================
// GET
// ============================================================

export async function apiGet<T = any>(
  endpoint: string,
  params: Record<string, any> = {},
  { authed = true }: { authed?: boolean } = {},
): Promise<T> {
  const url = await apiUrl(endpoint);
  const headers = await authHeader(authed);

  if (Capacitor.isNativePlatform()) {
    const res = await CapacitorHttp.get({ url, headers, params });
    if (res.status < 200 || res.status >= 300) {
      throw httpError(res.status, extractMessage(res.data) || 'Request failed', res.data);
    }
    return (res.data?.message ?? res.data) as T;
  }

  try {
    const res = await axios.get(url, { headers, params });
    return (res.data?.message ?? res.data) as T;
  } catch (err: any) {
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
export async function api<T = any>(
  method: string,
  args: Record<string, any> = {},
  opts: { authed?: boolean } = {},
): Promise<T> {
  return apiPost<T>(`/api/method/${method}`, args, opts);
}
