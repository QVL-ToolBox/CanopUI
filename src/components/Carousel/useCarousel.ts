import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { useReducedMotion } from "../../motion";
import {
  CAROUSEL_DEFAULT_INTERVAL,
  CAROUSEL_DEFAULT_VISIBLE_COUNT,
  clampIndex,
  clampVisibleCount,
  keyboardStep,
  positionCountOf,
  stepIndex,
  swipeDirection,
  type CanopCarouselOrientation,
} from "./carouselHelpers";

export interface UseCarouselOptions {
  count: number;
  visibleCount?: number;
  orientation?: CanopCarouselOrientation;
  autoPlay?: boolean;
  interval?: number;
}

export interface UseCarouselResult {
  activeIndex: number;
  visibleCount: number;
  positionCount: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  goPrevious: () => void;
  goNext: () => void;
  goTo: (index: number) => void;
  playing: boolean;
  pause: () => void;
  resume: () => void;
  swipeHandlers: {
    onPointerDown: (event: PointerEvent) => void;
    onPointerUp: (event: PointerEvent) => void;
    onPointerCancel: () => void;
  };
  clickHandlers: {
    onClick: (event: MouseEvent<HTMLElement>) => void;
  };
  keyHandlers: {
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  };
}

const INTERACTIFS_GARDANT_LEURS_CLICS =
  "a, button, input, select, textarea, label, [role=button], [role=link]";

function keepsItsClick(target: EventTarget): boolean {
  return target instanceof Element && target.closest(INTERACTIFS_GARDANT_LEURS_CLICS) !== null;
}

export function useCarousel({
  count,
  visibleCount: requestedVisibleCount = CAROUSEL_DEFAULT_VISIBLE_COUNT,
  orientation = "horizontal",
  autoPlay = false,
  interval = CAROUSEL_DEFAULT_INTERVAL,
}: UseCarouselOptions): UseCarouselResult {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const clickFollowingSwipeToIgnore = useRef(false);

  const visibleCount = clampVisibleCount(requestedVisibleCount, count);
  const positionCount = positionCountOf(count, visibleCount);
  const loop = autoPlay;

  useEffect(
    function keepIndexInRangeWhenWindowShrinks() {
      setActiveIndex((current) => clampIndex(current, positionCount));
    },
    [positionCount],
  );

  const goTo = useCallback(
    (index: number) => setActiveIndex(clampIndex(index, positionCount)),
    [positionCount],
  );
  const goPrevious = useCallback(
    () => setActiveIndex((current) => stepIndex(current, positionCount, -1, loop)),
    [positionCount, loop],
  );
  const goNext = useCallback(
    () => setActiveIndex((current) => stepIndex(current, positionCount, 1, loop)),
    [positionCount, loop],
  );

  const playing = autoPlay && !paused && !reducedMotion && positionCount > 1;

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(goNext, Math.max(1000, interval));
    return () => clearInterval(timer);
  }, [playing, interval, goNext]);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  const onPointerDown = useCallback((event: PointerEvent) => {
    origin.current = event.pointerType === "touch" ? { x: event.clientX, y: event.clientY } : null;
  }, []);

  const onPointerUp = useCallback(
    (event: PointerEvent) => {
      const depart = origin.current;
      origin.current = null;
      if (!depart) return;
      const sens = swipeDirection(event.clientX - depart.x, event.clientY - depart.y, orientation);
      if (sens === 0) return;
      clickFollowingSwipeToIgnore.current = true;
      if (sens === 1) goNext();
      else goPrevious();
    },
    [orientation, goNext, goPrevious],
  );

  const onPointerCancel = useCallback(() => {
    origin.current = null;
  }, []);

  const onClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (clickFollowingSwipeToIgnore.current) {
        clickFollowingSwipeToIgnore.current = false;
        return;
      }
      if (keepsItsClick(event.target)) return;
      const boite = event.currentTarget.getBoundingClientRect();
      const avant =
        orientation === "vertical"
          ? event.clientY < boite.top + boite.height / 2
          : event.clientX < boite.left + boite.width / 2;
      if (avant) goPrevious();
      else goNext();
    },
    [orientation, goPrevious, goNext],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget || positionCount <= 1) return;
      const step = keyboardStep(event.key, orientation);
      if (step !== 0) {
        event.preventDefault();
        if (step === 1) goNext();
        else goPrevious();
        return;
      }
      if (event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();
      goTo(event.key === "Home" ? 0 : positionCount - 1);
    },
    [orientation, positionCount, goNext, goPrevious, goTo],
  );

  return {
    activeIndex,
    visibleCount,
    positionCount,
    canGoPrevious: loop ? positionCount > 1 : activeIndex > 0,
    canGoNext: loop ? positionCount > 1 : activeIndex < positionCount - 1,
    goPrevious,
    goNext,
    goTo,
    playing,
    pause,
    resume,
    swipeHandlers: { onPointerDown, onPointerUp, onPointerCancel },
    clickHandlers: { onClick },
    keyHandlers: { onKeyDown },
  };
}
