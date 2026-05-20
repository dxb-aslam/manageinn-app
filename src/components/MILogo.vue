<!--
  MILogo — the "Manage Inn" wordmark.

  Same hand-script identity as the web app: Caveat bold + the wavy honey
  underline. Props let it adapt per surface (small in nav, large on splash).
-->
<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg';
  withSubtitle?: boolean;
  subtitle?: string;
}>();
</script>

<template>
  <div class="mi-logo" :class="{ 'mi-logo-sm': size === 'sm', 'mi-logo-lg': size === 'lg' }">
    <div class="mi-logo-tile">
      <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </div>
    <div class="mi-logo-text">
      <div class="mi-font-hand mi-logo-wordmark">
        <span class="mi-underline-wavy">Manage Inn</span>
      </div>
      <div v-if="withSubtitle && subtitle" class="mi-font-hand mi-logo-subtitle">{{ subtitle }}</div>
    </div>
  </div>
</template>

<style scoped>
.mi-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mi-logo-tile {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: var(--mi-terra);
  color: var(--mi-paper);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 0 var(--mi-terra-d);
  flex-shrink: 0;
}
.mi-logo-text {
  line-height: 1.1;
  min-width: 0;
}
.mi-logo-wordmark {
  font-weight: 700;
  font-size: 24px;
  color: var(--mi-terra);
  line-height: 1;
}
.mi-logo-subtitle {
  font-size: 14px;
  color: rgba(42, 34, 26, 0.55);
  margin-top: 2px;
  line-height: 1;
}

.mi-logo-sm .mi-logo-tile { width: 32px; height: 32px; border-radius: 9px; }
.mi-logo-sm .mi-logo-wordmark { font-size: 20px; }
.mi-logo-sm .mi-logo-subtitle { font-size: 12px; }

.mi-logo-lg .mi-logo-tile { width: 56px; height: 56px; border-radius: 16px; }
.mi-logo-lg .mi-logo-wordmark { font-size: 36px; }
.mi-logo-lg .mi-logo-subtitle { font-size: 18px; }
</style>
