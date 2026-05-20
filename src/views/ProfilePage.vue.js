/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted, ref } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonItem, IonLabel, IonList, IonNote, IonIcon, alertController, } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getSiteUrl } from '@/services/site';
import { ok } from '@/services/toast';
import { logOutOutline, swapHorizontalOutline, settingsOutline, businessOutline } from 'ionicons/icons';
import MIBottomNav from '@/components/MIBottomNav.vue';
const router = useRouter();
const auth = useAuthStore();
const siteUrl = ref('');
onMounted(async () => {
    siteUrl.value = await getSiteUrl();
});
async function confirmLogout() {
    const alert = await alertController.create({
        header: 'Sign out?',
        message: "You'll be back to the login screen.",
        buttons: [
            { text: 'Stay signed in', role: 'cancel' },
            {
                text: 'Sign out',
                role: 'destructive',
                handler: async () => {
                    await auth.logout();
                    await ok('Signed out');
                },
            },
        ],
    });
    await alert.present();
}
function changeSite() {
    router.push('/site-setup');
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
const __VLS_13 = {}.IonTitle;
/** @type {[typeof __VLS_components.IonTitle, typeof __VLS_components.IonTitle, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ class: "mi-font-display title" },
}));
const __VLS_15 = __VLS_14({
    ...{ class: "mi-font-display title" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
var __VLS_16;
var __VLS_12;
var __VLS_8;
const __VLS_17 = {}.IonContent;
/** @type {[typeof __VLS_components.IonContent, typeof __VLS_components.IonContent, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    fullscreen: (true),
}));
const __VLS_19 = __VLS_18({
    fullscreen: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "user-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar" },
});
((__VLS_ctx.auth.full_name || '?')[0].toUpperCase());
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "meta" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "name" },
});
(__VLS_ctx.auth.full_name || __VLS_ctx.auth.user || 'Signed out');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "email" },
});
(__VLS_ctx.auth.user);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "role" },
});
(__VLS_ctx.auth.myRole);
const __VLS_21 = {}.IonList;
/** @type {[typeof __VLS_components.IonList, typeof __VLS_components.IonList, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ class: "list" },
    inset: true,
}));
const __VLS_23 = __VLS_22({
    ...{ class: "list" },
    inset: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
const __VLS_25 = {}.IonItem;
/** @type {[typeof __VLS_components.IonItem, typeof __VLS_components.IonItem, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    button: true,
    detail: (false),
}));
const __VLS_27 = __VLS_26({
    button: true,
    detail: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
const __VLS_29 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    slot: "start",
    icon: (__VLS_ctx.businessOutline),
}));
const __VLS_31 = __VLS_30({
    slot: "start",
    icon: (__VLS_ctx.businessOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const __VLS_33 = {}.IonLabel;
/** @type {[typeof __VLS_components.IonLabel, typeof __VLS_components.IonLabel, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
(__VLS_ctx.auth.current?.property_name || 'No property linked');
var __VLS_36;
var __VLS_28;
if (__VLS_ctx.auth.is_system_user) {
    const __VLS_37 = {}.IonItem;
    /** @type {[typeof __VLS_components.IonItem, typeof __VLS_components.IonItem, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        ...{ 'onClick': {} },
        button: true,
        detail: (true),
    }));
    const __VLS_39 = __VLS_38({
        ...{ 'onClick': {} },
        button: true,
        detail: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    let __VLS_41;
    let __VLS_42;
    let __VLS_43;
    const __VLS_44 = {
        onClick: (__VLS_ctx.changeSite)
    };
    __VLS_40.slots.default;
    const __VLS_45 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, ]} */ ;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        slot: "start",
        icon: (__VLS_ctx.swapHorizontalOutline),
    }));
    const __VLS_47 = __VLS_46({
        slot: "start",
        icon: (__VLS_ctx.swapHorizontalOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    const __VLS_49 = {}.IonLabel;
    /** @type {[typeof __VLS_components.IonLabel, typeof __VLS_components.IonLabel, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
    __VLS_52.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    var __VLS_52;
    var __VLS_40;
}
const __VLS_53 = {}.IonItem;
/** @type {[typeof __VLS_components.IonItem, typeof __VLS_components.IonItem, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    ...{ 'onClick': {} },
    button: true,
    detail: (true),
}));
const __VLS_55 = __VLS_54({
    ...{ 'onClick': {} },
    button: true,
    detail: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
let __VLS_57;
let __VLS_58;
let __VLS_59;
const __VLS_60 = {
    onClick: (...[$event]) => {
        __VLS_ctx.router.push('/settings');
    }
};
__VLS_56.slots.default;
const __VLS_61 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    slot: "start",
    icon: (__VLS_ctx.settingsOutline),
}));
const __VLS_63 = __VLS_62({
    slot: "start",
    icon: (__VLS_ctx.settingsOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const __VLS_65 = {}.IonLabel;
/** @type {[typeof __VLS_components.IonLabel, typeof __VLS_components.IonLabel, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({}));
const __VLS_67 = __VLS_66({}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_68.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
var __VLS_68;
var __VLS_56;
var __VLS_24;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "signout" },
});
const __VLS_69 = {}.IonButton;
/** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    ...{ 'onClick': {} },
    expand: "block",
    fill: "outline",
    color: "danger",
}));
const __VLS_71 = __VLS_70({
    ...{ 'onClick': {} },
    expand: "block",
    fill: "outline",
    color: "danger",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_73;
let __VLS_74;
let __VLS_75;
const __VLS_76 = {
    onClick: (__VLS_ctx.confirmLogout)
};
__VLS_72.slots.default;
const __VLS_77 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    slot: "start",
    icon: (__VLS_ctx.logOutOutline),
}));
const __VLS_79 = __VLS_78({
    slot: "start",
    icon: (__VLS_ctx.logOutOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
var __VLS_72;
const __VLS_81 = {}.IonNote;
/** @type {[typeof __VLS_components.IonNote, typeof __VLS_components.IonNote, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    ...{ class: "version mi-font-hand" },
}));
const __VLS_83 = __VLS_82({
    ...{ class: "version mi-font-hand" },
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
var __VLS_84;
/** @type {[typeof MIBottomNav, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(MIBottomNav, new MIBottomNav({}));
const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
var __VLS_20;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['user-card']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['email']} */ ;
/** @type {__VLS_StyleScopedClasses['role']} */ ;
/** @type {__VLS_StyleScopedClasses['list']} */ ;
/** @type {__VLS_StyleScopedClasses['signout']} */ ;
/** @type {__VLS_StyleScopedClasses['version']} */ ;
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
            IonButton: IonButton,
            IonItem: IonItem,
            IonLabel: IonLabel,
            IonList: IonList,
            IonNote: IonNote,
            IonIcon: IonIcon,
            logOutOutline: logOutOutline,
            swapHorizontalOutline: swapHorizontalOutline,
            settingsOutline: settingsOutline,
            businessOutline: businessOutline,
            MIBottomNav: MIBottomNav,
            router: router,
            auth: auth,
            confirmLogout: confirmLogout,
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
