import { useEffect, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./HeroPanel.css";
import orgLogo from "../../assets/Heist-Syndicate-Logo-4.png";

gsap.registerPlugin(useGSAP);

export default function HeroPanel({ isActive }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const hasExitedRef = useRef(false);
  const decoRefs = useRef([]);
  const decorativeSymbols = useMemo(() => {
    const rand = (min, max) => Math.random() * (max - min) + min;
    const edges = ["top", "bottom", "left", "right"];
    const count = 14;

    return Array.from({ length: count }, (_, i) => {
      const edge = edges[Math.floor(Math.random() * edges.length)];
      let topPct = rand(8, 92);
      let leftPct = rand(8, 92);

      if (edge === "top") topPct = rand(4, 18);
      if (edge === "bottom") topPct = rand(82, 96);
      if (edge === "left") leftPct = rand(2, 14);
      if (edge === "right") leftPct = rand(86, 98);

      const kind = Math.random() > 0.5 ? "plus" : "x";
      return {
        id: `deco-${i}`,
        kind,
        style: {
          top: `${topPct}%`,
          left: `${leftPct}%`,
          width: `${rand(14, 34)}px`,
          height: `${rand(14, 34)}px`,
          opacity: rand(0.18, 0.34),
          "--deco-thickness": `${rand(1, 1.8)}px`,
        },
      };
    });
  }, []);

  // ── Initial entry animation ────────────────────────────────────────────────
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero-title__the", { opacity: 0, y: -20, duration: 0.7 }, 0.3)
      .from(".hero-title__main", { opacity: 0, y: 60, duration: 1.1, skewX: -3 }, 0.5)
      .from(".hero-title__sub", { opacity: 0, y: 30, duration: 0.8 }, 0.85)
      .from(".hero-deco", {
        opacity: 0, scale: 0.5, duration: 1.0, stagger: 0.2,
      }, 0.2);
  }, { scope: containerRef });

  // ── Tunnel exit / re-entry ─────────────────────────────────────────────────
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    if (!isActive) {
      hasExitedRef.current = true;

      // Tunnel effect via text only: aggressive scale + blur + fade.
      gsap.to(title, {
        opacity: 0,
        filter: "blur(22px)",
        scale: 2.1,
        y: -36,
        duration: 0.78,
        ease: "power3.in",
        transformOrigin: "center center",
        overwrite: true,
      });
    } else if (hasExitedRef.current) {
      // Re-enter hero: start large/blurred, settle cleanly.
      gsap.set(title, { opacity: 0, filter: "blur(22px)", scale: 2.1, y: -36 });
      gsap.to(title, {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        y: 0,
        duration: 0.72,
        ease: "power3.out",
        overwrite: true,
      });
    }
  }, [isActive]);

  useEffect(() => {
    const symbols = decoRefs.current.filter(Boolean);
    if (!symbols.length) return;

    symbols.forEach((el) => {
      const drift = gsap.utils.random(5, 14);
      gsap.to(el, {
        y: `+=${drift}`,
        duration: gsap.utils.random(2.4, 4.8),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => {
      symbols.forEach((el) => gsap.killTweensOf(el));
    };
  }, []);

  useEffect(() => {
    const symbols = decoRefs.current.filter(Boolean);
    if (!symbols.length) return;

    gsap.to(symbols, {
      rotate: "+=45",
      duration: 0.5,
      ease: "power2.inOut",
      stagger: { each: 0.025, from: "random" },
    });
  }, [isActive]);

  return (
    <section className="panel hero-panel" ref={containerRef}>
      <div className={`hero-badge${isActive ? "" : " hero-badge--away"}`} aria-hidden="true">
        <span className="hero-badge__line" />
        <img src={orgLogo} alt="" className="hero-badge__logo" />
        <span className="hero-badge__line" />
      </div>

      <div className="hero-deco-layer" aria-hidden="true">
        {decorativeSymbols.map((item, idx) => (
          <span
            key={item.id}
            ref={(el) => {
              decoRefs.current[idx] = el;
            }}
            className={`hero-deco hero-deco--${item.kind}`}
            style={item.style}
          />
        ))}
      </div>

      <div className="hero-content">
        <h1 className="hero-title" ref={titleRef}>
          <span className="hero-title__the">The</span>
          <span className="hero-title__main">Heist</span>
          <span className="hero-title__sub">Syndicate</span>
        </h1>
        <p className="hero-tagline">Compete. Dominate. Repeat.</p>
      </div>

      <div className="hero-scroll-hint" aria-hidden="true">
        <span className="hero-scroll-hint__text">Scroll</span>
        <span className="hero-scroll-hint__line" />
      </div>
    </section>
  );
}
