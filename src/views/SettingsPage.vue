<!--
  SettingsPage — app preferences.

  Currently has:
    - Biometric unlock toggle (with status + biometry type label)
    - Bench URL — tap to change (deep-link to SiteSetup)
    - About — version + GitHub repo

  Deliberately kept thin. Account info + sign-out stays on ProfilePage,
  which is the "who am I" surface. Settings is the "how does this app
  behave" surface.
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonBackButton, IonList, IonItem, IonLabel, IonToggle, IonIcon, IonNote,
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import {
  isAvailable as bioIsAvailable,
  isEnabled as bioIsEnabled,
  enable as bioEnable,
  disable as bioDisable,
  biometryLabel,
} from '@/services/biometric';
import { getSiteUrl } from '@/services/site';
import { ok, error as toastError } from '@/services/toast';
import {
  fingerPrintOutline, globeOutline, informationCircleOutline,
  chevronForwardOutline, logoGithub,
} from 'ionicons/icons';

const router = useRouter();

const bioCheck = ref<{
  available: boolean;
  label: string;
  reason: string;
}>({ available: false, label: 'Biometric', reason: 'Checking…' });

const bioOn = ref(false);
const bioBusy = ref(false);

const siteUrl = ref('');

onMounted(async () => {
  const a = await bioIsAvailable();
  bioCheck.value = {
    available: a.available,
    label: biometryLabel(a.biometryType),
    reason: a.reason,
  };
  bioOn.value = await bioIsEnabled();
  siteUrl.value = await getSiteUrl();
});

async function onToggleBio(e: CustomEvent): Promise<void> {
  if (bioBusy.value) return;
  bioBusy.value = true;
  const wantOn = (e.detail as any).checked;
  try {
    if (wantOn) {
      const ok2 = await bioEnable(`Enable ${bioCheck.value.label} unlock`);
      if (!ok2) {
        bioOn.value = false;
        await toastError(`${bioCheck.value.label} verification failed`);
        return;
      }
      bioOn.value = true;
      await ok(`${bioCheck.value.label} unlock enabled`);
    } else {
      await bioDisable();
      bioOn.value = false;
      await ok(`${bioCheck.value.label} unlock disabled`);
    }
  } finally {
    bioBusy.value = false;
  }
}

function changeSite(): void {
  router.push('/site-setup');
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton default-href="/profile" />
        </IonButtons>
        <IonTitle class="mi-font-display title">Settings</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true">
      <div class="page">
        <!-- Security -->
        <h3 class="mi-font-display section-h">Security</h3>
        <IonList inset class="list">
          <IonItem>
            <IonIcon slot="start" :icon="fingerPrintOutline" />
            <IonLabel>
              <h3>{{ bioCheck.label }} unlock</h3>
              <p v-if="bioCheck.available">Tap your finger / face on next launch</p>
              <p v-else>{{ bioCheck.reason }}</p>
            </IonLabel>
            <IonToggle
              :checked="bioOn"
              :disabled="!bioCheck.available || bioBusy"
              @ionChange="onToggleBio"
            />
          </IonItem>
        </IonList>

        <!-- Bench -->
        <h3 class="mi-font-display section-h">Bench</h3>
        <IonList inset class="list">
          <IonItem button @click="changeSite" :detail="false">
            <IonIcon slot="start" :icon="globeOutline" />
            <IonLabel>
              <h3>Bench URL</h3>
              <p class="mono">{{ siteUrl }}</p>
            </IonLabel>
            <IonIcon slot="end" :icon="chevronForwardOutline" class="chev" />
          </IonItem>
        </IonList>

        <!-- About -->
        <h3 class="mi-font-display section-h">About</h3>
        <IonList inset class="list">
          <IonItem>
            <IonIcon slot="start" :icon="informationCircleOutline" />
            <IonLabel>
              <h3>Version</h3>
              <p>Manage Inn · mobile · 0.1 · debug</p>
            </IonLabel>
          </IonItem>
          <IonItem button href="https://github.com/dxb-aslam/manageinn-app" target="_blank" rel="noopener" :detail="false">
            <IonIcon slot="start" :icon="logoGithub" />
            <IonLabel>
              <h3>Source code</h3>
              <p>github.com/dxb-aslam/manageinn-app</p>
            </IonLabel>
            <IonIcon slot="end" :icon="chevronForwardOutline" class="chev" />
          </IonItem>
        </IonList>

        <IonNote class="footer mi-font-hand">
          built for property staff · internal use only
        </IonNote>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.title { font-style: italic; font-weight: 600; }
.page { padding: 16px 0; }
.section-h {
  font-style: italic;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(42, 34, 26, 0.55);
  margin: 18px 24px 8px;
}
.section-h:first-child { margin-top: 4px; }
.list { background: transparent; }
.mono { font-family: ui-monospace, monospace; font-size: 11px; word-break: break-all; }
.chev { color: rgba(42, 34, 26, 0.4); font-size: 14px; }
.footer {
  text-align: center;
  font-size: 14px;
  color: rgba(42, 34, 26, 0.45);
  padding: 24px 16px 32px;
}
</style>
