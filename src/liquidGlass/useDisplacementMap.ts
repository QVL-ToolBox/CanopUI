import { useEffect, useState } from "react";
import { whenIdle } from "../motion/whenIdle";
import {
  cachedDisplacementMap,
  createDisplacementMap,
  displacementMapKey,
  type DisplacementMapGeometry,
} from "./displacementMap";

const PAINT_BUDGET = { timeout: 500, fallbackDelay: 1 };

interface PaintedMap {
  key: string;
  map: string;
}

function readyMap(key: string | null, painted: PaintedMap | null): string | null {
  if (key === null) return null;
  return painted?.key === key ? painted.map : cachedDisplacementMap(key);
}

export function useDisplacementMap(geometry: DisplacementMapGeometry | null): string | null {
  const [painted, setPainted] = useState<PaintedMap | null>(null);
  const key = geometry ? displacementMapKey(geometry) : null;
  const ready = readyMap(key, painted);

  useEffect(() => {
    if (!geometry || key === null || ready !== null) return;
    return whenIdle(() => {
      const map = createDisplacementMap(geometry);
      if (map !== null) setPainted({ key, map });
    }, PAINT_BUDGET);
  }, [geometry, key, ready]);

  if (key === null) return null;
  return ready ?? painted?.map ?? null;
}
