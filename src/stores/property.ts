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

export interface Booking {
  name: string;
  status: string;
  property: string;
  room_type: string;
  room?: string;
  check_in_date: string;
  check_out_date: string;
  check_in_time?: string;
  check_out_time?: string;
  nights: number;
  guest_name: string;
  guest_phone?: string;
  guest_email?: string;
  adults: number;
  children: number;
  total_guests: number;
  total_amount: number;
  advance_paid: number;
  balance: number;
  payment_status: string;
  notes?: string;
  [key: string]: any;
}

export interface Room {
  name: string;
  property: string;
  room_type: string;
  room_name: string;
  status: string;
  check_in_time?: string;
  check_out_time?: string;
  photo?: string;
}

export interface RoomType {
  name: string;
  property: string;
  room_type_name: string;
  price_per_night: number;
  max_guests: number;
  beds?: string;
  description?: string;
  photo?: string;
}

interface PropertyState {
  loading: boolean;
  loadError: string;
  bookings: Booking[];
  rooms: Room[];
  roomTypes: RoomType[];
  guests: any[];
  stats: Record<string, any>;
}

export const usePropertyStore = defineStore('property', {
  state: (): PropertyState => ({
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
    async loadProperty(propertyName: string): Promise<void> {
      this.loading = true;
      this.loadError = '';
      try {
        const data = await api<{
          bookings: Booking[];
          rooms: Room[];
          room_types: RoomType[];
          stats: Record<string, any>;
        }>('manageinn.api.get_property_data', { property: propertyName });
        this.bookings = data.bookings || [];
        this.rooms = data.rooms || [];
        this.roomTypes = data.room_types || [];
        this.stats = data.stats || {};
      } catch (e: any) {
        this.loadError = e?.message || 'Could not load property data';
        throw e;
      } finally {
        this.loading = false;
      }
    },

    /** Replace a single booking in the local list (after edit / status change). */
    applyBookingUpdate(updated: Booking): void {
      const idx = this.bookings.findIndex((b) => b.name === updated.name);
      if (idx >= 0) this.bookings[idx] = { ...this.bookings[idx], ...updated };
      else this.bookings.unshift(updated);
    },

    /** Remove a booking from the local list (after delete). */
    removeBooking(name: string): void {
      this.bookings = this.bookings.filter((b) => b.name !== name);
    },

    reset(): void {
      this.bookings = [];
      this.rooms = [];
      this.roomTypes = [];
      this.guests = [];
      this.stats = {};
      this.loadError = '';
    },
  },
});
