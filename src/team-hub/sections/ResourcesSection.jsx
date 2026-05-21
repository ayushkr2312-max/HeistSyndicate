import { THUB_KEYS } from '../storage/keys.js'
import { useThubStorage } from '../hooks/useThubStorage.js'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function ResourcesSection({ onChange }) {
  const [data, setData] = useThubStorage(THUB_KEYS.resources)

  const update = (links) => {
    setData({ links })
    onChange?.()
  }

  const add = () => {
    update([...data.links, { id: uid(), label: 'New link', url: 'https://' }])
  }

  const patch = (id, p) => {
    update(data.links.map((l) => (l.id === id ? { ...l, ...p } : l)))
  }

  const remove = (id) => {
    update(data.links.filter((l) => l.id !== id))
  }

  return (
    <section className="hub-section">
      <header className="hub-section__head">
        <h2 className="hub-section__title">Resources</h2>
        <p className="hub-section__desc">Quick links: rules, comms, brand, docs.</p>
      </header>

      <button type="button" className="hub-btn hub-btn--accent" onClick={add}>
        + Link
      </button>

      <ul className="hub-resource-list">
        {data.links.map((link) => (
          <li key={link.id} className="hub-resource-item">
            <input
              className="hub-input"
              value={link.label}
              onChange={(e) => patch(link.id, { label: e.target.value })}
            />
            <input
              className="hub-input"
              value={link.url}
              onChange={(e) => patch(link.id, { url: e.target.value })}
            />
            <a href={link.url} target="_blank" rel="noreferrer" className="hub-link">
              →
            </a>
            <button
              type="button"
              className="hub-btn hub-btn--ghost hub-btn--xs"
              onClick={() => remove(link.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
