import type { Transition } from "framer-motion";
import { motionDurationSeconds, motionEasing } from "../../motion";

export const ACTIVE_INDICATOR_LAYOUT_ID = "active";

export const activeIndicatorTransition: Transition = {
  duration: motionDurationSeconds.base,
  ease: motionEasing.organic,
};
