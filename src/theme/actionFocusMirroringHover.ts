import { createTheme } from "@mui/material/styles";
import type { CanopThemeMode } from "./createCanopTheme";

interface ActionFocus {
  focus: string;
  focusOpacity: number;
}

function hoverAsFocus(mode: CanopThemeMode): ActionFocus {
  const { hover, hoverOpacity } = createTheme({ palette: { mode } }).palette.action;
  return { focus: hover, focusOpacity: hoverOpacity };
}

const ACTION_FOCUS_BY_MODE: Record<CanopThemeMode, ActionFocus> = {
  light: hoverAsFocus("light"),
  dark: hoverAsFocus("dark"),
};

export function actionFocusMirroringHover(mode: CanopThemeMode): ActionFocus {
  return { ...ACTION_FOCUS_BY_MODE[mode] };
}
