import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import type { ReactNode } from "react";
import { useReducedMotion } from "../../motion";
import { navbarPopoverSurfaceSx } from "./navbarSurface";
import { NAVBAR_TILE_RADIUS } from "./navbarTile";
import type { NavbarTilePlacement } from "./navbarTilePlacement";
import type { UseNavbarPopoverResult } from "./useNavbarPopover";

export interface NavbarTilePopoverProps {
  popover: UseNavbarPopoverResult;
  placement: NavbarTilePlacement;
  children: ReactNode;
}

export function NavbarTilePopover({ popover, placement, children }: NavbarTilePopoverProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Popover
      open={popover.open}
      anchorEl={popover.anchor}
      onClose={popover.close}
      anchorOrigin={placement.anchorOrigin}
      transformOrigin={placement.transformOrigin}
      transitionDuration={reducedMotion ? 0 : undefined}
      slotProps={{
        paper: {
          id: popover.panelId,
          sx: {
            ...placement.offset,
            minWidth: "12rem",
            ...navbarPopoverSurfaceSx(NAVBAR_TILE_RADIUS),
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          padding: "0.5rem",
        }}
      >
        {children}
      </Box>
    </Popover>
  );
}
