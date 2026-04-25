## Context

Greenfield arcade game project. No existing codebase — starting from scratch with React + Vite + Tailwind. The game is a single-screen vertical shooter rendered entirely on a native HTML5 Canvas 2D (800x600). The visual style is pixel art with Press Start 2P font. Firebase Realtime Database is planned for future features (leaderboards, etc.) but is not connected in this phase.

The game architecture must balance React's component model with the performance demands of a 60fps game loop. React owns the DOM mounting; the canvas and game loop run outside React's state system.

## Goals / Non-Goals

**Goals:**
- Playable arcade game at 60fps with smooth keyboard input
- Clean modular architecture: entities, systems, game loop — easy to extend later
- Pixel art aesthetic consistent across all visual elements
- Single-player boss fight experience with clear win condition

**Non-Goals:**
- Firebase integration (deferred)
- Mobile/touch controls
- Sound effects or music
- Multiple levels or enemy types
- Save/load game state
- Responsive canvas scaling (fixed 800x600)

## Decisions

### D1: Mutable game state object instead of React state
**Choice**: Store all game state in a plain JS object mutated directly each frame.
**Rationale**: React's useState/useReducer triggers re-renders, which is incompatible with a 60fps game loop. A mutable state object avoids reconciliation overhead entirely.
**Alternative considered**: useRef to hold state — functionally similar but adds unnecessary indirection for no React benefit.

### D2: Single requestAnimationFrame loop
**Choice**: One rAF loop drives update + render each frame, managed in a `gameLoop.js` module.
**Rationale**: Simplest model. Separate update/render phases within the same frame keep logic clean. Delta-time based movement ensures frame-rate independence.
**Alternative considered**: setInterval for fixed timestep — less smooth, not synced to display refresh.

### D3: Module structure (entities / systems / gameLoop)
**Choice**:
- `entities/` — factory functions that create entity state objects (brain, ship, bullet)
- `systems/` — pure-ish functions that operate on game state each frame (movement, collision, render)
- `gameLoop.js` — orchestrates update order and rAF lifecycle
**Rationale**: Lightweight ECS-inspired pattern without a full ECS framework. Easy to understand, test, and extend.
**Alternative considered**: Full ECS library (bitECS, etc.) — overkill for a single-boss game with few entity types.

### D4: Canvas 2D native drawing (no libraries)
**Choice**: All rendering via CanvasRenderingContext2D methods (fillRect, arc, fillText, strokeRect, etc.).
**Rationale**: User requirement. The visual complexity (geometric shapes, simple text) doesn't warrant a rendering library. Pixel art aesthetic is achievable with basic primitives.

### D5: Bounding box collision
**Choice**: Axis-aligned bounding box (AABB) overlap test for all collision checks.
**Rationale**: Entities are small rectangles/circles. AABB is the simplest correct approach for this geometry. No need for pixel-perfect or circle-circle collision given the visual style.

### D6: Press Start 2P via Google Fonts
**Choice**: Load the font via a `<link>` tag in index.html from Google Fonts CDN.
**Rationale**: Simplest integration. The font loads before gameplay starts. Canvas `fillText` uses it by font-family name.
**Alternative considered**: Self-hosting the font file — adds build complexity for no offline requirement.

## Risks / Trade-offs

- **[Canvas not focused]** → The GameCanvas component must ensure the canvas or its container receives keyboard focus. Will use `tabIndex` and auto-focus on mount.
- **[Font loading delay]** → Press Start 2P may not be ready on first frame. Mitigation: CSS `font-display: block` and a brief loading state or relying on the browser's font load event.
- **[No delta-time cap]** → If the tab is backgrounded and rAF resumes with a huge delta, entities could teleport. Mitigation: Cap delta-time at ~50ms (equivalent to 20fps minimum).
- **[Single-threaded bottleneck]** → All game logic runs on the main thread. Acceptable for this complexity level (< 100 entities at any time).
