import Stack from "@mui/material/Stack";
import type { CanopIconSize } from "../Icon";
import { RatingLabel } from "./RatingLabel";
import { RatingStars } from "./RatingStars";
import { RatingValue } from "./RatingValue";
import {
  formatRatingValue,
  normalizeRatingMax,
  normalizeRatingValue,
  ratingAriaLabel,
  type CanopRatingColor,
} from "./ratingHelpers";

export type { CanopRatingColor };

export interface CanopRatingProps {
  value: number;
  max?: number;
  showValue?: boolean;
  size?: CanopIconSize;
  color?: CanopRatingColor;
  label?: string;
}

export function Rating({
  value,
  max = 5,
  showValue = false,
  size = "sm",
  color = "accent",
  label,
}: CanopRatingProps) {
  const boundedMax = normalizeRatingMax(max);
  const boundedValue = normalizeRatingValue(value, boundedMax);

  return (
    <Stack
      direction="row"
      spacing="0.5rem"
      sx={{
        alignItems: "center",
        display: "inline-flex",
      }}
    >
      {label ? <RatingLabel size={size} text={label} /> : null}
      <RatingStars
        value={boundedValue}
        max={boundedMax}
        size={size}
        color={color}
        ariaLabel={ratingAriaLabel(boundedValue, boundedMax, label)}
      />
      {showValue ? (
        <RatingValue color={color} size={size} text={formatRatingValue(boundedValue)} />
      ) : null}
    </Stack>
  );
}
