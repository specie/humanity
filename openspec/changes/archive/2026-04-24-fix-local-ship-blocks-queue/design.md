## Context

The multiplayer queue system uses a `__local__` keyboard ship as a fallback when no remote players are connected. The `promoteFromQueue` function in `useHostPlayers.js` counts all entries in `state.ships` to determine how many slots are occupied — but `__local__` is not a real player and should not consume a slot.

## Goals / Non-Goals

**Goals:**
- Remote players get promoted even when a `__local__` fallback ship exists
- `__local__` ship is removed instantly when a remote player is promoted (no 500ms lag)

**Non-Goals:**
- Changing the `__local__` fallback mechanism itself — the interval in GameCanvas stays as-is

## Decisions

1. **Exclude `__local__` from playing count** — filter it out in `promoteFromQueue` when computing `playingCount`. This is the minimal fix: one line change, no side effects.

2. **Remove `__local__` eagerly on promotion** — inside the promotion loop, delete `state.ships['__local__']` immediately. This avoids a visual glitch where both the local and remote ship exist for up to 500ms.

## Risks / Trade-offs

- [Minimal risk] The GameCanvas interval may briefly re-add `__local__` if the remote player disconnects between interval ticks → existing interval logic already handles this correctly by checking `remoteShips.length`.
