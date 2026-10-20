import type { CSSObject, Theme } from "@mui/material/styles";

export function hiddenOnMobileSx(theme: Theme): CSSObject {
  return { [theme.breakpoints.down("sm")]: { display: "none" } };
}
