import type { CanopThemeMode } from "../../theme/createCanopTheme";

const WHITE = "var(--canop-palette-common-white)";
const BLACK = "var(--canop-palette-common-black)";
const PRIMARY_LIGHT = "var(--canop-palette-primary-light)";
const PRIMARY_MAIN = "var(--canop-palette-primary-main)";
const PRIMARY_DARK = "var(--canop-palette-primary-dark)";

const BG_TOP_VAR = "--canop-navbar-bg-top";
const BG_BOTTOM_VAR = "--canop-navbar-bg-bottom";
const TEXT_VAR = "--canop-navbar-text";
const TEXT_HOVER_VAR = "--canop-navbar-text-hover";
const TEXT_MUTED_VAR = "--canop-navbar-text-muted";
const HOVER_FILL_VAR = "--canop-navbar-hover-fill";
const EDGE_VAR = "--canop-navbar-edge";
const SEPARATOR_VAR = "--canop-navbar-separator";
const ACTIVE_BG_VAR = "--canop-navbar-active-bg";
const ACTIVE_TEXT_VAR = "--canop-navbar-active-text";
const HALO_VAR = "--canop-navbar-halo";
const FOOT_GLOW_VAR = "--canop-navbar-foot-glow";

type NavbarToneVariable =
  | typeof BG_TOP_VAR
  | typeof BG_BOTTOM_VAR
  | typeof TEXT_VAR
  | typeof TEXT_HOVER_VAR
  | typeof TEXT_MUTED_VAR
  | typeof HOVER_FILL_VAR
  | typeof EDGE_VAR
  | typeof SEPARATOR_VAR
  | typeof ACTIVE_BG_VAR
  | typeof ACTIVE_TEXT_VAR
  | typeof HALO_VAR
  | typeof FOOT_GLOW_VAR;

type NavbarToneRecipe = Record<NavbarToneVariable, string>;

function mix(color: string, share: number, base: string): string {
  return `color-mix(in srgb, ${color} ${share}%, ${base})`;
}

function veil(color: string, share: number): string {
  return mix(color, share, "transparent");
}

function deepTone(primaryShare: number): string {
  return mix(PRIMARY_DARK, primaryShare, BLACK);
}

function read(variable: NavbarToneVariable): string {
  return `var(${variable})`;
}

const DEEP_INK = deepTone(70);

const DARK_RECIPE: NavbarToneRecipe = {
  [BG_TOP_VAR]: deepTone(45),
  [BG_BOTTOM_VAR]: deepTone(33),
  [TEXT_VAR]: veil(WHITE, 72),
  [TEXT_HOVER_VAR]: veil(WHITE, 96),
  [TEXT_MUTED_VAR]: veil(WHITE, 58),
  [HOVER_FILL_VAR]: veil(WHITE, 7),
  [EDGE_VAR]: veil(WHITE, 6),
  [SEPARATOR_VAR]: veil(WHITE, 10),
  [ACTIVE_BG_VAR]: WHITE,
  [ACTIVE_TEXT_VAR]: DEEP_INK,
  [HALO_VAR]: veil(PRIMARY_LIGHT, 42),
  [FOOT_GLOW_VAR]: veil(PRIMARY_LIGHT, 17),
};

const LIGHT_RECIPE: NavbarToneRecipe = {
  [BG_TOP_VAR]: PRIMARY_MAIN,
  [BG_BOTTOM_VAR]: PRIMARY_DARK,
  [TEXT_VAR]: veil(WHITE, 88),
  [TEXT_HOVER_VAR]: WHITE,
  [TEXT_MUTED_VAR]: veil(WHITE, 80),
  [HOVER_FILL_VAR]: veil(WHITE, 10),
  [EDGE_VAR]: veil(WHITE, 10),
  [SEPARATOR_VAR]: veil(WHITE, 14),
  [ACTIVE_BG_VAR]: WHITE,
  [ACTIVE_TEXT_VAR]: DEEP_INK,
  [HALO_VAR]: veil(PRIMARY_LIGHT, 35),
  [FOOT_GLOW_VAR]: veil(PRIMARY_LIGHT, 25),
};

export function navbarToneVariables(mode: CanopThemeMode): NavbarToneRecipe {
  return mode === "dark" ? DARK_RECIPE : LIGHT_RECIPE;
}

const HALO_BLUR = "0.75rem";

export const NAVBAR_BG_TOP = read(BG_TOP_VAR);

export const NAVBAR_BG_BOTTOM = read(BG_BOTTOM_VAR);

export const NAVBAR_SURFACE = `linear-gradient(180deg, ${NAVBAR_BG_TOP} 0%, ${NAVBAR_BG_BOTTOM} 100%)`;

export const NAVBAR_FIELD_FILL = mix(WHITE, 10, NAVBAR_BG_TOP);

export const NAVBAR_FIELD_OUTLINE = mix(WHITE, 22, NAVBAR_BG_TOP);

export const NAVBAR_FIELD_OUTLINE_ENGAGED = mix(WHITE, 36, NAVBAR_BG_TOP);

export const NAVBAR_SURFACE_SHADOW = "var(--canop-drop-shadow-e3)";

export const NAVBAR_POPOVER_SHADOW = "var(--canop-drop-shadow-e4)";

export const NAVBAR_RADIUS = "var(--canop-radius-xl)";

export const NAVBAR_EDGE = read(EDGE_VAR);

export const NAVBAR_TEXT = read(TEXT_VAR);

export const NAVBAR_TEXT_STRONG = read(TEXT_HOVER_VAR);

export const NAVBAR_TEXT_MUTED = read(TEXT_MUTED_VAR);

export const NAVBAR_HOVER_FILL = read(HOVER_FILL_VAR);

export const NAVBAR_SEPARATOR = read(SEPARATOR_VAR);

export const NAVBAR_ACTIVE_FILL = read(ACTIVE_BG_VAR);

export const NAVBAR_ACTIVE_INK = read(ACTIVE_TEXT_VAR);

export const NAVBAR_ACTIVE_HALO = `drop-shadow(0 0 ${HALO_BLUR} ${read(HALO_VAR)})`;

export const NAVBAR_ACTIVE_SHADOW = "var(--canop-drop-shadow-e1)";

export const NAVBAR_SUBITEMS_BADGE = "var(--canop-palette-accent-main)";

export const NAVBAR_FOOT_GLOW = `radial-gradient(circle at 50% 120%, ${read(FOOT_GLOW_VAR)}, transparent 70%)`;
