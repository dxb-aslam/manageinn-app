<!--
  CalendarPage — mobile per-room mini-calendar.

  Mirrors the web app's mobile calendar layout: 14-day grid (2 weeks),
  each room as its own row with the days as tappable cells.

  Tap an empty cell → opens NewBookingPage prefilled with room + date.
  Tap a cell with a booking → opens BookingDetailPage.
  Tap a cell with 2+ unassigned bookings → opens a small picker.

  Includes the virtual "Any [Type]" row before each type's units to show
  bookings without a specific unit picked yet.
-->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  IonContent, IonPage, IonRefresher, IonRefresherContent, IonSpinner,
  IonButton, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons,
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { addDays, isoDate, todayObj, todayISO, formatDateShort, parseDate } from '@/composables/useDates';
import { chevronBackOutline, chevronForwardOutline, closeOutline, addOutline } from 'ionicons/icons';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import EmptyState from '@/components/EmptyState.vue';

const router = useRouter();
const auth = useAuthStore();
const prop = usePropertyStore();

const weekOffset = ref(0);
const TODAY = todayObj();
const TODAY_ISO = todayISO();

const days = computed(() => {
  const start = addDays(TODAY, weekOffset.value * 7);
  return Array.from({ length: 14 }, (_, i) => {
    const d = addDays(start, i);
    const iso = isoDate(d);
    return {
      iso,
      day: d.getDate(),
      dow: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.getDay()],
      isToday: iso === TODAY_ISO,
      isPast: iso < TODAY_ISO,
    };
  });
});

const rangeLabel = computed(() => {
  const f = days.value[0].iso;
  const l = days.value[13].iso;
  return `${formatDateShort(f)} – ${formatDateShort(l)}`;
});

// Virtual + real rows. The "Any [Type]" row shows unassigned bookings.
interface DisplayRow {
  key: string;
  isVirtual: boolean;
  room_type: string;
  room_type_name: string;
  room_name: string;
  status: string | null;
  unit?: any;
}

const displayRows = computed<DisplayRow[]>(() => {
  const out: DisplayRow[] = [];
  for (const t of prop.roomTypes) {
    out.push({
      key: `__any__${t.name}`,
      isVirtual: true,
      room_type: t.name,
      room_type_name: t.room_type_name,
      room_name: `Any ${t.room_type_name}`,
      status: null,
    });
    for (const r of prop.rooms.filter((x) => x.room_type === t.name)) {
      out.push({
        key: r.name,
        isVirtual: false,
        room_type: r.room_type,
        room_type_name: t.room_type_name,
        room_name: r.room_name,
        status: r.status,
        unit: r,
      });
    }
  }
  return out;
});

function bookingsForCell(row: DisplayRow, dayIso: string) {
  return prop.bookings.filter((b) => {
    if (b.status === 'Cancelled') return false;
    if (!(dayIso >= b.check_in_date && dayIso < b.check_out_date)) return false;
    if (row.isVirtual) {
      return !b.room && b.room_type === row.room_type;
    }
    return b.room === row.key;
  });
}

function cellClass(row: DisplayRow, day: { iso: string; isToday: boolean; isPast: boolean }): string {
  const bs = bookingsForCell(row, day.iso);
  const lead = bs[0];
  let bg = '';
  if (lead) {
    if (lead.status === 'Checked In') bg = 'mi-cb-in';
    else if (lead.status === 'Confirmed') bg = 'mi-cb-conf';
    else if (lead.status === 'Enquiry') bg = 'mi-cb-enq';
    else if (lead.status === 'Checked Out') bg = 'mi-cb-out';
  } else if (day.isPast) {
    bg = 'mi-cb-past';
  }
  return [
    'cell',
    bg,
    day.isToday ? 'today' : '',
    bs.length > 1 ? 'stack' : '',
  ].filter(Boolean).join(' ');
}

function cellCount(row: DisplayRow, dayIso: string): number {
  return bookingsForCell(row, dayIso).length;
}

// Tap behaviour:
//   0 bookings → new booking with prefill
//   1 booking  → open detail
//   2+         → multi-picker sheet
const picker = ref<{ row: DisplayRow; day: { iso: string; isPast: boolean }; bookings: any[] } | null>(null);

function onCellTap(row: DisplayRow, day: { iso: string; isPast: boolean }): void {
  const bs = bookingsForCell(row, day.iso);
  if (bs.length === 0) {
    if (day.isPast) return;
    const prefill = row.isVirtual
      ? `?room_type=${encodeURIComponent(row.room_type)}&check_in=${day.iso}`
      : `?room_type=${encodeURIComponent(row.room_type)}&room=${encodeURIComponent(row.key)}&check_in=${day.iso}`;
    router.push(`/bookings/new${prefill}`);
    return;
  }
  if (bs.length === 1) {
    router.push(`/bookings/${encodeURIComponent(bs[0].name)}`);
    return;
  }
  picker.value = { row, day, bookings: bs };
}

function closePicker(): void {
  picker.value = null;
}
function pickerOpen(name: string): void {
  closePicker();
  router.push(`/bookings/${encodeURIComponent(name)}`);
}
function pickerNew(): void {
  if (!picker.value) return;
  const { row, day } = picker.value;
  closePicker();
  const prefill = row.isVirtual
    ? `?room_type=${encodeURIComponent(row.room_type)}&check_in=${day.iso}`
    : `?room_type=${encodeURIComponent(row.room_type)}&room=${encodeURIComponent(row.key)}&check_in=${day.iso}`;
  router.push(`/bookings/new${prefill}`);
}

async function load(): Promise<void> {
  if (!auth.current) return;
  if (!prop.bookings.length || !prop.rooms.length) {
    await prop.loadProperty(auth.current.name);
  }
}

async function pullRefresh(e: CustomEvent): Promise<void> {
  if (!auth.current) return;
  await prop.loadProperty(auth.current.name);
  (e.target as HTMLIonRefresherElement).complete();
}

onMounted(load);
watch(() => auth.current?.name, load);
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
          <div class="mi-font-hand head-sub">14 days at a glance</div>
          <h1 class="mi-font-display head-title">Calendar</h1>
        </header>

        <!-- Week nav -->
        <div class="weeknav">
          <IonButton fill="outline" size="small" @click="weekOffset--">
            <IonIcon slot="icon-only" :icon="chevronBackOutline" />
          </IonButton>
          <button class="today-btn" @click="weekOffset = 0">Today</button>
          <span class="range">{{ rangeLabel }}</span>
          <IonButton fill="outline" size="small" @click="weekOffset++">
            <IonIcon slot="icon-only" :icon="chevronForwardOutline" />
          </IonButton>
        </div>

        <EmptyState
          v-if="!prop.roomTypes.length"
          emoji="🗓️"
          headline="The calendar needs rooms"
          body="Add a room type and a few units in the web app, then come back."
        />

        <div v-else class="rooms">
          <article
            v-for="row in displayRows"
            :key="row.key"
            class="row"
            :class="{ virtual: row.isVirtual }"
          >
            <header class="row-head">
              <div class="row-title">
                <div v-if="row.isVirtual" class="r-name virtual-name">Any {{ row.room_type_name }}</div>
                <div v-else class="r-name">{{ row.room_name }} <span class="r-type">· {{ row.room_type_name }}</span></div>
                <div v-if="row.isVirtual" class="r-meta">Bookings without a specific room yet</div>
                <div v-else-if="row.status" class="r-meta">Currently {{ row.status }}</div>
              </div>
            </header>

            <!-- 7-day grid (two stacked weeks) -->
            <div class="weeks">
              <div class="dow">
                <span v-for="i in 7" :key="`dow-${i}`">{{ days[i - 1]?.dow }}</span>
              </div>
              <div class="dgrid">
                <button
                  v-for="day in days.slice(0, 7)"
                  :key="`${row.key}-${day.iso}`"
                  :class="cellClass(row, day)"
                  @click="onCellTap(row, day)"
                >
                  {{ day.day }}
                  <span v-if="cellCount(row, day.iso) > 1" class="badge">{{ cellCount(row, day.iso) }}</span>
                </button>
              </div>
              <div class="dgrid">
                <button
                  v-for="day in days.slice(7, 14)"
                  :key="`${row.key}-${day.iso}`"
                  :class="cellClass(row, day)"
                  @click="onCellTap(row, day)"
                >
                  {{ day.day }}
                  <span v-if="cellCount(row, day.iso) > 1" class="badge">{{ cellCount(row, day.iso) }}</span>
                </button>
              </div>
            </div>
          </article>
        </div>

        <p class="hint mi-font-hand">
          Tap a free date to book it · tap a coloured date to open · today is ringed
        </p>
      </div>

      <!-- Multi-booking picker -->
      <IonModal :is-open="!!picker" @didDismiss="closePicker">
        <IonHeader>
          <IonToolbar>
            <IonTitle class="mi-font-display title">
              <span v-if="picker">{{ formatDateShort(picker.day.iso) }} · {{ picker.row.room_name }}</span>
            </IonTitle>
            <IonButtons slot="end">
              <IonButton @click="closePicker">
                <IonIcon slot="icon-only" :icon="closeOutline" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent v-if="picker" class="ion-padding">
          <div class="picker-sub mi-font-hand">{{ picker.bookings.length }} bookings here</div>
          <ul class="picker-list">
            <li v-for="b in picker.bookings" :key="b.name">
              <button class="picker-row" @click="pickerOpen(b.name)">
                <div class="picker-cell">
                  <div class="picker-name">{{ b.guest_name }}</div>
                  <div class="picker-meta">
                    {{ formatDateShort(b.check_in_date) }} → {{ formatDateShort(b.check_out_date) }} · {{ b.status }}
                    <span v-if="!b.room" class="italic"> · no room yet</span>
                  </div>
                </div>
              </button>
            </li>
          </ul>
          <IonButton
            v-if="!picker.day.isPast"
            expand="block"
            class="mi-btn-tactile"
            @click="pickerNew"
          >
            <IonIcon slot="start" :icon="addOutline" />
            Add another on this date
          </IonButton>
        </IonContent>
      </IonModal>

      <MIBottomNav />
    </IonContent>
  </IonPage>
</template>

<style scoped>
.title { font-style: italic; font-weight: 600; }
.page { padding: 12px 16px 96px; }
.head { margin-bottom: 10px; }
.head-sub { font-size: 18px; color: rgba(42, 34, 26, 0.55); }
.head-title { font-style: italic; font-weight: 600; font-size: 30px; margin: 2px 0 4px; }

.weeknav {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.today-btn {
  font-size: 12px; font-weight: 500;
  padding: 6px 12px;
  border: 1px solid var(--ion-border-color);
  border-radius: 8px;
  background: var(--mi-paper);
  font-family: 'Lora', Georgia, serif;
  color: var(--mi-ink);
  cursor: pointer;
}
.range {
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: rgba(42, 34, 26, 0.65);
  text-align: center;
}

.rooms { display: flex; flex-direction: column; gap: 10px; }
.row {
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  border-radius: 14px;
  overflow: hidden;
}
.row.virtual {
  border-style: dashed;
  border-color: rgba(196, 101, 74, 0.3);
  background: rgba(196, 101, 74, 0.03);
}

.row-head { padding: 10px 14px; border-bottom: 1px solid var(--ion-border-color); }
.r-name {
  font-weight: 500;
  font-size: 14px;
  color: var(--mi-ink);
}
.r-name.virtual-name {
  font-style: italic;
  font-weight: 600;
  font-family: 'Lora', Georgia, serif;
  color: var(--mi-terra-d);
}
.r-type { font-weight: 400; color: rgba(42, 34, 26, 0.55); }
.r-meta {
  font-size: 11px;
  color: rgba(42, 34, 26, 0.55);
  margin-top: 2px;
  font-style: italic;
}

.weeks { padding: 8px 10px 12px; }
.dow {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 4px;
}
.dow span {
  text-align: center;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(42, 34, 26, 0.4);
}
.dgrid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-top: 4px;
}
.cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--mi-cream);
  border: 1px solid var(--ion-border-color);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(42, 34, 26, 0.75);
  cursor: pointer;
  position: relative;
  font-family: 'Lora', Georgia, serif;
}
.cell:active { transform: scale(0.95); }

.cell.mi-cb-in   { background: rgba(196, 101, 74, 0.18); color: var(--mi-terra-d); border-color: rgba(196, 101, 74, 0.4); }
.cell.mi-cb-conf { background: rgba(90, 122, 110, 0.15); color: var(--mi-sage-d); border-color: rgba(90, 122, 110, 0.4); }
.cell.mi-cb-enq  { background: rgba(212, 145, 46, 0.2);  color: var(--mi-honey-d); border-color: rgba(212, 145, 46, 0.4); }
.cell.mi-cb-out  { background: rgba(42, 34, 26, 0.06); color: rgba(42, 34, 26, 0.5); border-color: transparent; }
.cell.mi-cb-past { background: var(--mi-cream); color: rgba(42, 34, 26, 0.35); border-color: transparent; }
.cell.today      { outline: 2px solid var(--mi-honey); outline-offset: 1px; }
.cell.stack {
  box-shadow:
    inset 0 -3px 0 rgba(160, 74, 50, 0.35),
    inset 0 -6px 0 rgba(160, 74, 50, 0.18);
}

.badge {
  position: absolute;
  top: -4px; right: -4px;
  min-width: 16px; height: 16px;
  padding: 0 4px;
  background: var(--mi-terra-d);
  color: var(--mi-paper);
  font-size: 9px;
  font-weight: 700;
  border-radius: 999px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
}

.hint {
  text-align: center;
  font-size: 14px;
  color: rgba(42, 34, 26, 0.45);
  margin-top: 14px;
}

/* Picker modal */
.picker-sub {
  font-size: 18px;
  color: rgba(42, 34, 26, 0.55);
  margin-bottom: 12px;
}
.picker-list { list-style: none; margin: 0 0 16px; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.picker-row {
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--ion-border-color);
  border-radius: 12px;
  background: var(--mi-cream);
  cursor: pointer;
  font-family: 'Lora', Georgia, serif;
}
.picker-cell { flex: 1; }
.picker-name { font-weight: 500; font-size: 14px; color: var(--mi-ink); }
.picker-meta { font-size: 11px; color: rgba(42, 34, 26, 0.55); margin-top: 2px; }
.picker-meta .italic { font-style: italic; }
</style>
