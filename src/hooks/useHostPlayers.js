import { useEffect, useRef } from 'react'
import { ref, onValue, off, set, onChildAdded, onChildRemoved } from 'firebase/database'
import { db } from '../firebase'
import { createMultiShip } from '../game/entities/ship'
import { getFirstFreeColor } from '../game/colors'
import { assignLane, getLaneY } from '../game/lanes'

export function useHostPlayers(stateRef, { onRestart } = {}) {
  const inputUnsubs = useRef({})   // playerId → cleanup fn
  const playersCache = useRef({})  // playerId → player data from Firebase

  useEffect(() => {
    if (!db) return

    const playersRef = ref(db, 'players')
    const maxPlayersRef = ref(db, 'config/maxPlayers')

    // Initialize maxPlayers in Firebase
    set(maxPlayersRef, 1)

    // Listen for maxPlayers changes
    const maxPlayersUnsub = onValue(maxPlayersRef, (snap) => {
      const state = stateRef.current
      if (!state) return
      const newMax = snap.val() || 1
      const oldMax = state.maxPlayers
      state.maxPlayers = newMax

      // Scale brain HP preserving percentage
      if (oldMax !== newMax) {
        const brain = state.brain
        const ratio = brain.hp / brain.maxHp
        brain.maxHp = newMax * 1000
        brain.hp = Math.round(brain.maxHp * ratio)
      }

      // Try to promote queued players with new slots
      promoteFromQueue(stateRef)
    })

    // Listen for player changes
    const playersUnsub = onValue(playersRef, (snap) => {
      const state = stateRef.current
      if (!state) return
      const players = snap.val() || {}
      const currentIds = new Set(Object.keys(players))
      const cachedIds = new Set(Object.keys(playersCache.current))

      // Handle disconnects — players that were cached but no longer in Firebase
      for (const id of cachedIds) {
        if (!currentIds.has(id)) {
          handleDisconnect(id, stateRef)
        }
      }

      playersCache.current = players
      promoteFromQueue(stateRef)
    })

    return () => {
      maxPlayersUnsub()
      playersUnsub()
      // Cleanup all input listeners
      for (const cleanup of Object.values(inputUnsubs.current)) {
        cleanup()
      }
      inputUnsubs.current = {}
      playersCache.current = {}
    }
  }, [stateRef])

  function handleDisconnect(playerId, stateRef) {
    const state = stateRef.current
    if (!state) return

    // Remove ship
    delete state.ships[playerId]
    delete state.remoteInputs[playerId]

    // Cleanup input listener
    if (inputUnsubs.current[playerId]) {
      inputUnsubs.current[playerId]()
      delete inputUnsubs.current[playerId]
    }

    delete playersCache.current[playerId]
    promoteFromQueue(stateRef)
  }

  // Called from gameLoop via callback when players die
  function handleDeaths(deadPlayerIds) {
    const state = stateRef.current
    if (!state || !db) return

    for (const playerId of deadPlayerIds) {
      // Remove ship from game state
      delete state.ships[playerId]
      delete state.remoteInputs[playerId]

      // Cleanup input listener
      if (inputUnsubs.current[playerId]) {
        inputUnsubs.current[playerId]()
        delete inputUnsubs.current[playerId]
      }

      // Set status to dead and re-enqueue with new joinedAt
      set(ref(db, `players/${playerId}/status`), 'dead')
      set(ref(db, `players/${playerId}/joinedAt`), Date.now())
    }

    // After processing deaths, promote next in queue
    setTimeout(() => promoteFromQueue(stateRef), 100)
  }

  function handleVictory() {
    if (!db) return
    const players = playersCache.current
    for (const id of Object.keys(players)) {
      set(ref(db, `players/${id}/status`), 'gameover')
    }
  }

  function promoteFromQueue(stateRef) {
    const state = stateRef.current
    if (!state || !db) return

    const players = playersCache.current
    const playingCount = Object.keys(state.ships).filter(id => id !== '__local__').length

    // Get queued players sorted by joinedAt (oldest first = FIFO)
    const queued = Object.entries(players)
      .filter(([id, p]) => p.status === 'queued' || p.status === 'dead')
      .filter(([id]) => !state.ships[id]) // not already playing
      .sort((a, b) => (a[1].joinedAt || 0) - (b[1].joinedAt || 0))

    let promoted = 0
    for (const [playerId, player] of queued) {
      if (playingCount + promoted >= state.maxPlayers) break

      // Assign color and lane
      const color = getFirstFreeColor(state.ships)
      const lane = assignLane(state.ships)
      const laneY = getLaneY(lane)

      // Remove local fallback ship if present
      delete state.ships['__local__']

      // Create ship in game state
      const ship = createMultiShip(playerId, color, lane, laneY)
      state.ships[playerId] = ship

      // Track participant color for victory screen
      if (!state.participantColors.includes(color)) {
        state.participantColors.push(color)
      }

      // Write status and color to Firebase
      set(ref(db, `players/${playerId}/status`), 'playing')
      set(ref(db, `players/${playerId}/color`), color)

      // Listen to this player's input
      listenToInput(playerId, stateRef)

      promoted++
    }

    // Update queue positions for remaining queued players
    updateQueuePositions()
  }

  function updateQueuePositions() {
    if (!db) return
    const players = playersCache.current

    const queued = Object.entries(players)
      .filter(([id, p]) => p.status === 'queued' || p.status === 'dead')
      .filter(([id]) => {
        const state = stateRef.current
        return state && !state.ships[id]
      })
      .sort((a, b) => (a[1].joinedAt || 0) - (b[1].joinedAt || 0))

    for (let i = 0; i < queued.length; i++) {
      const [playerId] = queued[i]
      set(ref(db, `players/${playerId}/queuePosition`), i + 1)
    }
  }

  function listenToInput(playerId, stateRef) {
    if (inputUnsubs.current[playerId]) {
      inputUnsubs.current[playerId]()
    }
    const inputRef = ref(db, `players/${playerId}/input`)
    const cb = onValue(inputRef, (snap) => {
      const state = stateRef.current
      if (state) {
        state.remoteInputs[playerId] = snap.val() || null
      }
    })
    inputUnsubs.current[playerId] = () => off(inputRef)
  }

  return { handleDeaths, handleVictory }
}
