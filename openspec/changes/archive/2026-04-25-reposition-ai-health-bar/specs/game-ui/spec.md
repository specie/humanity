## MODIFIED Requirements

### Requirement: AI health bar displays below brain
The system SHALL render a horizontal health bar at the top of the canvas as a HUD element, visually separated from the AI brain entity. The bar SHALL show "AI INTEGRITY" text above it and a numeric counter below it showing current/max HP (where max is `maxPlayers × 1000`).

#### Scenario: Health bar at top of canvas
- **WHEN** the game is running
- **THEN** the health bar renders near the top of the canvas, clearly above and separated from the AI brain

#### Scenario: Health bar with scaled max
- **WHEN** maxPlayers is 3 and AI HP is 2250/3000
- **THEN** the health bar shows 75% filled with "2250 / 3000"
