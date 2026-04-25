## Why

The game currently supports only one mobile controller at a time. To deliver the full "party game" experience — projecting the game on a big screen while dozens of people join from their phones — we need simultaneous multi-ship gameplay with a queue system that cycles players in and out as they die.

## What Changes

- Add configurable active pilot slots (1–12), controlled via admin panel on host page, stored in Firebase `config/maxPlayers`
- Replace single-player connection model with a FIFO queue system: new players enter as "queued", get promoted to "playing" when a slot opens, move to "dead" on death and re-queue automatically
- Assign unique colors from a 12-color high-contrast palette to active players; colors recycle when players die
- Render multiple ships on canvas, distributed across 4 invisible horizontal lanes to avoid visual overlap
- Remove automatic respawn — death frees the slot for the next queued player
- Scale AI health dynamically: `maxPlayers × 1000` HP, preserving current health percentage when maxPlayers changes
- Update mobile controller UI: show queue position when waiting, "FLY" when playing, "ELIMINATED + QUEUE #N" on death; disable buttons when not playing; banner color matches assigned color or gray
- Victory screen shows all participating player colors with "HUMANITY WINS"
- Preserve keyboard single-player fallback when no mobile players are connected
- Add admin panel below canvas with "Active pilots" display and + button

## Capabilities

### New Capabilities
- `queue-system`: FIFO player queue, slot management, promotion logic, death→re-queue cycle, maxPlayers config in Firebase
- `admin-panel`: Host-side UI below canvas to display and increment active pilot count (1–12), writes to Firebase `config/maxPlayers`
- `color-assignment`: 12-color palette, assignment on promotion, release on death, stored in `players/{id}/color`
- `lane-distribution`: 4 invisible horizontal lanes at canvas bottom, least-occupied assignment, random X within lane

### Modified Capabilities
- `player-ship`: Single ship becomes multiple ships; one ship per "playing" player; no auto-respawn; death sets status to "dead" instead of respawning
- `player-connection`: Registration now sets status to "queued" with `joinedAt` timestamp; host manages queue promotion instead of simple first-connected binding
- `mobile-controller`: UI updates for queue position, "FLY"/"ELIMINATED" states, button disabling, dynamic banner color
- `ai-boss`: HP scales to `maxPlayers × 1000`; HP percentage preserved on maxPlayers change; victory screen shows all participant colors
- `collision-detection`: Check AI bullets against all active player ships, not just one; check all player bullets against AI brain
- `game-ui`: Victory screen updated to show all participating player colors

## Impact

- **Firebase schema change**: `players/{id}` now has `status` ("queued"/"playing"/"dead"), `joinedAt`, `color`, `queuePosition` fields; new `config/maxPlayers` node
- **Major refactors**: `GameCanvas.jsx` (multi-ship state + admin panel), `useHostPlayers.js` (queue logic), `MobileController.jsx` (new UI states), `movement.js` (multi-ship input), `collision.js` (multi-ship collision), `render.js` (multi-ship rendering + victory colors)
- **Game state**: `state.ship` becomes `state.ships` (map of playerId → ship entity); new `state.maxPlayers` field
- **No new dependencies**
