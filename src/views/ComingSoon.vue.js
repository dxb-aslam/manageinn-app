/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { IonContent, IonPage } from '@ionic/vue';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import EmptyState from '@/components/EmptyState.vue';
const __VLS_props = defineProps();
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
}));
const __VLS_7 = __VLS_6({
    fullscreen: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
/** @type {[typeof MITopBar, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(MITopBar, new MITopBar({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page" },
});
/** @type {[typeof EmptyState, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
    emoji: "🛠️",
    headline: ((__VLS_ctx.feature || 'This view') + ' is coming next'),
    body: "It works in the web app already — porting to mobile is on the punch list. For now, open the browser on manageinn.dxbitz.com for full features.",
}));
const __VLS_13 = __VLS_12({
    emoji: "🛠️",
    headline: ((__VLS_ctx.feature || 'This view') + ' is coming next'),
    body: "It works in the web app already — porting to mobile is on the punch list. For now, open the browser on manageinn.dxbitz.com for full features.",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
/** @type {[typeof MIBottomNav, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(MIBottomNav, new MIBottomNav({}));
const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonContent: IonContent,
            IonPage: IonPage,
            MITopBar: MITopBar,
            MIBottomNav: MIBottomNav,
            EmptyState: EmptyState,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
