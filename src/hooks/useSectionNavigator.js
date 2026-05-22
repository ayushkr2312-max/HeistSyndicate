import { useCallback, useEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD = 48;
const SWIPE_MAX_MS = 600;

function findScrollableParent(el) {
  let node = el;
  while (node && node !== document.documentElement) {
    const { overflowY } = window.getComputedStyle(node);
    if (
      (overflowY === "auto" || overflowY === "scroll")
      && node.scrollHeight > node.clientHeight + 1
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

/**
 * Discrete section navigation:
 * - one wheel gesture -> one section step
 * - touch swipe -> one section step
 * - transition lock prevents getting stuck between sections
 */
export function useSectionNavigator(sectionCount, onIndexChange) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isLockedRef = useRef(false);
  const lockTimeoutRef = useRef(null);
  const wheelAccumRef = useRef(0);
  const lastWheelTsRef = useRef(0);
  const touchStartRef = useRef({ x: 0, y: 0, ts: 0, scrollEl: null, scrollTop: 0 });

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

    const step = (direction) => {
      lockForTransition();
      setActiveIndex((prev) => {
        const next = prev + direction;
        const clamped = Math.max(0, Math.min(sectionCount - 1, next));
        if (clamped !== prev) onIndexChange?.(clamped);
        return clamped;
      });
    };

    const onWheel = (event) => {
      event.preventDefault();
      if (isLockedRef.current) return;

      const dominantDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(dominantDelta) < 2) return;

      const now = performance.now();
      if (now - lastWheelTsRef.current > 180) {
        wheelAccumRef.current = 0;
      }
      lastWheelTsRef.current = now;
      wheelAccumRef.current += dominantDelta;

      const WHEEL_STEP_THRESHOLD = 85;
      if (Math.abs(wheelAccumRef.current) < WHEEL_STEP_THRESHOLD) return;
      const direction = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;
      step(direction);
    };

    const onKeyDown = (event) => {
      const forwardKeys = ["ArrowDown", "ArrowRight", "PageDown", " "];
      const backwardKeys = ["ArrowUp", "ArrowLeft", "PageUp"];
      if (!forwardKeys.includes(event.key) && !backwardKeys.includes(event.key)) return;

      event.preventDefault();
      if (isLockedRef.current) return;
      step(forwardKeys.includes(event.key) ? 1 : -1);
    };

    const onTouchStart = (event) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      const scrollEl = findScrollableParent(event.target);
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        ts: performance.now(),
        scrollEl,
        scrollTop: scrollEl?.scrollTop ?? 0,
      };
    };

    const onTouchEnd = (event) => {
      if (isLockedRef.current || event.changedTouches.length !== 1) return;

      const { scrollEl, scrollTop: startScrollTop } = touchStartRef.current;
      if (scrollEl && Math.abs(scrollEl.scrollTop - startScrollTop) > 8) return;

      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const elapsed = performance.now() - touchStartRef.current.ts;

      if (elapsed > SWIPE_MAX_MS) return;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) return;

      let direction;
      if (absX >= absY) {
        direction = dx < 0 ? 1 : -1;
      } else {
        direction = dy < 0 ? 1 : -1;
      }

      step(direction);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    };
  }, [sectionCount, onIndexChange]);

  return {
    activeIndex,
    goTo,
  };
}
