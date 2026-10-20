import MuiRating from "@mui/material/Rating";
import { Icon, type CanopIconSize } from "../Icon";
import { paletteColorVar } from "../_shared/paletteColorVar";
import { RATING_PRECISION, type CanopRatingColor } from "./ratingHelpers";

interface RatingStarsProps {
  value: number;
  max: number;
  size: CanopIconSize;
  color: CanopRatingColor;
  ariaLabel: string;
}

export function RatingStars({ value, max, size, color, ariaLabel }: RatingStarsProps) {
  const filledColor = paletteColorVar[color];
  const star = <Icon name="star" variant="solid" size={size} />;

  return (
    <MuiRating
      value={value}
      max={max}
      precision={RATING_PRECISION}
      readOnly
      icon={star}
      emptyIcon={star}
      getLabelText={() => ariaLabel}
      sx={{
        "& .MuiRating-iconFilled": {
          color: filledColor,
        },
        "& .MuiRating-iconEmpty": {
          color: `color-mix(in srgb, ${filledColor} 26%, transparent)`,
        },
        "& .MuiRating-icon svg": {
          flexShrink: 0,
        },
      }}
    />
  );
}
