import { useMemo } from 'react'
import ResultLog from '../../shared/ResultLog.jsx'
import { THUB_KEYS } from '../storage/keys.js'
import { useThubStorage } from '../hooks/useThubStorage.js'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function ScoutingSection({ onChange }) {
  const [data, setData] = useThubStorage(THUB_KEYS.scouting)
  const teams = Array.isArray(data?.teams) ? data.teams : []

  const update = (patch) => {
    setData((d) => {
      const next = { ...d, ...patch }
      onChange?.()
      return next
    })
  }

  const filtered = useMemo(() => {
    const q = (data.playerSearch || '').trim().toLowerCase()
    if (!q) return teams
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.players.some((p) => p.toLowerCase().includes(q)),
    )
  }, [teams, data.playerSearch])

  const addTeam = () => {
    update({
      teams: [
        ...teams,
        {
          id: uid(),
          name: 'New opponent',
          collapsed: false,
          traits: '',
          players: [],
          results: [],
        },
      ],
    })
  }

  const patchTeam = (id, patch) => {
    update({
      teams: teams.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })
  }

  const removeTeam = (id) => {
    update({ ...data, teams: teams.filter((t) => t.id !== id) })
  }

  return (
    <section className="hub-section">
      <header className="hub-section__head">
        <h2 className="hub-section__title">Opponent Scouting</h2>
        <p className="hub-section__desc">
          Collapsible team files, traits, player tags, and match history.
        </p>
      </header>

      <div className="hub-toolbar">
        <input
          className="hub-input"
          placeholder="Search teams or player handles…"
          value={data.playerSearch}
          onChange={(e) => update({ playerSearch: e.target.value })}
        />
        <button type="button" className="hub-btn hub-btn--accent" onClick={addTeam}>
          + Team
        </button>
      </div>

      <div className="hub-scout-list">
        {filtered.map((team) => (
          <div key={team.id} className="hub-scout-card">
            <button
              type="button"
              className="hub-scout-card__head"
              onClick={() => patchTeam(team.id, { collapsed: !team.collapsed })}
            >
              <span>{team.collapsed ? '▸' : '▾'}</span>
              <input
                className="hub-input hub-input--inline"
                value={team.name}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => patchTeam(team.id, { name: e.target.value })}
              />
              <button
                type="button"
                className="hub-btn hub-btn--ghost hub-btn--xs"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTeam(team.id)
                }}
              >
                ×
              </button>
            </button>
            {!team.collapsed && (
              <div className="hub-scout-card__body">
                <label className="hub-label">
                  Traits / tendencies
                  <textarea
                    className="hub-input hub-textarea"
                    value={team.traits}
                    onChange={(e) => patchTeam(team.id, { traits: e.target.value })}
                    rows={3}
                  />
                </label>
                <label className="hub-label">
                  Players (comma-separated)
                  <input
                    className="hub-input"
                    value={team.players.join(', ')}
                    onChange={(e) =>
                      patchTeam(team.id, {
                        players: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                  />
                </label>
                <h3 className="hub-subtitle">Results</h3>
                <ResultLog
                  results={team.results}
                  onChange={(results) => patchTeam(team.id, { results })}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
