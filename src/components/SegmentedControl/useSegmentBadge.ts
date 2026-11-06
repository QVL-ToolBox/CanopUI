import type { ReactNode } from "react";
import type { CanopBadgeColor } from "../Badge";
import type { CanopSegmentedControlOption } from "./useSegmentedControl";

const BADGE_MAX = 99;
const DEFAULT_BADGE_COLOR: CanopBadgeColor = "primary";
const NODE_BADGE_KEY = "node";

export interface SegmentBadge {
  content: ReactNode;
  color: CanopBadgeColor;
  key: string;
}

export interface UseSegmentBadgeResult {
  badge: SegmentBadge | null;
  ariaLabel: string | undefined;
}

function isShown(badge: ReactNode): boolean {
  return badge !== undefined && badge !== null && badge !== false && badge !== "" && badge !== 0;
}

function spokenBadge(badge: ReactNode): string | undefined {
  if (typeof badge === "number") return badge > BADGE_MAX ? `${BADGE_MAX}+` : String(badge);
  if (typeof badge === "string") return badge.trim() || undefined;
  return undefined;
}

function badgeKey(badge: ReactNode): string {
  return typeof badge === "number" || typeof badge === "string" ? String(badge) : NODE_BADGE_KEY;
}

export function useSegmentBadge<T extends string>(
  { label, badge, badgeLabel, badgeColor = DEFAULT_BADGE_COLOR }: CanopSegmentedControlOption<T>,
  iconOnly: boolean,
): UseSegmentBadgeResult {
  const labelOnly = iconOnly ? label : undefined;
  if (!isShown(badge)) return { badge: null, ariaLabel: labelOnly };

  const spoken = badgeLabel ?? spokenBadge(badge);
  return {
    badge: { content: badge, color: badgeColor, key: badgeKey(badge) },
    ariaLabel: spoken ? `${label} (${spoken})` : labelOnly,
  };
}
