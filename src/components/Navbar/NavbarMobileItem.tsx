import { NavbarTileItem } from "./NavbarTileItem";
import { MOBILE_TILE_PLACEMENT } from "./navbarTilePlacement";
import { type CanopNavbarItem } from "./navigation";

export interface NavbarMobileItemProps {
  item: CanopNavbarItem;
  activeHref?: string;
  onNavigate?: (href: string) => void;
}

export function NavbarMobileItem({ item, activeHref, onNavigate }: NavbarMobileItemProps) {
  return (
    <NavbarTileItem
      item={item}
      activeHref={activeHref}
      onNavigate={onNavigate}
      placement={MOBILE_TILE_PLACEMENT}
    />
  );
}
