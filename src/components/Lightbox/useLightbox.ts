import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Transition } from "framer-motion";
import { motionDurationSeconds, motionEasing, useReducedMotion } from "../../motion";
import {
  buildOverlayBackdropMotion,
  overlayExitTransition,
  reducedOverlayMotion,
  type CanopOverlayMotion,
} from "../../motion/overlayMotion";

interface UseLightboxParams {
  open: boolean;
  onClose: () => void;
  itemsCount: number;
  index?: number;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
}

export type CanopLightboxMotion = CanopOverlayMotion;

interface UseLightboxResult {
  render: boolean;
  currentIndex: number;
  hasMultiple: boolean;
  goNext: () => void;
  goPrev: () => void;
  handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  onExitComplete: () => void;
  surfaceMotion: CanopLightboxMotion;
  backdropMotion: CanopLightboxMotion;
}

const BACKDROP_OPACITY = 0.82;

const enterTransition: Transition = {
  duration: motionDurationSeconds.base,
  ease: motionEasing.organic,
};

const scaleMotion: CanopLightboxMotion = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98, transition: overlayExitTransition },
  transition: enterTransition,
};

export function useLightbox({
  open,
  onClose,
  itemsCount,
  index,
  initialIndex = 0,
  onIndexChange,
}: UseLightboxParams): UseLightboxResult {
  const reduced = useReducedMotion();
  const [render, setRender] = useState(open);
  const [internalIndex, setInternalIndex] = useState(initialIndex);
  const openRef = useRef(open);
  const isControlled = index !== undefined;
  const currentIndex = isControlled ? index : internalIndex;

  useEffect(() => {
    openRef.current = open;
    if (open) {
      setRender(true);
      if (!isControlled) setInternalIndex(initialIndex);
    }
  }, [open, isControlled, initialIndex]);

  const onExitComplete = useCallback(() => {
    if (!openRef.current) setRender(false);
  }, []);

  const setIndex = useCallback(
    (next: number) => {
      if (!isControlled) setInternalIndex(next);
      onIndexChange?.(next);
    },
    [isControlled, onIndexChange],
  );

  const goNext = useCallback(() => {
    if (itemsCount <= 1) return;
    setIndex((currentIndex + 1) % itemsCount);
  }, [currentIndex, itemsCount, setIndex]);

  const goPrev = useCallback(() => {
    if (itemsCount <= 1) return;
    setIndex((currentIndex - 1 + itemsCount) % itemsCount);
  }, [currentIndex, itemsCount, setIndex]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    },
    [goNext, goPrev, onClose],
  );

  return {
    render,
    currentIndex,
    hasMultiple: itemsCount > 1,
    goNext,
    goPrev,
    handleKeyDown,
    onExitComplete,
    surfaceMotion: reduced ? reducedOverlayMotion : scaleMotion,
    backdropMotion: buildOverlayBackdropMotion(BACKDROP_OPACITY, reduced),
  };
}
