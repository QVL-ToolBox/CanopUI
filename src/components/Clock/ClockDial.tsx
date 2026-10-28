import Box from "@mui/material/Box";
import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties } from "react";
import { motionDurationSeconds, motionEasing } from "../../motion";
import { tokens } from "../../tokens";
import { DIAL_CENTER, DIAL_SIZE, KNOB_RADIUS, type CanopClockMark } from "./clockGeometry";
import type { CanopClockMode } from "./clockTime";
import type { UseClockDialProps } from "./useClock";

export interface ClockDialProps {
  mode: CanopClockMode;
  marks: CanopClockMark[];
  selectedValue: number;
  rotation: number;
  handLength: number;
  hasValue: boolean;
  animate: boolean;
  dialProps: UseClockDialProps;
}

const FACE_RADIUS = DIAL_SIZE / 2 - 2;
const PIVOT_RADIUS = 4;
const OFF_MARK_DOT_RADIUS = 3;
const LABELLED_MINUTE_STEP = 5;
const HAND_SPRING = { type: "spring", stiffness: 260, damping: 26, mass: 0.9 } as const;
const MARKS_FADE = { duration: motionDurationSeconds.base, ease: motionEasing.organic };
const STILL = { duration: 0 } as const;

const PRIMARY = "var(--canop-palette-primary-main)";
const ON_PRIMARY = "var(--canop-palette-primary-contrastText)";
const FACE = "var(--canop-palette-surface-sunken)";
const TEXT = "var(--canop-palette-text-primary)";
const TEXT_MUTED = "var(--canop-palette-text-secondary)";

const DIAL_FRAME_SX = {
  width: "100%",
  maxWidth: "16rem",
  aspectRatio: "1 / 1",
  marginInline: "auto",
  touchAction: "none",
  userSelect: "none",
  "& svg": { display: "block", cursor: "pointer", outline: "none" },
  "& svg:focus-visible circle[data-face]": { fill: "var(--canop-palette-action-hover)" },
} as const;

const NUMBERS_STYLE: CSSProperties = { fontFamily: "inherit", fontVariantNumeric: "tabular-nums" };

function markColor(mark: CanopClockMark, selected: boolean): string {
  if (selected) return ON_PRIMARY;
  return mark.inner ? TEXT_MUTED : TEXT;
}

export function ClockDial({
  mode,
  marks,
  selectedValue,
  rotation,
  handLength,
  hasValue,
  animate,
  dialProps,
}: ClockDialProps) {
  const offMark = mode === "minutes" && selectedValue % LABELLED_MINUTE_STEP !== 0;
  const handOpacity = hasValue ? 1 : 0.45;

  return (
    <Box sx={DIAL_FRAME_SX}>
      <svg viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`} width="100%" height="100%" {...dialProps}>
        <circle data-face cx={DIAL_CENTER} cy={DIAL_CENTER} r={FACE_RADIUS} fill={FACE} />
        <motion.g
          initial={false}
          animate={{ rotate: rotation, opacity: handOpacity }}
          transition={animate ? HAND_SPRING : STILL}
        >
          <circle cx={DIAL_CENTER} cy={DIAL_CENTER} r={FACE_RADIUS} fill="transparent" />
          <motion.line
            x1={DIAL_CENTER}
            y1={DIAL_CENTER}
            x2={DIAL_CENTER}
            initial={false}
            animate={{ y2: DIAL_CENTER - handLength }}
            transition={animate ? HAND_SPRING : STILL}
            stroke={PRIMARY}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <motion.circle
            cx={DIAL_CENTER}
            r={KNOB_RADIUS}
            initial={false}
            animate={{ cy: DIAL_CENTER - handLength }}
            transition={animate ? HAND_SPRING : STILL}
            fill={PRIMARY}
          />
          {offMark ? (
            <circle
              cx={DIAL_CENTER}
              cy={DIAL_CENTER - handLength}
              r={OFF_MARK_DOT_RADIUS}
              fill={ON_PRIMARY}
            />
          ) : null}
          <circle cx={DIAL_CENTER} cy={DIAL_CENTER} r={PIVOT_RADIUS} fill={PRIMARY} />
        </motion.g>
        <AnimatePresence initial={false}>
          <motion.g
            key={mode}
            aria-hidden
            style={NUMBERS_STYLE}
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={animate ? MARKS_FADE : STILL}
          >
            {marks.map((mark) => (
              <text
                key={mark.value}
                x={mark.x}
                y={mark.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={mark.inner ? 12 : 15}
                fontWeight={
                  mark.value === selectedValue
                    ? tokens.typography.fontWeight.bold
                    : tokens.typography.fontWeight.medium
                }
                fill={markColor(mark, hasValue && mark.value === selectedValue)}
              >
                {mark.label}
              </text>
            ))}
          </motion.g>
        </AnimatePresence>
      </svg>
    </Box>
  );
}
