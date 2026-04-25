import { CANVAS_W, CANVAS_H } from '../state'

const FONT = '"Press Start 2P", monospace'
const HEALTH_BAR_W = CANVAS_W * 0.6 // 480px
const HEALTH_BAR_H = 16
const HEALTH_BAR_X = (CANVAS_W - HEALTH_BAR_W) / 2
const HEALTH_BAR_Y = 22

export function render(ctx, state) {
  // Clear to black
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  renderStars(ctx, state)
  renderBrain(ctx, state)
  renderHealthBar(ctx, state)
  renderShips(ctx, state)
  renderPlayerBullets(ctx, state)
  renderAiBullets(ctx, state)

  if (state.victory) {
    renderVictoryScreen(ctx, state)
  }
}

function renderStars(ctx, state) {
  ctx.fillStyle = '#fff'
  for (const star of state.stars) {
    ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size)
  }
}

function renderBrain(ctx, state) {
  const { brain } = state
  const cx = brain.x
  const cy = brain.y

  // Brain body — rounded rectangle shape with circuit lines
  ctx.fillStyle = '#8B5CF6' // purple
  ctx.fillRect(cx - 30, cy - 20, 60, 40)
  ctx.fillRect(cx - 35, cy - 15, 70, 30)
  ctx.fillRect(cx - 25, cy - 25, 50, 50)

  // Circuit lines
  ctx.fillStyle = '#C084FC'
  ctx.fillRect(cx - 20, cy - 18, 3, 36)
  ctx.fillRect(cx - 5, cy - 22, 3, 44)
  ctx.fillRect(cx + 10, cy - 18, 3, 36)
  ctx.fillRect(cx - 25, cy - 5, 50, 3)
  ctx.fillRect(cx - 22, cy + 8, 44, 3)

  // Glowing core eye
  ctx.fillStyle = '#FF0000'
  ctx.beginPath()
  ctx.arc(cx, cy, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#FF6666'
  ctx.beginPath()
  ctx.arc(cx, cy, 3, 0, Math.PI * 2)
  ctx.fill()

  // Robotic arms
  ctx.strokeStyle = '#A0A0A0'
  ctx.lineWidth = 3
  for (const arm of brain.arms) {
    ctx.beginPath()
    ctx.moveTo(cx + (arm.x - cx) * 0.3, cy + 20)
    ctx.lineTo(arm.x, arm.y)
    ctx.stroke()

    // Arm cannon tip
    ctx.fillStyle = '#FF4444'
    ctx.fillRect(arm.x - 4, arm.y - 2, 8, 6)
    ctx.fillStyle = '#666'
    ctx.fillRect(arm.x - 5, arm.y - 4, 10, 4)
  }
}

function renderHealthBar(ctx, state) {
  const { brain } = state
  const ratio = brain.hp / brain.maxHp

  // Background
  ctx.fillStyle = '#333'
  ctx.fillRect(HEALTH_BAR_X, HEALTH_BAR_Y, HEALTH_BAR_W, HEALTH_BAR_H)

  // Fill
  const color = ratio > 0.5 ? '#FF4444' : ratio > 0.25 ? '#FF8800' : '#FF0000'
  ctx.fillStyle = color
  ctx.fillRect(HEALTH_BAR_X, HEALTH_BAR_Y, HEALTH_BAR_W * ratio, HEALTH_BAR_H)

  // Border
  ctx.strokeStyle = '#888'
  ctx.lineWidth = 1
  ctx.strokeRect(HEALTH_BAR_X, HEALTH_BAR_Y, HEALTH_BAR_W, HEALTH_BAR_H)

  // Label
  ctx.fillStyle = '#fff'
  ctx.font = `8px ${FONT}`
  ctx.textAlign = 'center'
  ctx.fillText('AI INTEGRITY', CANVAS_W / 2, HEALTH_BAR_Y - 6)
  ctx.fillText(`${brain.hp} / ${brain.maxHp}`, CANVAS_W / 2, HEALTH_BAR_Y + HEALTH_BAR_H + 14)
}

function renderShips(ctx, state) {
  for (const ship of Object.values(state.ships)) {
    if (!ship.alive) continue
    renderSingleShip(ctx, ship)
  }
}

function renderSingleShip(ctx, ship) {
  const x = Math.floor(ship.x)
  const y = Math.floor(ship.y)
  const color = ship.color || '#00DDFF'

  // Ship body — triangle / arrow shape
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y - ship.h / 2)          // top center (nose)
  ctx.lineTo(x - ship.w / 2, y + ship.h / 2)  // bottom left
  ctx.lineTo(x - ship.w / 4, y + ship.h / 4)  // inner left
  ctx.lineTo(x + ship.w / 4, y + ship.h / 4)  // inner right
  ctx.lineTo(x + ship.w / 2, y + ship.h / 2)  // bottom right
  ctx.closePath()
  ctx.fill()

  // Engine glow
  ctx.fillStyle = '#FFAA00'
  ctx.fillRect(x - 4, y + ship.h / 4, 8, 4)
  ctx.fillStyle = '#FF4400'
  ctx.fillRect(x - 2, y + ship.h / 4 + 4, 4, 3)

  // Cockpit
  ctx.fillStyle = '#AAEEFF'
  ctx.fillRect(x - 3, y - 4, 6, 6)
}

function renderPlayerBullets(ctx, state) {
  for (const b of state.playerBullets) {
    ctx.fillStyle = b.color || '#FFE800'
    ctx.fillRect(Math.floor(b.x) - 1, Math.floor(b.y), b.w, b.h)
  }
}

function renderAiBullets(ctx, state) {
  ctx.fillStyle = '#FF2222'
  for (const b of state.aiBullets) {
    ctx.beginPath()
    ctx.arc(Math.floor(b.x), Math.floor(b.y), b.w / 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

function renderVictoryScreen(ctx, state) {
  // Dim overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  ctx.fillStyle = '#00FF88'
  ctx.font = `28px ${FONT}`
  ctx.textAlign = 'center'
  ctx.fillText('HUMANITY WINS', CANVAS_W / 2, CANVAS_H / 2 - 40)

  // Colored blocks for each participant
  const colors = state.participantColors
  if (colors.length > 0) {
    const blockSize = 20
    const gap = 8
    const totalW = colors.length * blockSize + (colors.length - 1) * gap
    let startX = (CANVAS_W - totalW) / 2

    for (const c of colors) {
      ctx.fillStyle = c
      ctx.fillRect(startX, CANVAS_H / 2 - 5, blockSize, blockSize)
      startX += blockSize + gap
    }
  }

  ctx.fillStyle = '#fff'
  ctx.font = `12px ${FONT}`
  ctx.fillText('PRESS R TO RESTART', CANVAS_W / 2, CANVAS_H / 2 + 40)
}
