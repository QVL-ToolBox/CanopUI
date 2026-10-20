import { createContext, useContext } from "react";

export interface SeasonalDecorValue {
  managedByTheme: boolean;
  backdropHost: string | null;
  registerBackdropHost: (hostId: string) => () => void;
}

const unregisterNothing = (): void => undefined;

export const UNMANAGED_SEASONAL_DECOR: SeasonalDecorValue = {
  managedByTheme: false,
  backdropHost: null,
  registerBackdropHost: () => unregisterNothing,
};

export const SeasonalDecorContext = createContext<SeasonalDecorValue>(UNMANAGED_SEASONAL_DECOR);

export function useSeasonalDecorContext(): SeasonalDecorValue {
  return useContext(SeasonalDecorContext);
}
