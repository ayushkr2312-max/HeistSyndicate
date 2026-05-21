import { useState } from 'react'
import './shared.css'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function NotesList({
  notes = [],
  onChange,
  placeholder = 'Add note…',
  allowPin = true,
}) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const text = draft.trim()
    if (!text) return
    onChange([
      ...notes,
      { id: uid(), text, pinned: false, createdAt: new Date().toISOString() },
    ])
    setDraft('')
  }

  const remove = (id) => onChange(notes.filter((n) => n.id !== id))

  const togglePin = (id) =>
    onChange(
      notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
    )

  const sorted = [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned))

  return (
    <div className="sh-notes">
      <div className="sh-notes__add">
        <input
          type="text"
          className="hub-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder={placeholder}
        />
        <button type="button" className="hub-btn hub-btn--accent" onClick={add}>
          +
        </button>
      </div>
      {sorted.length === 0 ? (
        <p className="sh-empty">No notes yet.</p>
      ) : (
        <ul className="sh-notes__list">
          {sorted.map((n) => (
            <li
              key={n.id}
              className={`sh-notes__item${n.pinned ? ' sh-notes__item--pinned' : ''}`}
            >
              <div className="sh-notes__body">
                <div className="sh-notes__text">{n.text}</div>
                {n.createdAt && (
                  <div className="sh-notes__meta">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="sh-notes__actions">
                {allowPin && (
                  <button
                    type="button"
                    className="hub-btn hub-btn--ghost"
                    onClick={() => togglePin(n.id)}
                    title={n.pinned ? 'Unpin' : 'Pin'}
                  >
                    {n.pinned ? '◆' : '◇'}
                  </button>
                )}
                <button
                  type="button"
                  className="hub-btn hub-btn--ghost"
                  onClick={() => remove(n.id)}
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
