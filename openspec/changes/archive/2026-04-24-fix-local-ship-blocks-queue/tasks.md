## 1. Fix promotion logic

- [x] 1.1 In `src/hooks/useHostPlayers.js` `promoteFromQueue`: change `playingCount` to exclude `__local__` — `Object.keys(state.ships).filter(id => id !== '__local__').length`
- [x] 1.2 In the promotion loop, after creating a remote ship, delete `state.ships['__local__']` if it exists

## 2. Verification

- [x] 2.1 `npx vite build` passes
