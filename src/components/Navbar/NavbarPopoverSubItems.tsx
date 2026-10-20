import Box from "@mui/material/Box";
import type { MouseEvent } from "react";
import { Icon } from "../Icon";
import { squircleFill, squircleSurface } from "../../squircle";
import { NAVBAR_HOVER_OVERLAY } from "./navbarStyles";
import { isItemActive, type CanopNavbarItem } from "./navigation";

export interface NavbarPopoverSubItemsProps {
  item: CanopNavbarItem;
  subItems: CanopNavbarItem[];
  activeHref?: string;
  onSelect: (href: string, event: MouseEvent) => void;
}

export function NavbarPopoverSubItems({
  item,
  subItems,
  activeHref,
  onSelect,
}: NavbarPopoverSubItemsProps) {
  return (
    <Box
      role="group"
      aria-label={item.label}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        padding: "0.75rem",
      }}
    >
      {[item, ...subItems].map((entry, index) => {
        const entryActive = isItemActive(entry.href, activeHref);
        const emphasized = index === 0 || entryActive;
        return (
          <Box
            key={entry.href}
            component="a"
            href={entry.href}
            aria-label={entry.label}
            aria-current={entryActive ? "page" : undefined}
            onClick={(event: MouseEvent) => onSelect(entry.href, event)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              minHeight: "2.75rem",
              paddingInline: "0.75rem",
              ...squircleSurface({
                radius: "var(--canop-radius-md)",
                background: entryActive ? "var(--canop-palette-background-paper)" : "transparent",
              }),
              color: entryActive ? "primary.main" : "primary.contrastText",
              fontWeight: emphasized ? 600 : 400,
              textDecoration: "none",
              "&:hover": entryActive ? {} : squircleFill(NAVBAR_HOVER_OVERLAY),
            }}
          >
            {entry.icon && <Icon name={entry.icon} size="sm" />}
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
      })}
    </Box>
  );
}
