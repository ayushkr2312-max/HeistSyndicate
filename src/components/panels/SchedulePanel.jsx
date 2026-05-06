import "./SchedulePanel.css";

const MATCHES = [
  {
    date:     "May 12, 2026",
    time:     "18:00 UTC",
    opponent: "Shadow Force",
    event:    "ESL Open Season 4",
    stage:    "Group Stage",
    status:   "upcoming",
  },
  {
    date:     "May 18, 2026",
    time:     "20:00 UTC",
    opponent: "Iron Wolves",
    event:    "ESL Open Season 4",
    stage:    "Round of 16",
    status:   "upcoming",
  },
  {
    date:     "May 24, 2026",
    time:     "19:00 UTC",
    opponent: "Zero Division",
    event:    "DreamHack Summer",
    stage:    "Qualifier",
    status:   "upcoming",
  },
  {
    date:     "Apr 30, 2026",
    time:     "17:00 UTC",
    opponent: "Apex Phantom",
    event:    "ESL Open Season 3",
    stage:    "Grand Final",
    status:   "win",
    score:    "2 – 0",
  },
  {
    date:     "Apr 15, 2026",
    time:     "16:00 UTC",
    opponent: "NightShade",
    event:    "ESL Open Season 3",
    stage:    "Semi-Final",
    status:   "win",
    score:    "2 – 1",
  },
];

export default function SchedulePanel() {
  return (
    <section className="panel schedule-panel">
      <div className="schedule-inner">
        <div className="schedule-header">
          <p className="section-eyebrow">Upcoming & Recent</p>
          <span className="accent-line" />
          <h2 className="section-title">Match <span>Schedule</span></h2>
        </div>

        <div className="timeline">
          {MATCHES.map((m, i) => (
            <div key={i} className={`timeline-row timeline-row--${m.status}`}>
              <div className="timeline-date">
                <span className="timeline-date__day">{m.date.split(",")[0]}</span>
                <span className="timeline-date__rest">{m.date.split(",")[1]}</span>
                <span className="timeline-date__time">{m.time}</span>
              </div>

              <div className="timeline-node" aria-hidden="true">
                <div className="timeline-node__dot" />
                <div className="timeline-node__line" />
              </div>

              <div className="timeline-card">
                <div className="timeline-card__top">
                  <div className="timeline-card__vs">
                    <span className="timeline-card__us">THS</span>
                    <span className="timeline-card__sep">vs</span>
                    <span className="timeline-card__opp">{m.opponent}</span>
                  </div>
                  {m.score && (
                    <span className="timeline-card__score">{m.score}</span>
                  )}
                  {m.status === "upcoming" && (
                    <span className="timeline-card__badge timeline-card__badge--upcoming">
                      Upcoming
                    </span>
                  )}
                  {m.status === "win" && (
                    <span className="timeline-card__badge timeline-card__badge--win">
                      Win
                    </span>
                  )}
                </div>
                <div className="timeline-card__meta">
                  <span>{m.event}</span>
                  <span className="timeline-card__dot-sep">·</span>
                  <span>{m.stage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="schedule-divider" aria-hidden="true" />
    </section>
  );
}
