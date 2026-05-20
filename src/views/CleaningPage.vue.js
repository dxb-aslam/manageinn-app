/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onMounted, ref, watch } from 'vue';
import { IonContent, IonPage, IonRefresher, IonRefresherContent, IonSpinner, } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/services/http';
import { formatDateShort } from '@/composables/useDates';
import { error as toastError } from '@/services/toast';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import EmptyState from '@/components/EmptyState.vue';
const router = useRouter();
const auth = useAuthStore();
const tasks = ref([]);
const loading = ref(false);
const filter = ref('Pending');
const filters = [
    { id: 'all', label: 'All' },
    { id: 'Pending', label: 'Pending' },
    { id: 'In Progress', label: 'In progress' },
    { id: 'Done', label: 'Done' },
];
async function load() {
    if (!auth.current)
        return;
    loading.value = true;
    try {
        tasks.value = await api('manageinn.api.list_cleaning_tasks', {
            property: auth.current.name,
        });
    }
    catch (e) {
        await toastError(e?.message || 'Could not load cleaning tasks');
    }
    finally {
        loading.value = false;
    }
}
async function pullRefresh(e) {
    await load();
    e.target.complete();
}
onMounted(load);
watch(() => auth.current?.name, load);
const visible = computed(() => {
    const list = filter.value === 'all'
        ? tasks.value
        : tasks.value.filter((t) => t.status === filter.value);
    return [...list].sort((a, b) => {
        // Active states first, then by scheduled date desc
        const order = { 'Pending': 0, 'In Progress': 1, 'Done': 2, 'Skipped': 3 };
        const ds = (order[a.status] ?? 99) - (order[b.status] ?? 99);
        if (ds !== 0)
            return ds;
        return (b.scheduled_for || '').localeCompare(a.scheduled_for || '');
    });
});
const counts = computed(() => {
    const c = { all: tasks.value.length };
    for (const t of tasks.value)
        c[t.status] = (c[t.status] || 0) + 1;
    return c;
});
function progress(t) {
    if (!t.items_total)
        return 0;
    return Math.round(((t.items_done || 0) / t.items_total) * 100);
}
function typeColor(t) {
    return {
        'Checkout': 'mi-type-terra',
        'Mid-stay': 'mi-type-honey',
        'Daily': 'mi-type-sage',
        'Maintenance': 'mi-type-ink',
    }[t] || 'mi-type-ink';
}
function statusColor(s) {
    return {
        'Pending': 'mi-stat-terra',
        'In Progress': 'mi-stat-honey',
        'Done': 'mi-stat-sage',
        'Skipped': 'mi-stat-ink',
    }[s] || 'mi-stat-ink';
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['pills']} */ ;
/** @type {__VLS_StyleScopedClasses['pill']} */ ;
/** @type {__VLS_StyleScopedClasses['pill']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['type-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-type-terra']} */ ;
/** @type {__VLS_StyleScopedClasses['type-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-type-honey']} */ ;
/** @type {__VLS_StyleScopedClasses['type-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-type-sage']} */ ;
/** @type {__VLS_StyleScopedClasses['type-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-type-ink']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
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
const __VLS_9 = {}.IonRefresher;
/** @type {[typeof __VLS_components.IonRefresher, typeof __VLS_components.IonRefresher, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ 'onIonRefresh': {} },
    slot: "fixed",
}));
const __VLS_11 = __VLS_10({
    ...{ 'onIonRefresh': {} },
    slot: "fixed",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onIonRefresh: (__VLS_ctx.pullRefresh)
};
__VLS_12.slots.default;
const __VLS_17 = {}.IonRefresherContent;
/** @type {[typeof __VLS_components.IonRefresherContent, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
var __VLS_12;
/** @type {[typeof MITopBar, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(MITopBar, new MITopBar({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mi-font-hand head-sub" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "mi-font-display head-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pills" },
});
for (const [f] of __VLS_getVForSourceType((__VLS_ctx.filters))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.filter = f.id;
            } },
        key: (f.id),
        ...{ class: "pill" },
        ...{ class: ({ active: __VLS_ctx.filter === f.id }) },
    });
    (f.label);
    if (__VLS_ctx.counts[f.id]) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "count" },
        });
        (__VLS_ctx.counts[f.id]);
    }
}
if (__VLS_ctx.loading && !__VLS_ctx.tasks.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading" },
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
else if (!__VLS_ctx.visible.length) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        emoji: "🧹",
        headline: (__VLS_ctx.filter === 'all' ? 'No cleaning tasks yet' : 'Nothing in this filter'),
        body: (__VLS_ctx.filter === 'all' ? 'Tasks auto-spawn when bookings check out, or when a guest taps “Request cleaning”.' : ''),
    }));
    const __VLS_29 = __VLS_28({
        emoji: "🧹",
        headline: (__VLS_ctx.filter === 'all' ? 'No cleaning tasks yet' : 'Nothing in this filter'),
        body: (__VLS_ctx.filter === 'all' ? 'Tasks auto-spawn when bookings check out, or when a guest taps “Request cleaning”.' : ''),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "rows" },
    });
    for (const [t] of __VLS_getVForSourceType((__VLS_ctx.visible))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading && !__VLS_ctx.tasks.length))
                        return;
                    if (!!(!__VLS_ctx.visible.length))
                        return;
                    __VLS_ctx.router.push(`/cleaning/${encodeURIComponent(t.name)}`);
                } },
            key: (t.name),
            ...{ class: "row mi-lift" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "icon-pill" },
            ...{ class: (__VLS_ctx.typeColor(t.task_type)) },
        });
        if (t.task_type === 'Checkout') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        else if (t.task_type === 'Mid-stay') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        else if (t.task_type === 'Daily') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "cell" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "top" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "room" },
        });
        (t.room_display || t.room);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "type-pill" },
            ...{ class: (__VLS_ctx.typeColor(t.task_type)) },
        });
        (t.task_type);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mid" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "assignee" },
        });
        (t.assigned_to_display || (t.assigned_to ? t.assigned_to : 'Unassigned'));
        if (t.items_total) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "dot" },
            });
        }
        if (t.items_total) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (t.items_done);
            (t.items_total);
        }
        if (t.scheduled_for) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "dot" },
            });
        }
        if (t.scheduled_for) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.formatDateShort(t.scheduled_for));
        }
        if (t.items_total) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "bar" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "bar-fill" },
                ...{ style: ({ width: __VLS_ctx.progress(t) + '%' }) },
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "status" },
            ...{ class: (__VLS_ctx.statusColor(t.status)) },
        });
        (t.status);
    }
}
/** @type {[typeof MIBottomNav, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(MIBottomNav, new MIBottomNav({}));
const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['head-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['head-title']} */ ;
/** @type {__VLS_StyleScopedClasses['pills']} */ ;
/** @type {__VLS_StyleScopedClasses['pill']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['count']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['rows']} */ ;
/** @type {__VLS_StyleScopedClasses['row']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-lift']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['top']} */ ;
/** @type {__VLS_StyleScopedClasses['room']} */ ;
/** @type {__VLS_StyleScopedClasses['type-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['mid']} */ ;
/** @type {__VLS_StyleScopedClasses['assignee']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonContent: IonContent,
            IonPage: IonPage,
            IonRefresher: IonRefresher,
            IonRefresherContent: IonRefresherContent,
            IonSpinner: IonSpinner,
            formatDateShort: formatDateShort,
            MITopBar: MITopBar,
            MIBottomNav: MIBottomNav,
            EmptyState: EmptyState,
            router: router,
            tasks: tasks,
            loading: loading,
            filter: filter,
            filters: filters,
            pullRefresh: pullRefresh,
            visible: visible,
            counts: counts,
            progress: progress,
            typeColor: typeColor,
            statusColor: statusColor,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
