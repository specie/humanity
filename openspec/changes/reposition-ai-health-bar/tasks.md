## 1. Reposition elements

- [x] 1.1 In `src/game/systems/render.js`: change `HEALTH_BAR_Y` from 130 to 22, adjust label y to `HEALTH_BAR_Y - 6` and counter y to `HEALTH_BAR_Y + HEALTH_BAR_H + 14` (these are relative, so they follow automatically)
- [x] 1.2 In `src/game/entities/brain.js`: change brain `y` from 60 to 100

## 2. Verification

- [x] 2.1 `npx vite build` passes
