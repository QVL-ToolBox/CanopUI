import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { Stack } from "../Stack";
import { DonutLegend } from "./DonutLegend";
import { DonutSegments } from "./DonutSegments";
import { useDonut, type CanopDonutSegment, type CanopDonutThickness } from "./useDonut";

export type { CanopDonutColor, CanopDonutSegment, CanopDonutThickness } from "./useDonut";

export interface CanopDonutProps {
  segments: CanopDonutSegment[];
  size?: string;
  thickness?: CanopDonutThickness;
  showLegend?: boolean;
  animated?: boolean;
  ariaLabel?: string;
  centerContent?: ReactNode;
  formatValue?: (segment: CanopDonutSegment, percentage: number) => string;
}

export function Donut({
  segments,
  size = "12rem",
  thickness = "medium",
  showLegend = false,
  animated = true,
  ariaLabel,
  centerContent,
  formatValue,
}: CanopDonutProps) {
  const {
    viewBox,
    center,
    radius,
    strokeWidth,
    geometries,
    shouldAnimate,
    resolvedAriaLabel,
    trackColor,
  } = useDonut({ segments, thickness, animated, ariaLabel, formatValue });

  return (
    <Stack gap="md" alignItems="center">
      <Box
        sx={{
          position: "relative",
          width: size,
          aspectRatio: "1 / 1",
        }}
      >
        <svg
          role="img"
          aria-label={resolvedAriaLabel}
          viewBox={viewBox}
          width="100%"
          height="100%"
          style={{ display: "block" }}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          <DonutSegments
            center={center}
            radius={radius}
            strokeWidth={strokeWidth}
            geometries={geometries}
            animate={shouldAnimate}
          />
        </svg>
        {centerContent && (
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              inset: 0,
            }}
          >
            {centerContent}
          </Box>
        )}
      </Box>
      {showLegend && <DonutLegend geometries={geometries} />}
    </Stack>
  );
}
