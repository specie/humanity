### Requirement: Lazy AudioContext initialization
The audio module SHALL create a single global AudioContext on the first call to any sound function. If the context is in "suspended" state, it SHALL be resumed. The module SHALL NOT create the AudioContext at import time.

#### Scenario: First sound triggers context creation
- **WHEN** any sound function is called for the first time
- **THEN** an AudioContext is created and reused for all subsequent calls

#### Scenario: Suspended context is resumed
- **WHEN** a sound function is called and the AudioContext is suspended
- **THEN** the context is resumed before playing the sound

### Requirement: Global mute control
The audio module SHALL export `setMuted(bool)` and `isMuted()` functions. When muted is true, all sound functions SHALL return immediately without creating any audio nodes.

#### Scenario: Mute enabled
- **WHEN** `setMuted(true)` is called and then any sound function is called
- **THEN** no sound is produced

#### Scenario: Mute disabled
- **WHEN** `setMuted(false)` is called after being muted
- **THEN** sound functions produce audio again

### Requirement: playerShoot sound
The module SHALL export a `playerShoot(volume?)` function that plays a short high-pitched pulse: square wave at ~880 Hz for 50 ms, with fast attack and exponential decay via GainNode. Default volume 0.3.

#### Scenario: Player fires
- **WHEN** a player's ship fires a bullet
- **THEN** a short high-pitched square wave blip plays

### Requirement: playerHit sound
The module SHALL export a `playerHit(volume?)` function that plays a descending noise: sawtooth wave sweeping from 200 Hz to 50 Hz over 200 ms, with exponential decay. Default volume 0.3.

#### Scenario: Player ship destroyed
- **WHEN** an AI bullet hits a player ship
- **THEN** a short descending sawtooth sound plays

### Requirement: enemyShoot sound
The module SHALL export an `enemyShoot(volume?)` function that plays a low-pitched pulse: square wave at ~220 Hz for 80 ms, with exponential decay. Default volume 0.3.

#### Scenario: AI arm fires
- **WHEN** an AI brain arm fires a projectile
- **THEN** a short low-pitched square wave blip plays

### Requirement: aiHit sound
The module SHALL export an `aiHit(volume?)` function that plays a metallic click: square wave at 1200 Hz for 30 ms, with fast decay. Default volume 0.3.

#### Scenario: Player bullet hits AI
- **WHEN** a player bullet collides with the AI brain
- **THEN** a short metallic click sound plays

### Requirement: aiDeath sound
The module SHALL export an `aiDeath(volume?)` function that plays a long descending sequence: sawtooth wave sweeping from 800 Hz to 100 Hz over 1.5 seconds, with slow decay. Default volume 0.3.

#### Scenario: AI brain destroyed
- **WHEN** the AI brain's HP reaches 0
- **THEN** a long descending sawtooth sweep plays

### Requirement: victory sound
The module SHALL export a `victory(volume?)` function that plays an ascending arpeggio: 3 square wave notes at 523 Hz, 659 Hz, 784 Hz, each 150 ms duration, played sequentially. Default volume 0.3.

#### Scenario: Humanity wins
- **WHEN** the victory state is triggered
- **THEN** a 3-note ascending arpeggio plays

### Requirement: Envelope shaping
All sound functions SHALL use a GainNode with fast attack (immediate or near-immediate ramp to peak) and exponential decay to zero. Sounds SHALL NOT be flat-pitched beeps.

#### Scenario: Sound has envelope
- **WHEN** any sound function plays
- **THEN** the volume ramps up quickly and decays exponentially, not a flat on/off
