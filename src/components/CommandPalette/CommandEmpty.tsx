import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { tokens } from "../../tokens";

export interface CanopCommandEmptyProps {
  id?: string;
  announce?: boolean;
  children: ReactNode;
}

export function CommandEmpty({ id, announce = true, children }: CanopCommandEmptyProps) {
  return (
    <Stack
      id={id}
      role={announce ? "status" : undefined}
      sx={{ paddingX: tokens.spacing.md, paddingY: tokens.spacing.xl }}
    >
      <Typography variant="body2" align="center" sx={{ color: "text.secondary" }}>
        {children}
      </Typography>
    </Stack>
  );
}
