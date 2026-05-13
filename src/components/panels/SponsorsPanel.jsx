import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
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

export default function SponsorsPanel({ isActive }) {
  const rootRef = useRef(null);

  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    items: SPONSORS.filter((s) => s.tier === tier),
  }));

  useGSAP(() => {
    if (!isActive) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".sponsors-eyebrow",
      { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 }, 0.05);
    tl.fromTo(".sponsors-accent",
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.55 }, 0.15);
    tl.fromTo(".sponsors-title",
      { opacity: 0, y: 28, skewX: -2 },
      { opacity: 1, y: 0, skewX: 0, duration: 0.8 }, 0.2);
    tl.fromTo(".sponsors-lead",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 }, 0.35);
    tl.fromTo(".sponsor-tier",
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.4);
    tl.fromTo(".sponsor-card",
      { opacity: 0, y: 18, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06 }, 0.5);
    tl.fromTo(".sponsors-cta",
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.6 }, 0.7);
  }, { dependencies: [isActive], scope: rootRef });

  function onCardEnter(e) {
    gsap.to(e.currentTarget, {
      y: -4,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  }
  function onCardLeave(e) {
    gsap.to(e.currentTarget, {
      y: 0,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  return (
    <section className="panel sponsors-panel" ref={rootRef}>
      <div className="sponsors-inner">
        <div className="sponsors-header">
          <p className="section-eyebrow sponsors-eyebrow">Our Partners</p>
          <span className="accent-line sponsors-accent" />
          <h2 className="section-title sponsors-title">
            Backed by the <span>Best</span>
          </h2>
          <p className="section-body sponsors-lead" style={{ marginTop: "0.5rem" }}>
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
                  <a
                    key={s.name}
                    href="#"
                    className="sponsor-card"
                    onMouseEnter={onCardEnter}
                    onMouseLeave={onCardLeave}
                  >
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
