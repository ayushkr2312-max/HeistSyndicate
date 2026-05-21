import { THUB_KEYS } from '../storage/keys.js'
import { useThubStorage } from '../hooks/useThubStorage.js'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const STATUS = ['queued', 'assigned', 'reviewed']

export default function VodsSection({ onChange }) {
  const [data, setData] = useThubStorage(THUB_KEYS.vods)

  const update = (queue) => {
    setData({ queue })
    onChange?.()
  }

  const add = () => {
    update([
      ...data.queue,
      {
        id: uid(),
        title: 'Scrim VOD',
        url: '',
        assignee: '',
        status: 'queued',
        priority: 'normal',
      },
    ])
  }

  const patch = (id, p) => {
    update(data.queue.map((v) => (v.id === id ? { ...v, ...p } : v)))
  }

  const remove = (id) => {
    update(data.queue.filter((v) => v.id !== id))
  }

  return (
    <section className="hub-section">
      <header className="hub-section__head">
        <h2 className="hub-section__title">VOD Queue</h2>
        <p className="hub-section__desc">Review backlog with assignee and status.</p>
      </header>

      <button type="button" className="hub-btn hub-btn--accent" onClick={add}>
        + VOD
      </button>

      <div className="hub-vod-list">
        {data.queue.map((v) => (
          <div key={v.id} className={`hub-vod-row hub-vod-row--${v.status}`}>
            <input
              className="hub-input"
              value={v.title}
              onChange={(e) => patch(v.id, { title: e.target.value })}
            />
            <input
              className="hub-input"
              placeholder="URL"
              value={v.url}
              onChange={(e) => patch(v.id, { url: e.target.value })}
            />
            <input
              className="hub-input hub-input--tiny"
              placeholder="Assignee"
              value={v.assignee}
              onChange={(e) => patch(v.id, { assignee: e.target.value })}
            />
            <select
              className="hub-input hub-input--tiny"
              value={v.status}
              onChange={(e) => patch(v.id, { status: e.target.value })}
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              className="hub-input hub-input--tiny"
              value={v.priority}
              onChange={(e) => patch(v.id, { priority: e.target.value })}
            >
              <option value="high">high</option>
              <option value="normal">normal</option>
              <option value="low">low</option>
            </select>
            {v.url && (
              <a href={v.url} target="_blank" rel="noreferrer" className="hub-link">
                Open
              </a>
            )}
            <button
              type="button"
              className="hub-btn hub-btn--ghost hub-btn--xs"
              onClick={() => remove(v.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
