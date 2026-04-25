## ADDED Requirements

### Requirement: Sound mute toggle button
The admin panel SHALL include a toggle button that displays "SOUND ON" or "SOUND OFF" based on the current mute state. Clicking the button SHALL toggle the global mute flag via the audio module's `setMuted()` function. Sound SHALL be ON by default.

#### Scenario: Toggle mute on
- **WHEN** the user clicks the sound button while it shows "SOUND ON"
- **THEN** the button shows "SOUND OFF" and all game sounds are silenced

#### Scenario: Toggle mute off
- **WHEN** the user clicks the sound button while it shows "SOUND OFF"
- **THEN** the button shows "SOUND ON" and game sounds resume
