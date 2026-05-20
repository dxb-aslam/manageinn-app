/**
 * theme store — system / light / dark preference.
 *
 * Mostly here for future use; Manage Inn is light-mode-only for now, but
 * Ionic supports dark via `.ion-palette-dark` and we've imported the
 * palette CSS in main.ts. Flipping it is a one-liner here when we want it.
 */
import { defineStore } from 'pinia';
import { Preferences } from '@capacitor/preferences';

type Mode = 'system' | 'light' | 'dark';
const KEY = 'manageinn_theme';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: 'light' as Mode,        // explicit light for now
    effective: 'light' as 'light' | 'dark',
  }),

  actions: {
    async init(): Promise<void> {
      const { value } = await Preferences.get({ key: KEY });
      this.mode = (value as Mode) || 'light';
      this.apply();
    },

    async setMode(mode: Mode): Promise<void> {
      this.mode = mode;
      await Preferences.set({ key: KEY, value: mode });
      this.apply();
    },

    /** Resolve the effective theme + flip the <html> class. */
    apply(): void {
      let eff: 'light' | 'dark' = 'light';
      if (this.mode === 'dark') eff = 'dark';
      else if (this.mode === 'system') {
        eff = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      this.effective = eff;
      document.documentElement.classList.toggle('ion-palette-dark', eff === 'dark');
    },
  },
});
