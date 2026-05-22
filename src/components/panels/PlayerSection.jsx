import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./PlayerSection.css";

gsap.registerPlugin(useGSAP);

const TINTS = [
  "180, 200, 255",
  "120, 235, 200",
  "255, 150, 120",
];

export default function PlayerSection({ player, index, total, isActive }) {
  const rootRef = useRef(null);
  const handleRef = useRef(null);
  const portraitRef = useRef(null);
  const statRefs = useRef([]);
  const metaRefs = useRef([]);
  const hasEnteredRef = useRef(false);

  const idxLabel = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");
  const tint = TINTS[index] || "255, 223, 0";

  useGSAP(() => {
    if (!isActive) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(handleRef.current,
      { opacity: 0, y: 60, skewX: -4, filter: "blur(8px)" },
      { opacity: 1, y: 0, skewX: 0, filter: "blur(0px)", duration: 0.9 },
      0.05
    );

    tl.fromTo(metaRefs.current.filter(Boolean),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
      0.3
    );

    tl.fromTo(portraitRef.current,
      { opacity: 0, x: 60, scale: 1.04 },
      { opacity: 1, x: 0, scale: 1, duration: 0.95, ease: "power4.out" },
      0.15
    );

    tl.fromTo(statRefs.current.filter(Boolean),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 },
      0.5
    );

    hasEnteredRef.current = true;
  }, { dependencies: [isActive], scope: rootRef });

  useEffect(() => {
    if (isActive || !hasEnteredRef.current) return;
    gsap.to(handleRef.current, {
      opacity: 0.001,
      duration: 0.25,
      ease: "power2.in",
      overwrite: true,
    });
  }, [isActive]);

  return (
    <section
      className="panel player-section"
      ref={rootRef}
      style={{ "--player-tint": tint }}
    >
      <div className="player-section__bg" aria-hidden="true" />

      <div className="player-section__inner">
        <div className="player-section__left">
          <div className="player-section__tag" ref={(el) => { metaRefs.current[0] = el; }}>
            <span className="player-section__tag-bracket">[</span>
            <span>ROSTER</span>
            <span className="player-section__tag-dot">·</span>
            <span>{idxLabel} / {totalLabel}</span>
            <span className="player-section__tag-bracket">]</span>
          </div>

          <h2 className="player-section__handle" ref={handleRef}>
            {player.handle}
          </h2>

          <div className="player-section__meta">
            <span className="player-section__name" ref={(el) => { metaRefs.current[1] = el; }}>
              {player.name}
            </span>
            <span className="player-section__chip" ref={(el) => { metaRefs.current[2] = el; }}>
              <span className="player-section__chip-dot" />
              {player.role}
            </span>
            <span className="player-section__country" ref={(el) => { metaRefs.current[3] = el; }}>
              {player.country}
            </span>
          </div>

          <p className="player-section__quote" ref={(el) => { metaRefs.current[4] = el; }}>
            <span className="player-section__quote-mark">“</span>
            {player.quote}
            <span className="player-section__quote-mark">”</span>
          </p>

          <div className="player-section__socials" ref={(el) => { metaRefs.current[5] = el; }}>
            <a href={player.socials.x} className="player-section__social" aria-label="Twitter / X">
              <span>X</span>
            </a>
            <a href={player.socials.twitch} className="player-section__social" aria-label="Twitch">
              <span>TW</span>
            </a>
          </div>
        </div>

        <div className="player-section__right" ref={portraitRef}>
          <div className="player-section__portrait">
            <span className="player-section__portrait-sidetext" aria-hidden="true">
              {player.handle}
            </span>
            <div className="player-section__portrait-frame" aria-hidden="true">
              <span className="player-section__portrait-corner player-section__portrait-corner--tl" />
              <span className="player-section__portrait-corner player-section__portrait-corner--tr" />
              <span className="player-section__portrait-corner player-section__portrait-corner--bl" />
              <span className="player-section__portrait-corner player-section__portrait-corner--br" />
            </div>
            <div className="player-section__portrait-inner">
              <span className="player-section__monogram">{player.handle[0]}</span>
              <span className="player-section__portrait-role">{player.role}</span>
            </div>
            <span className="player-section__portrait-country" aria-hidden="true">
              {player.country}
            </span>
          </div>
        </div>
      </div>

      <div className="player-section__stats">
        {Object.entries(player.stats).map(([key, val], i) => (
          <div
            key={key}
            className="player-section__stat"
            ref={(el) => { statRefs.current[i] = el; }}
          >
            <span className="player-section__stat-val">{val}</span>
            <span className="player-section__stat-key">{key.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <div className="player-section__progress" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`player-section__progress-dot ${i === index ? "player-section__progress-dot--on" : ""}`}
          />
        ))}
        {index < total - 1 && (
          <span className="player-section__next-hint">next →</span>
        )}
      </div>

      <div className="player-section__divider" aria-hidden="true" />
    </section>
  );
}
