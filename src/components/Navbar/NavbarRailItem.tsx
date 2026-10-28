import { NavbarTileItem } from "./NavbarTileItem";
import { RAIL_TILE_PLACEMENT } from "./navbarTilePlacement";
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
      placement={RAIL_TILE_PLACEMENT}
    />
  );
}
