import Typography from "@mui/material/Typography";
import type { CanopIconSize } from "../Icon";
import { ratingTextVariant } from "./ratingHelpers";

interface RatingLabelProps {
  size: CanopIconSize;
  text: string;
}

export function RatingLabel({ size, text }: RatingLabelProps) {
  return (
    <Typography
      variant={ratingTextVariant(size)}
      sx={{
        color: "text.secondary",
      }}
    >
      {text}
    </Typography>
  );
}
