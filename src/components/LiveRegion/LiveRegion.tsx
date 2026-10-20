import { visuallyHiddenStyle } from "../_shared/visuallyHiddenStyle";
import { useLiveRegion } from "./useLiveRegion";

export type CanopLiveRegionPoliteness = "polite" | "assertive";

export interface CanopLiveRegionProps {
  message: string;
  politeness?: CanopLiveRegionPoliteness;
  announcementId?: number | string;
}

const roleByPoliteness: Record<CanopLiveRegionPoliteness, "status" | "alert"> = {
  polite: "status",
  assertive: "alert",
};

export function LiveRegion({
  message,
  politeness = "polite",
  announcementId,
}: CanopLiveRegionProps) {
  const spoken = useLiveRegion(message, announcementId);

  return (
    <div
      role={roleByPoliteness[politeness]}
      aria-live={politeness}
      aria-atomic="true"
      style={visuallyHiddenStyle}
    >
      {spoken}
    </div>
  );
}
