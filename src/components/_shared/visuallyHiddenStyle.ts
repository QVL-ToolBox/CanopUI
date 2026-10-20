import type { CSSProperties } from "react";

export const visuallyHiddenStyle: CSSProperties = {
  position: "absolute",
  width: "0.0625rem",
  height: "0.0625rem",
  margin: "-0.0625rem",
  padding: 0,
  border: 0,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
};
