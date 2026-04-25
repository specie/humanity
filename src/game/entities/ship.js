import { CANVAS_W } from '../state'
import { SHOT_COOLDOWN } from '../constants'

export function createShip() {
  return {
    x: CANVAS_W / 2,
    y: 550,
    w: 30,
    h: 24,
    speed: 0.35, // px per ms
    alive: true,
    lastShotTime: 0,
  }
}

export function createMultiShip(playerId, color, lane, laneY) {
  return {
    playerId,
    color,
    lane,
    x: 100 + Math.random() * (CANVAS_W - 200), // random X with margin
    y: laneY,
    w: 30,
    h: 24,
    speed: 0.35,
    alive: true,
    lastShotTime: 0,
  }
}
