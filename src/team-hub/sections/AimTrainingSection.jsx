import NotesList from '../../shared/NotesList.jsx'
import { THUB_KEYS } from '../storage/keys.js'
import { useThubStorage } from '../hooks/useThubStorage.js'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function AimTrainingSection({ onChange }) {
  const [raw, setData] = useThubStorage(THUB_KEYS.aim)
  const players = Array.isArray(raw?.players) ? raw.players : []

  const patchPlayer = (id, patch) => {
    const next = { ...raw, players: players.map((p) => (p.id === id ? { ...p, ...patch } : p)) }
    setData(next)
    onChange?.()
  }

  const addScenario = (playerId) => {
    const p = players.find((x) => x.id === playerId)
    if (!p) return
    patchPlayer(playerId, {
      scenarios: [
        ...p.scenarios,
        { id: uid(), name: 'New scenario', target: '', best: '' },
      ],
    })
  }

  const patchScenario = (playerId, scenarioId, patch) => {
    const p = players.find((x) => x.id === playerId)
    if (!p) return
    patchPlayer(playerId, {
      scenarios: p.scenarios.map((s) =>
        s.id === scenarioId ? { ...s, ...patch } : s,
      ),
    })
  }

  const logSession = (playerId) => {
    const p = players.find((x) => x.id === playerId)
    if (!p) return
    patchPlayer(playerId, {
      log: [
        ...p.log,
        {
          id: uid(),
          text: `Session ${new Date().toLocaleDateString()}`,
          createdAt: new Date().toISOString(),
        },
      ],
    })
  }

  return (
    <section className="hub-section">
      <header className="hub-section__head">
        <h2 className="hub-section__title">Aim Training</h2>
        <p className="hub-section__desc">Per-player Kovaaks scenarios, targets, and progress log.</p>
      </header>

      <div className="hub-aim-grid">
        {players.map((player) => (
          <div key={player.id} className="hub-aim-card">
            <h3 className="hub-subtitle">{player.handle}</h3>
            <div className="hub-aim-scenarios">
              {(player.scenarios || []).map((s) => (
                <div key={s.id} className="hub-aim-row">
                  <input
                    className="hub-input"
                    value={s.name}
                    onChange={(e) =>
                      patchScenario(player.id, s.id, { name: e.target.value })
                    }
                    placeholder="Scenario"
                  />
                  <input
                    className="hub-input hub-input--tiny"
                    value={s.target}
                    onChange={(e) =>
                      patchScenario(player.id, s.id, { target: e.target.value })
                    }
                    placeholder="Target"
                  />
                  <input
                    className="hub-input hub-input--tiny"
                    value={s.best}
                    onChange={(e) =>
                      patchScenario(player.id, s.id, { best: e.target.value })
                    }
                    placeholder="PB"
                  />
                </div>
              ))}
              <button
                type="button"
                className="hub-btn hub-btn--xs"
                onClick={() => addScenario(player.id)}
              >
                + Scenario
              </button>
            </div>
            <div className="hub-subhead">
              <h4 className="hub-subtitle">Progress log</h4>
              <button
                type="button"
                className="hub-btn hub-btn--xs hub-btn--ghost"
                onClick={() => logSession(player.id)}
              >
                Log session
              </button>
            </div>
            <NotesList
              notes={player.log || []}
              onChange={(log) => patchPlayer(player.id, { log })}
              allowPin={false}
              placeholder="Add training note…"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
