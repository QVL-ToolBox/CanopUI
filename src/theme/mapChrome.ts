import type { CSSObject } from "@mui/material/styles";
import { hoverOrKeyboardFocus } from "../interaction";
import { squircleClip } from "../squircle";
import { tokens } from "../tokens";

const PAPER = "var(--canop-palette-background-paper)";

const MAPLIBRE_FOCUS_INDICATORS = [
  ".maplibregl-map .maplibregl-ctrl.maplibregl-ctrl-group button:focus",
  ".maplibregl-map .maplibregl-ctrl .maplibregl-ctrl-attrib-button:focus",
  ".maplibregl-map .maplibregl-canvas:focus",
].join(", ");

export function mapChromeSx(): CSSObject {
  return {
    ".maplibregl-map": {
      fontFamily: tokens.typography.fontFamily,
    },
    ".maplibregl-popup": {
      filter: "var(--canop-drop-shadow-e2)",
    },
    ".maplibregl-popup-content": {
      ...squircleClip(tokens.radius.md),
      backgroundColor: PAPER,
      color: "var(--canop-palette-text-primary)",
      padding: "0.75rem 0.875rem",
      boxShadow: "none",
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize.sm,
    },
    '[class*="maplibregl-popup-anchor-top"] .maplibregl-popup-tip': {
      borderBottomColor: PAPER,
    },
    '[class*="maplibregl-popup-anchor-bottom"] .maplibregl-popup-tip': {
      borderTopColor: PAPER,
    },
    ".maplibregl-popup-anchor-left .maplibregl-popup-tip": {
      borderRightColor: PAPER,
    },
    ".maplibregl-popup-anchor-right .maplibregl-popup-tip": {
      borderLeftColor: PAPER,
    },
    ".maplibregl-ctrl-top-right": {
      filter: "var(--canop-drop-shadow-e1)",
    },
    ".maplibregl-ctrl-group": {
      ...squircleClip(tokens.radius.sm),
      backgroundColor: PAPER,
      boxShadow: "none",
      border: "none",
    },
    ".maplibregl-ctrl-group button": {
      backgroundColor: "transparent",
      width: "2rem",
      height: "2rem",
      [hoverOrKeyboardFocus()]: { backgroundColor: "var(--canop-palette-surface-sunken)" },
      "& + button": { borderTop: "0.0625rem solid var(--canop-palette-divider)" },
    },
    [MAPLIBRE_FOCUS_INDICATORS]: { boxShadow: "none", outline: "none" },
    "@media (pointer: coarse)": {
      ".maplibregl-ctrl-group button": { width: "2.75rem", height: "2.75rem" },
      ".maplibregl-ctrl-attrib": { fontSize: tokens.typography.fontSize.xs },
    },
    ".maplibregl-cooperative-gesture-screen": {
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize.sm,
      backgroundColor: "color-mix(in srgb, var(--canop-palette-text-primary) 55%, transparent)",
      color: PAPER,
    },
    ".maplibregl-ctrl-attrib": {
      ...squircleClip(tokens.radius.xs),
      backgroundColor: `color-mix(in srgb, ${PAPER} 82%, transparent)`,
      color: "var(--canop-palette-text-secondary)",
      fontSize: tokens.typography.fontSize.xs,
    },
    ".maplibregl-ctrl-attrib a": {
      color: "var(--canop-palette-text-secondary)",
    },
  };
}
