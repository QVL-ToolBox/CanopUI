import { useCallback, type KeyboardEvent } from "react";
import { useTranslation } from "../../i18n";
import { useCanopTheme, type CanopThemeMode } from "../../theme";
import type { CanopIconName } from "../Icon";
import { useReducedMotion } from "../../motion";

const THEME_MODES = ["light", "dark"] as const;

const OPTION_ICONS: Record<CanopThemeMode, CanopIconName> = {
  light: "sun",
  dark: "moon",
};

const OPTION_LABEL_KEYS: Record<CanopThemeMode, string> = {
  light: "canop.themeToggle.light",
  dark: "canop.themeToggle.dark",
};

export interface CanopThemeToggleOptionModel {
  mode: CanopThemeMode;
  icon: CanopIconName;
  label: string;
  isActive: boolean;
}

export interface UseThemeToggleResult {
  groupLabel: string;
  options: CanopThemeToggleOptionModel[];
  activeIndex: number;
  isDark: boolean;
  reducedMotion: boolean;
  toggle: () => void;
  handleKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

export function useThemeToggle(): UseThemeToggleResult {
  const { resolvedMode, setMode } = useCanopTheme();
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const activeIndex = THEME_MODES.indexOf(resolvedMode);
  const isDark = resolvedMode === "dark";

  const toggle = useCallback(() => setMode(isDark ? "light" : "dark"), [isDark, setMode]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      let nextMode: CanopThemeMode;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "End":
          nextMode = "dark";
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "Home":
          nextMode = "light";
          break;
        default:
          return;
      }
      event.preventDefault();
      setMode(nextMode);
    },
    [setMode],
  );

  const options = THEME_MODES.map<CanopThemeToggleOptionModel>((mode) => ({
    mode,
    icon: OPTION_ICONS[mode],
    label: t(OPTION_LABEL_KEYS[mode]),
    isActive: mode === resolvedMode,
  }));

  return {
    groupLabel: t("canop.themeToggle.group"),
    options,
    activeIndex,
    isDark,
    reducedMotion,
    toggle,
    handleKeyDown,
  };
}
