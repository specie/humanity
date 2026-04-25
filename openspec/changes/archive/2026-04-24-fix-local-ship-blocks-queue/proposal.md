## Why

When Firebase is configured and `maxPlayers=1`, the first remote player that connects stays stuck in "queued" forever. The `__local__` keyboard ship counts against `maxPlayers` in `promoteFromQueue`, creating a deadlock: `__local__` blocks promotion, and promotion is needed to trigger `__local__` removal.

## What Changes

- `promoteFromQueue` in `useHostPlayers.js` will exclude the `__local__` ship from the playing count so remote players can be promoted into available slots
- When a remote player is promoted, `__local__` is immediately removed from `state.ships` instead of waiting for the 500ms interval in GameCanvas

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `player-connection`: The queue promotion logic must not count the local keyboard fallback ship against maxPlayers

## Impact

- `src/hooks/useHostPlayers.js` — `promoteFromQueue` function
