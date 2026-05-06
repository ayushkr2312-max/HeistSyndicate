import "./RosterPanel.css";

const PLAYERS = [
  {
    handle:  "PHANTOM",
    name:    "Alex Reyes",
    role:    "IGL / Rifler",
    country: "US",
    stats:   { kd: "1.42", rating: "1.18", hs: "58%" },
  },
  {
    handle:  "CIPHER",
    name:    "Jordan Lee",
    role:    "AWPer",
    country: "UK",
    stats:   { kd: "1.38", rating: "1.14", hs: "44%" },
  },
  {
    handle:  "VORTEX",
    name:    "Sam Torres",
    role:    "Entry Fragger",
    country: "CA",
    stats:   { kd: "1.31", rating: "1.09", hs: "62%" },
  },
  {
    handle:  "WRAITH",
    name:    "Chris Park",
    role:    "Support",
    country: "KR",
    stats:   { kd: "1.22", rating: "1.07", hs: "51%" },
  },
  {
    handle:  "ECHO",
    name:    "Mia Nakamura",
    role:    "Lurker",
    country: "JP",
    stats:   { kd: "1.35", rating: "1.12", hs: "55%" },
  },
];

export default function RosterPanel() {
  return (
    <section className="panel roster-panel">
      <div className="roster-inner">
        <div className="roster-header">
          <p className="section-eyebrow">The Squad</p>
          <span className="accent-line" />
          <h2 className="section-title">Our <span>Roster</span></h2>
        </div>

        <div className="roster-grid">
          {PLAYERS.map((p) => (
            <div key={p.handle} className="player-card">
              {/* Front face */}
              <div className="player-card__face player-card__front">
                <div className="player-card__avatar" aria-hidden="true">
                  <span>{p.handle[0]}</span>
                </div>
                <div className="player-card__info">
                  <span className="player-card__handle">{p.handle}</span>
                  <span className="player-card__name">{p.name}</span>
                  <span className="player-card__role">{p.role}</span>
                </div>
                <span className="player-card__country">{p.country}</span>
              </div>

              {/* Back face — stats on hover */}
              <div className="player-card__face player-card__back">
                <span className="player-card__handle player-card__handle--back">
                  {p.handle}
                </span>
                <div className="player-card__stats">
                  {Object.entries(p.stats).map(([key, val]) => (
                    <div key={key} className="player-stat">
                      <span className="player-stat__val">{val}</span>
                      <span className="player-stat__key">{key.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
                <span className="player-card__view-hint">Season 2025 Stats</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="roster-divider" aria-hidden="true" />
    </section>
  );
}
