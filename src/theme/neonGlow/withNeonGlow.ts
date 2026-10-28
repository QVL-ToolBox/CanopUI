import type { CanopThemeMode } from "../createCanopTheme";
import { NEON_GLOW_VARIANTS as GLOW, type CanopComponents } from "./neonGlowVariants";

interface WithVariants<Variant> {
  variants?: Variant[] | undefined;
}

function glowing<Variant>(
  entry: WithVariants<Variant> | undefined,
  glowVariants: Variant[],
): { variants: Variant[] } {
  return { variants: [...(entry?.variants ?? []), ...glowVariants] };
}

export function withNeonGlow(mode: CanopThemeMode, components: CanopComponents): CanopComponents {
  if (mode !== "dark") return components;
  const {
    MuiButton,
    MuiOutlinedInput,
    MuiSwitch,
    MuiCheckbox,
    MuiRadio,
    MuiSlider,
    MuiChip,
    MuiBadge,
    MuiLinearProgress,
    MuiCircularProgress,
    MuiTabs,
    MuiTypography,
  } = components;
  return {
    ...components,
    MuiButton: { ...MuiButton, ...glowing(MuiButton, GLOW.MuiButton) },
    MuiOutlinedInput: { ...MuiOutlinedInput, ...glowing(MuiOutlinedInput, GLOW.MuiOutlinedInput) },
    MuiSwitch: { ...MuiSwitch, ...glowing(MuiSwitch, GLOW.MuiSwitch) },
    MuiCheckbox: { ...MuiCheckbox, ...glowing(MuiCheckbox, GLOW.MuiCheckbox) },
    MuiRadio: { ...MuiRadio, ...glowing(MuiRadio, GLOW.MuiRadio) },
    MuiSlider: { ...MuiSlider, ...glowing(MuiSlider, GLOW.MuiSlider) },
    MuiChip: { ...MuiChip, ...glowing(MuiChip, GLOW.MuiChip) },
    MuiBadge: { ...MuiBadge, ...glowing(MuiBadge, GLOW.MuiBadge) },
    MuiLinearProgress: {
      ...MuiLinearProgress,
      ...glowing(MuiLinearProgress, GLOW.MuiLinearProgress),
    },
    MuiCircularProgress: {
      ...MuiCircularProgress,
      ...glowing(MuiCircularProgress, GLOW.MuiCircularProgress),
    },
    MuiTabs: { ...MuiTabs, ...glowing(MuiTabs, GLOW.MuiTabs) },
    MuiTypography: { ...MuiTypography, ...glowing(MuiTypography, GLOW.MuiTypography) },
  };
}
