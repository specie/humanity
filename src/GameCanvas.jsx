import { useEffect, useRef } from 'react'
import { ref, set } from 'firebase/database'
import { db } from './firebase'
import { createGameState } from './game/state'
import { startLoop, stopLoop } from './game/gameLoop'
import { useHostPlayers } from './hooks/useHostPlayers'
import { createShip } from './game/entities/ship'
import AdminPanel from './AdminPanel'

export default function GameCanvas() {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)

  // Host-side Firebase player binding
  const { handleDeaths, handleVictory } = useHostPlayers(stateRef)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const state = createGameState()
    stateRef.current = state

    // Scale brain HP to initial maxPlayers
    state.brain.maxHp = state.maxPlayers * 1000
    state.brain.hp = state.brain.maxHp

    // Create local keyboard ship if no Firebase
    if (!db) {
      const localShip = createShip()
      localShip.playerId = '__local__'
      localShip.color = '#00DDFF'
      state.ships['__local__'] = localShip
    }

    // Keyboard input
    const onKeyDown = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'Space', 'KeyR'].includes(e.code)) {
        e.preventDefault()
        state.keys[e.code] = true
      }
    }
    const onKeyUp = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'Space', 'KeyR'].includes(e.code)) {
        e.preventDefault()
        state.keys[e.code] = false
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    const loopId = startLoop(ctx, state, {
      onPlayerDeath: (deadPlayerIds) => {
        // If local player died, respawn immediately
        if (deadPlayerIds.includes('__local__')) {
          const localShip = createShip()
          localShip.playerId = '__local__'
          localShip.color = '#00DDFF'
          state.ships['__local__'] = localShip
        }
        // Handle remote player deaths via Firebase
        handleDeaths(deadPlayerIds.filter(id => id !== '__local__'))
      },
      onVictory: () => {
        handleVictory()
      },
    })

    canvas.focus()

    // If Firebase is available but no remote players yet, ensure local keyboard works
    // Check periodically and add/remove __local__ ship based on remote player presence
    let localCheckInterval = null
    if (db) {
      localCheckInterval = setInterval(() => {
        const remoteShips = Object.keys(state.ships).filter(id => id !== '__local__')
        if (remoteShips.length === 0 && !state.ships['__local__']) {
          // No remote players, add local ship
          const localShip = createShip()
          localShip.playerId = '__local__'
          localShip.color = '#00DDFF'
          state.ships['__local__'] = localShip
        } else if (remoteShips.length > 0 && state.ships['__local__']) {
          // Remote players active, remove local ship
          delete state.ships['__local__']
        }
      }, 500)
    }

    return () => {
      stopLoop(loopId)
      if (localCheckInterval) clearInterval(localCheckInterval)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      stateRef.current = null
    }
  }, [])

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        tabIndex={0}
        className="outline-none block"
        style={{ imageRendering: 'pixelated' }}
      />
      <AdminPanel />
    </div>
  )
}
