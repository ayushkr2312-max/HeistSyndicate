import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import logo from "../assets/Heist-Syndicate-Logo-4.png";
import "./SideNav.css";

const ICON_TW = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const ICON_DC = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
  </svg>
);
const ICON_YT = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function SideNav({
  items,
  activeKey,
  rosterSub,
  onNavigate,
}) {
  const railRef = useRef(null);
  const indicatorRef = useRef(null);
  const itemRefs = useRef({});

  useGSAP(() => {
    const indicator = indicatorRef.current;
    const railEl = railRef.current;
    const activeEl = itemRefs.current[activeKey];
    if (!indicator || !railEl || !activeEl) return;

    const railBox = railEl.getBoundingClientRect();
    const activeBox = activeEl.getBoundingClientRect();
    const top = activeBox.top - railBox.top + activeBox.height / 2;

    gsap.to(indicator, {
      top,
      duration: 0.52,
      ease: "power3.inOut",
    });
  }, { dependencies: [activeKey], scope: railRef });

  useEffect(() => {
    const onResize = () => {
      const indicator = indicatorRef.current;
      const railEl = railRef.current;
      const activeEl = itemRefs.current[activeKey];
      if (!indicator || !railEl || !activeEl) return;
      const railBox = railEl.getBoundingClientRect();
      const activeBox = activeEl.getBoundingClientRect();
      gsap.set(indicator, {
        top: activeBox.top - railBox.top + activeBox.height / 2,
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeKey]);

  return (
    <nav className="side-nav" aria-label="Site navigation" ref={railRef}>
      <div className="side-nav__top">
        <button
          type="button"
          className="side-nav__logo"
          aria-label="The Heist Syndicate — Home"
          onClick={() => onNavigate("home")}
        >
          <img src={logo} alt="" className="side-nav__logo-img" />
        </button>
      </div>

      <ul className="side-nav__list" role="list">
        <span className="side-nav__track" aria-hidden="true" />
        <span className="side-nav__indicator" aria-hidden="true" ref={indicatorRef} />

        {items.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <li
              key={item.key}
              ref={(el) => { itemRefs.current[item.key] = el; }}
              className={`side-nav__item ${isActive ? "side-nav__item--active" : ""}`}
            >
              <button
                type="button"
                className="side-nav__link"
                onClick={() => onNavigate(item.key)}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="side-nav__label">{item.label}</span>
                <span className="side-nav__tick" aria-hidden="true" />
              </button>

              {item.key === "roster" && (
                <div
                  className={`side-nav__sub ${isActive ? "side-nav__sub--visible" : ""}`}
                  aria-hidden={!isActive}
                >
                  {[0, 1, 2].map((s) => (
                    <span
                      key={s}
                      className={`side-nav__sub-dot ${rosterSub === s ? "side-nav__sub-dot--on" : ""}`}
                    />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="side-nav__bottom">
        <div className="side-nav__socials" role="list">
          <a href="#" className="side-nav__social" aria-label="Twitter / X">{ICON_TW}</a>
          <a href="#" className="side-nav__social" aria-label="Discord">{ICON_DC}</a>
          <a href="#" className="side-nav__social" aria-label="YouTube">{ICON_YT}</a>
        </div>
      </div>
    </nav>
  );
}
