import type { Theme } from "@mui/material/styles";
import { tokens } from "@canop/ui";

export type CssVariables = Record<string, string>;

const ELEVATION_LEVELS = ["e1", "e2", "e3", "e4", "e5"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function styleSheetsOf(theme: Theme): unknown {
  const generate: unknown = Reflect.get(theme, "generateStyleSheets");
  return typeof generate === "function" ? generate.call(theme) : [];
}

function customProperties(block: unknown): CssVariables {
  if (!isRecord(block)) return {};
  const entries = Object.entries(block).flatMap(([name, value]): [string, string][] =>
    name.startsWith("--") && (typeof value === "string" || typeof value === "number")
      ? [[name, String(value)]]
      : [],
  );
  return Object.fromEntries(entries);
}

function generatedThemeVariables(theme: Theme): CssVariables {
  const sheets = styleSheetsOf(theme);
  if (!Array.isArray(sheets)) return {};
  return sheets
    .filter(isRecord)
    .flatMap((sheet) => Object.values(sheet))
    .reduce<CssVariables>((all, block) => ({ ...all, ...customProperties(block) }), {});
}

function elevationVariables(theme: Theme): CssVariables {
  const dark = theme.palette.mode === "dark";
  const elevation = dark ? tokens.shadows.dark : tokens.shadows.light;
  const dropElevation = dark ? tokens.shadows.dropDark : tokens.shadows.dropLight;
  return Object.fromEntries(
    ELEVATION_LEVELS.flatMap((level): [string, string][] => [
      [`--canop-shadow-${level}`, elevation[level]],
      [`--canop-drop-shadow-${level}`, dropElevation[level]],
    ]),
  );
}

export function scopedThemeVariables(theme: Theme): CssVariables {
  return { ...generatedThemeVariables(theme), ...elevationVariables(theme) };
}
