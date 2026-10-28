import { NavbarPopoverSubItems } from "./NavbarPopoverSubItems";
import { NavbarTileButton } from "./NavbarTileButton";
import { NavbarTileLink } from "./NavbarTileLink";
import { NavbarTilePopover } from "./NavbarTilePopover";
import type { NavbarTilePlacement } from "./navbarTilePlacement";
import { hasSubItems, isBranchActive, type CanopNavbarItem } from "./navigation";
import { useNavbarPopover } from "./useNavbarPopover";

export interface NavbarTileItemProps {
  item: CanopNavbarItem;
  activeHref?: string;
  onNavigate?: (href: string) => void;
  placement: NavbarTilePlacement;
}

export function NavbarTileItem({ item, activeHref, onNavigate, placement }: NavbarTileItemProps) {
  const popover = useNavbarPopover(onNavigate);
  const active = isBranchActive(item, activeHref);

  if (!hasSubItems(item)) {
    return (
      <NavbarTileLink
        item={item}
        active={active}
        onNavigate={onNavigate}
        tooltipPlacement={placement.tooltip}
      />
    );
  }

  return (
    <>
      <NavbarTileButton
        label={item.label}
        icon={item.icon}
        active={active}
        popover={popover}
        tooltipPlacement={placement.tooltip}
        badge
      />
      <NavbarTilePopover popover={popover} placement={placement}>
        <NavbarPopoverSubItems item={item} activeHref={activeHref} onSelect={popover.select} />
      </NavbarTilePopover>
    </>
  );
}
