import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./AboutPanel.css";

const STATS = [
  { value: "3+",  label: "Years Active"   },
  { value: "12",  label: "Tournaments Won" },
  { value: "50K", label: "Community"       },
  { value: "6",   label: "Titles"          },
];

export default function AboutPanel({ isActive }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (!isActive) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".about-eyebrow",
      { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 }, 0.05);
    tl.fromTo(".about-accent",
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 0.55 }, 0.15);
    tl.fromTo(".about-title",
      { opacity: 0, y: 28, skewX: -2 },
      { opacity: 1, y: 0, skewX: 0, duration: 0.85 }, 0.2);
    tl.fromTo(".about-body",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.4);
    tl.fromTo(".about-stat",
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.55);
    tl.fromTo(".about-image-wrap",
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.85, ease: "power4.out" }, 0.1);
  }, { dependencies: [isActive], scope: rootRef });

  return (
    <section className="panel about-panel" ref={rootRef}>
      <div className="about-inner">
        <div className="about-image-wrap">
          <div className="about-image-bg" aria-hidden="true" />
          <div className="about-image-accent" aria-hidden="true" />
          <div className="about-image-label">
            <span>Founded 2024</span>
          </div>
        </div>

        <div className="about-text">
          <p className="section-eyebrow about-eyebrow">Who We Are</p>
          <span className="accent-line about-accent" />
          <h2 className="section-title about-title">
            Built for <span>Victory</span>
          </h2>
          <p className="section-body about-body">
            The Heist Syndicate is more than a team — it's a movement. We're
            a collective of elite competitors who thrive under pressure,
            communicate like clockwork, and execute when it matters most.
          </p>
          <p className="section-body about-body" style={{ marginTop: "1rem" }}>
            From grassroots origins to championship stages, we've built our
            legacy one calculated play at a time. Every roster move, every
            strategy session — it's all part of the heist.
          </p>

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

      <div className="about-divider" aria-hidden="true" />
    </section>
  );
}
