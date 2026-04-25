## ADDED Requirements

### Requirement: Fixed 12-color high-contrast palette
The system SHALL define a palette of exactly 12 colors: neon green (#39FF14), cyan (#00FFFF), magenta (#FF00FF), yellow (#FFE800), orange (#FF8C00), violet (#8B5CF6), pink (#FF69B4), red (#FF2222), sky blue (#87CEEB), lime (#BFFF00), coral (#FF6F61), lavender (#B497FF).

#### Scenario: Palette definition
- **WHEN** the color assignment system is initialized
- **THEN** all 12 colors are available in the defined order

### Requirement: Color assigned on promotion to playing
When a player is promoted from "queued" to "playing", the system SHALL assign them the first color in the palette not currently used by any other "playing" player. The color SHALL be written to `players/{playerId}/color`.

#### Scenario: First player gets first color
- **WHEN** the first player is promoted and no colors are in use
- **THEN** they receive neon green (#39FF14)

#### Scenario: Color avoids duplicates
- **WHEN** a player is promoted while other players are active with colors assigned
- **THEN** the promoted player receives the first palette color not used by any active player

### Requirement: Color released on death
When a player dies, their color SHALL be returned to the available pool. The next promoted player MAY receive that same color.

#### Scenario: Color recycling
- **WHEN** a player with color cyan dies and a new player is promoted
- **THEN** cyan is available for assignment to the new player (if it's the first free color)
