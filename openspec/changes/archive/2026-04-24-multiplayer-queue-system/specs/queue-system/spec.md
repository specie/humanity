## ADDED Requirements

### Requirement: Configurable max players stored in Firebase
The system SHALL store the maximum number of active pilots in Firebase at `config/maxPlayers`. The initial value SHALL be 1. The value SHALL only increase, never decrease. The absolute maximum SHALL be 12. All clients SHALL listen to this value.

#### Scenario: Initial value
- **WHEN** the game starts and no value exists in Firebase
- **THEN** `config/maxPlayers` is initialized to 1

#### Scenario: All clients receive updates
- **WHEN** `config/maxPlayers` changes in Firebase
- **THEN** both the host and all connected controllers receive the updated value

### Requirement: Player enters queue on connection
The system SHALL set a newly connected player's status to "queued" with a `joinedAt` timestamp when they register at `players/{playerId}`.

#### Scenario: New player joins
- **WHEN** a player connects via `/play`
- **THEN** their Firebase node is created with `status: "queued"` and `joinedAt: <server timestamp>`

### Requirement: FIFO promotion from queue to playing
The host SHALL promote the queued player with the oldest `joinedAt` timestamp to "playing" whenever the number of "playing" players is less than `maxPlayers`. Promotion SHALL occur on: initial connection, `maxPlayers` increase, or a player death.

#### Scenario: Slot available on connect
- **WHEN** a player joins the queue and playing count is less than maxPlayers
- **THEN** the oldest queued player is immediately promoted to "playing"

#### Scenario: Slot opens on death
- **WHEN** a playing player dies and queued players exist
- **THEN** the oldest queued player is promoted to "playing"

#### Scenario: maxPlayers increases
- **WHEN** the admin increases maxPlayers and queued players exist
- **THEN** enough queued players are promoted to fill the new slots

### Requirement: Death transitions player to dead and re-queues
When a playing player's ship is destroyed, the host SHALL set their status to "dead", release their color, remove their ship, and then re-add them to the queue (status back to "queued" with a new `joinedAt` timestamp).

#### Scenario: Player dies
- **WHEN** a playing player's ship is hit by an AI projectile
- **THEN** their status becomes "dead" briefly, then "queued" with updated `joinedAt`, and the next queued player is promoted if a slot is available

### Requirement: Queue position visible to players
Each queued player SHALL have a `queuePosition` field in their Firebase node representing their 1-based position in the FIFO queue. Positions SHALL update whenever the queue changes.

#### Scenario: Queue position updates
- **WHEN** a player ahead in the queue is promoted or disconnects
- **THEN** all remaining queued players' `queuePosition` values decrement accordingly
