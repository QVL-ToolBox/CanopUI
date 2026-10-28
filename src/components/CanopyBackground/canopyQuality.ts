export type CanopCanopyQuality = "auto" | "high" | "low";

export type CanopCanopyQualityLevel = "high" | "medium" | "low";

export type CanopCanopyQualityReason =
  | "forced"
  | "capable"
  | "disabled"
  | "reduced-motion"
  | "save-data"
  | "slow-network"
  | "limited-network"
  | "modest-device"
  | "small-screen"
  | "low-frame-rate"
  | "buffering";

export interface CanopCanopyQualityState {
  level: CanopCanopyQualityLevel;
  reason: CanopCanopyQualityReason;
}

export type CanopyMotionBlocker = Extract<CanopCanopyQualityReason, "disabled" | "reduced-motion">;

export type CanopyConstraint = Exclude<
  CanopCanopyQualityReason,
  "forced" | "capable" | CanopyMotionBlocker | "low-frame-rate" | "buffering"
>;

export interface CanopyQualityInputs {
  quality: CanopCanopyQuality;
  motionBlocker?: CanopyMotionBlocker;
  constraints: CanopyConstraint[];
  frameDowngrades: number;
  bufferingDowngrades: number;
  liteAvailable: boolean;
}

const LADDER_WITH_LITE: CanopCanopyQualityLevel[] = ["high", "medium", "low"];
const LADDER_WITHOUT_LITE: CanopCanopyQualityLevel[] = ["high", "low"];
const STRAIGHT_TO_POSTER = new Set<CanopyConstraint>(["save-data", "slow-network"]);

function playbackSlowdown(
  frameDowngrades: number,
  bufferingDowngrades: number,
): CanopCanopyQualityReason | undefined {
  if (frameDowngrades > 0) return "low-frame-rate";
  return bufferingDowngrades > 0 ? "buffering" : undefined;
}

export function resolveCanopyQuality({
  quality,
  motionBlocker,
  constraints,
  frameDowngrades,
  bufferingDowngrades,
  liteAvailable,
}: CanopyQualityInputs): CanopCanopyQualityState {
  if (motionBlocker) return { level: "low", reason: motionBlocker };
  if (quality !== "auto") return { level: quality, reason: "forced" };
  const ladder = liteAvailable ? LADDER_WITH_LITE : LADDER_WITHOUT_LITE;
  const lowest = ladder.length - 1;
  const severe = constraints.find((constraint) => STRAIGHT_TO_POSTER.has(constraint));
  if (severe) return { level: ladder[lowest], reason: severe };
  const mild = constraints.find((constraint) => liteAvailable || constraint !== "small-screen");
  const reason = playbackSlowdown(frameDowngrades, bufferingDowngrades) ?? mild;
  if (!reason) return { level: "high", reason: "capable" };
  const step = Math.min((mild ? 1 : 0) + frameDowngrades + bufferingDowngrades, lowest);
  return { level: ladder[step], reason };
}
