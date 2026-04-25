import GameCanvas from './GameCanvas'
import MobileController from './MobileController'

export default function App() {
  const path = window.location.pathname

  if (path === '/play') {
    return <MobileController />
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <GameCanvas />
    </div>
  )
}
