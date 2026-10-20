import Box from "@mui/material/Box";
import { squircleClip } from "../../squircle";
import { useReducedMotion } from "../../motion";
import { ProgressBarHeader } from "./ProgressBarHeader";
import { ProgressBarSegment } from "./ProgressBarSegment";
import {
  resolveSegments,
  type CanopProgressBarColor,
  type CanopProgressSegment,
} from "./progressBarHelpers";

interface ProgressBarSegmentedProps {
  segments: CanopProgressSegment[];
  label?: string;
  color: CanopProgressBarColor;
  max?: number;
  animated: boolean;
  ariaLabel?: string;
}

function buildAriaLabel(resolved: ReturnType<typeof resolveSegments>, label?: string): string {
  const parts = resolved.map(
    (segment) => `${segment.label ?? "segment"} ${Math.round(segment.ratio * 100)}%`,
  );
  return [label, parts.join(", ")].filter(Boolean).join(" : ");
}

export function ProgressBarSegmented({
  segments,
  label,
  color,
  max,
  animated,
  ariaLabel,
}: ProgressBarSegmentedProps) {
  const reducedMotion = useReducedMotion();
  const resolved = resolveSegments(segments, color, max);
  const play = animated && !reducedMotion;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.375rem",
        width: "100%",
      }}
    >
      <ProgressBarHeader label={label} />
      <Box
        role="img"
        aria-label={ariaLabel ?? buildAriaLabel(resolved, label)}
        sx={{
          display: "flex",
          width: "100%",
          height: "0.5rem",
          gap: "0.125rem",
          ...squircleClip("0.25rem", { shape: "pill" }),
          backgroundColor: "var(--canop-palette-surface-sunken)",
          overflow: "hidden",
        }}
      >
        {resolved.map((segment, index) => (
          <ProgressBarSegment key={segment.key} segment={segment} index={index} play={play} />
        ))}
      </Box>
    </Box>
  );
}
