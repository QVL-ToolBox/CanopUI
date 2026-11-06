import { useCallback, useId, useState } from "react";
import { isModestDevice } from "../motion/modestDevice";
import { resolveExponent } from "../squircle/superellipse";
import { lengthToPixels, remToPixels } from "./cssLength";
import { sameDisplacementGeometry, type DisplacementMapGeometry } from "./displacementMap";
import { useDisplacementMap } from "./useDisplacementMap";
import { useElementMeasure } from "./useElementMeasure";
import { useRefractionSupport } from "./useRefractionSupport";

export interface CanopRefractionFilter {
  id: string;
  map: string;
  width: number;
  height: number;
  displacement: number;
  dispersion: number;
}

export interface UseRefractionFilterOptions {
  enabled: boolean;
  radius: string;
  bevel: number;
  displacement: number;
  dispersion: number;
}

export interface UseRefractionFilterResult<T extends HTMLElement> {
  ref: ((element: T | null) => void) | undefined;
  filter: CanopRefractionFilter | null;
}

const UNSAFE_ID_CHARACTERS = /[^a-zA-Z0-9_-]/g;

function hasArea(geometry: DisplacementMapGeometry | null): geometry is DisplacementMapGeometry {
  return geometry !== null && geometry.width > 0 && geometry.height > 0;
}

export function useRefractionFilter<T extends HTMLElement = HTMLDivElement>({
  enabled,
  radius,
  bevel,
  displacement,
  dispersion,
}: UseRefractionFilterOptions): UseRefractionFilterResult<T> {
  const [modestDevice] = useState(isModestDevice);
  const supported = useRefractionSupport(enabled) === "refraction" && !modestDevice;
  const id = `canop-liquid-${useId().replace(UNSAFE_ID_CHARACTERS, "")}`;

  const measure = useCallback(
    (element: T): DisplacementMapGeometry => ({
      width: element.offsetWidth,
      height: element.offsetHeight,
      radius: lengthToPixels(element, radius),
      bevel: remToPixels(bevel),
      exponent: resolveExponent(),
    }),
    [radius, bevel],
  );

  const { ref, measurement: geometry } = useElementMeasure<T, DisplacementMapGeometry>({
    enabled: supported,
    measure,
    isSame: sameDisplacementGeometry,
  });

  const map = useDisplacementMap(supported && hasArea(geometry) ? geometry : null);

  const filter =
    map && geometry
      ? { id, map, width: geometry.width, height: geometry.height, displacement, dispersion }
      : null;

  return { ref, filter };
}
