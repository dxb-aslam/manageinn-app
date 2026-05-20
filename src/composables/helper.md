# `composables/` — small reactive helpers

Ported from the web app's `frontend/src/composables/` (which is JS) to
TypeScript. Same behavior — keep them in sync if you change either.

| File | What |
|---|---|
| `useCurrency.ts` | `money(amount)` formatter + `symbol` + `code` (all reactive on `auth.current.currency`). 20+ currency symbols mapped. |
| `useDates.ts` | `parseDate`, `isoDate`, `addDays`, `todayISO`, `formatDateLong`, `formatDateShort`, `initials`. Pure functions, no reactivity. |

## Why not use the web app's JS versions directly?

The web app's composables live in a different codebase (the Frappe app's
`frontend/`). Two separate dependency trees, two builds. Copying the
logic over and converting to TS is cheap; sharing across projects would
require publishing an npm package, which isn't worth it yet.

## Adding a composable

```ts
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

export function useFoo() {
  const auth = useAuthStore();
  const something = computed(() => auth.current?.x);
  return { something };
}
```

Document it here.
