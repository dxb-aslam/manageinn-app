<!--
  MITopBar — branded IonHeader replacement.

  Logo on the left, PropertySwitcher chip below the wordmark (tappable
  when the user has 2+ properties — opens an action sheet). Optional
  `actions` slot on the right.

  Used inside IonContent of tab-root pages (not as IonHeader) so the
  warm gradient flows behind it.
-->
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import MILogo from './MILogo.vue';
import PropertySwitcher from './PropertySwitcher.vue';

defineProps<{
  title?: string;
}>();

const auth = useAuthStore();
</script>

<template>
  <header class="mi-topbar">
    <div class="mi-topbar-brand">
      <div class="mi-topbar-brand-row">
        <MILogo size="sm" />
        <PropertySwitcher />
      </div>
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
.mi-topbar-brand-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.mi-topbar-actions { display: flex; align-items: center; gap: 8px; }
</style>
