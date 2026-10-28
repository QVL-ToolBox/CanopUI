import Box from "@mui/material/Box";
import { Children, useCallback, useRef, type ReactNode } from "react";
import { useTranslation } from "../../i18n";
import { withoutFocusRing } from "../../interaction";
import { tokens } from "../../tokens";
import { CarouselArrow, type CarouselArrowDirection } from "./CarouselArrow";
import { CarouselIndicators } from "./CarouselIndicators";
import {
  CAROUSEL_DEFAULT_INTERVAL,
  slideTransform,
  type CanopCarouselNavigation,
  type CanopCarouselOrientation,
  type CanopCarouselTransition,
} from "./carouselHelpers";
import { useCarousel } from "./useCarousel";

export type { CanopCarouselNavigation, CanopCarouselOrientation, CanopCarouselTransition };

export interface CanopCarouselProps {
  ariaLabel: string;
  /** `arrows` place une fleche de chaque cote de la carte, `bars` une barre par carte. */
  navigation?: CanopCarouselNavigation;
  orientation?: CanopCarouselOrientation;
  transition?: CanopCarouselTransition;
  /** Fait defiler les cartes seul. Boucle, et se suspend au survol et au focus. */
  autoPlay?: boolean;
  /** Duree d'affichage par carte, en millisecondes. */
  interval?: number;
  previousLabel?: string;
  nextLabel?: string;
  children: ReactNode;
}

const SHADOW_GUTTER = tokens.spacing.sm;

const TRANSITION = [
  `transform var(--canop-motion-duration-slow) ${tokens.motion.easing.organic}`,
  `opacity var(--canop-motion-duration-base) ${tokens.motion.easing.standard}`,
].join(", ");

export function Carousel({
  ariaLabel,
  navigation = "arrows",
  orientation = "horizontal",
  transition = "slide",
  autoPlay = false,
  interval = CAROUSEL_DEFAULT_INTERVAL,
  previousLabel,
  nextLabel,
  children,
}: CanopCarouselProps) {
  const { t } = useTranslation();
  const slides = Children.toArray(children);
  const count = slides.length;
  const isVertical = orientation === "vertical";

  const {
    activeIndex,
    canGoPrevious,
    canGoNext,
    goPrevious,
    goNext,
    goTo,
    playing,
    pause,
    resume,
    swipeHandlers,
    clickHandlers,
  } = useCarousel({ count, orientation, autoPlay, interval });

  const previousArrowRef = useRef<HTMLButtonElement | null>(null);
  const nextArrowRef = useRef<HTMLButtonElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const focusFallback = useCallback((from: CarouselArrowDirection) => {
    const sibling = from === "previous" ? nextArrowRef.current : previousArrowRef.current;
    if (sibling && !sibling.disabled) {
      sibling.focus();
      return;
    }
    viewportRef.current?.focus();
  }, []);

  const showArrows = navigation === "arrows" && count > 1;
  const showBars = navigation === "bars" && count > 1;
  const pageScrollAxisLeftToBrowser = isVertical ? "pan-x" : "pan-y";

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: tokens.spacing["2xs"],
        }}
      >
        {showArrows && (
          <CarouselArrow
            direction="previous"
            orientation={orientation}
            label={previousLabel ?? t("canop.carousel.previous")}
            disabled={!canGoPrevious}
            onClick={goPrevious}
            buttonRef={previousArrowRef}
            onDisabledWhileFocused={() => focusFallback("previous")}
          />
        )}

        <Box
          ref={viewportRef}
          role="region"
          aria-label={ariaLabel}
          tabIndex={count > 1 ? 0 : undefined}
          onPointerEnter={pause}
          onPointerLeave={resume}
          onFocus={pause}
          onBlur={resume}
          {...(showBars ? { ...swipeHandlers, ...clickHandlers } : {})}
          sx={{
            display: "grid",
            overflow: "hidden",
            flex: 1,
            minWidth: 0,
            width: "100%",
            touchAction: pageScrollAxisLeftToBrowser,
            gridTemplateAreas: '"slide"',
            ...withoutFocusRing,
            ...(showBars && isVertical ? { paddingRight: tokens.spacing.lg } : null),
          }}
        >
          {slides.map((slide, index) => {
            const offset = index - activeIndex;
            const active = index === activeIndex;
            return (
              <Box
                key={index}
                aria-hidden={active ? undefined : true}
                sx={{
                  gridArea: "slide",
                  minWidth: 0,
                  padding: SHADOW_GUTTER,
                  transition: TRANSITION,
                  ...(transition === "fade"
                    ? { opacity: active ? 1 : 0 }
                    : { transform: slideTransform(offset, orientation) }),
                  ...(active ? null : { pointerEvents: "none" }),
                  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
                }}
              >
                {slide}
              </Box>
            );
          })}
        </Box>

        {showArrows && (
          <CarouselArrow
            direction="next"
            orientation={orientation}
            label={nextLabel ?? t("canop.carousel.next")}
            disabled={!canGoNext}
            onClick={goNext}
            buttonRef={nextArrowRef}
            onDisabledWhileFocused={() => focusFallback("next")}
          />
        )}
      </Box>

      {showBars && (
        <CarouselIndicators
          ariaLabel={ariaLabel}
          orientation={orientation}
          count={count}
          activeIndex={activeIndex}
          autoPlaying={playing}
          interval={interval}
          slideLabel={(position) => t("canop.carousel.goToSlide", { index: position })}
          onSelect={goTo}
        />
      )}
    </Box>
  );
}
