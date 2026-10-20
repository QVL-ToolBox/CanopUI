import Box from "@mui/material/Box";
import { squircleSurface } from "../../squircle";
import { THEME_TOGGLE_SEGMENT_SIZE, THEME_TOGGLE_TRACK_PADDING } from "./constants";

export interface ThemeToggleThumbProps {
  activeIndex: number;
  reducedMotion: boolean;
}

export function ThemeToggleThumb({ activeIndex, reducedMotion }: ThemeToggleThumbProps) {
  return (
    <Box
      aria-hidden
      sx={{
        top: THEME_TOGGLE_TRACK_PADDING,
        left: THEME_TOGGLE_TRACK_PADDING,
        width: THEME_TOGGLE_SEGMENT_SIZE,
        height: `calc(100% - 2 * ${THEME_TOGGLE_TRACK_PADDING})`,

        ...squircleSurface({
          radius: "1rem",
          shape: "pill",
          background: "var(--canop-palette-background-paper)",
          shadow: "var(--canop-drop-shadow-e2)",
        }),
        position: "absolute",
        transform: `translateX(calc(${activeIndex} * ${THEME_TOGGLE_SEGMENT_SIZE}))`,

        transition: reducedMotion
          ? "none"
          : "transform var(--canop-motion-duration-base) var(--canop-motion-ease-spring-soft)",
      }}
    />
  );
}
