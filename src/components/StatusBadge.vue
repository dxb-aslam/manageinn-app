<!--
  StatusBadge — pill matching the web app's booking status colors.
  Pure presentational; pass the raw Frappe status string.
-->
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ status: string }>();

const cssClass = computed(() => {
  return 'mi-status-pill ' + (props.status || '').toLowerCase().replace(/\s+/g, '');
});
</script>

<template>
  <span :class="cssClass">{{ status }}</span>
</template>
