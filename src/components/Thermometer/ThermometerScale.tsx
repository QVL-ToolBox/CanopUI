import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { tokens } from "../../tokens";
import type { CanopThermometerGraduation } from "./useThermometer";

export interface ThermometerScaleProps {
  height: string;
  fontSize: string;
  graduations: CanopThermometerGraduation[];
}

const MARK_SX = {
  width: "0.375rem",
  height: "0.125rem",
  borderRadius: "0.0625rem",
  flexShrink: 0,
} as const;

function scaleSx(height: string): SxProps<Theme> {
  return { position: "relative", height, minWidth: "1.75rem" };
}

function graduationSx(topPercent: number, fontSize: string): SxProps<Theme> {
  return {
    position: "absolute",
    left: 0,
    top: `${topPercent}%`,
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize,
    lineHeight: 1,
    fontWeight: tokens.typography.fontWeight.medium,
    fontVariantNumeric: "tabular-nums",
    color: "text.secondary",
    whiteSpace: "nowrap",
  };
}

export function ThermometerScale({ height, fontSize, graduations }: ThermometerScaleProps) {
  return (
    <Box aria-hidden sx={scaleSx(height)}>
      {graduations.map((graduation) => (
        <Box key={graduation.key} sx={graduationSx(graduation.topPercent, fontSize)}>
          <Box component="span" sx={{ ...MARK_SX, backgroundColor: graduation.color }} />
          <span>{graduation.label}</span>
        </Box>
      ))}
    </Box>
  );
}
