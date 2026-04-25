## MODIFIED Requirements

### Requirement: Horizontal movement via arrow keys
The system SHALL move the player ship left or right based on the active input source. When a remote mobile player is connected, the ship reads `left`/`right` booleans from `state.remoteInput`. When no remote player is connected, the ship reads from keyboard input (`state.keys`). The ship SHALL move at a constant speed and SHALL NOT move beyond the canvas boundaries.

#### Scenario: Move left via keyboard (no remote player)
- **WHEN** the Left Arrow key is held and no remote player is active
- **THEN** the ship moves left at constant speed each frame

#### Scenario: Move right via keyboard (no remote player)
- **WHEN** the Right Arrow key is held and no remote player is active
- **THEN** the ship moves right at constant speed each frame

#### Scenario: Move left via remote input
- **WHEN** a remote player is active and `state.remoteInput.left` is true
- **THEN** the ship moves left at constant speed each frame

#### Scenario: Move right via remote input
- **WHEN** a remote player is active and `state.remoteInput.right` is true
- **THEN** the ship moves right at constant speed each frame

#### Scenario: Boundary clamping
- **WHEN** the ship reaches the left or right edge of the canvas
- **THEN** the ship stops and does not move beyond the boundary

### Requirement: Player fires with spacebar
The system SHALL fire a bullet upward from the ship's position when the fire input is active. When a remote player is connected, fire is triggered by `state.remoteInput.fire`. When no remote player is connected, fire is triggered by the Space key. A cooldown of 250ms SHALL prevent firing more than once per 250ms.

#### Scenario: Fire bullet via keyboard (no remote player)
- **WHEN** the player presses Space, no remote player is active, and cooldown has elapsed
- **THEN** a yellow vertical line bullet spawns at the ship's position moving upward

#### Scenario: Fire bullet via remote input
- **WHEN** a remote player is active, `state.remoteInput.fire` is true, and cooldown has elapsed
- **THEN** a yellow vertical line bullet spawns at the ship's position moving upward

#### Scenario: Cooldown prevents rapid fire
- **WHEN** a fire input occurs within 250ms of the last shot
- **THEN** no bullet is fired
