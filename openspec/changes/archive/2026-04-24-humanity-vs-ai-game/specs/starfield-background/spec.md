## ADDED Requirements

### Requirement: Scrolling starfield background
The system SHALL render small white dots (stars) that scroll slowly from top to bottom of the canvas to create a sensation of movement through space.

#### Scenario: Stars move downward
- **WHEN** a game frame updates
- **THEN** all star particles move downward at a slow constant speed

#### Scenario: Stars wrap around
- **WHEN** a star exits the bottom of the canvas (y > 600)
- **THEN** the star is repositioned at the top (y = 0) with a new random x position

#### Scenario: Stars are present at game start
- **WHEN** the game initializes
- **THEN** a set of star particles is created at random positions across the canvas

### Requirement: Stars render as small white pixels
Each star SHALL render as a small white filled rectangle (1-2 pixels) on the black background.

#### Scenario: Star visual appearance
- **WHEN** stars are rendered
- **THEN** each star appears as a white dot of 1-2 pixel size

### Requirement: Starfield renders behind all entities
The starfield SHALL be rendered immediately after the black background clear, before any game entities, so stars appear behind everything.

#### Scenario: Render order
- **WHEN** a frame is rendered
- **THEN** the starfield draws after the background clear and before the AI brain, player ship, bullets, and UI elements
