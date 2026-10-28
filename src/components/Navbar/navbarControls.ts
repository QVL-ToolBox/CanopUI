import type { CSSObject } from "@mui/material/styles";
import { fieldHoverOrSelectKeyboardFocus } from "../../interaction/interactionStates";
import {
  NAVBAR_ACTIVE_FILL,
  NAVBAR_FIELD_FILL,
  NAVBAR_FIELD_OUTLINE,
  NAVBAR_FIELD_OUTLINE_ENGAGED,
  NAVBAR_TEXT,
  NAVBAR_TEXT_STRONG,
} from "./navbarTone";

const INPUT_OUTLINE_VAR = "--canop-input-outline";
const INPUT_FILL_VAR = "--canop-input-fill";
const FIELD = ".MuiOutlinedInput-root.MuiInputBase-root";
const FIELD_ENGAGED = fieldHoverOrSelectKeyboardFocus(`& ${FIELD}`);
const THEME_TOGGLE_TRACK = 'button[role="switch"]';
const THEME_TOGGLE_THUMB = `${THEME_TOGGLE_TRACK} > :first-of-type`;

export function navbarControlsSx(controlBackground: string): CSSObject {
  return {
    [`& ${THEME_TOGGLE_TRACK}::before`]: { backgroundColor: controlBackground },
    [`& ${THEME_TOGGLE_THUMB}::before`]: { backgroundColor: NAVBAR_ACTIVE_FILL },
    [`& ${FIELD}`]: {
      [INPUT_OUTLINE_VAR]: NAVBAR_FIELD_OUTLINE,
      [INPUT_FILL_VAR]: NAVBAR_FIELD_FILL,
      color: NAVBAR_TEXT_STRONG,
    },
    [FIELD_ENGAGED]: { [INPUT_OUTLINE_VAR]: NAVBAR_FIELD_OUTLINE_ENGAGED },
    "& .MuiSelect-icon": { color: NAVBAR_TEXT },
  };
}
