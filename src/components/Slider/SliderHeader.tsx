import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { tokens } from "../../tokens";
import type { CanopSliderColor } from "./sliderHelpers";

interface SliderHeaderProps {
  color: CanopSliderColor;
  labelId: string;
  label?: string;
  valueText?: string;
}

export function SliderHeader({ color, labelId, label, valueText }: SliderHeaderProps) {
  if (!label && !valueText) return null;

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {label ? (
        <Typography
          id={labelId}
          variant="body2"
          sx={{
            color: "text.secondary",
          }}
        >
          {label}
        </Typography>
      ) : (
        <span />
      )}
      {valueText ? (
        <Typography
          variant="body2"
          color={`${color}.main`}
          sx={{
            fontWeight: tokens.typography.fontWeight.bold,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {valueText}
        </Typography>
      ) : null}
    </Stack>
  );
}
