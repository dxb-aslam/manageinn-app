/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { IonIcon, actionSheetController } from '@ionic/vue';
import { chevronDownOutline, checkmarkCircle, businessOutline } from 'ionicons/icons';
import { useAuthStore } from '@/stores/auth';
import { usePropertyStore } from '@/stores/property';
import { ok } from '@/services/toast';
const auth = useAuthStore();
const prop = usePropertyStore();
const hasMultiple = computed(() => (auth.properties?.length || 0) > 1);
async function openSwitcher() {
    if (!hasMultiple.value)
        return;
    const buttons = auth.properties.map((p) => ({
        text: p.property_name,
        icon: p.name === auth.current?.name ? checkmarkCircle : businessOutline,
        cssClass: p.name === auth.current?.name ? 'mi-current-prop' : '',
        handler: () => switchTo(p.name),
    }));
    buttons.push({ text: 'Cancel', role: 'cancel' });
    const sheet = await actionSheetController.create({
        header: 'Switch property',
        subHeader: `${auth.properties.length} accessible`,
        buttons,
    });
    await sheet.present();
}
async function switchTo(name) {
    if (auth.current?.name === name)
        return;
    auth.setCurrentProperty(name);
    // Reset the per-property data so the new property's bookings/rooms load
    // fresh on next access. Cheaper than refetching here — the next view
    // entry triggers loadProperty() via its onMounted/watch.
    prop.reset();
    await ok(`Switched to ${auth.current?.property_name}`);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['prop-chip']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.auth.current) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.openSwitcher) },
        ...{ class: "prop-chip" },
        ...{ class: ({ tappable: __VLS_ctx.hasMultiple }) },
        'aria-label': (__VLS_ctx.hasMultiple ? 'Switch property' : 'Active property'),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "prop-name mi-font-hand" },
    });
    (__VLS_ctx.auth.current.property_name);
    if (__VLS_ctx.hasMultiple) {
        const __VLS_0 = {}.IonIcon;
        /** @type {[typeof __VLS_components.IonIcon, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            icon: (__VLS_ctx.chevronDownOutline),
            ...{ class: "chev" },
        }));
        const __VLS_2 = __VLS_1({
            icon: (__VLS_ctx.chevronDownOutline),
            ...{ class: "chev" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    }
}
/** @type {__VLS_StyleScopedClasses['prop-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['tappable']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-name']} */ ;
/** @type {__VLS_StyleScopedClasses['mi-font-hand']} */ ;
/** @type {__VLS_StyleScopedClasses['chev']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            IonIcon: IonIcon,
            chevronDownOutline: chevronDownOutline,
            auth: auth,
            hasMultiple: hasMultiple,
            openSwitcher: openSwitcher,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
