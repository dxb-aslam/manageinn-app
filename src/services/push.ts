/**
 * push — FCM token registration + notification handling.
 *
 * Flow:
 *   initPush()
 *     ↓ called from main.ts after auth.hydrate succeeds
 *     ↓ skips silently on web (PushNotifications.register would fail there)
 *     ↓ requests notification permission (system prompt)
 *     ↓ PushNotifications.register() → Firebase issues a token
 *     ↓ POST manageinn.api.register_push_token with the token
 *     ↓ wire listeners: pushNotificationReceived (in-foreground) +
 *       pushNotificationActionPerformed (user tapped a notification)
 *
 *   unregisterCurrent()
 *     ↓ called from auth.logout()
 *     ↓ POST manageinn.api.unregister_push_token to remove from server
 *     ↓ remove all delivered notifications + reset badge
 *
 * Sending side:
 *   The server-side send (firebase-admin → FCM) is NOT in this commit.
 *   The endpoint accepts and stores tokens; once the Firebase service
 *   account is provisioned on the bench, we'll wire send-on-event hooks
 *   for: new Guest Request, new Booking, Cleaning Task assigned. Until
 *   then, registered tokens just sit in the DB unused.
 *
 * Why not push notifications on web?
 *   Web push is a different beast (VAPID + ServiceWorkerRegistration.pushManager).
 *   The Manage Inn web SPA already shows in-app banners for new requests
 *   via the dashboard alert; that's enough for desk-bound staff. Mobile
 *   gets the heavier OS-level notifications.
 */
import { Capacitor } from '@capacitor/core';
import { PushNotifications, type Token } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { Device } from '@capacitor/device';
import { api } from '@/services/http';
import type { Router } from 'vue-router';

const TOKEN_KEY = 'manageinn_fcm_token';

let registeredOnce = false;

/**
 * Set up push notifications. Call once per session after auth.
 * Idempotent — re-calling is a no-op if already registered for this run.
 */
export async function initPush(router: Router): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  if (registeredOnce) return;
  registeredOnce = true;

  try {
    // 1. Permission. On Android 13+ this throws the runtime prompt; older
    //    Android grants by default. On iOS it always prompts.
    const perm = await PushNotifications.requestPermissions();
    if (perm.receive !== 'granted') {
      console.info('[manageinn] Push permission not granted — skipping');
      return;
    }

    // 2. Listen BEFORE register, otherwise the registration event can
    //    fire before our handler attaches.
    PushNotifications.addListener('registration', async (token: Token) => {
      await onTokenReceived(token.value);
    });

    PushNotifications.addListener('registrationError', (e) => {
      console.warn('[manageinn] Push registration error:', e);
    });

    // 3. Foreground notifications — Capacitor doesn't auto-display them
    //    while the app is open. Mirror via LocalNotifications so the
    //    user still sees something.
    PushNotifications.addListener('pushNotificationReceived', async (notification) => {
      await LocalNotifications.schedule({
        notifications: [{
          id: Date.now() % 2147483647,
          title: notification.title || 'Manage Inn',
          body: notification.body || '',
          extra: notification.data || {},
          smallIcon: 'ic_stat_icon',
        }],
      });
    });

    // 4. User tapped a notification → deep-link to the relevant view.
    //    The notification's `data.route` (set on the server when we send)
    //    is the path to navigate to.
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      const route = action.notification?.data?.route;
      if (route && typeof route === 'string') {
        router.push(route);
      }
    });

    // 5. Now request a token from FCM/APNs
    await PushNotifications.register();
  } catch (e) {
    console.warn('[manageinn] initPush failed:', e);
  }
}

/**
 * Fired once Firebase gives us a token. Persist locally so we can
 * unregister later, then send to the bench so the server side can target
 * this device.
 */
async function onTokenReceived(token: string): Promise<void> {
  try {
    await Preferences.set({ key: TOKEN_KEY, value: token });

    const platform = Capacitor.getPlatform(); // "ios" | "android" | "web"
    let device_label = '';
    try {
      const info = await Device.getInfo();
      device_label = `${info.manufacturer || ''} ${info.model || ''}`.trim();
    } catch {
      /* not critical */
    }

    await api('manageinn.api.register_push_token', {
      fcm_token: token,
      platform,
      device_label,
    });
    console.info('[manageinn] Push token registered with bench');
  } catch (e) {
    console.warn('[manageinn] Could not register push token:', e);
  }
}

/**
 * Tell the bench to forget this device's token, then clear local state.
 * Called from auth.logout.
 */
export async function unregisterCurrent(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { value: token } = await Preferences.get({ key: TOKEN_KEY });
    if (token) {
      await api('manageinn.api.unregister_push_token', { fcm_token: token }).catch(() => null);
    }
    await Preferences.remove({ key: TOKEN_KEY });

    try {
      await PushNotifications.removeAllDeliveredNotifications();
    } catch {
      /* ignore */
    }
  } catch (e) {
    console.warn('[manageinn] unregisterCurrent failed:', e);
  }

  registeredOnce = false;
}
