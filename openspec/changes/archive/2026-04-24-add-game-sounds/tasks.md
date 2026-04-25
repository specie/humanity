## 1. Audio Module

- [x] 1.1 Create `src/game/audio.js` with lazy AudioContext init, `setMuted`/`isMuted` exports, and 6 sound functions: `playerShoot`, `playerHit`, `enemyShoot`, `aiHit`, `aiDeath`, `victory`

## 2. Game Integration

- [x] 2.1 In `src/game/systems/movement.js`: call `playerShoot()` when a player fires, call `enemyShoot()` when an AI arm fires
- [x] 2.2 In `src/game/systems/collision.js`: call `aiHit()` on player bullet → brain hit, call `playerHit()` on AI bullet → ship hit, call `aiDeath()` when brain HP reaches 0
- [x] 2.3 In `src/game/gameLoop.js`: call `victory()` when victory is first detected

## 3. Mute Toggle

- [x] 3.1 Update `src/AdminPanel.jsx`: add "SOUND ON" / "SOUND OFF" toggle button that calls `setMuted()`
- [x] 3.2 Add CSS styles for the mute button in `src/index.css`

## 4. Verification

- [x] 4.1 `npx vite build` passes
