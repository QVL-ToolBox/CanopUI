import { map } from "../../tokens/map";
import { palette, paletteDark } from "../../tokens/palette";
import type { CanopThemeMode } from "../../theme";

function channels(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
}

function toHex(value: number): string {
  return Math.round(Math.min(255, Math.max(0, value)))
    .toString(16)
    .padStart(2, "0");
}

export function mix(color: string, into: string, ratio: number): string {
  const source = channels(color);
  const target = channels(into);
  return `#${source.map((channel, index) => toHex(channel * ratio + target[index] * (1 - ratio))).join("")}`;
}

export interface CanopMapPalette {
  land: string;
  water: string;
  waterEdge: string;
  green: string;
  greenStrong: string;
  building: string;
  buildingShade: string;
  roadShade: string;
  roadCasing: string;
  roadMinor: string;
  roadMajor: string;
  roadMotorway: string;
  boundary: string;
  poiGlyph: string;
  poiBadge: string;
  poiBadgeEdge: string;
  label: string;
  labelMuted: string;
  labelWater: string;
  labelHalo: string;
}

function lightPalette(): CanopMapPalette {
  const land = mix(palette.secondary.light, palette.surface.raised, 0.5);
  return {
    land,
    water: map.water.light,
    waterEdge: map.waterEdge.light,
    green: mix(palette.secondary.main, land, 0.45),
    greenStrong: mix(palette.secondary.dark, land, 0.4),
    building: mix(palette.primary.light, land, 0.22),
    buildingShade: map.shade.light,
    roadShade: map.shade.light,
    roadCasing: mix(palette.divider, land, 0.95),
    roadMinor: palette.surface.raised,
    roadMajor: palette.surface.raised,
    roadMotorway: mix(palette.accent.main, palette.surface.raised, 0.12),
    boundary: mix(palette.text.secondary, land, 0.35),
    poiGlyph: palette.primary.main,
    poiBadge: palette.surface.raised,
    poiBadgeEdge: mix(palette.primary.main, palette.surface.raised, 0.22),
    label: palette.text.primary,
    labelMuted: palette.text.secondary,
    labelWater: mix(palette.info.dark, map.water.light, 0.7),
    labelHalo: land,
  };
}

function darkPalette(): CanopMapPalette {
  const ground = mix(paletteDark.background.default, paletteDark.surface.sunken, 0.5);
  const land = mix(paletteDark.secondary.dark, ground, 0.22);
  return {
    land,
    water: map.water.dark,
    waterEdge: map.waterEdge.dark,
    green: mix(paletteDark.secondary.main, land, 0.2),
    greenStrong: mix(paletteDark.secondary.light, land, 0.24),
    building: mix(paletteDark.primary.main, land, 0.16),
    buildingShade: map.shade.dark,
    roadShade: map.shade.dark,
    roadCasing: mix(paletteDark.background.default, land, 0.8),
    roadMinor: mix(paletteDark.text.primary, land, 0.16),
    roadMajor: mix(paletteDark.text.primary, land, 0.26),
    roadMotorway: mix(paletteDark.accent.main, land, 0.3),
    boundary: mix(paletteDark.text.secondary, land, 0.35),
    poiGlyph: paletteDark.primary.main,
    poiBadge: paletteDark.surface.raised,
    poiBadgeEdge: mix(paletteDark.primary.main, paletteDark.surface.raised, 0.3),
    label: paletteDark.text.primary,
    labelMuted: paletteDark.text.secondary,
    labelWater: mix(paletteDark.info.main, map.water.dark, 0.75),
    labelHalo: land,
  };
}

export function canopMapPalette(mode: CanopThemeMode): CanopMapPalette {
  return mode === "dark" ? darkPalette() : lightPalette();
}
