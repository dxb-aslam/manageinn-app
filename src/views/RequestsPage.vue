<!--
  RequestsPage — guest requests inbox.

  Lists requests from the in-room QR portal. Filter pills (New / In progress
  / Delivered / Closed / All). Tap a row to expand → see items + take
  action (Acknowledge / Delivered / Closed).

  Different mental model from Cleaning: requests are short-lived pings
  that auto-trigger Cleaning Tasks (for "Request cleaning") but the
  Request itself just needs to be acknowledged. No edit modal needed.
-->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  IonContent, IonPage, IonRefresher, IonRefresherContent, IonSpinner,
  IonButton,
} from '@ionic/vue';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/services/http';
import { ok, error as toastError } from '@/services/toast';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import EmptyState from '@/components/EmptyState.vue';

interface RequestItem {
  item_name: string;
  qty: number;
  icon?: string;
  note?: string;
}

interface GuestRequest {
  name: string;
  property: string;
  room: string;
  room_display?: string;
  request_type: string;
  status: string;
  requested_at: string;
  responded_at?: string;
  responded_by?: string;
  responded_by_display?: string;
  details?: string;
  response_note?: string;
  items?: RequestItem[];
}

const auth = useAuthStore();
const requests = ref<GuestRequest[]>([]);
const loading = ref(false);
const filter = ref<string>('New');
const expanded = ref<Record<string, boolean>>({});

const filters = [
  { id: 'all',          label: 'All' },
  { id: 'New',          label: 'New' },
  { id: 'Acknowledged', label: 'In progress' },
  { id: 'Delivered',    label: 'Delivered' },
  { id: 'Closed',       label: 'Closed' },
];

async function load(): Promise<void> {
  if (!auth.current) return;
  loading.value = true;
  try {
    requests.value = await api<GuestRequest[]>('manageinn.api.list_guest_requests', {
      property: auth.current.name,
    });
  } catch (e: any) {
    await toastError(e?.message || 'Could not load requests');
  } finally {
    loading.value = false;
  }
}

async function pullRefresh(e: CustomEvent): Promise<void> {
  await load();
  (e.target as HTMLIonRefresherElement).complete();
}

async function transition(req: GuestRequest, status: string): Promise<void> {
  try {
    const updated = await api<GuestRequest>('manageinn.api.update_guest_request', {
      name: req.name,
      status,
    });
    const idx = requests.value.findIndex((r) => r.name === req.name);
    if (idx >= 0) requests.value[idx] = { ...requests.value[idx], ...updated };
    await ok(`${status} · ${req.room_display || req.room}`);
  } catch (e: any) {
    await toastError(e?.message || 'Could not update');
  }
}

onMounted(load);
watch(() => auth.current?.name, load);

const visible = computed(() =>
  filter.value === 'all'
    ? requests.value
    : requests.value.filter((r) => r.status === filter.value),
);

const counts = computed(() => {
  const c: Record<string, number> = { all: requests.value.length };
  for (const r of requests.value) c[r.status] = (c[r.status] || 0) + 1;
  return c;
});

function toggle(name: string): void {
  expanded.value[name] = !expanded.value[name];
}

function typeIcon(t: string): string {
  return { Cleaning: '🧹', Amenity: '🧺', Other: '💬' }[t] || '📨';
}

function statusColor(s: string): string {
  return {
    'New':          'mi-stat-terra',
    'Acknowledged': 'mi-stat-honey',
    'Delivered':    'mi-stat-sage',
    'Closed':       'mi-stat-ink',
  }[s] || 'mi-stat-ink';
}

function fmtTime(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short',
  });
}
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
          <div class="mi-font-hand head-sub">pings from your guests</div>
          <h1 class="mi-font-display head-title">Requests</h1>
        </header>

        <div class="pills">
          <button
            v-for="f in filters"
            :key="f.id"
            class="pill"
            :class="{ active: filter === f.id }"
            @click="filter = f.id"
          >
            {{ f.label }}
            <span v-if="counts[f.id]" class="count">{{ counts[f.id] }}</span>
          </button>
        </div>

        <div v-if="loading && !requests.length" class="loading">
          <IonSpinner name="crescent" />
        </div>

        <EmptyState
          v-else-if="!visible.length"
          emoji="📭"
          :headline="filter === 'all' ? 'No guest pings yet' : 'Nothing in this filter'"
          :body="filter === 'all' ? 'When a guest scans their room QR and taps Request cleaning or Need anything?, it lands here.' : ''"
        />

        <ul v-else class="rows">
          <li v-for="r in visible" :key="r.name" class="row">
            <div class="head-row" @click="toggle(r.name)">
              <div class="icon-pill">{{ typeIcon(r.request_type) }}</div>
              <div class="cell">
                <div class="top">
                  <span class="room">{{ r.room_display || r.room }}</span>
                  <span class="type">{{ r.request_type }}</span>
                </div>
                <div class="mid">
                  {{ fmtTime(r.requested_at) }}
                  <span v-if="r.items && r.items.length" class="items-summary">
                    · {{ r.items.map((i) => `${i.qty}× ${i.item_name}`).join(', ') }}
                  </span>
                  <span v-if="r.details && (!r.items || !r.items.length)" class="items-summary">
                    · "{{ r.details }}"
                  </span>
                </div>
              </div>
              <span class="status" :class="statusColor(r.status)">{{ r.status }}</span>
            </div>

            <!-- Expanded: chips of items + action buttons -->
            <div v-if="expanded[r.name]" class="expanded">
              <div v-if="r.items && r.items.length" class="chips">
                <span v-for="(it, idx) in r.items" :key="idx" class="chip">
                  <span class="chip-icon">{{ it.icon || '•' }}</span>
                  <strong>{{ it.qty }}×</strong> {{ it.item_name }}
                </span>
              </div>
              <p v-if="r.details" class="italic note">"{{ r.details }}"</p>

              <div class="action-row">
                <IonButton v-if="r.status === 'New'" size="small" fill="outline" color="warning" @click="transition(r, 'Acknowledged')">
                  Acknowledge
                </IonButton>
                <IonButton v-if="r.status !== 'Delivered' && r.status !== 'Closed'" size="small" fill="outline" color="success" @click="transition(r, 'Delivered')">
                  Delivered
                </IonButton>
                <IonButton v-if="r.status !== 'Closed'" size="small" fill="clear" @click="transition(r, 'Closed')">
                  Close
                </IonButton>
              </div>
              <div v-if="r.responded_by_display" class="hand-by">
                Handled by {{ r.responded_by_display }} · {{ fmtTime(r.responded_at) }}
              </div>
            </div>
          </li>
        </ul>
      </div>

      <MIBottomNav />
    </IonContent>
  </IonPage>
</template>

<style scoped>
.page { padding: 12px 16px 96px; }
.head { margin-bottom: 10px; }
.head-sub { font-size: 18px; color: rgba(42, 34, 26, 0.55); }
.head-title { font-style: italic; font-weight: 600; font-size: 30px; margin: 2px 0 4px; }

.pills {
  display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none;
  padding: 0 0 14px; margin: 0 -16px; padding-left: 16px;
}
.pills::-webkit-scrollbar { display: none; }
.pill {
  flex-shrink: 0; padding: 6px 14px; font-size: 12px; font-weight: 500;
  border-radius: 999px; background: var(--mi-paper);
  border: 1px solid var(--ion-border-color); color: rgba(42, 34, 26, 0.7);
  font-family: 'Lora', Georgia, serif;
  display: inline-flex; align-items: center; gap: 6px;
}
.pill.active { background: var(--mi-ink); color: var(--mi-paper); border-color: var(--mi-ink); }
.pill .count { font-size: 11px; opacity: 0.75; }

.loading { display: flex; justify-content: center; padding: 60px 0; }
.rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }

.row {
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  border-radius: 14px;
  overflow: hidden;
}
.head-row {
  display: flex;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  align-items: center;
}
.icon-pill {
  width: 40px; height: 40px; border-radius: 11px;
  background: rgba(196, 101, 74, 0.1);
  display: flex; align-items: center; justify-content: center;
  font-size: 19px;
  flex-shrink: 0;
}
.cell { flex: 1; min-width: 0; }
.top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.room {
  font-style: italic;
  font-family: 'Lora', Georgia, serif;
  font-weight: 600;
  font-size: 14px;
}
.type {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  color: rgba(42, 34, 26, 0.55);
}
.mid {
  margin-top: 3px;
  font-size: 11px;
  color: rgba(42, 34, 26, 0.55);
  line-height: 1.3;
}
.items-summary { word-break: break-word; }

.status {
  font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em;
  font-weight: 600; padding: 4px 8px; border-radius: 999px; border: 1px solid;
  white-space: nowrap;
}
.status.mi-stat-terra { background: #fef2f2; color: var(--mi-terra-d); border-color: rgba(196, 101, 74, 0.3); }
.status.mi-stat-honey { background: rgba(212, 145, 46, 0.15); color: var(--mi-honey-d); border-color: rgba(212, 145, 46, 0.4); }
.status.mi-stat-sage  { background: rgba(90, 122, 110, 0.15); color: var(--mi-sage-d); border-color: rgba(90, 122, 110, 0.4); }
.status.mi-stat-ink   { background: rgba(42, 34, 26, 0.06); color: rgba(42, 34, 26, 0.55); border-color: rgba(42, 34, 26, 0.2); }

.expanded {
  padding: 0 12px 12px 60px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid var(--ion-border-color);
  padding-top: 10px;
  margin-top: 4px;
}
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip {
  font-size: 11px;
  padding: 3px 8px;
  background: var(--mi-cream);
  border: 1px solid var(--ion-border-color);
  border-radius: 6px;
  font-weight: 500;
}
.chip-icon { margin-right: 3px; }

.italic.note { font-style: italic; font-size: 12px; color: rgba(42, 34, 26, 0.55); margin: 0; }

.action-row { display: flex; gap: 6px; flex-wrap: wrap; }

.hand-by {
  font-size: 10px;
  color: rgba(42, 34, 26, 0.45);
  margin-top: 2px;
}
</style>
