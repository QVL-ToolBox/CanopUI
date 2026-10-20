export interface CanopMapTiles {
  url: string;
  glyphs: string;
  attribution: string;
  fontRegular: string;
  fontBold: string;
}

export const CANOP_MAP_TILES: CanopMapTiles = {
  url: "https://tiles.openfreemap.org/planet",
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  attribution: [
    '<a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a>',
    '<a href="https://www.openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a>',
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
  ].join(" · "),
  fontRegular: "Noto Sans Regular",
  fontBold: "Noto Sans Bold",
};

export const MAP_DEFAULT_ZOOM = 15;

export const MAP_DEFAULT_HEIGHT = "100%";

export function resolveMapTiles(tiles?: Partial<CanopMapTiles>): CanopMapTiles {
  return tiles ? { ...CANOP_MAP_TILES, ...tiles } : CANOP_MAP_TILES;
}
