import type { CSSObject } from "@mui/material/styles";
import { squircleClipPath } from "../squircle";
import { scrollbar } from "../tokens/scrollbar";

export type CanopScrollbarVariant = "default" | "thin" | "hidden";

const TOP_DARK = "var(--canop-scrollbar-thumb-top, var(--canop-palette-primary-dark))";
const THUMB = "var(--canop-scrollbar-thumb, var(--canop-palette-primary-main))";
const BOTTOM_LIGHT_PULLED_TOWARD_MAIN =
  "var(--canop-scrollbar-thumb-bottom, color-mix(in srgb, var(--canop-palette-primary-light) 40%, var(--canop-palette-primary-main)))";
const HOVER = "var(--canop-scrollbar-thumb-hover, var(--canop-palette-primary-light))";
const TRACK = "var(--canop-scrollbar-track, transparent)";
const GRIP = "var(--canop-scrollbar-grip, rgba(255, 255, 255, 0.45))";

const GRIP_LAYER = [
  "repeating-linear-gradient(180deg",
  `${GRIP} 0 ${scrollbar.gripThickness}`,
  `transparent ${scrollbar.gripThickness} ${scrollbar.gripPeriod})`,
].join(", ");

const MIDPOINT_NEAR_LIGHT_END = "45%";
const REST_GRADIENT = `linear-gradient(180deg, ${TOP_DARK} 0%, ${THUMB} ${MIDPOINT_NEAR_LIGHT_END}, ${BOTTOM_LIGHT_PULLED_TOWARD_MAIN} 100%)`;
const HOVER_GRADIENT_LIGHTENS_BOTTOM = `linear-gradient(180deg, ${THUMB} 0%, ${HOVER} 100%)`;
const ACTIVE_GRADIENT_DARKENS_ALL = `linear-gradient(180deg, ${TOP_DARK} 0%, ${THUMB} 100%)`;

const grippedWith = (gradient: string) => `${GRIP_LAYER}, ${gradient}`;

const BEVEL = [
  "inset 0 0.0625rem 0 rgba(255, 255, 255, 0.28)",
  "inset 0 -0.0625rem 0 rgba(0, 0, 0, 0.18)",
].join(", ");
const BEVEL_PRESSED = "inset 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.32)";

const THUMB_CLIP = squircleClipPath(scrollbar.radius, { exponent: scrollbar.thumbExponent });

const hidden: CSSObject = {
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
};

function visible(width: string): CSSObject {
  return {
    "@supports not selector(::-webkit-scrollbar)": {
      scrollbarWidth: "thin",
      scrollbarColor: `${THUMB} ${TRACK}`,
    },
    "&::-webkit-scrollbar": { width, height: width },
    "&::-webkit-scrollbar-track": { backgroundColor: TRACK },
    "&::-webkit-scrollbar-corner": { backgroundColor: TRACK },
    "&::-webkit-scrollbar-thumb": {
      backgroundImage: grippedWith(REST_GRADIENT),
      backgroundRepeat: "no-repeat, no-repeat",
      backgroundPosition: "center, center",
      backgroundSize: `${scrollbar.gripWidth} ${scrollbar.gripHeight}, auto`,
      borderRadius: scrollbar.radius,
      clipPath: THUMB_CLIP,
      boxShadow: BEVEL,
      minHeight: "2rem",
      transition: "background-image 120ms linear",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundImage: grippedWith(HOVER_GRADIENT_LIGHTENS_BOTTOM),
      boxShadow: BEVEL,
    },
    "&::-webkit-scrollbar-thumb:active": {
      backgroundImage: grippedWith(ACTIVE_GRADIENT_DARKENS_ALL),
      boxShadow: BEVEL_PRESSED,
    },
  };
}

export function scrollbarSx(variant: CanopScrollbarVariant = "default"): CSSObject {
  if (variant === "hidden") return hidden;
  return visible(variant === "thin" ? scrollbar.widthThin : scrollbar.width);
}
