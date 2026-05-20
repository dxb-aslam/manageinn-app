# `src/` — the Vue source

## Boot sequence (in order)

1. **`main.ts`** — entry point
   - Creates Vue app + Pinia + Ionic
   - Imports Ionic core CSS + our theme files
   - `useThemeStore().init()` — flips html class for light/dark
   - `useAuthStore().hydrate()` — reads stored token, calls bootstrap
   - `await router.isReady()` (so SplashCheck sees the hydrated state)
   - `app.mount('#app')`

2. **`App.vue`** — IonApp root
   - `<IonRouterOutlet />`
   - Registers router handles in `services/navigation.ts`
   - Hooks Android hardware back-button (Capacitor)

3. **`router/index.ts`** — Ionic-Vue router
   - `/` → `/splash`
   - `/splash` decides Login vs Home

4. **Splash routes the user** to:
   - `/site-setup` (no bench URL configured — unused for Phase 1)
   - `/login` (no stored token)
   - `/home` (hydrate succeeded)

## State flow

```
   App boot
     ↓
   main.ts: useAuthStore().hydrate()
     ↓
   readCreds() from Capacitor Preferences
     ↓ (creds found)
   POST /api/method/manageinn.api.bootstrap  with Authorization header
     ↓
   Pinia auth store populated (user, properties, current, roles)
     ↓
   SplashCheck.vue navigates to /home
     ↓
   HomePage onMounted → usePropertyStore().loadProperty(auth.current.name)
     ↓
   POST /api/method/manageinn.api.get_property_data
     ↓
   Pinia property store populated (bookings, rooms, room types)
     ↓
   Pages render. Mutations call api(...) and re-fetch on success.
```

## Files

| File | Purpose |
|---|---|
| `main.ts` | Entry point. ~50 lines. |
| `App.vue` | IonApp root + back-button handler. |
| `router/index.ts` | Route table. |
| `vue-shims.d.ts` | Tells TS that `*.vue` is a Vue component. |
| `vite-env.d.ts` | Vite + custom env var types. |

## Folders

| Folder | What | When to add to |
|---|---|---|
| `services/` | Plain TS modules — HTTP, navigation, toast, etc. | Stateless utilities |
| `stores/` | Pinia stores — reactive shared state | App-wide state |
| `composables/` | Small reactive helpers (`useCurrency`, `useDates`) | Reused logic in views |
| `components/` | Reusable UI (logo, nav, badges) | Used by 2+ views |
| `views/` | Page components | One per top-level URL |
| `theme/` | CSS variables + brand overrides | Color/font changes |

Each subfolder has a `helper.md` with the per-file inventory.
