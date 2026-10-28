import Box from "@mui/material/Box";
import type { TooltipProps } from "@mui/material/Tooltip";
import type { MouseEvent } from "react";
import { NavbarTileContent } from "./NavbarTileContent";
import { NavbarTileTooltip } from "./NavbarTileTooltip";
import { navbarTileSx } from "./navbarTile";
import { navigateFromEvent, type CanopNavbarItem } from "./navigation";

export interface NavbarTileLinkProps {
  item: CanopNavbarItem;
  active: boolean;
  onNavigate?: (href: string) => void;
  tooltipPlacement?: TooltipProps["placement"];
}

export function NavbarTileLink({
  item,
  active,
  onNavigate,
  tooltipPlacement,
}: NavbarTileLinkProps) {
  return (
    <NavbarTileTooltip label={item.label} placement={tooltipPlacement}>
      <Box
        component="a"
        href={item.href}
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        onClick={(event: MouseEvent) => navigateFromEvent(event, item.href, onNavigate)}
        sx={navbarTileSx(active)}
      >
        <NavbarTileContent label={item.label} icon={item.icon} active={active} />
      </Box>
    </NavbarTileTooltip>
  );
}
