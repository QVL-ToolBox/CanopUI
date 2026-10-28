import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { type CanopMainElement } from "../_shared/mainElement";
import { reservePageBottom } from "../_shared/pageBottomInset";
import { reservePageTopRight } from "../_shared/pageTopRightInset";
import { SettingsMenu } from "../SettingsMenu";
import { NavbarMobileActionDock } from "./NavbarMobileActionDock";
import { NavbarMobileBar } from "./NavbarMobileBar";
import {
  NAVBAR_MOBILE_BAR_SPACE,
  NAVBAR_MOBILE_SETTINGS_FOOTPRINT,
  NAVBAR_MOBILE_WIDGET_OFFSET,
} from "./navbarStyles";
import { navbarFloatingSurfaceSx } from "./navbarSurface";
import { NAVBAR_BG_BOTTOM, NAVBAR_TEXT } from "./navbarTone";
import { type CanopNavbarItem } from "./navigation";

export interface NavbarMobileLayoutProps {
  items: CanopNavbarItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
  settingsFooter?: ReactNode;
  infoHref?: string;
  supportHref?: string;
  sidebarWidget?: ReactNode;
  actions?: ReactNode;
  height: string;
  mainElement?: CanopMainElement;
  children: ReactNode;
}

export function NavbarMobileLayout({
  items,
  activeHref,
  onNavigate,
  onLogout,
  settingsFooter,
  infoHref,
  supportHref,
  sidebarWidget,
  actions,
  height,
  mainElement = "main",
  children,
}: NavbarMobileLayoutProps) {
  return (
    <Box
      sx={{
        height: height,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...reservePageTopRight(NAVBAR_MOBILE_SETTINGS_FOOTPRINT),
      }}
    >
      <SettingsMenu
        onLogout={onLogout}
        footer={settingsFooter}
        infoHref={infoHref}
        supportHref={supportHref}
      />

      {actions ? <NavbarMobileActionDock>{actions}</NavbarMobileActionDock> : null}

      <Box
        component={mainElement}
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          ...reservePageBottom(NAVBAR_MOBILE_BAR_SPACE),
        }}
      >
        {children}
      </Box>

      {sidebarWidget && (
        <Box
          sx={{
            bottom: NAVBAR_MOBILE_WIDGET_OFFSET,
            left: "1rem",
            right: "1rem",
            zIndex: (theme) => theme.zIndex.appBar,
            padding: "0.75rem 1rem",
            ...navbarFloatingSurfaceSx({ background: NAVBAR_BG_BOTTOM, position: "fixed" }),
            color: NAVBAR_TEXT,
          }}
        >
          {sidebarWidget}
        </Box>
      )}

      <NavbarMobileBar items={items} activeHref={activeHref} onNavigate={onNavigate} />
    </Box>
  );
}
