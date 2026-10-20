import { useId, useLayoutEffect } from "react";
import { useSeasonalDecorContext } from "./SeasonalDecorContext";

export function useSeasonalBackdropHost(): boolean {
  const hostId = useId();
  const { managedByTheme, backdropHost, registerBackdropHost } = useSeasonalDecorContext();

  useLayoutEffect(() => {
    if (!managedByTheme) return undefined;
    return registerBackdropHost(hostId);
  }, [managedByTheme, registerBackdropHost, hostId]);

  return managedByTheme && backdropHost === hostId;
}
