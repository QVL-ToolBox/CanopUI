import { motion } from "framer-motion";
import { motionDurationSeconds, motionEasing } from "../../motion";
import { paletteColorVar } from "../_shared/paletteColorVar";
import { type ResolvedSegment } from "./progressBarHelpers";

const SegmentDiv = motion.div;

interface ProgressBarSegmentProps {
  segment: ResolvedSegment;
  index: number;
  play: boolean;
}

export function ProgressBarSegment({ segment, index, play }: ProgressBarSegmentProps) {
  return (
    <SegmentDiv
      initial={play ? { scaleX: 0 } : false}
      animate={{ scaleX: 1 }}
      transition={
        play
          ? {
              duration: motionDurationSeconds.base,
              ease: motionEasing.organic,
              delay: index * motionDurationSeconds.instant,
            }
          : { duration: 0 }
      }
      style={{
        width: `${segment.ratio * 100}%`,
        height: "100%",
        transformOrigin: "left",
        backgroundColor: paletteColorVar[segment.color],
      }}
    />
  );
}
