import NotesList from '../../shared/NotesList.jsx'
import { THUB_KEYS } from '../storage/keys.js'
import { useThubStorage } from '../hooks/useThubStorage.js'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function BriefingSection({ onChange }) {
  const [data, setData] = useThubStorage(THUB_KEYS.briefing)

  const update = (patch) => {
    setData((d) => {
      const next = { ...d, ...patch }
      onChange?.()
      return next
    })
  }

  const toggleCheck = (id) => {
    update({
      checklist: data.checklist.map((c) =>
        c.id === id ? { ...c, done: !c.done } : c,
      ),
    })
  }

  const addCheck = () => {
    update({
      checklist: [
        ...data.checklist,
        { id: uid(), text: 'New item', done: false },
      ],
    })
  }

  const doneCount = data.checklist.filter((c) => c.done).length

  return (
    <section className="hub-section">
      <header className="hub-section__head">
        <h2 className="hub-section__title">Match Briefing</h2>
        <p className="hub-section__desc">
          Pre-match board: opponent, map pool, checklist ({doneCount}/{data.checklist.length}).
        </p>
      </header>

      <div className="hub-brief-grid">
        <label className="hub-label">
          Next match
          <input
            className="hub-input"
            value={data.nextMatch}
            onChange={(e) => update({ nextMatch: e.target.value })}
          />
        </label>
        <label className="hub-label">
          Opponent
          <input
            className="hub-input"
            value={data.opponent}
            onChange={(e) => update({ opponent: e.target.value })}
          />
        </label>
        <label className="hub-label hub-label--wide">
          Map pool focus
          <input
            className="hub-input"
            value={data.mapPool}
            onChange={(e) => update({ mapPool: e.target.value })}
          />
        </label>
      </div>

      <h3 className="hub-subtitle">Match-day checklist</h3>
      <ul className="hub-checklist">
        {data.checklist.map((item) => (
          <li key={item.id} className={item.done ? 'hub-checklist__done' : ''}>
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleCheck(item.id)}
            />
            <input
              className="hub-input hub-input--inline"
              value={item.text}
              onChange={(e) =>
                update({
                  checklist: data.checklist.map((c) =>
                    c.id === item.id ? { ...c, text: e.target.value } : c,
                  ),
                })
              }
            />
          </li>
        ))}
      </ul>
      <button type="button" className="hub-btn hub-btn--xs" onClick={addCheck}>
        + Item
      </button>

      <h3 className="hub-subtitle">Standup notes</h3>
      <NotesList
        notes={data.standupNotes}
        onChange={(standupNotes) => update({ standupNotes })}
        placeholder="Daily standup note…"
      />
    </section>
  )
}
