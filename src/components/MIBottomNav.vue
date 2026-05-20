<!--
  MIBottomNav — fixed bottom tab bar.

  Role-aware: Cleaning Staff sees Home / Cleaning / Rooms; everyone else
  sees Home / Calendar / Bookings / Cleaning. Mirrors the web app's mobile
  bottom-tabs but rendered via Ionic-friendly markup (we don't use
  ion-tabs because we want a single shared router stack — not nested
  per-tab outlets).
-->
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

interface Tab {
  to: string;
  label: string;
  icon: string;        // inline SVG path d="..." string
  hideForCleaning?: boolean;
}

// 4 tabs max — anything more starts to crowd small phones. We pick the
// most-frequent surfaces for each role; the others are reachable via
// Profile → "More" or via deep links from the cards on Home.
const tabs: Tab[] = [
  {
    to: '/home',
    label: 'Home',
    icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  },
  {
    to: '/calendar',
    label: 'Calendar',
    icon: 'M3 4h18v18H3z M16 2v6 M8 2v6 M3 10h18',
    hideForCleaning: true,
  },
  {
    to: '/bookings',
    label: 'Bookings',
    icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
    hideForCleaning: true,
  },
  {
    to: '/cleaning',
    label: 'Cleaning',
    icon: 'M3 3h18v6H3z M9 15a3 3 0 1 0 6 0c0-2-3-6-3-6s-3 4-3 6z',
  },
];

// Cleaning Staff gets a Rooms tab instead of Bookings/Calendar (so they
// can update unit status from the same screen). The role filter in
// `visible` below swaps it in for them.
const cleaningStaffTabs: Tab[] = [
  tabs[0],                                        // Home
  { to: '/cleaning', label: 'Cleaning',
    icon: 'M3 3h18v6H3z M9 15a3 3 0 1 0 6 0c0-2-3-6-3-6s-3 4-3 6z' },
  { to: '/rooms', label: 'Rooms',
    icon: 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9' },
];

const visible = computed(() => {
  if (auth.isCleaningOnly) return cleaningStaffTabs;
  return tabs;
});

function isActive(to: string): boolean {
  return route.path === to || route.path.startsWith(to + '/');
}

function go(to: string): void {
  if (route.path !== to) {
    router.push(to);
  }
}
</script>

<template>
  <nav class="mi-bottom-nav">
    <button
      v-for="t in visible"
      :key="t.to"
      class="mi-tab"
      :class="{ active: isActive(t.to) }"
      @click="go(t.to)"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path v-for="(p, i) in t.icon.split(' M ').map((s, idx) => (idx === 0 ? s : 'M ' + s))" :key="i" :d="p" />
      </svg>
      <span>{{ t.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.mi-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  background: rgba(253, 250, 243, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid var(--ion-border-color);
  padding-bottom: env(safe-area-inset-bottom);
}
.mi-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 10px 4px 8px;
  font-size: 10px;
  font-weight: 500;
  color: rgba(42, 34, 26, 0.55);
  background: transparent;
  border: 0;
  cursor: pointer;
  position: relative;
  font-family: 'Lora', Georgia, serif;
}
.mi-tab.active {
  color: var(--mi-terra);
}
.mi-tab.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 3px;
  background: var(--mi-terra);
  border-radius: 0 0 4px 4px;
}
</style>
