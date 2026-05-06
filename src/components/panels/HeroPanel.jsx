import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./HeroPanel.css";

gsap.registerPlugin(useGSAP);

export default function HeroPanel({ isActive }) {
  const containerRef = useRef(null);
  const titleRef     = useRef(null);
  const hasExitedRef = useRef(false);

  // ── Initial entry animation ────────────────────────────────────────────────
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero-title__the",  { opacity: 0, y: -20, duration: 0.7 }, 0.3)
      .from(".hero-title__main", { opacity: 0, y: 60,  duration: 1.1, skewX: -3 }, 0.5)
      .from(".hero-title__sub",  { opacity: 0, y: 30,  duration: 0.8 }, 0.85)
      .from(".hero-corner-tl, .hero-corner-br", {
        opacity: 0, scale: 0.5, duration: 1.0, stagger: 0.2,
      }, 0.2);
  }, { scope: containerRef });

  // ── Tunnel exit / re-entry ─────────────────────────────────────────────────
  useEffect(() => {
    const title     = titleRef.current;
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

  return (
    <section className="panel hero-panel" ref={containerRef}>


      <div className="hero-content">
        <h1 className="hero-title" ref={titleRef}>
          <span className="hero-title__the">The</span>
          <span className="hero-title__main">Heist</span>
          <span className="hero-title__sub">Syndicate</span>
        </h1>
      </div>
    </section>
  );
}
