## Why

The AI health bar currently renders below the brain (y=130), visually attached to the boss entity. It should look like a game HUD element at the top of the screen, separate from the brain. The brain itself needs to move down slightly so there's a clear margin between the health bar and the boss.

## What Changes

- Move health bar to the top of the canvas (y ~20), rendered as a HUD scoreboard element above everything
- Move brain entity down (y from 60 to ~100) so there's visible space between the health bar and the brain
- Adjust arm positions accordingly (they're relative to brain y)

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `game-ui`: Health bar position changes from below brain to top of canvas
- `ai-boss`: Brain y position moves down to create margin below the health bar

## Impact

- `src/game/systems/render.js` — HEALTH_BAR_Y constant
- `src/game/entities/brain.js` — brain y position and arm y positions
