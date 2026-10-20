import type { CanopThemeMode } from "../../theme";

export type CanopCanopySceneMode = "auto" | CanopThemeMode;

export interface CanopCanopyScene {
  webm: string;
  mp4: string;
  poster: string;
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
  });
  return { light: scene("light"), dark: scene("dark") };
}

export const CANOP_CANOPY_SCENES = canopyScenesFrom(CANOPY_ASSET_BASE);

export function resolveCanopyScene(
  mode: CanopThemeMode,
  scenes?: CanopCanopySceneOverride,
): CanopCanopyScene {
  const override = scenes?.[mode];
  return override ? { ...CANOP_CANOPY_SCENES[mode], ...override } : CANOP_CANOPY_SCENES[mode];
}
