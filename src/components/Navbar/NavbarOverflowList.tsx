import Box from "@mui/material/Box";
import { Fragment, type MouseEvent } from "react";
import { NavbarDivider } from "./NavbarDivider";
import { NavbarPopoverLink } from "./NavbarPopoverLink";
import { NavbarPopoverSubItems } from "./NavbarPopoverSubItems";
import { separatesOverflowEntry } from "./navbarOverflow";
import { hasSubItems, type CanopNavbarItem } from "./navigation";

export interface NavbarOverflowListProps {
  label: string;
  items: CanopNavbarItem[];
  activeHref?: string;
  onSelect: (href: string, event: MouseEvent) => void;
}

export function NavbarOverflowList({
  label,
  items,
  activeHref,
  onSelect,
}: NavbarOverflowListProps) {
  return (
    <Box
      role="group"
      aria-label={label}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}
    >
      {items.map((item, index) => (
        <Fragment key={item.href}>
          {separatesOverflowEntry(items, index) && <NavbarDivider />}
          {hasSubItems(item) ? (
            <NavbarPopoverSubItems item={item} activeHref={activeHref} onSelect={onSelect} />
          ) : (
            <NavbarPopoverLink entry={item} activeHref={activeHref} onSelect={onSelect} />
          )}
        </Fragment>
      ))}
    </Box>
  );
}
