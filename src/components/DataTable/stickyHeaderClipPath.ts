import { resolveExponent, superellipseCorner, type CanopSuperellipsePoint } from "../../squircle";
import { rowSurfaceGeometry, rowSurfaceRadius, scrollShadowGutter } from "./rowSurface";

export interface StickyHeaderViewport {
  headerHeight: number;
  scrollbarWidth: number;
}

type Toward = "+" | "-";

interface CornerAnchor {
  x: string;
  towardX: Toward;
  y: string;
  towardY: Toward;
}

const ANTIALIAS_OVERLAP = "0.0625rem";
const BEYOND_EDGE = "100vmax";
const FAR_BEFORE = `-${BEYOND_EDGE}`;
const FAR_AFTER = `calc(100% + ${BEYOND_EDGE})`;
const HEADER_INSET = `calc(${scrollShadowGutter} + ${ANTIALIAS_OVERLAP})`;

function along(origin: string, toward: Toward, radius: string, ratio: number): string {
  return ratio === 0 ? origin : `calc(${origin} ${toward} ${radius} * ${ratio})`;
}

export function stickyHeaderClipPath({
  headerHeight,
  scrollbarWidth,
}: StickyHeaderViewport): string {
  const corner = superellipseCorner(resolveExponent(rowSurfaceGeometry));
  const reversed = [...corner].reverse();
  const contentEdge = `calc(100% - ${scrollbarWidth}px)`;
  const headerRight = `calc(${contentEdge} - ${HEADER_INSET})`;
  const scrollbarEdge = `calc(100% - max(${scrollbarWidth}px, ${scrollShadowGutter}))`;
  const top = "0%";
  const bottom = `calc(${headerHeight}px - ${ANTIALIAS_OVERLAP})`;
  const radiusX = rowSurfaceRadius;
  const radiusY = `min(${rowSurfaceRadius}, ${headerHeight / 2}px)`;

  const curve = (points: CanopSuperellipsePoint[], anchor: CornerAnchor) =>
    points.map(([u, v]) => {
      const x = along(anchor.x, anchor.towardX, radiusX, u);
      const y = along(anchor.y, anchor.towardY, radiusY, v);
      return `${x} ${y}`;
    });

  const points = [
    ...curve(corner, { x: HEADER_INSET, towardX: "+", y: top, towardY: "+" }),
    ...curve(reversed, { x: headerRight, towardX: "-", y: top, towardY: "+" }),
    ...curve(corner, { x: headerRight, towardX: "-", y: bottom, towardY: "-" }),
    `${scrollbarEdge} ${bottom}`,
    `${scrollbarEdge} ${FAR_BEFORE}`,
    `${FAR_AFTER} ${FAR_BEFORE}`,
    `${FAR_AFTER} ${FAR_AFTER}`,
    `${FAR_BEFORE} ${FAR_AFTER}`,
    `${FAR_BEFORE} ${bottom}`,
    ...curve(reversed, { x: HEADER_INSET, towardX: "+", y: bottom, towardY: "-" }),
  ];

  return `polygon(${points.join(", ")})`;
}
