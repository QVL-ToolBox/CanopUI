export interface CanopViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanopViewBoxLimits {
  /** Largeur minimale, donc zoom maximal. */
  minWidth: number;
}

export interface CanopViewBoxOrigin {
  /** Position horizontale du point fixe, de 0 à 1 dans la vue courante. */
  x: number;
  /** Position verticale du point fixe, de 0 à 1 dans la vue courante. */
  y: number;
}

const NUMBER_SEPARATOR = /[\s,]+/;

/** Lit un attribut `viewBox`, avec des espaces ou des virgules. */
export function parseViewBox(value: string): CanopViewBox | null {
  const parts = value.trim().split(NUMBER_SEPARATOR).map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) return null;
  const [x, y, width, height] = parts;
  if (width <= 0 || height <= 0) return null;
  return { x, y, width, height };
}

export function formatViewBox(box: CanopViewBox): string {
  return `${box.x} ${box.y} ${box.width} ${box.height}`;
}

export function viewBoxAspect(box: CanopViewBox): number {
  return box.height === 0 ? 1 : box.width / box.height;
}

/**
 * Ramène une vue dans les limites de la vue d'ensemble.
 *
 * La hauteur est **déduite** de la largeur et du rapport de la vue d'ensemble,
 * jamais transportée : c'est ce qui garantit que la carte ne se déforme pas,
 * quel que soit le chemin par lequel on est arrivé là — pincement, molette,
 * cadrage sur une région.
 */
export function clampViewBox(
  box: CanopViewBox,
  base: CanopViewBox,
  limits: CanopViewBoxLimits,
): CanopViewBox {
  const aspect = viewBoxAspect(base);
  const width = Math.min(Math.max(box.width, limits.minWidth), base.width);
  const height = width / aspect;
  const x = Math.min(Math.max(box.x, base.x), base.x + base.width - width);
  const y = Math.min(Math.max(box.y, base.y), base.y + base.height - height);
  return { x, y, width, height };
}

/**
 * Zoome autour d'un point, qui ne bouge pas.
 *
 * Sans point fixe, la molette ramène toujours vers le centre et l'endroit
 * qu'on visait s'échappe : c'est la différence entre une carte qu'on explore
 * et une carte qu'on subit.
 */
export function zoomViewBox(
  box: CanopViewBox,
  base: CanopViewBox,
  factor: number,
  origin: CanopViewBoxOrigin,
  limits: CanopViewBoxLimits,
): CanopViewBox {
  const aspect = viewBoxAspect(base);
  const sceneX = box.x + origin.x * box.width;
  const sceneY = box.y + origin.y * box.height;
  const width = box.width * factor;
  const height = width / aspect;
  return clampViewBox(
    { x: sceneX - origin.x * width, y: sceneY - origin.y * height, width, height },
    base,
    limits,
  );
}

/**
 * Déplace la vue d'une fraction de sa propre taille.
 *
 * Les fractions viennent du déplacement du pointeur rapporté à la taille de
 * l'élément, ce qui rend le glissement **indépendant du niveau de zoom** :
 * un doigt qui parcourt la moitié de l'écran parcourt toujours la moitié de ce
 * qui est affiché.
 */
export function panViewBox(
  box: CanopViewBox,
  base: CanopViewBox,
  dxFraction: number,
  dyFraction: number,
  limits: CanopViewBoxLimits,
): CanopViewBox {
  return clampViewBox(
    { ...box, x: box.x - dxFraction * box.width, y: box.y - dyFraction * box.height },
    base,
    limits,
  );
}

export interface CanopFitOptions extends CanopViewBoxLimits {
  /** Marge autour de l'ensemble cadré. 1 colle aux bords, 1.25 laisse un quart. */
  padding?: number;
}

/**
 * Cadre un ensemble de rectangles, en gardant le rapport de la vue d'ensemble.
 *
 * La largeur retenue est la plus grande des deux dimensions ramenées au
 * rapport : cadrer sur la largeur seule couperait un ensemble plus haut que
 * large, ce qui est le cas de la plupart des groupes de régions.
 */
export function fitViewBox(
  boxes: readonly CanopViewBox[],
  base: CanopViewBox,
  options: CanopFitOptions,
): CanopViewBox {
  const { padding = 1.25, minWidth } = options;
  if (boxes.length === 0) return clampViewBox(base, base, { minWidth });

  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));

  const aspect = viewBoxAspect(base);
  const wanted = Math.max(right - left, (bottom - top) * aspect) * padding;
  const width = Math.min(Math.max(wanted, minWidth), base.width);
  const height = width / aspect;
  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;

  return clampViewBox({ x: centerX - width / 2, y: centerY - height / 2, width, height }, base, {
    minWidth,
  });
}

/** Vrai dès que la vue est plus serrée que la vue d'ensemble. */
export function isZoomed(box: CanopViewBox, base: CanopViewBox): boolean {
  return box.width < base.width - Number.EPSILON * base.width - 1e-6;
}
