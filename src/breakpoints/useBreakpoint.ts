import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../tokens";
import type { CanopBreakpoint } from "../tokens";

const RETRAIT_BORNE_HAUTE_EXCLUSIVE_REM = 0.01;

function valeur(borne: CanopBreakpoint): number {
  return tokens.breakpoints.values[borne];
}

export function useBreakpointDown(borne: CanopBreakpoint): boolean {
  return useMediaQuery(
    `(max-width: ${valeur(borne) - RETRAIT_BORNE_HAUTE_EXCLUSIVE_REM}${tokens.breakpoints.unit})`,
  );
}

export function useBreakpointUp(borne: CanopBreakpoint): boolean {
  return useMediaQuery(`(min-width: ${valeur(borne)}${tokens.breakpoints.unit})`);
}

export function useBreakpoint(): CanopBreakpoint {
  const lg = useBreakpointUp("lg");
  const md = useBreakpointUp("md");
  const sm = useBreakpointUp("sm");
  if (lg) return "lg";
  if (md) return "md";
  if (sm) return "sm";
  return "xs";
}
