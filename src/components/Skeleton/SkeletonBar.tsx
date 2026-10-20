import Box from "@mui/material/Box";
import type { CSSObject } from "@mui/material/styles";
import { skeletonPulseSx } from "./skeletonPulseSx";

interface SkeletonBarProps {
  width: string;
  height: string;
  shape: CSSObject;
  pulsing: boolean;
  delay?: string;
}

export function SkeletonBar({ width, height, shape, pulsing, delay }: SkeletonBarProps) {
  return (
    <Box
      component="span"
      data-pulse={pulsing ? "on" : "off"}
      sx={{
        ...shape,
        display: "block",
        width,
        maxWidth: "100%",
        height,
        backgroundColor: "var(--canop-palette-divider)",
        ...(pulsing ? { ...skeletonPulseSx, animationDelay: delay } : {}),
      }}
    />
  );
}
