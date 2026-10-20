type CanopStatCardTrend = "up" | "down" | "flat";

interface UseStatCardParams {
  variation?: number;
  positiveIsGood: boolean;
}

interface UseStatCardResult {
  hasVariation: boolean;
  variationColor: string;
  variationText: string;
}

function resolveTrend(variation: number): CanopStatCardTrend {
  if (variation > 0) return "up";
  if (variation < 0) return "down";
  return "flat";
}

function isFavorable(trend: CanopStatCardTrend, positiveIsGood: boolean): boolean {
  if (trend === "up") return positiveIsGood;
  if (trend === "down") return !positiveIsGood;
  return true;
}

export function useStatCard({ variation, positiveIsGood }: UseStatCardParams): UseStatCardResult {
  const hasVariation = variation !== undefined;
  const trend = hasVariation ? resolveTrend(variation) : "flat";

  const variationColor =
    trend === "flat"
      ? "var(--canop-palette-text-secondary)"
      : isFavorable(trend, positiveIsGood)
        ? "var(--canop-palette-success-main)"
        : "var(--canop-palette-error-main)";

  const variationText = hasVariation ? `${variation > 0 ? "+" : ""}${variation}%` : "";

  return { hasVariation, variationColor, variationText };
}
