import Box from "@mui/material/Box";
import Popover, { type PopoverOrigin } from "@mui/material/Popover";
import type { TooltipProps } from "@mui/material/Tooltip";
import { useId, useState, type MouseEvent } from "react";
import { useReducedMotion } from "../../motion";
import { squircleClip, squircleSurface } from "../../squircle";
import { NavbarPopoverSubItems } from "./NavbarPopoverSubItems";
import { NavbarTileContent } from "./NavbarTileContent";
import { NavbarTileTooltip } from "./NavbarTileTooltip";
import { NAVBAR_SURFACE_GRADIENT } from "./navbarStyles";
import { navbarTileSx } from "./navbarTile";
import { isItemActive, navigateFromEvent, type CanopNavbarItem } from "./navigation";

export type NavbarTilePopoverOffset = { marginLeft: string } | { marginBottom: string };

export interface NavbarTileItemProps {
  item: CanopNavbarItem;
  activeHref?: string;
  onNavigate?: (href: string) => void;
  tooltipPlacement?: TooltipProps["placement"];
  popoverAnchorOrigin: PopoverOrigin;
  popoverTransformOrigin: PopoverOrigin;
  popoverOffset: NavbarTilePopoverOffset;
}

export function NavbarTileItem({
  item,
  activeHref,
  onNavigate,
  tooltipPlacement,
  popoverAnchorOrigin,
  popoverTransformOrigin,
  popoverOffset,
}: NavbarTileItemProps) {
  const subItems = item.children ?? [];
  const hasSubItems = subItems.length > 0;
  const active =
    isItemActive(item.href, activeHref) ||
    subItems.some((sub) => isItemActive(sub.href, activeHref));
  const panelId = useId();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);
  const reducedMotion = useReducedMotion();

  function handleChildClick(href: string, event: MouseEvent) {
    navigateFromEvent(event, href, onNavigate);
    setAnchor(null);
  }

  const tile = hasSubItems ? (
    <Box
      component="button"
      type="button"
      aria-label={item.label}
      aria-expanded={open}
      aria-controls={open ? panelId : undefined}
      onClick={(event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}
      sx={navbarTileSx(active)}
    >
      <NavbarTileContent item={item} active={active} />
      <Box
        component="span"
        aria-hidden
        sx={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          width: "0.375rem",
          height: "0.375rem",
          ...squircleClip("50%", { shape: "circle" }),
          backgroundColor: active ? "primary.main" : "accent.main",
          zIndex: 2,
        }}
      />
    </Box>
  ) : (
    <Box
      component="a"
      href={item.href}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      onClick={(event: MouseEvent) => navigateFromEvent(event, item.href, onNavigate)}
      sx={navbarTileSx(active)}
    >
      <NavbarTileContent item={item} active={active} />
    </Box>
  );

  return (
    <>
      <NavbarTileTooltip label={item.label} placement={tooltipPlacement}>
        {tile}
      </NavbarTileTooltip>

      {hasSubItems && (
        <Popover
          open={open}
          anchorEl={anchor}
          onClose={() => setAnchor(null)}
          anchorOrigin={popoverAnchorOrigin}
          transformOrigin={popoverTransformOrigin}
          transitionDuration={reducedMotion ? 0 : undefined}
          slotProps={{
            paper: {
              id: panelId,
              sx: {
                ...popoverOffset,
                minWidth: "12rem",
                ...squircleSurface({
                  radius: "var(--canop-radius-lg)",
                  background: NAVBAR_SURFACE_GRADIENT,
                }),
              },
            },
          }}
        >
          <NavbarPopoverSubItems
            item={item}
            subItems={subItems}
            activeHref={activeHref}
            onSelect={handleChildClick}
          />
        </Popover>
      )}
    </>
  );
}
