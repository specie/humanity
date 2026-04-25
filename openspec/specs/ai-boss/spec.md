### Requirement: AI brain renders at top center
The system SHALL render a digital brain entity at the top-center of the canvas. The brain SHALL be drawn as a pixel-art style brain/circuit shape with four robotic arms extending from it.

#### Scenario: Brain position
- **WHEN** the game is running
- **THEN** the AI brain is rendered centered horizontally in the upper portion of the canvas

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

### Requirement: AI has 1000 hit points
The AI brain's maximum HP SHALL be `maxPlayers × 1000`. The HP SHALL scale dynamically when `maxPlayers` changes: the current HP percentage SHALL be preserved (e.g., if at 80% of old max, set to 80% of new max, rounded). When HP reaches 0, the AI is defeated.

#### Scenario: Initial HP with 1 player
- **WHEN** maxPlayers is 1
- **THEN** the AI has 1000 / 1000 HP

#### Scenario: HP scales on maxPlayers increase
- **WHEN** maxPlayers increases from 2 to 3 and AI is at 1500/2000 (75%)
- **THEN** AI HP becomes 2250/3000 (75% of new max)

#### Scenario: Player bullet reduces HP
- **WHEN** any player's bullet collides with the AI brain
- **THEN** the AI's HP decreases by 10 and the bullet is removed

#### Scenario: AI defeated
- **WHEN** the AI's HP reaches 0
- **THEN** the game transitions to the victory state

### Requirement: Victory screen shows all participant colors
When the AI is defeated, the victory screen SHALL display "HUMANITY WINS" along with the colors of ALL players who participated in the game (anyone who was "playing" at any point), rendered as colored blocks or symbols.

#### Scenario: Multi-player victory
- **WHEN** the AI is defeated and 5 players participated over the course of the game
- **THEN** the victory screen shows "HUMANITY WINS" with 5 colored indicators representing each participant
