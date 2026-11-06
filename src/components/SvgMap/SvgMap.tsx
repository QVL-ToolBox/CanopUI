import Box from "@mui/material/Box";
import { useCallback, useMemo, type KeyboardEvent, type ReactNode } from "react";
import {
  parseViewBox,
  useSvgMapViewport,
  viewBoxAspect,
  type UseSvgMapViewportResult,
} from "../../svgmap";
import { useTranslation } from "../../i18n";
import { hoverOrKeyboardFocus, withoutFocusRing } from "../../interaction";
import { SvgMapControls } from "./SvgMapControls";
import { useSvgMapGestures } from "./useSvgMapGestures";

export interface CanopSvgMapRegion {
  id: string;
  path: string;
  name?: string;
  ariaLabel?: string;
}

export interface CanopSvgMapProps {
  viewBox: string;
  regions: readonly CanopSvgMapRegion[];
  fill?: (id: string) => string;
  stroke?: string;
  onSelect?: (id: string) => void;
  selectable?: boolean;
  viewport?: UseSvgMapViewportResult;
  maxZoom?: number;
  maxWidth?: string;
  maxHeight?: string;
  controls?: boolean;
  tapTolerance?: number;
  wheel?: boolean;
  ariaLabel?: string;
  overlay?: ReactNode;
}

const DEFAULT_FILL = "var(--canop-palette-background-paper)";
const DEFAULT_STROKE = "var(--canop-palette-divider)";

const ASPECT_PRECISION = 10000;

function widthUnderHeight(viewBox: string, maxHeight?: string): string | undefined {
  if (!maxHeight) return undefined;
  const overview = parseViewBox(viewBox);
  if (!overview) return undefined;
  const aspect = Math.round(viewBoxAspect(overview) * ASPECT_PRECISION) / ASPECT_PRECISION;
  return `calc(${maxHeight} * ${aspect})`;
}

function inlineBound(maxWidth?: string, underHeight?: string): string | undefined {
  if (maxWidth && underHeight) return `min(${maxWidth}, ${underHeight})`;
  return maxWidth ?? underHeight;
}

export function SvgMap({
  viewBox,
  regions,
  fill,
  stroke = DEFAULT_STROKE,
  onSelect,
  selectable = false,
  viewport: controlledViewport,
  maxZoom = 9,
  maxWidth,
  maxHeight,
  controls = true,
  tapTolerance,
  wheel = true,
  ariaLabel,
  overlay,
}: CanopSvgMapProps) {
  const { t } = useTranslation();
  const maxInlineSize = useMemo(
    () => inlineBound(maxWidth, widthUnderHeight(viewBox, maxHeight)),
    [maxHeight, maxWidth, viewBox],
  );
  const ownViewport = useSvgMapViewport({ viewBox, maxZoom });
  const viewport = controlledViewport ?? ownViewport;

  const { onPointerDown, isDragging, attach } = useSvgMapGestures({
    viewport,
    tapTolerance,
    wheel,
  });

  const selectUnlessEndingADrag = useCallback(
    (id: string) => {
      if (isDragging()) return;
      onSelect?.(id);
    },
    [isDragging, onSelect],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<SVGPathElement>, id: string) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onSelect?.(id);
    },
    [onSelect],
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        ...(maxInlineSize ? { maxWidth: maxInlineSize, marginInline: "auto" } : {}),
      }}
    >
      <Box
        component="svg"
        ref={attach}
        viewBox={viewport.viewBox}
        onPointerDown={onPointerDown}
        role={selectable ? "group" : "img"}
        aria-label={ariaLabel ?? t("canop.svgMap.label")}
        sx={{
          display: "block",
          width: "100%",
          height: "auto",
          touchAction: "none",
          userSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        {regions.map((region) => (
          <Box
            component="path"
            key={region.id}
            ref={(element: SVGPathElement | null) => viewport.registerRegion(region.id, element)}
            d={region.path}
            role={selectable ? "button" : undefined}
            tabIndex={selectable ? 0 : undefined}
            aria-label={selectable ? (region.ariaLabel ?? region.name ?? region.id) : undefined}
            onClick={selectable ? () => selectUnlessEndingADrag(region.id) : undefined}
            onKeyDown={selectable ? (event) => onKeyDown(event, region.id) : undefined}
            sx={{
              fill: fill?.(region.id) ?? DEFAULT_FILL,
              stroke,
              strokeWidth: 0.4,
              vectorEffect: "non-scaling-stroke",
              transition: "fill 0.15s",
              ...(selectable
                ? {
                    cursor: "pointer",
                    ...withoutFocusRing,
                    [hoverOrKeyboardFocus()]: { filter: "brightness(0.92)" },
                  }
                : {}),
            }}
          >
            {region.name ? <title>{region.name}</title> : null}
          </Box>
        ))}
      </Box>
      {(controls || overlay) && (
        <Box
          sx={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "flex-end",
          }}
        >
          {controls && <SvgMapControls viewport={viewport} />}
          {overlay}
        </Box>
      )}
    </Box>
  );
}
