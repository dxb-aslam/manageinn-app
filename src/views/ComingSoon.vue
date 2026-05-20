<!--
  ComingSoon — placeholder for views that exist in the web app but
  haven't been ported to mobile yet (Calendar, Cleaning, Rooms, Requests,
  Guest Portal config). Lets the bottom-nav stay populated without
  shipping half-finished pages.
-->
<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import EmptyState from '@/components/EmptyState.vue';

defineProps<{
  feature?: string;
}>();
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="true">
      <MITopBar />
      <div class="page">
        <EmptyState
          emoji="🛠️"
          :headline="(feature || 'This view') + ' is coming next'"
          body="It works in the web app already — porting to mobile is on the punch list. For now, open the browser on manageinn.dxbitz.com for full features."
        />
      </div>
      <MIBottomNav />
    </IonContent>
  </IonPage>
</template>

<style scoped>
.page {
  padding: 24px 16px 96px;
}
</style>
