## MODIFIED Requirements

### Requirement: Pilot banner
The top banner SHALL display "PILOT" text. The background color SHALL be the player's assigned color when status is "playing", or gray (#666) when status is "queued" or "dead".

#### Scenario: Playing state banner
- **WHEN** the player's status is "playing" with assigned color cyan
- **THEN** the banner background is cyan

#### Scenario: Queued/dead state banner
- **WHEN** the player's status is "queued" or "dead"
- **THEN** the banner background is gray (#666)

### Requirement: Status indicator
The middle area SHALL display the current status based on the player's state:
- "queued": "QUEUE POSITION #N" where N is the player's 1-based queue position
- "playing": "FLY"
- "dead": "ELIMINATED" on the first line, "QUEUE POSITION #N" on the second line (player is auto re-queued)

#### Scenario: Queued status
- **WHEN** the player's status is "queued" with queuePosition 3
- **THEN** the status shows "QUEUE POSITION #3"

#### Scenario: Playing status
- **WHEN** the player's status is "playing"
- **THEN** the status shows "FLY"

#### Scenario: Dead status
- **WHEN** the player's status is "dead" and re-queued at position 5
- **THEN** the status shows "ELIMINATED" and "QUEUE POSITION #5"

### Requirement: Three touch control buttons
The bottom third SHALL display three large buttons. Buttons SHALL only be functional when the player's status is "playing". When status is "queued" or "dead", buttons SHALL appear visually dimmed (opacity reduced) and SHALL NOT respond to touch events.

#### Scenario: Buttons active when playing
- **WHEN** the player's status is "playing" and they touch a button
- **THEN** the button responds normally with input write and haptic feedback

#### Scenario: Buttons disabled when not playing
- **WHEN** the player's status is "queued" or "dead" and they touch a button
- **THEN** no input is written and no haptic feedback occurs
