import { DEFAULT_PLAYERS } from '../config.js'
import { THUB_KEYS } from '../storage/keys.js'
import { useThubStorage } from '../hooks/useThubStorage.js'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const SLOTS = [
  { key: 'heavy', label: 'HEAVY' },
  { key: 'medium', label: 'MEDIUM' },
  { key: 'light', label: 'LIGHT' },
]

export default function TeamCompsSection({ onChange }) {
  const [data, setData] = useThubStorage(THUB_KEYS.comps)
  const handles = DEFAULT_PLAYERS.map((p) => p.handle)

  const update = (patch) => {
    setData((d) => {
      const next = { ...d, ...patch }
      onChange?.()
      return next
    })
  }

  const setSlot = (key, value) => update({ slots: { ...data.slots, [key]: value } })

  const addPreset = () => {
    update({
      presets: [
        ...data.presets,
        {
          id: uid(),
          name: 'New preset',
          heavy: data.slots.heavy,
          medium: data.slots.medium,
          light: data.slots.light,
          notes: '',
        },
      ],
    })
  }

  const patchPreset = (id, patch) => {
    update({
      presets: data.presets.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })
  }

  const removePreset = (id) => {
    update({ presets: data.presets.filter((p) => p.id !== id) })
  }

  const loadPreset = (preset) => {
    update({
      slots: { heavy: preset.heavy, medium: preset.medium, light: preset.light },
    })
  }

  return (
    <section className="hub-section">
      <header className="hub-section__head">
        <h2 className="hub-section__title">Team Comps</h2>
        <p className="hub-section__desc">Active HEAVY / MEDIUM / LIGHT assignment for Finals.</p>
      </header>

      <div className="hub-comp-slots">
        {SLOTS.map(({ key, label }) => (
          <div key={key} className={`hub-comp-slot hub-comp-slot--${key}`}>
            <span className="hub-comp-slot__label">{label}</span>
            <select
              className="hub-input"
              value={data.slots[key]}
              onChange={(e) => setSlot(key, e.target.value)}
            >
              {handles.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <label className="hub-label">
        Comp notes
        <textarea
          className="hub-input hub-textarea"
          rows={3}
          value={data.notes}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </label>

      <div className="hub-subhead">
        <h3 className="hub-subtitle">Presets</h3>
        <button type="button" className="hub-btn hub-btn--xs" onClick={addPreset}>
          + Preset
        </button>
      </div>
      <div className="hub-preset-list">
        {data.presets.map((p) => (
          <div key={p.id} className="hub-preset-card">
            <input
              className="hub-input hub-input--inline"
              value={p.name}
              onChange={(e) => patchPreset(p.id, { name: e.target.value })}
            />
            <div className="hub-preset-row">
              {SLOTS.map(({ key, label }) => (
                <label key={key} className="hub-label hub-label--compact">
                  {label}
                  <select
                    className="hub-input"
                    value={p[key]}
                    onChange={(e) => patchPreset(p.id, { [key]: e.target.value })}
                  >
                    {handles.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <input
              className="hub-input"
              placeholder="Preset notes"
              value={p.notes}
              onChange={(e) => patchPreset(p.id, { notes: e.target.value })}
            />
            <div className="hub-preset-actions">
              <button
                type="button"
                className="hub-btn hub-btn--accent hub-btn--xs"
                onClick={() => loadPreset(p)}
              >
                Load
              </button>
              <button
                type="button"
                className="hub-btn hub-btn--ghost hub-btn--xs"
                onClick={() => removePreset(p.id)}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
