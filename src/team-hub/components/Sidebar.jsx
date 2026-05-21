import { useState } from 'react'
import { NAV_SECTIONS, OWNER_SECTION, TEAM_NAME } from '../config.js'

export default function Sidebar({
  active,
  onNavigate,
  syncStatus,
  syncEnabled,
  onToggleSync,
  onLock,
  isOwner,
  settings,
}) {
  const [expanded, setExpanded] = useState({ notes: true, maps: true })
  const teamLabel = settings?.teamName || TEAM_NAME

  const toggleGroup = (id) =>
    setExpanded((e) => ({ ...e, [id]: !e[id] }))

  return (
    <aside className="hub-sidebar">
      <div className="hub-sidebar__brand">
        <span className="hub-sidebar__name">{teamLabel}</span>
        <span className="hub-sidebar__slash"> // HUB</span>
      </div>

      <div className="hub-sidebar__sync">
        <span className={`hub-sync-dot hub-sync-dot--${syncStatus}`} />
        <span className="hub-sidebar__sync-label">
          {syncEnabled ? syncStatus : 'local only'}
        </span>
        {onToggleSync && (
          <button
            type="button"
            className="hub-btn hub-btn--ghost hub-btn--xs"
            onClick={onToggleSync}
            title="Toggle cloud sync"
          >
            ⇄
          </button>
        )}
      </div>

      <nav className="hub-sidebar__nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.id} className="hub-nav-group">
            {section.children ? (
              <>
                <button
                  type="button"
                  className={`hub-nav-item${active.startsWith(section.id) ? ' hub-nav-item--active' : ''}`}
                  onClick={() => toggleGroup(section.id)}
                >
                  <span className="hub-nav-icon">{section.icon}</span>
                  <span className="hub-nav-label">{section.label}</span>
                  <span className="hub-nav-chevron">
                    {expanded[section.id] ? '▾' : '▸'}
                  </span>
                </button>
                {expanded[section.id] &&
                  section.children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      className={`hub-nav-sub${active === child.id ? ' hub-nav-sub--active' : ''}`}
                      onClick={() => onNavigate(child.id)}
                    >
                      {child.label}
                    </button>
                  ))}
              </>
            ) : (
              <button
                type="button"
                className={`hub-nav-item${active === section.id ? ' hub-nav-item--active' : ''}`}
                onClick={() => onNavigate(section.id)}
              >
                <span className="hub-nav-icon">{section.icon}</span>
                <span className="hub-nav-label">{section.label}</span>
              </button>
            )}
          </div>
        ))}

        {isOwner && (
          <button
            type="button"
            className={`hub-nav-item hub-nav-item--owner${active === OWNER_SECTION.id ? ' hub-nav-item--active' : ''}`}
            onClick={() => onNavigate(OWNER_SECTION.id)}
          >
            <span className="hub-nav-icon">{OWNER_SECTION.icon}</span>
            <span className="hub-nav-label">{OWNER_SECTION.label}</span>
          </button>
        )}
      </nav>

      <button type="button" className="hub-sidebar__lock hub-btn" onClick={onLock}>
        LOCK
      </button>
    </aside>
  )
}
