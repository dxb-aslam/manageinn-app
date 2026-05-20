/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted, ref } from 'vue';
import { IonContent, IonPage, IonSpinner, IonButton, IonIcon } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getSiteUrl } from '@/services/site';
import { readCreds } from '@/services/http';
import { isEnabled as bioEnabled, verify as bioVerify, disable as bioDisable } from '@/services/biometric';
import { fingerPrintOutline } from 'ionicons/icons';
import MILogo from '@/components/MILogo.vue';
const router = useRouter();
const auth = useAuthStore();
const error = ref('');
const retrying = ref(false);
// Biometric lock state — only meaningful when stored creds + biometric
// is opted in. The user sees a "Tap to unlock" button if they cancelled
// the prompt; we don't lock them out completely.
const needsBio = ref(false);
async function decide() {
    error.value = '';
    await getSiteUrl();
    // (1) Creds present? If not → straight to login. No biometric gate
    //     because there's nothing to unlock.
    const creds = await readCreds();
    if (!creds) {
        router.replace('/login');
        return;
    }
    // (2) If biometric unlock is enabled, prompt BEFORE hydrating. Network
    //     calls don't need to happen if the user can't even unlock the app.
    if (await bioEnabled()) {
        const ok = await bioVerify('Unlock Manage Inn');
        if (!ok) {
            // Don't kick to /login automatically — they might've fat-fingered
            // the sensor. Show a manual unlock button.
            needsBio.value = true;
            return;
        }
    }
    // (3) Hydrate session
    try {
        await auth.hydrate();
        if (auth.isLoggedIn) {
            router.replace('/home');
        }
        else {
            router.replace('/login');
        }
    }
    catch (e) {
        if (e?.status === 401) {
            router.replace('/login');
        }
        else {
            error.value = e?.message || 'Could not reach the server';
        }
    }
}
async function unlock() {
    needsBio.value = false;
    await decide();
}
async function turnOffBiometric() {
    // Escape hatch — if the user's biometric is broken (fingerprint sensor
    // failing, etc.) they can disable it from here and use password instead.
    await bioDisable();
    await decide();
}
async function retry() {
    retrying.value = true;
    await decide();
    retrying.value = false;
}
async function changeSite() {
    router.replace('/site-setup');
}
onMounted(decide);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['splash-error']} */ ;
/** @type {__VLS_StyleScopedClasses['link']} */ ;
/** @type {__VLS_StyleScopedClasses['link']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.IonPage;
/** @type {[typeof __VLS_components.IonPage, typeof __VLS_components.IonPage, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.IonContent;
/** @type {[typeof __VLS_components.IonContent, typeof __VLS_components.IonContent, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    fullscreen: (true),
    ...{ class: "ion-padding" },
}));
const __VLS_7 = __VLS_6({
    fullscreen: (true),
    ...{ class: "ion-padding" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "splash-shell" },
});
/** @type {[typeof MILogo, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(MILogo, new MILogo({
    size: "lg",
    withSubtitle: true,
    subtitle: "calm operations",
}));
const __VLS_10 = __VLS_9({
    size: "lg",
    withSubtitle: true,
    subtitle: "calm operations",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
if (__VLS_ctx.needsBio) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "splash-bio" },
    });
    const __VLS_12 = {}.IonButton;
    /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        ...{ class: "mi-btn-tactile" },
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        ...{ class: "mi-btn-tactile" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.unlock)
    };
    __VLS_15.slots.default;
    const __VLS_20 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        slot: "start",
        icon: (__VLS_ctx.fingerPrintOutline),
    }));
    const __VLS_22 = __VLS_21({
        slot: "start",
        icon: (__VLS_ctx.fingerPrintOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    var __VLS_15;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.turnOffBiometric) },
        ...{ class: "link subtle" },
    });
}
else if (!__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "splash-spin" },
    });
    const __VLS_24 = {}.IonSpinner;
    /** @type {[typeof __VLS_components.IonSpinner, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        name: "crescent",
    }));
    const __VLS_26 = __VLS_25({
        name: "crescent",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "splash-error" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "msg" },
    });
    (__VLS_ctx.error);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.retry) },
        ...{ class: "link" },
        disabled: (__VLS_ctx.retrying),
    });
    (__VLS_ctx.retrying ? 'Trying…' : 'Try again');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.changeSite) },
        ...{ class: "link subtle" },
    });
}
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['ion-padding']} */ ;
/** @type {__VLS_StyleScopedClasses['splash-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['splash-bio']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-btn-tactile']} */ ;
/** @type {__VLS_StyleScopedClasses['link']} */ ;
/** @type {__VLS_StyleScopedClasses['subtle']} */ ;
/** @type {__VLS_StyleScopedClasses['splash-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['splash-error']} */ ;
/** @type {__VLS_StyleScopedClasses['msg']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['link']} */ ;
/** @type {__VLS_StyleScopedClasses['link']} */ ;
/** @type {__VLS_StyleScopedClasses['subtle']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonContent: IonContent,
            IonPage: IonPage,
            IonSpinner: IonSpinner,
            IonButton: IonButton,
            IonIcon: IonIcon,
            fingerPrintOutline: fingerPrintOutline,
            MILogo: MILogo,
            error: error,
            retrying: retrying,
            needsBio: needsBio,
            unlock: unlock,
            turnOffBiometric: turnOffBiometric,
            retry: retry,
            changeSite: changeSite,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
