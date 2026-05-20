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
import { IonContent, IonPage, IonSpinner, IonButton, IonIcon } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getSiteUrl } from '@/services/site';
import { readCreds } from '@/services/http';
import { isEnabled as bioEnabled, verify as bioVerify, disable as bioDisable } from '@/services/biometric';
import { fingerPrintOutline } from 'ionicons/icons';
import MILogo from '@/components/MILogo.vue';

const router = useRouter();
const auth = useAuthStore();
const error = ref('');
const retrying = ref(false);

// Biometric lock state — only meaningful when stored creds + biometric
// is opted in. The user sees a "Tap to unlock" button if they cancelled
// the prompt; we don't lock them out completely.
const needsBio = ref(false);

async function decide(): Promise<void> {
  error.value = '';
  await getSiteUrl();

  // (1) Creds present? If not → straight to login. No biometric gate
  //     because there's nothing to unlock.
  const creds = await readCreds();
  if (!creds) {
    router.replace('/login');
    return;
  }

  // (2) If biometric unlock is enabled, prompt BEFORE hydrating. Network
  //     calls don't need to happen if the user can't even unlock the app.
  if (await bioEnabled()) {
    const ok = await bioVerify('Unlock Manage Inn');
    if (!ok) {
      // Don't kick to /login automatically — they might've fat-fingered
      // the sensor. Show a manual unlock button.
      needsBio.value = true;
      return;
    }
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

async function unlock(): Promise<void> {
  needsBio.value = false;
  await decide();
}

async function turnOffBiometric(): Promise<void> {
  // Escape hatch — if the user's biometric is broken (fingerprint sensor
  // failing, etc.) they can disable it from here and use password instead.
  await bioDisable();
  await decide();
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

        <!-- Biometric unlock — user cancelled or sensor read failed.
             Tapping retries the prompt. Escape hatch: disable biometric. -->
        <div v-if="needsBio" class="splash-bio">
          <IonButton class="mi-btn-tactile" @click="unlock">
            <IonIcon slot="start" :icon="fingerPrintOutline" />
            Tap to unlock
          </IonButton>
          <button class="link subtle" @click="turnOffBiometric">
            Use password instead
          </button>
        </div>

        <!-- Loading spinner — between cred check and hydrate completion -->
        <div v-else-if="!error" class="splash-spin">
          <IonSpinner name="crescent" />
        </div>

        <!-- Network/server error -->
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
.splash-bio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
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
