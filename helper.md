# manageinn_app — code map

Ionic Vue mobile companion for the **Manage Inn** Frappe app. Same brand,
same warm boutique vibe as the web SPA — but running on a real phone with
native back-button handling, offline-capable APIs, and a tappable bottom
nav. Talks to the existing Manage Inn bench (no separate backend).

This is the **first thing to read** when you land in this repo. Every
meaningful folder has its own `helper.md` doing the same job at a smaller
scope.

## Relationship to the rest of the stack

```
┌─────────────────────────────────────────────────────────────────┐
│  Manage Inn bench (Frappe)                                      │
│  apps/manageinn/                                                │
│   ├─ api.py                ← whitelisted endpoints              │
│   ├─ DocTypes              ← data model                         │
│   └─ templates/pages/manage.html ← web SPA wrapper              │
│                                                                 │
│  Same backend serves BOTH:                                      │
│   • the web SPA (session + CSRF auth)                           │
│   • this mobile app (api_key + api_secret token auth)           │
└─────────────────────────────────────────────────────────────────┘
                        ▲                  ▲
                        │                  │
         /api/method/manageinn.api.*   /api/method/manageinn.api.*
                        │                  │
       ┌────────────────┴──────┐    ┌──────┴──────────────────────┐
       │  Web SPA (frontend/)  │    │  This app (manageinn_app)   │
       │  Vue 3 + Vite + IIFE  │    │  Ionic Vue + Capacitor      │
       │  cookie + CSRF        │    │  Authorization: token …     │
       │  served at /manage    │    │  Native APK / iOS .ipa      │
       └───────────────────────┘    └─────────────────────────────┘
```

## High-level layout

```
manageinn_app/
├── package.json
├── ionic.config.json
├── capacitor.config.ts        Native shell config (appId, dev-URL pattern)
├── vite.config.ts             Dev server + LAN proxy to the bench
├── tsconfig.json
├── index.html
├── helper.md                  ← you are here
│
├── scripts/
│   └── dev-android.sh         Live-reload session: build APK, install,
│                              point WebView at LAN Vite, run HMR
│
└── src/
    ├── main.ts                Boot: Ionic + Pinia + theme + auth.hydrate
    ├── App.vue                IonApp root + Android back-button handler
    ├── router/index.ts        Routes (Splash → Login → Home → tabs)
    ├── theme/
    │   ├── variables.css      Ionic CSS vars → Manage Inn palette
    │   └── manageinn.css      Brand fonts + helper classes
    │
    ├── services/              Plain TS modules — no Vue reactivity
    │   ├── site.ts            Bench URL config (Preferences)
    │   ├── http.ts            Token-auth HTTP (CapacitorHttp on native)
    │   ├── navigation.ts      Router handles for stores
    │   └── toast.ts           Ionic toastController wrapper
    │
    ├── stores/                Pinia stores
    │   ├── auth.ts            Session: login / hydrate / logout
    │   ├── property.ts        Bookings / rooms / room types
    │   └── theme.ts           Light/dark preference
    │
    ├── composables/
    │   ├── useCurrency.ts     `money()` with property currency
    │   └── useDates.ts        Date helpers (parseDate, formatDateShort, …)
    │
    ├── components/
    │   ├── MILogo.vue         Caveat wordmark + terra tile
    │   ├── MITopBar.vue       Sticky branded top bar
    │   ├── MIBottomNav.vue    Fixed bottom tab nav (role-aware)
    │   ├── StatusBadge.vue    Booking status pill
    │   └── EmptyState.vue     Friendly empty state card
    │
    └── views/                 Page components
        ├── SplashCheck.vue    Boot router — decides where to land
        ├── SiteSetup.vue      Bench URL config
        ├── LoginPage.vue      Email + password
        ├── HomePage.vue       Dashboard (mobile KPI tiles)
        ├── BookingsPage.vue   List + search + filter pills
        ├── BookingDetailPage.vue   View + status transitions
        ├── ProfilePage.vue    Account + sign out
        └── ComingSoon.vue     Placeholder for Calendar / Cleaning / Rooms
```

## How requests flow

| Surface | URL pattern | Auth | Notes |
|---|---|---|---|
| App boots | `/splash` | — | Decides Login vs Home based on stored token |
| User signs in | `manageinn.api.token_login` (POST) | guest | Returns `{api_key, api_secret}` — stored in Capacitor Preferences |
| Every API call | `manageinn.api.*` (POST) | `Authorization: token <key>:<secret>` | Via `CapacitorHttp` on native, `axios` on web fallback |
| Dashboard fetch | `manageinn.api.get_property_data` | token | Bookings + rooms + room types in one round-trip |
| Logout | `manageinn.api.logout` (POST) | token | Server-side cleanup; local clearCreds() regardless |

## Adding a feature — the recipe

1. **New page?** Drop a `.vue` file in `src/views/`, register in `src/router/index.ts`, add a bottom-nav entry in `MIBottomNav.vue` if it's a top-level tab.
2. **New API call?** The endpoint already exists in `apps/manageinn/manageinn/api.py`. Just call it via `api('manageinn.api.method_name', { …args })` from `services/http.ts`.
3. **Shared state?** Add to an existing Pinia store, or create `src/stores/<name>.ts` following the `auth.ts` pattern.
4. **Need an asset?** Drop it in `public/` (Capacitor copies it into the APK on `cap sync`).

## Common gotchas

- **`CapacitorHttp` vs `fetch`** — On a native build, `fetch()` against an
  HTTPS site CAN work but goes through the WebView's CORS rules. Use
  `CapacitorHttp` (which `http.ts` does automatically on native) to bypass
  CORS entirely.
- **Capacitor Preferences key conflicts** — All our keys are prefixed
  `manageinn_…` to avoid colliding with plugin defaults.
- **Site URL trailing slash** — `setSiteUrl()` strips it; don't add it
  back when concatenating endpoint paths.
- **The hardware back-button on auth routes** — App.vue minimises the
  app instead of letting back navigate. If you add a new auth-like route
  (PIN screen, biometric prompt), add it to `AUTH_ROUTES` in
  `services/navigation.ts`.

## Running locally

```bash
# 1. Install
yarn install

# 2. Add Android (one-time)
npx cap add android

# 3. Web dev server (talks to local bench)
yarn dev
# → http://localhost:5173 (proxies /api → http://localhost:8000)

# 4. Native dev (live-reload on a real phone over LAN)
yarn dev:android
# → builds APK, installs, runs Vite — edit src/, phone hot-reloads
```

## Convention: helper.md everywhere

Same convention as the bench app. Every meaningful folder has a
`helper.md` explaining what's in it and why. Update it when you add
files. **No comment is better than a stale comment.**
