import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins the viewport and scrubs the panel strip horizontally as the user
 * scrolls vertically. Returns a ref to attach to the outer wrapper and
 * a ref to attach to the moving strip.
 *
 * @param {number} panelCount   number of full-width panels
 * @param {function} onProgress called on every scrub tick with (panelIndex)
 */
export function useHorizontalScroll(panelCount, onProgress) {
  const outerRef = useRef(null);
  const stripRef = useRef(null);

  useEffect(() => {
    const outer = outerRef.current;
    const strip = stripRef.current;
    if (!outer || !strip) return;

    // Total horizontal distance the strip must travel
    const totalWidth = strip.scrollWidth - window.innerWidth;

    // Set the outer div height so the browser gives us matching scroll range
    gsap.set(outer, { height: strip.scrollWidth });

    const tween = gsap.to(strip, {
      x: () => -totalWidth,
      ease: "none", // required for containerAnimation to stay in sync
      scrollTrigger: {
        trigger: outer,
        start: "top top",
        end: () => `+=${strip.scrollWidth - window.innerWidth}`,
        scrub: 1,
        pin: ".scroll-sticky",
        pinSpacing: false,
        invalidateOnRefresh: true,
        onUpdate(self) {
          if (onProgress) {
            const idx = Math.round(self.progress * (panelCount - 1));
            onProgress(idx);
          }
        },
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.refresh();
    };
  }, [panelCount, onProgress]);

  return { outerRef, stripRef };
}
