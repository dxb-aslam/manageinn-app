/// <reference types="vite/client" />

import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// Vite config for the Manage Inn Ionic app.
//
// Dev-server proxy:
//   The browser-based dev server (`yarn dev` on a laptop) proxies `/api`,
//   `/files`, and `/assets` to a Frappe bench so cross-origin / CSRF /
//   cookie nightmares stay out of the way. Override the target via env:
//
//     VITE_DEV_API_TARGET=http://localhost:8000
//     VITE_DEV_API_HOST=manageinn.local
//
//   Frappe routes by Host header; the Host: rewrite lets you proxy to a
//   site whose name doesn't match the bench's IP.
//
// LAN access:
//   `host: true` exposes the dev server on the LAN so a phone on the same
//   Wi-Fi can hit http://<your-mac-ip>:5173/. The Capacitor live-reload
//   script (scripts/dev-android.sh) plumbs that URL into the APK so HMR
//   works on the physical device.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const devTarget = env.VITE_DEV_API_TARGET || 'http://localhost:8000';
  const devHost = env.VITE_DEV_API_HOST || 'manageinn.local';

  const proxyOpts = {
    target: devTarget,
    changeOrigin: false,
    secure: false,
    configure: (proxy: any) => {
      proxy.on('proxyReq', (proxyReq: any) => {
        proxyReq.setHeader('Host', devHost);
        // Strip the Desk session cookie so guest endpoints stay guest
        // (otherwise Frappe sees the sid, makes us "logged in", and enforces CSRF).
        proxyReq.removeHeader('Cookie');
      });
    },
  };

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': proxyOpts,
        '/files': proxyOpts,
        '/assets': proxyOpts,
      },
    },
  };
});
