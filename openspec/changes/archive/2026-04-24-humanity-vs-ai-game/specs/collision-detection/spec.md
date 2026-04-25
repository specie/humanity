## ADDED Requirements

### Requirement: Bounding box collision between player bullets and AI boss
The system SHALL check for axis-aligned bounding box (AABB) overlap between each active player bullet and the AI brain entity each frame.

#### Scenario: Player bullet hits AI
- **WHEN** a player bullet's bounding box overlaps the AI brain's bounding box
- **THEN** the collision is detected, the bullet is removed, and the AI takes 10 damage

#### Scenario: Player bullet misses AI
- **WHEN** a player bullet's bounding box does not overlap the AI brain's bounding box
- **THEN** the bullet continues traveling upward unaffected

### Requirement: Bounding box collision between AI projectiles and player ship
The system SHALL check for AABB overlap between each active AI projectile and the player ship each frame, but only when the player is not invulnerable.

#### Scenario: AI bullet hits vulnerable player
- **WHEN** an AI projectile's bounding box overlaps the player ship's bounding box and the player is not invulnerable
- **THEN** the collision is detected and the player ship is destroyed

#### Scenario: AI bullet hits invulnerable player
- **WHEN** an AI projectile's bounding box overlaps the player ship's bounding box and the player is invulnerable
- **THEN** no collision is registered and the projectile continues

#### Scenario: AI bullet misses player
- **WHEN** an AI projectile's bounding box does not overlap the player ship's bounding box
- **THEN** the projectile continues traveling downward unaffected

### Requirement: Collision checks run every frame
The collision system SHALL execute once per game loop update, after movement updates and before render.

#### Scenario: Collision timing in loop
- **WHEN** a game loop frame executes
- **THEN** collision checks run after all entities have moved but before rendering
