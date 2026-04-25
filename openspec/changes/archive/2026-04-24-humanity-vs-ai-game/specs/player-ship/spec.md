## ADDED Requirements

### Requirement: Player ship renders at bottom of screen
The system SHALL render the player ship as a pixel-art triangle/ship shape near the bottom of the canvas, horizontally centered at game start.

#### Scenario: Initial position
- **WHEN** the game starts
- **THEN** the player ship appears centered horizontally near the bottom of the 800x600 canvas

### Requirement: Horizontal movement via arrow keys
The system SHALL move the player ship left when the Left Arrow key is held and right when the Right Arrow key is held, at a constant speed. The ship SHALL NOT move beyond the canvas boundaries.

#### Scenario: Move left
- **WHEN** the Left Arrow key is held
- **THEN** the ship moves left at constant speed each frame

#### Scenario: Move right
- **WHEN** the Right Arrow key is held
- **THEN** the ship moves right at constant speed each frame

#### Scenario: Boundary clamping
- **WHEN** the ship reaches the left or right edge of the canvas
- **THEN** the ship stops and does not move beyond the boundary

### Requirement: Player fires with spacebar
The system SHALL fire a bullet upward from the ship's position when the player presses the Space key. A cooldown of 250ms SHALL prevent firing more than once per 250ms.

#### Scenario: Fire bullet
- **WHEN** the player presses Space and cooldown has elapsed
- **THEN** a yellow vertical line bullet spawns at the ship's position moving upward

#### Scenario: Cooldown prevents rapid fire
- **WHEN** the player presses Space within 250ms of the last shot
- **THEN** no bullet is fired

### Requirement: Player bullets are yellow vertical lines
Player bullets SHALL render as short yellow vertical lines that travel upward at constant speed. Bullets SHALL be removed when they exit the top of the canvas.

#### Scenario: Bullet travels upward
- **WHEN** a player bullet exists
- **THEN** it moves upward each frame at constant speed

#### Scenario: Bullet cleanup
- **WHEN** a player bullet exits the top of the canvas (y < 0)
- **THEN** the bullet is removed from the game state

### Requirement: Player dies on enemy bullet hit
The system SHALL destroy the player ship on first contact with any AI projectile. The ship SHALL respawn after 1 second at the center-bottom position.

#### Scenario: Player hit by AI bullet
- **WHEN** an AI projectile collides with the player ship's bounding box
- **THEN** the ship is destroyed and removed from rendering

#### Scenario: Respawn after death
- **WHEN** 1 second has elapsed after player death
- **THEN** the ship respawns at center-bottom position

### Requirement: Invulnerability after respawn
The system SHALL grant 2 seconds of invulnerability after respawn. During invulnerability, the ship SHALL blink (alternating visible/invisible) and AI projectiles SHALL pass through without effect.

#### Scenario: Invulnerable ship ignores collisions
- **WHEN** an AI projectile contacts the ship during invulnerability
- **THEN** no damage occurs and the ship remains active

#### Scenario: Blink visual effect
- **WHEN** the ship is invulnerable
- **THEN** the ship alternates between visible and invisible at a rapid interval

#### Scenario: Invulnerability expires
- **WHEN** 2 seconds have elapsed since respawn
- **THEN** the ship becomes vulnerable and stops blinking
