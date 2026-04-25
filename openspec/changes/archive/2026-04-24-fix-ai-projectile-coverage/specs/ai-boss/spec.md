## MODIFIED Requirements

### Requirement: Four robotic arms fire projectiles
The AI brain SHALL have four robotic arms that fire red circular projectiles downward in regular timed patterns. Each arm SHALL fire independently at set intervals. Each projectile SHALL be aimed at a random horizontal target position selected uniformly from the full canvas width `[0, CANVAS_W]`, resulting in an angled trajectory from the arm to the target.

#### Scenario: Arms fire at intervals
- **WHEN** enough time has elapsed since an arm's last shot
- **THEN** the arm fires a red projectile aimed at a random X position across the full canvas width

#### Scenario: Multiple arms create coverage
- **WHEN** all four arms are firing over time
- **THEN** projectile impact points are uniformly distributed across the entire canvas width, with no persistent safe zones

#### Scenario: Bullet originates from arm position
- **WHEN** an arm fires a projectile
- **THEN** the projectile spawns at the arm's position and travels at an angle toward its random target X

### Requirement: AI projectiles are red circles
AI projectiles SHALL render as small red filled circles that travel downward at constant vertical speed with a horizontal velocity component. Projectiles SHALL be removed when they exit the bottom of the canvas.

#### Scenario: Projectile travels at angle
- **WHEN** an AI projectile exists with a non-zero horizontal velocity
- **THEN** it moves both horizontally (by `vx * dt`) and vertically (by `vy * dt`) each frame

#### Scenario: Projectile cleanup
- **WHEN** an AI projectile exits the bottom of the canvas (y > 600)
- **THEN** the projectile is removed from the game state
