import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { HalloweenSeasonBackdrop } from "../components/HalloweenDecor/HalloweenSeasonBackdrop";
import { HalloweenSeasonOverlay } from "../components/HalloweenDecor/HalloweenSeasonOverlay";
import { SeasonalDecorContext } from "../components/HalloweenDecor/SeasonalDecorContext";
import {
  canopTheme,
  createCanopTheme,
  type CanopSeason,
  type CanopThemeMode,
} from "./createCanopTheme";
import { CanopThemeContext, type CanopThemePreference } from "./CanopThemeContext";
import { useResolvedSeason } from "./useResolvedSeason";
import { useSeasonalDecor } from "./useSeasonalDecor";

const DEFAULT_STORAGE_KEY = "canop-theme-mode";

function prefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function toPreference(value: string | null | undefined): CanopThemePreference | null {
  return value === "light" || value === "dark" || value === "system" ? value : null;
}

function readStored(storageKey: string | null): CanopThemePreference | null {
  if (!storageKey || typeof window === "undefined") return null;
  try {
    return toPreference(window.localStorage?.getItem(storageKey));
  } catch {
    return null;
  }
}

export interface CanopThemeProviderProps {
  mode?: CanopThemeMode;
  defaultMode?: CanopThemePreference;
  storageKey?: string | null;
  season?: CanopSeason | null;
  seasonalDecor?: boolean;
  children: ReactNode;
}

export function CanopThemeProvider({
  mode: controlledMode,
  defaultMode = "system",
  storageKey = DEFAULT_STORAGE_KEY,
  season: requestedSeason,
  seasonalDecor = true,
  children,
}: CanopThemeProviderProps) {
  const season = useResolvedSeason(requestedSeason);
  const seasonalDecorState = useSeasonalDecor(season, seasonalDecor);
  const isControlled = controlledMode !== undefined;

  const [preference, setPreference] = useState<CanopThemePreference>(() =>
    isControlled ? controlledMode : (readStored(storageKey) ?? defaultMode),
  );
  const [systemDark, setSystemDark] = useState(prefersDark);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const mode: CanopThemePreference = isControlled ? controlledMode : preference;
  const resolvedMode: CanopThemeMode = mode === "system" ? (systemDark ? "dark" : "light") : mode;

  const setMode = useCallback(
    (next: CanopThemePreference) => {
      if (isControlled) return;
      setPreference(next);
      if (storageKey && typeof window !== "undefined") {
        window.localStorage?.setItem(storageKey, next);
      }
    },
    [isControlled, storageKey],
  );

  const toggleMode = useCallback(() => {
    setMode(resolvedMode === "dark" ? "light" : "dark");
  }, [resolvedMode, setMode]);

  const theme = useMemo(
    () =>
      resolvedMode === "light" && season === null
        ? canopTheme
        : createCanopTheme(resolvedMode, season),
    [resolvedMode, season],
  );

  const ctx = useMemo(
    () => ({ mode, resolvedMode, season, setMode, toggleMode }),
    [mode, resolvedMode, season, setMode, toggleMode],
  );

  return (
    <CanopThemeContext.Provider value={ctx}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {seasonalDecorState.rendersFallbackBackdrop ? (
          <HalloweenSeasonBackdrop behindPageContent />
        ) : null}
        <SeasonalDecorContext.Provider value={seasonalDecorState.contextValue}>
          {children}
        </SeasonalDecorContext.Provider>
        {seasonalDecorState.rendersOverlay ? <HalloweenSeasonOverlay /> : null}
      </ThemeProvider>
    </CanopThemeContext.Provider>
  );
}
