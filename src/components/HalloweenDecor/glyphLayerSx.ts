import type { CSSObject } from "@mui/material/styles";

export function glyphFrameSx(aspectRatio: string): CSSObject {
  return { position: "relative", display: "block", width: "100%", aspectRatio };
}

export const glyphLayerSx: CSSObject = {
  position: "absolute",
  inset: 0,
  display: "block",
  "& > svg": { display: "block", width: "100%", height: "100%", overflow: "visible" },
};
