import type { CanopThemeMode } from "../createCanopTheme";

export interface NeonGlowRecipe {
  intensity: number;
  core: number;
  aura: number;
  alpha: number;
  flicker: boolean;
}

export const NEON_FLICKER_KEYFRAMES = "canop-neon-flicker";

const NEON_GLOW_DEFAULT_RECIPE: NeonGlowRecipe = {
  intensity: 1,
  core: 0.375,
  aura: 1.5,
  alpha: 60,
  flicker: true,
};

export const NEON_GLOW_VAR = {
  intensity: "--canop-glow-intensity",
  core: "--canop-glow-core",
  aura: "--canop-glow-aura",
  alpha: "--canop-glow-alpha",
  flicker: "--canop-glow-flicker",
} as const satisfies Record<keyof NeonGlowRecipe, string>;

export type NeonGlowVariables = Record<(typeof NEON_GLOW_VAR)[keyof NeonGlowRecipe], string>;

function neonGlowRecipeVariables(recipe: NeonGlowRecipe): NeonGlowVariables {
  return {
    [NEON_GLOW_VAR.intensity]: String(recipe.intensity),
    [NEON_GLOW_VAR.core]: `${recipe.core}rem`,
    [NEON_GLOW_VAR.aura]: `${recipe.aura}rem`,
    [NEON_GLOW_VAR.alpha]: `${recipe.alpha}%`,
    [NEON_GLOW_VAR.flicker]: recipe.flicker ? NEON_FLICKER_KEYFRAMES : "none",
  };
}

const DEFAULT_VARIABLES = neonGlowRecipeVariables(NEON_GLOW_DEFAULT_RECIPE);

export function neonGlowSetting(key: keyof NeonGlowRecipe): string {
  const name = NEON_GLOW_VAR[key];
  return `var(${name}, ${DEFAULT_VARIABLES[name]})`;
}

export function neonGlowVariables(mode: CanopThemeMode): Partial<NeonGlowVariables> {
  return mode === "dark" ? DEFAULT_VARIABLES : {};
}
