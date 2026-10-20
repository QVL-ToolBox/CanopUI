import { useCallback, useMemo, useState } from "react";
import {
  UNMANAGED_SEASONAL_DECOR,
  useSeasonalDecorContext,
  type SeasonalDecorValue,
} from "../components/HalloweenDecor/SeasonalDecorContext";
import type { CanopSeason } from "./createCanopTheme";

interface SeasonalDecorState {
  contextValue: SeasonalDecorValue;
  rendersOverlay: boolean;
  rendersFallbackBackdrop: boolean;
}

export function useSeasonalDecor(season: CanopSeason | null, enabled: boolean): SeasonalDecorState {
  const outer = useSeasonalDecorContext();
  const [backdropHosts, setBackdropHosts] = useState<readonly string[]>([]);
  const managesDecor = enabled && season === "halloween" && !outer.managedByTheme;

  const registerBackdropHost = useCallback((hostId: string) => {
    setBackdropHosts((hosts) => [...hosts, hostId]);
    return () => setBackdropHosts((hosts) => hosts.filter((host) => host !== hostId));
  }, []);

  const backdropHost = backdropHosts[0] ?? null;

  const ownValue = useMemo<SeasonalDecorValue>(
    () =>
      managesDecor
        ? { managedByTheme: true, backdropHost, registerBackdropHost }
        : UNMANAGED_SEASONAL_DECOR,
    [managesDecor, backdropHost, registerBackdropHost],
  );

  return {
    contextValue: outer.managedByTheme ? outer : ownValue,
    rendersOverlay: managesDecor,
    rendersFallbackBackdrop: managesDecor && backdropHost === null,
  };
}
