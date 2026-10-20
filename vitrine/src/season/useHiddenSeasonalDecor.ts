import { useEffect } from "react";
import { useVitrineSeason } from "./VitrineSeasonContext";

export function useHiddenSeasonalDecor(): void {
  const { setSeasonalDecorHidden } = useVitrineSeason();
  useEffect(() => {
    setSeasonalDecorHidden(true);
    return () => setSeasonalDecorHidden(false);
  }, [setSeasonalDecorHidden]);
}
