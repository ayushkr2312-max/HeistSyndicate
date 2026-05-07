import { useCallback, useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./index.css";
import { useSectionNavigator } from "./hooks/useSectionNavigator";
import BottomNav from "./components/BottomNav";
import HeroPanel from "./components/panels/HeroPanel";
import AboutPanel from "./components/panels/AboutPanel";
import RosterPanel from "./components/panels/RosterPanel";
import SchedulePanel from "./components/panels/SchedulePanel";
import ContactPanel from "./components/panels/ContactPanel";
import SponsorsPanel from "./components/panels/SponsorsPanel";

const PANELS = [
  { id: "home",     label: "Home"     },
  { id: "about",    label: "About"    },
  { id: "roster",   label: "Roster"   },
  { id: "schedule", label: "Schedule" },
  { id: "contact",  label: "Contact"  },
  { id: "sponsors", label: "Sponsors" },
];

// 0→1 drops down, 1→5 move right
const SECTION_PATH = [
  { x: 0,   y: 0   },
  { x: 0,   y: 100 },
  { x: 100, y: 100 },
  { x: 200, y: 100 },
  { x: 300, y: 100 },
  { x: 400, y: 100 },
];

export default function App() {
  const [activeIdx, setActiveIdx] = useState(0);

  const leftFrameRef = useRef(null);
  const rightFrameRef = useRef(null);

  const handleIndexChange = useCallback((idx) => {
    setActiveIdx(idx);
  }, []);

  const { activeIndex, goTo } = useSectionNavigator(PANELS.length, handleIndexChange);
  const current = SECTION_PATH[activeIndex];
  const isHero = activeIndex === 0;

  useGSAP(() => {
    if (!leftFrameRef.current || !rightFrameRef.current) return;
    
    // Animate the frames whenever activeIndex changes
    gsap.to(leftFrameRef.current, {
      height: 90 + Math.random() * 8 + "%",
      top: 1 + Math.random() * 4 + "%",
      duration: 0.9,
      ease: "power3.out",
    });

    gsap.to(rightFrameRef.current, {
      height: 90 + Math.random() * 8 + "%",
      bottom: 1 + Math.random() * 4 + "%",
      duration: 0.9,
      ease: "power3.out",
      delay: 0.1, // slight stagger
    });
  }, [activeIndex]);

  return (
    <>
      <div
        className={`global-bg ${isHero ? "global-bg--hero" : "global-bg--dim"}`}
        aria-hidden="true"
      />
      <div className="premium-overlays" aria-hidden="true">
        <div className="premium-diagonals" />
        <div className="premium-grid">
          <div className="premium-grid-pulse" />
        </div>
        <div className="premium-scanlines" />
        <div className="premium-grain" />
        <div className="global-frame global-frame-left" ref={leftFrameRef} />
        <div className="global-frame global-frame-right" ref={rightFrameRef} />
        <div className="crosshair crosshair--tl" />
        <div className="crosshair crosshair--br" />
        <div className="reticle" />
      </div>

      <div className="section-stage">
        <div
          className="section-world"
          style={{ transform: `translate3d(${-current.x}vw, ${-current.y}vh, 0)` }}
        >
          <div className="section-frame" style={{ left: "0vw",   top: "0vh"    }}>
            <HeroPanel isActive={isHero} />
          </div>
          <div className="section-frame" style={{ left: "0vw",   top: "100vh"  }}>
            <AboutPanel />
          </div>
          <div className="section-frame" style={{ left: "100vw", top: "100vh"  }}>
            <RosterPanel />
          </div>
          <div className="section-frame" style={{ left: "200vw", top: "100vh"  }}>
            <SchedulePanel />
          </div>
          <div className="section-frame" style={{ left: "300vw", top: "100vh"  }}>
            <ContactPanel />
          </div>
          <div className="section-frame" style={{ left: "400vw", top: "100vh"  }}>
            <SponsorsPanel />
          </div>
        </div>
      </div>

      <BottomNav
        panels={PANELS}
        activeIdx={activeIdx}
        onNavigate={goTo}
        isHero={isHero}
      />
    </>
  );
}
