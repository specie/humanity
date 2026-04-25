## Context

Currently: health bar at y=130 (below brain at y=60). The health bar looks attached to the brain entity rather than being a standalone game HUD element.

Target layout (top to bottom):
- y=10: "AI INTEGRITY" label
- y=22: Health bar (16px tall)
- y=50: HP counter text
- ~30px margin
- y=100: Brain center (was 60)
- y=140-150: Arm tips (adjusted from y+40/y+50)

## Goals / Non-Goals

**Goals:**
- Health bar at the very top as a HUD scoreboard
- Brain pushed down with clear visual separation from the bar

**Non-Goals:**
- Changing health bar width, colors, or logic
- Changing brain appearance or arm firing behavior

## Decisions

1. **HEALTH_BAR_Y = 22** (was 130) — puts the bar near the top of the canvas with room for the label above it
2. **Brain y = 100** (was 60) — creates ~50px gap between HP counter and brain body
3. **Arm positions stay relative to brain y** — no formula change needed, they already use `y + 40` / `y + 50`

## Risks / Trade-offs

- [Minimal] Moving the brain down reduces vertical play area slightly → acceptable since ships are at y=520-595 and there's plenty of space
