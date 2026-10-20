import type {
  ExpressionSpecification,
  FilterSpecification,
  LayerSpecification,
  StyleSpecification,
} from "maplibre-gl";
import { canopMapPalette, type CanopMapPalette } from "./mapPalette";
import { mapPoiClasses, mapPoiIcons, poiImagePrefix, type CanopMapPoiClass } from "./mapIcons";
import type { CanopMapTiles } from "./mapTiles";
import type { CanopThemeMode } from "../../theme";

const SOURCE = "canop";

const NAME_FIELD = ["coalesce", ["get", "name:fr"], ["get", "name"]] as ExpressionSpecification;

const ROAD_CAPS = { "line-cap": "round", "line-join": "round" } as const;

function classes(...values: string[]): FilterSpecification {
  return ["in", ["get", "class"], ["literal", values]] as FilterSpecification;
}

function zoomWidth(...stops: [number, number][]): ExpressionSpecification {
  return [
    "interpolate",
    ["exponential", 1.4],
    ["zoom"],
    ...stops.flat(),
  ] as unknown as ExpressionSpecification;
}

function fadeIn(from: number, to: number, opacity: number): ExpressionSpecification {
  return ["interpolate", ["linear"], ["zoom"], from, 0, to, opacity] as ExpressionSpecification;
}

export type CanopMapPoi = boolean | CanopMapPoiClass[];

export type CanopMapBoundary = "country" | "region" | "department";

export type CanopMapBoundaries = boolean | CanopMapBoundary[];

export interface CanopMapStyleOptions {
  poi?: CanopMapPoi;
  boundaries?: CanopMapBoundaries;
}

interface BoundaryLevel {
  level: number;
  minzoom: number;
  width: [number, number][];
  opacity: number;
}

const boundaryLevels: Record<CanopMapBoundary, BoundaryLevel> = {
  country: {
    level: 2,
    minzoom: 1,
    width: [
      [2, 0.7],
      [8, 1.8],
    ],
    opacity: 1,
  },
  region: {
    level: 4,
    minzoom: 4,
    width: [
      [4, 0.5],
      [10, 1.3],
    ],
    opacity: 0.8,
  },
  department: {
    level: 6,
    minzoom: 7,
    width: [
      [7, 0.4],
      [11, 1],
    ],
    opacity: 0.6,
  },
};

const DEFAULT_BOUNDARIES: CanopMapBoundary[] = ["country", "region"];

function poiSelection(poi: CanopMapPoi | undefined): CanopMapPoiClass[] {
  if (poi === false) return [];
  if (poi === undefined || poi === true) return mapPoiClasses;
  return poi.filter((poiClass) => poiClass in mapPoiIcons);
}

function boundarySelection(boundaries: CanopMapBoundaries | undefined): CanopMapBoundary[] {
  if (boundaries === false) return [];
  if (boundaries === undefined || boundaries === true) return DEFAULT_BOUNDARIES;
  return boundaries.filter((boundary) => boundary in boundaryLevels);
}

function boundaryLayer(name: CanopMapBoundary, color: CanopMapPalette): LayerSpecification {
  const boundary = boundaryLevels[name];
  return {
    id: `canop-boundary-${name}`,
    type: "line",
    source: SOURCE,
    "source-layer": "boundary",
    minzoom: boundary.minzoom,
    filter: ["==", ["get", "admin_level"], boundary.level],
    paint: {
      "line-color": color.boundary,
      "line-opacity": boundary.opacity,
      "line-width": zoomWidth(...boundary.width),
    },
  } as LayerSpecification;
}

function poiLayer(
  mode: CanopThemeMode,
  color: CanopMapPalette,
  tiles: CanopMapTiles,
  selection: CanopMapPoiClass[],
): LayerSpecification {
  return {
    id: "canop-poi",
    type: "symbol",
    source: SOURCE,
    "source-layer": "poi",
    minzoom: 15,
    filter: ["in", ["get", "class"], ["literal", selection]],
    layout: {
      "icon-image": ["concat", poiImagePrefix(mode), ["get", "class"]],
      "icon-optional": false,
      "text-optional": true,
      "text-field": NAME_FIELD,
      "text-font": [tiles.fontRegular],
      "text-size": 10,
      "text-anchor": "top",
      "text-offset": [0, 1.1],
      "text-max-width": 7,
    },
    paint: {
      "text-color": color.labelMuted,
      "text-halo-color": color.labelHalo,
      "text-halo-width": 1.4,
      "icon-opacity": fadeIn(15, 15.6, 1),
    },
  } as LayerSpecification;
}

export function buildCanopMapStyle(
  mode: CanopThemeMode,
  tiles: CanopMapTiles,
  options: CanopMapStyleOptions = {},
): StyleSpecification {
  const color = canopMapPalette(mode);
  const poiSelected = poiSelection(options.poi);
  const boundarySelected = boundarySelection(options.boundaries);

  return {
    version: 8,
    name: `CanopUI ${mode}`,
    glyphs: tiles.glyphs,
    sources: {
      [SOURCE]: {
        type: "vector",
        url: tiles.url,
        attribution: tiles.attribution,
      },
    },
    layers: [
      {
        id: "canop-land",
        type: "background",
        paint: { "background-color": color.land },
      },
      {
        id: "canop-green",
        type: "fill",
        source: SOURCE,
        "source-layer": "landcover",
        filter: classes("wood", "grass", "scrub", "farmland"),
        paint: { "fill-color": color.green },
      },
      {
        id: "canop-park",
        type: "fill",
        source: SOURCE,
        "source-layer": "park",
        paint: { "fill-color": color.greenStrong },
      },
      {
        id: "canop-water",
        type: "fill",
        source: SOURCE,
        "source-layer": "water",
        filter: ["!=", ["get", "brunnel"], "tunnel"],
        paint: { "fill-color": color.water },
      },
      {
        id: "canop-water-edge",
        type: "line",
        source: SOURCE,
        "source-layer": "water",
        minzoom: 8,
        paint: {
          "line-color": color.waterEdge,
          "line-width": zoomWidth([8, 0.4], [14, 1.4]),
        },
      },
      {
        id: "canop-waterway",
        type: "line",
        source: SOURCE,
        "source-layer": "waterway",
        minzoom: 8,
        layout: ROAD_CAPS,
        paint: {
          "line-color": color.water,
          "line-width": zoomWidth([8, 0.8], [16, 4]),
        },
      },
      {
        id: "canop-building-shade",
        type: "fill",
        source: SOURCE,
        "source-layer": "building",
        minzoom: 15,
        paint: {
          "fill-color": color.buildingShade,
          "fill-translate": [1.5, 2],
          "fill-opacity": fadeIn(15, 16, 1),
        },
      },
      {
        id: "canop-building",
        type: "fill",
        source: SOURCE,
        "source-layer": "building",
        minzoom: 15,
        paint: {
          "fill-color": color.building,
          "fill-opacity": fadeIn(15, 16, 1),
        },
      },
      {
        id: "canop-road-shade",
        type: "line",
        source: SOURCE,
        "source-layer": "transportation",
        minzoom: 9,
        filter: classes("motorway", "trunk", "primary", "secondary"),
        layout: ROAD_CAPS,
        paint: {
          "line-color": color.roadShade,
          "line-blur": 3,
          "line-translate": [0, 1.5],
          "line-width": zoomWidth([9, 3], [12, 7.5], [16, 19]),
        },
      },
      {
        id: "canop-road-casing",
        type: "line",
        source: SOURCE,
        "source-layer": "transportation",
        minzoom: 6,
        filter: classes("motorway", "trunk", "primary", "secondary"),
        layout: ROAD_CAPS,
        paint: {
          "line-color": color.roadCasing,
          "line-width": zoomWidth([6, 2.2], [12, 6], [16, 16]),
        },
      },
      {
        id: "canop-road-minor-casing",
        type: "line",
        source: SOURCE,
        "source-layer": "transportation",
        minzoom: 13,
        filter: classes("minor", "service", "tertiary"),
        layout: ROAD_CAPS,
        paint: {
          "line-color": color.roadCasing,
          "line-width": zoomWidth([13, 1.6], [16, 6], [19, 18]),
        },
      },
      {
        id: "canop-road-minor",
        type: "line",
        source: SOURCE,
        "source-layer": "transportation",
        minzoom: 13,
        filter: classes("minor", "service", "tertiary"),
        layout: ROAD_CAPS,
        paint: {
          "line-color": color.roadMinor,
          "line-width": zoomWidth([13, 1], [16, 4.4], [19, 15]),
        },
      },
      {
        id: "canop-road-major",
        type: "line",
        source: SOURCE,
        "source-layer": "transportation",
        minzoom: 7,
        filter: classes("trunk", "primary", "secondary"),
        layout: ROAD_CAPS,
        paint: {
          "line-color": color.roadMajor,
          "line-width": zoomWidth([7, 1.2], [12, 4], [16, 11]),
        },
      },
      {
        id: "canop-road-motorway",
        type: "line",
        source: SOURCE,
        "source-layer": "transportation",
        minzoom: 5,
        filter: classes("motorway"),
        layout: ROAD_CAPS,
        paint: {
          "line-color": color.roadMotorway,
          "line-width": zoomWidth([5, 1.2], [12, 4.6], [16, 13]),
        },
      },
      ...boundarySelected.map((boundary) => boundaryLayer(boundary, color)),
      {
        id: "canop-water-label",
        type: "symbol",
        source: SOURCE,
        "source-layer": "water_name",
        minzoom: 9,
        layout: {
          "symbol-placement": "line",
          "text-field": NAME_FIELD,
          "text-font": [tiles.fontRegular],
          "text-size": 11,
          "text-letter-spacing": 0.08,
        },
        paint: {
          "text-color": color.labelWater,
          "text-halo-color": color.water,
          "text-halo-width": 1,
        },
      },
      {
        id: "canop-road-label",
        type: "symbol",
        source: SOURCE,
        "source-layer": "transportation_name",
        minzoom: 14,
        layout: {
          "symbol-placement": "line",
          "text-field": NAME_FIELD,
          "text-font": [tiles.fontRegular],
          "text-size": 10,
        },
        paint: {
          "text-color": color.labelMuted,
          "text-halo-color": color.labelHalo,
          "text-halo-width": 1.4,
        },
      },
      ...(poiSelected.length > 0 ? [poiLayer(mode, color, tiles, poiSelected)] : []),
      {
        id: "canop-place-minor",
        type: "symbol",
        source: SOURCE,
        "source-layer": "place",
        minzoom: 10,
        filter: classes("village", "suburb", "neighbourhood", "hamlet"),
        layout: {
          "text-field": NAME_FIELD,
          "text-font": [tiles.fontRegular],
          "text-size": 11,
          "text-max-width": 8,
        },
        paint: {
          "text-color": color.labelMuted,
          "text-halo-color": color.labelHalo,
          "text-halo-width": 1.4,
        },
      },
      {
        id: "canop-place-major",
        type: "symbol",
        source: SOURCE,
        "source-layer": "place",
        filter: classes("city", "town"),
        layout: {
          "text-field": NAME_FIELD,
          "text-font": [tiles.fontBold],
          "text-size": ["match", ["get", "class"], "city", 15, 12],
          "text-max-width": 8,
          "text-letter-spacing": 0.02,
        },
        paint: {
          "text-color": color.label,
          "text-halo-color": color.labelHalo,
          "text-halo-width": 1.6,
        },
      },
    ],
  } as StyleSpecification;
}
