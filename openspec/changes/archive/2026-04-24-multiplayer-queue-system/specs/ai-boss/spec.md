## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Victory screen shows all participant colors
When the AI is defeated, the victory screen SHALL display "HUMANITY WINS" along with the colors of ALL players who participated in the game (anyone who was "playing" at any point), rendered as colored blocks or symbols.

#### Scenario: Multi-player victory
- **WHEN** the AI is defeated and 5 players participated over the course of the game
- **THEN** the victory screen shows "HUMANITY WINS" with 5 colored indicators representing each participant
