## Why

AI projectiles travel in fixed vertical columns from the four arm positions (x=295, 365, 435, 505), leaving a permanent 64px safe zone at the center of the canvas (x=368–432). A player can survive indefinitely by staying still at the default spawn position. This makes the game trivial and eliminates challenge.

## What Changes

- Add random horizontal velocity (`vx`) to AI projectiles so they travel at angled trajectories instead of straight down
- Each bullet targets a random X position at the bottom of the canvas, producing uniform coverage across the full play area
- Update AI bullet movement to apply both `vx` and `vy` per frame
- Update AI bullet rendering to remain compatible with the angled trajectory

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `ai-boss`: AI projectile trajectories change from fixed vertical columns to randomized angled paths with uniform horizontal distribution

## Impact

- **Files changed**: `src/game/entities/bullet.js` (add `vx` to AI bullet factory), `src/game/systems/movement.js` (apply `vx` in AI bullet update)
- **Gameplay**: Difficulty increases — no safe spots. Game balance may need minor fire-rate tuning.
- **No new dependencies.**
