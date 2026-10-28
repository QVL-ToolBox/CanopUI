import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export interface EmptyStateDescriptionProps {
  description: ReactNode;
  variant: "body1" | "body2";
}

const READABLE_MEASURE = "42ch";

export function EmptyStateDescription({ description, variant }: EmptyStateDescriptionProps) {
  const textual = typeof description === "string";

  return (
    <Typography
      variant={variant}
      component={textual ? "p" : "div"}
      align="center"
      sx={{
        color: "text.secondary",
        maxWidth: textual ? READABLE_MEASURE : "100%",
        marginX: "auto",
      }}
    >
      {description}
    </Typography>
  );
}
