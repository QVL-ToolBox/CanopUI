import type { CSSObject } from "@mui/material/styles";
import { hoverOrKeyboardFocus } from "../../interaction";
import { CARD_TRANSFORM_TRANSITION } from "./cardTransitions";

export const CARD_ARROW_CLASS = "CanopCard-arrow";

const ARROW = `.${CARD_ARROW_CLASS}`;

const ARROW_NUDGE = "translateX(0.25rem)";

export function cardArrowSx(animated: boolean): CSSObject {
  return {
    "& .MuiCardHeader-action": { margin: 0, alignSelf: "center" },
    ...(animated
      ? {
          [`& ${ARROW}`]: { transition: CARD_TRANSFORM_TRANSITION },
          [hoverOrKeyboardFocus(` ${ARROW}`)]: { transform: ARROW_NUDGE },
        }
      : {}),
  };
}
