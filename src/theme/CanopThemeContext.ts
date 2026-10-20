import { createContext, useContext } from "react";
import type { CanopSeason, CanopThemeMode } from "./createCanopTheme";

export type CanopThemePreference = CanopThemeMode | "system";

export interface CanopThemeContextValue {
  mode: CanopThemePreference;
  resolvedMode: CanopThemeMode;
  readonly season: CanopSeason | null;
  setMode: (mode: CanopThemePreference) => void;
  toggleMode: () => void;
}

export const CanopThemeContext = createContext<CanopThemeContextValue | null>(null);

export function useCanopTheme(): CanopThemeContextValue {
  const ctx = useContext(CanopThemeContext);
  if (!ctx) {
    throw new Error("useCanopTheme doit être utilisé à l'intérieur d'un <CanopThemeProvider>.");
  }
  return ctx;
}
