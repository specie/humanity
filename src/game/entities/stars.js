import { CANVAS_W, CANVAS_H } from '../state'

const STAR_COUNT = 80

export function createStarfield() {
  const stars = []
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      size: Math.random() < 0.3 ? 2 : 1,
      speed: 0.02 + Math.random() * 0.03, // px per ms
    })
  }
  return stars
}
