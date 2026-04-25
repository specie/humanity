const STORAGE_KEY = 'humanity-vs-ai-player-id'

export function getOrCreatePlayerId() {
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
        })
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}
