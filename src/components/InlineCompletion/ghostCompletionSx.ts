import type { SxProps, Theme } from "@mui/material/styles";
import { squircleClip } from "../../squircle";
import type { CanopDataAttributes } from "../_shared/dataAttributes";

type GhostPart = "mirror" | "clip" | "track" | "typed" | "suffix" | "hint";

const GHOST_PART_ATTRIBUTE = "data-canop-ghost";

export function ghostPart(part: GhostPart): CanopDataAttributes {
  return { [GHOST_PART_ATTRIBUTE]: part };
}

function partSelector(part: GhostPart): string {
  return `[${GHOST_PART_ATTRIBUTE}="${part}"]`;
}

const MIRROR = partSelector("mirror");
const SUFFIX = partSelector("suffix");
const HINT = partSelector("hint");

const GHOST_COLOR = "var(--canop-palette-text-disabled)";
const GHOST_FADE = "canop-ghost-completion-fade";
const GHOST_FADE_MOTION = "var(--canop-motion-duration-fast) var(--canop-motion-ease-decelerate)";
const HINT_DELAY = "var(--canop-motion-duration-slow)";

const TYPOGRAPHY_IMPOSED_ON_INPUT = {
  font: "inherit",
  letterSpacing: "inherit",
  textAlign: "start",
  textShadow: "none",
  textTransform: "none",
  textIndent: 0,
  wordSpacing: "normal",
} as const;

export const ghostCompletionFieldSx: SxProps<Theme> = {
  position: "relative",
  isolation: "isolate",
  display: "flex",
  width: "100%",
  minWidth: 0,
  [`& > ${MIRROR}`]: {
    ...TYPOGRAPHY_IMPOSED_ON_INPUT,
    position: "absolute",
    insetBlockStart: 0,
    insetInlineStart: 0,
    insetInlineEnd: 0,
    width: "auto",
    zIndex: -1,
    pointerEvents: "none",
    userSelect: "none",
    animation: "none",
    color: GHOST_COLOR,
    WebkitTextFillColor: GHOST_COLOR,
  },
  [`& ${partSelector("clip")}`]: {
    display: "block",
    height: "100%",
    overflow: "hidden",
  },
  [`& ${partSelector("track")}`]: {
    display: "block",
    whiteSpace: "pre",
    willChange: "transform",
  },
  [`& ${partSelector("typed")}`]: {
    visibility: "hidden",
  },
  [`& ${SUFFIX}`]: {
    display: "inline-block",
    animation: `${GHOST_FADE} ${GHOST_FADE_MOTION} both`,
  },
  [`& ${HINT}`]: {
    ...squircleClip("var(--canop-radius-xs)"),
    display: "inline-block",
    marginInlineStart: "0.5em",
    paddingInline: "0.45em",
    fontFamily: "inherit",
    fontSize: "0.6875em",
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: "0.02em",
    verticalAlign: "middle",
    backgroundColor: `color-mix(in srgb, ${GHOST_COLOR} 18%, transparent)`,
    animation: `${GHOST_FADE} ${GHOST_FADE_MOTION} ${HINT_DELAY} both`,
  },
  "@media (hover: none), (pointer: coarse)": {
    [`& ${HINT}`]: { display: "none" },
  },
  "@media (prefers-reduced-motion: reduce)": {
    [`& ${SUFFIX}, & ${HINT}`]: { animation: "none" },
  },
  [`@keyframes ${GHOST_FADE}`]: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
};
