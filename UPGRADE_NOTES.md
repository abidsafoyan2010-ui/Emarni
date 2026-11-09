# EMARNI v9 — upgrade and verification notes

## Baseline inspected

This package is based on the uploaded `Emarni-v8.zip`. It is a static HTML/CSS/JavaScript ES-module app with no build step. The archive contains the existing chat, feed, profile, people, pet adoption, advertisements, WebRTC calls, shared whiteboard, notification, environmental weather/time, sound, monitor and admin modules.

## Changes made

- Added `theme` preference values `dark`, `light` and `auto`; auto follows the operating-system color scheme.
- Added a Settings > Screen and appearance theme selector.
- Added a persistent desktop sidebar collapse/expand control. Phone bottom navigation remains as before.
- Refined the primary design tokens toward neutral black, white and red, and added light-theme surfaces and contrast styles.
- Added accessible labels/tooltips for the authentication inputs and compact navigation.
- Updated static asset version query strings so the changed stylesheet and preference modules can be fetched after deployment.
- Updated README setup notes.

## Preserved

- `firebase.js` project configuration and authentication flow.
- Existing Realtime Database paths and `database.rules.json`.
- Existing Cloud Storage rules.
- Existing feature modules and module boundaries.
- `admin.html` and `admin.js` behavior; admin HTML only points to the refreshed shared stylesheet.

## Checks performed

- All JavaScript files pass `node --check`.
- `database.rules.json` and `package` structure are checked as valid JSON / ZIP.
- Existing files remain present in the package.

## Not claimed as verified

This is a static source review and packaging pass, not a live Firebase/browser integration test. A real sign-in, database read/write, media upload, WebRTC call, push notification, geolocation and weather refresh still require deployment and testing against the owner's Firebase project and browser permissions. The existing README already notes that calls are not end-to-end encrypted and that admin conversation monitoring exists. No encryption or backend migration has been introduced here.

## Existing security caveat found during review

The Realtime Database rules restrict direct-message reads to room members (plus the configured admin paths). However, the existing Storage rule for `/chatfiles/{uid}/{fileName}` allows reads by any signed-in user rather than checking membership in the corresponding private room. Because Cloud Storage rules cannot directly query this Realtime Database membership path, a stronger attachment privacy model would need a compatible backend/storage design (for example, mediated downloads or carefully scoped access tokens). This was not changed in this UI-focused upgrade so existing chat attachments are not unexpectedly broken. The app also explicitly discloses that messages are not end-to-end encrypted and that authorized admins can review conversations.
