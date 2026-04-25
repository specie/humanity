### Requirement: Player ID generation and persistence
The controller SHALL generate a UUID as the player ID using `crypto.randomUUID()` (with fallback). The UUID SHALL be persisted in `localStorage` so that a page refresh reconnects with the same identity.

#### Scenario: First visit generates ID
- **WHEN** a user opens `/play` for the first time (no ID in localStorage)
- **THEN** a new UUID is generated and stored in localStorage

#### Scenario: Refresh reuses ID
- **WHEN** a user refreshes the `/play` page
- **THEN** the same UUID from localStorage is used to reconnect

### Requirement: Player registration in Firebase
The controller SHALL write a registration object to `players/{playerId}` upon connection. The object SHALL include `status: "queued"`, `joinedAt: <timestamp>`, and `connected: true`.

#### Scenario: Registration on mount
- **WHEN** the controller component mounts
- **THEN** it writes to `players/{playerId}` with `status: "queued"`, `joinedAt`, and `connected: true`

### Requirement: Automatic cleanup on disconnect
The controller SHALL call `onDisconnect().remove()` on the `players/{playerId}` ref immediately after registration. This ensures the player node is removed server-side if the client disconnects, crashes, or closes the tab.

#### Scenario: Tab closed
- **WHEN** the user closes the `/play` tab
- **THEN** Firebase server removes the `players/{playerId}` node automatically

#### Scenario: Network loss
- **WHEN** the mobile device loses network connectivity
- **THEN** after the Firebase timeout, the `players/{playerId}` node is removed

### Requirement: Host detects player connections
The host SHALL listen to the `players/` node via `onValue`. When a new player appears and there are free slots (playing count excluding the `__local__` fallback ship is less than `maxPlayers`), the host SHALL promote the oldest queued player to "playing". The `__local__` keyboard ship SHALL NOT count against `maxPlayers`. When a remote player is promoted, the `__local__` ship SHALL be removed immediately from game state.

#### Scenario: First player connects with local ship present
- **WHEN** a remote player registers, `maxPlayers` is 1, and a `__local__` keyboard ship exists
- **THEN** the host promotes the remote player to "playing" and removes the `__local__` ship

#### Scenario: Player connects with no available slot
- **WHEN** a player registers and playing count equals maxPlayers
- **THEN** the player remains "queued" with a queue position

#### Scenario: Active player disconnects
- **WHEN** the last remote player's node is removed from Firebase
- **THEN** the host removes their ship and the GameCanvas interval re-creates the `__local__` keyboard fallback

### Requirement: Host reads all active player inputs
The host SHALL listen to `players/{playerId}/input` for every "playing" player. Each player's `{left, right, fire}` booleans are stored in `state.remoteInputs[playerId]`. When a player is no longer "playing", their input listener is cleaned up.

#### Scenario: Multiple remote inputs
- **WHEN** 3 players are "playing"
- **THEN** the host has 3 active input listeners, one per player
