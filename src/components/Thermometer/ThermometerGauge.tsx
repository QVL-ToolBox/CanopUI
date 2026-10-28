import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import {
  BULB_CENTER_X,
  BULB_CENTER_Y,
  BULB_RADIUS,
  EMPTY_OFFSET,
  FILL_HEIGHT,
  FILL_TOP,
  FILL_WIDTH,
  FILL_X,
  RESERVOIR_RADIUS,
  THERMOMETER_HEIGHT,
  THERMOMETER_WIDTH,
  TRACK_TOP,
  TRACK_WIDTH,
  TRACK_X,
} from "./thermometerGeometry";

export interface ThermometerGaugeProps {
  height: string;
  clipId: string;
  color: string;
  fillOffset: number;
  animate: boolean;
  pulses: boolean;
}

const TRACK = "var(--canop-palette-surface-sunken)";
const FILL_SPRING = { type: "spring", stiffness: 70, damping: 16, mass: 1 } as const;
const STILL = { duration: 0 } as const;
const PULSE = { duration: 2.4, repeat: Infinity, ease: "easeInOut" } as const;
const COLOR_TRANSITION: CSSProperties = {
  transition: "fill var(--canop-motion-duration-slower) var(--canop-motion-ease-standard)",
};

export function ThermometerGauge({
  height,
  clipId,
  color,
  fillOffset,
  animate,
  pulses,
}: ThermometerGaugeProps) {
  const svgStyle: CSSProperties = { display: "block", height, width: "auto", overflow: "visible" };

  return (
    <svg
      aria-hidden
      focusable={false}
      viewBox={`0 0 ${THERMOMETER_WIDTH} ${THERMOMETER_HEIGHT}`}
      style={svgStyle}
    >
      <defs>
        <clipPath id={clipId}>
          <rect
            x={FILL_X}
            y={FILL_TOP}
            width={FILL_WIDTH}
            height={FILL_HEIGHT}
            rx={FILL_WIDTH / 2}
          />
          <circle cx={BULB_CENTER_X} cy={BULB_CENTER_Y} r={RESERVOIR_RADIUS} />
        </clipPath>
      </defs>
      {pulses ? (
        <motion.circle
          cx={BULB_CENTER_X}
          cy={BULB_CENTER_Y}
          r={BULB_RADIUS}
          fill={color}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: [0, 0.22, 0], scale: [1, 1.22, 1] }}
          transition={PULSE}
        />
      ) : null}
      <rect
        x={TRACK_X}
        y={TRACK_TOP}
        width={TRACK_WIDTH}
        height={BULB_CENTER_Y - TRACK_TOP}
        rx={TRACK_WIDTH / 2}
        fill={TRACK}
      />
      <circle cx={BULB_CENTER_X} cy={BULB_CENTER_Y} r={BULB_RADIUS} fill={TRACK} />
      <g clipPath={`url(#${clipId})`}>
        <motion.rect
          x={FILL_X}
          y={FILL_TOP}
          width={FILL_WIDTH}
          height={FILL_HEIGHT}
          rx={FILL_WIDTH / 2}
          fill={color}
          style={COLOR_TRANSITION}
          initial={animate ? { y: EMPTY_OFFSET } : false}
          animate={{ y: fillOffset }}
          transition={animate ? FILL_SPRING : STILL}
        />
        <circle
          cx={BULB_CENTER_X}
          cy={BULB_CENTER_Y}
          r={RESERVOIR_RADIUS}
          fill={color}
          style={COLOR_TRANSITION}
        />
      </g>
    </svg>
  );
}
