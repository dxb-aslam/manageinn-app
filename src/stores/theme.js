/**
 * theme store — system / light / dark preference.
 *
 * Mostly here for future use; Manage Inn is light-mode-only for now, but
 * Ionic supports dark via `.ion-palette-dark` and we've imported the
 * palette CSS in main.ts. Flipping it is a one-liner here when we want it.
 */
import { defineStore } from 'pinia';
import { Preferences } from '@capacitor/preferences';
const KEY = 'manageinn_theme';
export const useThemeStore = defineStore('theme', {
    state: () => ({
        mode: 'light', // explicit light for now
        effective: 'light',
    }),
    actions: {
        async init() {
            const { value } = await Preferences.get({ key: KEY });
            this.mode = value || 'light';
            this.apply();
        },
        async setMode(mode) {
            this.mode = mode;
            await Preferences.set({ key: KEY, value: mode });
            this.apply();
        },
        /** Resolve the effective theme + flip the <html> class. */
        apply() {
            let eff = 'light';
            if (this.mode === 'dark')
                eff = 'dark';
            else if (this.mode === 'system') {
                eff = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            this.effective = eff;
            document.documentElement.classList.toggle('ion-palette-dark', eff === 'dark');
        },
    },
});
