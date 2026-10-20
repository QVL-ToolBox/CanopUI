import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { tokens, type CanopBreakpoint } from "../../tokens";

export type CanopCardGridGap = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Un nombre de colonnes fixe, ou un nombre par point de rupture.
 *
 * Les points de rupture omis héritent du palier inférieur, et `xs` retombe sur
 * la grille automatique : `{ md: 4 }` se lit « autant de colonnes que la
 * largeur le permet en dessous de `md`, quatre au-delà ».
 */
export type CanopCardGridColumns = number | Partial<Record<CanopBreakpoint, number>>;

export interface CanopCardGridProps {
  minItemWidth?: string;
  /**
   * Le nombre de colonnes, imposé.
   *
   * Sans lui la grille est en `auto-fit` et son nombre de colonnes n'est
   * **connu de personne** : ni du composant, ni de l'appelant, qui ne peut que
   * le déduire d'un calcul largeur ÷ `minItemWidth` — faux dès qu'une gouttière,
   * un panneau latéral ou une barre de défilement change la largeur du
   * conteneur. C'est ainsi qu'on obtient quatre tuiles rendues en `3 + 1`, une
   * rangée orpheline qu'aucune valeur de `minItemWidth` ne ferme sur toutes les
   * tailles d'écran à la fois.
   *
   * `minmax(0, 1fr)` et non `1fr` : la base `auto` d'un `1fr` nu prend le
   * `min-content` de la piste pour plancher, donc un libellé long élargit sa
   * colonne et les colonnes cessent d'être égales — précisément ce qu'on vient
   * demander.
   */
  columns?: CanopCardGridColumns;
  gap?: CanopCardGridGap;
  children: ReactNode;
}

const ORDERED_BREAKPOINTS: readonly CanopBreakpoint[] = ["xs", "sm", "md", "lg"];

function autoTemplate(minItemWidth: string): string {
  return `repeat(auto-fit, minmax(min(${minItemWidth}, 100%), 1fr))`;
}

function fixedTemplate(count: number): string {
  return `repeat(${count}, minmax(0, 1fr))`;
}

function resolveTemplate(
  columns: CanopCardGridColumns | undefined,
  minItemWidth: string,
): string | Partial<Record<CanopBreakpoint, string>> {
  if (columns === undefined) return autoTemplate(minItemWidth);
  if (typeof columns === "number") return fixedTemplate(columns);

  const template: Partial<Record<CanopBreakpoint, string>> = { xs: autoTemplate(minItemWidth) };
  for (const breakpoint of ORDERED_BREAKPOINTS) {
    const count = columns[breakpoint];
    if (count !== undefined) template[breakpoint] = fixedTemplate(count);
  }
  return template;
}

const SHRINKABLE_ITEMS = { "& > *": { minWidth: 0 } };

export function CardGrid({
  minItemWidth = "16rem",
  columns,
  gap = "md",
  children,
}: CanopCardGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: tokens.spacing[gap],
        gridTemplateColumns: resolveTemplate(columns, minItemWidth),
        ...SHRINKABLE_ITEMS,
      }}
    >
      {children}
    </Box>
  );
}
