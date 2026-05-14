import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./index.css";
import { useSectionNavigator } from "./hooks/useSectionNavigator";
import SideNav from "./components/SideNav";
import HeroPanel from "./components/panels/HeroPanel";
import orgLogo from "./assets/Heist-Syndicate-Logo-4.png";
import AboutPanel from "./components/panels/AboutPanel";
import PlayerSection from "./components/panels/PlayerSection";
import SchedulePanel from "./components/panels/SchedulePanel";
import ContactPanel from "./components/panels/ContactPanel";
import SponsorsPanel from "./components/panels/SponsorsPanel";

const NAV_ITEMS = [
  { key: "home",     label: "Home",     targetIdx: 0 },
  { key: "about",    label: "About",    targetIdx: 1 },
  { key: "roster",   label: "Roster",   targetIdx: 2 },
  { key: "schedule", label: "Schedule", targetIdx: 5 },
  { key: "contact",  label: "Contact",  targetIdx: 6 },
  { key: "sponsors", label: "Sponsors", targetIdx: 7 },
];

const PANEL_KEY_BY_IDX = [
  "home", "about", "roster", "roster", "roster", "schedule", "contact", "sponsors",
];

// 0→1 drops down, 1→2 moves right, 2→3→4 roster scrolls vertically, 4→5 moves right
const SECTION_PATH = [
  { x: 0,   y: 0   },  // 0: hero
  { x: 0,   y: 100 },  // 1: about
  { x: 100, y: 100 },  // 2: phantom
  { x: 100, y: 200 },  // 3: cipher   (down)
  { x: 100, y: 300 },  // 4: vortex   (down)
  { x: 200, y: 300 },  // 5: schedule (right)
  { x: 300, y: 300 },  // 6: contact  (right)
  { x: 400, y: 300 },  // 7: sponsors (right)
];

const PLAYERS = [
  {
    handle: "PHANTOM",
    name: "Alex Reyes",
    role: "IGL / Rifler",
    country: "US",
    quote: "I read the lobby before the lobby reads itself.",
    stats: { kd: "1.42", rating: "1.18", hs: "58%", acs: "262", wr: "71%" },
    socials: { x: "#", twitch: "#" },
  },
  {
    handle: "CIPHER",
    name: "Jordan Lee",
    role: "AWPer",
    country: "UK",
    quote: "One bullet. One window. One outcome.",
    stats: { kd: "1.38", rating: "1.14", hs: "44%", acs: "248", wr: "68%" },
    socials: { x: "#", twitch: "#" },
  },
  {
    handle: "VORTEX",
    name: "Sam Torres",
    role: "Entry Fragger",
    country: "CA",
    quote: "First through the door, last to apologize.",
    stats: { kd: "1.31", rating: "1.09", hs: "62%", acs: "275", wr: "66%" },
    socials: { x: "#", twitch: "#" },
  },
];

export default function App() {
  const leftFrameRef = useRef(null);
  const rightFrameRef = useRef(null);
  const navLogoRef = useRef(null);
  const flyRef = useRef(null);
  const prevIndexRef = useRef(0);

  const { activeIndex, goTo } = useSectionNavigator(SECTION_PATH.length);
  const current = SECTION_PATH[activeIndex];
  const activeKey = PANEL_KEY_BY_IDX[activeIndex];
  const isHero = activeIndex === 0;
  const rosterSub = activeIndex >= 2 && activeIndex <= 4 ? activeIndex - 2 : -1;

  const navigateByKey = useCallback((key) => {
    const item = NAV_ITEMS.find((n) => n.key === key);
    if (item) goTo(item.targetIdx);
  }, [goTo]);

  // ── Logo zone helpers (all positions calculated, no getBoundingClientRect timing issues) ──
  const logoZone = (i) => (i === 0 ? "hero" : i === 1 ? "about" : "nav");

  const calcHeroCenter = () => {
    const navW = window.innerWidth <= 900 ? 0 : 143;
    return { x: (window.innerWidth - navW) / 2, y: 28 + 22, h: 44 };
  };

  const calcAboutCenter = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const innerW = Math.min(1100, vw * 0.9);
    const gap = vw * 0.05;
    const colW = (innerW - gap) / 2;
    const innerLeft = (vw - innerW) / 2;
    return { x: innerLeft + colW / 2, y: vh / 2, h: 320 };
  };

  const getNavCenter = () => {
    const img = navLogoRef.current;
    if (!img) return null;
    const r = img.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, h: r.height };
  };

  const getZoneCenter = (zone) => {
    if (zone === "hero") return calcHeroCenter();
    if (zone === "about") return calcAboutCenter();
    return getNavCenter();
  };

  // Place fly at hero on first render
  useEffect(() => {
    const fly = flyRef.current;
    if (!fly) return;
    const pos = calcHeroCenter();
    gsap.set(fly, { x: pos.x, y: pos.y, height: pos.h, xPercent: -50, yPercent: -50, opacity: 1 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate fly between zones whenever activeIndex changes
  useEffect(() => {
    const fly = flyRef.current;
    if (!fly) return;

    const prevIdx = prevIndexRef.current;
    prevIndexRef.current = activeIndex;

    const fromZone = logoZone(prevIdx);
    const toZone = logoZone(activeIndex);
    if (fromZone === toZone) return;

    const from = getZoneCenter(fromZone);
    const to = getZoneCenter(toZone);
    if (!from || !to) return;

    if (navLogoRef.current) navLogoRef.current.style.visibility = "hidden";
    gsap.set(fly, { opacity: 1 });

    gsap.fromTo(fly,
      { x: from.x, y: from.y, height: from.h, xPercent: -50, yPercent: -50 },
      {
        x: to.x, y: to.y, height: to.h,
        duration: 0.9, ease: "power3.inOut", overwrite: true,
        onComplete: () => {
          if (toZone === "nav") {
            gsap.set(fly, { opacity: 0 });
            if (navLogoRef.current) navLogoRef.current.style.visibility = "visible";
          }
        },
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useGSAP(() => {
    if (!leftFrameRef.current || !rightFrameRef.current) return;
    gsap.to(leftFrameRef.current, {
      height: 92 + Math.random() * 4 + "%",
      top: 2 + Math.random() * 2 + "%",
      duration: 1.4,
      ease: "power3.out",
    });
    gsap.to(rightFrameRef.current, {
      height: 92 + Math.random() * 4 + "%",
      bottom: 2 + Math.random() * 2 + "%",
      duration: 1.4,
      ease: "power3.out",
      delay: 0.1,
    });
  }, [activeIndex]);

  const playerStops = useMemo(() => PLAYERS.map((p, i) => ({
    player: p,
    index: i,
    stopIdx: 2 + i,
  })), []);

  return (
    <>
      <div
        className={`global-bg ${isHero ? "global-bg--hero" : "global-bg--dim"}`}
        aria-hidden="true"
      />
      <div className="premium-overlays" aria-hidden="true">
        <div className="premium-grid">
          <div className="premium-grid-pulse" />
        </div>
        <div className="premium-grain" />
        <div className="global-frame global-frame-left" ref={leftFrameRef} />
        <div className="global-frame global-frame-right" ref={rightFrameRef} />
      </div>

      <div className="section-stage">
        <div
          className="section-world"
          style={{ transform: `translate3d(${-current.x}vw, ${-current.y}vh, 0)` }}
        >
          <div className="section-frame" style={{ left: "0vw",   top: "0vh"    }}>
            <HeroPanel isActive={activeKey === "home"} />
          </div>
          <div className="section-frame" style={{ left: "0vw",   top: "100vh"  }}>
            <AboutPanel isActive={activeKey === "about"} />
          </div>
          {playerStops.map(({ player, index, stopIdx }) => (
            <div
              key={player.handle}
              className="section-frame"
              style={{ left: "100vw", top: `${100 * (stopIdx - 1)}vh` }}
            >
              <PlayerSection
                player={player}
                index={index}
                total={PLAYERS.length}
                isActive={activeIndex === stopIdx}
              />
            </div>
          ))}
          <div className="section-frame" style={{ left: "200vw", top: "300vh"  }}>
            <SchedulePanel isActive={activeKey === "schedule"} />
          </div>
          <div className="section-frame" style={{ left: "300vw", top: "300vh"  }}>
            <ContactPanel isActive={activeKey === "contact"} />
          </div>
          <div className="section-frame" style={{ left: "400vw", top: "300vh"  }}>
            <SponsorsPanel isActive={activeKey === "sponsors"} />
          </div>
        </div>
      </div>

      <SideNav
        items={NAV_ITEMS}
        activeKey={activeKey}
        rosterSub={rosterSub}
        onNavigate={navigateByKey}
        navLogoRef={navLogoRef}
      />

      <img
        ref={flyRef}
        src={orgLogo}
        className="app-logo-fly"
        alt=""
        aria-hidden="true"
      />
    </>
  );
}
