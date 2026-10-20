import MuiSlider from "@mui/material/Slider";
import { squircleClip, squircleSurface } from "../../squircle";
import Stack from "@mui/material/Stack";
import { tokens } from "../../tokens";
import { paletteColorVar } from "../_shared/paletteColorVar";
import { useFieldLabelling } from "../_shared/useFieldLabelling";
import { SliderHeader } from "./SliderHeader";
import {
  formatSliderValue,
  sliderMetrics,
  sliderTrackBackgroundSize,
  sliderTrackGradient,
  type CanopSliderColor,
  type CanopSliderSize,
} from "./sliderHelpers";

export type { CanopSliderColor, CanopSliderSize };

export interface CanopSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Libellé affiché au-dessus du curseur, et nom accessible par défaut. */
  label?: string;
  /** Nom accessible explicite. Prend le pas sur `label`. */
  ariaLabel?: string;
  showValue?: boolean;
  /** Met la valeur en forme partout où elle est lue : en-tête, bulle, lecteur d'écran. */
  format?: (value: number) => string;
  marks?: boolean;
  disabled?: boolean;
  size?: CanopSliderSize;
  color?: CanopSliderColor;
}

const HALO_TRANSITION = `box-shadow ${tokens.motion.duration.base} ${tokens.motion.easing.organic}`;

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  ariaLabel,
  showValue = false,
  format,
  marks = false,
  disabled = false,
  size = "medium",
  color = "primary",
}: CanopSliderProps) {
  const { labelId, labelledBy, accessibleName } = useFieldLabelling({ label, ariaLabel });
  const haloColor = paletteColorVar[color];
  const metrics = sliderMetrics[size];
  const display = (next: number) => (format ? format(next) : formatSliderValue(next, step));

  return (
    <Stack
      spacing="0.375rem"
      sx={{
        width: "100%",
      }}
    >
      <SliderHeader
        color={color}
        labelId={labelId}
        label={label}
        valueText={showValue ? display(value) : undefined}
      />
      <MuiSlider
        value={value}
        onChange={(_event: Event, next: number) => onChange(next)}
        min={min}
        max={max}
        step={step}
        marks={marks}
        disabled={disabled}
        color={color}
        aria-label={accessibleName}
        aria-labelledby={labelledBy}
        aria-valuetext={display(value)}
        sx={{
          height: metrics.rail,
          padding: `${metrics.padding} 0`,
          "@media (pointer: coarse)": {
            padding: `${metrics.coarsePadding} 0`,
          },
          "& .MuiSlider-rail": {
            opacity: 1,
            backgroundColor: "var(--canop-palette-surface-sunken)",
            ...squircleClip(metrics.railRadius, { shape: "pill" }),
          },
          "& .MuiSlider-track": {
            border: "none",
            backgroundImage: sliderTrackGradient(color),
            backgroundSize: sliderTrackBackgroundSize(value, min, max),
            backgroundRepeat: "no-repeat",
            ...squircleClip(metrics.railRadius, { shape: "pill" }),
          },
          "& .MuiSlider-mark": {
            width: "0.125rem",
            height: metrics.mark,
            ...squircleClip("0.0625rem", { shape: "pill" }),
            opacity: 0.45,
          },
          "& .MuiSlider-markActive": {
            opacity: 0.85,
          },
          "& .MuiSlider-thumb": {
            width: metrics.thumbWidth,
            height: metrics.thumbHeight,
            ...squircleSurface({
              radius: metrics.thumbRadius,
              shape: "pill",
              background: paletteColorVar[color],
            }),
            borderRadius: metrics.thumbRadius,
            transition: HALO_TRANSITION,
            "&:hover, &.Mui-focusVisible": {
              boxShadow: `0 0 0 0.5rem color-mix(in srgb, ${haloColor} 24%, transparent)`,
            },
            "&.Mui-active": {
              boxShadow: `0 0 0 0.75rem color-mix(in srgb, ${haloColor} 32%, transparent)`,
            },
          },
        }}
      />
    </Stack>
  );
}
