import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { squircleSurface } from "../../squircle";
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
        component="main"
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
            ...squircleSurface({
              radius: "var(--canop-radius-xl)",
              background: "var(--canop-palette-primary-main)",
              shadow: "var(--canop-drop-shadow-e3)",
              position: "fixed",
            }),
            color: "primary.contrastText",
          }}
        >
          {sidebarWidget}
        </Box>
      )}

      <NavbarMobileBar items={items} activeHref={activeHref} onNavigate={onNavigate} />
    </Box>
  );
}
