import Box from "@mui/material/Box";
import type { MouseEvent } from "react";
import { NAVBAR_POPOVER_LINK_INSET, NavbarPopoverLink } from "./NavbarPopoverLink";
import { NavbarSectionGroup } from "./NavbarSectionGroup";
import { navbarSections, type CanopNavbarItem } from "./navigation";

export interface NavbarPopoverSubItemsProps {
  item: CanopNavbarItem;
  activeHref?: string;
  onSelect: (href: string, event: MouseEvent) => void;
}

export function NavbarPopoverSubItems({ item, activeHref, onSelect }: NavbarPopoverSubItemsProps) {
  return (
    <Box
      role="group"
      aria-label={item.label}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}
    >
      <NavbarPopoverLink entry={item} activeHref={activeHref} emphasized onSelect={onSelect} />
      {navbarSections(item).map((section, index) => (
        <NavbarSectionGroup key={index} label={section.label} inset={NAVBAR_POPOVER_LINK_INSET}>
          {section.items.map((sub) => (
            <NavbarPopoverLink
              key={sub.href}
              entry={sub}
              activeHref={activeHref}
              onSelect={onSelect}
            />
          ))}
        </NavbarSectionGroup>
      ))}
    </Box>
  );
}
