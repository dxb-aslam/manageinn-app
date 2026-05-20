/// <reference types="../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { IonApp, IonRouterOutlet, useIonRouter } from '@ionic/vue';
import { onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AUTH_ROUTES, registerNavigators } from '@/services/navigation';
const router = useRouter();
const ionRouter = useIonRouter();
let backListenerHandle = null;
onMounted(async () => {
    // Expose the routers to services that need to redirect without holding
    // a Vue composable handle (auth store, http error layer, …).
    registerNavigators({ ionRouter, router });
    // ── Android hardware back button ──────────────────────────────────
    // Ionic's default behaviour pops the page stack; on auth pages we want
    // it to minimise the app instead (don't go forward off the login
    // screen). Outside auth routes: normal back, or minimise if no history.
    if (Capacitor.isNativePlatform()) {
        try {
            backListenerHandle = await CapApp.addListener('backButton', async ({ canGoBack }) => {
                const path = router.currentRoute.value.path;
                if (AUTH_ROUTES.has(path)) {
                    try {
                        await CapApp.minimizeApp();
                    }
                    catch { /* iOS / no-op */ }
                    return;
                }
                if (canGoBack) {
                    router.back();
                }
                else {
                    try {
                        await CapApp.minimizeApp();
                    }
                    catch { /* ignore */ }
                }
            });
        }
        catch {
            /* not fatal — Ionic's default back behaviour still works */
        }
    }
});
onBeforeUnmount(() => {
    if (backListenerHandle) {
        try {
            void backListenerHandle.remove();
        }
        catch { /* ignore */ }
        backListenerHandle = null;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.IonApp;
/** @type {[typeof __VLS_components.IonApp, typeof __VLS_components.IonApp, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.IonRouterOutlet;
/** @type {[typeof __VLS_components.IonRouterOutlet, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonApp: IonApp,
            IonRouterOutlet: IonRouterOutlet,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
