import award from "../../assets/icons/award-solid.svg?raw";
import bag from "../../assets/icons/bag-solid.svg?raw";
import bank from "../../assets/icons/bank-solid.svg?raw";
import book from "../../assets/icons/book-solid.svg?raw";
import briefcase from "../../assets/icons/briefcase.svg?raw";
import car from "../../assets/icons/car.svg?raw";
import card from "../../assets/icons/card-solid.svg?raw";
import coffee from "../../assets/icons/coffee.svg?raw";
import envelope from "../../assets/icons/envelope-solid.svg?raw";
import glass from "../../assets/icons/glass.svg?raw";
import iceCube from "../../assets/icons/ice-cube.svg?raw";
import key from "../../assets/icons/key-solid.svg?raw";
import medkit from "../../assets/icons/medkit-solid.svg?raw";
import music from "../../assets/icons/music-solid.svg?raw";
import palette from "../../assets/icons/palette-solid.svg?raw";
import shield from "../../assets/icons/shield-solid.svg?raw";
import shoppingCart from "../../assets/icons/shopping-cart-solid.svg?raw";
import star from "../../assets/icons/star-solid.svg?raw";
import tag from "../../assets/icons/tag.svg?raw";
import university from "../../assets/icons/university-solid.svg?raw";
import utensils from "../../assets/icons/utensils.svg?raw";
import wine from "../../assets/icons/wine.svg?raw";

export const POI_IMAGE_PREFIX = "canop-poi-";

export const POI_ICON_SIZE = 36;

export const POI_PIXEL_RATIO = 2;

export const mapPoiIcons = {
  alcohol_shop: wine,
  art_gallery: palette,
  atm: card,
  attraction: star,
  bar: glass,
  beer: glass,
  cafe: coffee,
  car: car,
  castle: shield,
  clothing_store: tag,
  college: university,
  fast_food: utensils,
  grocery: shoppingCart,
  hospital: medkit,
  ice_cream: iceCube,
  library: book,
  lodging: key,
  music: music,
  office: briefcase,
  post: envelope,
  school: university,
  shop: bag,
  stadium: award,
  town_hall: bank,
} as const;

export type CanopMapPoiClass = keyof typeof mapPoiIcons;

export const mapPoiClasses = Object.keys(mapPoiIcons) as CanopMapPoiClass[];

export function poiImagePrefix(mode: string): string {
  return `${POI_IMAGE_PREFIX}${mode}-`;
}

export function poiImageId(mode: string, poiClass: CanopMapPoiClass | string): string {
  return `${poiImagePrefix(mode)}${poiClass}`;
}

export function poiClassFromImageId(id: string): CanopMapPoiClass | undefined {
  if (!id.startsWith(POI_IMAGE_PREFIX)) return undefined;
  const poiClass = id.slice(POI_IMAGE_PREFIX.length).split("-").slice(1).join("-");
  return poiClass in mapPoiIcons ? (poiClass as CanopMapPoiClass) : undefined;
}

export function poiModeFromImageId(id: string): string | undefined {
  if (!id.startsWith(POI_IMAGE_PREFIX)) return undefined;
  return id.slice(POI_IMAGE_PREFIX.length).split("-")[0] || undefined;
}

export interface PoiImageColors {
  glyph: string;
  badge: string;
  edge: string;
  shade: string;
}

export function poiImageSource(markup: string, colors: PoiImageColors, pixels: number): string {
  const body = markup
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .split("currentColor")
    .join(colors.glyph);
  const badge = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${pixels}" height="${pixels}" viewBox="0 0 32 32">`,
    `<filter id="s" x="-40%" y="-40%" width="180%" height="180%">`,
    `<feDropShadow dx="0" dy="1" stdDeviation="1.2" flood-color="${colors.shade}" flood-opacity="1"/>`,
    `</filter>`,
    `<circle cx="16" cy="16" r="13" fill="${colors.badge}" stroke="${colors.edge}" stroke-width="1.25" filter="url(#s)"/>`,
    `<g transform="translate(7 7) scale(0.75)">${body}</g>`,
    `</svg>`,
  ].join("");
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(badge)}`;
}
