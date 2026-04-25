## Why

Create a vintage arcade game "Humanity vs AI" as the core interactive experience for this project. The game provides an engaging pixel-art shooter where the player fights against a malevolent AI overlord — a thematic and entertaining product that showcases canvas-based game development with a modern React+Vite stack.

## What Changes

- Add a complete 2D arcade game rendered on an 800x600 native canvas with pixel art aesthetics and Press Start 2P font
- Implement AI boss entity: a floating digital brain with four robotic arms that fires red projectile patterns downward
- Implement player ship entity at the bottom of the screen with keyboard controls (arrow keys + spacebar)
- Add health system for the AI boss (1000 HP, -10 per hit) with a visible "AI INTEGRITY" health bar
- Add player death/respawn system: instant death on hit, 1s respawn delay, 2s invulnerability with blink effect
- Add scrolling starfield background for movement sensation
- Add victory screen ("HUMANITY WINS") with restart capability (R key)
- Structure game code in modular architecture: entities, systems, and game loop — all using mutable JS state and requestAnimationFrame for performance
- Set up React + Vite + Tailwind project scaffold (Firebase Realtime Database planned but not connected yet)

## Capabilities

### New Capabilities
- `game-core`: Game loop, canvas rendering, state management, and requestAnimationFrame lifecycle
- `player-ship`: Player entity with keyboard movement, shooting mechanics (250ms cooldown), death/respawn/invulnerability
- `ai-boss`: AI brain entity with robotic arms, projectile firing patterns, and 1000 HP health system with UI bar
- `collision-detection`: Bounding-box collision between player bullets and AI boss, and AI bullets and player ship
- `game-ui`: HUD elements (AI health bar, victory screen, restart prompt), pixel art styling, Press Start 2P font
- `starfield-background`: Scrolling star particles for parallax movement effect

### Modified Capabilities

_None — this is a greenfield project._

## Impact

- **New files**: Project scaffold (Vite config, Tailwind config, index.html), React entry point, GameCanvas component, entity modules (brain, ship, bullet), system modules (movement, collision, render), game loop module
- **Dependencies**: React, Vite, Tailwind CSS, Press Start 2P font (Google Fonts). No game engine libraries (no Phaser, no PixiJS)
- **APIs**: None yet (Firebase planned for future)
- **Systems**: Runs locally with `npm run dev`
