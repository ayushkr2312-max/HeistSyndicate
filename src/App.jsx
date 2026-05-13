import { useCallback, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./index.css";
import { useSectionNavigator } from "./hooks/useSectionNavigator";
import SideNav from "./components/SideNav";
import HeroPanel from "./components/panels/HeroPanel";
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

// 0→1 drops down, 1→7 move right (roster occupies stops 2/3/4)
const SECTION_PATH = [
  { x: 0,   y: 0   },
  { x: 0,   y: 100 },
  { x: 100, y: 100 },
  { x: 200, y: 100 },
  { x: 300, y: 100 },
  { x: 400, y: 100 },
  { x: 500, y: 100 },
  { x: 600, y: 100 },
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

  const { activeIndex, goTo } = useSectionNavigator(SECTION_PATH.length);
  const current = SECTION_PATH[activeIndex];
  const activeKey = PANEL_KEY_BY_IDX[activeIndex];
  const isHero = activeIndex === 0;
  const rosterSub = activeIndex >= 2 && activeIndex <= 4 ? activeIndex - 2 : -1;

  const navigateByKey = useCallback((key) => {
    const item = NAV_ITEMS.find((n) => n.key === key);
    if (item) goTo(item.targetIdx);
  }, [goTo]);

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
              style={{ left: `${100 * (stopIdx - 1)}vw`, top: "100vh" }}
            >
              <PlayerSection
                player={player}
                index={index}
                total={PLAYERS.length}
                isActive={activeIndex === stopIdx}
              />
            </div>
          ))}
          <div className="section-frame" style={{ left: "400vw", top: "100vh"  }}>
            <SchedulePanel isActive={activeKey === "schedule"} />
          </div>
          <div className="section-frame" style={{ left: "500vw", top: "100vh"  }}>
            <ContactPanel isActive={activeKey === "contact"} />
          </div>
          <div className="section-frame" style={{ left: "600vw", top: "100vh"  }}>
            <SponsorsPanel isActive={activeKey === "sponsors"} />
          </div>
        </div>
      </div>

      <SideNav
        items={NAV_ITEMS}
        activeKey={activeKey}
        rosterSub={rosterSub}
        onNavigate={navigateByKey}
      />
    </>
  );
}
