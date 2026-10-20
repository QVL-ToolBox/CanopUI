import { useState } from "react";
import { canopSeasonAt } from "./canopSeasonAt";
import type { CanopSeason } from "./createCanopTheme";

export function useResolvedSeason(requested: CanopSeason | null | undefined): CanopSeason | null {
  const [seasonAtMount] = useState(() => canopSeasonAt(new Date()));
  return requested === undefined ? seasonAtMount : requested;
}
