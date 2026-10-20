import Box from "@mui/material/Box";
import { squircleClip } from "../../squircle";
import { tokens } from "../../tokens";
import { MapFallback } from "./MapFallback";
import { MapMarkers, type CanopMapMarker } from "./MapMarkers";
import type { CanopMapPoiClass } from "./mapIcons";
import type { CanopMapBoundaries, CanopMapBoundary, CanopMapPoi } from "./mapStyle";
import { MAP_DEFAULT_HEIGHT, MAP_DEFAULT_ZOOM, type CanopMapTiles } from "./mapTiles";
import { useCanopMap, type CanopMapGestures, type CanopMapStyleMode } from "./useCanopMap";

export type {
  CanopMapMarker,
  CanopMapStyleMode,
  CanopMapGestures,
  CanopMapPoi,
  CanopMapPoiClass,
  CanopMapBoundaries,
  CanopMapBoundary,
};

export type CanopMapElevation = "none" | "sm" | "md" | "lg";

export interface CanopMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: CanopMapMarker[];
  onMapClick?: (lat: number, lng: number) => void;
  height?: number | string;
  styleMode?: CanopMapStyleMode;
  gestures?: CanopMapGestures;
  poi?: CanopMapPoi;
  boundaries?: CanopMapBoundaries;
  tiles?: Partial<CanopMapTiles>;
  border?: boolean;
  elevation?: CanopMapElevation;
  radius?: string;
  ariaLabel?: string;
}

const dropShadowByElevation: Record<CanopMapElevation, string | undefined> = {
  none: undefined,
  sm: "var(--canop-drop-shadow-e1)",
  md: "var(--canop-drop-shadow-e2)",
  lg: "var(--canop-drop-shadow-e3)",
};

export function Map({
  center,
  zoom = MAP_DEFAULT_ZOOM,
  markers = [],
  onMapClick,
  height = MAP_DEFAULT_HEIGHT,
  styleMode = "auto",
  gestures = "cooperative",
  poi = true,
  boundaries = true,
  tiles,
  border = false,
  elevation = "none",
  radius,
  ariaLabel,
}: CanopMapProps) {
  const { containerRef, map, supported } = useCanopMap({
    center,
    zoom,
    styleMode,
    gestures,
    poi,
    boundaries,
    tiles,
    onMapClick,
  });

  const framed = border || elevation !== "none";
  const frameRadius = radius ?? (framed ? tokens.radius.md : "0");
  const frameWidth = border ? tokens.squircle.borderWidth : "0rem";
  const shadow = dropShadowByElevation[elevation];

  const surface = supported ? (
    <Box
      ref={containerRef}
      {...(ariaLabel ? { role: "region", "aria-label": ariaLabel } : {})}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      {map ? <MapMarkers map={map} markers={markers} /> : null}
    </Box>
  ) : (
    <MapFallback center={center} zoom={zoom} height="100%" />
  );

  return (
    <Box
      sx={[
        {
          height: height,
          width: "100%",
        },
        shadow ? { filter: shadow } : false,
      ]}
    >
      <Box
        sx={{
          height: "100%",
          width: "100%",
          padding: frameWidth,
          ...squircleClip(frameRadius),
          backgroundColor: border ? "divider" : "transparent",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={[
            {
              height: "100%",
              width: "100%",
            },
            border ? squircleClip(`calc(${frameRadius} - ${frameWidth})`) : false,
          ]}
        >
          {surface}
        </Box>
      </Box>
    </Box>
  );
}
