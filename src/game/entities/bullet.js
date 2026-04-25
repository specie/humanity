export function createPlayerBullet(x, y, color = '#FFE800') {
  return {
    x,
    y,
    w: 3,
    h: 12,
    speed: -0.6, // px per ms, negative = upward
    type: 'player',
    color,
  }
}

export function createAiBullet(x, y, targetX) {
  const vy = 0.25 // px per ms, positive = downward
  const travelY = 600 - y // vertical distance to bottom
  const travelTime = travelY / vy // ms to reach bottom
  const vx = (targetX - x) / travelTime // horizontal speed to reach targetX

  return {
    x,
    y,
    w: 6,
    h: 6,
    speed: vy,
    vx,
    type: 'ai',
  }
}
