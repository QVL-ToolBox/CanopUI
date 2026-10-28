import type { CSSObject } from "@mui/material/styles";
import { touchRippleClasses } from "@mui/material/ButtonBase";
import { SQUIRCLE_CLIP_VAR } from "../squircle/squircleSx";

const SHAPE_NOT_INHERITED_FROM_ANCESTOR = "initial";
const CENTERED_RIPPLE_TO_SQUARE_DIAGONAL = String(Math.SQRT2);

export const rippleClippedToOwnSquircle: CSSObject = {
  [SQUIRCLE_CLIP_VAR]: SHAPE_NOT_INHERITED_FROM_ANCESTOR,
  [`& > .${touchRippleClasses.root}`]: { clipPath: `var(${SQUIRCLE_CLIP_VAR}, none)` },
};

export const centeredRippleFillingSquircle: CSSObject = {
  [`& > .${touchRippleClasses.root} > .${touchRippleClasses.ripple}`]: {
    scale: CENTERED_RIPPLE_TO_SQUARE_DIAGONAL,
  },
};
