<!--
  CleaningPage — list of cleaning tasks scoped to the current property.

  Mirrors the web app's Cleaning.vue. Filter pills (Pending / In progress /
  Done / All). Each row shows the room, task type, assignee, checklist
  progress, status pill. Tap → /cleaning/<task name>.

  Cleaning Staff see only tasks assigned to them or unassigned — the
  backend list_cleaning_tasks endpoint enforces that scope. No client-side
  filtering needed for permissions.
-->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  IonContent, IonPage, IonRefresher, IonRefresherContent, IonSpinner,
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/services/http';
import { formatDateShort } from '@/composables/useDates';
import { error as toastError } from '@/services/toast';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import EmptyState from '@/components/EmptyState.vue';

interface CleaningTask {
  name: string;
  property: string;
  room: string;
  room_display?: string;
  room_type?: string;
  booking?: string;
  task_type: string;
  status: string;
  assigned_to?: string;
  assigned_to_display?: string;
  scheduled_for?: string;
  started_at?: string;
  completed_at?: string;
  items_total?: number;
  items_done?: number;
  notes?: string;
}

const router = useRouter();
const auth = useAuthStore();

const tasks = ref<CleaningTask[]>([]);
const loading = ref(false);
const filter = ref<string>('Pending');

const filters = [
  { id: 'all',         label: 'All' },
  { id: 'Pending',     label: 'Pending' },
  { id: 'In Progress', label: 'In progress' },
  { id: 'Done',        label: 'Done' },
];

async function load(): Promise<void> {
  if (!auth.current) return;
  loading.value = true;
  try {
    tasks.value = await api<CleaningTask[]>('manageinn.api.list_cleaning_tasks', {
      property: auth.current.name,
    });
  } catch (e: any) {
    await toastError(e?.message || 'Could not load cleaning tasks');
  } finally {
    loading.value = false;
  }
}

async function pullRefresh(e: CustomEvent): Promise<void> {
  await load();
  (e.target as HTMLIonRefresherElement).complete();
}

onMounted(load);
watch(() => auth.current?.name, load);

const visible = computed(() => {
  const list = filter.value === 'all'
    ? tasks.value
    : tasks.value.filter((t) => t.status === filter.value);
  return [...list].sort((a, b) => {
    // Active states first, then by scheduled date desc
    const order: Record<string, number> = { 'Pending': 0, 'In Progress': 1, 'Done': 2, 'Skipped': 3 };
    const ds = (order[a.status] ?? 99) - (order[b.status] ?? 99);
    if (ds !== 0) return ds;
    return (b.scheduled_for || '').localeCompare(a.scheduled_for || '');
  });
});

const counts = computed(() => {
  const c: Record<string, number> = { all: tasks.value.length };
  for (const t of tasks.value) c[t.status] = (c[t.status] || 0) + 1;
  return c;
});

function progress(t: CleaningTask): number {
  if (!t.items_total) return 0;
  return Math.round(((t.items_done || 0) / t.items_total) * 100);
}

function typeColor(t: string): string {
  return {
    'Checkout':    'mi-type-terra',
    'Mid-stay':    'mi-type-honey',
    'Daily':       'mi-type-sage',
    'Maintenance': 'mi-type-ink',
  }[t] || 'mi-type-ink';
}
function statusColor(s: string): string {
  return {
    'Pending':     'mi-stat-terra',
    'In Progress': 'mi-stat-honey',
    'Done':        'mi-stat-sage',
    'Skipped':     'mi-stat-ink',
  }[s] || 'mi-stat-ink';
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
          <div class="mi-font-hand head-sub">today's queue · gloves on</div>
          <h1 class="mi-font-display head-title">Cleaning</h1>
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

        <div v-if="loading && !tasks.length" class="loading">
          <IonSpinner name="crescent" />
        </div>

        <EmptyState
          v-else-if="!visible.length"
          emoji="🧹"
          :headline="filter === 'all' ? 'No cleaning tasks yet' : 'Nothing in this filter'"
          :body="filter === 'all' ? 'Tasks auto-spawn when bookings check out, or when a guest taps "Request cleaning".' : ''"
        />

        <ul v-else class="rows">
          <li
            v-for="t in visible"
            :key="t.name"
            class="row mi-lift"
            @click="router.push(`/cleaning/${encodeURIComponent(t.name)}`)"
          >
            <div class="icon-pill" :class="typeColor(t.task_type)">
              <span v-if="t.task_type === 'Checkout'">🧹</span>
              <span v-else-if="t.task_type === 'Mid-stay'">🧺</span>
              <span v-else-if="t.task_type === 'Daily'">☀️</span>
              <span v-else>🔧</span>
            </div>
            <div class="cell">
              <div class="top">
                <span class="room">{{ t.room_display || t.room }}</span>
                <span class="type-pill" :class="typeColor(t.task_type)">{{ t.task_type }}</span>
              </div>
              <div class="mid">
                <span class="assignee">{{ t.assigned_to_display || (t.assigned_to ? t.assigned_to : 'Unassigned') }}</span>
                <span v-if="t.items_total" class="dot">·</span>
                <span v-if="t.items_total">{{ t.items_done }}/{{ t.items_total }}</span>
                <span v-if="t.scheduled_for" class="dot">·</span>
                <span v-if="t.scheduled_for">{{ formatDateShort(t.scheduled_for) }}</span>
              </div>
              <div v-if="t.items_total" class="bar">
                <div class="bar-fill" :style="{ width: progress(t) + '%' }"></div>
              </div>
            </div>
            <span class="status" :class="statusColor(t.status)">{{ t.status }}</span>
          </li>
        </ul>
      </div>

      <MIBottomNav />
    </IonContent>
  </IonPage>
</template>

<style scoped>
.page {
  padding: 12px 16px 96px;
}
.head { margin-bottom: 10px; }
.head-sub { font-size: 18px; color: rgba(42, 34, 26, 0.55); }
.head-title { font-style: italic; font-weight: 600; font-size: 30px; margin: 2px 0 4px; }

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
  display: inline-flex; align-items: center; gap: 6px;
}
.pill.active { background: var(--mi-ink); color: var(--mi-paper); border-color: var(--mi-ink); }
.pill .count { font-size: 11px; opacity: 0.75; }

.loading { display: flex; justify-content: center; padding: 60px 0; }
.rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.row {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  border-radius: 14px;
  cursor: pointer;
  align-items: center;
}
.icon-pill {
  width: 40px; height: 40px;
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 19px;
  flex-shrink: 0;
}
.icon-pill.mi-type-terra { background: rgba(196, 101, 74, 0.15); }
.icon-pill.mi-type-honey { background: rgba(212, 145, 46, 0.15); }
.icon-pill.mi-type-sage  { background: rgba(90, 122, 110, 0.15); }
.icon-pill.mi-type-ink   { background: rgba(42, 34, 26, 0.08); }

.cell { flex: 1; min-width: 0; }
.top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.room {
  font-style: italic;
  font-family: 'Lora', Georgia, serif;
  font-weight: 600;
  font-size: 14px;
}
.type-pill {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
}
.type-pill.mi-type-terra { background: rgba(196, 101, 74, 0.15); color: var(--mi-terra-d); }
.type-pill.mi-type-honey { background: rgba(212, 145, 46, 0.15); color: var(--mi-honey-d); }
.type-pill.mi-type-sage  { background: rgba(90, 122, 110, 0.15); color: var(--mi-sage-d); }
.type-pill.mi-type-ink   { background: rgba(42, 34, 26, 0.08);  color: rgba(42, 34, 26, 0.7); }

.mid {
  margin-top: 3px;
  font-size: 11px;
  color: rgba(42, 34, 26, 0.55);
  display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
}
.dot { color: rgba(42, 34, 26, 0.3); }
.assignee { font-style: italic; }

.bar {
  margin-top: 6px;
  height: 3px;
  background: rgba(42, 34, 26, 0.08);
  border-radius: 2px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--mi-sage), var(--mi-sage-d));
  transition: width 0.2s;
}

.status {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid;
  white-space: nowrap;
}
.status.mi-stat-terra { background: #fef2f2; color: var(--mi-terra-d); border-color: rgba(196, 101, 74, 0.3); }
.status.mi-stat-honey { background: rgba(212, 145, 46, 0.15); color: var(--mi-honey-d); border-color: rgba(212, 145, 46, 0.4); }
.status.mi-stat-sage  { background: rgba(90, 122, 110, 0.15); color: var(--mi-sage-d); border-color: rgba(90, 122, 110, 0.4); }
.status.mi-stat-ink   { background: rgba(42, 34, 26, 0.06); color: rgba(42, 34, 26, 0.55); border-color: rgba(42, 34, 26, 0.2); }
</style>
