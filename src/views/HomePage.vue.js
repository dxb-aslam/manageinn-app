/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onMounted, ref } from 'vue';
import { IonContent, IonPage, IonRefresher, IonRefresherContent, IonSpinner, } from '@ionic/vue';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { useCurrency } from '@/composables/useCurrency';
import { todayISO, formatDateShort } from '@/composables/useDates';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import EmptyState from '@/components/EmptyState.vue';
const auth = useAuthStore();
const prop = usePropertyStore();
const { money } = useCurrency();
const today = todayISO();
const initialLoad = ref(true);
async function load() {
    if (!auth.current)
        return;
    try {
        await prop.loadProperty(auth.current.name);
    }
    finally {
        initialLoad.value = false;
    }
}
async function pullRefresh(e) {
    await load();
    e.target.complete();
}
onMounted(load);
// Slices of the booking list — same logic the web Dashboard uses
const arrivalsToday = computed(() => prop.bookings.filter((b) => b.check_in_date === today && b.status !== 'Cancelled'));
const departuresToday = computed(() => prop.bookings.filter((b) => b.check_out_date === today && b.status === 'Checked In'));
const inHouse = computed(() => prop.bookings.filter((b) => b.status === 'Checked In'));
const pendingDues = computed(() => prop.bookings
    .filter((b) => ['Enquiry', 'Confirmed', 'Checked In'].includes(b.status))
    .reduce((sum, b) => sum + Math.max(0, (b.total_amount || 0) - (b.advance_paid || 0)), 0));
const greeting = computed(() => {
    const h = new Date().getHours();
    if (h < 12)
        return 'Good morning';
    if (h < 17)
        return 'Good afternoon';
    return 'Good evening';
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['kpi-value']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-value']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-value']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-value']} */ ;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['row']} */ ;
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
    ...{ class: "home-shell" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "greet" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mi-font-hand greet-sub" },
});
(__VLS_ctx.greeting);
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "mi-font-display greet-title" },
});
(__VLS_ctx.auth.current?.property_name || 'your property');
if (__VLS_ctx.initialLoad && __VLS_ctx.prop.loading) {
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
else if (!__VLS_ctx.auth.current) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        emoji: "🏡",
        headline: "No property linked",
        body: "Ask your admin to add you to a property, or open the web app to create one.",
    }));
    const __VLS_29 = __VLS_28({
        emoji: "🏡",
        headline: "No property linked",
        body: "Ask your admin to add you to a property, or open the web app to create one.",
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "kpi-grid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-value terra" },
    });
    (__VLS_ctx.arrivalsToday.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-sub" },
    });
    (__VLS_ctx.arrivalsToday.length === 0 ? 'Nobody arriving' : 'awaiting check-in');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-value sage" },
    });
    (__VLS_ctx.departuresToday.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-sub" },
    });
    (__VLS_ctx.departuresToday.length === 0 ? 'None today' : 'by check-out time');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-value terra-d" },
    });
    (__VLS_ctx.inHouse.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-sub" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-value honey" },
    });
    (__VLS_ctx.money(__VLS_ctx.pendingDues));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-sub" },
    });
    if (__VLS_ctx.arrivalsToday.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
            ...{ class: "card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-head" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "mi-font-display" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "count" },
        });
        (__VLS_ctx.arrivalsToday.length);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
            ...{ class: "rows" },
        });
        for (const [b] of __VLS_getVForSourceType((__VLS_ctx.arrivalsToday))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                key: (b.name),
                ...{ class: "row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "cell" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "primary" },
            });
            (b.guest_name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "meta" },
            });
            (b.adults);
            (b.children);
            (b.nights);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "amt" },
            });
            (__VLS_ctx.money(b.total_amount));
        }
    }
    if (__VLS_ctx.inHouse.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
            ...{ class: "card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-head" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "mi-font-display" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "count" },
        });
        (__VLS_ctx.inHouse.length);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
            ...{ class: "rows" },
        });
        for (const [b] of __VLS_getVForSourceType((__VLS_ctx.inHouse))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                key: (b.name),
                ...{ class: "row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "cell" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "primary" },
            });
            (b.guest_name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "meta" },
            });
            (__VLS_ctx.formatDateShort(b.check_out_date));
        }
    }
    if (!__VLS_ctx.arrivalsToday.length && !__VLS_ctx.departuresToday.length && !__VLS_ctx.inHouse.length && !__VLS_ctx.prop.bookings.length) {
        /** @type {[typeof EmptyState, ]} */ ;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
            emoji: "📖",
            headline: "Your reservation book is open",
            body: "Add your first booking in the web app — it'll show up here.",
            subtle: true,
        }));
        const __VLS_32 = __VLS_31({
            emoji: "📖",
            headline: "Your reservation book is open",
            body: "Add your first booking in the web app — it'll show up here.",
            subtle: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    }
}
/** @type {[typeof MIBottomNav, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(MIBottomNav, new MIBottomNav({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['home-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['greet']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['greet-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['greet-title']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-label']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-value']} */ ;
/** @type {__VLS_StyleScopedClasses['terra']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-label']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-value']} */ ;
/** @type {__VLS_StyleScopedClasses['sage']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-label']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-value']} */ ;
/** @type {__VLS_StyleScopedClasses['terra-d']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-label']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-value']} */ ;
/** @type {__VLS_StyleScopedClasses['honey']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['count']} */ ;
/** @type {__VLS_StyleScopedClasses['rows']} */ ;
/** @type {__VLS_StyleScopedClasses['row']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['amt']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['count']} */ ;
/** @type {__VLS_StyleScopedClasses['rows']} */ ;
/** @type {__VLS_StyleScopedClasses['row']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
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
            auth: auth,
            prop: prop,
            money: money,
            initialLoad: initialLoad,
            pullRefresh: pullRefresh,
            arrivalsToday: arrivalsToday,
            departuresToday: departuresToday,
            inHouse: inHouse,
            pendingDues: pendingDues,
            greeting: greeting,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
