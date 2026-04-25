## MODIFIED Requirements

### Requirement: Host detects player connections
The host SHALL listen to the `players/` node via `onValue`. When a new player appears and there are free slots (playing count excluding the `__local__` fallback ship is less than `maxPlayers`), the host SHALL promote the oldest queued player to "playing". The `__local__` keyboard ship SHALL NOT count against `maxPlayers`. When a remote player is promoted, the `__local__` ship SHALL be removed immediately from game state.

#### Scenario: First player connects with local ship present
- **WHEN** a remote player registers, `maxPlayers` is 1, and a `__local__` keyboard ship exists
- **THEN** the host promotes the remote player to "playing" and removes the `__local__` ship

#### Scenario: Active player disconnects
- **WHEN** the last remote player's node is removed from Firebase
- **THEN** the host removes their ship and the GameCanvas interval re-creates the `__local__` keyboard fallback
