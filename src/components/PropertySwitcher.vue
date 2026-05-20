<!--
  PropertySwitcher — chip in the top bar showing the active property,
  tappable when the user has 2+ properties to swap between.

  Opens an action-sheet of all accessible properties + sets the new one
  as `auth.current`. The property store then refetches data for the new
  property automatically (HomePage's watch on auth.current.name handles
  it). The whole flow takes one tap.
-->
<script setup lang="ts">
import { computed, ref } from 'vue';
import { IonIcon, actionSheetController } from '@ionic/vue';
import { chevronDownOutline, checkmarkCircle, businessOutline } from 'ionicons/icons';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { ok } from '@/services/toast';

const auth = useAuthStore();
const prop = usePropertyStore();

const hasMultiple = computed(() => (auth.properties?.length || 0) > 1);

async function openSwitcher(): Promise<void> {
  if (!hasMultiple.value) return;

  const buttons = auth.properties.map((p) => ({
    text: p.property_name,
    icon: p.name === auth.current?.name ? checkmarkCircle : businessOutline,
    cssClass: p.name === auth.current?.name ? 'mi-current-prop' : '',
    handler: () => switchTo(p.name),
  }));
  buttons.push({ text: 'Cancel', role: 'cancel' } as any);

  const sheet = await actionSheetController.create({
    header: 'Switch property',
    subHeader: `${auth.properties.length} accessible`,
    buttons,
  });
  await sheet.present();
}

async function switchTo(name: string): Promise<void> {
  if (auth.current?.name === name) return;
  auth.setCurrentProperty(name);
  // Reset the per-property data so the new property's bookings/rooms load
  // fresh on next access. Cheaper than refetching here — the next view
  // entry triggers loadProperty() via its onMounted/watch.
  prop.reset();
  await ok(`Switched to ${auth.current?.property_name}`);
}
</script>

<template>
  <button
    v-if="auth.current"
    class="prop-chip"
    :class="{ tappable: hasMultiple }"
    @click="openSwitcher"
    :aria-label="hasMultiple ? 'Switch property' : 'Active property'"
  >
    <div class="prop-name mi-font-hand">{{ auth.current.property_name }}</div>
    <IonIcon v-if="hasMultiple" :icon="chevronDownOutline" class="chev" />
  </button>
</template>

<style scoped>
.prop-chip {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: default;
  font-family: 'Caveat', cursive;
}
.prop-chip.tappable { cursor: pointer; }
.prop-name {
  font-size: 14px;
  color: rgba(42, 34, 26, 0.55);
  line-height: 1;
}
.chev {
  font-size: 11px;
  color: rgba(42, 34, 26, 0.4);
}
:global(.mi-current-prop) {
  --color: var(--mi-terra-d);
  font-weight: 600;
}
</style>
