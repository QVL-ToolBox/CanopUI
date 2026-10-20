import { motion } from "framer-motion";
import { motionDurationSeconds, motionEasing } from "../../motion";
import type { CanopDonutGeometry } from "./useDonut";

interface DonutSegmentsProps {
  center: number;
  radius: number;
  strokeWidth: number;
  geometries: CanopDonutGeometry[];
  animate: boolean;
}

const FILL_BASE_DELAY = 0.05;
const FILL_STAGGER = 0.12;

export function DonutSegments({
  center,
  radius,
  strokeWidth,
  geometries,
  animate,
}: DonutSegmentsProps) {
  return (
    <>
      {geometries.map((geometry, index) => {
        const dashArray = `${geometry.dashLength} ${100 - geometry.dashLength}`;
        const circleProps = {
          cx: center,
          cy: center,
          r: radius,
          fill: "none",
          stroke: geometry.color,
          strokeWidth,
          strokeDasharray: dashArray,
          strokeLinecap: "butt" as const,
        };
        return (
          <g key={geometry.key} transform={`rotate(${geometry.rotation} ${center} ${center})`}>
            {animate ? (
              <motion.circle
                {...circleProps}
                initial={{ strokeDashoffset: geometry.dashLength }}
                animate={{ strokeDashoffset: 0 }}
                transition={{
                  duration: motionDurationSeconds.slow,
                  ease: motionEasing.organic,
                  delay: FILL_BASE_DELAY + index * FILL_STAGGER,
                }}
              />
            ) : (
              <circle {...circleProps} />
            )}
          </g>
        );
      })}
    </>
  );
}
