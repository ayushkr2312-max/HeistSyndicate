import { useMemo } from 'react'
import { THUB_KEYS } from '../storage/keys.js'
import { useThubStorage } from '../hooks/useThubStorage.js'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function twitchThumb(url) {
  const clip = url.match(/clips\.twitch\.tv\/([^/?]+)/i)
  if (clip) return `https://clips-media-assets2.twitch.tv/${clip[1]}-preview-480x272.jpg`
  const vod = url.match(/twitch\.tv\/videos\/(\d+)/i)
  if (vod) return `https://static-cdn.jtvnw.net/previews-ttv/live_user_thumb-preview.jpg`
  return null
}

export default function ClipsSection({ onChange }) {
  const [data, setData] = useThubStorage(THUB_KEYS.clips)
  const clips = Array.isArray(data?.clips) ? data.clips : []

  const update = (patch) => {
    setData((d) => {
      const next = { ...d, ...patch }
      onChange?.()
      return next
    })
  }

  const tags = useMemo(() => {
    const set = new Set()
    clips.forEach((c) => (c.tags || []).forEach((t) => set.add(t)))
    return ['all', ...set]
  }, [clips])

  const filtered = useMemo(() => {
    if (data.filter === 'all') return clips
    return clips.filter((c) => (c.tags || []).includes(data.filter))
  }, [clips, data.filter])

  const add = () => {
    update({
      clips: [
        ...clips,
        {
          id: uid(),
          title: 'New clip',
          url: 'https://clips.twitch.tv/',
          tags: [],
          player: '',
        },
      ],
    })
  }

  const patch = (id, p) => {
    update({ ...data, clips: clips.map((c) => (c.id === id ? { ...c, ...p } : c)) })
  }

  const remove = (id) => {
    update({ ...data, clips: clips.filter((c) => c.id !== id) })
  }

  return (
    <section className="hub-section">
      <header className="hub-section__head">
        <h2 className="hub-section__title">Clips</h2>
        <p className="hub-section__desc">Filtered Twitch reference grid by tag and player.</p>
      </header>

      <div className="hub-toolbar">
        <div className="hub-filter-tabs">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              className={`hub-filter-tab${data.filter === t ? ' hub-filter-tab--on' : ''}`}
              onClick={() => update({ filter: t })}
            >
              {t}
            </button>
          ))}
        </div>
        <button type="button" className="hub-btn hub-btn--accent" onClick={add}>
          + Clip
        </button>
      </div>

      <div className="hub-clips-grid">
        {filtered.map((clip) => {
          const thumb = twitchThumb(clip.url)
          return (
            <article key={clip.id} className="hub-clip-tile">
              <a href={clip.url} target="_blank" rel="noreferrer" className="hub-clip-tile__thumb">
                {thumb ? (
                  <img src={thumb} alt="" />
                ) : (
                  <span className="hub-clip-tile__placeholder">▶</span>
                )}
              </a>
              <input
                className="hub-input hub-input--inline"
                value={clip.title}
                onChange={(e) => patch(clip.id, { title: e.target.value })}
              />
              <input
                className="hub-input"
                value={clip.url}
                onChange={(e) => patch(clip.id, { url: e.target.value })}
              />
              <input
                className="hub-input"
                placeholder="tags: macro, monaco"
                value={(clip.tags || []).join(', ')}
                onChange={(e) =>
                  patch(clip.id, {
                    tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
              <input
                className="hub-input"
                placeholder="Player"
                value={clip.player}
                onChange={(e) => patch(clip.id, { player: e.target.value })}
              />
              <button
                type="button"
                className="hub-btn hub-btn--ghost hub-btn--xs"
                onClick={() => remove(clip.id)}
              >
                ×
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
