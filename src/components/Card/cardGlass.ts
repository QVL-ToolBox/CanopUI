import { tokens } from "../../tokens";

export interface CardGlass {
  background: string;
  backdropFilter: string;
  opaqueFallback: { background: string } | { backgroundColor: string };
}

const FROSTED_TINT = [
  "linear-gradient(150deg,",
  "color-mix(in srgb, var(--canop-palette-primary-light) 22%, transparent),",
  "color-mix(in srgb, var(--canop-palette-accent-light) 18%, transparent))",
].join(" ");

const FROSTED_VEIL = "color-mix(in srgb, var(--canop-palette-surface-base) 33%, transparent)";

const FROSTED_BLUR = "blur(0.35rem) saturate(1.3)";

export const frostedGlass: CardGlass = {
  background: `${FROSTED_TINT}, ${FROSTED_VEIL}`,
  backdropFilter: FROSTED_BLUR,
  opaqueFallback: { background: `${FROSTED_TINT}, var(--canop-palette-surface-base)` },
};

export const FROSTED_PADDING = { xs: tokens.spacing.md, md: tokens.spacing.xl } as const;
