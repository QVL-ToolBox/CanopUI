import Typography from "@mui/material/Typography";
import { tokens } from "../../tokens";
import type { CanopIconSize } from "../Icon";
import { ratingTextVariant, type CanopRatingColor } from "./ratingHelpers";

interface RatingValueProps {
  color: CanopRatingColor;
  size: CanopIconSize;
  text: string;
}

export function RatingValue({ color, size, text }: RatingValueProps) {
  return (
    <Typography
      variant={ratingTextVariant(size)}
      color={`${color}.main`}
      sx={{
        fontWeight: tokens.typography.fontWeight.bold,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {text}
    </Typography>
  );
}
