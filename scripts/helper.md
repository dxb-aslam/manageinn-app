# `scripts/` — bench tooling

| File | Purpose |
|---|---|
| `dev-android.sh` | One-shot live-reload session: builds a debug APK, installs on the connected device, points its WebView at the LAN Vite server, then runs Vite with HMR. Edit any `src/` file and the phone refreshes in milliseconds. |

## `dev-android.sh` quick reference

```bash
# Plug phone in (USB debugging on) OR adb-connect over Wi-Fi
bash scripts/dev-android.sh
```

Override IP if auto-detection fails (Mac with multiple network interfaces):

```bash
HOST_IP=192.168.1.42 PORT=5173 bash scripts/dev-android.sh
```

What it does, in order:

1. Resolves the Mac's LAN IP (from `en0`, fallback `en1`)
2. Sets `CAP_DEV_URL=http://<ip>:<port>` — `capacitor.config.ts` reads this
   and inserts a `server.url` block that makes the WebView load from that
   URL instead of bundled `dist/`
3. `npx cap sync android` — propagates the config + plugins into the
   Android project
4. `./gradlew assembleDebug -q` + `adb install -r` — fresh dev APK
5. `adb shell am start -n com.dxbitz.manageinn/.MainActivity` — launches
6. `npx vite --host 0.0.0.0 --port 5173 --strictPort` — Vite with HMR

## When to use `dev-android.sh` vs `cap run android`

- **dev-android.sh** — daily development. HMR is fast (Vite reloads in
  ~200ms vs Gradle's 10s+).
- **cap run android** — testing the bundled APK as production users will
  see it. No HMR; you have to `yarn build && npx cap sync && npx cap run`
  for every change.

## Adding a script

If you need a release build, a screenshot capture, an asset generator,
etc. — drop it here. Add to the `helper.md` table.
