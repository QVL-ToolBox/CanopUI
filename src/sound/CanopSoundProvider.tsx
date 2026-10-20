import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CanopSoundContext, type CanopSoundContextValue } from "./CanopSoundContext";
import { createSoundEngine, type CanopSoundEngineOptions } from "./soundEngine";
import type { CanopSoundName, CanopSoundRecipe } from "./soundRecipes";
import { attemptStorage } from "../storage/attemptStorage";

const DEFAULT_STORAGE_KEY = "canop-sound";

interface StoredSettings {
  muted: boolean;
  volume: number;
}

function readStored(storageKey: string | null): Partial<StoredSettings> {
  if (!storageKey || typeof window === "undefined") return {};
  try {
    const raw = window.localStorage?.getItem(storageKey);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const { muted, volume } = parsed as Partial<StoredSettings>;
    return {
      muted: typeof muted === "boolean" ? muted : undefined,
      volume: typeof volume === "number" && volume >= 0 && volume <= 1 ? volume : undefined,
    };
  } catch {
    return {};
  }
}

function writeStoredOrKeepForSession(storageKey: string | null, settings: StoredSettings): void {
  if (!storageKey || typeof window === "undefined") return;
  attemptStorage(() => window.localStorage?.setItem(storageKey, JSON.stringify(settings)));
}

export interface CanopSoundProviderProps {
  /** Silence au premier lancement, avant tout choix de l'utilisateur. */
  defaultMuted?: boolean;
  /** Volume général au premier lancement, de 0 à 1. */
  defaultVolume?: number;
  /** Clé de persistance du réglage, ou `null` pour ne rien retenir. */
  storageKey?: string | null;
  /** Fichiers audio par son, avec repli sur la synthèse en cas d'échec. */
  sources?: CanopSoundEngineOptions["sources"];
  /** Recettes synthétisées personnalisées, par son. */
  recipes?: Partial<Record<CanopSoundName, CanopSoundRecipe>>;
  children: ReactNode;
}

/**
 * Porte l'état sonore de l'application : la coupure, le volume, et le moteur.
 *
 * L'état est partagé, et c'est le point. Chaque écran qui gardait son propre
 * `useState(isMuted())` se désynchronisait du bouton de coupure dès qu'un
 * autre écran le touchait.
 *
 * Il n'existe aucune media query « moins de son » — `prefers-reduced-motion`
 * ne parle que d'animation. Le réglage est donc explicite et persisté, et rien
 * ne joue avant un geste de l'utilisateur.
 */
export function CanopSoundProvider({
  defaultMuted = false,
  defaultVolume = 1,
  storageKey = DEFAULT_STORAGE_KEY,
  sources,
  recipes,
  children,
}: CanopSoundProviderProps) {
  const stored = useRef<Partial<StoredSettings> | null>(null);
  stored.current ??= readStored(storageKey);

  const [muted, setMutedState] = useState(() => stored.current?.muted ?? defaultMuted);
  const [volume, setVolumeState] = useState(() => stored.current?.volume ?? defaultVolume);

  const contentSignatureNotIdentity = JSON.stringify({
    sources: sources ?? null,
    recipes: recipes ?? null,
  });

  const engine = useMemo(() => {
    const options = JSON.parse(contentSignatureNotIdentity) as {
      sources: CanopSoundEngineOptions["sources"] | null;
      recipes: CanopSoundProviderProps["recipes"] | null;
    };
    return createSoundEngine({
      sources: options.sources ?? undefined,
      recipes: options.recipes ?? undefined,
    });
  }, [contentSignatureNotIdentity]);

  useEffect(() => () => engine.dispose(), [engine]);

  const persist = useCallback(
    (next: StoredSettings) => writeStoredOrKeepForSession(storageKey, next),
    [storageKey],
  );

  const setMuted = useCallback(
    (next: boolean) => {
      setMutedState(next);
      persist({ muted: next, volume });
      const confirmUnmuteAndUnlockAudioInGesture = () =>
        engine.play("click", { muted: false, volume });
      if (!next) confirmUnmuteAndUnlockAudioInGesture();
    },
    [engine, persist, volume],
  );

  const setVolume = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), 1);
      setVolumeState(clamped);
      persist({ muted, volume: clamped });
    },
    [muted, persist],
  );

  const toggleMuted = useCallback(() => setMuted(!muted), [muted, setMuted]);

  const play = useCallback(
    (name: CanopSoundName) => engine.play(name, { muted, volume }),
    [engine, muted, volume],
  );

  const unlock = useCallback(() => engine.unlock(), [engine]);

  const value = useMemo<CanopSoundContextValue>(
    () => ({ play, muted, setMuted, toggleMuted, volume, setVolume, unlock }),
    [play, muted, setMuted, toggleMuted, volume, setVolume, unlock],
  );

  return <CanopSoundContext.Provider value={value}>{children}</CanopSoundContext.Provider>;
}
