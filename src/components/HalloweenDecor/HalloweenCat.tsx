import Box from "@mui/material/Box";
import { catSx } from "./groundSx";

const BODY =
  "M6 28C5 22 6 17 9 14C8 12 8 9 9 7L8 2L11 5C11.7 4.8 12.3 4.8 13 5L16 2L15 7C16 9 16 12 15 14C18 17 19 22 18 28z";
const TAIL = "M18 26C21 26 23 24 22.5 20.5C22.2 18.5 23.5 17 25 16.8";

interface HalloweenCatProps {
  animated: boolean;
}

export function HalloweenCat({ animated }: HalloweenCatProps) {
  return (
    <Box sx={catSx(animated)}>
      <svg viewBox="0 0 26 28">
        <path data-part="tail" d={TAIL} strokeWidth="1.6" />
        <path data-part="body" d={BODY} />
        <ellipse data-part="eye" cx="10.4" cy="10" rx="0.9" ry="0.7" />
        <ellipse data-part="eye" cx="13.6" cy="10" rx="0.9" ry="0.7" />
      </svg>
    </Box>
  );
}
