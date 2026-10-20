import { createContext, useContext } from "react";
import type { CanopSoundOutcome } from "./soundEngine";
import type { CanopSoundName } from "./soundRecipes";

export interface CanopSoundContextValue {
  /** Joue un son du catalogue et dit ce qui en est réellement sorti. */
  play: (name: CanopSoundName) => CanopSoundOutcome;
  muted: boolean;
  setMuted: (next: boolean) => void;
  toggleMuted: () => void;
  /** Volume général, de 0 à 1. */
  volume: number;
  setVolume: (next: number) => void;
  /** Réveille le contexte audio depuis un geste de l'utilisateur. */
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
