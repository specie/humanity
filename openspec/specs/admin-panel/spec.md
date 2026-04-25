### Requirement: Admin panel displays below canvas
The host page SHALL render an admin panel below the game canvas. The panel SHALL display the current `maxPlayers` value with the label "Active pilots" and a + button.

#### Scenario: Panel renders
- **WHEN** the host page loads
- **THEN** an admin panel appears below the canvas showing "Active pilots" and the current value

### Requirement: Plus button increments maxPlayers
The + button SHALL increment `config/maxPlayers` in Firebase by 1 when pressed. The button SHALL be disabled when maxPlayers reaches 12.

#### Scenario: Increment
- **WHEN** the admin clicks + and maxPlayers is less than 12
- **THEN** `config/maxPlayers` increases by 1 in Firebase

#### Scenario: Maximum reached
- **WHEN** maxPlayers is 12
- **THEN** the + button is visually disabled and clicking it has no effect

### Requirement: Admin panel uses Press Start 2P font
The admin panel text and button SHALL use the "Press Start 2P" font family, consistent with the game aesthetic.

#### Scenario: Font consistency
- **WHEN** the admin panel renders
- **THEN** all text uses "Press Start 2P" font

### Requirement: Sound mute toggle button
The admin panel SHALL include a toggle button that displays "SOUND ON" or "SOUND OFF" based on the current mute state. Clicking the button SHALL toggle the global mute flag via the audio module's `setMuted()` function. Sound SHALL be ON by default.

#### Scenario: Toggle mute on
- **WHEN** the user clicks the sound button while it shows "SOUND ON"
- **THEN** the button shows "SOUND OFF" and all game sounds are silenced

#### Scenario: Toggle mute off
- **WHEN** the user clicks the sound button while it shows "SOUND OFF"
- **THEN** the button shows "SOUND ON" and game sounds resume
