import { NavbarTileItem } from "./NavbarTileItem";
import { type CanopNavbarItem } from "./navigation";

export interface NavbarRailItemProps {
  item: CanopNavbarItem;
  activeHref?: string;
  onNavigate?: (href: string) => void;
}

export function NavbarRailItem({ item, activeHref, onNavigate }: NavbarRailItemProps) {
  return (
    <NavbarTileItem
      item={item}
      activeHref={activeHref}
      onNavigate={onNavigate}
      tooltipPlacement="right"
      popoverAnchorOrigin={{ vertical: "center", horizontal: "right" }}
      popoverTransformOrigin={{ vertical: "center", horizontal: "left" }}
      popoverOffset={{ marginLeft: "0.5rem" }}
    />
  );
}
