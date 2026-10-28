import { useId } from "react";
import { useTranslation } from "../../i18n";
import { useReducedMotion } from "../../motion";
import { paletteColorVar, type CanopPaletteColorName } from "../_shared/paletteColorVar";
import { intlLocale } from "../_shared/intlLocale";
import { columnOffset, columnTop, heightPercent } from "./thermometerGeometry";

export type CanopThermometerLevel = "normal" | "high" | "critical";

export interface UseThermometerParams {
  value: number | null;
  min: number;
  max: number;
  high: number;
  critical: number;
  unit: string;
  label?: string;
  ariaLabel?: string;
  formatValue?: (value: number) => string;
  animated: boolean;
}

export interface CanopThermometerGraduation {
  key: "min" | Exclude<CanopThermometerLevel, "normal">;
  label: string;
  topPercent: number;
  color: string;
}

export interface UseThermometerResult {
  clipId: string;
  level: CanopThermometerLevel;
  color: string;
  fillOffset: number;
  graduations: CanopThermometerGraduation[];
  valueText: string;
  accessibleName: string;
  ariaValueText: string;
  ariaValueNow: number | undefined;
  shouldAnimate: boolean;
  pulses: boolean;
}

const UNSAFE_ID_CHARACTERS = /[^a-zA-Z0-9_-]/g;
const EMPTY_VALUE = "—";
const UNKNOWN_COLOR = "var(--canop-palette-text-disabled)";
const NEUTRAL_MARK = "var(--canop-palette-text-disabled)";

const levelTone: Record<CanopThermometerLevel, CanopPaletteColorName> = {
  normal: "success",
  high: "warning",
  critical: "error",
};

function levelOf(value: number, high: number, critical: number): CanopThermometerLevel {
  if (value >= critical) return "critical";
  if (value >= high) return "high";
  return "normal";
}

function clampToScale(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function ratioOf(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.min(Math.max((value - min) / (max - min), 0), 1);
}

export function useThermometer({
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
}: UseThermometerParams): UseThermometerResult {
  const { t, locale } = useTranslation();
  const reduced = useReducedMotion();
  const clipId = `canop-thermometer-${useId().replace(UNSAFE_ID_CHARACTERS, "")}`;
  const level = value === null ? "normal" : levelOf(value, high, critical);
  const ratio = value === null ? 0 : ratioOf(value, min, max);
  const number = new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 1 });
  const valueText =
    value === null ? EMPTY_VALUE : (formatValue?.(value) ?? `${number.format(value)} ${unit}`);
  const shouldAnimate = animated && !reduced;
  const graduation = (
    key: CanopThermometerGraduation["key"],
    mark: number,
    color: string,
  ): CanopThermometerGraduation => ({
    key,
    label: number.format(mark),
    topPercent: heightPercent(columnTop(ratioOf(mark, min, max))),
    color,
  });

  return {
    clipId,
    level,
    color: value === null ? UNKNOWN_COLOR : paletteColorVar[levelTone[level]],
    fillOffset: columnOffset(ratio),
    graduations: [
      graduation("critical", critical, paletteColorVar.error),
      graduation("high", high, paletteColorVar.warning),
      graduation("min", min, NEUTRAL_MARK),
    ],
    valueText,
    accessibleName: ariaLabel ?? label ?? t("canop.thermometer.label"),
    ariaValueText:
      value === null
        ? t("canop.thermometer.unknown")
        : `${valueText}, ${t(`canop.thermometer.${level}`)}`,
    ariaValueNow: value === null ? undefined : clampToScale(value, min, max),
    shouldAnimate,
    pulses: shouldAnimate && value !== null && level === "critical",
  };
}
