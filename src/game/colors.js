import { PILOT_COLORS } from './constants'

/**
 * Returns the first palette color not used by any currently playing player.
 * @param {Object} ships — map of playerId → ship (each has a .color)
 * @returns {string} hex color
 */
export function getFirstFreeColor(ships) {
  const usedColors = new Set(Object.values(ships).map(s => s.color))
  for (const color of PILOT_COLORS) {
    if (!usedColors.has(color)) return color
  }
  return PILOT_COLORS[0] // fallback (shouldn't happen with max 12)
}
