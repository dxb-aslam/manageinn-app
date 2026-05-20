<!--
  ProfilePage — current user + property summary + logout.

  Shows the connected bench URL (and lets the user change it), the active
  property, the user's role, and a Logout button that wipes credentials.
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton,
  IonItem, IonLabel, IonList, IonNote, IonIcon, alertController,
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getSiteUrl } from '@/services/site';
import { ok } from '@/services/toast';
import { logOutOutline, swapHorizontalOutline, settingsOutline, businessOutline } from 'ionicons/icons';
import MIBottomNav from '@/components/MIBottomNav.vue';

const router = useRouter();
const auth = useAuthStore();
const siteUrl = ref('');

onMounted(async () => {
  siteUrl.value = await getSiteUrl();
});

async function confirmLogout(): Promise<void> {
  const alert = await alertController.create({
    header: 'Sign out?',
    message: "You'll be back to the login screen.",
    buttons: [
      { text: 'Stay signed in', role: 'cancel' },
      {
        text: 'Sign out',
        role: 'destructive',
        handler: async () => {
          await auth.logout();
          await ok('Signed out');
        },
      },
    ],
  });
  await alert.present();
}

function changeSite(): void {
  router.push('/site-setup');
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle class="mi-font-display title">Profile</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true">
      <div class="page">
        <!-- User card -->
        <section class="user-card">
          <div class="avatar">{{ (auth.full_name || '?')[0].toUpperCase() }}</div>
          <div class="meta">
            <div class="name">{{ auth.full_name || auth.user || 'Signed out' }}</div>
            <div class="email">{{ auth.user }}</div>
            <div class="role">{{ auth.myRole }}</div>
          </div>
        </section>

        <!-- Property -->
        <IonList class="list" inset>
          <IonItem button :detail="false">
            <IonIcon slot="start" :icon="businessOutline" />
            <IonLabel>
              <h3>Property</h3>
              <p>{{ auth.current?.property_name || 'No property linked' }}</p>
            </IonLabel>
          </IonItem>
          <IonItem v-if="auth.is_system_user" button @click="changeSite" :detail="true">
            <IonIcon slot="start" :icon="swapHorizontalOutline" />
            <IonLabel>
              <h3>Switch to Desk</h3>
              <p>Open the Frappe Desk in a browser</p>
            </IonLabel>
          </IonItem>
          <IonItem button @click="router.push('/settings')" :detail="true">
            <IonIcon slot="start" :icon="settingsOutline" />
            <IonLabel>
              <h3>App settings</h3>
              <p>Biometric unlock, bench URL, version</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <!-- Sign out -->
        <div class="signout">
          <IonButton expand="block" fill="outline" color="danger" @click="confirmLogout">
            <IonIcon slot="start" :icon="logOutOutline" />
            Sign out
          </IonButton>
        </div>

        <IonNote class="version mi-font-hand">Manage Inn · mobile · 0.1</IonNote>
      </div>

      <MIBottomNav />
    </IonContent>
  </IonPage>
</template>

<style scoped>
.title {
  font-style: italic;
  font-weight: 600;
}
.page {
  padding: 16px 0 96px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.user-card {
  margin: 0 16px;
  padding: 18px;
  background: var(--mi-paper);
  border: 1px solid var(--ion-border-color);
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.avatar {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--mi-terra), var(--mi-terra-d));
  color: var(--mi-paper);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 600;
}
.meta { flex: 1; min-width: 0; }
.name { font-weight: 600; font-size: 17px; }
.email { font-size: 12px; color: rgba(42, 34, 26, 0.55); font-family: ui-monospace, monospace; }
.role {
  margin-top: 4px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--mi-terra-d);
  font-weight: 600;
}
.list {
  background: transparent;
}
.signout {
  padding: 8px 16px 0;
}
.version {
  text-align: center;
  font-size: 14px;
  color: rgba(42, 34, 26, 0.45);
  padding: 24px 16px 0;
}
</style>
