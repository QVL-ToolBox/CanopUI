import type { CSSObject, ThemeOptions } from "@mui/material/styles";
import { hoverOrKeyboardFocus } from "../../interaction";
import {
  fieldHoverOrSelectKeyboardFocus,
  validFieldHoverOrSelectKeyboardFocus,
} from "../../interaction/interactionStates";
import { PALETTE_COLORS } from "../keyboardFocusMirroringHover";
import { glow, glowFilter, innerGlow, neonTextGlow } from "./glow";
import { neonFlicker } from "./neonFlicker";

export type CanopComponents = NonNullable<ThemeOptions["components"]>;

type GlowVariants<Name extends keyof CanopComponents> =
  NonNullable<CanopComponents[Name]> extends { variants?: infer Variants }
    ? NonNullable<Variants>
    : never;

type GlowVariant<Name extends keyof CanopComponents> =
  GlowVariants<Name> extends ReadonlyArray<infer Variant> ? Variant : never;

type AnyColor = (typeof PALETTE_COLORS)[number];
type StandardColor = Exclude<AnyColor, "accent">;

const ALL_COLORS = PALETTE_COLORS;
const STANDARD_COLORS = ALL_COLORS.filter((color): color is StandardColor => color !== "accent");
const TAB_INDICATOR_COLORS = ["primary", "secondary"] as const;
const GLOWING_HEADINGS = ["h1", "h2", "h3"] as const;

type TabIndicatorColor = (typeof TAB_INDICATOR_COLORS)[number];

const GLOW_EASE = "var(--canop-motion-duration-base) var(--canop-motion-ease-organic)";
const BOX_SHADOW_TRANSITION = `box-shadow ${GLOW_EASE}`;

export const GLOW_FILTER_TRANSITION = `filter ${GLOW_EASE}`;

const BUTTON_GLOW_VAR = "--canop-button-glow";
const BUTTON_GLOW = `var(${BUTTON_GLOW_VAR})`;

export const BUTTON_GLOW_SLOT = `var(${BUTTON_GLOW_VAR},)`;

const ICON = ".MuiSvgIcon-root";
const ENABLED = ":not(.Mui-disabled)";
const CHECKBOX_CHECKED = `&.Mui-checked${ENABLED}, &.MuiCheckbox-indeterminate${ENABLED}`;
const RADIO_CHECKED = `&.Mui-checked${ENABLED}`;
const ICON_GLOW_TRANSITION: CSSObject = { [`& ${ICON}`]: { transition: GLOW_FILTER_TRANSITION } };

function checkedIconGlow(checked: string, color: StandardColor): CSSObject {
  return {
    [checked]: {
      [`& ${ICON}`]: { filter: glowFilter(color, "rest") },
      [hoverOrKeyboardFocus(` ${ICON}`)]: { filter: glowFilter(color, "peak") },
    },
  };
}

function isGlowingHeading(value: unknown): boolean {
  return GLOWING_HEADINGS.some((heading) => heading === value);
}

function buttonColorGlow(color: AnyColor): GlowVariants<"MuiButton"> {
  return [
    {
      props: { variant: "contained", color },
      style: {
        [BUTTON_GLOW_VAR]: glowFilter(color, "rest"),
        filter: BUTTON_GLOW,
        [hoverOrKeyboardFocus()]: { [BUTTON_GLOW_VAR]: glowFilter(color, "peak") },
      },
    },
    {
      props: (state) => state.variant !== "contained" && state.color === color,
      style: {
        [hoverOrKeyboardFocus()]: {
          [BUTTON_GLOW_VAR]: glowFilter(color, "rest"),
          filter: BUTTON_GLOW,
        },
      },
    },
  ];
}

function switchColorGlow(color: StandardColor): GlowVariant<"MuiSwitch"> {
  return {
    props: { color },
    style: {
      [`& .MuiSwitch-switchBase.Mui-checked${ENABLED}`]: {
        "& .MuiSwitch-thumb": { boxShadow: glow(color, "rest") },
        "& + .MuiSwitch-track": { boxShadow: glow(color, "faint") },
      },
    },
  };
}

function checkboxColorGlow(color: StandardColor): GlowVariant<"MuiCheckbox"> {
  return { props: { color }, style: checkedIconGlow(CHECKBOX_CHECKED, color) };
}

function radioColorGlow(color: StandardColor): GlowVariant<"MuiRadio"> {
  return { props: { color }, style: checkedIconGlow(RADIO_CHECKED, color) };
}

function sliderColorGlow(color: AnyColor): GlowVariant<"MuiSlider"> {
  return {
    props: { color },
    style: {
      [`&${ENABLED}`]: {
        "& .MuiSlider-thumb": { filter: glowFilter(color, "rest") },
        "& .MuiSlider-track": { boxShadow: innerGlow(color, "rest") },
      },
    },
  };
}

function chipColorGlow(color: StandardColor): GlowVariants<"MuiChip"> {
  return [
    {
      props: { variant: "filled", color },
      style: {
        boxShadow: innerGlow(color, "rest"),
        "&.MuiChip-clickable": {
          [hoverOrKeyboardFocus()]: { boxShadow: innerGlow(color, "peak") },
        },
      },
    },
    {
      props: { variant: "outlined", color },
      style: { boxShadow: innerGlow(color, "faint") },
    },
  ];
}

function badgeColorGlow(color: AnyColor): GlowVariant<"MuiBadge"> {
  return {
    props: { color },
    style: { "& .MuiBadge-badge": { boxShadow: innerGlow(color, "rest") } },
  };
}

function linearProgressColorGlow(color: AnyColor): GlowVariant<"MuiLinearProgress"> {
  return { props: { color }, style: { boxShadow: glow(color, "faint") } };
}

function circularProgressColorGlow(color: AnyColor): GlowVariant<"MuiCircularProgress"> {
  return {
    props: { color },
    style: { "& .MuiCircularProgress-svg": { filter: glowFilter(color, "rest") } },
  };
}

function tabsColorGlow(color: TabIndicatorColor): GlowVariant<"MuiTabs"> {
  return {
    props: { indicatorColor: color },
    style: { "& .MuiTabs-indicator": { boxShadow: glow(color, "rest") } },
  };
}

const buttonGlow: GlowVariants<"MuiButton"> = [
  ...ALL_COLORS.flatMap(buttonColorGlow),
  { props: {}, style: { "&.Mui-disabled, &.MuiButton-loading": { filter: "none" } } },
];

const fieldGlow: GlowVariants<"MuiOutlinedInput"> = [
  {
    props: {},
    style: {
      transition: GLOW_FILTER_TRANSITION,
      [validFieldHoverOrSelectKeyboardFocus()]: { filter: glowFilter("primary", "rest") },
      [fieldHoverOrSelectKeyboardFocus("&.Mui-error")]: { filter: glowFilter("error", "rest") },
    },
  },
];

const switchGlow: GlowVariants<"MuiSwitch"> = [
  {
    props: {},
    style: ({ theme }) => ({
      "& .MuiSwitch-thumb": { transition: BOX_SHADOW_TRANSITION },
      "& .MuiSwitch-track": {
        transition: theme.transitions.create(["opacity", "background-color", "box-shadow"], {
          duration: theme.transitions.duration.shortest,
        }),
      },
    }),
  },
  ...STANDARD_COLORS.map(switchColorGlow),
];

const checkboxGlow: GlowVariants<"MuiCheckbox"> = [
  { props: {}, style: ICON_GLOW_TRANSITION },
  ...STANDARD_COLORS.map(checkboxColorGlow),
];

const radioGlow: GlowVariants<"MuiRadio"> = [
  { props: {}, style: ICON_GLOW_TRANSITION },
  ...STANDARD_COLORS.map(radioColorGlow),
];

const chipGlow: GlowVariants<"MuiChip"> = [
  ...STANDARD_COLORS.flatMap(chipColorGlow),
  { props: {}, style: { "&.Mui-disabled": { boxShadow: "none" } } },
];

const headingGlow: GlowVariants<"MuiTypography"> = [
  {
    props: (state) => isGlowingHeading(state.variant),
    style: { textShadow: neonTextGlow("primary"), ...neonFlicker },
  },
];

export const NEON_GLOW_VARIANTS = {
  MuiButton: buttonGlow,
  MuiOutlinedInput: fieldGlow,
  MuiSwitch: switchGlow,
  MuiCheckbox: checkboxGlow,
  MuiRadio: radioGlow,
  MuiSlider: ALL_COLORS.map(sliderColorGlow),
  MuiChip: chipGlow,
  MuiBadge: ALL_COLORS.map(badgeColorGlow),
  MuiLinearProgress: ALL_COLORS.map(linearProgressColorGlow),
  MuiCircularProgress: ALL_COLORS.map(circularProgressColorGlow),
  MuiTabs: TAB_INDICATOR_COLORS.map(tabsColorGlow),
  MuiTypography: headingGlow,
} satisfies { [Name in keyof CanopComponents]?: GlowVariants<Name> };
