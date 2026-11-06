import { SINGLE_SHOT_THRESHOLD } from "./constants";
import type { CanopUploadStrategy } from "./types";

export function selectStrategy(
  declaredSize: number,
  threshold: number = SINGLE_SHOT_THRESHOLD,
): CanopUploadStrategy {
  return declaredSize < threshold ? "single-shot" : "chunked";
}
