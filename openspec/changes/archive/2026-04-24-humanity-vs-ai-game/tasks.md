## 1. Project Scaffold

- [x] 1.1 Initialize Vite + React project with `npm create vite@latest` (or manually create package.json, vite.config.js, index.html)
- [x] 1.2 Install dependencies: react, react-dom, tailwindcss, and configure Tailwind
- [x] 1.3 Add Press Start 2P font via Google Fonts `<link>` in index.html
- [x] 1.4 Create base App component that renders the GameCanvas component centered on a dark page
- [x] 1.5 Verify `npm run dev` starts and shows an empty canvas (800x600, black background)

## 2. Game Loop & Core State

- [x] 2.1 Create `src/game/gameLoop.js` — rAF loop with delta-time calculation (capped at 50ms), update and render phases
- [x] 2.2 Create initial game state object factory in `src/game/state.js` with all entity collections and flags
- [x] 2.3 Wire GameCanvas component: get canvas ref, init state, start loop on mount, cancel on unmount
- [x] 2.4 Implement keyboard input tracking (keydown/keyup listeners for ArrowLeft, ArrowRight, Space, R) stored in state

## 3. Entities

- [x] 3.1 Create `src/game/entities/ship.js` — factory for player ship state (position, size, alive, invulnerable, respawnTimer)
- [x] 3.2 Create `src/game/entities/brain.js` — factory for AI brain state (position, size, hp, arm positions, fire timers)
- [x] 3.3 Create `src/game/entities/bullet.js` — factory functions for player bullets (yellow, upward) and AI bullets (red, downward)

## 4. Starfield Background

- [x] 4.1 Create `src/game/entities/stars.js` — generate array of random star positions on init
- [x] 4.2 Add star movement logic in movement system: scroll down, wrap to top with new random x
- [x] 4.3 Add star rendering: small white 1-2px rectangles drawn after background clear, before entities

## 5. Player Ship Systems

- [x] 5.1 Implement ship movement system: read input state, move left/right at constant speed, clamp to canvas bounds
- [x] 5.2 Implement ship shooting: on Space pressed + cooldown elapsed (250ms), spawn player bullet at ship position
- [x] 5.3 Implement ship rendering: draw pixel-art ship shape at current position
- [x] 5.4 Implement death system: set alive=false on collision, start 1s respawn timer
- [x] 5.5 Implement respawn: after timer, reset position to center-bottom, set invulnerable=true with 2s timer
- [x] 5.6 Implement invulnerability: blink effect (toggle visibility every ~100ms), skip collision checks during invulnerability

## 6. AI Boss Systems

- [x] 6.1 Implement brain rendering: draw pixel-art digital brain with four robotic arms at top-center
- [x] 6.2 Implement arm firing system: each arm fires a red circular projectile downward at regular intervals (staggered timing)
- [x] 6.3 Implement AI bullet movement: move downward at constant speed, remove when y > 600

## 7. Collision Detection

- [x] 7.1 Implement AABB collision utility function in `src/game/systems/collision.js`
- [x] 7.2 Add player-bullet → AI-brain collision: on hit, remove bullet, reduce AI HP by 10
- [x] 7.3 Add AI-bullet → player-ship collision: on hit (if not invulnerable), trigger player death

## 8. Game UI & Victory

- [x] 8.1 Render AI health bar: centered below brain, 60% canvas width, filled proportionally, "AI INTEGRITY" label + numeric HP counter in Press Start 2P
- [x] 8.2 Implement victory state: when AI HP reaches 0, set gameOver flag, stop spawning/moving entities
- [x] 8.3 Render victory screen: "HUMANITY WINS" large centered text + "PRESS R TO RESTART" below
- [x] 8.4 Implement restart: on R key during victory state, reset all game state to initial values

## 9. Polish & Integration

- [x] 9.1 Tune game balance: AI fire rate, bullet speeds, arm spread pattern, timing feels good
- [x] 9.2 Ensure render order: clear black → stars → AI brain + arms → health bar → player ship → bullets → UI overlays
- [x] 9.3 Verify full gameplay loop: start → fight → die → respawn → win → restart
