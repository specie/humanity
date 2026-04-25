## Context

The game currently supports one mobile controller binding to one ship. The game state has a single `state.ship` entity and a single `state.remoteInput`. We need to scale to N simultaneous ships (up to 12), each driven by a different mobile player, with a queue system that cycles players through available slots.

Key existing architecture:
- `state.ship` — single ship entity with position, alive, invulnerable flags
- `state.remoteInput` / `state.activePlayerId` — single remote player binding
- `useHostPlayers.js` — listens to `players/` and binds first player as active
- Movement system reads `state.remoteInput` or `state.keys` for ship control
- Collision checks one ship against AI bullets

## Goals / Non-Goals

**Goals:**
- N simultaneous ships (1–12), each controlled by a different mobile player
- FIFO queue system for fair slot allocation on death and maxPlayers increase
- Admin panel on host to increase pilot count live
- Unique color assignment per active player, recycling on death
- Spatial distribution across 4 lanes to reduce visual overlap
- Scaled AI health (`maxPlayers × 1000`) with percentage preservation on config change
- Victory screen showing all participant colors
- Keyboard fallback preserved for zero-player mode

**Non-Goals:**
- Player-vs-player collision or friendly fire
- Custom ship selection or names
- Persistent stats or leaderboards
- Decreasing maxPlayers
- Sound effects

## Decisions

### D1: `state.ships` as a Map keyed by playerId
**Choice**: Replace `state.ship` with `state.ships = {}` — a plain object keyed by `playerId`. Each value is a ship entity with `playerId`, `color`, `lane` added. The keyboard fallback uses a special key `"__local__"`.
**Rationale**: The game loop iterates all ships for movement, collision, and rendering. A map by playerId makes it trivial to bind remote input to the correct ship. No index-based lookups needed.
**Alternative**: Array of ships — requires searching by playerId on every input update. Map is O(1).

### D2: Queue management on the host only
**Choice**: All queue logic (promotion, death handling, slot counting) runs in `useHostPlayers.js` on the host. The host writes status changes to Firebase. Controllers are passive — they read their own status and display accordingly.
**Rationale**: Single source of truth avoids race conditions. The host is always running. Controllers only send input and display status.

### D3: Color palette as a constant array, assignment by exclusion
**Choice**: Define `PILOT_COLORS` as a 12-element array of hex values. On promotion, find the first color not used by any current "playing" player. Store in `players/{id}/color`.
**Rationale**: Simple, deterministic. No need for a pool data structure — just filter the palette against active colors each time a promotion happens (max 12 players, negligible cost).

### D4: 4 invisible lanes for spatial distribution
**Choice**: Define 4 Y-positions for lanes in the bottom portion of the canvas (e.g., y=520, y=545, y=570, y=595 — adjusted for ship height). On promotion, assign the lane with the fewest currently playing ships. Random X within canvas bounds.
**Rationale**: Prevents visual stacking. 4 lanes × 3 ships = 12, matching the max. Players don't need to know about lanes.

### D5: Admin panel as a React component outside the canvas
**Choice**: Add an `AdminPanel` component rendered below the `<canvas>` in `GameCanvas.jsx`. It reads `config/maxPlayers` from Firebase and writes increments. Styled minimally with Press Start 2P font.
**Rationale**: Keeping it outside the canvas avoids complicating the game render loop. It's a React component with normal state management.

### D6: AI HP scaling with percentage preservation
**Choice**: `brain.maxHp = maxPlayers × 1000`. When `maxPlayers` changes, compute `ratio = brain.hp / brain.maxHp`, set new `maxHp`, then `brain.hp = Math.round(ratio * brain.maxHp)`.
**Rationale**: Prevents the game from becoming trivially easy with more players, while not punishing existing progress.

### D7: Multi-ship movement via per-player remote input
**Choice**: The host listens to `players/{id}/input` for every "playing" player. Store inputs in `state.remoteInputs[playerId]`. The movement system iterates `state.ships` and reads the matching input from `state.remoteInputs[ship.playerId]`.
**Rationale**: Clean 1:1 mapping. No shared input state. Each ship is independent.

## Risks / Trade-offs

- **[Firebase listener count]** → One `onValue` per playing player's input node. Max 12 listeners — well within Firebase limits.
- **[Render performance with 12 ships]** → 12 ships + up to ~100 bullets is still trivial for Canvas 2D at 60fps.
- **[Queue race conditions]** → Two deaths in the same frame could promote two players simultaneously. Mitigation: process deaths sequentially in the collision system, promote after all collision checks complete.
- **[Admin panel only increments]** → Intentional per spec. Decreasing would require deciding which active players to kick.
