## Why

The game currently requires a physical keyboard, limiting it to a single desktop user. Adding mobile remote control via Firebase Realtime Database enables a "party game" experience: the game is projected on a big screen and players join by scanning a QR code on their phones. This transforms the game from a solitary desktop experience into a social, shareable one.

## What Changes

- Add client-side routing: `/` serves the game host (canvas), `/play` serves the mobile controller
- Integrate Firebase Realtime Database (v9+ modular SDK) for real-time communication between host and mobile clients
- Add Firebase configuration via `.env` file with permissive security rules (demo mode)
- Create mobile controller UI at `/play`: full-viewport portrait layout with touch-optimized directional and fire buttons
- Implement player registration flow: `/play` clients register in `players/{playerId}` node with UUID persisted in localStorage; `onDisconnect()` auto-cleanup
- Host listens to `players/` and binds the first connected player as the active controller
- Additional `/play` clients see a "WAITING" status screen
- Mobile input writes `{left, right, fire}` booleans to Firebase; host reads them in the game loop — all game logic stays on the host
- Add haptic feedback (`navigator.vibrate(20)`) on button press with visual pressed state
- Keyboard input remains as fallback when no mobile player is connected

## Capabilities

### New Capabilities
- `firebase-config`: Firebase SDK initialization, `.env` credentials, Realtime Database connection, security rules
- `routing`: Client-side routing for `/` (host) and `/play` (controller) within the same SPA
- `mobile-controller`: Touch-optimized controller UI, button layout, touch events, haptic feedback, status display
- `player-connection`: Player registration in Firebase, UUID generation/persistence, `onDisconnect()` cleanup, host-side player binding

### Modified Capabilities
- `player-ship`: Input source changes — ship now reads from Firebase remote input (when a mobile player is connected) in addition to keyboard. Keyboard becomes fallback when no remote player is active.

## Impact

- **New dependency**: `firebase` (v9+ modular SDK)
- **New files**: Firebase config module, `.env` / `.env.example`, router setup, MobileController component, player connection hooks/modules
- **Modified files**: `GameCanvas.jsx` (read remote input), `src/game/systems/movement.js` (accept remote input alongside keyboard), `index.html` (meta viewport for mobile), `vite.config.js` (env variable exposure)
- **Infrastructure**: Requires a Firebase project with Realtime Database enabled
- **Security**: Open read/write rules — acceptable for controlled demo, marked with TODO for hardening
