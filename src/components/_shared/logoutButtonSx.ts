import type { CSSObject, Theme } from "@mui/material/styles";
import { squircleFill, squircleSurface } from "../../squircle";

export function logoutButtonSx(theme: Theme, radius: string): CSSObject {
  const tone =
    theme.palette.mode === "dark"
      ? {
          foreground: theme.palette.primary.main,
          background: theme.palette.common.black,
          hover: theme.palette.grey[900],
        }
      : {
          foreground: theme.palette.accent.contrastText,
          background: theme.palette.accent.main,
          hover: theme.palette.accent.dark,
        };

  return {
    justifyContent: "center",
    textAlign: "center",
    color: tone.foreground,
    ...squircleSurface({ radius, background: tone.background }),
    "&:hover": squircleFill(tone.hover),
  } as const;
}
