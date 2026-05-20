<!--
  BookingDetailPage — view + status transitions for a single booking.

  Phase 1: read-only summary + status transitions (Confirm, Check in,
  Check out, Cancel) + Mark balance paid. Inline editing (guest name,
  dates, amount) is in the web app's BookingDetailModal — port to mobile
  in Phase 2.

  Has a real IonHeader (so back-button + safe-area work natively).
-->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonButton, IonSpinner, alertController,
} from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { useCurrency } from '@/composables/useCurrency';
import { formatDateLong, initials } from '@/composables/useDates';
import { api } from '@/services/http';
import { ok, error as toastError } from '@/services/toast';
import StatusBadge from '@/components/StatusBadge.vue';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const prop = usePropertyStore();
const { money } = useCurrency();

const bookingName = computed(() => decodeURIComponent(String(route.params.name || '')));
const busy = ref(false);

const booking = computed(() => prop.bookings.find((b) => b.name === bookingName.value) || null);
const balance = computed(() => {
  const b = booking.value;
  if (!b) return 0;
  return Math.max(0, (b.total_amount || 0) - (b.advance_paid || 0));
});
const isTerminal = computed(() => {
  const s = booking.value?.status;
  return s === 'Checked Out' || s === 'Cancelled' || s === 'No Show';
});

async function ensureLoaded(): Promise<void> {
  if (booking.value || !auth.current) return;
  // Came in via deep-link with empty store — refetch
  await prop.loadProperty(auth.current.name);
}

async function transition(newStatus: string): Promise<void> {
  if (!booking.value || busy.value) return;
  busy.value = true;
  try {
    const updated = await api('manageinn.api.transition_booking', {
      name: booking.value.name,
      new_status: newStatus,
    });
    prop.applyBookingUpdate(updated);
    await ok(`Status → ${newStatus}`);
  } catch (e: any) {
    await toastError(e?.message || 'Could not change status');
  } finally {
    busy.value = false;
  }
}

async function recordBalance(): Promise<void> {
  if (!booking.value || balance.value <= 0 || busy.value) return;
  busy.value = true;
  try {
    const updated = await api('manageinn.api.record_payment', {
      name: booking.value.name,
      amount: balance.value,
    });
    prop.applyBookingUpdate(updated);
    await ok(`${money(balance.value)} marked paid`);
  } catch (e: any) {
    await toastError(e?.message || 'Could not record payment');
  } finally {
    busy.value = false;
  }
}

async function confirmCancel(): Promise<void> {
  if (!booking.value) return;
  const alert = await alertController.create({
    header: 'Cancel booking?',
    message: `${booking.value.guest_name} · ${booking.value.name}. This cannot be undone.`,
    buttons: [
      { text: 'Keep it', role: 'cancel' },
      { text: 'Cancel booking', role: 'destructive', handler: () => transition('Cancelled') },
    ],
  });
  await alert.present();
}

onMounted(ensureLoaded);
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton default-href="/bookings" />
        </IonButtons>
        <IonTitle class="mi-font-display title">Booking</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true">
      <div v-if="!booking" class="empty">
        <IonSpinner v-if="!auth.current || prop.loading" name="crescent" />
        <p v-else>Booking not found.</p>
      </div>

      <div v-else class="page">
        <!-- Header card: guest + status -->
        <section class="header card">
          <div class="hdr-row">
            <div class="avatar">{{ initials(booking.guest_name) }}</div>
            <div class="who">
              <div class="name">{{ booking.guest_name }}</div>
              <div class="phone">{{ booking.guest_phone || '—' }}</div>
            </div>
            <StatusBadge :status="booking.status" />
          </div>
          <div class="ref">{{ booking.name }}</div>
        </section>

        <!-- Stay details -->
        <section class="card">
          <div class="card-head"><h3 class="mi-font-display">Stay</h3></div>
          <div class="kv">
            <div><span class="k">Check-in</span> <span class="v">{{ formatDateLong(booking.check_in_date) }}</span></div>
            <div><span class="k">Check-out</span> <span class="v">{{ formatDateLong(booking.check_out_date) }}</span></div>
            <div><span class="k">Nights</span> <span class="v">{{ booking.nights }}</span></div>
            <div><span class="k">Guests</span> <span class="v">{{ booking.adults }} adult · {{ booking.children }} child</span></div>
            <div v-if="booking.room"><span class="k">Room</span> <span class="v">{{ booking.room }}</span></div>
            <div v-else><span class="k">Room</span> <span class="v italic">not assigned yet</span></div>
          </div>
        </section>

        <!-- Payment -->
        <section class="card">
          <div class="card-head"><h3 class="mi-font-display">Payment</h3></div>
          <div class="kv">
            <div><span class="k">Total</span> <span class="v">{{ money(booking.total_amount) }}</span></div>
            <div><span class="k">Paid</span> <span class="v">{{ money(booking.advance_paid) }}</span></div>
            <div v-if="balance > 0" class="balance-row">
              <span class="k">Balance</span>
              <span class="v terra-d">{{ money(balance) }}</span>
            </div>
            <div v-else class="balance-row paid">
              <span class="k">Status</span>
              <span class="v sage-d">Paid in full</span>
            </div>
          </div>
        </section>

        <!-- Notes -->
        <section v-if="booking.notes" class="card">
          <div class="card-head"><h3 class="mi-font-display">Notes</h3></div>
          <p class="notes">{{ booking.notes }}</p>
        </section>

        <!-- Actions -->
        <section v-if="!isTerminal" class="actions">
          <IonButton
            v-if="booking.status === 'Enquiry'"
            expand="block"
            class="mi-btn-tactile"
            :disabled="busy"
            @click="transition('Confirmed')"
          >
            Confirm
          </IonButton>
          <IonButton
            v-if="booking.status === 'Confirmed'"
            expand="block"
            class="mi-btn-tactile"
            :disabled="busy"
            @click="transition('Checked In')"
          >
            Check in
          </IonButton>
          <IonButton
            v-if="booking.status === 'Checked In'"
            expand="block"
            color="success"
            :disabled="busy"
            @click="transition('Checked Out')"
          >
            Check out
          </IonButton>
          <IonButton
            v-if="balance > 0"
            expand="block"
            fill="outline"
            :disabled="busy"
            @click="recordBalance"
          >
            Mark balance paid · {{ money(balance) }}
          </IonButton>
          <IonButton
            v-if="booking.status !== 'Checked In'"
            expand="block"
            fill="outline"
            color="danger"
            :disabled="busy"
            @click="confirmCancel"
          >
            Cancel booking
          </IonButton>
        </section>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.title {
  font-style: italic;
  font-weight: 600;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  gap: 16px;
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
  overflow: hidden;
}
.card-head {
  padding: 12px 16px 6px;
}
.card-head h3 {
  margin: 0;
  font-style: italic;
  font-weight: 600;
  font-size: 16px;
}
.header { padding: 14px; }
.hdr-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: rgba(42, 34, 26, 0.08);
  display: flex; align-items: center; justify-content: center;
  font-weight: 600;
}
.who { flex: 1; min-width: 0; }
.name { font-weight: 600; font-size: 16px; }
.phone { font-size: 12px; color: rgba(42, 34, 26, 0.55); font-family: ui-monospace, monospace; }
.ref {
  margin-top: 10px;
  font-size: 11px;
  color: rgba(42, 34, 26, 0.45);
  font-family: ui-monospace, monospace;
}
.kv {
  padding: 6px 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.kv > div {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  font-size: 14px;
}
.k {
  color: rgba(42, 34, 26, 0.55);
}
.v {
  color: var(--mi-ink);
  font-weight: 500;
  text-align: right;
}
.v.italic { font-style: italic; color: rgba(42, 34, 26, 0.45); font-weight: 400; }
.v.terra-d { color: var(--mi-terra-d); font-weight: 600; }
.v.sage-d  { color: var(--mi-sage-d);  font-weight: 600; }
.balance-row {
  padding-top: 8px;
  border-top: 1px solid var(--ion-border-color);
}
.notes {
  padding: 6px 16px 16px;
  font-size: 14px;
  color: rgba(42, 34, 26, 0.75);
  white-space: pre-wrap;
  margin: 0;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}
</style>
