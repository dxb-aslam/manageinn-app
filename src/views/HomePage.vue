<!--
  HomePage — mobile dashboard. The "morning briefing" view from the web
  app, condensed for phone screens.

  KPIs: arrivals today, departures today, in-house, dues — same data as
  the web app's Dashboard but laid out as a 2-col tile grid.

  Data lives in the property store (loaded once on entry, refresh via
  pull-down on IonRefresher).
-->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  IonContent, IonPage, IonRefresher, IonRefresherContent, IonSpinner,
} from '@ionic/vue';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { useCurrency } from '@/composables/useCurrency';
import { todayISO, formatDateShort } from '@/composables/useDates';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import EmptyState from '@/components/EmptyState.vue';

const auth = useAuthStore();
const prop = usePropertyStore();
const { money } = useCurrency();

const today = todayISO();
const initialLoad = ref(true);

async function load(): Promise<void> {
  if (!auth.current) return;
  try {
    await prop.loadProperty(auth.current.name);
  } finally {
    initialLoad.value = false;
  }
}

async function pullRefresh(e: CustomEvent): Promise<void> {
  await load();
  (e.target as HTMLIonRefresherElement).complete();
}

onMounted(load);

// Slices of the booking list — same logic the web Dashboard uses
const arrivalsToday = computed(() =>
  prop.bookings.filter((b) => b.check_in_date === today && b.status !== 'Cancelled'),
);
const departuresToday = computed(() =>
  prop.bookings.filter((b) => b.check_out_date === today && b.status === 'Checked In'),
);
const inHouse = computed(() => prop.bookings.filter((b) => b.status === 'Checked In'));
const pendingDues = computed(() =>
  prop.bookings
    .filter((b) => ['Enquiry', 'Confirmed', 'Checked In'].includes(b.status))
    .reduce((sum, b) => sum + Math.max(0, (b.total_amount || 0) - (b.advance_paid || 0)), 0),
);

const greeting = computed(() => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
});
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="true">
      <IonRefresher slot="fixed" @ionRefresh="pullRefresh">
        <IonRefresherContent />
      </IonRefresher>

      <MITopBar />

      <div class="home-shell">
        <!-- Greeting -->
        <header class="greet">
          <div class="mi-font-hand greet-sub">{{ greeting }} 👋</div>
          <h1 class="mi-font-display greet-title">
            What's happening at {{ auth.current?.property_name || 'your property' }}
          </h1>
        </header>

        <!-- Loading state on initial fetch only -->
        <div v-if="initialLoad && prop.loading" class="loading">
          <IonSpinner name="crescent" />
        </div>

        <!-- No property yet → invite to setup -->
        <EmptyState
          v-else-if="!auth.current"
          emoji="🏡"
          headline="No property linked"
          body="Ask your admin to add you to a property, or open the web app to create one."
        />

        <template v-else>
          <!-- KPI tiles -->
          <section class="kpi-grid">
            <div class="kpi">
              <div class="kpi-label">Arrivals today</div>
              <div class="kpi-value terra">{{ arrivalsToday.length }}</div>
              <div class="kpi-sub">{{ arrivalsToday.length === 0 ? 'Nobody arriving' : 'awaiting check-in' }}</div>
            </div>
            <div class="kpi">
              <div class="kpi-label">Departures</div>
              <div class="kpi-value sage">{{ departuresToday.length }}</div>
              <div class="kpi-sub">{{ departuresToday.length === 0 ? 'None today' : 'by check-out time' }}</div>
            </div>
            <div class="kpi">
              <div class="kpi-label">In-house</div>
              <div class="kpi-value terra-d">{{ inHouse.length }}</div>
              <div class="kpi-sub">currently staying</div>
            </div>
            <div class="kpi">
              <div class="kpi-label">Pending</div>
              <div class="kpi-value honey">{{ money(pendingDues) }}</div>
              <div class="kpi-sub">across active bookings</div>
            </div>
          </section>

          <!-- Today's arrivals list -->
          <section v-if="arrivalsToday.length" class="card">
            <div class="card-head">
              <h3 class="mi-font-display">Arrivals today</h3>
              <span class="count">{{ arrivalsToday.length }}</span>
            </div>
            <ul class="rows">
              <li v-for="b in arrivalsToday" :key="b.name" class="row">
                <div class="cell">
                  <div class="primary">{{ b.guest_name }}</div>
                  <div class="meta">{{ b.adults }}A · {{ b.children }}C · {{ b.nights }}n</div>
                </div>
                <div class="amt">{{ money(b.total_amount) }}</div>
              </li>
            </ul>
          </section>

          <!-- In-house -->
          <section v-if="inHouse.length" class="card">
            <div class="card-head">
              <h3 class="mi-font-display">In-house</h3>
              <span class="count">{{ inHouse.length }}</span>
            </div>
            <ul class="rows">
              <li v-for="b in inHouse" :key="b.name" class="row">
                <div class="cell">
                  <div class="primary">{{ b.guest_name }}</div>
                  <div class="meta">out {{ formatDateShort(b.check_out_date) }}</div>
                </div>
              </li>
            </ul>
          </section>

          <EmptyState
            v-if="!arrivalsToday.length && !departuresToday.length && !inHouse.length && !prop.bookings.length"
            emoji="📖"
            headline="Your reservation book is open"
            body="Add your first booking in the web app — it'll show up here."
            subtle
          />
        </template>
      </div>

      <MIBottomNav />
    </IonContent>
  </IonPage>
</template>

<style scoped>
.home-shell {
  padding: 16px 16px 96px;   /* room for bottom nav */
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.greet {
  margin-top: 4px;
}
.greet-sub {
  font-size: 20px;
  color: rgba(42, 34, 26, 0.55);
}
.greet-title {
  font-style: italic;
  font-weight: 600;
  font-size: 24px;
  line-height: 1.15;
  color: var(--mi-ink);
  margin: 2px 0 0;
}
.loading {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}
.kpi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.kpi {
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  border-radius: 14px;
  padding: 14px;
}
.kpi-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: rgba(42, 34, 26, 0.55);
}
.kpi-value {
  font-family: 'Lora', Georgia, serif;
  font-style: italic;
  font-weight: 600;
  font-size: 32px;
  line-height: 1;
  margin-top: 6px;
}
.kpi-value.terra   { color: var(--mi-terra); }
.kpi-value.terra-d { color: var(--mi-terra-d); }
.kpi-value.sage    { color: var(--mi-sage-d); }
.kpi-value.honey   { color: var(--mi-honey); font-size: 24px; }
.kpi-sub {
  font-size: 11px;
  color: rgba(42, 34, 26, 0.55);
  margin-top: 4px;
}
.card {
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  border-radius: 16px;
  overflow: hidden;
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--ion-border-color);
}
.card-head h3 {
  margin: 0;
  font-style: italic;
  font-weight: 600;
  font-size: 17px;
}
.count {
  font-size: 12px;
  color: rgba(42, 34, 26, 0.55);
}
.rows {
  list-style: none;
  margin: 0;
  padding: 0;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--ion-border-color);
}
.row:last-child { border-bottom: 0; }
.cell { flex: 1; min-width: 0; }
.primary {
  font-weight: 500;
  font-size: 14px;
  color: var(--mi-ink);
}
.meta {
  font-size: 11px;
  color: rgba(42, 34, 26, 0.55);
  margin-top: 2px;
}
.amt {
  font-weight: 600;
  font-size: 14px;
  color: var(--mi-ink);
}
</style>
