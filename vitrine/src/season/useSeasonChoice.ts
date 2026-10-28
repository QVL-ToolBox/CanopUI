import { useCallback } from "react";
import { useCanopTheme } from "@canop/ui";
import { useVitrineSeason, type VitrineSeasonChoice } from "./VitrineSeasonContext";

export interface UseSeasonChoiceResult {
  choice: VitrineSeasonChoice;
  halloweenShown: boolean;
  choose: (choice: VitrineSeasonChoice) => void;
  flipShownSeason: () => void;
}

export function useSeasonChoice(): UseSeasonChoiceResult {
  const { season } = useCanopTheme();
  const { choice, setChoice } = useVitrineSeason();
  const halloweenShown = season === "halloween";
  const flipShownSeason = useCallback(
    () => setChoice(halloweenShown ? "off" : "halloween"),
    [halloweenShown, setChoice],
  );

  return { choice, halloweenShown, choose: setChoice, flipShownSeason };
}
