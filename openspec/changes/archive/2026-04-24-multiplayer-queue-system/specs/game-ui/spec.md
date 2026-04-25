## MODIFIED Requirements

### Requirement: AI health bar displays below brain
The system SHALL render a horizontal health bar below the AI brain. The bar SHALL show "AI INTEGRITY" text and a numeric counter showing current/max HP (where max is `maxPlayers × 1000`).

#### Scenario: Health bar with scaled max
- **WHEN** maxPlayers is 3 and AI HP is 2250/3000
- **THEN** the health bar shows 75% filled with "2250 / 3000"

### Requirement: Victory screen on AI defeat
The system SHALL display a victory screen when the AI's HP reaches 0. The screen SHALL show "HUMANITY WINS" in large text, colored blocks for each player who participated, and prompt to restart with R key.

#### Scenario: Victory with multiple participants
- **WHEN** the AI is defeated after 6 players participated
- **THEN** "HUMANITY WINS" displays with 6 colored indicators and "PRESS R TO RESTART"
