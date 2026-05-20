# `views/` — page components

One file per top-level URL. Registered in `src/router/index.ts`.

| File | URL | Notes |
|---|---|---|
| `SplashCheck.vue` | `/splash` | Decides Login vs Home based on stored creds + hydrate result. Shows the brand wordmark + spinner. Surfaces a retry button on network errors. |
| `SiteSetup.vue` | `/site-setup` | One-input form to set the bench URL. Reachable via Profile → Bench URL. |
| `LoginPage.vue` | `/login` | Email + password → `manageinn.api.token_login`. Stores `{api_key, api_secret}` in Capacitor Preferences. |
| `HomePage.vue` | `/home` | Mobile dashboard. 2×2 KPI tiles + arrivals/in-house lists. Pull-down refresh. |
| `CalendarPage.vue` | `/calendar` | Per-room 14-day mini-cal with virtual "Any [Type]" rows for unassigned bookings. Multi-booking picker sheet for cells with 2+ stays. |
| `BookingsPage.vue` | `/bookings` | List + IonSearchbar + filter pills + FAB → new booking. Tap row → detail. |
| `NewBookingPage.vue` | `/bookings/new` | Full create flow: type picker w/ live availability, dates, ± counters, payment, notes. Accepts `?room_type=X&room=Y&check_in=YYYY-MM-DD` prefill from Calendar taps. |
| `BookingDetailPage.vue` | `/bookings/:name` | View + status transitions + record-payment + cancel. Real IonHeader so back button works. |
| `CleaningPage.vue` | `/cleaning` | Cleaning task list. Filter pills, type icons, status pills, progress bars. Cleaning Staff see only their own + unassigned (backend-scoped). |
| `CleaningTaskDetailPage.vue` | `/cleaning/:name` | Checklist editor with item toggles, progress bar, Take it, Start, Mark done, notes. |
| `RequestsPage.vue` | `/requests` | Guest requests inbox. Expand-to-act rows with Acknowledge / Delivered / Closed buttons. |
| `RoomsPage.vue` | `/rooms` | Grouped room list with status dots + quick-update select. Tap QR icon → modal with the printable card + share/regenerate. |
| `ProfilePage.vue` | `/profile` | User info, current property, role pill, bench URL, sign-out. Shows "Switch to Desk" if `auth.is_system_user`. |
| `ComingSoon.vue` | — | Kept around as a future placeholder. Currently unused after Phase 2. |

## How a page typically looks

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';

const auth = useAuthStore();
const prop = usePropertyStore();

async function load() { … }
onMounted(load);
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="true">
      <MITopBar />
      <div class="page">…</div>
      <MIBottomNav />
    </IonContent>
  </IonPage>
</template>
```

## Conventions

- **Every page is wrapped in `<IonPage>`** — Ionic uses this for the
  router-outlet's caching + transition animations. Without it, the page
  works but transitions look wrong.
- **Top-level tab pages use `MITopBar` + `MIBottomNav`** — branded sticky
  header + fixed bottom nav. Detail pages (Booking, etc.) use a real
  `<IonHeader>` instead so the back button is native.
- **Pull-to-refresh** — wrap with `<IonRefresher slot="fixed">` calling
  the page's `load()` + `(e.target as HTMLIonRefresherElement).complete()`.
- **Empty states** — use `<EmptyState>` rather than inline text, even
  for "no search results" cases. Keeps the look consistent.

## Adding a page

1. Drop `views/<Name>Page.vue` (`Page` suffix matches the Ionic convention)
2. Register in `router/index.ts`
3. If top-level: add to `MIBottomNav.vue` tabs array (with `hideForCleaning`
   if the Cleaning Staff role shouldn't see it)
4. Update this file with a one-liner
