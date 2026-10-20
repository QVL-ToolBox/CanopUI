const HEX_COURT = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i;
const HEX_LONG = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

/** Seuil de luminance percue au-dela duquel une couleur porte du texte fonce. */
export const LIGHT_COLOR_THRESHOLD = 0.62;

export interface CanopRgb {
  red: number;
  green: number;
  blue: number;
}

/**
 * Decompose une couleur hexadecimale, en trois ou six chiffres, avec ou sans
 * diese. Renvoie `null` sur toute autre forme -- un nom CSS, un `rgb()`, une
 * chaine vide -- plutot que de deviner : une couleur mal lue donnerait un texte
 * illisible sans que rien ne le signale.
 */
export function parseHexColor(hex: string): CanopRgb | null {
  const court = HEX_COURT.exec(hex.trim());
  if (court) {
    const [, r, g, b] = court;
    return {
      red: parseInt(r + r, 16),
      green: parseInt(g + g, 16),
      blue: parseInt(b + b, 16),
    };
  }
  const long = HEX_LONG.exec(hex.trim());
  if (!long) return null;
  const [, r, g, b] = long;
  return { red: parseInt(r, 16), green: parseInt(g, 16), blue: parseInt(b, 16) };
}

/**
 * Luminance **percue**, entre 0 et 1, par la ponderation historique
 * `0,299 / 0,587 / 0,114`.
 *
 * Ce n'est pas la luminance relative de WCAG, qui lineariserait chaque canal :
 * celle-ci suit la sensibilite de l'oeil et se compare bien mieux a un seuil
 * unique, ce qui est exactement l'usage ici. Pour un rapport de contraste
 * chiffre, c'est la formule de WCAG qu'il faudrait.
 */
export function perceivedLuminance(hex: string): number | null {
  const rgb = parseHexColor(hex);
  if (!rgb) return null;
  return (0.299 * rgb.red + 0.587 * rgb.green + 0.114 * rgb.blue) / 255;
}

/**
 * Vrai lorsque la couleur est claire, donc qu'elle doit porter du texte fonce.
 *
 * Une couleur illisible renvoie `false`, soit du texte clair : sur un fond
 * inconnu, c'est le choix le moins risque, la plupart des couleurs de marque
 * etant sombres.
 */
export function isLightColor(hex: string): boolean {
  const luminance = perceivedLuminance(hex);
  return luminance !== null && luminance > LIGHT_COLOR_THRESHOLD;
}

/**
 * Le jeton de couleur de texte a poser **sur** cette couleur.
 *
 * Renvoie directement la variable CSS, et non un booleen a interpreter :
 * c'etait le dernier morceau que chaque application refaisait a sa facon, en
 * choisissant parfois deux jetons differents pour la meme situation.
 */
export function contrastTextFor(hex: string): string {
  return isLightColor(hex)
    ? "var(--canop-palette-text-primary)"
    : "var(--canop-palette-background-default)";
}
