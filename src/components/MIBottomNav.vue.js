/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
// 4 tabs max — anything more starts to crowd small phones. We pick the
// most-frequent surfaces for each role; the others are reachable via
// Profile → "More" or via deep links from the cards on Home.
const tabs = [
    {
        to: '/home',
        label: 'Home',
        icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    },
    {
        to: '/calendar',
        label: 'Calendar',
        icon: 'M3 4h18v18H3z M16 2v6 M8 2v6 M3 10h18',
        hideForCleaning: true,
    },
    {
        to: '/bookings',
        label: 'Bookings',
        icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
        hideForCleaning: true,
    },
    {
        to: '/cleaning',
        label: 'Cleaning',
        icon: 'M3 3h18v6H3z M9 15a3 3 0 1 0 6 0c0-2-3-6-3-6s-3 4-3 6z',
    },
];
// Cleaning Staff gets a Rooms tab instead of Bookings/Calendar (so they
// can update unit status from the same screen). The role filter in
// `visible` below swaps it in for them.
const cleaningStaffTabs = [
    tabs[0], // Home
    { to: '/cleaning', label: 'Cleaning',
        icon: 'M3 3h18v6H3z M9 15a3 3 0 1 0 6 0c0-2-3-6-3-6s-3 4-3 6z' },
    { to: '/rooms', label: 'Rooms',
        icon: 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9' },
];
const visible = computed(() => {
    if (auth.isCleaningOnly)
        return cleaningStaffTabs;
    return tabs;
});
function isActive(to) {
    return route.path === to || route.path.startsWith(to + '/');
}
function go(to) {
    if (route.path !== to) {
        router.push(to);
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['mi-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "mi-bottom-nav" },
});
for (const [t] of __VLS_getVForSourceType((__VLS_ctx.visible))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.go(t.to);
            } },
        key: (t.to),
        ...{ class: "mi-tab" },
        ...{ class: ({ active: __VLS_ctx.isActive(t.to) }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "22",
        height: "22",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    for (const [p, i] of __VLS_getVForSourceType((t.icon.split(' M ').map((s, idx) => (idx === 0 ? s : 'M ' + s))))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            key: (i),
            d: (p),
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (t.label);
}
/** @type {__VLS_StyleScopedClasses['mi-bottom-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            visible: visible,
            isActive: isActive,
            go: go,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
