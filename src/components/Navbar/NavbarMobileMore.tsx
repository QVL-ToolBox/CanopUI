import { useTranslation } from "../../i18n";
import { NavbarOverflowList } from "./NavbarOverflowList";
import { NavbarTileButton } from "./NavbarTileButton";
import { NavbarTilePopover } from "./NavbarTilePopover";
import { MOBILE_TILE_PLACEMENT } from "./navbarTilePlacement";
import { type CanopNavbarItem } from "./navigation";
import { useNavbarPopover } from "./useNavbarPopover";

export interface NavbarMobileMoreProps {
  items: CanopNavbarItem[];
  active: boolean;
  activeHref?: string;
  onNavigate?: (href: string) => void;
}

export function NavbarMobileMore({ items, active, activeHref, onNavigate }: NavbarMobileMoreProps) {
  const { t } = useTranslation();
  const popover = useNavbarPopover(onNavigate);
  const label = t("canop.navbar.more");

  return (
    <>
      <NavbarTileButton
        label={label}
        icon="more"
        active={active}
        popover={popover}
        tooltipPlacement={MOBILE_TILE_PLACEMENT.tooltip}
      />
      <NavbarTilePopover popover={popover} placement={MOBILE_TILE_PLACEMENT}>
        <NavbarOverflowList
          label={label}
          items={items}
          activeHref={activeHref}
          onSelect={popover.select}
        />
      </NavbarTilePopover>
    </>
  );
}
