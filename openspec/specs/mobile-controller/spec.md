### Requirement: Full-viewport portrait layout
The mobile controller SHALL occupy the entire viewport in portrait orientation. The page SHALL prevent pinch-zoom via meta viewport tag, and prevent overscroll and text selection via CSS (`touch-action: manipulation`, `user-select: none`, `overscroll-behavior: none`).

#### Scenario: Viewport fills screen
- **WHEN** a user opens `/play` on a mobile device
- **THEN** the controller UI fills the entire viewport with no scrolling, zooming, or text selection possible

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

### Requirement: Haptic feedback on button press
The controller SHALL call `navigator.vibrate(20)` when any button is pressed (touchstart). If the Vibration API is not available, the call SHALL be silently skipped.

#### Scenario: Vibration on press
- **WHEN** the user touches any control button on a device that supports vibration
- **THEN** the device vibrates for 20ms

#### Scenario: No vibration support
- **WHEN** the user touches a button on a device without vibration support
- **THEN** no error occurs and the button functions normally

### Requirement: Visual pressed state
Each button SHALL display a lighter background color while the user's finger is touching it (active/pressed state). The visual state SHALL revert when the finger is lifted.

#### Scenario: Button visual feedback
- **WHEN** the user is touching a button
- **THEN** the button's background becomes visibly lighter than its default state

#### Scenario: Button release visual
- **WHEN** the user lifts their finger
- **THEN** the button returns to its default visual state

### Requirement: Input writes only on change
The controller SHALL only write to Firebase when the input state actually changes (boolean value differs from the last written value). This prevents unnecessary writes during sustained holds.

#### Scenario: Sustained hold
- **WHEN** the user holds the left button continuously
- **THEN** only one Firebase write occurs (on touchstart), not repeated writes

#### Scenario: State change triggers write
- **WHEN** the user releases a button (changing a boolean from true to false)
- **THEN** a single Firebase write updates the input object
