import type { CanopThemeMode } from "../../theme";

export type CanopCanopySceneMode = "auto" | CanopThemeMode;

export interface CanopCanopyLiteScene {
  webm: string;
  mp4: string;
}

export interface CanopCanopyScene {
  webm: string;
  mp4: string;
  poster: string;
  lite?: CanopCanopyLiteScene;
}

export type CanopCanopySceneOverride = Partial<Record<CanopThemeMode, Partial<CanopCanopyScene>>>;

export const CANOPY_ASSET_BASE = "/canopui/video";

export const CANOPY_LOOP_SECONDS = 10;

export function canopyScenesFrom(base: string): Record<CanopThemeMode, CanopCanopyScene> {
  const root = base.endsWith("/") ? base.slice(0, -1) : base;
  const scene = (mode: CanopThemeMode): CanopCanopyScene => ({
    webm: `${root}/canopy-${mode}.webm`,
    mp4: `${root}/canopy-${mode}.mp4`,
    poster: `${root}/canopy-${mode}-poster.jpg`,
    lite: { webm: `${root}/canopy-${mode}-720.webm`, mp4: `${root}/canopy-${mode}-720.mp4` },
  });
  return { light: scene("light"), dark: scene("dark") };
}

export const CANOP_CANOPY_SCENES = canopyScenesFrom(CANOPY_ASSET_BASE);

export function resolveCanopyScene(
  mode: CanopThemeMode,
  scenes?: CanopCanopySceneOverride,
): CanopCanopyScene {
  const base = CANOP_CANOPY_SCENES[mode];
  const override = scenes?.[mode];
  if (!override) return base;
  const replacesVideo = override.webm !== undefined || override.mp4 !== undefined;
  return { ...base, ...override, lite: override.lite ?? (replacesVideo ? undefined : base.lite) };
}
