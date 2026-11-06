import Box from "@mui/material/Box";
import { Children, type ReactNode } from "react";
import { useTranslation } from "../../i18n";
import { withoutFocusRing } from "../../interaction";
import { tokens } from "../../tokens";
import type { CanopResponsiveValue } from "../_shared/responsiveValue";
import { CarouselArrow } from "./CarouselArrow";
import { CarouselIndicators } from "./CarouselIndicators";
import { CarouselSlide } from "./CarouselSlide";
import {
  CAROUSEL_DEFAULT_INTERVAL,
  CAROUSEL_DEFAULT_VISIBLE_COUNT,
  isInWindow,
  type CanopCarouselNavigation,
  type CanopCarouselOrientation,
  type CanopCarouselTransition,
} from "./carouselHelpers";
import { useCarousel } from "./useCarousel";
import { useCarouselArrowFocus } from "./useCarouselArrowFocus";
import { useCarouselVisibleCount } from "./useCarouselVisibleCount";

export type { CanopCarouselNavigation, CanopCarouselOrientation, CanopCarouselTransition };

export interface CanopCarouselProps {
  ariaLabel: string;
  navigation?: CanopCarouselNavigation;
  orientation?: CanopCarouselOrientation;
  transition?: CanopCarouselTransition;
  visibleCount?: CanopResponsiveValue<number>;
  autoPlay?: boolean;
  interval?: number;
  previousLabel?: string;
  nextLabel?: string;
  children: ReactNode;
}

function windowTracks(visibleCount: number): string {
  return `repeat(${visibleCount}, minmax(0, 1fr))`;
}

export function Carousel({
  ariaLabel,
  navigation = "arrows",
  orientation = "horizontal",
  transition = "slide",
  visibleCount: requestedVisibleCount = CAROUSEL_DEFAULT_VISIBLE_COUNT,
  autoPlay = false,
  interval = CAROUSEL_DEFAULT_INTERVAL,
  previousLabel,
  nextLabel,
  children,
}: CanopCarouselProps) {
  const { t } = useTranslation();
  const slides = Children.toArray(children);
  const isVertical = orientation === "vertical";
  const responsiveVisibleCount = useCarouselVisibleCount(requestedVisibleCount);

  const {
    activeIndex,
    visibleCount,
    positionCount,
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
    keyHandlers,
  } = useCarousel({
    count: slides.length,
    visibleCount: responsiveVisibleCount,
    orientation,
    autoPlay,
    interval,
  });
  const { previousArrowRef, nextArrowRef, viewportRef, focusFallback } = useCarouselArrowFocus();

  const navigable = positionCount > 1;
  const showArrows = navigation === "arrows" && navigable;
  const showBars = navigation === "bars" && navigable;
  const moving = transition === "slide" || visibleCount > 1;
  const pageScrollAxisLeftToBrowser = isVertical ? "pan-x" : "pan-y";
  const tracks = windowTracks(visibleCount);

  return (
    <Box sx={{ position: "relative" }}>
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
          tabIndex={navigable ? 0 : undefined}
          onPointerEnter={pause}
          onPointerLeave={resume}
          onFocus={pause}
          onBlur={resume}
          {...keyHandlers}
          {...(showBars ? { ...swipeHandlers, ...clickHandlers } : {})}
          sx={{
            display: "grid",
            overflow: "hidden",
            flex: 1,
            minWidth: 0,
            width: "100%",
            touchAction: pageScrollAxisLeftToBrowser,
            ...(isVertical ? { gridTemplateRows: tracks } : { gridTemplateColumns: tracks }),
            ...withoutFocusRing,
            ...(showBars && isVertical ? { paddingRight: tokens.spacing.lg } : null),
          }}
        >
          {slides.map((slide, index) => (
            <CarouselSlide
              key={index}
              offset={index - activeIndex}
              visible={isInWindow(index, activeIndex, visibleCount)}
              orientation={orientation}
              transition={transition}
              moving={moving}
            >
              {slide}
            </CarouselSlide>
          ))}
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
          count={positionCount}
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
