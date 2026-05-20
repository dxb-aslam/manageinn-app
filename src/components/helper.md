# `components/` — reusable UI

| File | Purpose |
|---|---|
| `MILogo.vue` | Manage Inn wordmark — Caveat bold + wavy honey underline + terra rounded tile. Sizes: `sm` (nav), `md` (cards), `lg` (splash/login). |
| `MITopBar.vue` | Sticky branded top bar for tab-root pages. Uses MILogo + an actions slot. Detail pages use `<IonHeader>` directly instead. |
| `MIBottomNav.vue` | Fixed bottom tab bar. Role-aware (Cleaning Staff sees only Home/Cleaning/Rooms). Doesn't use `ion-tabs` — we share one router stack so back-gesture works naturally across tabs. |
| `StatusBadge.vue` | Booking status pill. Color classes defined in `theme/manageinn.css` (`.mi-status-pill.enquiry`, etc.) matching the web app. |
| `EmptyState.vue` | Friendly empty card. Emoji + Lora italic headline + body + action slot. `subtle` prop for nested usages. |

## When to put something in `components/`

- It's used by 2+ views
- It's a self-contained UI unit with its own props/emits API
- It would clutter a view file otherwise

If you're unsure, inline first. Promote to `components/` when a second
view needs it.

## Why no IonTabs?

Ionic's `<ion-tabs>` creates separate router outlets per tab, which means
back-button history is per-tab. That works for some apps (Mail, Photos)
but feels wrong for an operational app where users frequently bounce
between booking → calendar → cleaning. We use a single `<IonRouterOutlet>`
with `<MIBottomNav>` rendered inside each page's `<IonContent>`, so the
back gesture takes you to the *previous page*, not the *previous tab*.

## Component reuse from the web app

These mobile components mirror their web equivalents conceptually but
don't share code — the web app uses Tailwind, this one uses scoped CSS
and Ionic primitives. Naming + behavior is parallel so a future
developer can find what they're looking for.
