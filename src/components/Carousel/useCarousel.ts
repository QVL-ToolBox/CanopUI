import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { useReducedMotion } from "../../motion";
import {
  CAROUSEL_DEFAULT_INTERVAL,
  clampIndex,
  stepIndex,
  swipeDirection,
  type CanopCarouselOrientation,
} from "./carouselHelpers";

export interface UseCarouselOptions {
  count: number;
  orientation?: CanopCarouselOrientation;
  autoPlay?: boolean;
  /** Duree d'affichage par carte, en millisecondes. */
  interval?: number;
}

export interface UseCarouselResult {
  activeIndex: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  goPrevious: () => void;
  goNext: () => void;
  goTo: (index: number) => void;
  /** Le defilement automatique tourne-t-il reellement en ce moment. */
  playing: boolean;
  pause: () => void;
  resume: () => void;
  /** A poser sur la fenetre : ne reagit qu'au doigt, jamais a la souris. */
  swipeHandlers: {
    onPointerDown: (event: PointerEvent) => void;
    onPointerUp: (event: PointerEvent) => void;
    onPointerCancel: () => void;
  };
  /**
   * A poser sur la fenetre : un clic dans la moitie avant recule, dans la
   * moitie arriere avance. Les clics des elements interactifs de la carte leur
   * restent acquis.
   */
  clickHandlers: {
    onClick: (event: MouseEvent<HTMLElement>) => void;
  };
}

export function useCarousel({
  count,
  orientation = "horizontal",
  autoPlay = false,
  interval = CAROUSEL_DEFAULT_INTERVAL,
}: UseCarouselOptions): UseCarouselResult {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const clickFollowingSwipeToIgnore = useRef(false);

  const loop = autoPlay;

  useEffect(
    function keepIndexInRangeWhenCardRemoved() {
      setActiveIndex((current) => clampIndex(current, count));
    },
    [count],
  );

  const goTo = useCallback((index: number) => setActiveIndex(clampIndex(index, count)), [count]);
  const goPrevious = useCallback(
    () => setActiveIndex((current) => stepIndex(current, count, -1, loop)),
    [count, loop],
  );
  const goNext = useCallback(
    () => setActiveIndex((current) => stepIndex(current, count, 1, loop)),
    [count, loop],
  );

  const playing = autoPlay && !paused && !reducedMotion && count > 1;

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

  const INTERACTIFS_GARDANT_LEURS_CLICS =
    "a, button, input, select, textarea, label, [role=button], [role=link]";

  const onClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (clickFollowingSwipeToIgnore.current) {
        clickFollowingSwipeToIgnore.current = false;
        return;
      }
      if ((event.target as HTMLElement).closest(INTERACTIFS_GARDANT_LEURS_CLICS)) return;
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

  return {
    activeIndex,
    canGoPrevious: loop ? count > 1 : activeIndex > 0,
    canGoNext: loop ? count > 1 : activeIndex < count - 1,
    goPrevious,
    goNext,
    goTo,
    playing,
    pause,
    resume,
    swipeHandlers: { onPointerDown, onPointerUp, onPointerCancel },
    clickHandlers: { onClick },
  };
}
