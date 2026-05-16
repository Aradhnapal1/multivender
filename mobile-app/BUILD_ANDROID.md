# HyperScripts Android APK (Capacitor)

## 1. Live site URL

Before building, set your **production HTTPS URL** in both files:

- `mobile-app/app.config.json` → `liveSiteUrl`
- `mobile-app/capacitor.config.json` → `server.url`

Example: `https://yourdomain.com` (no trailing slash)

The APK opens your live website inside the app (no need to copy PHP files into the app).

## 2. One-time setup

```bash
cd mobile-app
npm install
npx cap add android
```

Requires **Node.js 18+** and **Android Studio** (SDK + JDK 17).

## 3. Sync & open Android Studio

```bash
npm run cap:sync
npm run cap:open
```

In Android Studio: **Build → Generate Signed Bundle / APK → APK**.

## 4. Publish APK for footer download

Copy the release APK to the web root:

```
downloads/hyperscripts.apk
```

Upload that folder with your site. Footer **Download Android App** link points to this file.

## 5. Optional: Play Store

Use **AAB** (App Bundle) for Play Console instead of direct APK download.
