## ADDED Requirements

### Requirement: AI brain renders at top center
The system SHALL render a digital brain entity at the top-center of the canvas. The brain SHALL be drawn as a pixel-art style brain/circuit shape with four robotic arms extending from it.

#### Scenario: Brain position
- **WHEN** the game is running
- **THEN** the AI brain is rendered centered horizontally in the upper portion of the canvas

### Requirement: Four robotic arms fire projectiles
The AI brain SHALL have four robotic arms that fire red circular projectiles downward in regular timed patterns. Each arm SHALL fire independently at set intervals.

#### Scenario: Arms fire at intervals
- **WHEN** enough time has elapsed since an arm's last shot
- **THEN** the arm fires a red projectile downward from its position

#### Scenario: Multiple arms create patterns
- **WHEN** all four arms are firing
- **THEN** projectiles come from four distinct horizontal positions creating a spread pattern

### Requirement: AI projectiles are red circles
AI projectiles SHALL render as small red filled circles that travel straight downward at constant speed. Projectiles SHALL be removed when they exit the bottom of the canvas.

#### Scenario: Projectile travels downward
- **WHEN** an AI projectile exists
- **THEN** it moves downward each frame at constant speed

#### Scenario: Projectile cleanup
- **WHEN** an AI projectile exits the bottom of the canvas (y > 600)
- **THEN** the projectile is removed from the game state

### Requirement: AI has 1000 hit points
The AI brain SHALL start with 1000 HP. Each player bullet hit SHALL reduce HP by 10. When HP reaches 0, the AI is defeated.

#### Scenario: Player bullet reduces HP
- **WHEN** a player bullet collides with the AI brain's bounding box
- **THEN** the AI's HP decreases by 10 and the bullet is removed

#### Scenario: AI defeated
- **WHEN** the AI's HP reaches 0
- **THEN** the game transitions to the victory state
