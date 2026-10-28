import { createTheme, type CSSObject, type Theme } from "@mui/material/styles";
import { tokens } from "../tokens";
import { scrollbarSx } from "../scrollbar";
import { mapChromeSx } from "./mapChrome";
import { squircleClip, squircleClipPath, squircleRingPath, squircleSurface } from "../squircle";
import { SQUIRCLE_CLIP_VAR } from "../squircle/squircleSx";
import { hoverOrKeyboardFocus, keyboardFocus } from "../interaction";
import { validFieldHoverOrSelectKeyboardFocus } from "../interaction/interactionStates";
import { navbarToneVariables } from "../components/Navbar/navbarTone";
import { actionFocusMirroringHover } from "./actionFocusMirroringHover";
import { neonGlowVariables, withNeonGlow } from "./neonGlow";
import {
  buttonKeyboardFocus,
  fabKeyboardFocus,
  selectionControlKeyboardFocus,
  switchBaseKeyboardFocus,
  toggleButtonKeyboardFocus,
} from "./keyboardFocusMirroringHover";
import {
  centeredRippleFillingSquircle,
  rippleClippedToOwnSquircle,
} from "./pressEffectFollowingShape";

export type CanopThemeMode = "light" | "dark";

export type CanopSeason = "halloween";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xl: false;
  }
  interface Palette {
    accent: Palette["primary"];
    surface: {
      sunken: string;
      base: string;
      raised: string;
      overlay: string;
    };
  }
  interface PaletteOptions {
    accent?: PaletteOptions["primary"];
    surface?: {
      sunken: string;
      base: string;
      raised: string;
      overlay: string;
    };
  }
  interface TypeText {
    onPrimary: string;
    onAccent: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    accent: true;
  }
}

declare module "@mui/material/CircularProgress" {
  interface CircularProgressPropsColorOverrides {
    accent: true;
  }
}

declare module "@mui/material/LinearProgress" {
  interface LinearProgressPropsColorOverrides {
    accent: true;
  }
}

declare module "@mui/material/Slider" {
  interface SliderPropsColorOverrides {
    accent: true;
  }
}

const remToPx = (value: string): number => parseFloat(value) * 16;
const msToNumber = (value: string): number => parseFloat(value);

const INPUT_RADIUS = "var(--canop-radius-md)";
const INPUT_BORDER_WIDTH = "0.125rem";
const INPUT_OUTLINE_VAR = "--canop-input-outline";
const INPUT_OUTLINE = `var(${INPUT_OUTLINE_VAR})`;
const LABEL_SHRINK_INLINE_START = "0.875rem";
const LABEL_SHRINK_BLOCK_START = "-0.5625rem";
const LABEL_SHRINK_SCALE = 0.75;
const LABEL_SHRINK_GUTTER = "0.4rem";
const LABEL_SHRINK_SCALED_GUTTER = `calc(${LABEL_SHRINK_GUTTER} * ${LABEL_SHRINK_SCALE})`;
const NOTCH_CORNER_CLEARANCE = INPUT_BORDER_WIDTH;
const NOTCH_INLINE_START = `calc(${LABEL_SHRINK_INLINE_START} + ${NOTCH_CORNER_CLEARANCE})`;
const NOTCH_INLINE_END = INPUT_RADIUS;
const NOTCH_LEGEND_GUTTER_START = `calc(${LABEL_SHRINK_SCALED_GUTTER} - ${NOTCH_CORNER_CLEARANCE})`;
const LABEL_SHRINK_OFFSET = `translate(${LABEL_SHRINK_INLINE_START}, ${LABEL_SHRINK_BLOCK_START})`;
const LABEL_SHRINK_ROOM = `calc(100% - ${LABEL_SHRINK_INLINE_START} - ${NOTCH_INLINE_END})`;

const OUTLINED_LABEL_SHRUNK_INTO_NOTCH: CSSObject = {
  paddingInline: LABEL_SHRINK_GUTTER,
  transform: `${LABEL_SHRINK_OFFSET} scale(${LABEL_SHRINK_SCALE})`,
  maxWidth: `calc(${LABEL_SHRINK_ROOM} / ${LABEL_SHRINK_SCALE})`,
};

const INPUT_BACKGROUND =
  "color-mix(in srgb, var(--canop-palette-secondary-light) 32%, var(--canop-palette-background-paper))";
const INPUT_FILL_VAR = "--canop-input-fill";
const INPUT_FILL = `var(${INPUT_FILL_VAR})`;

const AUTOFILL_INSET_SHADOW_COVERING_AGENT_BACKGROUND = {
  boxShadow: `inset 0 0 0 100px var(--canop-input-autofill, ${INPUT_FILL})`,
  WebkitBoxShadow: `inset 0 0 0 100px var(--canop-input-autofill, ${INPUT_FILL})`,
  WebkitTextFillColor: "var(--canop-palette-text-primary)",
  caretColor: "var(--canop-palette-text-primary)",
};

const AUTOFILL_EVERY_STATE_SELECTOR = [
  "& :-webkit-autofill",
  "& :-webkit-autofill:hover",
  "& :-webkit-autofill:focus",
  "& :-webkit-autofill:active",
].join(", ");

const ALERT_RADIUS = "var(--canop-radius-md)";
const ALERT_GEOMETRY = { exponent: 4 };
const ALERT_BORDER = "0.0625rem";

const CIRCLE_CLIP = squircleClipPath("50%", { shape: "circle" });
const ICON_BUTTON_CLIP_FOLLOWING_SURFACE_ELSE_CIRCLE = `var(${SQUIRCLE_CLIP_VAR}, ${CIRCLE_CLIP})`;
const LAYER_TRANSITION =
  "background-color var(--canop-motion-duration-base) var(--canop-motion-ease-standard)";

const WITHOUT_FOCUS_RIPPLE = { defaultProps: { disableFocusRipple: true } } as const;
const ENABLED_FIELD = ":not(.Mui-disabled):not(.Mui-error)";

const NOTCHED_OUTLINE = ".MuiOutlinedInput-notchedOutline";
const FIELD_WITH_FLOATING_LABEL = `&:has(${NOTCHED_OUTLINE} legend > span:not(.notranslate))`;
const MASK_OPAQUE = "black";
const OUTLINE_LAYER_WITHOUT_TOP_EDGE = [
  "linear-gradient(transparent",
  `transparent ${INPUT_BORDER_WIDTH}`,
  `${MASK_OPAQUE} ${INPUT_BORDER_WIDTH})`,
].join(", ");

const NOTCH_DEPTH = "0.625rem";
const NOTCH_OUTLINE_SHARE = `${(parseFloat(INPUT_BORDER_WIDTH) / parseFloat(NOTCH_DEPTH)) * 100}%`;
const NOTCH_BAND_BELOW_FILL_TOP = `calc(${NOTCH_DEPTH} - ${INPUT_BORDER_WIDTH})`;
const NOTCH_BAND_LAYER = -3;
const TOP_BAND_OUTLINE_THEN_FILL = [
  `linear-gradient(${INPUT_OUTLINE} ${NOTCH_OUTLINE_SHARE}`,
  `${INPUT_FILL} ${NOTCH_OUTLINE_SHARE}) 100% 0 0 0 / ${NOTCH_DEPTH} 0 0 0 stretch`,
].join(", ");
const FILL_LAYER_WITHOUT_TOP_BAND = [
  "linear-gradient(transparent",
  `transparent ${NOTCH_BAND_BELOW_FILL_TOP}`,
  `${MASK_OPAQUE} ${NOTCH_BAND_BELOW_FILL_TOP})`,
].join(", ");

const TOP_BAND_NOTCHED_UNDER_LABEL: CSSObject = {
  [`& ${NOTCHED_OUTLINE}`]: {
    inset: 0,
    zIndex: NOTCH_BAND_LAYER,
    paddingBlock: 0,
    paddingInline: `${NOTCH_INLINE_START} ${NOTCH_INLINE_END}`,
    borderStyle: "solid",
    borderWidth: `${NOTCH_DEPTH} 0 0`,
    borderColor: INPUT_OUTLINE,
    borderImage: TOP_BAND_OUTLINE_THEN_FILL,
    borderRadius: 0,
    clipPath: `var(${SQUIRCLE_CLIP_VAR})`,
    "& legend": {
      display: "block",
      height: NOTCH_DEPTH,
      lineHeight: NOTCH_DEPTH,
      "& > span": { paddingInline: `${NOTCH_LEGEND_GUTTER_START} ${LABEL_SHRINK_SCALED_GUTTER}` },
    },
  },
  "&::before": {
    clipPath: squircleRingPath(INPUT_RADIUS, INPUT_BORDER_WIDTH),
    maskImage: OUTLINE_LAYER_WITHOUT_TOP_EDGE,
  },
  "&::after": {
    maskImage: FILL_LAYER_WITHOUT_TOP_BAND,
  },
};

const headingBase = {
  fontFamily: tokens.typography.fontFamilyHeading,
} as const;

const HALLOWEEN_HEADING_GLOW =
  "0 0 1.25rem color-mix(in srgb, var(--canop-palette-primary-main) 40%, transparent)";

function paletteFor(mode: CanopThemeMode, season: CanopSeason | null) {
  if (season === "halloween") {
    return mode === "dark" ? tokens.paletteHalloweenDark : tokens.paletteHalloween;
  }
  return mode === "dark" ? tokens.paletteDark : tokens.palette;
}

function seasonalGlobalStyles(mode: CanopThemeMode, season: CanopSeason | null) {
  if (season !== "halloween" || mode !== "dark") return {};
  return { "h1, h2, h3, h4, h5, h6": { textShadow: HALLOWEEN_HEADING_GLOW } };
}

function buildCanopCssVariables(mode: CanopThemeMode): Record<string, string> {
  const elevation = mode === "dark" ? tokens.shadows.dark : tokens.shadows.light;
  const dropElevation = mode === "dark" ? tokens.shadows.dropDark : tokens.shadows.dropLight;
  return {
    "--canop-shadow-e1": elevation.e1,
    "--canop-shadow-e2": elevation.e2,
    "--canop-shadow-e3": elevation.e3,
    "--canop-shadow-e4": elevation.e4,
    "--canop-shadow-e5": elevation.e5,
    "--canop-drop-shadow-e1": dropElevation.e1,
    "--canop-drop-shadow-e2": dropElevation.e2,
    "--canop-drop-shadow-e3": dropElevation.e3,
    "--canop-drop-shadow-e4": dropElevation.e4,
    "--canop-drop-shadow-e5": dropElevation.e5,
    "--canop-motion-duration-instant": tokens.motion.duration.instant,
    "--canop-motion-duration-fast": tokens.motion.duration.fast,
    "--canop-motion-duration-base": tokens.motion.duration.base,
    "--canop-motion-duration-slow": tokens.motion.duration.slow,
    "--canop-motion-duration-slower": tokens.motion.duration.slower,
    "--canop-motion-ease-standard": tokens.motion.easing.standard,
    "--canop-motion-ease-organic": tokens.motion.easing.organic,
    "--canop-motion-ease-decelerate": tokens.motion.easing.decelerate,
    "--canop-motion-ease-accelerate": tokens.motion.easing.accelerate,
    "--canop-motion-ease-spring-soft": tokens.motion.easing.springSoft,
    "--canop-radius-xs": tokens.radius.xs,
    "--canop-radius-sm": tokens.radius.sm,
    "--canop-radius-md": tokens.radius.md,
    "--canop-radius-lg": tokens.radius.lg,
    "--canop-radius-xl": tokens.radius.xl,
    "--canop-radius-2xl": tokens.radius["2xl"],
    "--canop-radius-pill": tokens.radius.pill,
    "--canop-scrollbar-thumb-top": "var(--canop-palette-primary-dark)",
    "--canop-scrollbar-thumb": "var(--canop-palette-primary-main)",
    "--canop-scrollbar-thumb-bottom":
      "color-mix(in srgb, var(--canop-palette-primary-light) 40%, var(--canop-palette-primary-main))",
    "--canop-scrollbar-thumb-hover": "var(--canop-palette-primary-light)",
    "--canop-scrollbar-track":
      "color-mix(in srgb, var(--canop-palette-primary-main) 7%, transparent)",
    "--canop-spacing-3xs": tokens.spacing["3xs"],
    "--canop-spacing-2xs": tokens.spacing["2xs"],
    "--canop-spacing-xs": tokens.spacing.xs,
    "--canop-spacing-sm": tokens.spacing.sm,
    "--canop-spacing-md": tokens.spacing.md,
    "--canop-spacing-lg": tokens.spacing.lg,
    "--canop-spacing-xl": tokens.spacing.xl,
    "--canop-spacing-2xl": tokens.spacing["2xl"],
    "--canop-spacing-3xl": tokens.spacing["3xl"],
    "--canop-spacing-4xl": tokens.spacing["4xl"],
  };
}

export function createCanopTheme(
  mode: CanopThemeMode = "light",
  season: CanopSeason | null = null,
): Theme {
  const palette = paletteFor(mode, season);
  const elevation = mode === "dark" ? tokens.shadows.dark : tokens.shadows.light;
  const theme = createTheme({
    cssVariables: {
      cssVarPrefix: "canop",
    },
    breakpoints: {
      unit: tokens.breakpoints.unit,
      values: { ...tokens.breakpoints.values },
    },
    palette: {
      mode,
      primary: { ...palette.primary },
      secondary: { ...palette.secondary },
      accent: { ...palette.accent },
      error: { ...palette.error },
      warning: { ...palette.warning },
      info: { ...palette.info },
      success: { ...palette.success },
      background: { ...palette.background },
      surface: { ...palette.surface },
      text: { ...palette.text },
      divider: palette.divider,
      action: actionFocusMirroringHover(mode),
    },
    typography: {
      fontFamily: tokens.typography.fontFamily,
      fontWeightRegular: tokens.typography.fontWeight.regular,
      fontWeightMedium: tokens.typography.fontWeight.medium,
      fontWeightBold: tokens.typography.fontWeight.bold,
      h1: { ...headingBase, ...tokens.typography.heading.h1 },
      h2: { ...headingBase, ...tokens.typography.heading.h2 },
      h3: { ...headingBase, ...tokens.typography.heading.h3 },
      h4: { ...headingBase, ...tokens.typography.heading.h4 },
      h5: { ...headingBase, ...tokens.typography.heading.h5 },
    },
    transitions: {
      duration: {
        shortest: msToNumber(tokens.motion.duration.instant),
        shorter: msToNumber(tokens.motion.duration.fast),
        short: msToNumber(tokens.motion.duration.base),
        standard: msToNumber(tokens.motion.duration.base),
        complex: msToNumber(tokens.motion.duration.slow),
        enteringScreen: msToNumber(tokens.motion.duration.base),
        leavingScreen: msToNumber(tokens.motion.duration.fast),
      },
      easing: {
        easeInOut: tokens.motion.easing.standard,
        easeOut: tokens.motion.easing.decelerate,
        easeIn: tokens.motion.easing.accelerate,
        sharp: tokens.motion.easing.organic,
      },
    },
    spacing: tokens.spacing.unit,
    shape: {
      borderRadius: remToPx(tokens.radius.md),
    },
    components: withNeonGlow(mode, {
      MuiCssBaseline: {
        styleOverrides: {
          ":root": {
            ...buildCanopCssVariables(mode),
            ...navbarToneVariables(mode),
            ...neonGlowVariables(mode),
          },
          "*": scrollbarSx(),
          "input::-ms-reveal, input::-ms-clear": { display: "none" },
          ...mapChromeSx(),
          ...seasonalGlobalStyles(mode, season),
          "@media (prefers-reduced-motion: reduce)": {
            "*, *::before, *::after": {
              animationDuration: "0.01ms !important",
              animationIterationCount: "1 !important",
              animationTimeline: "none !important",
              transitionDuration: "0.01ms !important",
              transitionDelay: "0.01ms !important",
              scrollBehavior: "auto !important",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          outlined: {
            "&.MuiInputLabel-shrink": OUTLINED_LABEL_SHRUNK_INTO_NOTCH,
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: { root: rippleClippedToOwnSquircle },
      },
      MuiButton: {
        ...WITHOUT_FOCUS_RIPPLE,
        styleOverrides: { root: ({ theme: t }) => buttonKeyboardFocus(t) },
      },
      MuiFab: {
        ...WITHOUT_FOCUS_RIPPLE,
        styleOverrides: { root: ({ theme: t }) => fabKeyboardFocus(t) },
      },
      MuiToggleButton: {
        ...WITHOUT_FOCUS_RIPPLE,
        styleOverrides: { root: ({ theme: t }) => toggleButtonKeyboardFocus(t) },
      },
      MuiTab: WITHOUT_FOCUS_RIPPLE,
      MuiRadio: {
        ...WITHOUT_FOCUS_RIPPLE,
        styleOverrides: { root: ({ theme: t }) => selectionControlKeyboardFocus(t) },
      },
      MuiSwitch: {
        ...WITHOUT_FOCUS_RIPPLE,
        styleOverrides: { switchBase: ({ theme: t }) => switchBaseKeyboardFocus(t) },
      },
      MuiCheckbox: {
        ...WITHOUT_FOCUS_RIPPLE,
        styleOverrides: { root: ({ theme: t }) => selectionControlKeyboardFocus(t) },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: ({ theme: t }) => ({
            [`&.Mui-focused${ENABLED_FIELD}`]: { color: t.palette.text.secondary },
          }),
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            [keyboardFocus(":not(.Mui-active) .MuiTableSortLabel-icon")]: { opacity: 0.5 },
          },
        },
      },
      MuiIconButton: {
        ...WITHOUT_FOCUS_RIPPLE,
        styleOverrides: {
          root: {
            borderRadius: 0,
            position: "relative",
            isolation: "isolate",
            [SQUIRCLE_CLIP_VAR]: CIRCLE_CLIP,
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              zIndex: -1,
              pointerEvents: "none",
              clipPath: ICON_BUTTON_CLIP_FOLLOWING_SURFACE_ELSE_CIRCLE,
              backgroundColor: "transparent",
              transition: LAYER_TRANSITION,
            },
            [hoverOrKeyboardFocus()]: {
              backgroundColor: "transparent",
              "&::before": { backgroundColor: "var(--canop-palette-action-hover)" },
            },
            ...centeredRippleFillingSquircle,
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            ...squircleSurface({
              radius: "var(--canop-radius-md)",
              background: "var(--canop-palette-background-paper)",
              shadow: "var(--canop-drop-shadow-e2)",
            }),
            position: "absolute",
            boxShadow: "none",
            backgroundImage: "none",
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: {
            ...squircleClip("0.625rem", { shape: "pill" }),
            borderRadius: 0,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            ...squircleClip("0.8125rem", { shape: "pill" }),
            borderRadius: 0,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            ...squircleClip("var(--canop-radius-xs)"),
            borderRadius: 0,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: ({ theme: t }) => ({
            ...squircleClip(ALERT_RADIUS, ALERT_GEOMETRY),
            borderRadius: 0,
            border: "none",
            position: "relative",
            isolation: "isolate",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              zIndex: -1,
              pointerEvents: "none",
              clipPath: squircleClipPath(ALERT_RADIUS, ALERT_GEOMETRY),
              backgroundColor: t.palette.divider,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: ALERT_BORDER,
              zIndex: -1,
              pointerEvents: "none",
              clipPath: squircleClipPath(`calc(${ALERT_RADIUS} - ${ALERT_BORDER})`, ALERT_GEOMETRY),
              backgroundColor: "inherit",
            },
          }),
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            ...squircleSurface({
              radius: "var(--canop-radius-lg)",
              background: "var(--canop-palette-surface-overlay)",
              shadow: "var(--canop-drop-shadow-e5)",
            }),
            boxShadow: "none",
            backgroundImage: "none",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            [AUTOFILL_EVERY_STATE_SELECTOR]: AUTOFILL_INSET_SHADOW_COVERING_AGENT_BACKGROUND,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme: t }) => ({
            ...squircleSurface({
              radius: INPUT_RADIUS,
              background: INPUT_FILL,
              borderColor: INPUT_OUTLINE,
              borderWidth: INPUT_BORDER_WIDTH,
            }),
            [INPUT_OUTLINE_VAR]: t.palette.primary.main,
            [INPUT_FILL_VAR]: INPUT_BACKGROUND,
            [`& ${NOTCHED_OUTLINE}`]: { border: "none" },
            [`& ${NOTCHED_OUTLINE} legend`]: { display: "none" },
            [validFieldHoverOrSelectKeyboardFocus()]: {
              [INPUT_OUTLINE_VAR]: t.palette.primary.dark,
              "&::before": { backgroundColor: INPUT_OUTLINE },
            },
            "&.Mui-error": {
              [INPUT_OUTLINE_VAR]: t.palette.error.main,
              "&::before": { backgroundColor: INPUT_OUTLINE },
            },
            "&.Mui-disabled": {
              [INPUT_OUTLINE_VAR]: t.palette.action.disabled,
              "&::before": { backgroundColor: INPUT_OUTLINE },
            },
            [FIELD_WITH_FLOATING_LABEL]: TOP_BAND_NOTCHED_UNDER_LABEL,
          }),
        },
      },
    }),
  });
  theme.shadows[1] = elevation.e1;
  theme.shadows[2] = elevation.e2;
  theme.shadows[3] = elevation.e3;
  theme.shadows[4] = elevation.e4;
  theme.shadows[5] = elevation.e5;
  return theme;
}

export const canopTheme = createCanopTheme();
