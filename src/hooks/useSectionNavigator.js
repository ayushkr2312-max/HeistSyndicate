import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Discrete section navigation:
 * - one wheel gesture -> one section step
 * - transition lock prevents getting stuck between sections
 */
export function useSectionNavigator(sectionCount, onIndexChange) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isLockedRef = useRef(false);
  const lockTimeoutRef = useRef(null);
  const wheelAccumRef = useRef(0);
  const lastWheelTsRef = useRef(0);

  const goTo = useCallback((targetIndex) => {
    setActiveIndex((prev) => {
      const clamped = Math.max(0, Math.min(sectionCount - 1, targetIndex));
      if (clamped !== prev) onIndexChange?.(clamped);
      return clamped;
    });
  }, [sectionCount, onIndexChange]);

  useEffect(() => {
    onIndexChange?.(0);
  }, [onIndexChange]);

  useEffect(() => {
    const lockForTransition = () => {
      isLockedRef.current = true;
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = setTimeout(() => {
        isLockedRef.current = false;
      }, 980);
    };

    const onWheel = (event) => {
      event.preventDefault();
      if (isLockedRef.current) return;

      const dominantDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(dominantDelta) < 2) return;

      const now = performance.now();
      // Reset accumulator when user pauses, so old deltas don't trigger jumps.
      if (now - lastWheelTsRef.current > 180) {
        wheelAccumRef.current = 0;
      }
      lastWheelTsRef.current = now;
      wheelAccumRef.current += dominantDelta;

      // Trigger only after a deliberate gesture for smoother feel.
      const WHEEL_STEP_THRESHOLD = 85;
      if (Math.abs(wheelAccumRef.current) < WHEEL_STEP_THRESHOLD) return;
      const direction = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;

      lockForTransition();
      setActiveIndex((prev) => {
        const next = prev + direction;
        const clamped = Math.max(0, Math.min(sectionCount - 1, next));
        if (clamped !== prev) onIndexChange?.(clamped);
        return clamped;
      });
    };

    const onKeyDown = (event) => {
      const forwardKeys = ["ArrowDown", "ArrowRight", "PageDown", " "];
      const backwardKeys = ["ArrowUp", "ArrowLeft", "PageUp"];
      if (!forwardKeys.includes(event.key) && !backwardKeys.includes(event.key)) return;

      event.preventDefault();
      if (isLockedRef.current) return;
      const direction = forwardKeys.includes(event.key) ? 1 : -1;

      lockForTransition();
      setActiveIndex((prev) => {
        const next = direction > 0 ? prev + 1 : prev - 1;
        const clamped = Math.max(0, Math.min(sectionCount - 1, next));
        if (clamped !== prev) onIndexChange?.(clamped);
        return clamped;
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    };
  }, [sectionCount, onIndexChange]);

  return {
    activeIndex,
    goTo,
  };
}
