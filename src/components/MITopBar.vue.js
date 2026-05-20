/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { useAuthStore } from '@/stores/auth';
import MILogo from './MILogo.vue';
import PropertySwitcher from './PropertySwitcher.vue';
const __VLS_props = defineProps();
const auth = useAuthStore();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "mi-topbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mi-topbar-brand" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mi-topbar-brand-row" },
});
/** @type {[typeof MILogo, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(MILogo, new MILogo({
    size: "sm",
}));
const __VLS_1 = __VLS_0({
    size: "sm",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof PropertySwitcher, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(PropertySwitcher, new PropertySwitcher({}));
const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
if (__VLS_ctx.$slots.actions) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mi-topbar-actions" },
    });
    var __VLS_6 = {};
}
/** @type {__VLS_StyleScopedClasses['mi-topbar']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-topbar-brand']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-topbar-brand-row']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-topbar-actions']} */ ;
// @ts-ignore
var __VLS_7 = __VLS_6;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MILogo: MILogo,
            PropertySwitcher: PropertySwitcher,
        };
    },
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
