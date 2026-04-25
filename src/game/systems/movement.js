import { CANVAS_W, CANVAS_H } from '../state'
import { createPlayerBullet, createAiBullet } from '../entities/bullet'
import { SHOT_COOLDOWN } from '../constants'
import { playerShoot, enemyShoot } from '../audio'

export function updateMovement(state, dt) {
  updateStars(state, dt)
  updateShips(state, dt)
  updatePlayerBullets(state, dt)
  updateAiBrain(state, dt)
  updateAiBullets(state, dt)
}

function updateStars(state, dt) {
  for (const star of state.stars) {
    star.y += star.speed * dt
    if (star.y > CANVAS_H) {
      star.y = 0
      star.x = Math.random() * CANVAS_W
    }
  }
}

function updateShips(state, dt) {
  for (const ship of Object.values(state.ships)) {
    if (!ship.alive) continue

    // Input source: remote input for this player, or keyboard for __local__
    const input = ship.playerId === '__local__'
      ? { left: state.keys['ArrowLeft'], right: state.keys['ArrowRight'], fire: state.keys['Space'] }
      : state.remoteInputs[ship.playerId]

    if (!input) continue

    // Movement
    if (input.left) ship.x -= ship.speed * dt
    if (input.right) ship.x += ship.speed * dt

    // Clamp
    const halfW = ship.w / 2
    if (ship.x < halfW) ship.x = halfW
    if (ship.x > CANVAS_W - halfW) ship.x = CANVAS_W - halfW

    // Shooting (per-ship cooldown)
    if (input.fire && state.gameTime - ship.lastShotTime >= SHOT_COOLDOWN) {
      state.playerBullets.push(createPlayerBullet(ship.x, ship.y - ship.h / 2, ship.color || '#FFE800'))
      ship.lastShotTime = state.gameTime
      playerShoot()
    }
  }
}

function updatePlayerBullets(state, dt) {
  for (let i = state.playerBullets.length - 1; i >= 0; i--) {
    const b = state.playerBullets[i]
    b.y += b.speed * dt
    if (b.y + b.h < 0) {
      state.playerBullets.splice(i, 1)
    }
  }
}

function updateAiBrain(state, dt) {
  const brain = state.brain
  for (const arm of brain.arms) {
    arm.fireTimer -= dt
    if (arm.fireTimer <= 0) {
      const targetX = Math.random() * CANVAS_W
      state.aiBullets.push(createAiBullet(arm.x, arm.y + 10, targetX))
      arm.fireTimer = arm.fireInterval
      enemyShoot()
    }
  }
}

function updateAiBullets(state, dt) {
  for (let i = state.aiBullets.length - 1; i >= 0; i--) {
    const b = state.aiBullets[i]
    b.x += b.vx * dt
    b.y += b.speed * dt
    if (b.y > CANVAS_H) {
      state.aiBullets.splice(i, 1)
    }
  }
}
