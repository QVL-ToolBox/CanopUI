import { createContext, useContext } from "react";
import type { CanopSoundOutcome } from "./soundEngine";
import type { CanopSoundName } from "./soundRecipes";

export interface CanopSoundContextValue {
  play: (name: CanopSoundName) => CanopSoundOutcome;
  muted: boolean;
  setMuted: (next: boolean) => void;
  toggleMuted: () => void;
  volume: number;
  setVolume: (next: number) => void;
  unlock: () => void;
}

export const CanopSoundContext = createContext<CanopSoundContextValue | null>(null);

export function useCanopSound(): CanopSoundContextValue {
  const ctx = useContext(CanopSoundContext);
  if (!ctx) {
    throw new Error("useCanopSound doit être utilisé à l'intérieur d'un <CanopSoundProvider>.");
  }
  return ctx;
}
