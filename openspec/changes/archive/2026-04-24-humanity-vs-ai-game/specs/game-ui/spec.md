## ADDED Requirements

### Requirement: AI health bar displays below brain
The system SHALL render a horizontal health bar below the AI brain that occupies 60% of the canvas width, centered horizontally. The bar SHALL show "AI INTEGRITY" text and a numeric HP counter.

#### Scenario: Health bar at full HP
- **WHEN** the AI has 1000/1000 HP
- **THEN** the health bar is fully filled, displays "AI INTEGRITY" label and "1000/1000"

#### Scenario: Health bar decreases with damage
- **WHEN** the AI takes damage reducing HP to 500
- **THEN** the health bar fill reduces to 50% and displays "500/1000"

#### Scenario: Health bar positioning
- **WHEN** the game is rendering
- **THEN** the health bar is centered horizontally below the AI brain, spanning 60% of the 800px canvas width (480px)

### Requirement: Victory screen on AI defeat
The system SHALL display a victory screen when the AI's HP reaches 0. The screen SHALL show "HUMANITY WINS" in large text and prompt to restart with R key.

#### Scenario: Victory screen appears
- **WHEN** the AI HP reaches 0
- **THEN** the game renders "HUMANITY WINS" in large centered text

#### Scenario: Restart prompt shown
- **WHEN** the victory screen is displayed
- **THEN** the text "PRESS R TO RESTART" appears below the victory message

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
