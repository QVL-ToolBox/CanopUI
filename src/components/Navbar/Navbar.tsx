import type { ReactNode } from "react";
import { NavbarMobileLayout } from "./NavbarMobileLayout";
import { NavbarRail } from "./NavbarRail";
import { NavbarSidebar } from "./NavbarSidebar";
import { useNavbarMode } from "./useNavbarMode";
import { type CanopNavbarItem } from "./navigation";
import { type CanopNavbarTitleLevel } from "./navbarTitle";

export type { CanopNavbarItem } from "./navigation";
export type { CanopNavbarTitleLevel } from "./navbarTitle";

export type CanopMobileFooterPlacement = "floating" | "settings";

export interface CanopNavbarProps {
  items: CanopNavbarItem[];
  title?: string;
  titleLevel?: CanopNavbarTitleLevel;
  activeHref?: string;
  onNavigate?: (href: string) => void;
  userName?: string;
  onLogout?: () => void;
  footer?: ReactNode;
  settingsFooter?: ReactNode;
  sidebarWidget?: ReactNode;
  actions?: ReactNode;
  infoHref?: string;
  supportHref?: string;
  height?: string;
  mobileFooterPlacement?: CanopMobileFooterPlacement;
  children: ReactNode;
}

export function Navbar({
  items,
  title,
  titleLevel,
  activeHref,
  onNavigate,
  userName,
  onLogout,
  footer,
  settingsFooter,
  sidebarWidget,
  actions,
  infoHref,
  supportHref,
  height = "100dvh",
  mobileFooterPlacement = "floating",
  children,
}: CanopNavbarProps) {
  const mode = useNavbarMode();

  if (mode === "mobile") {
    const footerInSettings = mobileFooterPlacement === "settings";
    const settingsMenuFooter = settingsFooter ?? (footerInSettings ? footer : undefined);
    return (
      <NavbarMobileLayout
        height={height}
        items={items}
        activeHref={activeHref}
        onNavigate={onNavigate}
        onLogout={onLogout}
        settingsFooter={settingsMenuFooter}
        infoHref={infoHref}
        supportHref={supportHref}
        sidebarWidget={sidebarWidget}
        actions={actions}
      >
        {children}
      </NavbarMobileLayout>
    );
  }

  if (mode === "tablet") {
    return (
      <NavbarRail
        height={height}
        items={items}
        activeHref={activeHref}
        onNavigate={onNavigate}
        userName={userName}
        onLogout={onLogout}
        actions={actions}
      >
        {children}
      </NavbarRail>
    );
  }

  return (
    <NavbarSidebar
      height={height}
      items={items}
      title={title}
      titleLevel={titleLevel}
      activeHref={activeHref}
      onNavigate={onNavigate}
      userName={userName}
      onLogout={onLogout}
      sidebarWidget={sidebarWidget}
      actions={actions}
    >
      {children}
    </NavbarSidebar>
  );
}
