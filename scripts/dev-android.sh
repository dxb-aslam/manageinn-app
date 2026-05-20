#!/usr/bin/env bash
# Live-reload session for the Manage Inn Android app.
#
# Builds + installs the dev APK on the connected device, points the
# Capacitor WebView at the LAN Vite server, then keeps Vite running so
# HMR updates the phone in milliseconds.
#
# Prerequisites:
#   - Phone on the same Wi-Fi as this Mac
#   - `adb` available (Android Studio Platform Tools)
#   - Phone connected via USB (with USB debugging on) OR paired wirelessly
#     via `adb pair` + `adb connect`
#   - `npx cap sync android` has been run at least once (creates android/)
#
# Usage:
#   bash scripts/dev-android.sh
#
# Override the LAN IP / port if auto-detection picks the wrong interface:
#   HOST_IP=192.168.1.42 PORT=5173 bash scripts/dev-android.sh

set -euo pipefail

# Resolve the Mac's LAN IP (en0 = Wi-Fi on most Macs; falls back to en1).
HOST_IP="${HOST_IP:-$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)}"
PORT="${PORT:-5173}"
if [[ -z "${HOST_IP}" ]]; then
  echo "Could not resolve LAN IP. Set HOST_IP=… manually." >&2
  exit 1
fi

export CAP_DEV_URL="http://${HOST_IP}:${PORT}"
# Common Java path on macOS via Homebrew; override if you have a different JDK.
export JAVA_HOME="${JAVA_HOME:-/opt/homebrew/Cellar/openjdk@21/21.0.11/libexec/openjdk.jdk/Contents/Home}"

echo "→ Dev URL: ${CAP_DEV_URL}"
echo "→ Syncing Capacitor config + plugins…"
npx cap sync android >/dev/null

echo "→ Building + installing dev APK…"
( cd android && ./gradlew assembleDebug -q )
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

echo "→ Launching the app…"
adb shell am start -n com.dxbitz.manageinn/.MainActivity >/dev/null

echo
echo "Dev APK is on the phone, pointed at ${CAP_DEV_URL}."
echo "Edit any file under src/ and the WebView will hot-reload."
echo
exec npx vite --host 0.0.0.0 --port "${PORT}" --strictPort
