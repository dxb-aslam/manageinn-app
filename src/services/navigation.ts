/**
 * navigation — central handles for the routers.
 *
 * The auth store + http error layer sometimes need to redirect WITHOUT
 * being a Vue composable (e.g. inside a Pinia action). Holding the router
 * instances here lets them do `nav.gotoLogin()` from anywhere.
 *
 * Registered once in App.vue's onMounted.
 */
import type { Router } from 'vue-router';
import type { useIonRouter } from '@ionic/vue';

type IonRouter = ReturnType<typeof useIonRouter>;

let _ionRouter: IonRouter | null = null;
let _router: Router | null = null;

// Routes that should reset the page stack — anything that takes the user
// back to a "fresh start" (login, splash). After logout we want to wipe
// the IonRouterOutlet cache so back-button can't reveal protected pages.
export const AUTH_ROUTES = new Set<string>([
  '/splash',
  '/site-setup',
  '/login',
]);

export function registerNavigators(opts: { ionRouter: IonRouter; router: Router }): void {
  _ionRouter = opts.ionRouter;
  _router = opts.router;
}

/** Hard-replace the navigation stack with /login. Use after logout. */
export function gotoAuthRoot(): void {
  if (_ionRouter) {
    _ionRouter.replace('/login');
  } else if (_router) {
    _router.replace('/login');
  } else {
    window.location.href = '/login';
  }
}

/** Replace stack with /splash so it re-runs the auth check. */
export function gotoSplash(): void {
  if (_ionRouter) {
    _ionRouter.replace('/splash');
  } else if (_router) {
    _router.replace('/splash');
  }
}

/** Push a route normally — keeps back-stack. */
export function navigate(path: string): void {
  if (_router) {
    _router.push(path);
  }
}
