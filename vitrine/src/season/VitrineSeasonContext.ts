import { createContext, useContext } from "react";

export interface VitrineSeasonValue {
  forcedHalloween: boolean;
  setForcedHalloween: (forced: boolean) => void;
  setSeasonalDecorHidden: (hidden: boolean) => void;
}

export const VitrineSeasonContext = createContext<VitrineSeasonValue | null>(null);

export function useVitrineSeason(): VitrineSeasonValue {
  const value = useContext(VitrineSeasonContext);
  if (!value) {
    throw new Error("useVitrineSeason doit être utilisé à l'intérieur de <VitrineThemeRoot>.");
  }
  return value;
}
