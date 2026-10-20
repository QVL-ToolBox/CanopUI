import Box from "@mui/material/Box";
import { squircleSurface } from "../../squircle";
import { focusRingSx } from "../_shared/focusRing";
import { Icon, type CanopIconColor } from "../Icon";
import type { CanopThemeMode } from "../../theme";
import {
  THEME_TOGGLE_SEGMENT_SIZE,
  THEME_TOGGLE_TRACK_HEIGHT,
  THEME_TOGGLE_TRACK_PADDING,
  THEME_TOGGLE_TRACK_WIDTH,
} from "./constants";
import { ThemeToggleThumb } from "./ThemeToggleThumb";
import { useThemeToggle } from "./useThemeToggle";

const OPTION_ICON_COLORS: Record<CanopThemeMode, CanopIconColor> = {
  light: "accent",
  dark: "primary",
};

export function ThemeToggle() {
  const { groupLabel, options, activeIndex, isDark, reducedMotion, toggle, handleKeyDown } =
    useThemeToggle();
  return (
    <Box
      component="button"
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={groupLabel}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: THEME_TOGGLE_TRACK_WIDTH,
        height: THEME_TOGGLE_TRACK_HEIGHT,
        paddingX: THEME_TOGGLE_TRACK_PADDING,
        border: "none",

        ...squircleSurface({
          radius: "1.25rem",
          shape: "pill",
          background: "var(--canop-palette-surface-sunken)",
          shadow: "var(--canop-drop-shadow-e2)",
        }),

        cursor: "pointer",

        transition: reducedMotion
          ? "none"
          : "background-color var(--canop-motion-duration-base) var(--canop-motion-ease-standard)",

        "&:focus-visible": focusRingSx,
      }}
    >
      <ThemeToggleThumb activeIndex={activeIndex} reducedMotion={reducedMotion} />
      {options.map((option) => (
        <Box
          key={option.mode}
          aria-hidden
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: THEME_TOGGLE_SEGMENT_SIZE,
            height: "100%",
            zIndex: 1,
            opacity: option.isActive ? 1 : 0.45,
            transform: option.isActive ? "scale(1)" : "scale(0.82)",

            transition: reducedMotion
              ? "none"
              : "opacity var(--canop-motion-duration-fast) var(--canop-motion-ease-standard), transform var(--canop-motion-duration-fast) var(--canop-motion-ease-standard)",
          }}
        >
          <Icon
            name={option.icon}
            variant="solid"
            size="xs"
            color={OPTION_ICON_COLORS[option.mode]}
          />
        </Box>
      ))}
    </Box>
  );
}
