## Context

AI bullets currently have only a vertical speed (`speed: 0.25` px/ms downward). They spawn at the fixed arm X positions and fall straight down, creating four predictable columns with gaps between them — most critically a ~64px gap at the center where the player spawns.

## Goals / Non-Goals

**Goals:**
- Eliminate safe zones by giving AI bullets randomized angled trajectories
- Achieve uniform horizontal distribution of bullet impact points across the full canvas width
- Keep the visual feel of bullets "coming from" the brain arms

**Non-Goals:**
- Homing or player-tracking projectiles
- Changing the number of arms or fire rate
- Adding new bullet visual types

## Decisions

### D1: Random target-X approach for trajectory calculation
**Choice**: When an arm fires, pick a random target X in `[0, CANVAS_W]`. Calculate `vx` from the horizontal distance divided by the vertical travel time (distance to bottom / `vy`).
**Rationale**: This guarantees uniform distribution of impact points along the X axis at the bottom of the screen. The bullet visually originates from the arm but angles toward a random destination.
**Alternative considered**: Random `vx` from a uniform range — harder to reason about impact distribution, bullets could cluster or miss the edges.

### D2: Add `vx` property to AI bullet entity
**Choice**: Extend `createAiBullet(x, y)` to `createAiBullet(x, y, targetX)` and compute `vx` inside the factory. The movement system applies `vx * dt` each frame alongside the existing `vy * dt`.
**Rationale**: Minimal change — only the bullet factory and one line in the movement update need modification. No structural changes.

## Risks / Trade-offs

- **[Extreme angles at edges]** → Outer arms targeting the opposite edge could produce nearly-horizontal bullets that linger on screen. Mitigation: the vertical speed is fixed, so travel time is bounded; bullets still exit the bottom in ~2.4s max.
- **[Difficulty spike]** → No safe spots means the game is harder. Acceptable — this is the intended behavior per the original spec.
