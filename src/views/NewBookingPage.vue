<!--
  NewBookingPage — full mobile flow for creating a booking.

  Mirrors the web app's NewBookingModal but as a full-screen page (mobile
  modals would feel cramped). Steps:
    1. Pick room type (radio cards with live availability)
    2. Dates (defaults today + 1 night)
    3. ± guest counters (adults required ≥1)
    4. Guest details (name required, phone/email optional)
    5. Total amount (auto-prefilled from type.price × nights, editable)
    6. Advance paid (optional)
    7. Notes (optional)

  On submit → manageinn.api.create_booking → store update → router.back()
-->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonButton, IonInput, IonTextarea, IonSpinner,
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import type { RoomType } from '@/stores/property';
import { useCurrency } from '@/composables/useCurrency';
import { todayISO, addDays, parseDate, isoDate } from '@/composables/useDates';
import { api } from '@/services/http';
import { ok, error as toastError } from '@/services/toast';

const router = useRouter();
const auth = useAuthStore();
const prop = usePropertyStore();
const { money, symbol } = useCurrency();

// ---- Form state ----
const today = todayISO();
const tomorrow = isoDate(addDays(parseDate(today), 1));

interface Form {
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  total_amount: number;
  advance_paid: number;
  notes: string;
}

const form = reactive<Form>({
  room_type: '',
  check_in_date: today,
  check_out_date: tomorrow,
  adults: 2,
  children: 0,
  guest_name: '',
  guest_phone: '',
  guest_email: '',
  total_amount: 0,
  advance_paid: 0,
  notes: '',
});

const submitting = ref(false);
const checkingAvail = ref(false);

// ---- Computed ----
const nights = computed(() => {
  if (!form.check_in_date || !form.check_out_date) return 0;
  return Math.max(
    0,
    Math.round((parseDate(form.check_out_date).getTime() - parseDate(form.check_in_date).getTime()) / 86400000),
  );
});

const selectedType = computed<RoomType | null>(
  () => prop.roomTypes.find((t) => t.name === form.room_type) || null,
);

// Auto-fill total when type or nights change (unless user already touched it)
const userOverroteTotal = ref(false);
watch([selectedType, nights], ([t, n]) => {
  if (userOverroteTotal.value) return;
  if (t && n > 0) {
    form.total_amount = (t.price_per_night || 0) * n;
  } else {
    form.total_amount = 0;
  }
});

function onTotalManualEdit() {
  userOverroteTotal.value = true;
}

// ---- Availability (lightweight check on the selected type) ----
//
// We rely on the backend's create_booking validation as the source of
// truth, but a pre-submit check via list_availability gives a faster
// failure path for "this type has zero free units on these dates".
const availability = ref<Record<string, number>>({});  // typeName → free units
async function refreshAvailability() {
  if (!auth.current) return;
  checkingAvail.value = true;
  try {
    const data = await api<{ types: Array<{ name: string; free: number }> }>(
      'manageinn.api.get_availability',
      {
        property: auth.current.name,
        check_in: form.check_in_date,
        check_out: form.check_out_date,
      },
    );
    const map: Record<string, number> = {};
    for (const t of data.types || []) map[t.name] = t.free;
    availability.value = map;
  } catch {
    // Non-fatal — server will validate at create_booking time anyway
    availability.value = {};
  } finally {
    checkingAvail.value = false;
  }
}
watch(() => [form.check_in_date, form.check_out_date], refreshAvailability, { immediate: false });

// ---- Validation ----
const formError = computed(() => {
  if (!form.room_type) return 'Pick a room type';
  if (!form.guest_name.trim()) return 'Guest name is required';
  if (nights.value <= 0) return 'Check-out must be after check-in';
  if (form.adults < 1) return 'At least one adult';
  if (form.total_amount < 0) return "Total can't be negative";
  if (form.advance_paid < 0) return "Advance can't be negative";
  if (form.advance_paid > form.total_amount) return 'Advance exceeds total';

  const free = availability.value[form.room_type];
  if (typeof free === 'number' && free <= 0) return 'No units of this type free on these dates';
  return '';
});

// ---- Submit ----
async function submit(): Promise<void> {
  if (formError.value || submitting.value || !auth.current) return;
  submitting.value = true;
  try {
    const created = await api('manageinn.api.create_booking', {
      property: auth.current.name,
      payload: { ...form },
    });
    prop.applyBookingUpdate(created);
    await ok(`Booked ${form.guest_name}`);
    router.replace(`/bookings/${encodeURIComponent(created.name)}`);
  } catch (e: any) {
    await toastError(e?.message || 'Could not create booking');
  } finally {
    submitting.value = false;
  }
}

// Ensure room types are loaded (deep-link arrival)
onMounted(async () => {
  if (!auth.current) return;
  if (!prop.roomTypes.length) await prop.loadProperty(auth.current.name);
  if (prop.roomTypes.length && !form.room_type) {
    form.room_type = prop.roomTypes[0].name;
  }
  refreshAvailability();
});
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton default-href="/bookings" />
        </IonButtons>
        <IonTitle class="mi-font-display title">New booking</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true">
      <div class="page">
        <!-- 1. Room type -->
        <section class="block">
          <div class="block-head">
            <h3 class="mi-font-display">Which room type?</h3>
            <span v-if="checkingAvail" class="muted">checking…</span>
          </div>
          <div v-if="!prop.roomTypes.length" class="muted">
            No room types yet. Create one in the web app first.
          </div>
          <div v-else class="type-list">
            <label
              v-for="t in prop.roomTypes"
              :key="t.name"
              class="type-card"
              :class="{ active: form.room_type === t.name }"
            >
              <input type="radio" :value="t.name" v-model="form.room_type" />
              <div class="type-main">
                <div class="type-name">{{ t.room_type_name }}</div>
                <div class="type-meta">
                  {{ money(t.price_per_night) }}/night · up to {{ t.max_guests }} guest{{ t.max_guests !== 1 ? 's' : '' }}
                </div>
              </div>
              <div v-if="availability[t.name] !== undefined" class="type-avail">
                <span :class="{ none: availability[t.name] <= 0 }">
                  {{ availability[t.name] }} free
                </span>
              </div>
            </label>
          </div>
        </section>

        <!-- 2. Dates -->
        <section class="block">
          <h3 class="block-head mi-font-display">When?</h3>
          <div class="row-2">
            <div class="field">
              <label>Check-in</label>
              <input type="date" v-model="form.check_in_date" />
            </div>
            <div class="field">
              <label>Check-out</label>
              <input type="date" v-model="form.check_out_date" :min="form.check_in_date" />
            </div>
          </div>
          <div class="muted small">
            {{ nights }} night{{ nights !== 1 ? 's' : '' }}
          </div>
        </section>

        <!-- 3. Guests -->
        <section class="block">
          <h3 class="block-head mi-font-display">How many?</h3>
          <div class="counters">
            <div class="counter">
              <span>Adults</span>
              <div class="ctrls">
                <button type="button" @click="form.adults = Math.max(1, form.adults - 1)">−</button>
                <span class="qty">{{ form.adults }}</span>
                <button type="button" @click="form.adults++">+</button>
              </div>
            </div>
            <div class="counter">
              <span>Children</span>
              <div class="ctrls">
                <button type="button" @click="form.children = Math.max(0, form.children - 1)">−</button>
                <span class="qty">{{ form.children }}</span>
                <button type="button" @click="form.children++">+</button>
              </div>
            </div>
          </div>
        </section>

        <!-- 4. Guest details -->
        <section class="block">
          <h3 class="block-head mi-font-display">Who's staying?</h3>
          <div class="field">
            <label>Guest name</label>
            <IonInput v-model="form.guest_name" placeholder="Anjali Menon" class="mi-input" />
          </div>
          <div class="field">
            <label>Phone (optional)</label>
            <IonInput v-model="form.guest_phone" type="tel" inputmode="tel" class="mi-input" />
          </div>
          <div class="field">
            <label>Email (optional)</label>
            <IonInput v-model="form.guest_email" type="email" inputmode="email" autocapitalize="off" class="mi-input" />
          </div>
        </section>

        <!-- 5. Payment -->
        <section class="block">
          <h3 class="block-head mi-font-display">Payment</h3>
          <div class="row-2">
            <div class="field">
              <label>Total ({{ symbol }})</label>
              <IonInput v-model.number="form.total_amount" type="number" inputmode="decimal" @ionInput="onTotalManualEdit" class="mi-input" />
            </div>
            <div class="field">
              <label>Advance paid ({{ symbol }})</label>
              <IonInput v-model.number="form.advance_paid" type="number" inputmode="decimal" class="mi-input" />
            </div>
          </div>
        </section>

        <!-- 6. Notes -->
        <section class="block">
          <h3 class="block-head mi-font-display">Notes</h3>
          <IonTextarea v-model="form.notes" :rows="3" placeholder="Anything to remember…" class="mi-input ta" />
        </section>

        <!-- Error -->
        <p v-if="formError" class="err">{{ formError }}</p>

        <!-- Submit -->
        <div class="submit">
          <IonButton
            expand="block"
            class="mi-btn-tactile"
            :disabled="!!formError || submitting"
            @click="submit"
          >
            <IonSpinner v-if="submitting" name="crescent" />
            <span v-else>Create booking · {{ money(form.total_amount) }}</span>
          </IonButton>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.title { font-style: italic; font-weight: 600; }
.page {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.block {
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 4px;
}
.block-head h3 {
  margin: 0;
  font-style: italic;
  font-weight: 600;
  font-size: 16px;
}
.muted {
  font-size: 12px;
  color: rgba(42, 34, 26, 0.55);
}
.muted.small { font-size: 11px; }

/* Type cards */
.type-list { display: flex; flex-direction: column; gap: 8px; }
.type-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--ion-border-color);
  border-radius: 12px;
  background: var(--mi-cream);
  cursor: pointer;
}
.type-card.active {
  border-color: var(--mi-terra);
  background: rgba(196, 101, 74, 0.05);
}
.type-card input { display: none; }
.type-main { flex: 1; min-width: 0; }
.type-name { font-weight: 500; font-size: 14px; }
.type-meta { font-size: 12px; color: rgba(42, 34, 26, 0.55); margin-top: 2px; }
.type-avail { font-size: 11px; font-weight: 500; color: var(--mi-sage-d); }
.type-avail .none { color: var(--mi-terra-d); }

/* Fields */
.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.field { display: flex; flex-direction: column; gap: 4px; }
.field label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  color: rgba(42, 34, 26, 0.55);
}
.mi-input {
  --background: var(--mi-cream);
  --padding-start: 10px;
  --padding-end: 10px;
  border: 1px solid var(--ion-border-color);
  border-radius: 8px;
  --color: var(--mi-ink);
  font-family: 'Lora', Georgia, serif;
  font-size: 14px;
}
.mi-input.ta { padding: 4px 10px; min-height: 80px; }
.field input[type="date"] {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--ion-border-color);
  background: var(--mi-cream);
  font-family: 'Lora', Georgia, serif;
  font-size: 14px;
  color: var(--mi-ink);
}

/* Counters */
.counters { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.counter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 1px solid var(--ion-border-color);
  border-radius: 12px;
  background: var(--mi-cream);
}
.counter > span {
  font-size: 13px;
  color: var(--mi-ink);
}
.ctrls { display: flex; align-items: center; gap: 10px; }
.ctrls button {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid var(--ion-border-color);
  background: var(--mi-paper);
  font-size: 16px;
  font-weight: 600;
  color: var(--mi-ink);
  cursor: pointer;
}
.qty { min-width: 20px; text-align: center; font-weight: 600; }

.err {
  margin: 0 4px;
  font-size: 13px;
  color: var(--mi-terra-d);
  background: #fef2f2;
  border-radius: 8px;
  padding: 8px 10px;
}
.submit {
  margin-top: 4px;
  padding-bottom: 24px;
}
</style>
