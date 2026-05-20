/**
 * toast — tiny wrapper around Ionic's toastController for consistent UX.
 *
 * Three flavors:
 *   ok('Saved')           — sage bottom toast, 1.8s
 *   info('Loading...')    — neutral, 1.5s
 *   error('Failed: ...')  — terra-red, 3s, "Dismiss" button
 *
 * Why a wrapper? Same toast styling across every page without each one
 * importing toastController, picking colors, picking durations, etc.
 */
import { toastController } from '@ionic/vue';
export async function ok(message) {
    const t = await toastController.create({
        message,
        duration: 1800,
        color: 'success',
        position: 'bottom',
    });
    await t.present();
}
export async function info(message) {
    const t = await toastController.create({
        message,
        duration: 1500,
        position: 'bottom',
    });
    await t.present();
}
export async function error(message) {
    const t = await toastController.create({
        message,
        duration: 3000,
        color: 'danger',
        position: 'bottom',
        buttons: [{ text: 'Dismiss', role: 'cancel' }],
    });
    await t.present();
}
