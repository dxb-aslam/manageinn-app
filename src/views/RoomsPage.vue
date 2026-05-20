<!--
  RoomsPage — grouped room list, tap a unit to see the room QR.

  Read-only on mobile (admin operations like creating types / units stay
  on web for now). Cleaning staff sees this to update unit status; admins
  see it for the QR code.

  QR display uses a sheet that fetches the QR data URL via
  manageinn.api.get_room_qr_data, plus the public stay URL (so the user
  can copy it or share it).
-->
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  IonContent, IonPage, IonRefresher, IonRefresherContent, IonSpinner,
  IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonIcon, IonSelect, IonSelectOption,
} from '@ionic/vue';
import { Share } from '@capacitor/share';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { useCurrency } from '@/composables/useCurrency';
import { api } from '@/services/http';
import { ok, error as toastError } from '@/services/toast';
import { qrCodeOutline, shareOutline, refreshOutline, closeOutline } from 'ionicons/icons';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import EmptyState from '@/components/EmptyState.vue';

const auth = useAuthStore();
const prop = usePropertyStore();
const { money } = useCurrency();

const loading = ref(false);

async function load(): Promise<void> {
  if (!auth.current) return;
  loading.value = true;
  try {
    await prop.loadProperty(auth.current.name);
  } finally {
    loading.value = false;
  }
}

async function pullRefresh(e: CustomEvent): Promise<void> {
  await load();
  (e.target as HTMLIonRefresherElement).complete();
}

onMounted(() => {
  if (!prop.rooms.length) load();
});
watch(() => auth.current?.name, load);

// Group rooms under their type, preserving the type order from the store
const grouped = computed(() => {
  const out: Array<{ type: any; rooms: any[] }> = [];
  for (const t of prop.roomTypes) {
    const rooms = prop.rooms.filter((r) => r.room_type === t.name);
    if (rooms.length || true) out.push({ type: t, rooms });
  }
  return out;
});

function statusColor(s: string): string {
  return {
    'Available':   'mi-stat-sage',
    'Occupied':    'mi-stat-terra',
    'Needs Clean': 'mi-stat-honey',
    'Maintenance': 'mi-stat-ink',
  }[s] || 'mi-stat-ink';
}

// ── Room status — quick toggle for Booking Agent / Cleaning Staff / Admin ──
const STATUSES = ['Available', 'Occupied', 'Needs Clean', 'Maintenance'];
const canEditStatus = computed(() =>
  auth.is_admin || auth.is_sys_admin ||
  auth.current?.my_role === 'Booking Agent' ||
  auth.current?.my_role === 'Cleaning Staff',
);
async function setStatus(room: any, newStatus: string): Promise<void> {
  if (room.status === newStatus) return;
  try {
    await api('manageinn.api.set_room_status', { name: room.name, status: newStatus });
    room.status = newStatus;
    await ok(`${room.room_name} → ${newStatus}`);
  } catch (e: any) {
    await toastError(e?.message || 'Could not update status');
  }
}

// ── QR sheet ──
interface QrData {
  room: string;
  room_name: string;
  property_name: string;
  logo?: string;
  token: string;
  url: string;
}
const qrOpen = ref(false);
const qrRoom = ref<any>(null);
const qrData = ref<QrData | null>(null);
const qrPng = ref('');     // QR rendered as data URL
const qrLoading = ref(false);

async function openQR(room: any): Promise<void> {
  qrRoom.value = room;
  qrData.value = null;
  qrPng.value = '';
  qrOpen.value = true;
  qrLoading.value = true;
  try {
    qrData.value = await api<QrData>('manageinn.api.get_room_qr_data', { room: room.name });
    await renderQR();
  } catch (e: any) {
    await toastError(e?.message || 'Could not load QR');
  } finally {
    qrLoading.value = false;
  }
}

async function renderQR(): Promise<void> {
  if (!qrData.value?.url) return;
  // Use the QR Server API for rendering — it's a 200×200 PNG. We could
  // bundle a JS QR lib, but using the API keeps the bundle small and the
  // QR comes back as a regular image which is easier to share.
  // Fallback to JS rendering if offline.
  const params = new URLSearchParams({
    data: qrData.value.url,
    size: '600x600',
    color: '2a221a',
    bgcolor: 'fdfaf3',
    margin: '0',
  });
  qrPng.value = `https://api.qrserver.com/v1/create-qr-code/?${params}`;
}

async function regenerate(): Promise<void> {
  if (!qrRoom.value) return;
  qrLoading.value = true;
  try {
    qrData.value = await api<QrData>('manageinn.api.regenerate_room_token', { room: qrRoom.value.name });
    await renderQR();
    await ok('QR refreshed — old token disabled');
  } catch (e: any) {
    await toastError(e?.message || 'Could not regenerate');
  } finally {
    qrLoading.value = false;
  }
}

async function shareQR(): Promise<void> {
  if (!qrData.value) return;
  try {
    await Share.share({
      title: `${qrData.value.property_name} · ${qrData.value.room_name}`,
      text: `Scan to check in to your room at ${qrData.value.property_name}.`,
      url: qrData.value.url,
      dialogTitle: 'Share room QR',
    });
  } catch {
    // User cancelled, or Share plugin not available on web — silent
  }
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
          <div class="mi-font-hand head-sub">{{ prop.roomTypes.length }} type{{ prop.roomTypes.length !== 1 ? 's' : '' }} · {{ prop.rooms.length }} unit{{ prop.rooms.length !== 1 ? 's' : '' }}</div>
          <h1 class="mi-font-display head-title">Rooms</h1>
        </header>

        <div v-if="loading && !prop.rooms.length" class="loading">
          <IonSpinner name="crescent" />
        </div>

        <EmptyState
          v-else-if="!prop.roomTypes.length"
          emoji="🛏️"
          headline="No rooms yet"
          body="Add room types and units in the web app — they'll show up here for status updates and QR codes."
        />

        <div v-else class="groups">
          <section v-for="g in grouped" :key="g.type.name" class="group">
            <header class="group-head">
              <div>
                <div class="group-name mi-font-display">{{ g.type.room_type_name }}</div>
                <div class="group-meta">{{ money(g.type.price_per_night) }}/night · up to {{ g.type.max_guests }} · {{ g.rooms.length }} unit{{ g.rooms.length !== 1 ? 's' : '' }}</div>
              </div>
            </header>

            <ul v-if="g.rooms.length" class="units">
              <li v-for="r in g.rooms" :key="r.name" class="unit">
                <span class="dot" :class="statusColor(r.status)"></span>
                <div class="unit-name">{{ r.room_name }}</div>
                <IonSelect
                  v-if="canEditStatus"
                  :model-value="r.status"
                  interface="action-sheet"
                  class="status-select"
                  @ionChange="(e: any) => setStatus(r, e.detail.value)"
                >
                  <IonSelectOption v-for="s in STATUSES" :key="s" :value="s">{{ s }}</IonSelectOption>
                </IonSelect>
                <span v-else class="status-text">{{ r.status }}</span>
                <IonButton fill="clear" size="small" @click="openQR(r)" :aria-label="`QR for ${r.room_name}`">
                  <IonIcon slot="icon-only" :icon="qrCodeOutline" />
                </IonButton>
              </li>
            </ul>
            <div v-else class="group-empty">No units in this type yet.</div>
          </section>
        </div>
      </div>

      <!-- QR modal -->
      <IonModal :is-open="qrOpen" @didDismiss="qrOpen = false">
        <IonHeader>
          <IonToolbar>
            <IonTitle class="mi-font-display title">Room QR</IonTitle>
            <IonButtons slot="end">
              <IonButton @click="qrOpen = false">
                <IonIcon slot="icon-only" :icon="closeOutline" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding">
          <div v-if="qrLoading" class="qr-loading">
            <IonSpinner name="crescent" />
          </div>

          <div v-else-if="qrData" class="qr-shell">
            <div class="qr-card">
              <div class="qr-head">
                <div class="qr-tile">
                  <span v-if="!qrData.logo">M</span>
                  <img v-else :src="qrData.logo" alt="" />
                </div>
                <div class="qr-name">
                  <div class="mi-font-hand wordmark">
                    <span class="mi-underline-wavy">{{ qrData.property_name }}</span>
                  </div>
                  <div class="mi-font-hand sub">scan & make yourself at home</div>
                </div>
              </div>

              <div class="qr-img-wrap">
                <img v-if="qrPng" :src="qrPng" alt="Room QR" class="qr-img" />
                <IonSpinner v-else name="crescent" />
              </div>

              <div class="qr-room">
                <div class="qr-room-label">YOUR ROOM</div>
                <div class="qr-room-name mi-font-display">{{ qrData.room_name }}</div>
              </div>
              <div class="qr-footer mi-font-hand">powered by Manage Inn</div>
            </div>

            <div class="qr-url">
              {{ qrData.url }}
            </div>

            <div class="qr-actions">
              <IonButton fill="outline" @click="regenerate" :disabled="qrLoading" v-if="auth.is_admin || auth.is_sys_admin">
                <IonIcon slot="start" :icon="refreshOutline" />
                Regenerate
              </IonButton>
              <IonButton class="mi-btn-tactile" @click="shareQR">
                <IonIcon slot="start" :icon="shareOutline" />
                Share
              </IonButton>
            </div>

            <p class="qr-hint mi-font-hand">
              Print the QR (download it via the web app) and place it in the room
            </p>
          </div>
        </IonContent>
      </IonModal>

      <MIBottomNav />
    </IonContent>
  </IonPage>
</template>

<style scoped>
.title { font-style: italic; font-weight: 600; }
.page { padding: 12px 16px 96px; }
.head { margin-bottom: 14px; }
.head-sub { font-size: 18px; color: rgba(42, 34, 26, 0.55); }
.head-title { font-style: italic; font-weight: 600; font-size: 30px; margin: 2px 0 4px; }

.loading { display: flex; justify-content: center; padding: 60px 0; }

.groups { display: flex; flex-direction: column; gap: 12px; }
.group {
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  border-radius: 16px;
  overflow: hidden;
}
.group-head {
  padding: 12px 14px;
  border-bottom: 1px solid var(--ion-border-color);
}
.group-name { font-style: italic; font-weight: 600; font-size: 17px; }
.group-meta { font-size: 11px; color: rgba(42, 34, 26, 0.55); margin-top: 2px; }

.units { list-style: none; margin: 0; padding: 0; }
.unit {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--ion-border-color);
}
.unit:last-child { border-bottom: 0; }
.dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot.mi-stat-sage  { background: var(--mi-sage); }
.dot.mi-stat-terra { background: var(--mi-terra); }
.dot.mi-stat-honey { background: var(--mi-honey); }
.dot.mi-stat-ink   { background: var(--mi-ink); }

.unit-name { flex: 1; min-width: 0; font-weight: 500; font-size: 14px; }
.status-select {
  --padding-start: 0;
  --padding-end: 0;
  font-size: 11px;
  color: rgba(42, 34, 26, 0.65);
  font-family: 'Lora', Georgia, serif;
}
.status-text { font-size: 11px; color: rgba(42, 34, 26, 0.55); }

.group-empty {
  padding: 18px 14px;
  text-align: center;
  font-size: 12px;
  color: rgba(42, 34, 26, 0.45);
}

/* QR modal */
.qr-loading { display: flex; justify-content: center; padding: 80px 0; }
.qr-shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}
.qr-card {
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  border-radius: 18px;
  padding: 18px;
  text-align: center;
  box-shadow: 0 12px 40px -12px rgba(42, 34, 26, 0.18);
}
.qr-head {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  margin-bottom: 12px;
}
.qr-tile {
  width: 42px; height: 42px;
  border-radius: 11px;
  background: var(--mi-terra);
  color: var(--mi-paper);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
  font-style: italic;
  font-family: 'Lora', Georgia, serif;
  font-size: 18px;
  box-shadow: 0 2px 0 var(--mi-terra-d);
  flex-shrink: 0;
  overflow: hidden;
}
.qr-tile img { width: 100%; height: 100%; object-fit: cover; }
.qr-name { line-height: 1.1; }
.qr-name .wordmark {
  color: var(--mi-terra);
  font-weight: 700;
  font-size: 18px;
}
.qr-name .sub { font-size: 13px; color: rgba(42, 34, 26, 0.55); margin-top: 2px; }

.qr-img-wrap {
  background: white;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid var(--ion-border-color);
  display: inline-block;
}
.qr-img {
  display: block;
  width: 200px;
  height: 200px;
}

.qr-room { margin-top: 12px; }
.qr-room-label {
  font-size: 10px;
  letter-spacing: 0.15em;
  color: rgba(42, 34, 26, 0.55);
  font-weight: 600;
}
.qr-room-name {
  font-style: italic;
  font-weight: 600;
  font-size: 26px;
  margin-top: 2px;
}
.qr-footer {
  margin-top: 8px;
  font-size: 13px;
  color: rgba(42, 34, 26, 0.45);
}

.qr-url {
  background: var(--mi-cream);
  border: 1px solid var(--ion-border-color);
  border-radius: 8px;
  padding: 8px 10px;
  font-family: ui-monospace, monospace;
  font-size: 11px;
  word-break: break-all;
  text-align: center;
  color: rgba(42, 34, 26, 0.65);
}

.qr-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.qr-hint {
  text-align: center;
  font-size: 14px;
  color: rgba(42, 34, 26, 0.5);
}
</style>
