import useMediaQuery from "@mui/material/useMediaQuery";
import { useMemo } from "react";
import { useReducedMotion } from "../../motion";
import type { NavbarTileTooltipSettings } from "./navbarTileTooltipContext";

const TOUCH_ONLY_QUERY = "(hover: none)";

export function useNavbarTileTooltipSettings(): NavbarTileTooltipSettings {
  const touchOnly = useMediaQuery(TOUCH_ONLY_QUERY, { noSsr: true });
  const reducedMotion = useReducedMotion();

  return useMemo(
    () => ({ hoverCapable: !touchOnly, transition: reducedMotion ? { timeout: 0 } : {} }),
    [touchOnly, reducedMotion],
  );
}
