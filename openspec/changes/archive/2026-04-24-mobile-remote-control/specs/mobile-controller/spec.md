## ADDED Requirements

### Requirement: Full-viewport portrait layout
The mobile controller SHALL occupy the entire viewport in portrait orientation. The page SHALL prevent pinch-zoom via meta viewport tag, and prevent overscroll and text selection via CSS (`touch-action: manipulation`, `user-select: none`, `overscroll-behavior: none`).

#### Scenario: Viewport fills screen
- **WHEN** a user opens `/play` on a mobile device
- **THEN** the controller UI fills the entire viewport with no scrolling, zooming, or text selection possible

### Requirement: Pilot banner
The top area of the controller SHALL display a banner with the text "PILOT" and a neon green background color (#39FF14) as the player's assigned color.

#### Scenario: Banner display
- **WHEN** the controller is rendered
- **THEN** a banner at the top shows "PILOT" text on a neon green background

### Requirement: Status indicator
The middle area SHALL display the current connection status. Valid statuses are: "CONNECTED", "CONTROLLING", "WAITING", and "GAME OVER".

#### Scenario: Initial connection
- **WHEN** the controller first connects to Firebase
- **THEN** the status shows "CONNECTED"

#### Scenario: Player becomes active controller
- **WHEN** the host assigns this player as the active controller
- **THEN** the status changes to "CONTROLLING"

#### Scenario: Player is queued
- **WHEN** another player is already controlling and this player connects
- **THEN** the status shows "WAITING"

### Requirement: Three touch control buttons
The bottom third of the controller SHALL display three large buttons in a row: left arrow, fire (center, red), right arrow. Buttons SHALL respond to `touchstart` and `touchend` events, not `click`.

#### Scenario: Left button pressed
- **WHEN** the user touches the left arrow button
- **THEN** the `left` input boolean is set to true in Firebase

#### Scenario: Left button released
- **WHEN** the user lifts their finger from the left arrow button
- **THEN** the `left` input boolean is set to false in Firebase

#### Scenario: Fire button pressed
- **WHEN** the user touches the fire button
- **THEN** the `fire` input boolean is set to true in Firebase

#### Scenario: Right button operation
- **WHEN** the user touches and releases the right arrow button
- **THEN** the `right` input boolean toggles between true and false in Firebase accordingly

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
