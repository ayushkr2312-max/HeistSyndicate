import { lazy, Suspense, useState } from 'react'
import AuthGate from './auth/AuthGate.jsx'
import { clearAuth, readAuth } from './auth/auth.js'

const TeamHubApp = lazy(() => import('./TeamHubApp.jsx'))

export default function TeamHub() {
  const [auth, setAuth] = useState(() => readAuth())

  const handleLock = () => {
    clearAuth()
    setAuth(null)
  }

  if (!auth) {
    return <AuthGate onAuth={setAuth} />
  }

  return (
    <Suspense
      fallback={
        <div className="hub-gate hub-gate--loading">
          <div className="hub-gate__panel">
            <p className="hub-gate__tag">// LOADING</p>
            <p className="hub-gate__sub">Initializing hub…</p>
          </div>
        </div>
      }
    >
      <TeamHubApp auth={auth} onLock={handleLock} />
    </Suspense>
  )
}
