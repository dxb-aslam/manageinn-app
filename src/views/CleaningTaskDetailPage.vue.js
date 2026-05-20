/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onMounted, ref } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonSpinner, IonInput, IonTextarea, IonCheckbox, } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/services/http';
import { ok, error as toastError } from '@/services/toast';
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const task = ref(null);
const items = ref([]);
const notes = ref('');
const newItem = ref('');
const loading = ref(true);
const saving = ref(false);
const taskName = computed(() => decodeURIComponent(String(route.params.name || '')));
async function load() {
    loading.value = true;
    try {
        const t = await api('manageinn.api.get_cleaning_task', { name: taskName.value });
        task.value = t;
        items.value = (t.items || []).map((i) => ({
            item_name: i.item_name,
            is_done: !!i.is_done,
            note: i.note || '',
        }));
        notes.value = t.notes || '';
    }
    catch (e) {
        await toastError(e?.message || 'Could not load task');
    }
    finally {
        loading.value = false;
    }
}
const completePct = computed(() => {
    if (!items.value.length)
        return 0;
    const done = items.value.filter((i) => i.is_done).length;
    return Math.round((done / items.value.length) * 100);
});
function addItem() {
    const v = newItem.value.trim();
    if (!v)
        return;
    items.value.push({ item_name: v, is_done: false, note: '' });
    newItem.value = '';
}
function removeItem(idx) {
    items.value.splice(idx, 1);
}
async function save() {
    if (!task.value || saving.value)
        return;
    saving.value = true;
    try {
        const updated = await api('manageinn.api.update_cleaning_task', {
            name: task.value.name,
            items: items.value.map((i) => ({
                item_name: i.item_name,
                is_done: i.is_done ? 1 : 0,
                note: i.note || '',
            })),
            notes: notes.value,
        });
        task.value = updated;
        items.value = (updated.items || []).map((i) => ({
            item_name: i.item_name,
            is_done: !!i.is_done,
            note: i.note || '',
        }));
        await ok('Saved');
    }
    catch (e) {
        await toastError(e?.message || 'Could not save');
    }
    finally {
        saving.value = false;
    }
}
async function transition(status) {
    if (!task.value || saving.value)
        return;
    saving.value = true;
    try {
        const updated = await api('manageinn.api.update_cleaning_task', {
            name: task.value.name,
            status,
            items: items.value.map((i) => ({
                item_name: i.item_name,
                is_done: i.is_done ? 1 : 0,
                note: i.note || '',
            })),
            notes: notes.value,
        });
        task.value = updated;
        if (status === 'Done') {
            await ok('Marked done');
            router.back();
        }
        else {
            await ok(`Status → ${status}`);
        }
    }
    catch (e) {
        await toastError(e?.message || 'Could not update status');
    }
    finally {
        saving.value = false;
    }
}
async function takeIt() {
    if (!task.value || saving.value)
        return;
    saving.value = true;
    try {
        const updated = await api('manageinn.api.assign_cleaning_task', {
            name: task.value.name,
            user: auth.user,
        });
        task.value = updated;
        await ok("You've got this");
    }
    catch (e) {
        await toastError(e?.message || 'Could not take task');
    }
    finally {
        saving.value = false;
    }
}
onMounted(load);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['item-x']} */ ;
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
    defaultHref: "/cleaning",
}));
const __VLS_19 = __VLS_18({
    defaultHref: "/cleaning",
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
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading" },
    });
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
else if (!__VLS_ctx.task) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "page" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "header card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "head-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mi-font-hand small" },
    });
    (__VLS_ctx.task.task_type);
    (__VLS_ctx.task.status);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "mi-font-display room" },
    });
    (__VLS_ctx.task.room_display || __VLS_ctx.task.room);
    if (__VLS_ctx.task.booking) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "small muted" },
        });
        (__VLS_ctx.task.booking);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "hdr-meta" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "muted small" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "medium" },
    });
    (__VLS_ctx.task.assigned_to_display || (__VLS_ctx.task.assigned_to ? __VLS_ctx.task.assigned_to : 'Unassigned'));
    if (!__VLS_ctx.task.assigned_to) {
        const __VLS_33 = {}.IonButton;
        /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
            ...{ 'onClick': {} },
            fill: "outline",
            size: "small",
            disabled: (__VLS_ctx.saving),
        }));
        const __VLS_35 = __VLS_34({
            ...{ 'onClick': {} },
            fill: "outline",
            size: "small",
            disabled: (__VLS_ctx.saving),
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
        let __VLS_37;
        let __VLS_38;
        let __VLS_39;
        const __VLS_40 = {
            onClick: (__VLS_ctx.takeIt)
        };
        __VLS_36.slots.default;
        var __VLS_36;
    }
    if (__VLS_ctx.task.started_at || __VLS_ctx.task.completed_at) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "small muted" },
        });
        if (__VLS_ctx.task.started_at) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (new Date(__VLS_ctx.task.started_at).toLocaleString());
        }
        if (__VLS_ctx.task.completed_at) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (new Date(__VLS_ctx.task.completed_at).toLocaleString());
        }
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "muted small" },
    });
    (__VLS_ctx.completePct);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-fill" },
        ...{ style: ({ width: __VLS_ctx.completePct + '%' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "items" },
    });
    for (const [item, idx] of __VLS_getVForSourceType((__VLS_ctx.items))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: (idx),
            ...{ class: "item" },
        });
        const __VLS_41 = {}.IonCheckbox;
        /** @type {[typeof __VLS_components.IonCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
            modelValue: (item.is_done),
        }));
        const __VLS_43 = __VLS_42({
            modelValue: (item.is_done),
        }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item-body" },
        });
        const __VLS_45 = {}.IonInput;
        /** @type {[typeof __VLS_components.IonInput, ]} */ ;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
            modelValue: (item.item_name),
            placeholder: "Item",
            ...{ class: "item-name" },
            ...{ class: ({ done: item.is_done }) },
        }));
        const __VLS_47 = __VLS_46({
            modelValue: (item.item_name),
            placeholder: "Item",
            ...{ class: "item-name" },
            ...{ class: ({ done: item.is_done }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        const __VLS_49 = {}.IonInput;
        /** @type {[typeof __VLS_components.IonInput, ]} */ ;
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
            modelValue: (item.note),
            placeholder: "Add a note…",
            ...{ class: "item-note" },
        }));
        const __VLS_51 = __VLS_50({
            modelValue: (item.note),
            placeholder: "Add a note…",
            ...{ class: "item-note" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_50));
        if (!item.is_done) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(!__VLS_ctx.task))
                            return;
                        if (!(!item.is_done))
                            return;
                        __VLS_ctx.removeItem(idx);
                    } },
                ...{ class: "item-x" },
            });
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "add-row" },
    });
    const __VLS_53 = {}.IonInput;
    /** @type {[typeof __VLS_components.IonInput, ]} */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        ...{ 'onKeydown': {} },
        modelValue: (__VLS_ctx.newItem),
        placeholder: "Add a checklist item…",
        ...{ class: "add-input" },
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onKeydown': {} },
        modelValue: (__VLS_ctx.newItem),
        placeholder: "Add a checklist item…",
        ...{ class: "add-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_57;
    let __VLS_58;
    let __VLS_59;
    const __VLS_60 = {
        onKeydown: (__VLS_ctx.addItem)
    };
    var __VLS_56;
    const __VLS_61 = {}.IonButton;
    /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_63 = __VLS_62({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    let __VLS_65;
    let __VLS_66;
    let __VLS_67;
    const __VLS_68 = {
        onClick: (__VLS_ctx.addItem)
    };
    __VLS_64.slots.default;
    var __VLS_64;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "mi-font-display" },
    });
    const __VLS_69 = {}.IonTextarea;
    /** @type {[typeof __VLS_components.IonTextarea, ]} */ ;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
        modelValue: (__VLS_ctx.notes),
        rows: (3),
        placeholder: "Anything to flag (broken AC, missing key, etc.)",
        ...{ class: "notes-ta" },
    }));
    const __VLS_71 = __VLS_70({
        modelValue: (__VLS_ctx.notes),
        rows: (3),
        placeholder: "Anything to flag (broken AC, missing key, etc.)",
        ...{ class: "notes-ta" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "actions" },
    });
    if (__VLS_ctx.task.status === 'Pending') {
        const __VLS_73 = {}.IonButton;
        /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
        // @ts-ignore
        const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
            ...{ 'onClick': {} },
            expand: "block",
            fill: "outline",
            color: "warning",
            disabled: (__VLS_ctx.saving),
        }));
        const __VLS_75 = __VLS_74({
            ...{ 'onClick': {} },
            expand: "block",
            fill: "outline",
            color: "warning",
            disabled: (__VLS_ctx.saving),
        }, ...__VLS_functionalComponentArgsRest(__VLS_74));
        let __VLS_77;
        let __VLS_78;
        let __VLS_79;
        const __VLS_80 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(!__VLS_ctx.task))
                    return;
                if (!(__VLS_ctx.task.status === 'Pending'))
                    return;
                __VLS_ctx.transition('In Progress');
            }
        };
        __VLS_76.slots.default;
        var __VLS_76;
    }
    if (__VLS_ctx.task.status !== 'Done') {
        const __VLS_81 = {}.IonButton;
        /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
        // @ts-ignore
        const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
            ...{ 'onClick': {} },
            expand: "block",
            ...{ class: "mi-btn-tactile" },
            color: "success",
            disabled: (__VLS_ctx.saving),
        }));
        const __VLS_83 = __VLS_82({
            ...{ 'onClick': {} },
            expand: "block",
            ...{ class: "mi-btn-tactile" },
            color: "success",
            disabled: (__VLS_ctx.saving),
        }, ...__VLS_functionalComponentArgsRest(__VLS_82));
        let __VLS_85;
        let __VLS_86;
        let __VLS_87;
        const __VLS_88 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(!__VLS_ctx.task))
                    return;
                if (!(__VLS_ctx.task.status !== 'Done'))
                    return;
                __VLS_ctx.transition('Done');
            }
        };
        __VLS_84.slots.default;
        if (__VLS_ctx.saving) {
            const __VLS_89 = {}.IonSpinner;
            /** @type {[typeof __VLS_components.IonSpinner, ]} */ ;
            // @ts-ignore
            const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
                name: "crescent",
            }));
            const __VLS_91 = __VLS_90({
                name: "crescent",
            }, ...__VLS_functionalComponentArgsRest(__VLS_90));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        var __VLS_84;
    }
    const __VLS_93 = {}.IonButton;
    /** @type {[typeof __VLS_components.IonButton, typeof __VLS_components.IonButton, ]} */ ;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        ...{ 'onClick': {} },
        expand: "block",
        fill: "clear",
        disabled: (__VLS_ctx.saving),
    }));
    const __VLS_95 = __VLS_94({
        ...{ 'onClick': {} },
        expand: "block",
        fill: "clear",
        disabled: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    let __VLS_97;
    let __VLS_98;
    let __VLS_99;
    const __VLS_100 = {
        onClick: (__VLS_ctx.save)
    };
    __VLS_96.slots.default;
    var __VLS_96;
}
var __VLS_28;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['head-row']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['room']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
/** @type {__VLS_StyleScopedClasses['hdr-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['medium']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
/** @type {__VLS_StyleScopedClasses['small']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['items']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-body']} */ ;
/** @type {__VLS_StyleScopedClasses['item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['item-note']} */ ;
/** @type {__VLS_StyleScopedClasses['item-x']} */ ;
/** @type {__VLS_StyleScopedClasses['add-row']} */ ;
/** @type {__VLS_StyleScopedClasses['add-input']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-display']} */ ;
/** @type {__VLS_StyleScopedClasses['notes-ta']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
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
            IonInput: IonInput,
            IonTextarea: IonTextarea,
            IonCheckbox: IonCheckbox,
            task: task,
            items: items,
            notes: notes,
            newItem: newItem,
            loading: loading,
            saving: saving,
            completePct: completePct,
            addItem: addItem,
            removeItem: removeItem,
            save: save,
            transition: transition,
            takeIt: takeIt,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
