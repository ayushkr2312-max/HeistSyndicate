import { useState } from 'react'
import { TEAM_NAME } from '../config.js'
import { verifyPassword, writeAuth } from './auth.js'

export default function AuthGate({ onAuth }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = verifyPassword(password)
    if (!result) {
      setError('Invalid access code.')
      setLoading(false)
      return
    }
    const auth = { ...result, at: new Date().toISOString() }
    writeAuth(auth)
    onAuth(auth)
    setLoading(false)
  }

  return (
    <div className="hub-gate">
      <div className="hub-gate__panel">
        <p className="hub-gate__tag">// RESTRICTED</p>
        <h1 className="hub-gate__title">{TEAM_NAME}</h1>
        <p className="hub-gate__sub">Team Operations Hub</p>
        <form onSubmit={submit}>
          <label className="hub-label" htmlFor="hub-pass">
            Access code
          </label>
          <input
            id="hub-pass"
            type="password"
            className="hub-input hub-input--gate"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
          />
          {error && <p className="hub-gate__error">{error}</p>}
          <button
            type="submit"
            className="hub-btn hub-btn--accent hub-btn--block"
            disabled={loading}
          >
            {loading ? 'Verifying…' : 'Enter hub'}
          </button>
        </form>
        <p className="hub-gate__hint">
          Team and owner codes unlock the same workspace; owner code also opens the
          executive dashboard.
        </p>
      </div>
    </div>
  )
}
