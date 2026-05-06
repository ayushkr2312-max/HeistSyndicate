import "./AboutPanel.css";

const STATS = [
  { value: "3+",  label: "Years Active"   },
  { value: "12",  label: "Tournaments Won" },
  { value: "50K", label: "Community"       },
  { value: "6",   label: "Titles"          },
];

export default function AboutPanel() {
  return (
    <section className="panel about-panel">
      <div className="about-inner">
        {/* Left: image / visual block */}
        <div className="about-image-wrap">
          <div className="about-image-bg" aria-hidden="true" />
          <div className="about-image-accent" aria-hidden="true" />
          <div className="about-image-label">
            <span>Founded 2024</span>
          </div>
        </div>

        {/* Right: text content */}
        <div className="about-text">
          <p className="section-eyebrow">Who We Are</p>
          <span className="accent-line" />
          <h2 className="section-title">
            Built for <span>Victory</span>
          </h2>
          <p className="section-body">
            The Heist Syndicate is more than a team — it's a movement. We're
            a collective of elite competitors who thrive under pressure,
            communicate like clockwork, and execute when it matters most.
          </p>
          <p className="section-body" style={{ marginTop: "1rem" }}>
            From grassroots origins to championship stages, we've built our
            legacy one calculated play at a time. Every roster move, every
            strategy session — it's all part of the heist.
          </p>

          {/* Stats bar */}
          <div className="about-stats">
            {STATS.map((s) => (
              <div key={s.label} className="about-stat">
                <span className="about-stat__value">{s.value}</span>
                <span className="about-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Angular divider on right edge */}
      <div className="about-divider" aria-hidden="true" />
    </section>
  );
}
