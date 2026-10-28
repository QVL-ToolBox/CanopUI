import type { Theme } from "@mui/material/styles";
import { useMemo } from "react";
import { createCanopTheme, useCanopTheme, type CanopThemeMode } from "@canop/ui";
import { scopedThemeVariables, type CssVariables } from "./scopedThemeVariables";

export interface ThemeScopeState {
  theme: Theme;
  scopeSx: CssVariables;
}

export function useThemeScope(mode: CanopThemeMode): ThemeScopeState {
  const { season } = useCanopTheme();

  return useMemo(() => {
    const theme = createCanopTheme(mode, season);
    return {
      theme,
      scopeSx: {
        ...scopedThemeVariables(theme),
        colorScheme: mode,
        color: "var(--canop-palette-text-primary)",
      },
    };
  }, [mode, season]);
}
