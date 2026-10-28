import Box from "@mui/material/Box";
import type { TooltipProps } from "@mui/material/Tooltip";
import type { CanopIconName } from "../Icon";
import { NavbarSubItemsBadge } from "./NavbarSubItemsBadge";
import { NavbarTileContent } from "./NavbarTileContent";
import { NavbarTileTooltip } from "./NavbarTileTooltip";
import { navbarTileSx } from "./navbarTile";
import type { UseNavbarPopoverResult } from "./useNavbarPopover";

export interface NavbarTileButtonProps {
  label: string;
  icon?: CanopIconName;
  active: boolean;
  popover: UseNavbarPopoverResult;
  tooltipPlacement?: TooltipProps["placement"];
  badge?: boolean;
}

export function NavbarTileButton({
  label,
  icon,
  active,
  popover,
  tooltipPlacement,
  badge = false,
}: NavbarTileButtonProps) {
  return (
    <NavbarTileTooltip label={label} placement={tooltipPlacement}>
      <Box
        component="button"
        type="button"
        aria-label={label}
        aria-expanded={popover.open}
        aria-controls={popover.open ? popover.panelId : undefined}
        onClick={popover.openFrom}
        sx={navbarTileSx(active)}
      >
        <NavbarTileContent label={label} icon={icon} active={active} />
        {badge && <NavbarSubItemsBadge active={active} />}
      </Box>
    </NavbarTileTooltip>
  );
}
