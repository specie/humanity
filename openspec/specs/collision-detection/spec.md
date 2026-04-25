### Requirement: Bounding box collision between player bullets and AI boss
The system SHALL check for AABB overlap between each active player bullet (from all players) and the AI brain entity each frame.

#### Scenario: Any player's bullet hits AI
- **WHEN** any player's bullet overlaps the AI brain's bounding box
- **THEN** the bullet is removed and the AI takes 10 damage

#### Scenario: Bullet misses
- **WHEN** a bullet does not overlap the AI brain
- **THEN** the bullet continues traveling

### Requirement: Bounding box collision between AI projectiles and player ships
The system SHALL check for AABB overlap between each AI projectile and ALL active player ships each frame. A ship is only checked if it is alive (status "playing").

#### Scenario: AI bullet hits a player ship
- **WHEN** an AI projectile overlaps any active player ship's bounding box
- **THEN** that ship is destroyed, the player's status transitions to "dead", and the projectile is removed

#### Scenario: AI bullet misses all ships
- **WHEN** an AI projectile does not overlap any active ship
- **THEN** the projectile continues traveling

### Requirement: Collision checks run every frame
The collision system SHALL execute once per game loop update, after movement updates and before render. It SHALL iterate all ships and all bullets.

#### Scenario: Collision timing in loop
- **WHEN** a game loop frame executes
- **THEN** collisions are checked for all active ships and all bullets
