/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onMounted, ref, watch } from 'vue';
import { IonContent, IonPage, IonRefresher, IonRefresherContent, IonSpinner, IonButton, } from '@ionic/vue';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/services/http';
import { ok, error as toastError } from '@/services/toast';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import EmptyState from '@/components/EmptyState.vue';
const auth = useAuthStore();
const requests = ref([]);
const loading = ref(false);
const filter = ref('New');
const expanded = ref({});
const filters = [
    { id: 'all', label: 'All' },
    { id: 'New', label: 'New' },
    { id: 'Acknowledged', label: 'In progress' },
    { id: 'Delivered', label: 'Delivered' },
    { id: 'Closed', label: 'Closed' },
];
async function load() {
    if (!auth.current)
        return;
    loading.value = true;
    try {
        requests.value = await api('manageinn.api.list_guest_requests', {
            property: auth.current.name,
        });
    }
    catch (e) {
        await toastError(e?.message || 'Could not load requests');
    }
    finally {
        loading.value = false;
    }
}
async function pullRefresh(e) {
    await load();
    e.target.complete();
}
async function transition(req, status) {
    try {
        const updated = await api('manageinn.api.update_guest_request', {
            name: req.name,
            status,
        });
        const idx = requests.value.findIndex((r) => r.name === req.name);
        if (idx >= 0)
            requests.value[idx] = { ...requests.value[idx], ...updated };
        await ok(`${status} · ${req.room_display || req.room}`);
    }
    catch (e) {
        await toastError(e?.message || 'Could not update');
    }
}
onMounted(load);
watch(() => auth.current?.name, load);
const visible = computed(() => filter.value === 'all'
    ? requests.value
    : requests.value.filter((r) => r.status === filter.value));
const counts = computed(() => {
    const c = { all: requests.value.length };
    for (const r of requests.value)
        c[r.status] = (c[r.status] || 0) + 1;
    return c;
});
function toggle(name) {
    expanded.value[name] = !expanded.value[name];
}
function typeIcon(t) {
    return { Cleaning: '🧹', Amenity: '🧺', Other: '💬' }[t] || '📨';
}
function statusColor(s) {
    return {
        'New': 'mi-stat-terra',
        'Acknowledged': 'mi-stat-honey',
        'Delivered': 'mi-stat-sage',
        'Closed': 'mi-stat-ink',
    }[s] || 'mi-stat-ink';
}
function fmtTime(iso) {
    if (!iso)
        return '—';
    return new Date(iso).toLocaleString('en-IN', {
        hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short',
    });
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['pills']} */ ;
/** @type {__VLS_StyleScopedClasses['pill']} */ ;
/** @type {__VLS_StyleScopedClasses['pill']} */ ;
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
if (__VLS_ctx.loading && !__VLS_ctx.requests.length) {
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
        emoji: "📭",
        headline: (__VLS_ctx.filter === 'all' ? 'No guest pings yet' : 'Nothing in this filter'),
        body: (__VLS_ctx.filter === 'all' ? 'When a guest scans their room QR and taps Request cleaning or Need anything?, it lands here.' : ''),
    }));
    const __VLS_29 = __VLS_28({
        emoji: "📭",
        headline: (__VLS_ctx.filter === 'all' ? 'No guest pings yet' : 'Nothing in this filter'),
        body: (__VLS_ctx.filter === 'all' ? 'When a guest scans their room QR and taps Request cleaning or Need anything?, it lands here.' : ''),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "rows" },
    });
    for (const [r] of __VLS_getVForSourceType((__VLS_ctx.visible))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: (r.name),
            ...{ class: "row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading && !__VLS_ctx.requests.length))
                        return;
                    if (!!(!__VLS_ctx.visible.length))
                        return;
                    __VLS_ctx.toggle(r.name);
                } },
            ...{ class: "head-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "icon-pill" },
        });
        (__VLS_ctx.typeIcon(r.request_type));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "cell" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "top" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "room" },
        });
        (r.room_display || r.room);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "type" },
        });
        (r.request_type);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mid" },
        });
        (__VLS_ctx.fmtTime(r.requested_at));
        if (r.items && r.items.length) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "items-summary" },
            });
            (r.items.map((i) => `${i.qty}× ${i.item_name}`).join(', '));
        }
        if (r.details && (!r.items || !r.items.length)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "items-summary" },
            });
            (r.details);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "status" },
            ...{ class: (__VLS_ctx.statusColor(r.status)) },
        });
        (r.status);
        if (__VLS_ctx.expanded[r.name]) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "expanded" },
            });
            if (r.items && r.items.length) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "chips" },
                });
                for (const [it, idx] of __VLS_getVForSourceType((r.items))) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        key: (idx),
                        ...{ class: "chip" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "chip-icon" },
                    });
                    (it.icon || '•');
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
                    (it.qty);
                    (it.item_name);
                }
            }
            if (r.details) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
                    ...{ class: "italic note" },
                });
                (r.details);
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "action-row" },
            });
            if (r.status === 'New') {
                const __VLS_31 = {}.IonButton;
                /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
                // @ts-ignore
                const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
                    ...{ 'onClick': {} },
                    size: "small",
                    fill: "outline",
                    color: "warning",
                }));
                const __VLS_33 = __VLS_32({
                    ...{ 'onClick': {} },
                    size: "small",
                    fill: "outline",
                    color: "warning",
                }, ...__VLS_functionalComponentArgsRest(__VLS_32));
                let __VLS_35;
                let __VLS_36;
                let __VLS_37;
                const __VLS_38 = {
                    onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading && !__VLS_ctx.requests.length))
                            return;
                        if (!!(!__VLS_ctx.visible.length))
                            return;
                        if (!(__VLS_ctx.expanded[r.name]))
                            return;
                        if (!(r.status === 'New'))
                            return;
                        __VLS_ctx.transition(r, 'Acknowledged');
                    }
                };
                __VLS_34.slots.default;
                var __VLS_34;
            }
            if (r.status !== 'Delivered' && r.status !== 'Closed') {
                const __VLS_39 = {}.IonButton;
                /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
                // @ts-ignore
                const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
                    ...{ 'onClick': {} },
                    size: "small",
                    fill: "outline",
                    color: "success",
                }));
                const __VLS_41 = __VLS_40({
                    ...{ 'onClick': {} },
                    size: "small",
                    fill: "outline",
                    color: "success",
                }, ...__VLS_functionalComponentArgsRest(__VLS_40));
                let __VLS_43;
                let __VLS_44;
                let __VLS_45;
                const __VLS_46 = {
                    onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading && !__VLS_ctx.requests.length))
                            return;
                        if (!!(!__VLS_ctx.visible.length))
                            return;
                        if (!(__VLS_ctx.expanded[r.name]))
                            return;
                        if (!(r.status !== 'Delivered' && r.status !== 'Closed'))
                            return;
                        __VLS_ctx.transition(r, 'Delivered');
                    }
                };
                __VLS_42.slots.default;
                var __VLS_42;
            }
            if (r.status !== 'Closed') {
                const __VLS_47 = {}.IonButton;
                /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
                // @ts-ignore
                const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
                    ...{ 'onClick': {} },
                    size: "small",
                    fill: "clear",
                }));
                const __VLS_49 = __VLS_48({
                    ...{ 'onClick': {} },
                    size: "small",
                    fill: "clear",
                }, ...__VLS_functionalComponentArgsRest(__VLS_48));
                let __VLS_51;
                let __VLS_52;
                let __VLS_53;
                const __VLS_54 = {
                    onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading && !__VLS_ctx.requests.length))
                            return;
                        if (!!(!__VLS_ctx.visible.length))
                            return;
                        if (!(__VLS_ctx.expanded[r.name]))
                            return;
                        if (!(r.status !== 'Closed'))
                            return;
                        __VLS_ctx.transition(r, 'Closed');
                    }
                };
                __VLS_50.slots.default;
                var __VLS_50;
            }
            if (r.responded_by_display) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "hand-by" },
                });
                (r.responded_by_display);
                (__VLS_ctx.fmtTime(r.responded_at));
            }
        }
    }
}
/** @type {[typeof MIBottomNav, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(MIBottomNav, new MIBottomNav({}));
const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
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
/** @type {__VLS_StyleScopedClasses['head-row']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['top']} */ ;
/** @type {__VLS_StyleScopedClasses['room']} */ ;
/** @type {__VLS_StyleScopedClasses['type']} */ ;
/** @type {__VLS_StyleScopedClasses['mid']} */ ;
/** @type {__VLS_StyleScopedClasses['items-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['items-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['expanded']} */ ;
/** @type {__VLS_StyleScopedClasses['chips']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['note']} */ ;
/** @type {__VLS_StyleScopedClasses['action-row']} */ ;
/** @type {__VLS_StyleScopedClasses['hand-by']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonContent: IonContent,
            IonPage: IonPage,
            IonRefresher: IonRefresher,
            IonRefresherContent: IonRefresherContent,
            IonSpinner: IonSpinner,
            IonButton: IonButton,
            MITopBar: MITopBar,
            MIBottomNav: MIBottomNav,
            EmptyState: EmptyState,
            requests: requests,
            loading: loading,
            filter: filter,
            expanded: expanded,
            filters: filters,
            pullRefresh: pullRefresh,
            transition: transition,
            visible: visible,
            counts: counts,
            toggle: toggle,
            typeIcon: typeIcon,
            statusColor: statusColor,
            fmtTime: fmtTime,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
