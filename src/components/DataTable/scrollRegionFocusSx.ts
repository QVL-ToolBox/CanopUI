import type { CSSObject } from "@mui/material/styles";
import { keyboardFocus, withoutFocusRing } from "../../interaction";

const FOCUS_RING_WIDTH = "0.125rem";

const keyboardFocusRing: CSSObject = {
  outline: "none",
  [keyboardFocus()]: {
    outline: `${FOCUS_RING_WIDTH} solid var(--canop-palette-primary-main)`,
    outlineOffset: `-${FOCUS_RING_WIDTH}`,
  },
};

export function scrollRegionFocusSx(showsFocusRing: boolean): CSSObject {
  return showsFocusRing ? keyboardFocusRing : withoutFocusRing;
}
