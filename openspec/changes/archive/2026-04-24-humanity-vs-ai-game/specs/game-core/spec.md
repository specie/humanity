## ADDED Requirements

### Requirement: Game loop runs at display refresh rate
The system SHALL use `requestAnimationFrame` to drive a continuous game loop that calls update and render phases each frame.

#### Scenario: Game loop starts on mount
- **WHEN** the GameCanvas component mounts
- **THEN** a requestAnimationFrame loop begins executing update and render each frame

#### Scenario: Game loop stops on unmount
- **WHEN** the GameCanvas component unmounts
- **THEN** the requestAnimationFrame loop is cancelled

### Requirement: Delta-time based updates
The system SHALL calculate delta time between frames and pass it to all update systems. Delta time SHALL be capped at 50ms to prevent entity teleportation after tab backgrounding.

#### Scenario: Normal frame timing
- **WHEN** a frame executes 16ms after the previous frame
- **THEN** all movement and timing systems receive deltaTime = 16ms

#### Scenario: Large gap after tab background
- **WHEN** a frame executes 2000ms after the previous frame (tab was backgrounded)
- **THEN** deltaTime is capped at 50ms

### Requirement: Canvas dimensions are fixed 800x600
The system SHALL render to an HTML5 Canvas element with width=800 and height=600 pixels. The canvas SHALL NOT resize responsively.

#### Scenario: Canvas renders at correct size
- **WHEN** the game is displayed
- **THEN** the canvas element has width 800 and height 600

### Requirement: Mutable game state object
The system SHALL store all game state in a plain JavaScript object that is mutated directly each frame. React useState/useReducer SHALL NOT be used for game state.

#### Scenario: State mutation during update
- **WHEN** the update phase runs
- **THEN** entity positions, health, and flags are mutated directly on the state object without triggering React re-renders

### Requirement: Game can be restarted
The system SHALL reset all game state to initial values when the player presses the R key on the victory screen.

#### Scenario: Restart after victory
- **WHEN** the victory screen is displayed and the player presses R
- **THEN** all game state resets and gameplay begins again
