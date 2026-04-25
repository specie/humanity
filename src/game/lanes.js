import { LANE_Y, LANE_COUNT } from './constants'

/**
 * Returns the lane index with the fewest active ships.
 * Ties broken by highest Y (closest to bottom).
 */
export function assignLane(ships) {
  const counts = new Array(LANE_COUNT).fill(0)
  for (const ship of Object.values(ships)) {
    if (typeof ship.lane === 'number') counts[ship.lane]++
  }
  let best = LANE_COUNT - 1
  for (let i = LANE_COUNT - 1; i >= 0; i--) {
    if (counts[i] <= counts[best]) best = i
  }
  return best
}

export function getLaneY(laneIndex) {
  return LANE_Y[laneIndex]
}
