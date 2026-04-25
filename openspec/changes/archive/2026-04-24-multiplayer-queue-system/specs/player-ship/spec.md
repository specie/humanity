## MODIFIED Requirements

### Requirement: Player ship renders at bottom of screen
The system SHALL render one ship per "playing" player. Each ship SHALL be drawn as a pixel-art triangle/ship shape tinted with the player's assigned color. Ships are positioned according to their assigned lane and X position.

#### Scenario: Multiple ships render
- **WHEN** 3 players are in "playing" status
- **THEN** 3 ships render on the canvas, each in their assigned color and lane position

### Requirement: Horizontal movement via arrow keys
The system SHALL move each ship based on its player's input source. Each "playing" player's remote input (`state.remoteInputs[playerId]`) drives their ship. When no remote players are connected, the keyboard controls a local ship. Each ship SHALL move at a constant speed and SHALL NOT move beyond canvas boundaries.

#### Scenario: Move via remote input
- **WHEN** a remote player's `left` or `right` input is true
- **THEN** that player's ship moves accordingly at constant speed

#### Scenario: Keyboard fallback (no remote players)
- **WHEN** no mobile players are connected and arrow keys are pressed
- **THEN** a local ship moves accordingly

#### Scenario: Boundary clamping
- **WHEN** any ship reaches the canvas edge
- **THEN** it stops at the boundary

### Requirement: Player fires with spacebar
Each playing player's ship SHALL fire bullets when their fire input is active. Each ship has its own independent 250ms cooldown. Bullets are tinted with the firing player's color.

#### Scenario: Fire via remote input
- **WHEN** a remote player's `fire` input is true and their cooldown has elapsed
- **THEN** a bullet spawns at that ship's position

#### Scenario: Independent cooldowns
- **WHEN** two players fire at different times
- **THEN** each ship's cooldown is tracked independently

### Requirement: Player dies on enemy bullet hit
The system SHALL destroy a player's ship on first contact with any AI projectile. The player's status SHALL transition to "dead". No automatic respawn occurs — the slot is freed for the next queued player.

#### Scenario: Ship destroyed
- **WHEN** an AI projectile hits a playing player's ship
- **THEN** the ship is removed, the player's status becomes "dead", and their color and slot are released

### Requirement: Invulnerability after respawn
_Removed — players no longer respawn. Death is permanent until re-queued and re-promoted._

## REMOVED Requirements

### Requirement: Invulnerability after respawn
**Reason**: Players no longer respawn automatically. Death sends them to the back of the queue. A new promotion gives a fresh ship — no invulnerability needed.
**Migration**: Remove invulnerability logic from ship entity and movement system.

### Requirement: Player bullets are yellow vertical lines
**Reason**: Bullets are now tinted with the player's assigned color instead of always yellow.
**Migration**: Render system reads bullet color from the bullet entity.

## ADDED Requirements

### Requirement: Player bullets tinted with player color
Player bullets SHALL render in the color of the player who fired them. Each bullet entity SHALL store the firing player's color.

#### Scenario: Colored bullets
- **WHEN** a player with color cyan fires
- **THEN** the bullet renders as a cyan vertical line
