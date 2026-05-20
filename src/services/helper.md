# `services/` — plain TS utilities, no Vue reactivity

These are imported anywhere — components, stores, other services. They
don't need to be composables because they don't return reactive refs.

| File | Purpose |
|---|---|
| `site.ts` | Bench URL config (Capacitor Preferences). Default points at the canonical Manage Inn instance; users on self-hosted benches change it in Profile → Bench URL. |
| `http.ts` | The ONE way the app calls the bench. `api(method, args)` POSTs to `/api/method/<method>` with the `Authorization: token <key>:<secret>` header. Uses `CapacitorHttp` on native to bypass CORS; `axios` on web. Throws `HttpError` with status + extracted Frappe message. |
| `navigation.ts` | Holds the router instances after `App.vue:onMounted` registers them. Stores use this to redirect on logout without holding a composable reference. |
| `toast.ts` | Thin wrapper around `toastController` for consistent `ok()` / `info()` / `error()` styling. |

## Adding a new service

Create `services/<name>.ts` with:
- Plain functions (no `defineStore`, no `ref`/`reactive`)
- If it needs to persist across launches → use `@capacitor/preferences`
- If it needs to talk to the bench → import `api` from `./http`

Document it in this file under a new heading.

## The CapacitorHttp pattern

Native Android/iOS WebViews enforce same-origin restrictions on `fetch()`
calls. To talk to `https://manageinn.dxbitz.com` from inside an APK, we
use `CapacitorHttp.post(...)` which goes through the native plugin and
bypasses CORS preflight. The fallback `axios` path is for `yarn dev`
running in a browser (Vite proxies `/api` → the bench in that case).

`http.ts` switches between them via `Capacitor.isNativePlatform()`.
