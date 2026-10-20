import type { CanopBreakpoint } from "../../tokens";

/**
 * Le nombre de colonnes d'une `BentoGrid`.
 *
 * Un nombre se lit « une colonne en `xs`, ce nombre dès `sm` » : la mosaïque
 * s'empile toujours sur téléphone. Un objet fixe un nombre par point de
 * rupture ; les points omis héritent du palier inférieur, et `xs` vaut 1 s'il
 * n'est pas donné. Jamais de grille automatique : contrairement à
 * `CanopCardGridColumns`, le nombre de colonnes est toujours connu.
 */
export type CanopBentoColumns = number | Partial<Record<CanopBreakpoint, number>>;

export type CanopBentoSpan = number | Partial<Record<CanopBreakpoint, number>>;

export type BentoCounts = Record<CanopBreakpoint, number>;

export type BentoResponsiveValue = Record<CanopBreakpoint, string>;

export const DEFAULT_BENTO_COLUMNS: CanopBentoColumns = { sm: 2, md: 3 };

function whole(count: number): number {
  return Math.max(1, Math.round(count));
}

function cascade(stated: Partial<Record<CanopBreakpoint, number>>): BentoCounts {
  const xs = whole(stated.xs ?? 1);
  const sm = whole(stated.sm ?? xs);
  const md = whole(stated.md ?? sm);
  const lg = whole(stated.lg ?? md);
  return { xs, sm, md, lg };
}

export function resolveBentoColumns(columns: CanopBentoColumns): BentoCounts {
  return cascade(typeof columns === "number" ? { sm: columns } : columns);
}

export function resolveBentoSpan(span: CanopBentoSpan): BentoCounts {
  return cascade(typeof span === "number" ? { xs: span } : span);
}

function perBreakpoint(format: (breakpoint: CanopBreakpoint) => string): BentoResponsiveValue {
  return { xs: format("xs"), sm: format("sm"), md: format("md"), lg: format("lg") };
}

export function bentoTemplate(columns: BentoCounts): BentoResponsiveValue {
  return perBreakpoint((breakpoint) => `repeat(${columns[breakpoint]}, minmax(0, 1fr))`);
}

export function bentoColumnPlacement(
  columns: BentoCounts,
  span: BentoCounts,
): BentoResponsiveValue {
  return perBreakpoint((breakpoint) => `span ${Math.min(span[breakpoint], columns[breakpoint])}`);
}

export function bentoRowPlacement(
  columns: BentoCounts,
  rowSpan: BentoCounts,
): BentoResponsiveValue {
  return perBreakpoint(
    (breakpoint) => `span ${columns[breakpoint] === 1 ? 1 : rowSpan[breakpoint]}`,
  );
}
