import Box from "@mui/material/Box";
import type { MouseEvent } from "react";
import { Icon } from "../Icon";
import { squircleSurface } from "../../squircle";
import { navbarInteractionSx } from "./navbarInteraction";
import { NAVBAR_ACTIVE_FILL, NAVBAR_ACTIVE_SHADOW } from "./navbarTone";
import { isItemActive, type CanopNavbarItem } from "./navigation";

export const NAVBAR_POPOVER_LINK_INSET = "0.75rem";

export interface NavbarPopoverLinkProps {
  entry: CanopNavbarItem;
  activeHref?: string;
  emphasized?: boolean;
  onSelect: (href: string, event: MouseEvent) => void;
}

export function NavbarPopoverLink({
  entry,
  activeHref,
  emphasized = false,
  onSelect,
}: NavbarPopoverLinkProps) {
  const active = isItemActive(entry.href, activeHref);

  return (
    <Box
      component="a"
      href={entry.href}
      aria-label={entry.label}
      aria-current={active ? "page" : undefined}
      onClick={(event: MouseEvent) => onSelect(entry.href, event)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        minHeight: "2.75rem",
        paddingInline: NAVBAR_POPOVER_LINK_INSET,
        ...squircleSurface({
          radius: "var(--canop-radius-md)",
          background: active ? NAVBAR_ACTIVE_FILL : "transparent",
          shadow: active ? NAVBAR_ACTIVE_SHADOW : undefined,
        }),
        fontSize: "0.9375rem",
        fontWeight: emphasized || active ? 600 : 400,
        textDecoration: "none",
        ...navbarInteractionSx(active),
      }}
    >
      {entry.icon && <Icon name={entry.icon} size="sm" variant={active ? "solid" : "outline"} />}
      <Box
        component="span"
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {entry.label}
      </Box>
    </Box>
  );
}
