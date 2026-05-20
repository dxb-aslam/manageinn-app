<!--
  BookingsPage — mobile bookings list. Same filter pills + search +
  card layout the web app's Bookings.vue uses, adapted to ion-content.

  Tapping a row pushes to /bookings/<name> → BookingDetailPage.
-->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  IonContent, IonPage, IonRefresher, IonRefresherContent, IonSearchbar,
  IonFab, IonFabButton, IonIcon,
} from '@ionic/vue';
import { addOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { useCurrency } from '@/composables/useCurrency';
import { formatDateShort, initials } from '@/composables/useDates';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import EmptyState from '@/components/EmptyState.vue';

const router = useRouter();
const auth = useAuthStore();
const prop = usePropertyStore();
const { money } = useCurrency();

const filter = ref<string>('all');
const search = ref('');

const filters = [
  { id: 'all',         label: 'All' },
  { id: 'Enquiry',     label: 'Enquiries' },
  { id: 'Confirmed',   label: 'Upcoming' },
  { id: 'Checked In',  label: 'In-house' },
  { id: 'Checked Out', label: 'Past' },
];

const visible = computed(() => {
  const q = search.value.trim().toLowerCase();
  let list = filter.value === 'all'
    ? prop.bookings
    : prop.bookings.filter((b) => b.status === filter.value);
  if (q) {
    list = list.filter((b) => {
      const hay = [b.guest_name, b.guest_phone, b.guest_email, b.name].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }
  return [...list].sort((a, b) => (b.check_in_date || '').localeCompare(a.check_in_date || ''));
});

const empty = computed(() => prop.bookings.length === 0);

async function load(): Promise<void> {
  if (!auth.current) return;
  await prop.loadProperty(auth.current.name);
}

async function pullRefresh(e: CustomEvent): Promise<void> {
  await load();
  (e.target as HTMLIonRefresherElement).complete();
}

function openBooking(name: string): void {
  router.push(`/bookings/${encodeURIComponent(name)}`);
}

onMounted(() => {
  if (prop.bookings.length === 0) load();
});
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="true">
      <IonRefresher slot="fixed" @ionRefresh="pullRefresh">
        <IonRefresherContent />
      </IonRefresher>

      <MITopBar />

      <div class="page">
        <header class="head">
          <div class="mi-font-hand head-sub">your reservation book</div>
          <h1 class="mi-font-display head-title">Bookings</h1>
        </header>

        <IonSearchbar
          v-model="search"
          placeholder="Search by guest, phone, BK-…"
          :debounce="200"
          class="mi-search"
        />

        <div class="pills">
          <button
            v-for="f in filters"
            :key="f.id"
            class="pill"
            :class="{ active: filter === f.id }"
            @click="filter = f.id"
          >
            {{ f.label }}
          </button>
        </div>

        <EmptyState
          v-if="empty"
          emoji="📖"
          headline="Your reservation book is open"
          body="Add your first booking in the web app — it'll appear here."
        />

        <EmptyState
          v-else-if="!visible.length"
          subtle
          emoji="🔍"
          :headline="search ? `No bookings match “${search}”` : 'Nothing in this filter'"
          :body="search ? 'Try clearing the search or pick another filter.' : ''"
        />

        <ul v-else class="rows">
          <li
            v-for="b in visible"
            :key="b.name"
            class="row mi-lift"
            @click="openBooking(b.name)"
          >
            <div class="avatar">{{ initials(b.guest_name) }}</div>
            <div class="cell">
              <div class="top">
                <span class="guest">{{ b.guest_name }}</span>
                <span class="amount">{{ money(b.total_amount) }}</span>
              </div>
              <div class="mid">
                {{ formatDateShort(b.check_in_date) }} → {{ formatDateShort(b.check_out_date) }}
                <span class="dot">·</span>
                {{ b.nights }}n
              </div>
              <div class="foot">
                <StatusBadge :status="b.status" />
                <span v-if="(b.total_amount || 0) > (b.advance_paid || 0)" class="due">
                  {{ money((b.total_amount || 0) - (b.advance_paid || 0)) }} due
                </span>
                <span v-else class="paid">Paid</span>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Floating new-booking button — admin + booking agent only.
           Position above the bottom nav so it doesn't overlap. -->
      <IonFab
        v-if="auth.is_admin || auth.current?.my_role === 'Booking Agent' || auth.is_sys_admin"
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        style="margin-bottom: 70px;"
      >
        <IonFabButton color="primary" @click="router.push('/bookings/new')">
          <IonIcon :icon="addOutline" />
        </IonFabButton>
      </IonFab>

      <MIBottomNav />
    </IonContent>
  </IonPage>
</template>

<style scoped>
.page {
  padding: 12px 16px 96px;
}
.head {
  margin-bottom: 10px;
}
.head-sub {
  font-size: 18px;
  color: rgba(42, 34, 26, 0.55);
}
.head-title {
  font-style: italic;
  font-weight: 600;
  font-size: 30px;
  margin: 2px 0 4px;
}
.mi-search {
  --background: var(--mi-paper);
  --border-radius: 12px;
  padding: 0 0 8px;
}
.pills {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0 0 14px;
  margin: 0 -16px;
  padding-left: 16px;
}
.pills::-webkit-scrollbar { display: none; }
.pill {
  flex-shrink: 0;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 999px;
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  color: rgba(42, 34, 26, 0.7);
  font-family: 'Lora', Georgia, serif;
}
.pill.active {
  background: var(--mi-ink);
  color: var(--mi-paper);
  border-color: var(--mi-ink);
}
.rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.row {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  border-radius: 14px;
  cursor: pointer;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(42, 34, 26, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
  flex-shrink: 0;
}
.cell { flex: 1; min-width: 0; }
.top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.guest {
  font-weight: 500;
  font-size: 14px;
  color: var(--mi-ink);
}
.amount {
  font-weight: 600;
  font-size: 14px;
  font-style: italic;
  font-family: 'Lora', Georgia, serif;
}
.mid {
  font-size: 12px;
  color: rgba(42, 34, 26, 0.55);
  margin-top: 2px;
}
.dot { color: rgba(42, 34, 26, 0.3); }
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}
.due {
  font-size: 11px;
  font-weight: 500;
  color: var(--mi-terra-d);
}
.paid {
  font-size: 11px;
  font-weight: 500;
  color: var(--mi-sage-d);
}
</style>
