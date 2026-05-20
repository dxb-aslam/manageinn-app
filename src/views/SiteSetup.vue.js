/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { IonContent, IonPage, IonInput, IonButton, IonItem, IonLabel, IonNote } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { getSiteUrl, setSiteUrl, getDefaultSite } from '@/services/site';
import { ok, error } from '@/services/toast';
import MILogo from '@/components/MILogo.vue';
const router = useRouter();
const value = ref('');
const saving = ref(false);
onMounted(async () => {
    value.value = await getSiteUrl();
});
async function save() {
    const v = (value.value || '').trim();
    if (!/^https?:\/\/.+/.test(v)) {
        await error('Please enter a full URL (https://…)');
        return;
    }
    saving.value = true;
    try {
        await setSiteUrl(v);
        await ok('Site saved');
        router.replace('/splash');
    }
    finally {
        saving.value = false;
    }
}
function useDefault() {
    value.value = getDefaultSite();
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
    ...{ class: "setup-shell" },
});
/** @type {[typeof MILogo, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(MILogo, new MILogo({
    size: "md",
    withSubtitle: true,
    subtitle: "where's your bench?",
}));
const __VLS_10 = __VLS_9({
    size: "md",
    withSubtitle: true,
    subtitle: "where's your bench?",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "lead" },
});
const __VLS_12 = {}.IonItem;
/** @type {[typeof __VLS_components.IonItem, typeof __VLS_components.IonItem, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "field" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "field" },
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
    modelValue: (__VLS_ctx.value),
    type: "url",
    inputmode: "url",
    placeholder: "https://your-site.example.com",
    autocapitalize: "off",
    autocomplete: "off",
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.value),
    type: "url",
    inputmode: "url",
    placeholder: "https://your-site.example.com",
    autocapitalize: "off",
    autocomplete: "off",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
var __VLS_15;
const __VLS_24 = {}.IonNote;
/** @type {[typeof __VLS_components.IonNote, typeof __VLS_components.IonNote, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ class: "hint" },
}));
const __VLS_26 = __VLS_25({
    ...{ class: "hint" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
var __VLS_27;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
const __VLS_28 = {}.IonButton;
/** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ 'onClick': {} },
    expand: "block",
    ...{ class: "mi-btn-tactile" },
    disabled: (__VLS_ctx.saving),
}));
const __VLS_30 = __VLS_29({
    ...{ 'onClick': {} },
    expand: "block",
    ...{ class: "mi-btn-tactile" },
    disabled: (__VLS_ctx.saving),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_32;
let __VLS_33;
let __VLS_34;
const __VLS_35 = {
    onClick: (__VLS_ctx.save)
};
__VLS_31.slots.default;
(__VLS_ctx.saving ? 'Saving…' : 'Continue');
var __VLS_31;
const __VLS_36 = {}.IonButton;
/** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    expand: "block",
    fill: "clear",
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    expand: "block",
    fill: "clear",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (__VLS_ctx.useDefault)
};
__VLS_39.slots.default;
var __VLS_39;
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['ion-padding']} */ ;
/** @type {__VLS_StyleScopedClasses['setup-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['lead']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-btn-tactile']} */ ;
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
            IonNote: IonNote,
            MILogo: MILogo,
            value: value,
            saving: saving,
            save: save,
            useDefault: useDefault,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
