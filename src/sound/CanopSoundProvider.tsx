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
  defaultMuted?: boolean;
  defaultVolume?: number;
  storageKey?: string | null;
  sources?: CanopSoundEngineOptions["sources"];
  recipes?: Partial<Record<CanopSoundName, CanopSoundRecipe>>;
  children: ReactNode;
}

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
