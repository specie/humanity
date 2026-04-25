import { aiHit, playerHit, aiDeath } from '../audio'

// AABB overlap test
function aabb(a, b) {
  const aLeft = a.x - a.w / 2
  const aRight = a.x + a.w / 2
  const aTop = a.y - a.h / 2
  const aBottom = a.y + a.h / 2
  const bLeft = b.x - b.w / 2
  const bRight = b.x + b.w / 2
  const bTop = b.y - b.h / 2
  const bBottom = b.y + b.h / 2
  return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop
}

/**
 * @returns {string[]} array of dead player IDs
 */
export function updateCollisions(state) {
  const { brain, ships, playerBullets, aiBullets } = state
  const deadPlayerIds = []

  // All player bullets vs AI brain
  for (let i = playerBullets.length - 1; i >= 0; i--) {
    if (aabb(playerBullets[i], brain)) {
      playerBullets.splice(i, 1)
      brain.hp -= 10
      aiHit()
      if (brain.hp <= 0) {
        brain.hp = 0
        state.victory = true
        aiDeath()
      }
    }
  }

  // AI bullets vs ALL ships
  for (let i = aiBullets.length - 1; i >= 0; i--) {
    const bullet = aiBullets[i]
    for (const ship of Object.values(ships)) {
      if (!ship.alive) continue
      if (aabb(bullet, ship)) {
        aiBullets.splice(i, 1)
        ship.alive = false
        deadPlayerIds.push(ship.playerId)
        playerHit()
        break // bullet consumed
      }
    }
  }

  return deadPlayerIds
}
