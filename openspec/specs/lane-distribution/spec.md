### Requirement: Four invisible horizontal lanes
The system SHALL define 4 horizontal lanes in the lower portion of the canvas for ship placement. Lanes SHALL be invisible to players.

#### Scenario: Lane positions
- **WHEN** the game initializes
- **THEN** 4 lanes exist at distinct Y positions in the bottom area of the canvas

### Requirement: Least-occupied lane assignment
When a new ship spawns, it SHALL be assigned to the lane with the fewest currently active ships. Ties SHALL be broken by choosing the lane closest to the bottom.

#### Scenario: Even distribution
- **WHEN** 4 ships are spawned sequentially
- **THEN** each ship is placed in a different lane

#### Scenario: Tie-breaking
- **WHEN** two lanes have the same number of ships
- **THEN** the lane closest to the bottom is chosen

### Requirement: Random X within lane
A new ship's X position SHALL be random within the canvas width bounds (respecting ship width margins).

#### Scenario: Random horizontal placement
- **WHEN** a ship spawns in a lane
- **THEN** its X position is random within valid canvas bounds
