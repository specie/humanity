## 1. Color Palette & Constants

- [x] 1.1 Create `src/game/constants.js` with `PILOT_COLORS` array (12 hex colors) and `MAX_PLAYERS = 12`, `LANE_COUNT = 4`, lane Y positions
- [x] 1.2 Create `src/game/colors.js` with `getFirstFreeColor(activePlayers)` utility that returns the first palette color not used by any active player

## 2. Game State Refactor

- [x] 2.1 Refactor `src/game/state.js`: replace `ship` with `ships: {}` (map by playerId), add `remoteInputs: {}`, `maxPlayers: 1`, `participantColors: []` (tracks all colors that played), remove single `remoteInput`/`activePlayerId`
- [x] 2.2 Update `src/game/entities/ship.js`: add `playerId`, `color`, `lane` fields to ship factory; add `createMultiShip(playerId, color, lane, laneY)` function with random X position
- [x] 2.3 Update `src/game/entities/bullet.js`: add `color` field to `createPlayerBullet` for tinted bullets
- [x] 2.4 Update `src/game/gameLoop.js` resetState: reset `ships`, `remoteInputs`, `maxPlayers`, `participantColors`

## 3. Lane Distribution

- [x] 3.1 Create `src/game/lanes.js` with `assignLane(ships, lanePositions)` function — returns the lane index with fewest active ships, tie-break by highest Y (closest to bottom)

## 4. Movement System Refactor

- [x] 4.1 Refactor `updateShip` in `src/game/systems/movement.js` to `updateShips` — iterate `state.ships`, read input from `state.remoteInputs[ship.playerId]` or `state.keys` for local player
- [x] 4.2 Each ship gets its own `lastShotTime` field for independent fire cooldowns
- [x] 4.3 Remove invulnerability/blink/respawn logic from movement system (death is permanent)

## 5. Collision System Refactor

- [x] 5.1 Update `src/game/systems/collision.js`: iterate ALL player bullets from ALL ships against AI brain
- [x] 5.2 Update AI bullet vs player: check against ALL ships in `state.ships`; on hit, mark ship for removal and collect dead player IDs
- [x] 5.3 Return list of dead player IDs from collision update so the host can process deaths

## 6. Render System Refactor

- [x] 6.1 Update `renderShip` in `src/game/systems/render.js` to `renderShips` — iterate all ships, tint each with its `color`
- [x] 6.2 Update `renderPlayerBullets` to use each bullet's `color` field instead of fixed yellow
- [x] 6.3 Update health bar to show `brain.hp / brain.maxHp` where maxHp = `maxPlayers × 1000`
- [x] 6.4 Update victory screen: show "HUMANITY WINS" + colored blocks for each entry in `state.participantColors`

## 7. Queue System (Host-Side)

- [x] 7.1 Rewrite `src/hooks/useHostPlayers.js`: listen to `players/` and `config/maxPlayers`; maintain queue state with promotion logic
- [x] 7.2 Implement promotion: on queue change or maxPlayers change, promote oldest "queued" player to "playing" — assign color, create ship in game state, set up input listener, write status + color + queuePosition to Firebase
- [x] 7.3 Implement death handling: when collision returns dead player IDs, set player status to "dead" in Firebase, release color, delete ship from `state.ships`, cleanup input listener, re-queue with new joinedAt
- [x] 7.4 Implement disconnect handling: on player node removal, release ship/color/slot, promote next queued
- [x] 7.5 Write queue positions to Firebase for all "queued" players whenever queue changes
- [x] 7.6 On victory, write "gameover" status to all connected players

## 8. Admin Panel

- [x] 8.1 Create `src/AdminPanel.jsx` — shows "Active pilots: N" and + button, reads/writes `config/maxPlayers` from Firebase
- [x] 8.2 Disable + button at maxPlayers = 12
- [x] 8.3 Style with Press Start 2P font, dark theme, positioned below canvas

## 9. AI HP Scaling

- [x] 9.1 Update brain entity: `maxHp` derived from `maxPlayers × 1000`
- [x] 9.2 In host hook or game loop: when maxPlayers changes, recalculate `brain.maxHp` and adjust `brain.hp` to preserve percentage
- [x] 9.3 Ensure health bar and collision system use `brain.maxHp` correctly

## 10. GameCanvas Integration

- [x] 10.1 Update `GameCanvas.jsx`: pass game state ref to refactored `useHostPlayers`, render `AdminPanel` below canvas
- [x] 10.2 Wire death callback: pass dead player IDs from collision system to host hook for Firebase status updates
- [x] 10.3 Keyboard fallback: when `Object.keys(state.ships).length === 0` or only local player, create `__local__` ship driven by keyboard

## 11. Mobile Controller Updates

- [x] 11.1 Update `usePlayerConnection.js`: register with `status: "queued"` and `joinedAt` timestamp; listen for `status`, `color`, `queuePosition` changes
- [x] 11.2 Update `MobileController.jsx` banner: background = assigned color when playing, gray when queued/dead
- [x] 11.3 Update status indicator: "QUEUE POSITION #N" / "FLY" / "ELIMINATED + QUEUE POSITION #N" based on status
- [x] 11.4 Disable buttons (reduced opacity, no touch response) when status is not "playing"

## 12. Verification

- [x] 12.1 Build passes with no errors
- [ ] 12.2 Test single keyboard player: ship renders and controls work with no Firebase players
- [ ] 12.3 Test multi-player flow: multiple /play clients connect, queue, get promoted, play, die, re-queue
- [ ] 12.4 Test admin panel: increment maxPlayers, verify promotion happens immediately
- [ ] 12.5 Test AI HP scaling: increase maxPlayers, verify HP percentage is preserved
- [ ] 12.6 Test victory: defeat AI, verify all participant colors shown on victory screen
