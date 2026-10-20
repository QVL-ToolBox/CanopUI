import type { CanopPaletteColorName } from "../_shared/paletteColorVar";

export const AVATAR_TONES = [
  "primary",
  "info",
  "accent",
  "secondary",
  "success",
  "error",
] as const satisfies readonly CanopPaletteColorName[];

export type CanopAvatarTone = (typeof AVATAR_TONES)[number];

const HASH_MULTIPLIER = 31;

function stableHash(text: string): number {
  let hash = 0;
  for (const character of text) {
    hash = (hash * HASH_MULTIPLIER + (character.codePointAt(0) ?? 0)) >>> 0;
  }
  return hash;
}

function normalizedName(name: string): string {
  return name.normalize("NFC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function avatarTone(name: string): CanopAvatarTone {
  return AVATAR_TONES[stableHash(normalizedName(name)) % AVATAR_TONES.length];
}
