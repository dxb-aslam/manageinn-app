/**
 * router — Ionic Vue Router setup.
 *
 * Page flow:
 *   / → /splash → (no creds) /login   OR   (creds + bench reachable) /home
 *               → (creds + 401)       /login
 *               → (no site set)       /site-setup
 *
 *   /login validates → stores token → /home
 *
 *   /home is the dashboard. Other tabs/details push on top of the stack.
 */
import { createRouter, createWebHistory } from '@ionic/vue-router';
const routes = [
    { path: '/', redirect: '/splash' },
    { path: '/splash', component: () => import('@/views/SplashCheck.vue') },
    { path: '/site-setup', component: () => import('@/views/SiteSetup.vue') },
    // Auth
    { path: '/login', component: () => import('@/views/LoginPage.vue') },
    // Main tabs (one shared stack — back gesture works naturally)
    { path: '/home', component: () => import('@/views/HomePage.vue') },
    { path: '/calendar', component: () => import('@/views/CalendarPage.vue') },
    { path: '/bookings', component: () => import('@/views/BookingsPage.vue') },
    { path: '/bookings/new', component: () => import('@/views/NewBookingPage.vue') },
    { path: '/bookings/:name', component: () => import('@/views/BookingDetailPage.vue'), props: true },
    { path: '/cleaning', component: () => import('@/views/CleaningPage.vue') },
    { path: '/cleaning/:name', component: () => import('@/views/CleaningTaskDetailPage.vue'), props: true },
    { path: '/requests', component: () => import('@/views/RequestsPage.vue') },
    { path: '/rooms', component: () => import('@/views/RoomsPage.vue') },
    { path: '/profile', component: () => import('@/views/ProfilePage.vue') },
    { path: '/settings', component: () => import('@/views/SettingsPage.vue') },
    // Catch-all
    { path: '/:pathMatch(.*)*', redirect: '/splash' },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
