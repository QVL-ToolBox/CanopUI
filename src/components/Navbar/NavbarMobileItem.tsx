import { NavbarTileItem } from "./NavbarTileItem";
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
      popoverAnchorOrigin={{ vertical: "top", horizontal: "center" }}
      popoverTransformOrigin={{ vertical: "bottom", horizontal: "center" }}
      popoverOffset={{ marginBottom: "0.75rem" }}
    />
  );
}
