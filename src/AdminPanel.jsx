import { useEffect, useState } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { db } from './firebase'
import { MAX_PLAYERS } from './game/constants'
import { setMuted, isMuted } from './game/audio'

export default function AdminPanel() {
  const [maxPlayers, setMaxPlayers] = useState(1)
  const [muted, setMutedState] = useState(isMuted())

  useEffect(() => {
    if (!db) return
    const maxRef = ref(db, 'config/maxPlayers')
    const unsub = onValue(maxRef, (snap) => {
      setMaxPlayers(snap.val() || 1)
    })
    return unsub
  }, [])

  const increment = () => {
    if (!db) return
    const next = Math.min(maxPlayers + 1, MAX_PLAYERS)
    set(ref(db, 'config/maxPlayers'), next)
  }

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    setMutedState(next)
  }

  return (
    <div className="admin-panel">
      <span className="admin-label">Active pilots: {maxPlayers}</span>
      <button
        className="admin-btn"
        onClick={increment}
        disabled={maxPlayers >= MAX_PLAYERS}
      >
        +
      </button>
      <button className="admin-btn mute-btn" onClick={toggleMute}>
        {muted ? 'SOUND OFF' : 'SOUND ON'}
      </button>
    </div>
  )
}
