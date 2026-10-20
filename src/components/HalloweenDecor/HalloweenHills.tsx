import Box from "@mui/material/Box";
import { hillsSx } from "./groundSx";

const FAR_HILLS =
  "M0 55C90 30 170 38 260 48C350 58 420 28 520 32C620 36 690 60 790 50C880 41 940 30 1000 36V100H0z";
const NEAR_HILLS = "M0 78C110 64 200 70 300 76C420 84 500 66 620 70C740 74 820 88 1000 72V100H0z";

export function HalloweenHills() {
  return (
    <Box component="svg" viewBox="0 0 1000 100" preserveAspectRatio="none" sx={hillsSx()}>
      <path data-part="far" d={FAR_HILLS} />
      <path data-part="near" d={NEAR_HILLS} />
    </Box>
  );
}
