/**
 * useCurrency — port of the web app's composable to TypeScript.
 *
 * Returns a reactive money() formatter that uses the active property's
 * currency. See ../../../../apps/manageinn/frontend/src/composables/useCurrency.js
 * for the canonical version; keep these in sync.
 */
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
const SYMBOLS = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ',
    SGD: 'S$',
    AUD: 'A$',
    CAD: 'C$',
    JPY: '¥',
    CNY: '¥',
    CHF: 'Fr.',
    LKR: 'Rs.',
    MYR: 'RM',
    THB: '฿',
    IDR: 'Rp',
    PHP: '₱',
    VND: '₫',
    NPR: 'Rs',
    BDT: '৳',
};
export function useCurrency() {
    const auth = useAuthStore();
    const code = computed(() => auth.current?.currency || 'INR');
    const symbol = computed(() => SYMBOLS[code.value] || `${code.value} `);
    function money(value, opts = {}) {
        const v = Number(value || 0);
        const forceDecimals = opts === true || (typeof opts === 'object' && opts.forceDecimals === true);
        const formatted = v.toLocaleString('en-IN', {
            minimumFractionDigits: forceDecimals ? 2 : 0,
            maximumFractionDigits: forceDecimals ? 2 : 0,
        });
        return `${symbol.value}${formatted}`;
    }
    return { code, symbol, money };
}
