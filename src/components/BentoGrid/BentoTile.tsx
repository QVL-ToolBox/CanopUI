import Stack from "@mui/material/Stack";
import type { AriaRole, ReactNode } from "react";
import { PresenceItem } from "../../motion";
import type { CanopBentoSpan } from "./bentoLayout";
import { useBentoTile } from "./useBentoTile";

export interface CanopBentoTileProps {
  span?: CanopBentoSpan;
  rowSpan?: CanopBentoSpan;
  layout?: boolean;
  role?: AriaRole;
  ariaLabel?: string;
  children: ReactNode;
}

export function BentoTile({
  span = 1,
  rowSpan = 1,
  layout = false,
  role,
  ariaLabel,
  children,
}: CanopBentoTileProps) {
  const placementSx = useBentoTile({ span, rowSpan });

  return (
    <Stack role={role} aria-label={ariaLabel} sx={placementSx}>
      <PresenceItem fill layout={layout}>
        {children}
      </PresenceItem>
    </Stack>
  );
}
