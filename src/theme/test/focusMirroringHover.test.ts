import { describe, expect, it } from "vitest";
import type { Theme } from "@mui/material/styles";
import { createCanopTheme } from "../createCanopTheme";

const THEMES: [string, Theme][] = [
  ["clair", createCanopTheme("light")],
  ["sombre", createCanopTheme("dark")],
  ["halloween clair", createCanopTheme("light", "halloween")],
  ["halloween sombre", createCanopTheme("dark", "halloween")],
];

const COMPOSANTS_SANS_RIPPLE_DE_FOCUS = [
  "MuiButton",
  "MuiIconButton",
  "MuiCheckbox",
  "MuiRadio",
  "MuiSwitch",
  "MuiFab",
  "MuiToggleButton",
  "MuiTab",
] as const;

function propsParDefaut(theme: Theme, composant: string): Record<string, unknown> {
  const composants = theme.components as Record<string, { defaultProps?: Record<string, unknown> }>;
  return composants[composant]?.defaultProps ?? {};
}

describe("AC3 - palette d'action : le focus vaut le survol", () => {
  it.each(THEMES)("aligne action.focus sur action.hover en theme %s", (_nom, theme) => {
    expect(theme.palette.action.focus).toBe(theme.palette.action.hover);
  });

  it.each(THEMES)("aligne focusOpacity sur hoverOpacity en theme %s", (_nom, theme) => {
    expect(theme.palette.action.focusOpacity).toBe(theme.palette.action.hoverOpacity);
  });

  it.each(THEMES)("garde un survol visible en theme %s", (_nom, theme) => {
    expect(theme.palette.action.hoverOpacity).toBeGreaterThan(0);
  });
});

describe("AC3 - aucun ripple de focus par defaut", () => {
  it.each(
    THEMES.flatMap(([nom, theme]) =>
      COMPOSANTS_SANS_RIPPLE_DE_FOCUS.map((composant) => [composant, nom, theme] as const),
    ),
  )("desactive le ripple de focus de %s en theme %s", (composant, _nom, theme) => {
    expect(propsParDefaut(theme, composant).disableFocusRipple).toBe(true);
  });
});
