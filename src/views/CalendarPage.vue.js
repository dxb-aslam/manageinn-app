/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onMounted, ref, watch } from 'vue';
import { IonContent, IonPage, IonRefresher, IonRefresherContent, IonButton, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { addDays, isoDate, todayObj, todayISO, formatDateShort } from '@/composables/useDates';
import { chevronBackOutline, chevronForwardOutline, closeOutline, addOutline } from 'ionicons/icons';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import EmptyState from '@/components/EmptyState.vue';
const router = useRouter();
const auth = useAuthStore();
const prop = usePropertyStore();
const weekOffset = ref(0);
const TODAY = todayObj();
const TODAY_ISO = todayISO();
const days = computed(() => {
    const start = addDays(TODAY, weekOffset.value * 7);
    return Array.from({ length: 14 }, (_, i) => {
        const d = addDays(start, i);
        const iso = isoDate(d);
        return {
            iso,
            day: d.getDate(),
            dow: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.getDay()],
            isToday: iso === TODAY_ISO,
            isPast: iso < TODAY_ISO,
        };
    });
});
const rangeLabel = computed(() => {
    const f = days.value[0].iso;
    const l = days.value[13].iso;
    return `${formatDateShort(f)} – ${formatDateShort(l)}`;
});
const displayRows = computed(() => {
    const out = [];
    for (const t of prop.roomTypes) {
        out.push({
            key: `__any__${t.name}`,
            isVirtual: true,
            room_type: t.name,
            room_type_name: t.room_type_name,
            room_name: `Any ${t.room_type_name}`,
            status: null,
        });
        for (const r of prop.rooms.filter((x) => x.room_type === t.name)) {
            out.push({
                key: r.name,
                isVirtual: false,
                room_type: r.room_type,
                room_type_name: t.room_type_name,
                room_name: r.room_name,
                status: r.status,
                unit: r,
            });
        }
    }
    return out;
});
function bookingsForCell(row, dayIso) {
    return prop.bookings.filter((b) => {
        if (b.status === 'Cancelled')
            return false;
        if (!(dayIso >= b.check_in_date && dayIso < b.check_out_date))
            return false;
        if (row.isVirtual) {
            return !b.room && b.room_type === row.room_type;
        }
        return b.room === row.key;
    });
}
function cellClass(row, day) {
    const bs = bookingsForCell(row, day.iso);
    const lead = bs[0];
    let bg = '';
    if (lead) {
        if (lead.status === 'Checked In')
            bg = 'mi-cb-in';
        else if (lead.status === 'Confirmed')
            bg = 'mi-cb-conf';
        else if (lead.status === 'Enquiry')
            bg = 'mi-cb-enq';
        else if (lead.status === 'Checked Out')
            bg = 'mi-cb-out';
    }
    else if (day.isPast) {
        bg = 'mi-cb-past';
    }
    return [
        'cell',
        bg,
        day.isToday ? 'today' : '',
        bs.length > 1 ? 'stack' : '',
    ].filter(Boolean).join(' ');
}
function cellCount(row, dayIso) {
    return bookingsForCell(row, dayIso).length;
}
// Tap behaviour:
//   0 bookings → new booking with prefill
//   1 booking  → open detail
//   2+         → multi-picker sheet
const picker = ref(null);
function onCellTap(row, day) {
    const bs = bookingsForCell(row, day.iso);
    if (bs.length === 0) {
        if (day.isPast)
            return;
        const prefill = row.isVirtual
            ? `?room_type=${encodeURIComponent(row.room_type)}&check_in=${day.iso}`
            : `?room_type=${encodeURIComponent(row.room_type)}&room=${encodeURIComponent(row.key)}&check_in=${day.iso}`;
        router.push(`/bookings/new${prefill}`);
        return;
    }
    if (bs.length === 1) {
        router.push(`/bookings/${encodeURIComponent(bs[0].name)}`);
        return;
    }
    picker.value = { row, day, bookings: bs };
}
function closePicker() {
    picker.value = null;
}
function pickerOpen(name) {
    closePicker();
    router.push(`/bookings/${encodeURIComponent(name)}`);
}
function pickerNew() {
    if (!picker.value)
        return;
    const { row, day } = picker.value;
    closePicker();
    const prefill = row.isVirtual
        ? `?room_type=${encodeURIComponent(row.room_type)}&check_in=${day.iso}`
        : `?room_type=${encodeURIComponent(row.room_type)}&room=${encodeURIComponent(row.key)}&check_in=${day.iso}`;
    router.push(`/bookings/new${prefill}`);
}
async function load() {
    if (!auth.current)
        return;
    if (!prop.bookings.length || !prop.rooms.length) {
        await prop.loadProperty(auth.current.name);
    }
}
async function pullRefresh(e) {
    if (!auth.current)
        return;
    await prop.loadProperty(auth.current.name);
    e.target.complete();
}
onMounted(load);
watch(() => auth.current?.name, load);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['row']} */ ;
/** @type {__VLS_StyleScopedClasses['r-name']} */ ;
/** @type {__VLS_StyleScopedClasses['dow']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-meta']} */ ;
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
    ...{ class: "weeknav" },
});
const __VLS_24 = {}.IonButton;
/** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    fill: "outline",
    size: "small",
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    fill: "outline",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (...[$event]) => {
        __VLS_ctx.weekOffset--;
    }
};
__VLS_27.slots.default;
const __VLS_32 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    slot: "icon-only",
    icon: (__VLS_ctx.chevronBackOutline),
}));
const __VLS_34 = __VLS_33({
    slot: "icon-only",
    icon: (__VLS_ctx.chevronBackOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
var __VLS_27;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.weekOffset = 0;
        } },
    ...{ class: "today-btn" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "range" },
});
(__VLS_ctx.rangeLabel);
const __VLS_36 = {}.IonButton;
/** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    fill: "outline",
    size: "small",
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    fill: "outline",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (...[$event]) => {
        __VLS_ctx.weekOffset++;
    }
};
__VLS_39.slots.default;
const __VLS_44 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    slot: "icon-only",
    icon: (__VLS_ctx.chevronForwardOutline),
}));
const __VLS_46 = __VLS_45({
    slot: "icon-only",
    icon: (__VLS_ctx.chevronForwardOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_39;
if (!__VLS_ctx.prop.roomTypes.length) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        emoji: "🗓️",
        headline: "The calendar needs rooms",
        body: "Add a room type and a few units in the web app, then come back.",
    }));
    const __VLS_49 = __VLS_48({
        emoji: "🗓️",
        headline: "The calendar needs rooms",
        body: "Add a room type and a few units in the web app, then come back.",
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rooms" },
    });
    for (const [row] of __VLS_getVForSourceType((__VLS_ctx.displayRows))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
            key: (row.key),
            ...{ class: "row" },
            ...{ class: ({ virtual: row.isVirtual }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
            ...{ class: "row-head" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "row-title" },
        });
        if (row.isVirtual) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "r-name virtual-name" },
            });
            (row.room_type_name);
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "r-name" },
            });
            (row.room_name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "r-type" },
            });
            (row.room_type_name);
        }
        if (row.isVirtual) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "r-meta" },
            });
        }
        else if (row.status) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "r-meta" },
            });
            (row.status);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "weeks" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "dow" },
        });
        for (const [i] of __VLS_getVForSourceType((7))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                key: (`dow-${i}`),
            });
            (__VLS_ctx.days[i - 1]?.dow);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "dgrid" },
        });
        for (const [day] of __VLS_getVForSourceType((__VLS_ctx.days.slice(0, 7)))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(!__VLS_ctx.prop.roomTypes.length))
                            return;
                        __VLS_ctx.onCellTap(row, day);
                    } },
                key: (`${row.key}-${day.iso}`),
                ...{ class: (__VLS_ctx.cellClass(row, day)) },
            });
            (day.day);
            if (__VLS_ctx.cellCount(row, day.iso) > 1) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "badge" },
                });
                (__VLS_ctx.cellCount(row, day.iso));
            }
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "dgrid" },
        });
        for (const [day] of __VLS_getVForSourceType((__VLS_ctx.days.slice(7, 14)))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(!__VLS_ctx.prop.roomTypes.length))
                            return;
                        __VLS_ctx.onCellTap(row, day);
                    } },
                key: (`${row.key}-${day.iso}`),
                ...{ class: (__VLS_ctx.cellClass(row, day)) },
            });
            (day.day);
            if (__VLS_ctx.cellCount(row, day.iso) > 1) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "badge" },
                });
                (__VLS_ctx.cellCount(row, day.iso));
            }
        }
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "hint mi-font-hand" },
});
const __VLS_51 = {}.IonModal;
/** @type {[typeof __VLS_components.IonModal, typeof __VLS_components.IonModal, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    ...{ 'onDidDismiss': {} },
    isOpen: (!!__VLS_ctx.picker),
}));
const __VLS_53 = __VLS_52({
    ...{ 'onDidDismiss': {} },
    isOpen: (!!__VLS_ctx.picker),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_55;
let __VLS_56;
let __VLS_57;
const __VLS_58 = {
    onDidDismiss: (__VLS_ctx.closePicker)
};
__VLS_54.slots.default;
const __VLS_59 = {}.IonHeader;
/** @type {[typeof __VLS_components.IonHeader, typeof __VLS_components.IonHeader, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({}));
const __VLS_61 = __VLS_60({}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
const __VLS_63 = {}.IonToolbar;
/** @type {[typeof __VLS_components.IonToolbar, typeof __VLS_components.IonToolbar, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({}));
const __VLS_65 = __VLS_64({}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
const __VLS_67 = {}.IonTitle;
/** @type {[typeof __VLS_components.IonTitle, typeof __VLS_components.IonTitle, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    ...{ class: "mi-font-display title" },
}));
const __VLS_69 = __VLS_68({
    ...{ class: "mi-font-display title" },
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
if (__VLS_ctx.picker) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.formatDateShort(__VLS_ctx.picker.day.iso));
    (__VLS_ctx.picker.row.room_name);
}
var __VLS_70;
const __VLS_71 = {}.IonButtons;
/** @type {[typeof __VLS_components.IonButtons, typeof __VLS_components.IonButtons, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    slot: "end",
}));
const __VLS_73 = __VLS_72({
    slot: "end",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_74.slots.default;
const __VLS_75 = {}.IonButton;
/** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    ...{ 'onClick': {} },
}));
const __VLS_77 = __VLS_76({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
let __VLS_79;
let __VLS_80;
let __VLS_81;
const __VLS_82 = {
    onClick: (__VLS_ctx.closePicker)
};
__VLS_78.slots.default;
const __VLS_83 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    slot: "icon-only",
    icon: (__VLS_ctx.closeOutline),
}));
const __VLS_85 = __VLS_84({
    slot: "icon-only",
    icon: (__VLS_ctx.closeOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
var __VLS_78;
var __VLS_74;
var __VLS_66;
var __VLS_62;
if (__VLS_ctx.picker) {
    const __VLS_87 = {}.IonContent;
    /** @type {[typeof __VLS_components.IonContent, typeof __VLS_components.IonContent, ]} */ ;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
        ...{ class: "ion-padding" },
    }));
    const __VLS_89 = __VLS_88({
        ...{ class: "ion-padding" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    __VLS_90.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "picker-sub mi-font-hand" },
    });
    (__VLS_ctx.picker.bookings.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "picker-list" },
    });
    for (const [b] of __VLS_getVForSourceType((__VLS_ctx.picker.bookings))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: (b.name),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.picker))
                        return;
                    __VLS_ctx.pickerOpen(b.name);
                } },
            ...{ class: "picker-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "picker-cell" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "picker-name" },
        });
        (b.guest_name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "picker-meta" },
        });
        (__VLS_ctx.formatDateShort(b.check_in_date));
        (__VLS_ctx.formatDateShort(b.check_out_date));
        (b.status);
        if (!b.room) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "italic" },
            });
        }
    }
    if (!__VLS_ctx.picker.day.isPast) {
        const __VLS_91 = {}.IonButton;
        /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
        // @ts-ignore
        const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
            ...{ 'onClick': {} },
            expand: "block",
            ...{ class: "mi-btn-tactile" },
        }));
        const __VLS_93 = __VLS_92({
            ...{ 'onClick': {} },
            expand: "block",
            ...{ class: "mi-btn-tactile" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_92));
        let __VLS_95;
        let __VLS_96;
        let __VLS_97;
        const __VLS_98 = {
            onClick: (__VLS_ctx.pickerNew)
        };
        __VLS_94.slots.default;
        const __VLS_99 = {}.IonIcon;
        /** @type {[typeof __VLS_components.IonIcon, ]} */ ;
        // @ts-ignore
        const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
            slot: "start",
            icon: (__VLS_ctx.addOutline),
        }));
        const __VLS_101 = __VLS_100({
            slot: "start",
            icon: (__VLS_ctx.addOutline),
        }, ...__VLS_functionalComponentArgsRest(__VLS_100));
        var __VLS_94;
    }
    var __VLS_90;
}
var __VLS_54;
/** @type {[typeof MIBottomNav, ]} */ ;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent(MIBottomNav, new MIBottomNav({}));
const __VLS_104 = __VLS_103({}, ...__VLS_functionalComponentArgsRest(__VLS_103));
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['head-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['head-title']} */ ;
/** @type {__VLS_StyleScopedClasses['weeknav']} */ ;
/** @type {__VLS_StyleScopedClasses['today-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['range']} */ ;
/** @type {__VLS_StyleScopedClasses['rooms']} */ ;
/** @type {__VLS_StyleScopedClasses['row']} */ ;
/** @type {__VLS_StyleScopedClasses['virtual']} */ ;
/** @type {__VLS_StyleScopedClasses['row-head']} */ ;
/** @type {__VLS_StyleScopedClasses['row-title']} */ ;
/** @type {__VLS_StyleScopedClasses['r-name']} */ ;
/** @type {__VLS_StyleScopedClasses['virtual-name']} */ ;
/** @type {__VLS_StyleScopedClasses['r-name']} */ ;
/** @type {__VLS_StyleScopedClasses['r-type']} */ ;
/** @type {__VLS_StyleScopedClasses['r-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['r-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['weeks']} */ ;
/** @type {__VLS_StyleScopedClasses['dow']} */ ;
/** @type {__VLS_StyleScopedClasses['dgrid']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['dgrid']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['ion-padding']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-list']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-row']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-name']} */ ;
/** @type {__VLS_StyleScopedClasses['picker-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-btn-tactile']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonContent: IonContent,
            IonPage: IonPage,
            IonRefresher: IonRefresher,
            IonRefresherContent: IonRefresherContent,
            IonButton: IonButton,
            IonIcon: IonIcon,
            IonModal: IonModal,
            IonHeader: IonHeader,
            IonToolbar: IonToolbar,
            IonTitle: IonTitle,
            IonButtons: IonButtons,
            formatDateShort: formatDateShort,
            chevronBackOutline: chevronBackOutline,
            chevronForwardOutline: chevronForwardOutline,
            closeOutline: closeOutline,
            addOutline: addOutline,
            MITopBar: MITopBar,
            MIBottomNav: MIBottomNav,
            EmptyState: EmptyState,
            prop: prop,
            weekOffset: weekOffset,
            days: days,
            rangeLabel: rangeLabel,
            displayRows: displayRows,
            cellClass: cellClass,
            cellCount: cellCount,
            picker: picker,
            onCellTap: onCellTap,
            closePicker: closePicker,
            pickerOpen: pickerOpen,
            pickerNew: pickerNew,
            pullRefresh: pullRefresh,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
