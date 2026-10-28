import type { TooltipProps } from "@mui/material/Tooltip";
import { useContext } from "react";
import {
  NavbarTileTooltipContext,
  type NavbarTileTooltipTransition,
} from "./navbarTileTooltipContext";

export interface UseNavbarTileTooltipResult {
  enabled: boolean;
  transition: NavbarTileTooltipTransition;
}

export function useNavbarTileTooltip(
  placement?: TooltipProps["placement"],
): UseNavbarTileTooltipResult {
  const { hoverCapable, transition } = useContext(NavbarTileTooltipContext);

  return { enabled: Boolean(placement) && hoverCapable, transition };
}
