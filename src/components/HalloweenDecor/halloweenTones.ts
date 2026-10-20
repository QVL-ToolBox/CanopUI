import type { CanopThemeMode } from "../../theme/createCanopTheme";

const toneNames = [
  "bat",
  "batEye",
  "ghost",
  "ghostEye",
  "ghostGlow",
  "ghostHalo",
  "fog",
  "firefly",
  "pumpkin",
  "pumpkinRib",
  "pumpkinStem",
  "pumpkinFace",
  "pumpkinGlow",
  "star",
  "hillFar",
  "hillNear",
  "tree",
  "stone",
  "engraving",
  "cat",
  "catEye",
  "web",
  "spider",
  "spiderEye",
  "witch",
  "witchGlow",
  "witchAccent",
  "sparkle",
  "cauldron",
  "brew",
  "steam",
  "leafAmber",
  "leafRust",
  "leafPlum",
] as const;

export type HalloweenToneName = (typeof toneNames)[number];

function customPropertyOf(name: HalloweenToneName): string {
  return `--canop-halloween-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
}

export function halloweenTone(name: HalloweenToneName): string {
  return `var(${customPropertyOf(name)})`;
}

function paletteVar(name: string): string {
  return `var(--canop-palette-${name})`;
}

function mix(first: string, share: number, second: string): string {
  return `color-mix(in srgb, ${first} ${share}%, ${second})`;
}

function blend(name: string, share: number, other: string): string {
  return mix(paletteVar(name), share, other);
}

function translucent(name: string, share: number): string {
  return blend(name, share, "transparent");
}

function overNight(name: string, share: number): string {
  return blend(name, share, paletteVar("background-default"));
}

const tonesByMode: Record<CanopThemeMode, Record<HalloweenToneName, string>> = {
  dark: {
    bat: translucent("secondary-dark", 80),
    batEye: paletteVar("accent-light"),
    ghost: paletteVar("text-primary"),
    ghostEye: paletteVar("background-default"),
    ghostGlow: translucent("secondary-light", 55),
    ghostHalo: translucent("accent-light", 45),
    fog: translucent("secondary-main", 22),
    firefly: paletteVar("accent-light"),
    pumpkin: paletteVar("primary-main"),
    pumpkinRib: paletteVar("primary-dark"),
    pumpkinStem: paletteVar("success-dark"),
    pumpkinFace: blend("text-primary", 65, paletteVar("primary-light")),
    pumpkinGlow: translucent("primary-main", 45),
    star: paletteVar("text-primary"),
    hillFar: overNight("secondary-dark", 20),
    hillNear: overNight("secondary-dark", 12),
    tree: overNight("secondary-dark", 24),
    stone: overNight("secondary-main", 26),
    engraving: translucent("secondary-light", 35),
    cat: paletteVar("background-default"),
    catEye: paletteVar("accent-light"),
    web: translucent("text-primary", 38),
    spider: overNight("secondary-main", 55),
    spiderEye: paletteVar("accent-light"),
    witch: paletteVar("background-default"),
    witchGlow: translucent("primary-main", 60),
    witchAccent: paletteVar("primary-main"),
    sparkle: paletteVar("accent-light"),
    cauldron: overNight("secondary-dark", 35),
    brew: paletteVar("accent-light"),
    steam: translucent("accent-light", 22),
    leafAmber: translucent("warning-main", 55),
    leafRust: translucent("primary-dark", 55),
    leafPlum: translucent("secondary-main", 55),
  },
  light: {
    bat: translucent("text-primary", 40),
    batEye: paletteVar("accent-main"),
    ghost: paletteVar("secondary-light"),
    ghostEye: paletteVar("text-primary"),
    ghostGlow: translucent("secondary-light", 40),
    ghostHalo: translucent("secondary-main", 45),
    fog: translucent("secondary-light", 20),
    firefly: paletteVar("accent-main"),
    pumpkin: paletteVar("primary-main"),
    pumpkinRib: paletteVar("primary-dark"),
    pumpkinStem: paletteVar("success-dark"),
    pumpkinFace: paletteVar("accent-light"),
    pumpkinGlow: translucent("accent-main", 40),
    star: translucent("secondary-main", 55),
    hillFar: overNight("secondary-light", 22),
    hillNear: overNight("secondary-light", 30),
    tree: overNight("secondary-dark", 22),
    stone: overNight("secondary-light", 40),
    engraving: translucent("text-secondary", 40),
    cat: paletteVar("text-primary"),
    catEye: paletteVar("accent-main"),
    web: translucent("text-secondary", 40),
    spider: paletteVar("text-primary"),
    spiderEye: paletteVar("accent-main"),
    witch: paletteVar("text-primary"),
    witchGlow: translucent("accent-main", 55),
    witchAccent: paletteVar("primary-main"),
    sparkle: paletteVar("accent-main"),
    cauldron: blend("text-primary", 80, paletteVar("secondary-dark")),
    brew: blend("success-main", 60, paletteVar("accent-light")),
    steam: translucent("secondary-light", 30),
    leafAmber: translucent("accent-main", 60),
    leafRust: translucent("primary-main", 55),
    leafPlum: translucent("secondary-main", 55),
  },
};

export function halloweenToneVariables(mode: CanopThemeMode): Record<string, string> {
  const tones = tonesByMode[mode];
  return Object.fromEntries(toneNames.map((name) => [customPropertyOf(name), tones[name]]));
}
