<!--
  EmptyState — port of the web app's EmptyState.vue.
  Friendly emoji + Lora italic headline + body + optional action slot.
-->
<script setup lang="ts">
withDefaults(
  defineProps<{
    emoji?: string;
    headline: string;
    body?: string;
    subtle?: boolean;
  }>(),
  { emoji: '✨', body: '', subtle: false },
);
</script>

<template>
  <div :class="['mi-empty', subtle ? 'subtle' : 'card']">
    <div class="emoji">{{ emoji }}</div>
    <div class="headline mi-font-display">{{ headline }}</div>
    <p v-if="body" class="body">{{ body }}</p>
    <div v-if="$slots.action" class="actions">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.mi-empty {
  text-align: center;
}
.mi-empty.card {
  padding: 32px 24px;
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  border-radius: 16px;
}
.mi-empty.subtle {
  padding: 32px 16px;
}
.emoji {
  font-size: 44px;
  margin-bottom: 10px;
  user-select: none;
}
.headline {
  font-style: italic;
  font-weight: 600;
  font-size: 22px;
  color: var(--mi-ink);
}
.body {
  font-size: 14px;
  color: rgba(42, 34, 26, 0.55);
  margin: 8px auto 0;
  max-width: 28em;
  line-height: 1.5;
}
.actions {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
