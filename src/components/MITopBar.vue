<!--
  MITopBar — branded IonHeader replacement.

  Compact bar with the wordmark on the left, current property name as
  subtitle, and an optional `actions` slot on the right. Used inside the
  IonContent of pages (not as IonHeader) so IonContent's gradient flows
  behind it.

  For pages that need the Ionic back-button + safe-area handling, use
  IonHeader/IonToolbar directly; this is for the tab-root pages.
-->
<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import MILogo from './MILogo.vue';

defineProps<{
  title?: string;
}>();

const auth = useAuthStore();
const subtitle = computed(() => auth.propertyName || '');
</script>

<template>
  <header class="mi-topbar">
    <div class="mi-topbar-brand">
      <MILogo size="sm" :with-subtitle="!!subtitle" :subtitle="subtitle" />
    </div>
    <div v-if="$slots.actions" class="mi-topbar-actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.mi-topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  padding-top: max(12px, env(safe-area-inset-top));
  background: rgba(253, 250, 243, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--ion-border-color);
}
.mi-topbar-brand { flex: 1; min-width: 0; }
.mi-topbar-actions { display: flex; align-items: center; gap: 8px; }
</style>
