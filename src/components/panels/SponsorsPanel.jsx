import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./SponsorsPanel.css";

const PARTNER_STATS = [
  { value: "50K+", label: "Monthly Reach" },
  { value: "12+",  label: "Events / Year" },
  { value: "3",    label: "Content Series" },
];

const SPONSOR_SLOTS = [
  { id: "01", label: "Partner Slot" },
  { id: "02", label: "Partner Slot" },
  { id: "03", label: "Partner Slot" },
  { id: "04", label: "Partner Slot" },
  { id: "05", label: "Partner Slot" },
  { id: "06", label: "Partner Slot" },
];

const PERKS = [
  { title: "Brand Visibility", desc: "Logo placement across streams, social, and event assets." },
  { title: "Content Integration", desc: "Co-branded segments, features, and campaign moments." },
  { title: "Event Presence", desc: "On-site activations and premium live event hospitality." },
];

export default function SponsorsPanel({ isActive }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (!isActive) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".sponsors-eyebrow",
      { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 }, 0.05);
    tl.fromTo(".sponsors-accent",
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.55 }, 0.12);
    tl.fromTo(".sponsors-title",
      { opacity: 0, y: 28, skewX: -2 },
      { opacity: 1, y: 0, skewX: 0, duration: 0.8 }, 0.18);
    tl.fromTo(".sponsors-lead",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 }, 0.3);
    tl.fromTo(".sponsors-stat",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, 0.35);
    tl.fromTo(".sponsor-slot",
      { opacity: 0, y: 14, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.04 }, 0.42);
    tl.fromTo(".sponsors-perk",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }, 0.55);
    tl.fromTo(".sponsors-cta",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5 }, 0.65);
  }, { dependencies: [isActive], scope: rootRef });

  return (
    <section className="panel sponsors-panel" ref={rootRef}>
      <div className="sponsors-glow" aria-hidden="true" />

      <div className="sponsors-inner">
        <header className="sponsors-header">
          <div className="sponsors-header__copy">
            <p className="section-eyebrow sponsors-eyebrow">Partnerships</p>
            <span className="accent-line sponsors-accent" />
            <h2 className="section-title sponsors-title">
              Powering the <span>Heist</span>
            </h2>
            <p className="section-body sponsors-lead">
              We collaborate with brands that match our standard — precision,
              presence, and performance at the highest level of competition.
            </p>
          </div>

          <div className="sponsors-stats" aria-label="Partnership reach">
            {PARTNER_STATS.map((stat) => (
              <div key={stat.label} className="sponsors-stat">
                <span className="sponsors-stat__value">{stat.value}</span>
                <span className="sponsors-stat__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="sponsors-grid">
          {SPONSOR_SLOTS.map((slot) => (
            <article key={slot.id} className="sponsor-slot">
              <div className="sponsor-slot__frame" aria-hidden="true">
                <span className="sponsor-slot__corner sponsor-slot__corner--tl" />
                <span className="sponsor-slot__corner sponsor-slot__corner--tr" />
                <span className="sponsor-slot__corner sponsor-slot__corner--bl" />
                <span className="sponsor-slot__corner sponsor-slot__corner--br" />
              </div>
              <span className="sponsor-slot__monogram" aria-hidden="true">+</span>
              <div className="sponsor-slot__meta">
                <span className="sponsor-slot__label">{slot.label}</span>
                <span className="sponsor-slot__status">Open</span>
              </div>
            </article>
          ))}
        </div>

        <div className="sponsors-perks">
          {PERKS.map((perk) => (
            <div key={perk.title} className="sponsors-perk">
              <h3 className="sponsors-perk__title">{perk.title}</h3>
              <p className="sponsors-perk__desc">{perk.desc}</p>
            </div>
          ))}
        </div>

        <div className="sponsors-cta">
          <div className="sponsors-cta__copy">
            <p className="sponsors-cta__eyebrow">Become a Partner</p>
            <p className="sponsors-cta__text">
              Custom packages for brands ready to invest in competitive gaming.
            </p>
          </div>
          <a href="#" className="sponsors-cta__btn">
            Request Partnership Deck
            <span className="sponsors-cta__btn-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="sponsors-divider" aria-hidden="true" />
    </section>
  );
}
