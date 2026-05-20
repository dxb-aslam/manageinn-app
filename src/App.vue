<!--
  App.vue — Ionic app root.

  Just an <ion-router-outlet>. Each page renders inside its own <IonPage>,
  so back-gesture + safe-area handling work naturally.

  Handles:
    - Android hardware-back: minimise instead of popping past /login
    - Registering the router handles with the navigation service so
      stores can navigate without holding a composable reference
-->
<script setup lang="ts">
import { IonApp, IonRouterOutlet, useIonRouter } from '@ionic/vue';
import { onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AUTH_ROUTES, registerNavigators } from '@/services/navigation';

const router = useRouter();
const ionRouter = useIonRouter();

let backListenerHandle: { remove: () => Promise<void> } | null = null;

onMounted(async () => {
  // Expose the routers to services that need to redirect without holding
  // a Vue composable handle (auth store, http error layer, …).
  registerNavigators({ ionRouter, router });

  // ── Android hardware back button ──────────────────────────────────
  // Ionic's default behaviour pops the page stack; on auth pages we want
  // it to minimise the app instead (don't go forward off the login
  // screen). Outside auth routes: normal back, or minimise if no history.
  if (Capacitor.isNativePlatform()) {
    try {
      backListenerHandle = await CapApp.addListener('backButton', async ({ canGoBack }) => {
        const path = router.currentRoute.value.path;
        if (AUTH_ROUTES.has(path)) {
          try { await CapApp.minimizeApp(); } catch { /* iOS / no-op */ }
          return;
        }
        if (canGoBack) {
          router.back();
        } else {
          try { await CapApp.minimizeApp(); } catch { /* ignore */ }
        }
      });
    } catch {
      /* not fatal — Ionic's default back behaviour still works */
    }
  }
});

onBeforeUnmount(() => {
  if (backListenerHandle) {
    try { void backListenerHandle.remove(); } catch { /* ignore */ }
    backListenerHandle = null;
  }
});
</script>

<template>
  <IonApp>
    <IonRouterOutlet />
  </IonApp>
</template>
