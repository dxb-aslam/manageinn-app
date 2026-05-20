<!--
  CleaningTaskDetailPage — checklist editor + transitions.

  Loads one task via manageinn.api.get_cleaning_task. Lets the user:
    - Take it (if unassigned)
    - Check off items
    - Start cleaning / Mark done
    - Add notes

  Saves via manageinn.api.update_cleaning_task with the full items array
  (replacement, matching the web app).
-->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonButton, IonSpinner, IonInput, IonTextarea, IonCheckbox,
} from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/services/http';
import { ok, error as toastError } from '@/services/toast';

interface ChecklistItem {
  item_name: string;
  is_done: number | boolean;
  note?: string;
}

interface CleaningTaskFull {
  name: string;
  room: string;
  room_display?: string;
  task_type: string;
  status: string;
  assigned_to?: string;
  assigned_to_display?: string;
  scheduled_for?: string;
  started_at?: string;
  completed_at?: string;
  notes?: string;
  items: ChecklistItem[];
  booking?: string;
}

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const task = ref<CleaningTaskFull | null>(null);
const items = ref<ChecklistItem[]>([]);
const notes = ref('');
const newItem = ref('');
const loading = ref(true);
const saving = ref(false);

const taskName = computed(() => decodeURIComponent(String(route.params.name || '')));

async function load(): Promise<void> {
  loading.value = true;
  try {
    const t = await api<CleaningTaskFull>('manageinn.api.get_cleaning_task', { name: taskName.value });
    task.value = t;
    items.value = (t.items || []).map((i) => ({
      item_name: i.item_name,
      is_done: !!i.is_done,
      note: i.note || '',
    }));
    notes.value = t.notes || '';
  } catch (e: any) {
    await toastError(e?.message || 'Could not load task');
  } finally {
    loading.value = false;
  }
}

const completePct = computed(() => {
  if (!items.value.length) return 0;
  const done = items.value.filter((i) => i.is_done).length;
  return Math.round((done / items.value.length) * 100);
});

function addItem(): void {
  const v = newItem.value.trim();
  if (!v) return;
  items.value.push({ item_name: v, is_done: false, note: '' });
  newItem.value = '';
}

function removeItem(idx: number): void {
  items.value.splice(idx, 1);
}

async function save(): Promise<void> {
  if (!task.value || saving.value) return;
  saving.value = true;
  try {
    const updated = await api<CleaningTaskFull>('manageinn.api.update_cleaning_task', {
      name: task.value.name,
      items: items.value.map((i) => ({
        item_name: i.item_name,
        is_done: i.is_done ? 1 : 0,
        note: i.note || '',
      })),
      notes: notes.value,
    });
    task.value = updated;
    items.value = (updated.items || []).map((i) => ({
      item_name: i.item_name,
      is_done: !!i.is_done,
      note: i.note || '',
    }));
    await ok('Saved');
  } catch (e: any) {
    await toastError(e?.message || 'Could not save');
  } finally {
    saving.value = false;
  }
}

async function transition(status: string): Promise<void> {
  if (!task.value || saving.value) return;
  saving.value = true;
  try {
    const updated = await api<CleaningTaskFull>('manageinn.api.update_cleaning_task', {
      name: task.value.name,
      status,
      items: items.value.map((i) => ({
        item_name: i.item_name,
        is_done: i.is_done ? 1 : 0,
        note: i.note || '',
      })),
      notes: notes.value,
    });
    task.value = updated;
    if (status === 'Done') {
      await ok('Marked done');
      router.back();
    } else {
      await ok(`Status → ${status}`);
    }
  } catch (e: any) {
    await toastError(e?.message || 'Could not update status');
  } finally {
    saving.value = false;
  }
}

async function takeIt(): Promise<void> {
  if (!task.value || saving.value) return;
  saving.value = true;
  try {
    const updated = await api<CleaningTaskFull>('manageinn.api.assign_cleaning_task', {
      name: task.value.name,
      user: auth.user,
    });
    task.value = updated;
    await ok("You've got this");
  } catch (e: any) {
    await toastError(e?.message || 'Could not take task');
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton default-href="/cleaning" />
        </IonButtons>
        <IonTitle class="mi-font-display title">Task</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true">
      <div v-if="loading" class="loading">
        <IonSpinner name="crescent" />
      </div>

      <div v-else-if="!task" class="empty">
        Task not found.
      </div>

      <div v-else class="page">
        <!-- Header -->
        <section class="header card">
          <div class="head-row">
            <div>
              <div class="mi-font-hand small">{{ task.task_type }} · {{ task.status }}</div>
              <h2 class="mi-font-display room">{{ task.room_display || task.room }}</h2>
              <div v-if="task.booking" class="small muted">Booking {{ task.booking }}</div>
            </div>
          </div>

          <div class="hdr-meta">
            <div>
              <span class="muted small">Assigned to</span>
              <div class="medium">{{ task.assigned_to_display || (task.assigned_to ? task.assigned_to : 'Unassigned') }}</div>
            </div>
            <IonButton
              v-if="!task.assigned_to"
              fill="outline"
              size="small"
              :disabled="saving"
              @click="takeIt"
            >
              Take it
            </IonButton>
          </div>

          <div v-if="task.started_at || task.completed_at" class="small muted">
            <span v-if="task.started_at">Started {{ new Date(task.started_at).toLocaleString() }}</span>
            <span v-if="task.completed_at"> · Completed {{ new Date(task.completed_at).toLocaleString() }}</span>
          </div>
        </section>

        <!-- Progress + checklist -->
        <section class="card">
          <div class="card-head">
            <h3 class="mi-font-display">Checklist</h3>
            <span class="muted small">{{ completePct }}% complete</span>
          </div>
          <div class="bar">
            <div class="bar-fill" :style="{ width: completePct + '%' }"></div>
          </div>

          <ul class="items">
            <li v-for="(item, idx) in items" :key="idx" class="item">
              <IonCheckbox v-model="item.is_done" />
              <div class="item-body">
                <IonInput v-model="item.item_name" placeholder="Item" class="item-name" :class="{ done: item.is_done }" />
                <IonInput v-model="item.note" placeholder="Add a note…" class="item-note" />
              </div>
              <button class="item-x" @click="removeItem(idx)" v-if="!item.is_done">×</button>
            </li>
          </ul>

          <div class="add-row">
            <IonInput
              v-model="newItem"
              placeholder="Add a checklist item…"
              @keydown.enter.prevent="addItem"
              class="add-input"
            />
            <IonButton size="small" @click="addItem">Add</IonButton>
          </div>
        </section>

        <!-- Notes -->
        <section class="card">
          <div class="card-head"><h3 class="mi-font-display">Notes</h3></div>
          <IonTextarea
            v-model="notes"
            :rows="3"
            placeholder="Anything to flag (broken AC, missing key, etc.)"
            class="notes-ta"
          />
        </section>

        <!-- Actions -->
        <section class="actions">
          <IonButton
            v-if="task.status === 'Pending'"
            expand="block"
            fill="outline"
            color="warning"
            :disabled="saving"
            @click="transition('In Progress')"
          >
            Start cleaning
          </IonButton>
          <IonButton
            v-if="task.status !== 'Done'"
            expand="block"
            class="mi-btn-tactile"
            color="success"
            :disabled="saving"
            @click="transition('Done')"
          >
            <IonSpinner v-if="saving" name="crescent" />
            <span v-else>Mark done</span>
          </IonButton>
          <IonButton
            expand="block"
            fill="clear"
            :disabled="saving"
            @click="save"
          >
            Just save
          </IonButton>
        </section>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.title { font-style: italic; font-weight: 600; }
.loading { display: flex; justify-content: center; padding: 80px 0; }
.empty {
  text-align: center;
  padding: 80px 24px;
  color: rgba(42, 34, 26, 0.55);
}
.page {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.card {
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  border-radius: 16px;
  padding: 14px 16px;
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.card-head h3 { margin: 0; font-style: italic; font-weight: 600; font-size: 16px; }

.head-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.room { font-style: italic; font-weight: 600; font-size: 22px; margin: 2px 0 0; line-height: 1.1; }
.small { font-size: 12px; }
.muted { color: rgba(42, 34, 26, 0.55); }
.medium { font-weight: 500; font-size: 14px; }

.hdr-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 14px;
}

.bar {
  height: 4px;
  background: rgba(42, 34, 26, 0.08);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;
}
.bar-fill {
  height: 100%;
  background: var(--mi-sage-d);
  transition: width 0.2s;
}

.items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--mi-cream);
  border: 1px solid var(--ion-border-color);
  border-radius: 10px;
}
.item-body { flex: 1; min-width: 0; }
.item-name {
  --color: var(--mi-ink);
  --padding-start: 0;
  font-family: 'Lora', Georgia, serif;
  font-size: 14px;
  font-weight: 500;
}
.item-name.done {
  --color: rgba(42, 34, 26, 0.5);
  text-decoration: line-through;
}
.item-note {
  --color: rgba(42, 34, 26, 0.55);
  --padding-start: 0;
  font-size: 12px;
  margin-top: 2px;
}
.item-x {
  border: 0;
  background: transparent;
  color: rgba(42, 34, 26, 0.45);
  font-size: 18px;
  width: 24px; height: 24px;
  border-radius: 50%;
  cursor: pointer;
}
.item-x:hover { background: rgba(42, 34, 26, 0.08); color: var(--mi-terra-d); }

.add-row { display: flex; gap: 8px; margin-top: 10px; }
.add-input {
  flex: 1;
  --background: var(--mi-cream);
  --padding-start: 10px;
  --padding-end: 10px;
  border: 1px solid var(--ion-border-color);
  border-radius: 8px;
  font-family: 'Lora', Georgia, serif;
  font-size: 14px;
}

.notes-ta {
  --background: var(--mi-cream);
  --padding-start: 10px;
  --padding-end: 10px;
  border: 1px solid var(--ion-border-color);
  border-radius: 8px;
  min-height: 80px;
  font-family: 'Lora', Georgia, serif;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
  padding-bottom: 24px;
}
</style>
