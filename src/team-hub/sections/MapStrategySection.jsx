import { THUB_KEYS } from '../storage/keys.js'
import { useThubStorage } from '../hooks/useThubStorage.js'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function MapStrategySection({ subId, onChange }) {
  const [data, setData] = useThubStorage(THUB_KEYS.maps)
  const mapId = subId?.replace('map-', '')
  const map = data.maps.find((m) => m.id === mapId) ?? data.maps[0]

  if (!map) return null

  const patchMap = (patch) => {
    const maps = data.maps.map((m) => (m.id === map.id ? { ...m, ...patch } : m))
    const next = { ...data, maps }
    setData(next)
    onChange?.()
  }

  const addClip = () => {
    patchMap({
      clips: [
        ...(map.clips || []),
        { id: uid(), title: 'Clip', url: 'https://clips.twitch.tv/' },
      ],
    })
  }

  const patchClip = (clipId, patch) => {
    patchMap({
      clips: (map.clips || []).map((c) =>
        c.id === clipId ? { ...c, ...patch } : c,
      ),
    })
  }

  const removeClip = (clipId) => {
    patchMap({ clips: (map.clips || []).filter((c) => c.id !== clipId) })
  }

  const twitchEmbed = (url) => {
    const m = url.match(/clips\.twitch\.tv\/([^/?]+)/i)
    if (!m) return null
    return `https://clips.twitch.tv/embed?clip=${m[1]}&parent=${window.location.hostname}`
  }

  return (
    <section className="hub-section">
      <header className="hub-section__head">
        <h2 className="hub-section__title">Map Strategy — {map.name}</h2>
        <p className="hub-section__desc">Macro, rollouts, callout points, reference image.</p>
      </header>

      <label className="hub-label">
        Reference image URL
        <input
          className="hub-input"
          value={map.imageUrl}
          onChange={(e) => patchMap({ imageUrl: e.target.value })}
          placeholder="https://…"
        />
      </label>
      {map.imageUrl && (
        <img src={map.imageUrl} alt="" className="hub-map-image" />
      )}

      <label className="hub-label">
        Macro plan
        <textarea
          className="hub-input hub-textarea"
          rows={5}
          value={map.macro}
          onChange={(e) => patchMap({ macro: e.target.value })}
          placeholder="Opening approach, economy, win condition…"
        />
      </label>

      <label className="hub-label">
        Rollouts
        <textarea
          className="hub-input hub-textarea"
          rows={4}
          value={map.rollouts}
          onChange={(e) => patchMap({ rollouts: e.target.value })}
        />
      </label>

      <label className="hub-label">
        Callout points
        <textarea
          className="hub-input hub-textarea"
          rows={4}
          value={map.points}
          onChange={(e) => patchMap({ points: e.target.value })}
        />
      </label>

      <div className="hub-subhead">
        <h3 className="hub-subtitle">Twitch clips</h3>
        <button type="button" className="hub-btn hub-btn--xs" onClick={addClip}>
          + Clip
        </button>
      </div>
      <div className="hub-clip-grid">
        {(map.clips || []).map((clip) => {
          const embed = twitchEmbed(clip.url)
          return (
            <div key={clip.id} className="hub-clip-card">
              <input
                className="hub-input hub-input--inline"
                value={clip.title}
                onChange={(e) => patchClip(clip.id, { title: e.target.value })}
              />
              <input
                className="hub-input"
                value={clip.url}
                onChange={(e) => patchClip(clip.id, { url: e.target.value })}
              />
              {embed ? (
                <iframe
                  title={clip.title}
                  src={embed}
                  className="hub-clip-embed"
                  allowFullScreen
                />
              ) : (
                <a href={clip.url} target="_blank" rel="noreferrer" className="hub-link">
                  Open clip
                </a>
              )}
              <button
                type="button"
                className="hub-btn hub-btn--ghost hub-btn--xs"
                onClick={() => removeClip(clip.id)}
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
