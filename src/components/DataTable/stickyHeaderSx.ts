import type { CSSObject } from "@mui/material/styles";
import { squircleSurface } from "../../squircle";
import {
  rowGap,
  rowSurfaceBackground,
  rowSurfaceDropShadowFollowingSquircle,
  rowSurfaceGeometry,
  rowSurfaceRadius,
} from "./rowSurface";
import { stickyHeaderClipPath, type StickyHeaderViewport } from "./stickyHeaderClipPath";

const SURFACE_LAYER = 1;
const CELL_LAYER = 2;

export function stickyHeaderRestOffset(hasInternalScroll: boolean): string {
  return hasInternalScroll ? "0rem" : rowGap;
}

export const stickyHeaderCellSx: CSSObject = {
  position: "sticky",
  top: 0,
  zIndex: CELL_LAYER,
  backgroundColor: "transparent",
};

export function stickyHeaderTableSx(hasInternalScroll: boolean): CSSObject {
  return hasInternalScroll ? { marginTop: `-${rowGap}` } : {};
}

export function stickyHeaderSurfaceSx(headerHeight: number, restOffset: string): CSSObject {
  return {
    ...squircleSurface({
      radius: rowSurfaceRadius,
      background: rowSurfaceBackground,
      shadow: rowSurfaceDropShadowFollowingSquircle,
      position: "sticky",
      ...rowSurfaceGeometry,
    }),
    top: 0,
    zIndex: SURFACE_LAYER,
    height: `${headerHeight}px`,
    marginTop: restOffset,
    marginBottom: `calc(-${headerHeight}px - ${rowGap})`,
  };
}

export function stickyHeaderViewportSx(viewport: StickyHeaderViewport): CSSObject {
  return {
    clipPath: stickyHeaderClipPath(viewport),
    scrollPaddingTop: `calc(${rowGap} + ${viewport.headerHeight}px)`,
  };
}
