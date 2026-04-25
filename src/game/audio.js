let ctx = null
let muted = false

function getCtx() {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function setMuted(val) { muted = val }
export function isMuted() { return muted }

function playTone(type, freq, duration, volume = 0.3, freqEnd = null) {
  if (muted) return
  const ac = getCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime)
  if (freqEnd !== null) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, ac.currentTime + duration)
  }
  gain.gain.setValueAtTime(volume, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(ac.currentTime)
  osc.stop(ac.currentTime + duration)
}

// Short high-pitched pulse
export function playerShoot(volume = 0.3) {
  playTone('square', 880, 0.05, volume)
}

// Descending sawtooth noise
export function playerHit(volume = 0.3) {
  playTone('sawtooth', 200, 0.2, volume, 50)
}

// Low-pitched pulse
export function enemyShoot(volume = 0.3) {
  playTone('square', 220, 0.08, volume)
}

// Metallic click
export function aiHit(volume = 0.3) {
  playTone('square', 1200, 0.03, volume)
}

// Long descending sweep
export function aiDeath(volume = 0.3) {
  playTone('sawtooth', 800, 1.5, volume, 100)
}

// Ascending 3-note arpeggio
export function victory(volume = 0.3) {
  if (muted) return
  const ac = getCtx()
  const notes = [523, 659, 784]
  const dur = 0.15
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(freq, ac.currentTime + i * dur)
    gain.gain.setValueAtTime(volume, ac.currentTime + i * dur)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * dur + dur)
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.start(ac.currentTime + i * dur)
    osc.stop(ac.currentTime + i * dur + dur)
  })
}
