/**
 * property store — bookings/rooms/types for the currently active property.
 *
 * Mirrors the web app's App.vue provide/inject pattern but uses Pinia
 * (the Ionic convention). Calls `manageinn.api.get_property_data` which
 * returns everything in one round-trip.
 *
 * Usage:
 *   const prop = usePropertyStore();
 *   await prop.loadProperty(auth.current!.name);
 *   prop.bookings   // → reactive list
 */
import { defineStore } from 'pinia';
import { api } from '@/services/http';
export const usePropertyStore = defineStore('property', {
    state: () => ({
        loading: false,
        loadError: '',
        bookings: [],
        rooms: [],
        roomTypes: [],
        guests: [],
        stats: {},
    }),
    actions: {
        /** Single round-trip fetch of everything we need for the property views. */
        async loadProperty(propertyName) {
            this.loading = true;
            this.loadError = '';
            try {
                const data = await api('manageinn.api.get_property_data', { property: propertyName });
                this.bookings = data.bookings || [];
                this.rooms = data.rooms || [];
                this.roomTypes = data.room_types || [];
                this.stats = data.stats || {};
            }
            catch (e) {
                this.loadError = e?.message || 'Could not load property data';
                throw e;
            }
            finally {
                this.loading = false;
            }
        },
        /** Replace a single booking in the local list (after edit / status change). */
        applyBookingUpdate(updated) {
            const idx = this.bookings.findIndex((b) => b.name === updated.name);
            if (idx >= 0)
                this.bookings[idx] = { ...this.bookings[idx], ...updated };
            else
                this.bookings.unshift(updated);
        },
        /** Remove a booking from the local list (after delete). */
        removeBooking(name) {
            this.bookings = this.bookings.filter((b) => b.name !== name);
        },
        reset() {
            this.bookings = [];
            this.rooms = [];
            this.roomTypes = [];
            this.guests = [];
            this.stats = {};
            this.loadError = '';
        },
    },
});
