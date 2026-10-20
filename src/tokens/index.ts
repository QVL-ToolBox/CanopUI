import { breakpoints } from "./breakpoints";
import { map } from "./map";
import { motion } from "./motion";
import { palette, paletteDark, paletteHalloween, paletteHalloweenDark } from "./palette";
import { radius } from "./radius";
import { scrollbar } from "./scrollbar";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { squircle } from "./squircle";
import { typography } from "./typography";

export const tokens = {
  palette,
  paletteDark,
  paletteHalloween,
  paletteHalloweenDark,
  typography,
  spacing,
  radius,
  shadows,
  motion,
  breakpoints,
  squircle,
  scrollbar,
  map,
} as const;

export type CanopTokens = typeof tokens;

export {
  palette,
  paletteDark,
  paletteHalloween,
  paletteHalloweenDark,
  typography,
  spacing,
  radius,
  shadows,
  motion,
  breakpoints,
  squircle,
  scrollbar,
  map,
};
export {
  shadowsLight,
  shadowsDark,
  dropShadowsLight,
  dropShadowsDark,
  type CanopShadowLevel,
} from "./shadows";
export { type CanopSquircleShape, type CanopSquircleTokens } from "./squircle";
export { type CanopScrollbarTokens } from "./scrollbar";
export { type CanopMotionDuration, type CanopMotionEasing } from "./motion";
export { type CanopBreakpoint } from "./breakpoints";
