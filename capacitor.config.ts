import type { CapacitorConfig } from '@capacitor/cli';

// CAP_DEV_URL is set during the live-reload sync (see scripts/dev-android.sh).
// When present, the WebView loads from the LAN Vite dev server instead of
// the bundled `dist/`, which gives Hot-Module-Reload on a physical device.
const DEV_URL = process.env.CAP_DEV_URL || '';

const config: CapacitorConfig = {
  appId: 'com.dxbitz.manageinn',
  appName: 'Manage Inn',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
  ...(DEV_URL
    ? {
        server: {
          url: DEV_URL,
          // Vite's dev server is http://, so the WebView needs cleartext
          // explicitly permitted while in live-reload mode.
          cleartext: true,
        },
      }
    : {}),
};

export default config;
