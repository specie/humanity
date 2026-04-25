## Context

The game currently runs as a single-page canvas app at `/` with keyboard-only input. Adding mobile remote control requires: Firebase Realtime Database integration, client-side routing, a new mobile controller view, and a dual-input system where remote touch input takes priority over keyboard.

The existing game architecture uses a mutable state object with a rAF loop. Input is read from `state.keys` (populated by keydown/keyup listeners). The remote input must feed into the same `state.keys`-like interface so the game loop requires minimal changes.

## Goals / Non-Goals

**Goals:**
- Mobile phone controls the game via Firebase Realtime Database with <100ms perceived latency
- Clean separation: mobile sends raw input booleans, host computes all game logic
- Keyboard remains fully functional as fallback when no mobile player is connected
- Mobile UI is touch-optimized with haptic feedback, no accidental zoom/scroll

**Non-Goals:**
- Multiplayer (multiple ships) — single controller only for now
- Authentication or user accounts
- QR code generation (manual URL sharing for now)
- Offline/PWA support for the controller
- Hardened security rules (demo mode, open read/write)

## Decisions

### D1: Hash-based routing instead of a router library
**Choice**: Use `window.location.hash` (`#/play`) or simple `window.location.pathname` detection to switch between host and controller views. No React Router.
**Rationale**: Only two routes exist. A router library adds bundle size and complexity for no benefit. A simple `pathname === '/play'` check in `App.jsx` suffices. Vite's dev server can be configured to serve `index.html` for all routes.
**Alternative considered**: React Router v6 — overkill for two routes with no shared layout or nested routing needs.

### D2: Firebase v9+ modular imports
**Choice**: Use tree-shakeable modular imports (`firebase/database`, `ref`, `set`, `onValue`, `onDisconnect`).
**Rationale**: Smaller bundle — only import what's used. The modular API is the current Firebase standard.
**Alternative considered**: Firebase compat (v8-style) — larger bundle, deprecated path.

### D3: Credentials via Vite env variables
**Choice**: Store Firebase config in `.env` with `VITE_` prefix. Create `.env.example` as template. Add `.env` to `.gitignore`.
**Rationale**: Vite natively supports `import.meta.env.VITE_*`. No extra tooling needed. Firebase client config is not secret (it's in the HTML of any Firebase app), but `.env` keeps it tidy.

### D4: Remote input merges into game state via a `remoteInput` object
**Choice**: The host listens to `players/{activePlayerId}/input` via `onValue`. The callback writes to `state.remoteInput = {left, right, fire}`. The movement system checks `state.remoteInput` first; if a remote player is active, those booleans drive the ship. If no remote player, fall back to `state.keys`.
**Rationale**: Minimal game loop change — the movement system already reads booleans. Adding a second source is a small conditional. The game loop stays synchronous; Firebase callbacks just mutate the state object asynchronously (same pattern as keydown listeners).
**Alternative considered**: Merge remote input into `state.keys` directly — risks confusion between keyboard and remote sources, harder to implement fallback logic.

### D5: Player registration with UUID + onDisconnect
**Choice**: On `/play` mount, generate a UUID (crypto.randomUUID or fallback), store in localStorage. Write to `players/{uuid}` with `set()`. Call `onDisconnect().remove()` on that ref immediately after writing. The host uses `onValue` on `players/` to detect connections.
**Rationale**: `onDisconnect()` is the Firebase-native way to handle cleanup — it runs server-side even if the client crashes. localStorage persistence means a page refresh reconnects with the same ID (no duplicate registrations).

### D6: Touch events (touchstart/touchend) instead of click/pointer
**Choice**: Use `touchstart` and `touchend` on controller buttons. Set CSS `touch-action: manipulation` to disable double-tap zoom. No `onClick` handlers.
**Rationale**: `touchstart` fires immediately with no 300ms delay. `touchend` fires on finger lift. This gives the tightest possible input loop for a touch controller. Click events have built-in delays on mobile.
**Alternative considered**: Pointer events — cross-platform but add complexity for a mobile-only view.

## Risks / Trade-offs

- **[Firebase latency]** → Realtime Database typically delivers updates in 20-100ms on good connections. Acceptable for an arcade game. Mitigation: The host reads the latest value each frame; intermediate values are skipped naturally.
- **[onDisconnect race condition]** → If the client refreshes very quickly, the old `onDisconnect` may fire before the new `set()`. Mitigation: Using the same UUID from localStorage means the node is the same — re-writing it is idempotent.
- **[No throttle on input writes]** → Each touchstart/touchend writes to Firebase. With 3 buttons this is at most 6 writes per interaction. Firebase handles this fine, but rapid toggling could spike. Mitigation: Only write when the boolean value actually changes (diff check).
- **[Open security rules]** → Anyone with the database URL can read/write. Acceptable for demo. Marked with TODO.
