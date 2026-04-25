## MODIFIED Requirements

### Requirement: Player registration in Firebase
The controller SHALL write a registration object to `players/{playerId}` upon connection. The object SHALL include `status: "queued"`, `joinedAt: <timestamp>`, and `connected: true`.

#### Scenario: Registration on mount
- **WHEN** the controller component mounts
- **THEN** it writes to `players/{playerId}` with `status: "queued"`, `joinedAt`, and `connected: true`

### Requirement: Host detects player connections
The host SHALL listen to the `players/` node via `onValue`. The host SHALL manage a queue system: players with status "queued" are ordered by `joinedAt`, and the oldest queued players are promoted to "playing" when slots are available (playing count < maxPlayers).

#### Scenario: First player connects with available slot
- **WHEN** a player registers and playing count is less than maxPlayers
- **THEN** the host promotes them to "playing" with a color and ship

#### Scenario: Player connects with no available slot
- **WHEN** a player registers and playing count equals maxPlayers
- **THEN** the player remains "queued" with a queue position

#### Scenario: Active player disconnects
- **WHEN** a playing player's node is removed (tab closed, network lost)
- **THEN** their ship and color are released, and the next queued player is promoted

### Requirement: Host reads all active player inputs
The host SHALL listen to `players/{playerId}/input` for every "playing" player. Each player's `{left, right, fire}` booleans are stored in `state.remoteInputs[playerId]`. When a player is no longer "playing", their input listener is cleaned up.

#### Scenario: Multiple remote inputs
- **WHEN** 3 players are "playing"
- **THEN** the host has 3 active input listeners, one per player
