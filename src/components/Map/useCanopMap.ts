import { useEffect, useRef, useState } from "react";
import { Map as MaplibreMap, NavigationControl, type MapMouseEvent } from "maplibre-gl";
import { useTranslation } from "../../i18n";
import { useReducedMotion } from "../../motion";
import { useCanopTheme } from "../../theme";
import type { CanopThemeMode } from "../../theme";
import { buildCanopMapStyle, type CanopMapBoundaries, type CanopMapPoi } from "./mapStyle";
import { resolveMapTiles, type CanopMapTiles } from "./mapTiles";
import { canopMapPalette } from "./mapPalette";
import {
  POI_ICON_SIZE,
  POI_PIXEL_RATIO,
  mapPoiIcons,
  poiClassFromImageId,
  poiImageSource,
  poiModeFromImageId,
  type PoiImageColors,
} from "./mapIcons";
import { ensureMapWorkerUrl } from "./mapWorker";
import { supportsWebgl } from "./webglSupport";

export type CanopMapStyleMode = "auto" | CanopThemeMode;
export type CanopMapGestures = "cooperative" | "direct";

interface UseCanopMapParams {
  center: { lat: number; lng: number };
  zoom: number;
  styleMode: CanopMapStyleMode;
  gestures: CanopMapGestures;
  poi: CanopMapPoi;
  boundaries: CanopMapBoundaries;
  tiles?: Partial<CanopMapTiles>;
  onMapClick?: (lat: number, lng: number) => void;
}

interface UseCanopMapResult {
  containerRef: (node: HTMLDivElement | null) => void;
  map: MaplibreMap | null;
  mode: CanopThemeMode;
  supported: boolean;
}

const RECENTER_DURATION = 600;

function poiPalette(mode: CanopThemeMode): PoiImageColors {
  const color = canopMapPalette(mode);
  return {
    glyph: color.poiGlyph,
    badge: color.poiBadge,
    edge: color.poiBadgeEdge,
    shade: color.buildingShade,
  };
}

export function useCanopMap({
  center,
  zoom,
  styleMode,
  gestures,
  poi,
  boundaries,
  tiles,
  onMapClick,
}: UseCanopMapParams): UseCanopMapResult {
  const { resolvedMode } = useCanopTheme();
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const mode = styleMode === "auto" ? resolvedMode : styleMode;
  const tilesKey = tiles ? JSON.stringify(tiles) : "";
  const poiKey = Array.isArray(poi) ? poi.join(",") : String(poi);
  const boundariesKey = Array.isArray(boundaries) ? boundaries.join(",") : String(boundaries);

  const [supported] = useState(supportsWebgl);
  const [webglContextLostDuringUse, setWebglContextLostDuringUse] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<MaplibreMap | null>(null);

  const tilesRef = useRef(tiles);
  tilesRef.current = tiles;
  const gestureText = useRef({
    windows: t("canop.map.gestureWindows"),
    mac: t("canop.map.gestureMac"),
    touch: t("canop.map.gestureTouch"),
  });
  const initial = useRef({
    center,
    zoom,
    mode,
    tilesKey,
    gestures,
    poi,
    poiKey,
    boundaries,
    boundariesKey,
  });
  const appliedStyle = useRef(
    [
      initial.current.mode,
      initial.current.tilesKey,
      initial.current.poiKey,
      initial.current.boundariesKey,
    ].join("|"),
  );

  useEffect(() => {
    if (!container) return;
    ensureMapWorkerUrl();
    const start = initial.current;
    const help = gestureText.current;
    const instance = new MaplibreMap({
      container,
      style: buildCanopMapStyle(start.mode, resolveMapTiles(tilesRef.current), {
        poi: start.poi,
        boundaries: start.boundaries,
      }),
      center: [start.center.lng, start.center.lat],
      zoom: start.zoom,
      attributionControl: { compact: true },
      cooperativeGestures: start.gestures === "cooperative",
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      locale: {
        "CooperativeGesturesHandler.WindowsHelpText": help.windows,
        "CooperativeGesturesHandler.MacHelpText": help.mac,
        "CooperativeGesturesHandler.MobileHelpText": help.touch,
      },
    });
    instance.touchZoomRotate?.disableRotation();
    instance.addControl(new NavigationControl({ showCompass: false }), "top-right");
    instance.on("webglcontextlost", () => setWebglContextLostDuringUse(true));
    setMap(instance);
    return () => {
      instance.remove();
      setMap(null);
    };
  }, [container]);

  useEffect(() => {
    const key = [mode, tilesKey, poiKey, boundariesKey].join("|");
    if (!map || appliedStyle.current === key) return;
    appliedStyle.current = key;
    map.setStyle(buildCanopMapStyle(mode, resolveMapTiles(tilesRef.current), { poi, boundaries }));
  }, [map, mode, tilesKey, poiKey, boundariesKey, poi, boundaries]);

  useEffect(() => {
    if (!map) return;
    let disposed = false;
    const onImageMissing = (event: { id: string }) => {
      const poiClass = poiClassFromImageId(event.id);
      const poiMode = poiModeFromImageId(event.id);
      if (!poiClass || !poiMode || map.hasImage(event.id)) return;
      const pixels = POI_ICON_SIZE * POI_PIXEL_RATIO;
      const image = new Image(pixels, pixels);
      image.addEventListener("load", () => {
        if (disposed || map.hasImage(event.id)) return;
        map.addImage(event.id, image, { pixelRatio: POI_PIXEL_RATIO });
      });
      image.src = poiImageSource(
        mapPoiIcons[poiClass],
        poiPalette(poiMode === "dark" ? "dark" : "light"),
        pixels,
      );
    };
    map.on("styleimagemissing", onImageMissing);
    return () => {
      disposed = true;
      map.off("styleimagemissing", onImageMissing);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    map.easeTo({
      center: [center.lng, center.lat],
      zoom,
      duration: reducedMotion ? 0 : RECENTER_DURATION,
    });
  }, [map, center.lat, center.lng, zoom, reducedMotion]);

  useEffect(() => {
    if (!map || !onMapClick) return;
    const handler = (event: MapMouseEvent) => {
      onMapClick(event.lngLat.lat, event.lngLat.lng);
    };
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [map, onMapClick]);

  return {
    containerRef: setContainer,
    map,
    mode,
    supported: supported && !webglContextLostDuringUse,
  };
}
