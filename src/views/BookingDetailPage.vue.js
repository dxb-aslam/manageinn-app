/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onMounted, ref } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonSpinner, alertController, } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { useCurrency } from '@/composables/useCurrency';
import { formatDateLong, initials } from '@/composables/useDates';
import { api } from '@/services/http';
import { ok, error as toastError } from '@/services/toast';
import StatusBadge from '@/components/StatusBadge.vue';
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const prop = usePropertyStore();
const { money } = useCurrency();
const bookingName = computed(() => decodeURIComponent(String(route.params.name || '')));
const busy = ref(false);
const booking = computed(() => prop.bookings.find((b) => b.name === bookingName.value) || null);
const balance = computed(() => {
    const b = booking.value;
    if (!b)
        return 0;
    return Math.max(0, (b.total_amount || 0) - (b.advance_paid || 0));
});
const isTerminal = computed(() => {
    const s = booking.value?.status;
    return s === 'Checked Out' || s === 'Cancelled' || s === 'No Show';
});
async function ensureLoaded() {
    if (booking.value || !auth.current)
        return;
    // Came in via deep-link with empty store — refetch
    await prop.loadProperty(auth.current.name);
}
async function transition(newStatus) {
    if (!booking.value || busy.value)
        return;
    busy.value = true;
    try {
        const updated = await api('manageinn.api.transition_booking', {
            name: booking.value.name,
            new_status: newStatus,
        });
        prop.applyBookingUpdate(updated);
        await ok(`Status → ${newStatus}`);
    }
    catch (e) {
        await toastError(e?.message || 'Could not change status');
    }
    finally {
        busy.value = false;
    }
}
async function recordBalance() {
    if (!booking.value || balance.value <= 0 || busy.value)
        return;
    busy.value = true;
    try {
        const updated = await api('manageinn.api.record_payment', {
            name: booking.value.name,
            amount: balance.value,
        });
        prop.applyBookingUpdate(updated);
        await ok(`${money(balance.value)} marked paid`);
    }
    catch (e) {
        await toastError(e?.message || 'Could not record payment');
    }
    finally {
        busy.value = false;
    }
}
async function confirmCancel() {
    if (!booking.value)
        return;
    const alert = await alertController.create({
        header: 'Cancel booking?',
        message: `${booking.value.guest_name} · ${booking.value.name}. This cannot be undone.`,
        buttons: [
            { text: 'Keep it', role: 'cancel' },
            { text: 'Cancel booking', role: 'destructive', handler: () => transition('Cancelled') },
        ],
    });
    await alert.present();
}
onMounted(ensureLoaded);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['kv']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
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
const __VLS_13 = {}.IonButtons;
/** @type {[typeof __VLS_components.IonButtons, typeof __VLS_components.IonButtons, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    slot: "start",
}));
const __VLS_15 = __VLS_14({
    slot: "start",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
const __VLS_17 = {}.IonBackButton;
/** @type {[typeof __VLS_components.IonBackButton, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    defaultHref: "/bookings",
}));
const __VLS_19 = __VLS_18({
    defaultHref: "/bookings",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
var __VLS_16;
const __VLS_21 = {}.IonTitle;
/** @type {[typeof __VLS_components.IonTitle, typeof __VLS_components.IonTitle, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
    ...{ class: "mi-font-display title" },
}));
const __VLS_23 = __VLS_22({
    ...{ class: "mi-font-display title" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
var __VLS_24;
var __VLS_12;
var __VLS_8;
const __VLS_25 = {}.IonContent;
/** @type {[typeof __VLS_components.IonContent, typeof __VLS_components.IonContent, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    fullscreen: (true),
}));
const __VLS_27 = __VLS_26({
    fullscreen: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
if (!__VLS_ctx.booking) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty" },
    });
    if (!__VLS_ctx.auth.current || __VLS_ctx.prop.loading) {
        const __VLS_29 = {}.IonSpinner;
        /** @type {[typeof __VLS_components.IonSpinner, ]} */ ;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
            name: "crescent",
        }));
        const __VLS_31 = __VLS_30({
            name: "crescent",
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "page" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "header card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "hdr-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "avatar" },
    });
    (__VLS_ctx.initials(__VLS_ctx.booking.guest_name));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "who" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "name" },
    });
    (__VLS_ctx.booking.guest_name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "phone" },
    });
    (__VLS_ctx.booking.guest_phone || '—');
    /** @type {[typeof StatusBadge, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(StatusBadge, new StatusBadge({
        status: (__VLS_ctx.booking.status),
    }));
    const __VLS_34 = __VLS_33({
        status: (__VLS_ctx.booking.status),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ref" },
    });
    (__VLS_ctx.booking.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "mi-font-display" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kv" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "k" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "v" },
    });
    (__VLS_ctx.formatDateLong(__VLS_ctx.booking.check_in_date));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "k" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "v" },
    });
    (__VLS_ctx.formatDateLong(__VLS_ctx.booking.check_out_date));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "k" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "v" },
    });
    (__VLS_ctx.booking.nights);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "k" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "v" },
    });
    (__VLS_ctx.booking.adults);
    (__VLS_ctx.booking.children);
    if (__VLS_ctx.booking.room) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "k" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "v" },
        });
        (__VLS_ctx.booking.room);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "k" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "v italic" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "mi-font-display" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kv" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "k" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "v" },
    });
    (__VLS_ctx.money(__VLS_ctx.booking.total_amount));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "k" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "v" },
    });
    (__VLS_ctx.money(__VLS_ctx.booking.advance_paid));
    if (__VLS_ctx.balance > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "balance-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "k" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "v terra-d" },
        });
        (__VLS_ctx.money(__VLS_ctx.balance));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "balance-row paid" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "k" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "v sage-d" },
        });
    }
    if (__VLS_ctx.booking.notes) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
            ...{ class: "card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-head" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "mi-font-display" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "notes" },
        });
        (__VLS_ctx.booking.notes);
    }
    if (!__VLS_ctx.isTerminal) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
            ...{ class: "actions" },
        });
        if (__VLS_ctx.booking.status === 'Enquiry') {
            const __VLS_36 = {}.IonButton;
            /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
            // @ts-ignore
            const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
                ...{ 'onClick': {} },
                expand: "block",
                ...{ class: "mi-btn-tactile" },
                disabled: (__VLS_ctx.busy),
            }));
            const __VLS_38 = __VLS_37({
                ...{ 'onClick': {} },
                expand: "block",
                ...{ class: "mi-btn-tactile" },
                disabled: (__VLS_ctx.busy),
            }, ...__VLS_functionalComponentArgsRest(__VLS_37));
            let __VLS_40;
            let __VLS_41;
            let __VLS_42;
            const __VLS_43 = {
                onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.booking))
                        return;
                    if (!(!__VLS_ctx.isTerminal))
                        return;
                    if (!(__VLS_ctx.booking.status === 'Enquiry'))
                        return;
                    __VLS_ctx.transition('Confirmed');
                }
            };
            __VLS_39.slots.default;
            var __VLS_39;
        }
        if (__VLS_ctx.booking.status === 'Confirmed') {
            const __VLS_44 = {}.IonButton;
            /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
            // @ts-ignore
            const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
                ...{ 'onClick': {} },
                expand: "block",
                ...{ class: "mi-btn-tactile" },
                disabled: (__VLS_ctx.busy),
            }));
            const __VLS_46 = __VLS_45({
                ...{ 'onClick': {} },
                expand: "block",
                ...{ class: "mi-btn-tactile" },
                disabled: (__VLS_ctx.busy),
            }, ...__VLS_functionalComponentArgsRest(__VLS_45));
            let __VLS_48;
            let __VLS_49;
            let __VLS_50;
            const __VLS_51 = {
                onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.booking))
                        return;
                    if (!(!__VLS_ctx.isTerminal))
                        return;
                    if (!(__VLS_ctx.booking.status === 'Confirmed'))
                        return;
                    __VLS_ctx.transition('Checked In');
                }
            };
            __VLS_47.slots.default;
            var __VLS_47;
        }
        if (__VLS_ctx.booking.status === 'Checked In') {
            const __VLS_52 = {}.IonButton;
            /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
            // @ts-ignore
            const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
                ...{ 'onClick': {} },
                expand: "block",
                color: "success",
                disabled: (__VLS_ctx.busy),
            }));
            const __VLS_54 = __VLS_53({
                ...{ 'onClick': {} },
                expand: "block",
                color: "success",
                disabled: (__VLS_ctx.busy),
            }, ...__VLS_functionalComponentArgsRest(__VLS_53));
            let __VLS_56;
            let __VLS_57;
            let __VLS_58;
            const __VLS_59 = {
                onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.booking))
                        return;
                    if (!(!__VLS_ctx.isTerminal))
                        return;
                    if (!(__VLS_ctx.booking.status === 'Checked In'))
                        return;
                    __VLS_ctx.transition('Checked Out');
                }
            };
            __VLS_55.slots.default;
            var __VLS_55;
        }
        if (__VLS_ctx.balance > 0) {
            const __VLS_60 = {}.IonButton;
            /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
            // @ts-ignore
            const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
                ...{ 'onClick': {} },
                expand: "block",
                fill: "outline",
                disabled: (__VLS_ctx.busy),
            }));
            const __VLS_62 = __VLS_61({
                ...{ 'onClick': {} },
                expand: "block",
                fill: "outline",
                disabled: (__VLS_ctx.busy),
            }, ...__VLS_functionalComponentArgsRest(__VLS_61));
            let __VLS_64;
            let __VLS_65;
            let __VLS_66;
            const __VLS_67 = {
                onClick: (__VLS_ctx.recordBalance)
            };
            __VLS_63.slots.default;
            (__VLS_ctx.money(__VLS_ctx.balance));
            var __VLS_63;
        }
        if (__VLS_ctx.booking.status !== 'Checked In') {
            const __VLS_68 = {}.IonButton;
            /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
            // @ts-ignore
            const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
                ...{ 'onClick': {} },
                expand: "block",
                fill: "outline",
                color: "danger",
                disabled: (__VLS_ctx.busy),
            }));
            const __VLS_70 = __VLS_69({
                ...{ 'onClick': {} },
                expand: "block",
                fill: "outline",
                color: "danger",
                disabled: (__VLS_ctx.busy),
            }, ...__VLS_functionalComponentArgsRest(__VLS_69));
            let __VLS_72;
            let __VLS_73;
            let __VLS_74;
            const __VLS_75 = {
                onClick: (__VLS_ctx.confirmCancel)
            };
            __VLS_71.slots.default;
            var __VLS_71;
        }
    }
}
var __VLS_28;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['hdr-row']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['who']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['phone']} */ ;
/** @type {__VLS_StyleScopedClasses['ref']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['kv']} */ ;
/** @type {__VLS_StyleScopedClasses['k']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
/** @type {__VLS_StyleScopedClasses['k']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
/** @type {__VLS_StyleScopedClasses['k']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
/** @type {__VLS_StyleScopedClasses['k']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
/** @type {__VLS_StyleScopedClasses['k']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
/** @type {__VLS_StyleScopedClasses['k']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['kv']} */ ;
/** @type {__VLS_StyleScopedClasses['k']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
/** @type {__VLS_StyleScopedClasses['k']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
/** @type {__VLS_StyleScopedClasses['balance-row']} */ ;
/** @type {__VLS_StyleScopedClasses['k']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
/** @type {__VLS_StyleScopedClasses['terra-d']} */ ;
/** @type {__VLS_StyleScopedClasses['balance-row']} */ ;
/** @type {__VLS_StyleScopedClasses['paid']} */ ;
/** @type {__VLS_StyleScopedClasses['k']} */ ;
/** @type {__VLS_StyleScopedClasses['v']} */ ;
/** @type {__VLS_StyleScopedClasses['sage-d']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['notes']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-btn-tactile']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-btn-tactile']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonContent: IonContent,
            IonPage: IonPage,
            IonHeader: IonHeader,
            IonToolbar: IonToolbar,
            IonTitle: IonTitle,
            IonButtons: IonButtons,
            IonBackButton: IonBackButton,
            IonButton: IonButton,
            IonSpinner: IonSpinner,
            formatDateLong: formatDateLong,
            initials: initials,
            StatusBadge: StatusBadge,
            auth: auth,
            prop: prop,
            money: money,
            busy: busy,
            booking: booking,
            balance: balance,
            isTerminal: isTerminal,
            transition: transition,
            recordBalance: recordBalance,
            confirmCancel: confirmCancel,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
