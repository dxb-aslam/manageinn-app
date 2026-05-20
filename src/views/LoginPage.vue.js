/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { IonContent, IonPage, IonInput, IonButton, IonItem, IonLabel, IonSpinner } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { error as toastError } from '@/services/toast';
import { initPush } from '@/services/push';
import MILogo from '@/components/MILogo.vue';
const router = useRouter();
const auth = useAuthStore();
const user = ref('');
const pwd = ref('');
const loading = ref(false);
const errMsg = ref('');
async function submit() {
    const u = (user.value || '').trim();
    const p = pwd.value || '';
    if (!u || !p) {
        errMsg.value = 'Email and password please.';
        return;
    }
    loading.value = true;
    errMsg.value = '';
    try {
        await auth.login(u, p);
        // Fire-and-forget push registration on the new session. Doesn't
        // block navigation — the FCM handshake takes a beat.
        void initPush(router);
        router.replace('/home');
    }
    catch (e) {
        errMsg.value = e?.message || 'Login failed';
        await toastError(errMsg.value);
    }
    finally {
        loading.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
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
    ...{ class: "login-shell" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "brand" },
});
/** @type {[typeof MILogo, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(MILogo, new MILogo({
    size: "lg",
    withSubtitle: true,
    subtitle: "welcome back",
}));
const __VLS_10 = __VLS_9({
    size: "lg",
    withSubtitle: true,
    subtitle: "welcome back",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.submit) },
    ...{ class: "card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "mi-font-display title" },
});
const __VLS_12 = {}.IonItem;
/** @type {[typeof __VLS_components.IonItem, typeof __VLS_components.IonItem, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "field" },
    lines: "full",
}));
const __VLS_14 = __VLS_13({
    ...{ class: "field" },
    lines: "full",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.IonLabel;
/** @type {[typeof __VLS_components.IonLabel, typeof __VLS_components.IonLabel, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    position: "stacked",
}));
const __VLS_18 = __VLS_17({
    position: "stacked",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
var __VLS_19;
const __VLS_20 = {}.IonInput;
/** @type {[typeof __VLS_components.IonInput, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.user),
    type: "text",
    autocomplete: "username",
    autocapitalize: "off",
    inputmode: "email",
    placeholder: "you@example.com",
    disabled: (__VLS_ctx.loading),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.user),
    type: "text",
    autocomplete: "username",
    autocapitalize: "off",
    inputmode: "email",
    placeholder: "you@example.com",
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
var __VLS_15;
const __VLS_24 = {}.IonItem;
/** @type {[typeof __VLS_components.IonItem, typeof __VLS_components.IonItem, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ class: "field" },
    lines: "full",
}));
const __VLS_26 = __VLS_25({
    ...{ class: "field" },
    lines: "full",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.IonLabel;
/** @type {[typeof __VLS_components.IonLabel, typeof __VLS_components.IonLabel, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    position: "stacked",
}));
const __VLS_30 = __VLS_29({
    position: "stacked",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
var __VLS_31;
const __VLS_32 = {}.IonInput;
/** @type {[typeof __VLS_components.IonInput, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.pwd),
    type: "password",
    autocomplete: "current-password",
    disabled: (__VLS_ctx.loading),
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.pwd),
    type: "password",
    autocomplete: "current-password",
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
var __VLS_27;
if (__VLS_ctx.errMsg) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "err" },
    });
    (__VLS_ctx.errMsg);
}
const __VLS_36 = {}.IonButton;
/** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    expand: "block",
    ...{ class: "mi-btn-tactile submit" },
    disabled: (__VLS_ctx.loading),
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    expand: "block",
    ...{ class: "mi-btn-tactile submit" },
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (__VLS_ctx.submit)
};
__VLS_39.slots.default;
if (__VLS_ctx.loading) {
    const __VLS_44 = {}.IonSpinner;
    /** @type {[typeof __VLS_components.IonSpinner, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        name: "crescent",
    }));
    const __VLS_46 = __VLS_45({
        name: "crescent",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
var __VLS_39;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "footer mi-font-hand" },
});
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['ion-padding']} */ ;
/** @type {__VLS_StyleScopedClasses['login-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['err']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-btn-tactile']} */ ;
/** @type {__VLS_StyleScopedClasses['submit']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonContent: IonContent,
            IonPage: IonPage,
            IonInput: IonInput,
            IonButton: IonButton,
            IonItem: IonItem,
            IonLabel: IonLabel,
            IonSpinner: IonSpinner,
            MILogo: MILogo,
            user: user,
            pwd: pwd,
            loading: loading,
            errMsg: errMsg,
            submit: submit,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
