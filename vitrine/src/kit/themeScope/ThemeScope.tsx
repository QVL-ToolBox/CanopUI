import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";
import type { CanopThemeMode } from "@canop/ui";
import { useThemeScope } from "./useThemeScope";

export interface ThemeScopeProps {
  mode: CanopThemeMode;
  children: ReactNode;
}

export function ThemeScope({ mode, children }: ThemeScopeProps) {
  const { theme, scopeSx } = useThemeScope(mode);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={[scopeSx, { height: "100%", width: "100%" }]}>{children}</Box>
    </ThemeProvider>
  );
}
