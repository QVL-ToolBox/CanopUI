import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { useTranslation } from "../../i18n";
import { SlidingIndicatorGroup } from "../../motion/SlidingIndicatorGroup";
import { type CanopMainElement } from "../_shared/mainElement";
import { NavbarRailItem } from "./NavbarRailItem";
import { NavbarRailSettings } from "./NavbarRailSettings";
import { NavbarTileTooltipProvider } from "./NavbarTileTooltipProvider";
import { NavbarUtilities } from "./NavbarUtilities";
import { useNavbarUtilitiesInset } from "./useNavbarUtilitiesInset";
import { reservePageTopRight } from "../_shared/pageTopRightInset";
import { navbarPanelSx } from "./navbarSurface";
import { NAVBAR_TEXT } from "./navbarTone";
import { type CanopNavbarItem } from "./navigation";

export interface NavbarRailProps {
  items: CanopNavbarItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
  userName?: string;
  onLogout?: () => void;
  sidebarWidget?: ReactNode;
  actions?: ReactNode;
  height: string;
  mainElement: CanopMainElement;
  children: ReactNode;
}

const RAIL_WIDTH = "4.5rem";

export function NavbarRail({
  items,
  activeHref,
  onNavigate,
  userName,
  onLogout,
  sidebarWidget,
  actions,
  height,
  mainElement,
  children,
}: NavbarRailProps) {
  const { t } = useTranslation();
  const utilitiesInset = useNavbarUtilitiesInset(Boolean(actions));

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        height: height,
        overflow: "hidden",
        ...reservePageTopRight(utilitiesInset),
      }}
    >
      <Box
        component="nav"
        aria-label={t("canop.navbar.navigation")}
        sx={{
          width: RAIL_WIDTH,
          flexShrink: 0,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          paddingY: "1.25rem",
          paddingX: "0.5rem",
          color: NAVBAR_TEXT,
          ...navbarPanelSx,
          overflowY: "auto",
        }}
      >
        <NavbarTileTooltipProvider>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.125rem",
            }}
          >
            <SlidingIndicatorGroup>
              {items.map((item) => (
                <NavbarRailItem
                  key={item.href}
                  item={item}
                  activeHref={activeHref}
                  onNavigate={onNavigate}
                />
              ))}
            </SlidingIndicatorGroup>
          </Box>

          {(userName || onLogout || sidebarWidget) && (
            <NavbarRailSettings userName={userName} onLogout={onLogout} widget={sidebarWidget} />
          )}
        </NavbarTileTooltipProvider>
      </Box>

      <Box
        component={mainElement}
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>

      <NavbarUtilities actions={actions} />
    </Box>
  );
}
