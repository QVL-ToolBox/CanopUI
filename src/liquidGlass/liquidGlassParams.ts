/** Réglages d'une recette de verre liquide. */
export interface CanopLiquidGlassParams {
  /** Flou du fond, en rem. */
  blur: number;
  /** Facteur de `saturate()` du fond (1 : neutre). */
  saturation: number;
  /** Voile de `surface.base`, en % (0-100). */
  veil: number;
  /** Teinte de `primary.light`, en % (0-100) ; `accent.light` en reçoit 80 %. */
  tint: number;
  /** Largeur du biseau réfractant, en rem. */
  bevel: number;
  /** Amplitude maximale de la réfraction, en px (`scale` de `feDisplacementMap`). */
  displacement: number;
  /** Dispersion chromatique, ratio 0-1 (0 : aucune). */
  dispersion: number;
  /** Intensité du liseré spéculaire, ratio 0-1. */
  specular: number;
  /** Intensité du reflet supérieur, ratio 0-1. */
  reflection: number;
  /** Intensité de l'ombre interne, ratio 0-1. */
  innerShadow: number;
}
