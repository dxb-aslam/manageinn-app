/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onMounted, ref, watch } from 'vue';
import { IonContent, IonPage, IonRefresher, IonRefresherContent, IonSpinner, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonSelect, IonSelectOption, } from '@ionic/vue';
import { Share } from '@capacitor/share';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { useCurrency } from '@/composables/useCurrency';
import { api } from '@/services/http';
import { ok, error as toastError } from '@/services/toast';
import { qrCodeOutline, shareOutline, refreshOutline, closeOutline } from 'ionicons/icons';
import MITopBar from '@/components/MITopBar.vue';
import MIBottomNav from '@/components/MIBottomNav.vue';
import EmptyState from '@/components/EmptyState.vue';
const auth = useAuthStore();
const prop = usePropertyStore();
const { money } = useCurrency();
const loading = ref(false);
async function load() {
    if (!auth.current)
        return;
    loading.value = true;
    try {
        await prop.loadProperty(auth.current.name);
    }
    finally {
        loading.value = false;
    }
}
async function pullRefresh(e) {
    await load();
    e.target.complete();
}
onMounted(() => {
    if (!prop.rooms.length)
        load();
});
watch(() => auth.current?.name, load);
// Group rooms under their type, preserving the type order from the store
const grouped = computed(() => {
    const out = [];
    for (const t of prop.roomTypes) {
        const rooms = prop.rooms.filter((r) => r.room_type === t.name);
        if (rooms.length || true)
            out.push({ type: t, rooms });
    }
    return out;
});
function statusColor(s) {
    return {
        'Available': 'mi-stat-sage',
        'Occupied': 'mi-stat-terra',
        'Needs Clean': 'mi-stat-honey',
        'Maintenance': 'mi-stat-ink',
    }[s] || 'mi-stat-ink';
}
// ── Room status — quick toggle for Booking Agent / Cleaning Staff / Admin ──
const STATUSES = ['Available', 'Occupied', 'Needs Clean', 'Maintenance'];
const canEditStatus = computed(() => auth.is_admin || auth.is_sys_admin ||
    auth.current?.my_role === 'Booking Agent' ||
    auth.current?.my_role === 'Cleaning Staff');
async function setStatus(room, newStatus) {
    if (room.status === newStatus)
        return;
    try {
        await api('manageinn.api.set_room_status', { name: room.name, status: newStatus });
        room.status = newStatus;
        await ok(`${room.room_name} → ${newStatus}`);
    }
    catch (e) {
        await toastError(e?.message || 'Could not update status');
    }
}
const qrOpen = ref(false);
const qrRoom = ref(null);
const qrData = ref(null);
const qrPng = ref(''); // QR rendered as data URL
const qrLoading = ref(false);
async function openQR(room) {
    qrRoom.value = room;
    qrData.value = null;
    qrPng.value = '';
    qrOpen.value = true;
    qrLoading.value = true;
    try {
        qrData.value = await api('manageinn.api.get_room_qr_data', { room: room.name });
        await renderQR();
    }
    catch (e) {
        await toastError(e?.message || 'Could not load QR');
    }
    finally {
        qrLoading.value = false;
    }
}
async function renderQR() {
    if (!qrData.value?.url)
        return;
    // Use the QR Server API for rendering — it's a 200×200 PNG. We could
    // bundle a JS QR lib, but using the API keeps the bundle small and the
    // QR comes back as a regular image which is easier to share.
    // Fallback to JS rendering if offline.
    const params = new URLSearchParams({
        data: qrData.value.url,
        size: '600x600',
        color: '2a221a',
        bgcolor: 'fdfaf3',
        margin: '0',
    });
    qrPng.value = `https://api.qrserver.com/v1/create-qr-code/?${params}`;
}
async function regenerate() {
    if (!qrRoom.value)
        return;
    qrLoading.value = true;
    try {
        qrData.value = await api('manageinn.api.regenerate_room_token', { room: qrRoom.value.name });
        await renderQR();
        await ok('QR refreshed — old token disabled');
    }
    catch (e) {
        await toastError(e?.message || 'Could not regenerate');
    }
    finally {
        qrLoading.value = false;
    }
}
async function shareQR() {
    if (!qrData.value)
        return;
    try {
        await Share.share({
            title: `${qrData.value.property_name} · ${qrData.value.room_name}`,
            text: `Scan to check in to your room at ${qrData.value.property_name}.`,
            url: qrData.value.url,
            dialogTitle: 'Share room QR',
        });
    }
    catch {
        // User cancelled, or Share plugin not available on web — silent
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['unit']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-tile']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-name']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-name']} */ ;
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
(__VLS_ctx.prop.roomTypes.length);
(__VLS_ctx.prop.roomTypes.length !== 1 ? 's' : '');
(__VLS_ctx.prop.rooms.length);
(__VLS_ctx.prop.rooms.length !== 1 ? 's' : '');
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "mi-font-display head-title" },
});
if (__VLS_ctx.loading && !__VLS_ctx.prop.rooms.length) {
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
else if (!__VLS_ctx.prop.roomTypes.length) {
    /** @type {[typeof EmptyState, ]} */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(EmptyState, new EmptyState({
        emoji: "🛏️",
        headline: "No rooms yet",
        body: "Add room types and units in the web app — they'll show up here for status updates and QR codes.",
    }));
    const __VLS_29 = __VLS_28({
        emoji: "🛏️",
        headline: "No rooms yet",
        body: "Add room types and units in the web app — they'll show up here for status updates and QR codes.",
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "groups" },
    });
    for (const [g] of __VLS_getVForSourceType((__VLS_ctx.grouped))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
            key: (g.type.name),
            ...{ class: "group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
            ...{ class: "group-head" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "group-name mi-font-display" },
        });
        (g.type.room_type_name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "group-meta" },
        });
        (__VLS_ctx.money(g.type.price_per_night));
        (g.type.max_guests);
        (g.rooms.length);
        (g.rooms.length !== 1 ? 's' : '');
        if (g.rooms.length) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
                ...{ class: "units" },
            });
            for (const [r] of __VLS_getVForSourceType((g.rooms))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                    key: (r.name),
                    ...{ class: "unit" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "dot" },
                    ...{ class: (__VLS_ctx.statusColor(r.status)) },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "unit-name" },
                });
                (r.room_name);
                if (__VLS_ctx.canEditStatus) {
                    const __VLS_31 = {}.IonSelect;
                    /** @type {[typeof __VLS_components.IonSelect, typeof __VLS_components.IonSelect, ]} */ ;
                    // @ts-ignore
                    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
                        ...{ 'onIonChange': {} },
                        modelValue: (r.status),
                        interface: "action-sheet",
                        ...{ class: "status-select" },
                    }));
                    const __VLS_33 = __VLS_32({
                        ...{ 'onIonChange': {} },
                        modelValue: (r.status),
                        interface: "action-sheet",
                        ...{ class: "status-select" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
                    let __VLS_35;
                    let __VLS_36;
                    let __VLS_37;
                    const __VLS_38 = {
                        onIonChange: ((e) => __VLS_ctx.setStatus(r, e.detail.value))
                    };
                    __VLS_34.slots.default;
                    for (const [s] of __VLS_getVForSourceType((__VLS_ctx.STATUSES))) {
                        const __VLS_39 = {}.IonSelectOption;
                        /** @type {[typeof __VLS_components.IonSelectOption, typeof __VLS_components.IonSelectOption, ]} */ ;
                        // @ts-ignore
                        const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
                            key: (s),
                            value: (s),
                        }));
                        const __VLS_41 = __VLS_40({
                            key: (s),
                            value: (s),
                        }, ...__VLS_functionalComponentArgsRest(__VLS_40));
                        __VLS_42.slots.default;
                        (s);
                        var __VLS_42;
                    }
                    var __VLS_34;
                }
                else {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "status-text" },
                    });
                    (r.status);
                }
                const __VLS_43 = {}.IonButton;
                /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
                // @ts-ignore
                const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
                    ...{ 'onClick': {} },
                    fill: "clear",
                    size: "small",
                    'aria-label': (`QR for ${r.room_name}`),
                }));
                const __VLS_45 = __VLS_44({
                    ...{ 'onClick': {} },
                    fill: "clear",
                    size: "small",
                    'aria-label': (`QR for ${r.room_name}`),
                }, ...__VLS_functionalComponentArgsRest(__VLS_44));
                let __VLS_47;
                let __VLS_48;
                let __VLS_49;
                const __VLS_50 = {
                    onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading && !__VLS_ctx.prop.rooms.length))
                            return;
                        if (!!(!__VLS_ctx.prop.roomTypes.length))
                            return;
                        if (!(g.rooms.length))
                            return;
                        __VLS_ctx.openQR(r);
                    }
                };
                __VLS_46.slots.default;
                const __VLS_51 = {}.IonIcon;
                /** @type {[typeof __VLS_components.IonIcon, ]} */ ;
                // @ts-ignore
                const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
                    slot: "icon-only",
                    icon: (__VLS_ctx.qrCodeOutline),
                }));
                const __VLS_53 = __VLS_52({
                    slot: "icon-only",
                    icon: (__VLS_ctx.qrCodeOutline),
                }, ...__VLS_functionalComponentArgsRest(__VLS_52));
                var __VLS_46;
            }
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "group-empty" },
            });
        }
    }
}
const __VLS_55 = {}.IonModal;
/** @type {[typeof __VLS_components.IonModal, typeof __VLS_components.IonModal, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    ...{ 'onDidDismiss': {} },
    isOpen: (__VLS_ctx.qrOpen),
}));
const __VLS_57 = __VLS_56({
    ...{ 'onDidDismiss': {} },
    isOpen: (__VLS_ctx.qrOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
let __VLS_59;
let __VLS_60;
let __VLS_61;
const __VLS_62 = {
    onDidDismiss: (...[$event]) => {
        __VLS_ctx.qrOpen = false;
    }
};
__VLS_58.slots.default;
const __VLS_63 = {}.IonHeader;
/** @type {[typeof __VLS_components.IonHeader, typeof __VLS_components.IonHeader, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({}));
const __VLS_65 = __VLS_64({}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
const __VLS_67 = {}.IonToolbar;
/** @type {[typeof __VLS_components.IonToolbar, typeof __VLS_components.IonToolbar, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({}));
const __VLS_69 = __VLS_68({}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
const __VLS_71 = {}.IonTitle;
/** @type {[typeof __VLS_components.IonTitle, typeof __VLS_components.IonTitle, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    ...{ class: "mi-font-display title" },
}));
const __VLS_73 = __VLS_72({
    ...{ class: "mi-font-display title" },
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_74.slots.default;
var __VLS_74;
const __VLS_75 = {}.IonButtons;
/** @type {[typeof __VLS_components.IonButtons, typeof __VLS_components.IonButtons, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    slot: "end",
}));
const __VLS_77 = __VLS_76({
    slot: "end",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
__VLS_78.slots.default;
const __VLS_79 = {}.IonButton;
/** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    ...{ 'onClick': {} },
}));
const __VLS_81 = __VLS_80({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
let __VLS_83;
let __VLS_84;
let __VLS_85;
const __VLS_86 = {
    onClick: (...[$event]) => {
        __VLS_ctx.qrOpen = false;
    }
};
__VLS_82.slots.default;
const __VLS_87 = {}.IonIcon;
/** @type {[typeof __VLS_components.IonIcon, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    slot: "icon-only",
    icon: (__VLS_ctx.closeOutline),
}));
const __VLS_89 = __VLS_88({
    slot: "icon-only",
    icon: (__VLS_ctx.closeOutline),
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
var __VLS_82;
var __VLS_78;
var __VLS_70;
var __VLS_66;
const __VLS_91 = {}.IonContent;
/** @type {[typeof __VLS_components.IonContent, typeof __VLS_components.IonContent, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    ...{ class: "ion-padding" },
}));
const __VLS_93 = __VLS_92({
    ...{ class: "ion-padding" },
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_94.slots.default;
if (__VLS_ctx.qrLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-loading" },
    });
    const __VLS_95 = {}.IonSpinner;
    /** @type {[typeof __VLS_components.IonSpinner, ]} */ ;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
        name: "crescent",
    }));
    const __VLS_97 = __VLS_96({
        name: "crescent",
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
}
else if (__VLS_ctx.qrData) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-shell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-tile" },
    });
    if (!__VLS_ctx.qrData.logo) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (__VLS_ctx.qrData.logo),
            alt: "",
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-name" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mi-font-hand wordmark" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "mi-underline-wavy" },
    });
    (__VLS_ctx.qrData.property_name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mi-font-hand sub" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-img-wrap" },
    });
    if (__VLS_ctx.qrPng) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (__VLS_ctx.qrPng),
            alt: "Room QR",
            ...{ class: "qr-img" },
        });
    }
    else {
        const __VLS_99 = {}.IonSpinner;
        /** @type {[typeof __VLS_components.IonSpinner, ]} */ ;
        // @ts-ignore
        const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
            name: "crescent",
        }));
        const __VLS_101 = __VLS_100({
            name: "crescent",
        }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-room" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-room-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-room-name mi-font-display" },
    });
    (__VLS_ctx.qrData.room_name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-footer mi-font-hand" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-url" },
    });
    (__VLS_ctx.qrData.url);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-actions" },
    });
    if (__VLS_ctx.auth.is_admin || __VLS_ctx.auth.is_sys_admin) {
        const __VLS_103 = {}.IonButton;
        /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
        // @ts-ignore
        const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
            ...{ 'onClick': {} },
            fill: "outline",
            disabled: (__VLS_ctx.qrLoading),
        }));
        const __VLS_105 = __VLS_104({
            ...{ 'onClick': {} },
            fill: "outline",
            disabled: (__VLS_ctx.qrLoading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_104));
        let __VLS_107;
        let __VLS_108;
        let __VLS_109;
        const __VLS_110 = {
            onClick: (__VLS_ctx.regenerate)
        };
        __VLS_106.slots.default;
        const __VLS_111 = {}.IonIcon;
        /** @type {[typeof __VLS_components.IonIcon, ]} */ ;
        // @ts-ignore
        const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
            slot: "start",
            icon: (__VLS_ctx.refreshOutline),
        }));
        const __VLS_113 = __VLS_112({
            slot: "start",
            icon: (__VLS_ctx.refreshOutline),
        }, ...__VLS_functionalComponentArgsRest(__VLS_112));
        var __VLS_106;
    }
    const __VLS_115 = {}.IonButton;
    /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
        ...{ 'onClick': {} },
        ...{ class: "mi-btn-tactile" },
    }));
    const __VLS_117 = __VLS_116({
        ...{ 'onClick': {} },
        ...{ class: "mi-btn-tactile" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    let __VLS_119;
    let __VLS_120;
    let __VLS_121;
    const __VLS_122 = {
        onClick: (__VLS_ctx.shareQR)
    };
    __VLS_118.slots.default;
    const __VLS_123 = {}.IonIcon;
    /** @type {[typeof __VLS_components.IonIcon, ]} */ ;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
        slot: "start",
        icon: (__VLS_ctx.shareOutline),
    }));
    const __VLS_125 = __VLS_124({
        slot: "start",
        icon: (__VLS_ctx.shareOutline),
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    var __VLS_118;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "qr-hint mi-font-hand" },
    });
}
var __VLS_94;
var __VLS_58;
/** @type {[typeof MIBottomNav, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(MIBottomNav, new MIBottomNav({}));
const __VLS_128 = __VLS_127({}, ...__VLS_functionalComponentArgsRest(__VLS_127));
var __VLS_8;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['head-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['head-title']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['groups']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['group-head']} */ ;
/** @type {__VLS_StyleScopedClasses['group-name']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['group-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['units']} */ ;
/** @type {__VLS_StyleScopedClasses['unit']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['unit-name']} */ ;
/** @type {__VLS_StyleScopedClasses['status-select']} */ ;
/** @type {__VLS_StyleScopedClasses['status-text']} */ ;
/** @type {__VLS_StyleScopedClasses['group-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['ion-padding']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-card']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-head']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-tile']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-name']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['wordmark']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-underline-wavy']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-img-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-img']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-room']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-room-label']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-room-name']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-url']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-btn-tactile']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
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
            IonModal: IonModal,
            IonHeader: IonHeader,
            IonToolbar: IonToolbar,
            IonTitle: IonTitle,
            IonButtons: IonButtons,
            IonIcon: IonIcon,
            IonSelect: IonSelect,
            IonSelectOption: IonSelectOption,
            qrCodeOutline: qrCodeOutline,
            shareOutline: shareOutline,
            refreshOutline: refreshOutline,
            closeOutline: closeOutline,
            MITopBar: MITopBar,
            MIBottomNav: MIBottomNav,
            EmptyState: EmptyState,
            auth: auth,
            prop: prop,
            money: money,
            loading: loading,
            pullRefresh: pullRefresh,
            grouped: grouped,
            statusColor: statusColor,
            STATUSES: STATUSES,
            canEditStatus: canEditStatus,
            setStatus: setStatus,
            qrOpen: qrOpen,
            qrData: qrData,
            qrPng: qrPng,
            qrLoading: qrLoading,
            openQR: openQR,
            regenerate: regenerate,
            shareQR: shareQR,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
