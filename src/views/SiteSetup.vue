<!--
  SiteSetup — first-run + diagnostics screen where the user enters the
  Frappe bench URL to talk to.

  Defaults to the canonical https://manageinn.dxbitz.com but customers on
  their own bench (self-hosted) can change it. Same pattern as Nextflow's
  SiteSetup — the URL is persisted in Capacitor Preferences and read by
  every HTTP call via getSiteUrl().
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonContent, IonPage, IonInput, IonButton, IonItem, IonLabel, IonNote } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { getSiteUrl, setSiteUrl, getDefaultSite } from '@/services/site';
import { ok, error } from '@/services/toast';
import MILogo from '@/components/MILogo.vue';

const router = useRouter();
const value = ref('');
const saving = ref(false);

onMounted(async () => {
  value.value = await getSiteUrl();
});

async function save(): Promise<void> {
  const v = (value.value || '').trim();
  if (!/^https?:\/\/.+/.test(v)) {
    await error('Please enter a full URL (https://…)');
    return;
  }
  saving.value = true;
  try {
    await setSiteUrl(v);
    await ok('Site saved');
    router.replace('/splash');
  } finally {
    saving.value = false;
  }
}

function useDefault(): void {
  value.value = getDefaultSite();
}
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="true" class="ion-padding">
      <div class="setup-shell">
        <MILogo size="md" with-subtitle subtitle="where's your bench?" />

        <p class="lead">
          Manage Inn talks to a Frappe site. The default is our hosted
          instance; point this at your own bench if you self-host.
        </p>

        <IonItem class="field">
          <IonLabel position="stacked">Site URL</IonLabel>
          <IonInput
            v-model="value"
            type="url"
            inputmode="url"
            placeholder="https://your-site.example.com"
            autocapitalize="off"
            autocomplete="off"
          />
        </IonItem>
        <IonNote class="hint">
          No trailing slash. Use http:// only for local dev.
        </IonNote>

        <div class="actions">
          <IonButton expand="block" class="mi-btn-tactile" :disabled="saving" @click="save">
            {{ saving ? 'Saving…' : 'Continue' }}
          </IonButton>
          <IonButton expand="block" fill="clear" @click="useDefault">
            Use the default
          </IonButton>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.setup-shell {
  max-width: 28em;
  margin: 0 auto;
  padding: 32px 8px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.lead {
  font-size: 15px;
  line-height: 1.5;
  color: rgba(42, 34, 26, 0.75);
  margin: 0;
}
.field {
  --background: var(--mi-paper);
  border-radius: 10px;
  --inner-padding-end: 12px;
}
.hint {
  font-size: 12px;
  padding: 0 4px;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
