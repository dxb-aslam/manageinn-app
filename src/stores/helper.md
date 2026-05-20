# `stores/` — Pinia stores (shared reactive state)

| File | Holds | Mutated by |
|---|---|---|
| `auth.ts` | Session: user, full_name, properties, current, roles, isLoggedIn | `login()`, `hydrate()` (from main.ts + after-login), `logout()` |
| `property.ts` | Property data: bookings, rooms, roomTypes, stats, loadError | `loadProperty(name)`, `applyBookingUpdate(b)`, `removeBooking(name)` |
| `theme.ts` | Light/dark mode preference (light-only for now) | `init()` on boot, `setMode()` from a future settings UI |

## Patterns

- **Hydrate on boot** — `main.ts` calls `auth.hydrate()` before mount,
  so the splash screen sees the resolved state and can route accordingly.
- **Per-property scope** — `property.ts` is keyed implicitly by the
  active `auth.current`. When we add a property-switcher, call `reset()`
  before `loadProperty(newName)` to avoid stale data flickering.
- **Optimistic local updates** — `applyBookingUpdate(updated)` swaps a
  single booking in the list after a mutation, so the user sees the
  change without a full refetch. Only fall back to `loadProperty()` if
  the mutation is complex (e.g. assignment that changes both booking AND
  room state).

## Why Pinia and not provide/inject (like the web app)?

The web app uses `<script setup>` + `provide()` at App.vue and `inject()`
in child views — it works because the whole tree shares one root. Ionic
Vue's `IonRouterOutlet` lazy-mounts pages (and caches them in the back
stack) so provide/inject becomes brittle around page transitions. Pinia's
singleton stores survive that without ceremony, and Ionic's recommended
pattern explicitly uses Pinia (it's even bundled in the official starter).

## Adding a new store

```ts
import { defineStore } from 'pinia';

export const useFooStore = defineStore('foo', {
  state: () => ({ items: [] as Foo[] }),
  actions: {
    async load() { … },
  },
});
```

Document it in this file.
