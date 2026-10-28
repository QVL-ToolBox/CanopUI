import type { ReactNode } from "react";
import { NavbarTileTooltipContext } from "./navbarTileTooltipContext";
import { useNavbarTileTooltipSettings } from "./useNavbarTileTooltipSettings";

export interface NavbarTileTooltipProviderProps {
  children: ReactNode;
}

export function NavbarTileTooltipProvider({ children }: NavbarTileTooltipProviderProps) {
  const settings = useNavbarTileTooltipSettings();

  return (
    <NavbarTileTooltipContext.Provider value={settings}>
      {children}
    </NavbarTileTooltipContext.Provider>
  );
}
