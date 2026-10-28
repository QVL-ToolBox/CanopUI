import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Stack } from "@canop/ui";

export interface NotchBackdropTileProps {
  title: string;
  children: ReactNode;
}

export function NotchBackdropTile({ title, children }: NotchBackdropTileProps) {
  return (
    <Stack gap="sm">
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      {children}
    </Stack>
  );
}
