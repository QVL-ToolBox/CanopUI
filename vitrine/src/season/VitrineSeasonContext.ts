import { createContext, useContext } from "react";

export type VitrineSeasonChoice = "auto" | "halloween" | "off";

export interface VitrineSeasonValue {
  choice: VitrineSeasonChoice;
  setChoice: (choice: VitrineSeasonChoice) => void;
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
