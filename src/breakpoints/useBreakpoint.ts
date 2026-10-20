import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../tokens";
import type { CanopBreakpoint } from "../tokens";

const RETRAIT_BORNE_HAUTE_EXCLUSIVE_REM = 0.01;

function valeur(borne: CanopBreakpoint): number {
  return tokens.breakpoints.values[borne];
}

/**
 * Vrai lorsque la fenetre est **plus etroite** que le point de rupture.
 *
 * C'est la question que posent les composants qui basculent en disposition
 * compacte. Elle evite d'ecrire une requete media a la main dans un portail,
 * ou de la desynchroniser des bornes du theme -- les deux se sont produits.
 *
 * ```ts
 * const compact = useBreakpointDown("md");
 * ```
 */
export function useBreakpointDown(borne: CanopBreakpoint): boolean {
  return useMediaQuery(
    `(max-width: ${valeur(borne) - RETRAIT_BORNE_HAUTE_EXCLUSIVE_REM}${tokens.breakpoints.unit})`,
  );
}

/** Vrai lorsque la fenetre est **au moins aussi large** que le point de rupture. */
export function useBreakpointUp(borne: CanopBreakpoint): boolean {
  return useMediaQuery(`(min-width: ${valeur(borne)}${tokens.breakpoints.unit})`);
}

/**
 * Le point de rupture courant, du plus large satisfait au plus etroit.
 *
 * Utile lorsqu'une valeur depend de la taille par palier plutot que d'un seul
 * seuil, par exemple un nombre de colonnes.
 */
export function useBreakpoint(): CanopBreakpoint {
  const lg = useBreakpointUp("lg");
  const md = useBreakpointUp("md");
  const sm = useBreakpointUp("sm");
  if (lg) return "lg";
  if (md) return "md";
  if (sm) return "sm";
  return "xs";
}
