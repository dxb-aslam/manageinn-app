# `theme/` — visual identity

Two files, loaded in this order from `main.ts`:

| File | Purpose |
|---|---|
| `variables.css` | Ionic CSS variables → Manage Inn palette. `--ion-color-primary` is terra, etc. Anything Ionic theming touches comes from here. |
| `manageinn.css` | App-specific overrides + brand classes. Loaded AFTER variables.css so it can override Ionic defaults. Imports the Lora + Caveat web fonts. |

## Palette reference

```
terra      #c4654a   primary / CTAs
terra-d    #a04a32   pressed / dark accents
cream      #fdf6eb   page background
paper      #fdfaf3   cards / surfaces
ink        #2a221a   primary text
sage       #5a7a6e   secondary
sage-d     #3d5c52   success / paid
honey      #d4912e   warnings / pending-cleaning
```

Plus opacity-suffix shorthand inherited from the web app:
`rgba(42, 34, 26, 0.55)` = ink at 55% — used for muted text everywhere.

## Helper classes (defined in manageinn.css)

- `.mi-font-display` — Lora italic-friendly serif
- `.mi-font-hand` — Caveat handwritten
- `.mi-underline-wavy` — wavy honey underline (used on the wordmark)
- `.mi-btn-tactile` — 2px-shadow CTA button (Ionic button variant)
- `.mi-status-pill.{enquiry|confirmed|checkedin|checkedout|cancelled}` — colored status pills
- `.mi-lift` — small hover/press transform for tappable cards

## Dark mode

We import `@ionic/vue/css/palettes/dark.class.css` in `main.ts` so
flipping `<html class="ion-palette-dark">` would switch Ionic's
components to dark variants. `theme.ts` flips that class, but
`manageinn.css` doesn't yet have dark overrides — keep the app
light-mode for now and revisit when we ship a dark mode.

## Don't

- Hardcode hex colors in component CSS. Use `var(--mi-terra)` /
  `var(--ion-color-primary)`. Otherwise a palette tweak means touching
  20 files instead of 2.
- Add Tailwind. The web app uses Tailwind via CDN; here we have Ionic +
  scoped CSS, which is enough for native scale.
