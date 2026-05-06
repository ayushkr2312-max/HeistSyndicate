import "./SponsorsPanel.css";

const SPONSORS = [
  { name: "HYPERSPEED",  tier: "Platinum", tagline: "Gaming Peripherals"    },
  { name: "NEXUS PRO",   tier: "Platinum", tagline: "Energy & Performance"  },
  { name: "VAULTNET",    tier: "Gold",     tagline: "VPN & Security"        },
  { name: "IRONCLAD",    tier: "Gold",     tagline: "PC Hardware"           },
  { name: "GHOSTKEY",    tier: "Silver",   tagline: "Keyboards & Mice"      },
  { name: "DATAWIRE",    tier: "Silver",   tagline: "High-Speed Internet"   },
];

const TIER_ORDER = ["Platinum", "Gold", "Silver"];

export default function SponsorsPanel() {
  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    items: SPONSORS.filter((s) => s.tier === tier),
  }));

  return (
    <section className="panel sponsors-panel">
      <div className="sponsors-inner">
        <div className="sponsors-header">
          <p className="section-eyebrow">Our Partners</p>
          <span className="accent-line" />
          <h2 className="section-title">
            Backed by the <span>Best</span>
          </h2>
          <p className="section-body" style={{ marginTop: "0.5rem" }}>
            We're proud to partner with industry leaders who share our
            commitment to excellence, innovation, and competitive gaming.
          </p>
        </div>

        <div className="sponsor-tiers">
          {grouped.map(({ tier, items }) => (
            <div key={tier} className="sponsor-tier">
              <div className="sponsor-tier__label">
                <span className={`sponsor-tier__dot sponsor-tier__dot--${tier.toLowerCase()}`} aria-hidden="true" />
                <span>{tier}</span>
              </div>
              <div className="sponsor-grid">
                {items.map((s) => (
                  <a key={s.name} href="#" className="sponsor-card">
                    <span className="sponsor-card__name">{s.name}</span>
                    <span className="sponsor-card__tagline">{s.tagline}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sponsors-cta">
          <p className="sponsors-cta__text">
            Interested in sponsoring The Heist Syndicate?
          </p>
          <a href="#" className="sponsors-cta__link">
            Partner with Us <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
