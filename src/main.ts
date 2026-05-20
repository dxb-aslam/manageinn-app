/**
 * main.ts — app bootstrap.
 *
 * Order matters:
 *   1. Create Vue app + Pinia + Ionic
 *   2. Init theme store (reads preference, flips html class)
 *   3. Hydrate auth store (reads stored token, calls bootstrap if valid)
 *   4. Wait for router to be ready (so initial route resolution sees the
 *      hydrated session — otherwise SplashCheck races the auth state)
 *   5. Mount
 *
 * Errors during hydrate don't block mount — SplashCheck handles offline /
 * network failures and offers a retry.
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';

import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';

/* Core Ionic CSS — the import order Ionic recommends */
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Optional Ionic dark palette — toggled by .ion-palette-dark on <html>.
   The theme store flips that class. Manage Inn is light-mode-only today
   but keeping the import means we can opt in later without rebundling. */
import '@ionic/vue/css/palettes/dark.class.css';

/* Theme variables + our overrides — order: variables.css FIRST so our
   custom selectors in manageinn.css can override Ionic defaults. */
import './theme/variables.css';
import './theme/manageinn.css';

const app = createApp(App);
const pinia = createPinia();

app.use(IonicVue);
app.use(pinia);
app.use(router);

(async () => {
  const theme = useThemeStore();
  await theme.init();

  const auth = useAuthStore();
  try {
    await auth.hydrate();
  } catch {
    // Hydrate failures are surfaced by SplashCheck (network / 401) — don't
    // block mount over them.
  }

  await router.isReady();
  app.mount('#app');
})();
