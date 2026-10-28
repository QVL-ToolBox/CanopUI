import { useMemo, useState } from "react";
import type { CanopSeason } from "@canop/ui";
import type { VitrineSeasonChoice, VitrineSeasonValue } from "./VitrineSeasonContext";

export interface VitrineSeasonState {
  season: CanopSeason | null | undefined;
  seasonalDecor: boolean;
  value: VitrineSeasonValue;
}

const seasonOfChoice: Record<VitrineSeasonChoice, CanopSeason | null | undefined> = {
  auto: undefined,
  halloween: "halloween",
  off: null,
};

export function useVitrineSeasonState(): VitrineSeasonState {
  const [choice, setChoice] = useState<VitrineSeasonChoice>("auto");
  const [seasonalDecorHidden, setSeasonalDecorHidden] = useState(false);
  const value = useMemo(() => ({ choice, setChoice, setSeasonalDecorHidden }), [choice]);
  return {
    season: seasonOfChoice[choice],
    seasonalDecor: !seasonalDecorHidden,
    value,
  };
}
