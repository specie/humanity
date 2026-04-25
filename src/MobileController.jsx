import { useRef, useCallback } from 'react'
import { ref, set } from 'firebase/database'
import { db } from './firebase'
import { usePlayerConnection } from './hooks/usePlayerConnection'

export default function MobileController() {
  const { playerId, status, color, queuePosition } = usePlayerConnection()
  const inputRef = useRef({ left: false, right: false, fire: false })
  const isPlaying = status === 'playing'

  const writeInput = useCallback((field, value) => {
    if (!db) return
    const prev = inputRef.current[field]
    if (prev === value) return
    inputRef.current[field] = value
    set(ref(db, `players/${playerId}/input`), { ...inputRef.current })
  }, [playerId])

  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(20)
  }

  const handleTouch = (field, pressed) => (e) => {
    e.preventDefault()
    if (!isPlaying) return
    if (pressed) vibrate()
    writeInput(field, pressed)
  }

  // Banner color
  const bannerColor = isPlaying && color ? color : '#333'

  // Status text
  let statusText = ''
  if (status === 'queued') {
    statusText = queuePosition ? `QUEUE POSITION #${queuePosition}` : 'IN QUEUE'
  } else if (status === 'playing') {
    statusText = 'FLY'
  } else if (status === 'dead') {
    statusText = queuePosition
      ? `ELIMINATED\nQUEUE POSITION #${queuePosition}`
      : 'ELIMINATED'
  } else if (status === 'gameover') {
    statusText = 'GAME OVER'
  }

  return (
    <div className="controller-root">
      {/* Pilot banner */}
      <div className="controller-banner" style={{ background: bannerColor, color: bannerColor === '#333' ? '#888' : '#000' }}>
        PILOT
      </div>

      {/* Status indicator */}
      <div className="controller-status" style={{ whiteSpace: 'pre-line' }}>
        {statusText}
      </div>

      {/* Control buttons */}
      <div className={`controller-buttons ${!isPlaying ? 'disabled' : ''}`}>
        <ControlButton
          label="◀"
          className="btn-direction"
          onDown={handleTouch('left', true)}
          onUp={handleTouch('left', false)}
        />
        <ControlButton
          label="FIRE"
          className="btn-fire"
          onDown={handleTouch('fire', true)}
          onUp={handleTouch('fire', false)}
        />
        <ControlButton
          label="▶"
          className="btn-direction"
          onDown={handleTouch('right', true)}
          onUp={handleTouch('right', false)}
        />
      </div>
    </div>
  )
}

function ControlButton({ label, className, onDown, onUp }) {
  return (
    <button
      className={`ctrl-btn ${className}`}
      onTouchStart={onDown}
      onTouchEnd={onUp}
      onMouseDown={onDown}
      onMouseUp={onUp}
    >
      {label}
    </button>
  )
}
