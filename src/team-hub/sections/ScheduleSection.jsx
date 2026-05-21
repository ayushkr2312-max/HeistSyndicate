import { useMemo } from 'react'
import { TIMEZONES } from '../config.js'
import { THUB_KEYS } from '../storage/keys.js'
import { useThubStorage } from '../hooks/useThubStorage.js'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TYPES = ['scrim', 'match', 'vod', 'meeting', 'break']

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function getWeekStart(iso) {
  const d = new Date(iso)
  d.setHours(0, 0, 0, 0)
  return d
}

function shiftWeek(start, delta) {
  const d = new Date(start)
  d.setDate(d.getDate() + delta * 7)
  return d.toISOString()
}

function formatInTz(weekStartIso, day, hour, minute, tz) {
  const monday = getWeekStart(weekStartIso)
  const utc = new Date(monday)
  utc.setUTCDate(utc.getUTCDate() + day)
  utc.setUTCHours(hour, minute, 0, 0)
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(utc)
  } catch {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} UTC`
  }
}

export default function ScheduleSection({ onChange }) {
  const [raw, setData] = useThubStorage(THUB_KEYS.schedule)
  const data = { events: [], timezone: 'UTC', weekStart: new Date().toISOString(), ...raw }
  const events = Array.isArray(data.events) ? data.events : []

  const weekStart = useMemo(
    () => getWeekStart(data.weekStart || new Date().toISOString()),
    [data.weekStart],
  )

  const update = (patch) => {
    setData((d) => {
      const next = { ...d, ...patch }
      onChange?.()
      return next
    })
  }

  const addEvent = (day) => {
    update({
      events: [
        ...events,
        {
          id: uid(),
          title: 'New block',
          day,
          hour: 18,
          minute: 0,
          type: 'scrim',
          notes: '',
        },
      ],
    })
  }

  const patchEvent = (id, patch) => {
    update({
      events: events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })
  }

  const removeEvent = (id) => {
    update({ events: events.filter((e) => e.id !== id) })
  }

  return (
    <section className="hub-section">
      <header className="hub-section__head">
        <h2 className="hub-section__title">Schedule</h2>
        <p className="hub-section__desc">
          Week grid with UTC storage; display uses selected timezone.
        </p>
      </header>

      <div className="hub-toolbar">
        <label className="hub-label">
          Timezone
          <select
            className="hub-input"
            value={data.timezone}
            onChange={(e) => update({ timezone: e.target.value })}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="hub-btn"
          onClick={() => update({ weekStart: shiftWeek(data.weekStart, -1) })}
        >
          ← Prev
        </button>
        <span className="hub-week-label">
          Week of {weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <button
          type="button"
          className="hub-btn"
          onClick={() => update({ weekStart: shiftWeek(data.weekStart, 1) })}
        >
          Next →
        </button>
      </div>

      <div className="hub-week-grid">
        {DAYS.map((label, dayIdx) => (
          <div key={label} className="hub-week-col">
            <div className="hub-week-col__head">
              <span>{label}</span>
              <button
                type="button"
                className="hub-btn hub-btn--xs hub-btn--ghost"
                onClick={() => addEvent(dayIdx)}
              >
                +
              </button>
            </div>
            <div className="hub-week-col__body">
              {events
                .filter((e) => e.day === dayIdx)
                .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute))
                .map((e) => (
                  <div key={e.id} className={`hub-event hub-event--${e.type}`}>
                    <div className="hub-event__time">
                      {formatInTz(data.weekStart, e.day, e.hour, e.minute, data.timezone)}
                    </div>
                    <input
                      className="hub-input hub-input--inline"
                      value={e.title}
                      onChange={(ev) => patchEvent(e.id, { title: ev.target.value })}
                    />
                    <div className="hub-event__row">
                      <input
                        type="number"
                        className="hub-input hub-input--tiny"
                        min={0}
                        max={23}
                        value={e.hour}
                        onChange={(ev) =>
                          patchEvent(e.id, { hour: Number(ev.target.value) })
                        }
                      />
                      :
                      <input
                        type="number"
                        className="hub-input hub-input--tiny"
                        min={0}
                        max={59}
                        value={e.minute}
                        onChange={(ev) =>
                          patchEvent(e.id, { minute: Number(ev.target.value) })
                        }
                      />
                      <span className="hub-muted">UTC</span>
                      <select
                        className="hub-input hub-input--tiny"
                        value={e.type}
                        onChange={(ev) => patchEvent(e.id, { type: ev.target.value })}
                      >
                        {TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      className="hub-input hub-input--inline"
                      placeholder="Notes"
                      value={e.notes}
                      onChange={(ev) => patchEvent(e.id, { notes: ev.target.value })}
                    />
                    <button
                      type="button"
                      className="hub-btn hub-btn--ghost hub-btn--xs"
                      onClick={() => removeEvent(e.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
