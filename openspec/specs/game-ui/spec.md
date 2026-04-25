### Requirement: AI health bar displays below brain
The system SHALL render a horizontal health bar at the top of the canvas as a HUD element, visually separated from the AI brain entity. The bar SHALL show "AI INTEGRITY" text above it and a numeric counter below it showing current/max HP (where max is `maxPlayers × 1000`).

#### Scenario: Health bar at top of canvas
- **WHEN** the game is running
- **THEN** the health bar renders near the top of the canvas, clearly above and separated from the AI brain

#### Scenario: Health bar with scaled max
- **WHEN** maxPlayers is 3 and AI HP is 2250/3000
- **THEN** the health bar shows 75% filled with "2250 / 3000"

### Requirement: Victory screen on AI defeat
The system SHALL display a victory screen when the AI's HP reaches 0. The screen SHALL show "HUMANITY WINS" in large text, colored blocks for each player who participated, and prompt to restart with R key.

#### Scenario: Victory with multiple participants
- **WHEN** the AI is defeated after 6 players participated
- **THEN** "HUMANITY WINS" displays with 6 colored indicators and "PRESS R TO RESTART"

### Requirement: All text uses Press Start 2P font
All text rendered on the canvas (health bar label, HP counter, victory text, restart prompt) SHALL use the "Press Start 2P" font family.

#### Scenario: Font applied to canvas text
- **WHEN** any text is drawn on the canvas via fillText
- **THEN** the canvas context font property includes "Press Start 2P"

### Requirement: Black background
The canvas SHALL be cleared to solid black (#000000) each frame before rendering entities.

#### Scenario: Frame clear
- **WHEN** a render frame begins
- **THEN** the entire 800x600 canvas is filled with black
