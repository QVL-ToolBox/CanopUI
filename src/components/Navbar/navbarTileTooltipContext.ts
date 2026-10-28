import { createContext } from "react";

export interface NavbarTileTooltipTransition {
  timeout?: number;
}

export interface NavbarTileTooltipSettings {
  hoverCapable: boolean;
  transition: NavbarTileTooltipTransition;
}

export const NavbarTileTooltipContext = createContext<NavbarTileTooltipSettings>({
  hoverCapable: true,
  transition: {},
});
