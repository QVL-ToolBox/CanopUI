import type { PopoverOrigin } from "@mui/material/Popover";
import type { TooltipProps } from "@mui/material/Tooltip";

type NavbarTilePopoverOffset = { marginLeft: string } | { marginBottom: string };

export interface NavbarTilePlacement {
  tooltip?: TooltipProps["placement"];
  anchorOrigin: PopoverOrigin;
  transformOrigin: PopoverOrigin;
  offset: NavbarTilePopoverOffset;
}

export const RAIL_TILE_PLACEMENT: NavbarTilePlacement = {
  tooltip: "right",
  anchorOrigin: { vertical: "center", horizontal: "right" },
  transformOrigin: { vertical: "center", horizontal: "left" },
  offset: { marginLeft: "0.5rem" },
};

export const MOBILE_TILE_PLACEMENT: NavbarTilePlacement = {
  tooltip: "top",
  anchorOrigin: { vertical: "top", horizontal: "center" },
  transformOrigin: { vertical: "bottom", horizontal: "center" },
  offset: { marginBottom: "0.75rem" },
};
