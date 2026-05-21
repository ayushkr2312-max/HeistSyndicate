import { useMemo } from 'react'
import { TEAM_TAG } from '../config.js'
import { useThubBundle } from '../hooks/useThubStorage.js'
import { THUB_KEYS } from '../storage/keys.js'

function countNotes(notes) {
  return (notes?.teamNotes?.length || 0) +
    (notes?.players?.reduce((a, p) => a + (p.notes?.length || 0), 0) || 0)
}

export default function OwnerDashboard({ syncStatus, onPush }) {
  const bundle = useThubBundle()

  const stats = useMemo(() => {
    const schedule = bundle[THUB_KEYS.schedule]
    const scouting = bundle[THUB_KEYS.scouting]
    const vods = bundle[THUB_KEYS.vods]
    const briefing = bundle[THUB_KEYS.briefing]
    const aim = bundle[THUB_KEYS.aim]

    const upcoming = schedule?.events?.length || 0
    const teams = scouting?.teams?.length || 0
    const vodQueued = vods?.queue?.filter((v) => v.status !== 'reviewed').length || 0
    const checkDone = briefing?.checklist?.filter((c) => c.done).length || 0
    const checkTotal = briefing?.checklist?.length || 0
    const aimSessions = aim?.players?.reduce((a, p) => a + (p.log?.length || 0), 0) || 0

    return { upcoming, teams, vodQueued, checkDone, checkTotal, aimSessions }
  }, [bundle])

  const meta = bundle[THUB_KEYS.meta] || {}
  const settings = bundle[THUB_KEYS.settings] || {}
  const comps = bundle[THUB_KEYS.comps]
  const notes = bundle[THUB_KEYS.notes]

  return (
    <section className="hub-section hub-section--owner">
      <header className="hub-section__head">
        <h2 className="hub-section__title">Owner Dashboard</h2>
        <p className="hub-section__desc">
          Executive snapshot — {TEAM_TAG} hub health at a glance.
        </p>
      </header>

      <div className="hub-owner-stats">
        <div className="hub-stat-card">
          <span className="hub-stat-card__val">{stats.upcoming}</span>
          <span className="hub-stat-card__lbl">Week events</span>
        </div>
        <div className="hub-stat-card">
          <span className="hub-stat-card__val">{stats.teams}</span>
          <span className="hub-stat-card__lbl">Scouted teams</span>
        </div>
        <div className="hub-stat-card">
          <span className="hub-stat-card__val">{countNotes(notes)}</span>
          <span className="hub-stat-card__lbl">Notes total</span>
        </div>
        <div className="hub-stat-card">
          <span className="hub-stat-card__val">{stats.vodQueued}</span>
          <span className="hub-stat-card__lbl">VODs pending</span>
        </div>
        <div className="hub-stat-card">
          <span className="hub-stat-card__val">
            {stats.checkDone}/{stats.checkTotal}
          </span>
          <span className="hub-stat-card__lbl">Briefing checklist</span>
        </div>
        <div className="hub-stat-card">
          <span className="hub-stat-card__val">{stats.aimSessions}</span>
          <span className="hub-stat-card__lbl">Aim log entries</span>
        </div>
      </div>

      <div className="hub-owner-panels">
        <div className="hub-owner-panel">
          <h3 className="hub-subtitle">Active comp</h3>
          <p className="hub-mono">
            H {comps?.slots?.heavy} · M {comps?.slots?.medium} · L {comps?.slots?.light}
          </p>
        </div>
        <div className="hub-owner-panel">
          <h3 className="hub-subtitle">Next match</h3>
          <p>{bundle[THUB_KEYS.briefing]?.nextMatch || '—'}</p>
          <p className="hub-muted">vs {bundle[THUB_KEYS.briefing]?.opponent || 'TBD'}</p>
        </div>
        <div className="hub-owner-panel">
          <h3 className="hub-subtitle">Sync</h3>
          <p className="hub-mono">Status: {syncStatus}</p>
          <p className="hub-muted">
            Local: {meta.lastLocalSave ? new Date(meta.lastLocalSave).toLocaleString() : '—'}
          </p>
          <p className="hub-muted">
            Remote: {meta.lastRemoteSync ? new Date(meta.lastRemoteSync).toLocaleString() : '—'}
          </p>
          {settings.syncEnabled && onPush && (
            <button type="button" className="hub-btn hub-btn--accent hub-btn--xs" onClick={onPush}>
              Push now
            </button>
          )}
        </div>
        <div className="hub-owner-panel">
          <h3 className="hub-subtitle">Scouting highlights</h3>
          <ul className="hub-owner-list">
            {(bundle[THUB_KEYS.scouting]?.teams || []).slice(0, 5).map((t) => (
              <li key={t.id}>
                <strong>{t.name}</strong> — {t.results?.length || 0} results
              </li>
            ))}
          </ul>
        </div>
        <div className="hub-owner-panel">
          <h3 className="hub-subtitle">VOD queue</h3>
          <ul className="hub-owner-list">
            {(bundle[THUB_KEYS.vods]?.queue || []).slice(0, 6).map((v) => (
              <li key={v.id}>
                [{v.status}] {v.title} {v.assignee ? `→ ${v.assignee}` : ''}
              </li>
            ))}
          </ul>
        </div>
        <div className="hub-owner-panel">
          <h3 className="hub-subtitle">Pinned team notes</h3>
          <ul className="hub-owner-list">
            {(bundle[THUB_KEYS.notes]?.teamNotes || [])
              .filter((n) => n.pinned)
              .slice(0, 5)
              .map((n) => (
                <li key={n.id}>{n.text}</li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
