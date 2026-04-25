import { createBrain } from './entities/brain'
import { createStarfield } from './entities/stars'

export const CANVAS_W = 800
export const CANVAS_H = 600

export function createGameState() {
  return {
    // Input
    keys: {},

    // Multiplayer
    ships: {},             // map of playerId → ship
    remoteInputs: {},      // map of playerId → { left, right, fire }
    maxPlayers: 1,
    participantColors: [], // all colors that ever played (for victory screen)

    // Entities
    brain: createBrain(),
    playerBullets: [],
    aiBullets: [],
    stars: createStarfield(),

    // Game flags
    victory: false,
    gameTime: 0,
  }
}
