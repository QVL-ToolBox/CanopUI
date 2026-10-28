import {
  paletteColorVar,
  type CanopPaletteColorName,
} from "../../components/_shared/paletteColorVar";
import { neonGlowSetting } from "./neonGlowRecipe";

export type NeonGlowColor = CanopPaletteColorName;

export type NeonGlowLevel = "faint" | "rest" | "peak";

interface GlowStep {
  strength: number;
  reach: number;
}

interface GlowLayer {
  blur: string;
  color: string;
}

interface TextGlowLayer {
  source: "hotCore" | "palette";
  radius: "core" | "aura";
  reach: number;
  strength: number;
}

const GLOW_STEPS: Record<NeonGlowLevel, GlowStep> = {
  faint: { strength: 0.4, reach: 0.8 },
  rest: { strength: 0.65, reach: 0.9 },
  peak: { strength: 1, reach: 1 },
};

const NEON_TEXT_LAYERS: readonly TextGlowLayer[] = [
  { source: "hotCore", radius: "core", reach: 0.2, strength: 0.9 },
  { source: "hotCore", radius: "core", reach: 0.7, strength: 0.75 },
  { source: "palette", radius: "aura", reach: 0.45, strength: 0.6 },
  { source: "palette", radius: "aura", reach: 1, strength: 0.35 },
];

const AURA_STRENGTH_SHARE = 0.5;
const HOT_CORE_PALETTE_SHARE = "70%";
const WHITE = "var(--canop-palette-common-white)";

export const NEON_GLOW_LIT_VAR = "--canop-glow-lit";

const INTENSITY = neonGlowSetting("intensity");
const CORE = neonGlowSetting("core");
const AURA = neonGlowSetting("aura");
const ALPHA = neonGlowSetting("alpha");
const LIT = `var(${NEON_GLOW_LIT_VAR}, 1)`;

function hotCore(color: NeonGlowColor): string {
  return `color-mix(in srgb, ${paletteColorVar[color]} ${HOT_CORE_PALETTE_SHARE}, ${WHITE})`;
}

function veiled(source: string, strength: number): string {
  return `color-mix(in srgb, ${source} calc(${ALPHA} * ${INTENSITY} * ${LIT} * ${strength}), transparent)`;
}

function spread(radius: string, reach: number): string {
  return `calc(${radius} * ${reach})`;
}

function glowLayers(color: NeonGlowColor, level: NeonGlowLevel): [GlowLayer, GlowLayer] {
  const { strength, reach } = GLOW_STEPS[level];
  return [
    { blur: spread(CORE, reach), color: veiled(hotCore(color), strength) },
    {
      blur: spread(AURA, reach),
      color: veiled(paletteColorVar[color], strength * AURA_STRENGTH_SHARE),
    },
  ];
}

function textGlowLayer(color: NeonGlowColor, layer: TextGlowLayer): GlowLayer {
  const source = layer.source === "hotCore" ? hotCore(color) : paletteColorVar[color];
  const radius = layer.radius === "core" ? CORE : AURA;
  return { blur: spread(radius, layer.reach), color: veiled(source, layer.strength) };
}

function shadowLayer({ blur, color }: GlowLayer): string {
  return `0 0 ${blur} ${color}`;
}

function dropShadowLayer(layer: GlowLayer): string {
  return `drop-shadow(${shadowLayer(layer)})`;
}

export function glow(color: NeonGlowColor, level: NeonGlowLevel): string {
  return glowLayers(color, level).map(shadowLayer).join(", ");
}

export function glowFilter(color: NeonGlowColor, level: NeonGlowLevel): string {
  return glowLayers(color, level).map(dropShadowLayer).join(" ");
}

export function innerGlow(color: NeonGlowColor, level: NeonGlowLevel): string {
  const [core] = glowLayers(color, level);
  return `inset ${shadowLayer(core)}`;
}

export function neonTextGlow(color: NeonGlowColor): string {
  return NEON_TEXT_LAYERS.map((layer) => shadowLayer(textGlowLayer(color, layer))).join(", ");
}
