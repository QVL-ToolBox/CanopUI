import type { CSSObject } from "@mui/material/styles";

export const singleLineEllipsis: CSSObject = {
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export function lineClamp(lines: number): CSSObject {
  return {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: lines,
    lineClamp: lines,
    overflow: "hidden",
  };
}
