/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted, ref } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonToggle, IonIcon, IonNote, } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { isAvailable as bioIsAvailable, isEnabled as bioIsEnabled, enable as bioEnable, disable as bioDisable, biometryLabel, } from '@/services/biometric';
import { getSiteUrl } from '@/services/site';
import { ok, error as toastError } from '@/services/toast';
import { fingerPrintOutline, globeOutline, informationCircleOutline, chevronForwardOutline, logoGithub, } from 'ionicons/icons';
const router = useRouter();
const bioCheck = ref({ available: false, label: 'Biometric', reason: 'Checking…' });
const bioOn = ref(false);
const bioBusy = ref(false);
const siteUrl = ref('');
onMounted(async () => {
    const a = await bioIsAvailable();
    bioCheck.value = {
        available: a.available,
        label: biometryLabel(a.biometryType),
        reason: a.reason,
    };
    bioOn.value = await bioIsEnabled();
    siteUrl.value = await getSiteUrl();
});
async function onToggleBio(e) {
    if (bioBusy.value)
        return;
    bioBusy.value = true;
    const wantOn = e.detail.checked;
    try {
        if (wantOn) {
            const ok2 = await bioEnable(`Enable ${bioCheck.value.label} unlock`);
            if (!ok2) {
                bioOn.value = false;
                await toastError(`${bioCheck.value.label} verification failed`);
                return;
            }
            bioOn.value = true;
            await ok(`${bioCheck.value.label} unlock enabled`);
        }
        else {
            await bioDisable();
            bioOn.value = false;
            await ok(`${bioCheck.value.label} unlock disabled`);
        }
    }
    finally {
        bioBusy.value = false;
    }
}
function changeSite() {
    router.push('/site-setup');
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['section-h']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.IonPage;
/** @type {[typeof __VLS_components.IonPage, typeof __VLS_components.IonPage, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.IonHeader;
/** @type {[typeof __VLS_components.IonHeader, typeof __VLS_components.IonHeader, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.IonToolbar;
/** @type {[typeof __VLS_components.IonToolbar, typeof __VLS_components.IonToolbar, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
const __VLS_13 = {}.IonButtons;
/** @type {[typeof __VLS_components.IonButtons, typeof __VLS_components.IonButtons, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    slot: "start",
}));
const __VLS_15 = __VLS_14({
    slot: "start",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.IonBackButton;
/** @type {[typeof __VLS_components.IonBackButton, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    defaultHref: "/profile",
}));
const __VLS_19 = __VLS_18({
    defaultHref: "/profile",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
var __VLS_16;
const __VLS_21 = {}.IonTitle;
/** @type {[typeof __VLS_components.IonTitle, typeof __VLS_components.IonTitle, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ class: "mi-font-display title" },
}));
const __VLS_23 = __VLS_22({
    ...{ class: "mi-font-display title" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
var __VLS_24;
var __VLS_12;
var __VLS_8;
const __VLS_25 = {}.IonContent;
/** @type {[typeof __VLS_components.IonContent, typeof __VLS_components.IonContent, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    fullscreen: (true),
}));
const __VLS_27 = __VLS_26({
    fullscreen: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "mi-font-display section-h" },
});
const __VLS_29 = {}.IonList;
/** @type {[typeof __VLS_components.IonList, typeof __VLS_components.IonList, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    inset: true,
    ...{ class: "list" },
}));
const __VLS_31 = __VLS_30({
    inset: true,
    ...{ class: "list" },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
const __VLS_33 = {}.IonItem;
/** @type {[typeof __VLS_components.IonItem, typeof __VLS_components.IonItem, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
const __VLS_37 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    slot: "start",
    icon: (__VLS_ctx.fingerPrintOutline),
}));
const __VLS_39 = __VLS_38({
    slot: "start",
    icon: (__VLS_ctx.fingerPrintOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const __VLS_41 = {}.IonLabel;
/** @type {[typeof __VLS_components.IonLabel, typeof __VLS_components.IonLabel, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({}));
const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
(__VLS_ctx.bioCheck.label);
if (__VLS_ctx.bioCheck.available) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.bioCheck.reason);
}
var __VLS_44;
const __VLS_45 = {}.IonToggle;
/** @type {[typeof __VLS_components.IonToggle, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    ...{ 'onIonChange': {} },
    checked: (__VLS_ctx.bioOn),
    disabled: (!__VLS_ctx.bioCheck.available || __VLS_ctx.bioBusy),
}));
const __VLS_47 = __VLS_46({
    ...{ 'onIonChange': {} },
    checked: (__VLS_ctx.bioOn),
    disabled: (!__VLS_ctx.bioCheck.available || __VLS_ctx.bioBusy),
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
let __VLS_49;
let __VLS_50;
let __VLS_51;
const __VLS_52 = {
    onIonChange: (__VLS_ctx.onToggleBio)
};
var __VLS_48;
var __VLS_36;
var __VLS_32;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "mi-font-display section-h" },
});
const __VLS_53 = {}.IonList;
/** @type {[typeof __VLS_components.IonList, typeof __VLS_components.IonList, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    inset: true,
    ...{ class: "list" },
}));
const __VLS_55 = __VLS_54({
    inset: true,
    ...{ class: "list" },
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
const __VLS_57 = {}.IonItem;
/** @type {[typeof __VLS_components.IonItem, typeof __VLS_components.IonItem, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    ...{ 'onClick': {} },
    button: true,
    detail: (false),
}));
const __VLS_59 = __VLS_58({
    ...{ 'onClick': {} },
    button: true,
    detail: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
let __VLS_61;
let __VLS_62;
let __VLS_63;
const __VLS_64 = {
    onClick: (__VLS_ctx.changeSite)
};
__VLS_60.slots.default;
const __VLS_65 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    slot: "start",
    icon: (__VLS_ctx.globeOutline),
}));
const __VLS_67 = __VLS_66({
    slot: "start",
    icon: (__VLS_ctx.globeOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
const __VLS_69 = {}.IonLabel;
/** @type {[typeof __VLS_components.IonLabel, typeof __VLS_components.IonLabel, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({}));
const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
__VLS_72.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mono" },
});
(__VLS_ctx.siteUrl);
var __VLS_72;
const __VLS_73 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    slot: "end",
    icon: (__VLS_ctx.chevronForwardOutline),
    ...{ class: "chev" },
}));
const __VLS_75 = __VLS_74({
    slot: "end",
    icon: (__VLS_ctx.chevronForwardOutline),
    ...{ class: "chev" },
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
var __VLS_60;
var __VLS_56;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "mi-font-display section-h" },
});
const __VLS_77 = {}.IonList;
/** @type {[typeof __VLS_components.IonList, typeof __VLS_components.IonList, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    inset: true,
    ...{ class: "list" },
}));
const __VLS_79 = __VLS_78({
    inset: true,
    ...{ class: "list" },
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
const __VLS_81 = {}.IonItem;
/** @type {[typeof __VLS_components.IonItem, typeof __VLS_components.IonItem, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({}));
const __VLS_83 = __VLS_82({}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
const __VLS_85 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    slot: "start",
    icon: (__VLS_ctx.informationCircleOutline),
}));
const __VLS_87 = __VLS_86({
    slot: "start",
    icon: (__VLS_ctx.informationCircleOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
const __VLS_89 = {}.IonLabel;
/** @type {[typeof __VLS_components.IonLabel, typeof __VLS_components.IonLabel, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({}));
const __VLS_91 = __VLS_90({}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_92.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
var __VLS_92;
var __VLS_84;
const __VLS_93 = {}.IonItem;
/** @type {[typeof __VLS_components.IonItem, typeof __VLS_components.IonItem, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    button: true,
    href: "https://github.com/dxb-aslam/manageinn-app",
    target: "_blank",
    rel: "noopener",
    detail: (false),
}));
const __VLS_95 = __VLS_94({
    button: true,
    href: "https://github.com/dxb-aslam/manageinn-app",
    target: "_blank",
    rel: "noopener",
    detail: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
__VLS_96.slots.default;
const __VLS_97 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    slot: "start",
    icon: (__VLS_ctx.logoGithub),
}));
const __VLS_99 = __VLS_98({
    slot: "start",
    icon: (__VLS_ctx.logoGithub),
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
const __VLS_101 = {}.IonLabel;
/** @type {[typeof __VLS_components.IonLabel, typeof __VLS_components.IonLabel, ]} */ ;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({}));
const __VLS_103 = __VLS_102({}, ...__VLS_functionalComponentArgsRest(__VLS_102));
__VLS_104.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
var __VLS_104;
const __VLS_105 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, ]} */ ;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
    slot: "end",
    icon: (__VLS_ctx.chevronForwardOutline),
    ...{ class: "chev" },
}));
const __VLS_107 = __VLS_106({
    slot: "end",
    icon: (__VLS_ctx.chevronForwardOutline),
    ...{ class: "chev" },
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
var __VLS_96;
var __VLS_80;
const __VLS_109 = {}.IonNote;
/** @type {[typeof __VLS_components.IonNote, typeof __VLS_components.IonNote, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    ...{ class: "footer mi-font-hand" },
}));
const __VLS_111 = __VLS_110({
    ...{ class: "footer mi-font-hand" },
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
__VLS_112.slots.default;
var __VLS_112;
var __VLS_28;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['section-h']} */ ;
/** @type {__VLS_StyleScopedClasses['list']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['section-h']} */ ;
/** @type {__VLS_StyleScopedClasses['list']} */ ;
/** @type {__VLS_StyleScopedClasses['mono']} */ ;
/** @type {__VLS_StyleScopedClasses['chev']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['section-h']} */ ;
/** @type {__VLS_StyleScopedClasses['list']} */ ;
/** @type {__VLS_StyleScopedClasses['chev']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonContent: IonContent,
            IonPage: IonPage,
            IonHeader: IonHeader,
            IonToolbar: IonToolbar,
            IonTitle: IonTitle,
            IonButtons: IonButtons,
            IonBackButton: IonBackButton,
            IonList: IonList,
            IonItem: IonItem,
            IonLabel: IonLabel,
            IonToggle: IonToggle,
            IonIcon: IonIcon,
            IonNote: IonNote,
            fingerPrintOutline: fingerPrintOutline,
            globeOutline: globeOutline,
            informationCircleOutline: informationCircleOutline,
            chevronForwardOutline: chevronForwardOutline,
            logoGithub: logoGithub,
            bioCheck: bioCheck,
            bioOn: bioOn,
            bioBusy: bioBusy,
            siteUrl: siteUrl,
            onToggleBio: onToggleBio,
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
