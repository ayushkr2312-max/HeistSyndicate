import { useState } from 'react'
import './shared.css'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const OUTCOMES = ['win', 'loss', 'draw', 'scrim']

export default function ResultLog({
  results = [],
  onChange,
  opponentLabel = 'Opponent',
}) {
  const [opp, setOpp] = useState('')
  const [score, setScore] = useState('')
  const [outcome, setOutcome] = useState('scrim')
  const [notes, setNotes] = useState('')

  const add = () => {
    if (!opp.trim()) return
    onChange([
      ...results,
      {
        id: uid(),
        opponent: opp.trim(),
        score: score.trim(),
        outcome,
        notes: notes.trim(),
        date: new Date().toISOString(),
      },
    ])
    setOpp('')
    setScore('')
    setNotes('')
  }

  const remove = (id) => onChange(results.filter((r) => r.id !== id))

  return (
    <div className="sh-results">
      <div className="sh-results__add">
        <input
          type="text"
          className="hub-input"
          value={opp}
          onChange={(e) => setOpp(e.target.value)}
          placeholder={opponentLabel}
        />
        <input
          type="text"
          className="hub-input"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="Score (e.g. 3-1)"
          style={{ maxWidth: '7rem' }}
        />
        <select
          className="hub-input"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
        >
          {OUTCOMES.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <button type="button" className="hub-btn hub-btn--accent" onClick={add}>
          Log
        </button>
      </div>
      <input
        type="text"
        className="hub-input"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        style={{ marginBottom: '0.5rem', width: '100%' }}
      />
      {results.length === 0 ? (
        <p className="sh-empty">No results logged.</p>
      ) : (
        <ul className="sh-results__list">
          {[...results].reverse().map((r) => (
            <li key={r.id} className={`sh-results__row sh-results__row--${r.outcome}`}>
              <div className="sh-results__body">
                <div className="sh-results__score">
                  <strong>{r.opponent}</strong>
                  {r.score ? ` — ${r.score}` : ''}{' '}
                  <span className={`hub-tag hub-tag--${r.outcome}`}>{r.outcome}</span>
                </div>
                {r.notes && <div className="sh-notes__text">{r.notes}</div>}
                <div className="sh-results__meta">
                  {r.date && new Date(r.date).toLocaleString()}
                </div>
              </div>
              <div className="sh-results__actions">
                <button
                  type="button"
                  className="hub-btn hub-btn--ghost"
                  onClick={() => remove(r.id)}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
