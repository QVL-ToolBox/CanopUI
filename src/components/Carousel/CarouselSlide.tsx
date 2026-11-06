import Box from "@mui/material/Box";
import type { CSSObject } from "@mui/material/styles";
import type { ReactNode } from "react";
import { tokens } from "../../tokens";
import {
  slideTransform,
  type CanopCarouselOrientation,
  type CanopCarouselTransition,
} from "./carouselHelpers";

export interface CarouselSlideProps {
  offset: number;
  visible: boolean;
  orientation: CanopCarouselOrientation;
  transition: CanopCarouselTransition;
  moving: boolean;
  children: ReactNode;
}

const SHADOW_GUTTER = tokens.spacing.sm;

const TRANSITION = [
  `transform var(--canop-motion-duration-slow) ${tokens.motion.easing.organic}`,
  `opacity var(--canop-motion-duration-base) ${tokens.motion.easing.standard}`,
].join(", ");

function placement(
  offset: number,
  visible: boolean,
  orientation: CanopCarouselOrientation,
  transition: CanopCarouselTransition,
  moving: boolean,
): CSSObject {
  const transform = moving ? { transform: slideTransform(offset, orientation) } : null;
  const opacity = transition === "fade" ? { opacity: visible ? 1 : 0 } : null;
  return { ...transform, ...opacity };
}

export function CarouselSlide({
  offset,
  visible,
  orientation,
  transition,
  moving,
  children,
}: CarouselSlideProps) {
  return (
    <Box
      aria-hidden={visible ? undefined : true}
      sx={{
        gridRow: 1,
        gridColumn: 1,
        minWidth: 0,
        padding: SHADOW_GUTTER,
        transition: TRANSITION,
        ...placement(offset, visible, orientation, transition, moving),
        ...(visible ? null : { pointerEvents: "none" }),
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      {children}
    </Box>
  );
}
