/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onMounted, ref } from 'vue';
import { IonContent, IonPage, IonRefresher, IonRefresherContent, IonSearchbar, IonFab, IonFabButton, IonIcon, } from '@ionic/vue';
import { addOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { useCurrency } from '@/composables/useCurrency';
import { formatDateShort, initials } from '@/composables/useDates';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import EmptyState from '@/components/EmptyState.vue';
const router = useRouter();
const auth = useAuthStore();
const prop = usePropertyStore();
const { money } = useCurrency();
const filter = ref('all');
const search = ref('');
const filters = [
    { id: 'all', label: 'All' },
    { id: 'Enquiry', label: 'Enquiries' },
    { id: 'Confirmed', label: 'Upcoming' },
    { id: 'Checked In', label: 'In-house' },
    { id: 'Checked Out', label: 'Past' },
];
const visible = computed(() => {
    const q = search.value.trim().toLowerCase();
    let list = filter.value === 'all'
        ? prop.bookings
        : prop.bookings.filter((b) => b.status === filter.value);
    if (q) {
        list = list.filter((b) => {
            const hay = [b.guest_name, b.guest_phone, b.guest_email, b.name].join(' ').toLowerCase();
            return hay.includes(q);
        });
    }
    return [...list].sort((a, b) => (b.check_in_date || '').localeCompare(a.check_in_date || ''));
});
const empty = computed(() => prop.bookings.length === 0);
async function load() {
    if (!auth.current)
        return;
    await prop.loadProperty(auth.current.name);
}
async function pullRefresh(e) {
    await load();
    e.target.complete();
}
function openBooking(name) {
    router.push(`/bookings/${encodeURIComponent(name)}`);
}
onMounted(() => {
    if (prop.bookings.length === 0)
        load();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['pills']} */ ;
/** @type {__VLS_StyleScopedClasses['pill']} */ ;
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
const __VLS_24 = {}.IonSearchbar;
/** @type {[typeof __VLS_components.IonSearchbar, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.search),
    placeholder: "Search by guest, phone, BK-…",
    debounce: (200),
    ...{ class: "mi-search" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.search),
    placeholder: "Search by guest, phone, BK-…",
    debounce: (200),
    ...{ class: "mi-search" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
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
}
if (__VLS_ctx.empty) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        emoji: "📖",
        headline: "Your reservation book is open",
        body: "Add your first booking in the web app — it'll appear here.",
    }));
    const __VLS_29 = __VLS_28({
        emoji: "📖",
        headline: "Your reservation book is open",
        body: "Add your first booking in the web app — it'll appear here.",
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
}
else if (!__VLS_ctx.visible.length) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        subtle: true,
        emoji: "🔍",
        headline: (__VLS_ctx.search ? `No bookings match “${__VLS_ctx.search}”` : 'Nothing in this filter'),
        body: (__VLS_ctx.search ? 'Try clearing the search or pick another filter.' : ''),
    }));
    const __VLS_32 = __VLS_31({
        subtle: true,
        emoji: "🔍",
        headline: (__VLS_ctx.search ? `No bookings match “${__VLS_ctx.search}”` : 'Nothing in this filter'),
        body: (__VLS_ctx.search ? 'Try clearing the search or pick another filter.' : ''),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "rows" },
    });
    for (const [b] of __VLS_getVForSourceType((__VLS_ctx.visible))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.empty))
                        return;
                    if (!!(!__VLS_ctx.visible.length))
                        return;
                    __VLS_ctx.openBooking(b.name);
                } },
            key: (b.name),
            ...{ class: "row mi-lift" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "avatar" },
        });
        (__VLS_ctx.initials(b.guest_name));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "cell" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "top" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "guest" },
        });
        (b.guest_name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "amount" },
        });
        (__VLS_ctx.money(b.total_amount));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mid" },
        });
        (__VLS_ctx.formatDateShort(b.check_in_date));
        (__VLS_ctx.formatDateShort(b.check_out_date));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "dot" },
        });
        (b.nights);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "foot" },
        });
        /** @type {[typeof StatusBadge, ]} */ ;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent(StatusBadge, new StatusBadge({
            status: (b.status),
        }));
        const __VLS_35 = __VLS_34({
            status: (b.status),
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
        if ((b.total_amount || 0) > (b.advance_paid || 0)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "due" },
            });
            (__VLS_ctx.money((b.total_amount || 0) - (b.advance_paid || 0)));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "paid" },
            });
        }
    }
}
if (__VLS_ctx.auth.is_admin || __VLS_ctx.auth.current?.my_role === 'Booking Agent' || __VLS_ctx.auth.is_sys_admin) {
    const __VLS_37 = {}.IonFab;
    /** @type {[typeof __VLS_components.IonFab, typeof __VLS_components.IonFab, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        slot: "fixed",
        vertical: "bottom",
        horizontal: "end",
        ...{ style: {} },
    }));
    const __VLS_39 = __VLS_38({
        slot: "fixed",
        vertical: "bottom",
        horizontal: "end",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    __VLS_40.slots.default;
    const __VLS_41 = {}.IonFabButton;
    /** @type {[typeof __VLS_components.IonFabButton, typeof __VLS_components.IonFabButton, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        ...{ 'onClick': {} },
        color: "primary",
    }));
    const __VLS_43 = __VLS_42({
        ...{ 'onClick': {} },
        color: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    let __VLS_45;
    let __VLS_46;
    let __VLS_47;
    const __VLS_48 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.auth.is_admin || __VLS_ctx.auth.current?.my_role === 'Booking Agent' || __VLS_ctx.auth.is_sys_admin))
                return;
            __VLS_ctx.router.push('/bookings/new');
        }
    };
    __VLS_44.slots.default;
    const __VLS_49 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
        icon: (__VLS_ctx.addOutline),
    }));
    const __VLS_51 = __VLS_50({
        icon: (__VLS_ctx.addOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    var __VLS_44;
    var __VLS_40;
}
/** @type {[typeof MIBottomNav, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(MIBottomNav, new MIBottomNav({}));
const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['head-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['head-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-search']} */ ;
/** @type {__VLS_StyleScopedClasses['pills']} */ ;
/** @type {__VLS_StyleScopedClasses['pill']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['rows']} */ ;
/** @type {__VLS_StyleScopedClasses['row']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-lift']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['top']} */ ;
/** @type {__VLS_StyleScopedClasses['guest']} */ ;
/** @type {__VLS_StyleScopedClasses['amount']} */ ;
/** @type {__VLS_StyleScopedClasses['mid']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['foot']} */ ;
/** @type {__VLS_StyleScopedClasses['due']} */ ;
/** @type {__VLS_StyleScopedClasses['paid']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonContent: IonContent,
            IonPage: IonPage,
            IonRefresher: IonRefresher,
            IonRefresherContent: IonRefresherContent,
            IonSearchbar: IonSearchbar,
            IonFab: IonFab,
            IonFabButton: IonFabButton,
            IonIcon: IonIcon,
            addOutline: addOutline,
            formatDateShort: formatDateShort,
            initials: initials,
            MITopBar: MITopBar,
            MIBottomNav: MIBottomNav,
            StatusBadge: StatusBadge,
            EmptyState: EmptyState,
            router: router,
            auth: auth,
            money: money,
            filter: filter,
            search: search,
            filters: filters,
            visible: visible,
            empty: empty,
            pullRefresh: pullRefresh,
            openBooking: openBooking,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
