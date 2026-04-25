## 1. Firebase Setup

- [x] 1.1 Install `firebase` package
- [x] 1.2 Create `.env.example` with all `VITE_FIREBASE_*` variable names (apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId)
- [x] 1.3 Add `.env` to `.gitignore`
- [x] 1.4 Create `src/firebase.js` — initialize Firebase app from `import.meta.env`, export Realtime Database instance
- [x] 1.5 Create `database.rules.json` with open read/write rules and TODO comment for hardening

## 2. Routing

- [x] 2.1 Update `vite.config.js` to add SPA fallback for dev server (`server.historyApiFallback` or `appType: 'spa'`)
- [x] 2.2 Update `App.jsx` to render `GameCanvas` on `/` and `MobileController` on `/play` based on `window.location.pathname`

## 3. Player Connection (Controller Side)

- [x] 3.1 Create `src/lib/playerId.js` — generate UUID via `crypto.randomUUID()` with fallback, persist in localStorage
- [x] 3.2 Create `src/hooks/usePlayerConnection.js` — on mount: get/create player ID, write to `players/{id}` in Firebase, set up `onDisconnect().remove()`, listen to own player node for status updates; return `{playerId, status}`

## 4. Mobile Controller UI

- [x] 4.1 Create `src/MobileController.jsx` — full-viewport portrait layout with three sections (banner, status, buttons)
- [x] 4.2 Implement pilot banner: "PILOT" text on neon green (#39FF14) background
- [x] 4.3 Implement status indicator: display current status (CONNECTED, CONTROLLING, WAITING, GAME OVER) from usePlayerConnection hook
- [x] 4.4 Implement three control buttons: left arrow, fire (red center), right arrow — using touchstart/touchend events
- [x] 4.5 Implement input write logic: on touchstart/touchend, update `{left, right, fire}` booleans in `players/{id}/input` only when value changes
- [x] 4.6 Add haptic feedback: call `navigator.vibrate(20)` on touchstart (with silent fallback)
- [x] 4.7 Add visual pressed state: lighter background while finger is touching a button
- [x] 4.8 Add CSS: `touch-action: manipulation`, `user-select: none`, `overscroll-behavior: none`
- [x] 4.9 Update `index.html` meta viewport to include `maximum-scale=1, user-scalable=no` to block pinch-zoom

## 5. Host-Side Player Binding

- [x] 5.1 Create `src/hooks/useHostPlayers.js` — listen to `players/` node via `onValue`, track active player ID (first connected), listen to `players/{activeId}/input` for remote input; return `{activePlayerId, remoteInput}`
- [x] 5.2 Update `GameCanvas.jsx` — call `useHostPlayers`, write `remoteInput` into `state.remoteInput` and `activePlayerId` into `state.activePlayerId` before each frame (or via ref callback)

## 6. Game Loop Input Integration

- [x] 6.1 Add `remoteInput` and `activePlayerId` fields to game state in `src/game/state.js`
- [x] 6.2 Update `updateShip` in `src/game/systems/movement.js` — read from `state.remoteInput` when `state.activePlayerId` is set, fall back to `state.keys` when null
- [x] 6.3 Verify keyboard still works when no remote player is connected

## 7. Controller Status Updates

- [x] 7.1 Host writes status to `players/{id}/status` ("controlling" or "waiting") when binding/unbinding players
- [x] 7.2 Controller reads own `players/{id}/status` to update status indicator display
- [x] 7.3 On victory, host writes "gameover" status to active player's node; controller shows "GAME OVER"

## 8. Verification

- [x] 8.1 Build passes with no errors
- [x] 8.2 Test full flow: open `/` on desktop, open `/play` on mobile, verify remote control works
- [x] 8.3 Test keyboard fallback: with no `/play` client, arrow keys and space still control the ship
- [x] 8.4 Test disconnect cleanup: close `/play` tab, verify host falls back to keyboard
