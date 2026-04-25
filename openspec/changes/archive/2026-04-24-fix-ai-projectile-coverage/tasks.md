## 1. Bullet Entity

- [x] 1.1 Update `createAiBullet` in `src/game/entities/bullet.js` to accept `targetX` parameter and compute `vx` from horizontal distance / vertical travel time
- [x] 1.2 Add `vx` property to the returned AI bullet object

## 2. Movement System

- [x] 2.1 Update `updateAiBrain` in `src/game/systems/movement.js` to pass a random `targetX` (uniform in `[0, CANVAS_W]`) when calling `createAiBullet`
- [x] 2.2 Update `updateAiBullets` to apply `b.vx * dt` to `b.x` each frame alongside the existing `b.y += b.speed * dt`

## 3. Verification

- [x] 3.1 Build passes with no errors
- [x] 3.2 Visually confirm bullets spread across entire canvas width — no safe zone at center
