import Box from "@mui/material/Box";
import { Stack } from "../Stack";
import { Text, type CanopTextVariant } from "../Text";
import { ThermometerGauge } from "./ThermometerGauge";
import { ThermometerScale } from "./ThermometerScale";
import { useThermometer } from "./useThermometer";

export type { CanopThermometerLevel } from "./useThermometer";

export type CanopThermometerSize = "sm" | "md";

export interface CanopThermometerProps {
  value: number | null;
  label?: string;
  min?: number;
  max?: number;
  high?: number;
  critical?: number;
  unit?: string;
  size?: CanopThermometerSize;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  ariaLabel?: string;
  animated?: boolean;
}

interface SizeRecipe {
  gaugeHeight: string;
  scaleFontSize: string;
  labelVariant: CanopTextVariant;
  valueVariant: CanopTextVariant;
}

const sizeRecipe: Record<CanopThermometerSize, SizeRecipe> = {
  sm: {
    gaugeHeight: "5rem",
    scaleFontSize: "0.625rem",
    labelVariant: "caption",
    valueVariant: "label",
  },
  md: {
    gaugeHeight: "8rem",
    scaleFontSize: "0.75rem",
    labelVariant: "body-sm",
    valueVariant: "metric",
  },
};

const DEFAULT_HIGH_CELSIUS = 70;
const DEFAULT_CRITICAL_CELSIUS = 85;

const VALUE_TONE = { normal: "success", high: "warning", critical: "error" } as const;
const METER_SX = { display: "inline-flex", minWidth: 0 } as const;
const TEXTS_SX = { minWidth: 0 } as const;

export function Thermometer({
  value,
  label,
  min = 0,
  max = 100,
  high = DEFAULT_HIGH_CELSIUS,
  critical = DEFAULT_CRITICAL_CELSIUS,
  unit = "°C",
  size = "md",
  showValue = true,
  formatValue,
  ariaLabel,
  animated = true,
}: CanopThermometerProps) {
  const recipe = sizeRecipe[size];
  const thermometer = useThermometer({
    value,
    min,
    max,
    high,
    critical,
    unit,
    label,
    ariaLabel,
    formatValue,
    animated,
  });

  return (
    <Box
      role="meter"
      aria-label={thermometer.accessibleName}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={thermometer.ariaValueNow}
      aria-valuetext={thermometer.ariaValueText}
      sx={METER_SX}
    >
      <Stack direction="row" gap="sm" alignItems="center">
        <Stack direction="row" gap="xs" alignItems="start">
          <ThermometerGauge
            height={recipe.gaugeHeight}
            clipId={thermometer.clipId}
            color={thermometer.color}
            fillOffset={thermometer.fillOffset}
            animate={thermometer.shouldAnimate}
            pulses={thermometer.pulses}
          />
          <ThermometerScale
            height={recipe.gaugeHeight}
            fontSize={recipe.scaleFontSize}
            graduations={thermometer.graduations}
          />
        </Stack>
        {label || showValue ? (
          <Box aria-hidden sx={TEXTS_SX}>
            <Stack gap="xs">
              {label ? (
                <Text variant={recipe.labelVariant} tone="muted" noWrap>
                  {label}
                </Text>
              ) : null}
              {showValue ? (
                <Text
                  variant={recipe.valueVariant}
                  weight="bold"
                  tone={VALUE_TONE[thermometer.level]}
                  tabularNums
                >
                  {thermometer.valueText}
                </Text>
              ) : null}
            </Stack>
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
}
