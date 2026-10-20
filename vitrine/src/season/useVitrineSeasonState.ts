import { useMemo, useState } from "react";
import type { CanopSeason } from "@canop/ui";
import type { VitrineSeasonValue } from "./VitrineSeasonContext";

export interface VitrineSeasonState {
  season: CanopSeason | undefined;
  seasonalDecor: boolean;
  value: VitrineSeasonValue;
}

export function useVitrineSeasonState(): VitrineSeasonState {
  const [forcedHalloween, setForcedHalloween] = useState(false);
  const [seasonalDecorHidden, setSeasonalDecorHidden] = useState(false);
  const value = useMemo(
    () => ({ forcedHalloween, setForcedHalloween, setSeasonalDecorHidden }),
    [forcedHalloween],
  );
  return {
    season: forcedHalloween ? "halloween" : undefined,
    seasonalDecor: !seasonalDecorHidden,
    value,
  };
}
