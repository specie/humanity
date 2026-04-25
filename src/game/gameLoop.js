import { updateMovement } from './systems/movement'
import { updateCollisions } from './systems/collision'
import { render } from './systems/render'
import { createBrain } from './entities/brain'
import { createStarfield } from './entities/stars'
import { victory as victorySound } from './audio'

const MAX_DELTA = 50 // ms

export function startLoop(ctx, state, callbacks = {}) {
  let lastTime = performance.now()
  let rafId = 0
  let victoryNotified = false

  function frame(now) {
    let dt = now - lastTime
    if (dt > MAX_DELTA) dt = MAX_DELTA
    lastTime = now
    state.gameTime += dt

    if (!state.victory) {
      updateMovement(state, dt)
      const deadPlayerIds = updateCollisions(state)
      if (deadPlayerIds.length > 0 && callbacks.onPlayerDeath) {
        callbacks.onPlayerDeath(deadPlayerIds)
      }
    }

    // Notify victory once
    if (state.victory && !victoryNotified) {
      victoryNotified = true
      victorySound()
      if (callbacks.onVictory) callbacks.onVictory()
    }

    render(ctx, state)

    // Restart
    if (state.victory && state.keys['KeyR']) {
      resetState(state)
      victoryNotified = false
    }

    rafId = requestAnimationFrame(frame)
  }

  rafId = requestAnimationFrame(frame)
  return { stop: () => cancelAnimationFrame(rafId) }
}

export function stopLoop(handle) {
  if (handle) handle.stop()
}

function resetState(state) {
  const brain = createBrain()
  brain.maxHp = state.maxPlayers * 1000
  brain.hp = brain.maxHp
  const stars = createStarfield()

  Object.assign(state, {
    ships: {},
    remoteInputs: {},
    participantColors: [],
    brain,
    stars,
    playerBullets: [],
    aiBullets: [],
    victory: false,
    gameTime: 0,
  })
  // Keep keys and maxPlayers as-is; clear R so it doesn't loop
  state.keys['KeyR'] = false
}
