/**
 * auth store — session state + login/logout actions.
 *
 * Flow:
 *   login(user, pwd)
 *     ↓ POST manageinn.api.token_login → { api_key, api_secret, user, full_name }
 *     ↓ storeCreds() (Capacitor Preferences)
 *     ↓ hydrate() — fetches bootstrap data (properties, role, etc.)
 *     ↓ navigation switches to /home
 *
 *   hydrate()
 *     ↓ if no creds → set isLoggedIn=false; SplashCheck routes to /login
 *     ↓ else GET manageinn.api.bootstrap → populate state
 *     ↓ on 401 → clearCreds + isLoggedIn=false
 *
 *   logout()
 *     ↓ clearCreds + reset state + gotoAuthRoot()
 */
import { defineStore } from 'pinia';
import { api, clearCreds, readCreds, storeCreds } from '@/services/http';
import { gotoAuthRoot } from '@/services/navigation';
import { unregisterCurrent as unregisterPush } from '@/services/push';

interface Property {
  name: string;
  property_name: string;
  address?: string;
  photo?: string;
  logo?: string;
  check_in_time?: string | null;
  check_out_time?: string | null;
  currency?: string;
  contact_phone?: string;
  contact_email?: string;
  status?: string;
  users?: Array<{ user: string; user_full_name?: string; role: string }>;
  my_role?: string;
  is_cleaning_only?: boolean;
}

interface AuthState {
  user: string;
  full_name: string;
  user_type: string;
  is_system_user: boolean;
  is_admin: boolean;
  is_sys_admin: boolean;
  roles: string[];
  properties: Property[];
  current: Property | null;
  isLoggedIn: boolean;
  hydrated: boolean;
}

const initialState = (): AuthState => ({
  user: '',
  full_name: '',
  user_type: 'Website User',
  is_system_user: false,
  is_admin: false,
  is_sys_admin: false,
  roles: [],
  properties: [],
  current: null,
  isLoggedIn: false,
  hydrated: false,
});

export const useAuthStore = defineStore('auth', {
  state: initialState,
  getters: {
    propertyName: (s) => s.current?.property_name || '',
    myRole: (s) => s.current?.my_role || (s.is_sys_admin ? 'System Manager' : 'Member'),
    isPropertyAdmin: (s) => s.is_sys_admin || s.current?.my_role === 'Admin',
    isCleaningOnly: (s) => !s.is_sys_admin && s.current?.my_role === 'Cleaning Staff',
  },
  actions: {
    /**
     * Validate credentials against the bench and store the returned
     * api_key + api_secret. Followed by a hydrate() to fetch session data.
     */
    async login(username: string, password: string): Promise<void> {
      const res = await api<{
        api_key: string;
        api_secret: string;
        user: string;
        full_name: string;
      }>('manageinn.api.token_login', { user: username, pwd: password }, { authed: false });

      await storeCreds({ api_key: res.api_key, api_secret: res.api_secret });
      this.user = res.user;
      this.full_name = res.full_name || res.user;
      this.isLoggedIn = true;
      await this.hydrate();
    },

    /**
     * Fetch bootstrap data from the bench. Called on app boot (from main.ts)
     * AND immediately after login() so the same state-population logic
     * runs in both paths.
     */
    async hydrate(): Promise<void> {
      const creds = await readCreds();
      if (!creds) {
        this.isLoggedIn = false;
        this.hydrated = true;
        return;
      }

      try {
        const data = await api<{
          user: string;
          full_name: string;
          user_type: string;
          is_system_user: boolean;
          is_admin: boolean;
          is_sys_admin: boolean;
          roles: string[];
          properties: Property[];
        }>('manageinn.api.bootstrap');

        this.user = data.user || '';
        this.full_name = data.full_name || data.user || '';
        this.user_type = data.user_type || 'Website User';
        this.is_system_user = !!data.is_system_user;
        this.is_admin = !!data.is_admin;
        this.is_sys_admin = !!data.is_sys_admin;
        this.roles = data.roles || [];
        this.properties = data.properties || [];
        this.current = this.properties[0] || null;
        this.isLoggedIn = true;
      } catch (e: any) {
        // 401 → creds dead. Anything else → keep creds, surface error.
        if (e?.status === 401) {
          await clearCreds();
          Object.assign(this, initialState());
        } else {
          // Network or transient — still mark logged in so the user can retry
          this.isLoggedIn = true;
        }
        throw e;
      } finally {
        this.hydrated = true;
      }
    },

    /**
     * Switch the "active" property (when the user has more than one).
     * Persists implicitly — auto-selected on next hydrate via properties[0],
     * so for now we just store the in-memory pointer.
     */
    setCurrentProperty(name: string): void {
      const p = this.properties.find((x) => x.name === name);
      if (p) this.current = p;
    },

    /** Sign out — wipe creds + reset state + navigate to /login. */
    async logout(): Promise<void> {
      // Unregister this device's push token first — best-effort, the
      // server-side endpoint is forgiving of expired sessions.
      try { await unregisterPush(); } catch { /* ignore */ }

      try {
        // Best-effort server-side logout. The token isn't actually invalidated
        // by Frappe on this call (the api_secret remains valid) but on next
        // login we regenerate it so old devices lose access.
        await api('manageinn.api.logout');
      } catch {
        /* ignore — clear local state regardless */
      }
      await clearCreds();
      Object.assign(this, initialState());
      this.hydrated = true;
      gotoAuthRoot();
    },
  },
});
