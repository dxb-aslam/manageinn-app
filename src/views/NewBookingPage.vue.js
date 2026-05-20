/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonInput, IonTextarea, IonSpinner, } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { useCurrency } from '@/composables/useCurrency';
import { todayISO, addDays, parseDate, isoDate } from '@/composables/useDates';
import { api } from '@/services/http';
import { ok, error as toastError } from '@/services/toast';
const router = useRouter();
const auth = useAuthStore();
const prop = usePropertyStore();
const { money, symbol } = useCurrency();
// ---- Form state ----
const today = todayISO();
const tomorrow = isoDate(addDays(parseDate(today), 1));
const form = reactive({
    room_type: '',
    check_in_date: today,
    check_out_date: tomorrow,
    adults: 2,
    children: 0,
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    total_amount: 0,
    advance_paid: 0,
    notes: '',
});
const submitting = ref(false);
const checkingAvail = ref(false);
// ---- Computed ----
const nights = computed(() => {
    if (!form.check_in_date || !form.check_out_date)
        return 0;
    return Math.max(0, Math.round((parseDate(form.check_out_date).getTime() - parseDate(form.check_in_date).getTime()) / 86400000));
});
const selectedType = computed(() => prop.roomTypes.find((t) => t.name === form.room_type) || null);
// Auto-fill total when type or nights change (unless user already touched it)
const userOverroteTotal = ref(false);
watch([selectedType, nights], ([t, n]) => {
    if (userOverroteTotal.value)
        return;
    if (t && n > 0) {
        form.total_amount = (t.price_per_night || 0) * n;
    }
    else {
        form.total_amount = 0;
    }
});
function onTotalManualEdit() {
    userOverroteTotal.value = true;
}
// ---- Availability (lightweight check on the selected type) ----
//
// We rely on the backend's create_booking validation as the source of
// truth, but a pre-submit check via list_availability gives a faster
// failure path for "this type has zero free units on these dates".
const availability = ref({}); // typeName → free units
async function refreshAvailability() {
    if (!auth.current)
        return;
    checkingAvail.value = true;
    try {
        const data = await api('manageinn.api.get_availability', {
            property: auth.current.name,
            check_in: form.check_in_date,
            check_out: form.check_out_date,
        });
        const map = {};
        for (const t of data.types || [])
            map[t.name] = t.free;
        availability.value = map;
    }
    catch {
        // Non-fatal — server will validate at create_booking time anyway
        availability.value = {};
    }
    finally {
        checkingAvail.value = false;
    }
}
watch(() => [form.check_in_date, form.check_out_date], refreshAvailability, { immediate: false });
// ---- Validation ----
const formError = computed(() => {
    if (!form.room_type)
        return 'Pick a room type';
    if (!form.guest_name.trim())
        return 'Guest name is required';
    if (nights.value <= 0)
        return 'Check-out must be after check-in';
    if (form.adults < 1)
        return 'At least one adult';
    if (form.total_amount < 0)
        return "Total can't be negative";
    if (form.advance_paid < 0)
        return "Advance can't be negative";
    if (form.advance_paid > form.total_amount)
        return 'Advance exceeds total';
    const free = availability.value[form.room_type];
    if (typeof free === 'number' && free <= 0)
        return 'No units of this type free on these dates';
    return '';
});
// ---- Submit ----
async function submit() {
    if (formError.value || submitting.value || !auth.current)
        return;
    submitting.value = true;
    try {
        const created = await api('manageinn.api.create_booking', {
            property: auth.current.name,
            payload: { ...form },
        });
        prop.applyBookingUpdate(created);
        await ok(`Booked ${form.guest_name}`);
        router.replace(`/bookings/${encodeURIComponent(created.name)}`);
    }
    catch (e) {
        await toastError(e?.message || 'Could not create booking');
    }
    finally {
        submitting.value = false;
    }
}
// Ensure room types are loaded (deep-link arrival)
onMounted(async () => {
    if (!auth.current)
        return;
    if (!prop.roomTypes.length)
        await prop.loadProperty(auth.current.name);
    if (prop.roomTypes.length && !form.room_type) {
        form.room_type = prop.roomTypes[0].name;
    }
    refreshAvailability();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['block-head']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
/** @type {__VLS_StyleScopedClasses['type-card']} */ ;
/** @type {__VLS_StyleScopedClasses['type-card']} */ ;
/** @type {__VLS_StyleScopedClasses['type-avail']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-input']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['counter']} */ ;
/** @type {__VLS_StyleScopedClasses['ctrls']} */ ;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "block-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "mi-font-display" },
});
if (__VLS_ctx.checkingAvail) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "muted" },
    });
}
if (!__VLS_ctx.prop.roomTypes.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "muted" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "type-list" },
    });
    for (const [t] of __VLS_getVForSourceType((__VLS_ctx.prop.roomTypes))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            key: (t.name),
            ...{ class: "type-card" },
            ...{ class: ({ active: __VLS_ctx.form.room_type === t.name }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            type: "radio",
            value: (t.name),
        });
        (__VLS_ctx.form.room_type);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "type-main" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "type-name" },
        });
        (t.room_type_name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "type-meta" },
        });
        (__VLS_ctx.money(t.price_per_night));
        (t.max_guests);
        (t.max_guests !== 1 ? 's' : '');
        if (__VLS_ctx.availability[t.name] !== undefined) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "type-avail" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: ({ none: __VLS_ctx.availability[t.name] <= 0 }) },
            });
            (__VLS_ctx.availability[t.name]);
        }
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "block-head mi-font-display" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "row-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "date",
});
(__VLS_ctx.form.check_in_date);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "date",
    min: (__VLS_ctx.form.check_in_date),
});
(__VLS_ctx.form.check_out_date);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "muted small" },
});
(__VLS_ctx.nights);
(__VLS_ctx.nights !== 1 ? 's' : '');
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "block-head mi-font-display" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "counters" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "counter" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ctrls" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.form.adults = Math.max(1, __VLS_ctx.form.adults - 1);
        } },
    type: "button",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "qty" },
});
(__VLS_ctx.form.adults);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.form.adults++;
        } },
    type: "button",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "counter" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ctrls" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.form.children = Math.max(0, __VLS_ctx.form.children - 1);
        } },
    type: "button",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "qty" },
});
(__VLS_ctx.form.children);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.form.children++;
        } },
    type: "button",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "block-head mi-font-display" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
const __VLS_29 = {}.IonInput;
/** @type {[typeof __VLS_components.IonInput, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    modelValue: (__VLS_ctx.form.guest_name),
    placeholder: "Anjali Menon",
    ...{ class: "mi-input" },
}));
const __VLS_31 = __VLS_30({
    modelValue: (__VLS_ctx.form.guest_name),
    placeholder: "Anjali Menon",
    ...{ class: "mi-input" },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
const __VLS_33 = {}.IonInput;
/** @type {[typeof __VLS_components.IonInput, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    modelValue: (__VLS_ctx.form.guest_phone),
    type: "tel",
    inputmode: "tel",
    ...{ class: "mi-input" },
}));
const __VLS_35 = __VLS_34({
    modelValue: (__VLS_ctx.form.guest_phone),
    type: "tel",
    inputmode: "tel",
    ...{ class: "mi-input" },
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
const __VLS_37 = {}.IonInput;
/** @type {[typeof __VLS_components.IonInput, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    modelValue: (__VLS_ctx.form.guest_email),
    type: "email",
    inputmode: "email",
    autocapitalize: "off",
    ...{ class: "mi-input" },
}));
const __VLS_39 = __VLS_38({
    modelValue: (__VLS_ctx.form.guest_email),
    type: "email",
    inputmode: "email",
    autocapitalize: "off",
    ...{ class: "mi-input" },
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "block-head mi-font-display" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "row-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
(__VLS_ctx.symbol);
const __VLS_41 = {}.IonInput;
/** @type {[typeof __VLS_components.IonInput, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    ...{ 'onIonInput': {} },
    modelValue: (__VLS_ctx.form.total_amount),
    modelModifiers: { number: true, },
    type: "number",
    inputmode: "decimal",
    ...{ class: "mi-input" },
}));
const __VLS_43 = __VLS_42({
    ...{ 'onIonInput': {} },
    modelValue: (__VLS_ctx.form.total_amount),
    modelModifiers: { number: true, },
    type: "number",
    inputmode: "decimal",
    ...{ class: "mi-input" },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_45;
let __VLS_46;
let __VLS_47;
const __VLS_48 = {
    onIonInput: (__VLS_ctx.onTotalManualEdit)
};
var __VLS_44;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "field" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
(__VLS_ctx.symbol);
const __VLS_49 = {}.IonInput;
/** @type {[typeof __VLS_components.IonInput, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
    modelValue: (__VLS_ctx.form.advance_paid),
    modelModifiers: { number: true, },
    type: "number",
    inputmode: "decimal",
    ...{ class: "mi-input" },
}));
const __VLS_51 = __VLS_50({
    modelValue: (__VLS_ctx.form.advance_paid),
    modelModifiers: { number: true, },
    type: "number",
    inputmode: "decimal",
    ...{ class: "mi-input" },
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "block-head mi-font-display" },
});
const __VLS_53 = {}.IonTextarea;
/** @type {[typeof __VLS_components.IonTextarea, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    modelValue: (__VLS_ctx.form.notes),
    rows: (3),
    placeholder: "Anything to remember…",
    ...{ class: "mi-input ta" },
}));
const __VLS_55 = __VLS_54({
    modelValue: (__VLS_ctx.form.notes),
    rows: (3),
    placeholder: "Anything to remember…",
    ...{ class: "mi-input ta" },
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
if (__VLS_ctx.formError) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "err" },
    });
    (__VLS_ctx.formError);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "submit" },
});
const __VLS_57 = {}.IonButton;
/** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    ...{ 'onClick': {} },
    expand: "block",
    ...{ class: "mi-btn-tactile" },
    disabled: (!!__VLS_ctx.formError || __VLS_ctx.submitting),
}));
const __VLS_59 = __VLS_58({
    ...{ 'onClick': {} },
    expand: "block",
    ...{ class: "mi-btn-tactile" },
    disabled: (!!__VLS_ctx.formError || __VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
let __VLS_61;
let __VLS_62;
let __VLS_63;
const __VLS_64 = {
    onClick: (__VLS_ctx.submit)
};
__VLS_60.slots.default;
if (__VLS_ctx.submitting) {
    const __VLS_65 = {}.IonSpinner;
    /** @type {[typeof __VLS_components.IonSpinner, ]} */ ;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
        name: "crescent",
    }));
    const __VLS_67 = __VLS_66({
        name: "crescent",
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.money(__VLS_ctx.form.total_amount));
}
var __VLS_60;
var __VLS_28;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['block-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
/** @type {__VLS_StyleScopedClasses['type-list']} */ ;
/** @type {__VLS_StyleScopedClasses['type-card']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['type-main']} */ ;
/** @type {__VLS_StyleScopedClasses['type-name']} */ ;
/** @type {__VLS_StyleScopedClasses['type-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['type-avail']} */ ;
/** @type {__VLS_StyleScopedClasses['none']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['block-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['row-2']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['block-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['counters']} */ ;
/** @type {__VLS_StyleScopedClasses['counter']} */ ;
/** @type {__VLS_StyleScopedClasses['ctrls']} */ ;
/** @type {__VLS_StyleScopedClasses['qty']} */ ;
/** @type {__VLS_StyleScopedClasses['counter']} */ ;
/** @type {__VLS_StyleScopedClasses['ctrls']} */ ;
/** @type {__VLS_StyleScopedClasses['qty']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['block-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-input']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-input']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-input']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['block-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['row-2']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-input']} */ ;
/** @type {__VLS_StyleScopedClasses['field']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-input']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['block-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-input']} */ ;
/** @type {__VLS_StyleScopedClasses['ta']} */ ;
/** @type {__VLS_StyleScopedClasses['err']} */ ;
/** @type {__VLS_StyleScopedClasses['submit']} */ ;
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
            IonInput: IonInput,
            IonTextarea: IonTextarea,
            IonSpinner: IonSpinner,
            prop: prop,
            money: money,
            symbol: symbol,
            form: form,
            submitting: submitting,
            checkingAvail: checkingAvail,
            nights: nights,
            onTotalManualEdit: onTotalManualEdit,
            availability: availability,
            formError: formError,
            submit: submit,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
