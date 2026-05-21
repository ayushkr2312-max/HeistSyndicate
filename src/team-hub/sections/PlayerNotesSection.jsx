import NotesList from '../../shared/NotesList.jsx'
import { THUB_KEYS } from '../storage/keys.js'
import { useThubStorage } from '../hooks/useThubStorage.js'

export default function PlayerNotesSection({ subId, onChange }) {
  const [data, setData] = useThubStorage(THUB_KEYS.notes)

  const update = (next) => {
    setData(next)
    onChange?.()
  }

  if (subId === 'notes-team') {
    return (
      <section className="hub-section">
        <header className="hub-section__head">
          <h2 className="hub-section__title">Team Notes</h2>
          <p className="hub-section__desc">Shared callouts, strats, and admin.</p>
        </header>
        <NotesList
          notes={data.teamNotes}
          onChange={(teamNotes) => update({ ...data, teamNotes })}
        />
      </section>
    )
  }

  const idx = subId === 'notes-p1' ? 0 : subId === 'notes-p2' ? 1 : 2
  const player = data.players[idx]
  if (!player) return null

  const rename = (field, value) => {
    const players = [...data.players]
    players[idx] = { ...players[idx], [field]: value }
    update({ ...data, players })
  }

  const setNotes = (notes) => {
    const players = [...data.players]
    players[idx] = { ...players[idx], notes }
    update({ ...data, players })
  }

  return (
    <section className="hub-section">
      <header className="hub-section__head">
        <h2 className="hub-section__title">Player Notes</h2>
        <div className="hub-inline-fields">
          <label className="hub-label">
            Handle
            <input
              className="hub-input"
              value={player.handle}
              onChange={(e) => rename('handle', e.target.value)}
            />
          </label>
          <label className="hub-label">
            Name
            <input
              className="hub-input"
              value={player.name}
              onChange={(e) => rename('name', e.target.value)}
            />
          </label>
        </div>
      </header>
      <NotesList
        notes={player.notes}
        onChange={setNotes}
        placeholder={`Note for ${player.handle}…`}
      />
    </section>
  )
}
