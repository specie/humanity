## Context

The game currently has no audio. All game events (shooting, hits, death, victory) are visual-only. The pixel art aesthetic calls for synthesized 8-bit chiptune sounds rather than sampled audio files.

## Goals / Non-Goals

**Goals:**
- 6 synthesized sound effects covering all key game events
- Zero external audio files — everything generated via Web Audio API oscillators
- Lazy AudioContext initialization (browser requirement)
- Global mute toggle accessible from the admin panel
- Non-blocking integration — sounds fire-and-forget, never stall the game loop

**Non-Goals:**
- Background music (future change)
- Spatial audio / stereo panning
- Per-player volume control

## Decisions

1. **Web Audio API (native) over Howler.js** — No dependency needed. Oscillator-based synthesis is trivial for 8-bit sounds and the API is supported in all modern browsers. Howler.js is designed for sampled audio files, not synthesis.

2. **Single global AudioContext, lazy-initialized** — Created on first sound call. If suspended (browser policy), resumed automatically. All sound functions share it. Stored in module scope.

3. **Each sound function is self-contained** — Takes optional volume (default 0.3), creates oscillator + gain node, schedules start/stop, and lets Web Audio API garbage collect. No persistent audio nodes.

4. **Mute flag in module scope** — `let muted = false` with exported `setMuted(bool)` and `isMuted()`. All sound functions check this first. AdminPanel calls `setMuted()` on toggle.

5. **Direct calls from game systems, not callbacks** — Import sound functions directly in movement.js, collision.js, gameLoop.js. Simpler than adding more callback plumbing. Sound calls are fire-and-forget (non-blocking by nature of Web Audio API scheduling).

## Risks / Trade-offs

- [AudioContext limit] Some browsers limit concurrent AudioContexts → Mitigated by using a single global instance
- [GC pressure from many oscillators] Rapid fire creates many short-lived nodes → Web Audio API handles cleanup after stop(); node count is bounded by game event frequency
- [Mobile autoplay policy] AudioContext starts suspended → Mitigated by lazy init + resume on first interaction
