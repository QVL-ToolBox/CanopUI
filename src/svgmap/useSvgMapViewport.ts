import { useCallback, useMemo, useRef, useState } from "react";
import {
  clampViewBox,
  fitViewBox,
  formatViewBox,
  isZoomed,
  panViewBox,
  parseViewBox,
  zoomViewBox,
  type CanopViewBox,
  type CanopViewBoxOrigin,
} from "./viewBox";

export interface UseSvgMapViewportOptions {
  /** Vue d'ensemble, au format de l'attribut `viewBox`. */
  viewBox: string;
  /** Zoom maximal, exprimé en facteur de la vue d'ensemble. */
  maxZoom?: number;
}

export interface UseSvgMapViewportResult {
  /** À poser sur le `<svg>`. */
  viewBox: string;
  box: CanopViewBox;
  base: CanopViewBox;
  zoomed: boolean;
  /** Un facteur inférieur à 1 rapproche, supérieur éloigne. */
  zoomBy: (factor: number, origin?: CanopViewBoxOrigin) => void;
  /** Déplacement exprimé en fraction de la taille de la vue. */
  panBy: (dxFraction: number, dyFraction: number) => void;
  /** Cadre sur un ensemble de régions, désignées par leur identifiant. */
  fitTo: (ids: readonly string[], options?: { padding?: number }) => void;
  reset: () => void;
  setBox: (next: CanopViewBox) => void;
  /**
   * Le composant y dépose ses tracés.
   *
   * La géométrie appartient à la vue : sans ce registre, `fitTo` n'aurait
   * aucun moyen de connaître l'étendue d'une région, et le cadrage devrait
   * être recalculé à la main dans chaque application.
   */
  registerRegion: (id: string, element: SVGGraphicsElement | null) => void;
}

const FALLBACK: CanopViewBox = { x: 0, y: 0, width: 100, height: 100 };
const DEFAULT_MAX_ZOOM = 9;
const CENTER: CanopViewBoxOrigin = { x: 0.5, y: 0.5 };

export function useSvgMapViewport({
  viewBox,
  maxZoom = DEFAULT_MAX_ZOOM,
}: UseSvgMapViewportOptions): UseSvgMapViewportResult {
  const base = useMemo(() => parseViewBox(viewBox) ?? FALLBACK, [viewBox]);
  const limits = useMemo(
    () => ({ minWidth: base.width / Math.max(maxZoom, 1) }),
    [base.width, maxZoom],
  );

  const [box, setBoxState] = useState<CanopViewBox>(base);
  const regions = useRef(new Map<string, SVGGraphicsElement>());

  const previousBaseRef = useRef(base);
  const svgOverviewChanged = previousBaseRef.current !== base;
  if (svgOverviewChanged) {
    previousBaseRef.current = base;
    setBoxState(base);
  }

  const setBox = useCallback(
    (next: CanopViewBox) => setBoxState(clampViewBox(next, base, limits)),
    [base, limits],
  );

  const zoomBy = useCallback(
    (factor: number, origin: CanopViewBoxOrigin = CENTER) =>
      setBoxState((current) => zoomViewBox(current, base, factor, origin, limits)),
    [base, limits],
  );

  const panBy = useCallback(
    (dxFraction: number, dyFraction: number) =>
      setBoxState((current) => panViewBox(current, base, dxFraction, dyFraction, limits)),
    [base, limits],
  );

  const reset = useCallback(() => setBoxState(base), [base]);

  const fitTo = useCallback(
    (ids: readonly string[], options: { padding?: number } = {}) => {
      const boxes: CanopViewBox[] = [];
      for (const id of ids) {
        const element = regions.current.get(id);
        if (!element) continue;
        const measured = element.getBBox();
        boxes.push({
          x: measured.x,
          y: measured.y,
          width: measured.width,
          height: measured.height,
        });
      }
      const noRegionKnown = boxes.length === 0;
      if (noRegionKnown) return;
      setBoxState(fitViewBox(boxes, base, { ...options, minWidth: limits.minWidth }));
    },
    [base, limits.minWidth],
  );

  const registerRegion = useCallback((id: string, element: SVGGraphicsElement | null) => {
    if (element) regions.current.set(id, element);
    else regions.current.delete(id);
  }, []);

  return {
    viewBox: formatViewBox(box),
    box,
    base,
    zoomed: isZoomed(box, base),
    zoomBy,
    panBy,
    fitTo,
    reset,
    setBox,
    registerRegion,
  };
}
