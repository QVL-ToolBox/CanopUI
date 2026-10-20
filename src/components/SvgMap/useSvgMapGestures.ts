import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import type { CanopViewBox } from "../../svgmap";
import type { UseSvgMapViewportResult } from "../../svgmap";

export interface UseSvgMapGesturesOptions {
  viewport: UseSvgMapViewportResult;
  /**
   * Déplacement, en pixels, au-delà duquel un contact devient un glissement.
   *
   * Sans ce seuil, tout déplacement de la carte finit par un clic sur la
   * région relâchée : on croit se déplacer et on répond.
   */
  tapTolerance?: number;
  /** Zoom à la molette. */
  wheel?: boolean;
  /** Pas de la molette. 1,15 avance d'environ 15 % par cran. */
  wheelStep?: number;
}

export interface UseSvgMapGesturesResult {
  onPointerDown: (event: ReactPointerEvent<SVGSVGElement>) => void;
  /** Vrai quand le contact courant a dépassé la tolérance. */
  isDragging: () => boolean;
  attach: (element: SVGSVGElement | null) => void;
}

interface Point {
  x: number;
  y: number;
}

interface PanStart {
  origin: Point;
  box: CanopViewBox;
}

interface PinchStart {
  distance: number;
  scene: Point;
  box: CanopViewBox;
}

const DEFAULT_TAP_TOLERANCE = 6;
const DEFAULT_WHEEL_STEP = 1.15;

export function useSvgMapGestures({
  viewport,
  tapTolerance = DEFAULT_TAP_TOLERANCE,
  wheel = true,
  wheelStep = DEFAULT_WHEEL_STEP,
}: UseSvgMapGesturesOptions): UseSvgMapGesturesResult {
  const latestViewportRef = useRef(viewport);
  latestViewportRef.current = viewport;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const pan = useRef<PanStart | null>(null);
  const pinch = useRef<PinchStart | null>(null);
  const dragged = useRef(false);

  const attach = useCallback((element: SVGSVGElement | null) => {
    svgRef.current = element;
  }, []);

  const fractionOf = useCallback((client: Point): Point | null => {
    const element = svgRef.current;
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    return { x: (client.x - rect.left) / rect.width, y: (client.y - rect.top) / rect.height };
  }, []);

  const startPan = useCallback((point: Point) => {
    pan.current = { origin: point, box: latestViewportRef.current.box };
  }, []);

  const startPinch = useCallback(() => {
    const points = [...pointers.current.values()];
    if (points.length < 2) return;
    const [first, second] = points;
    const middle = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
    const fraction = fractionOf(middle);
    if (!fraction) return;
    const box = latestViewportRef.current.box;
    pinch.current = {
      distance: Math.hypot(first.x - second.x, first.y - second.y),
      scene: { x: box.x + fraction.x * box.width, y: box.y + fraction.y * box.height },
      box,
    };
    pan.current = null;
  }, [fractionOf]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      dragged.current = false;
      if (pointers.current.size >= 2) startPinch();
      else startPan({ x: event.clientX, y: event.clientY });
    },
    [startPan, startPinch],
  );

  useEffect(() => {
    function onMove(event: PointerEvent) {
      if (!pointers.current.has(event.pointerId)) return;
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const element = svgRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const points = [...pointers.current.values()];

      if (points.length >= 2 && pinch.current) {
        const [first, second] = points;
        const distance = Math.hypot(first.x - second.x, first.y - second.y);
        const middle = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
        const fraction = {
          x: (middle.x - rect.left) / rect.width,
          y: (middle.y - rect.top) / rect.height,
        };
        const start = pinch.current;
        const width = (start.box.width * start.distance) / Math.max(distance, 1);
        const height = width / (start.box.width / start.box.height);
        dragged.current = true;
        latestViewportRef.current.setBox({
          x: start.scene.x - fraction.x * width,
          y: start.scene.y - fraction.y * height,
          width,
          height,
        });
        return;
      }

      if (points.length === 1 && pan.current) {
        const start = pan.current;
        const dx = event.clientX - start.origin.x;
        const dy = event.clientY - start.origin.y;
        if (Math.hypot(dx, dy) > tapTolerance) dragged.current = true;
        latestViewportRef.current.setBox({
          ...start.box,
          x: start.box.x - (dx / rect.width) * start.box.width,
          y: start.box.y - (dy / rect.height) * start.box.height,
        });
      }
    }

    function onRelease(event: PointerEvent) {
      pointers.current.delete(event.pointerId);
      if (pointers.current.size === 0) {
        pan.current = null;
        pinch.current = null;
        return;
      }
      if (pointers.current.size === 1) {
        pinch.current = null;
        const [fingerStillDownAfterPinch] = [...pointers.current.values()];
        startPan(fingerStillDownAfterPinch);
      }
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onRelease);
    window.addEventListener("pointercancel", onRelease);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
    };
  }, [startPan, tapTolerance]);

  useEffect(() => {
    const element = svgRef.current;
    if (!element || !wheel) return;

    function zoomInsteadOfScrollingPage(event: WheelEvent) {
      event.preventDefault();
      const rect = element!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      latestViewportRef.current.zoomBy(event.deltaY > 0 ? wheelStep : 1 / wheelStep, {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      });
    }

    element.addEventListener("wheel", zoomInsteadOfScrollingPage, { passive: false });
    return () => element.removeEventListener("wheel", zoomInsteadOfScrollingPage);
  }, [wheel, wheelStep]);

  const isDragging = useCallback(() => dragged.current, []);

  return { onPointerDown, isDragging, attach };
}
