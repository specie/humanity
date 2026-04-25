import { CANVAS_W } from '../state'

export function createBrain() {
  const cx = CANVAS_W / 2
  const y = 100
  const armSpacing = 70

  return {
    x: cx,
    y,
    w: 80,
    h: 60,
    hp: 1000,
    maxHp: 1000,
    arms: [
      { x: cx - armSpacing * 1.5, y: y + 50, fireTimer: 0, fireInterval: 1200 },
      { x: cx - armSpacing * 0.5, y: y + 40, fireTimer: 300, fireInterval: 1400 },
      { x: cx + armSpacing * 0.5, y: y + 40, fireTimer: 600, fireInterval: 1400 },
      { x: cx + armSpacing * 1.5, y: y + 50, fireTimer: 900, fireInterval: 1200 },
    ],
  }
}
