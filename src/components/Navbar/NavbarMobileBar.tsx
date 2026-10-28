import Box from "@mui/material/Box";
import { useTranslation } from "../../i18n";
import { SlidingIndicatorGroup } from "../../motion/SlidingIndicatorGroup";
import { type CanopNavbarItem } from "./navigation";
import { NavbarMobileItem } from "./NavbarMobileItem";
import { NavbarMobileMore } from "./NavbarMobileMore";
import { NAVBAR_MOBILE_BAR_GAP } from "./navbarOverflow";
import {
  NAVBAR_MOBILE_BAR_LEFT,
  NAVBAR_MOBILE_BAR_MAX_WIDTH,
  NAVBAR_MOBILE_BAR_OFFSET,
  NAVBAR_MOBILE_BAR_PADDING_X,
  NAVBAR_MOBILE_BAR_PADDING_Y,
  NAVBAR_MOBILE_BAR_RIGHT,
} from "./navbarStyles";
import { navbarFloatingSurfaceSx } from "./navbarSurface";
import { NavbarTileTooltipProvider } from "./NavbarTileTooltipProvider";
import { useNavbarMobileOverflow } from "./useNavbarMobileOverflow";

export interface NavbarMobileBarProps {
  items: CanopNavbarItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
}

export function NavbarMobileBar({ items, activeHref, onNavigate }: NavbarMobileBarProps) {
  const { t } = useTranslation();
  const { barRef, visible, overflow, overflowActive } = useNavbarMobileOverflow(items, activeHref);

  return (
    <Box
      ref={barRef}
      component="nav"
      aria-label={t("canop.navbar.navigation")}
      sx={{
        bottom: NAVBAR_MOBILE_BAR_OFFSET,
        left: NAVBAR_MOBILE_BAR_LEFT,
        right: NAVBAR_MOBILE_BAR_RIGHT,
        zIndex: (theme) => theme.zIndex.appBar,
        boxSizing: "border-box",
        minWidth: 0,
        maxWidth: NAVBAR_MOBILE_BAR_MAX_WIDTH,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        gap: NAVBAR_MOBILE_BAR_GAP,
        paddingX: NAVBAR_MOBILE_BAR_PADDING_X,
        paddingY: NAVBAR_MOBILE_BAR_PADDING_Y,
        overflowX: "clip",
        "& > *": { flexShrink: 0 },
        ...navbarFloatingSurfaceSx({ position: "fixed" }),
      }}
    >
      <NavbarTileTooltipProvider>
        <SlidingIndicatorGroup>
          {visible.map((item) => (
            <NavbarMobileItem
              key={item.href}
              item={item}
              activeHref={activeHref}
              onNavigate={onNavigate}
            />
          ))}
          {overflow.length > 0 && (
            <NavbarMobileMore
              items={overflow}
              active={overflowActive}
              activeHref={activeHref}
              onNavigate={onNavigate}
            />
          )}
        </SlidingIndicatorGroup>
      </NavbarTileTooltipProvider>
    </Box>
  );
}
