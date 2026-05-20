let _ionRouter = null;
let _router = null;
// Routes that should reset the page stack — anything that takes the user
// back to a "fresh start" (login, splash). After logout we want to wipe
// the IonRouterOutlet cache so back-button can't reveal protected pages.
export const AUTH_ROUTES = new Set([
    '/splash',
    '/site-setup',
    '/login',
]);
export function registerNavigators(opts) {
    _ionRouter = opts.ionRouter;
    _router = opts.router;
}
/** Hard-replace the navigation stack with /login. Use after logout. */
export function gotoAuthRoot() {
    if (_ionRouter) {
        _ionRouter.replace('/login');
    }
    else if (_router) {
        _router.replace('/login');
    }
    else {
        window.location.href = '/login';
    }
}
/** Replace stack with /splash so it re-runs the auth check. */
export function gotoSplash() {
    if (_ionRouter) {
        _ionRouter.replace('/splash');
    }
    else if (_router) {
        _router.replace('/splash');
    }
}
/** Push a route normally — keeps back-stack. */
export function navigate(path) {
    if (_router) {
        _router.push(path);
    }
}
