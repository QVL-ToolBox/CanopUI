import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useId, type ReactNode } from "react";
import { tokens } from "../../tokens";
import { overlineSx } from "../_shared/overlineSx";

export interface CanopCommandGroupProps {
  label?: ReactNode;
  children: ReactNode;
}

export function CommandGroup({ label, children }: CanopCommandGroupProps) {
  const labelId = useId();

  if (!label) return <Stack>{children}</Stack>;

  return (
    <Stack role="group" aria-labelledby={labelId}>
      <Typography
        id={labelId}
        component="div"
        sx={{
          color: "text.secondary",
          paddingX: tokens.spacing.md,
          paddingTop: tokens.spacing.sm,
          paddingBottom: tokens.spacing["2xs"],
          ...overlineSx,
        }}
      >
        {label}
      </Typography>
      {children}
    </Stack>
  );
}
