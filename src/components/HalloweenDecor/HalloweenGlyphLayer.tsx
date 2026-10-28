import Box from "@mui/material/Box";
import type { CSSObject } from "@mui/material/styles";
import type { ReactNode } from "react";
import { glyphLayerSx } from "./glyphLayerSx";

interface HalloweenGlyphLayerProps {
  viewBox: string;
  sx?: CSSObject;
  children: ReactNode;
}

export function HalloweenGlyphLayer({ viewBox, sx = {}, children }: HalloweenGlyphLayerProps) {
  return (
    <Box component="span" sx={[glyphLayerSx, sx]}>
      <svg viewBox={viewBox}>{children}</svg>
    </Box>
  );
}
