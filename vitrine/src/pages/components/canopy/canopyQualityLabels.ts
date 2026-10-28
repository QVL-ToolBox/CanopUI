import type {
  CanopCanopyQuality,
  CanopCanopyQualityLevel,
  CanopCanopyQualityReason,
} from "@canop/ui";

export interface CanopyQualityLabels {
  quality: string;
  qualities: Record<CanopCanopyQuality, string>;
  level: string;
  reason: string;
  pending: string;
  levels: Record<CanopCanopyQualityLevel, string>;
  reasons: Record<CanopCanopyQualityReason, string>;
  cardTitle: string;
  cardBody: string;
}
