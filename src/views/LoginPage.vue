<!--
  LoginPage — email + password login matching the web app's themed login.

  Posts to manageinn.api.token_login (added to the bench in parallel with
  this commit). Stores the returned api_key + secret in Capacitor
  Preferences, then routes to /home.

  Google OAuth is deferred for a future commit — Capacitor needs
  @capacitor-firebase/authentication or @capacitor-community/oauth2 to
  do it natively, which is its own setup.
-->
<script setup lang="ts">
import { ref } from 'vue';
import { IonContent, IonPage, IonInput, IonButton, IonItem, IonLabel, IonSpinner } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { error as toastError } from '@/services/toast';
import { initPush } from '@/services/push';
import MILogo from '@/components/MILogo.vue';

const router = useRouter();
const auth = useAuthStore();

const user = ref('');
const pwd = ref('');
const loading = ref(false);
const errMsg = ref('');

async function submit(): Promise<void> {
  const u = (user.value || '').trim();
  const p = pwd.value || '';
  if (!u || !p) {
    errMsg.value = 'Email and password please.';
    return;
  }
  loading.value = true;
  errMsg.value = '';
  try {
    await auth.login(u, p);
    // Fire-and-forget push registration on the new session. Doesn't
    // block navigation — the FCM handshake takes a beat.
    void initPush(router);
    router.replace('/home');
  } catch (e: any) {
    errMsg.value = e?.message || 'Login failed';
    await toastError(errMsg.value);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="true" class="ion-padding">
      <div class="login-shell">
        <div class="brand">
          <MILogo size="lg" with-subtitle subtitle="welcome back" />
        </div>

        <form class="card" @submit.prevent="submit">
          <h2 class="mi-font-display title">Sign in</h2>

          <IonItem class="field" lines="full">
            <IonLabel position="stacked">Email or username</IonLabel>
            <IonInput
              v-model="user"
              type="text"
              autocomplete="username"
              autocapitalize="off"
              inputmode="email"
              placeholder="you@example.com"
              :disabled="loading"
            />
          </IonItem>

          <IonItem class="field" lines="full">
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput
              v-model="pwd"
              type="password"
              autocomplete="current-password"
              :disabled="loading"
            />
          </IonItem>

          <p v-if="errMsg" class="err">{{ errMsg }}</p>

          <IonButton
            expand="block"
            class="mi-btn-tactile submit"
            :disabled="loading"
            @click="submit"
          >
            <IonSpinner v-if="loading" name="crescent" />
            <span v-else>Sign in</span>
          </IonButton>
        </form>

        <p class="footer mi-font-hand">
          Property admins only · property staff are invited by their admin
        </p>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.login-shell {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 28px;
  padding: 24px 16px;
  max-width: 28em;
  margin: 0 auto;
}
.brand {
  display: flex;
  justify-content: center;
}
.card {
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  border-radius: 18px;
  padding: 22px 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 10px 30px -12px rgba(42, 34, 26, 0.15);
}
.title {
  font-style: italic;
  font-weight: 600;
  font-size: 24px;
  margin: 0 0 4px;
  color: var(--mi-ink);
}
.field {
  --background: transparent;
  --padding-start: 0;
  --inner-padding-end: 0;
}
.err {
  color: var(--mi-terra-d);
  font-size: 13px;
  margin: 0;
  padding: 6px 8px;
  background: #fef2f2;
  border-radius: 6px;
}
.submit {
  margin-top: 6px;
  height: 46px;
  --background: var(--mi-terra);
  --background-hover: var(--mi-terra-d);
  --color: var(--mi-paper);
  --box-shadow: 0 2px 0 var(--mi-terra-d);
  --border-radius: 10px;
  font-weight: 600;
}
.footer {
  text-align: center;
  font-size: 16px;
  color: rgba(42, 34, 26, 0.55);
}
</style>
