<!--
  SplashCheck — invisible router that decides where to land on app boot.

  Flow:
    1. Site URL not configured        → /site-setup
    2. No stored API creds            → /login
    3. Creds present, hydrate works   → /home
    4. Creds present, hydrate 401     → /login
    5. Network down                   → stay on splash w/ retry button

  Shown briefly during the API round-trip — Manage Inn wordmark + tiny
  Caveat tagline + spinner. If the bench is slow, the user sees the
  brand instead of a white flash.
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IonContent, IonPage, IonSpinner } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getSiteUrl, getDefaultSite } from '@/services/site';
import { readCreds } from '@/services/http';
import { Preferences } from '@capacitor/preferences';
import MILogo from '@/components/MILogo.vue';

const router = useRouter();
const auth = useAuthStore();
const error = ref('');
const retrying = ref(false);

async function decide(): Promise<void> {
  error.value = '';
  // (1) Site URL — if user has never set one, ship them to /site-setup
  //     unless they want the default (manageinn.dxbitz.com). For Phase 1
  //     we use the default silently and let them change it in Profile later.
  await getSiteUrl();   // primes the cache; defaults to canonical site

  // (2) Creds present?
  const creds = await readCreds();
  if (!creds) {
    router.replace('/login');
    return;
  }

  // (3) Hydrate session
  try {
    await auth.hydrate();
    if (auth.isLoggedIn) {
      router.replace('/home');
    } else {
      router.replace('/login');
    }
  } catch (e: any) {
    if (e?.status === 401) {
      router.replace('/login');
    } else {
      error.value = e?.message || 'Could not reach the server';
    }
  }
}

async function retry(): Promise<void> {
  retrying.value = true;
  await decide();
  retrying.value = false;
}

async function changeSite(): Promise<void> {
  router.replace('/site-setup');
}

onMounted(decide);
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="true" class="ion-padding">
      <div class="splash-shell">
        <MILogo size="lg" with-subtitle subtitle="calm operations" />
        <div v-if="!error" class="splash-spin">
          <IonSpinner name="crescent" />
        </div>
        <div v-else class="splash-error">
          <div class="msg">{{ error }}</div>
          <div class="actions">
            <button class="link" @click="retry" :disabled="retrying">
              {{ retrying ? 'Trying…' : 'Try again' }}
            </button>
            <button class="link subtle" @click="changeSite">Change site</button>
          </div>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.splash-shell {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 32px 24px;
}
.splash-spin {
  margin-top: 12px;
}
.splash-error {
  text-align: center;
  max-width: 22em;
}
.splash-error .msg {
  font-size: 14px;
  color: rgba(42, 34, 26, 0.7);
  margin-bottom: 16px;
}
.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.link {
  background: transparent;
  border: 0;
  color: var(--mi-terra);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 10px;
}
.link.subtle {
  color: rgba(42, 34, 26, 0.55);
}
.link:disabled { opacity: 0.5; }
</style>
