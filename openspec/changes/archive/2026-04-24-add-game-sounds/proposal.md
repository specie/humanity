## Why

The game has no audio feedback. Sound effects are essential for arcade game feel — they reinforce actions (shooting, hitting) and create emotional peaks (death, victory). Using synthesized 8-bit chiptune sounds matches the pixel art aesthetic and requires zero external audio assets.

## What Changes

- New `src/game/audio.js` module with 6 synthesized sound functions using Web Audio API oscillators
- Lazy AudioContext initialization (created on first user interaction)
- Global mute flag checked by all sound functions
- Sound triggers integrated into movement system (shoot), collision system (hit, death), and game loop (victory)
- Mute toggle button added to AdminPanel ("SOUND ON" / "SOUND OFF")

## Capabilities

### New Capabilities

- `game-audio`: Synthesized 8-bit sound effects for game events (shoot, hit, death, victory) using Web Audio API, with global mute toggle

### Modified Capabilities

- `admin-panel`: Adding a mute toggle button next to the existing + button

## Impact

- New file: `src/game/audio.js`
- Modified: `src/game/systems/movement.js` (shoot triggers)
- Modified: `src/game/systems/collision.js` (hit/death triggers)
- Modified: `src/game/gameLoop.js` (victory trigger)
- Modified: `src/AdminPanel.jsx` (mute toggle)
- No new dependencies (Web Audio API is native)
