import { useEffect, useState, useRef } from 'react'
import { ref, set, onValue, onDisconnect } from 'firebase/database'
import { db } from '../firebase'
import { getOrCreatePlayerId } from '../lib/playerId'

export function usePlayerConnection() {
  const [status, setStatus] = useState('queued')
  const [color, setColor] = useState(null)
  const [queuePosition, setQueuePosition] = useState(null)
  const playerIdRef = useRef(getOrCreatePlayerId())
  const playerId = playerIdRef.current

  useEffect(() => {
    if (!db) return
    const playerRef = ref(db, `players/${playerId}`)

    // Register as queued with timestamp
    set(playerRef, {
      status: 'queued',
      joinedAt: Date.now(),
    })

    // Auto-cleanup on disconnect
    onDisconnect(playerRef).remove()

    // Listen for status updates
    const statusUnsub = onValue(ref(db, `players/${playerId}/status`), (snap) => {
      const val = snap.val()
      if (val) setStatus(val)
    })

    // Listen for color updates
    const colorUnsub = onValue(ref(db, `players/${playerId}/color`), (snap) => {
      setColor(snap.val())
    })

    // Listen for queue position
    const queueUnsub = onValue(ref(db, `players/${playerId}/queuePosition`), (snap) => {
      setQueuePosition(snap.val())
    })

    return () => {
      statusUnsub()
      colorUnsub()
      queueUnsub()
      set(playerRef, null)
    }
  }, [playerId])

  return { playerId, status, color, queuePosition }
}
