import type { ReactNode } from "react";
import { CanopThemeProvider } from "@canop/ui";
import { VitrineSeasonContext } from "./VitrineSeasonContext";
import { useVitrineSeasonState } from "./useVitrineSeasonState";

export function VitrineThemeRoot({ children }: { children: ReactNode }) {
  const { season, seasonalDecor, value } = useVitrineSeasonState();

  return (
    <VitrineSeasonContext.Provider value={value}>
      <CanopThemeProvider
        defaultMode="system"
        storageKey="canopui-vitrine-theme"
        season={season}
        seasonalDecor={seasonalDecor}
      >
        {children}
      </CanopThemeProvider>
    </VitrineSeasonContext.Provider>
  );
}
