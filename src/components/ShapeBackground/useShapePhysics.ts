import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "../../motion";
import {
  stepShapeBodies,
  syncShapeBodies,
  type ContainerSize,
  type ShapeBody,
  type ShapeMeasurement,
} from "./floating";

const MAX_FRAME_SECONDS = 0.05;

export interface UseShapePhysicsParams {
  containerRef: RefObject<HTMLDivElement | null>;
  animated: boolean;
  count: number;
}

export interface UseShapePhysicsResult {
  registerItem: (index: number) => (element: HTMLDivElement | null) => void;
}

export function useShapePhysics({
  containerRef,
  animated,
  count,
}: UseShapePhysicsParams): UseShapePhysicsResult {
  const reducedMotion = useReducedMotion();
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodiesRef = useRef<ShapeBody[]>([]);

  const registerItem = useCallback(
    (index: number) => (element: HTMLDivElement | null) => {
      itemRefs.current[index] = element;
    },
    [],
  );

  const enabled = animated && !reducedMotion;

  useEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container || typeof window.requestAnimationFrame !== "function") return;

    const items = itemRefs.current;
    let frame = 0;
    let previousTime = 0;
    let size: ContainerSize = { width: 0, height: 0 };

    const measure = () => {
      const rect = container.getBoundingClientRect();
      size = { width: rect.width, height: rect.height };
      const measurements: ShapeMeasurement[] = [];
      for (let index = 0; index < count; index++) {
        const element = items[index];
        const width = element?.offsetWidth ?? 0;
        const height = element?.offsetHeight ?? 0;
        measurements[index] = {
          homeX: element ? element.offsetLeft + width / 2 : size.width / 2,
          homeY: element ? element.offsetTop + height / 2 : size.height / 2,
          radius: Math.min(width, height) / 2,
        };
      }
      bodiesRef.current = syncShapeBodies(bodiesRef.current, measurements, size);
    };

    measure();

    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(container);

    const step = (time: number) => {
      if (previousTime === 0) previousTime = time;
      const deltaSeconds = Math.min((time - previousTime) / 1000, MAX_FRAME_SECONDS);
      previousTime = time;

      const bodies = bodiesRef.current;
      stepShapeBodies(bodies, size, deltaSeconds);

      for (let index = 0; index < bodies.length; index++) {
        const element = items[index];
        if (!element) continue;
        const body = bodies[index];
        element.style.transform = `translate3d(${body.x - body.homeX}px, ${body.y - body.homeY}px, 0)`;
      }

      frame = window.requestAnimationFrame(step);
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      items.forEach((element) => {
        if (element) element.style.transform = "";
      });
    };
  }, [containerRef, enabled, count]);

  return { registerItem };
}
