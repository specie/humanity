## ADDED Requirements

### Requirement: Player ID generation and persistence
The controller SHALL generate a UUID as the player ID using `crypto.randomUUID()` (with fallback). The UUID SHALL be persisted in `localStorage` so that a page refresh reconnects with the same identity.

#### Scenario: First visit generates ID
- **WHEN** a user opens `/play` for the first time (no ID in localStorage)
- **THEN** a new UUID is generated and stored in localStorage

#### Scenario: Refresh reuses ID
- **WHEN** a user refreshes the `/play` page
- **THEN** the same UUID from localStorage is used to reconnect

### Requirement: Player registration in Firebase
The controller SHALL write a registration object to `players/{playerId}` upon connection. The object SHALL include at minimum a `connected: true` field and a `timestamp`.

#### Scenario: Registration on mount
- **WHEN** the controller component mounts and has a player ID
- **THEN** it writes to `players/{playerId}` in Firebase with connection info

### Requirement: Automatic cleanup on disconnect
The controller SHALL call `onDisconnect().remove()` on the `players/{playerId}` ref immediately after registration. This ensures the player node is removed server-side if the client disconnects, crashes, or closes the tab.

#### Scenario: Tab closed
- **WHEN** the user closes the `/play` tab
- **THEN** Firebase server removes the `players/{playerId}` node automatically

#### Scenario: Network loss
- **WHEN** the mobile device loses network connectivity
- **THEN** after the Firebase timeout, the `players/{playerId}` node is removed

### Requirement: Host detects player connections
The host SHALL listen to the `players/` node via `onValue`. When a new player appears, the host SHALL designate the first connected player as the active controller. The host SHALL store the active player ID in game state.

#### Scenario: First player connects
- **WHEN** a player registers and no other player is active
- **THEN** the host sets that player as the active controller

#### Scenario: Second player connects
- **WHEN** a player registers while another is already active
- **THEN** the new player is not assigned as controller (stays in waiting)

#### Scenario: Active player disconnects
- **WHEN** the active player's node is removed from Firebase
- **THEN** the host clears the active player and falls back to keyboard input

### Requirement: Host reads active player input
The host SHALL listen to `players/{activePlayerId}/input` via `onValue` and write the received `{left, right, fire}` booleans into `state.remoteInput`. The game loop SHALL read from `state.remoteInput` when a remote player is active.

#### Scenario: Remote input received
- **WHEN** the active player updates their input in Firebase
- **THEN** the host's `state.remoteInput` is updated with the new boolean values

#### Scenario: No remote player
- **WHEN** no player is connected via Firebase
- **THEN** `state.remoteInput` is null and the game loop uses keyboard input
