import { useCallback, useId, useState } from "react";
import { isModestDevice } from "../motion/modestDevice";
import { resolveExponent } from "../squircle/superellipse";
import { lengthToPixels, remToPixels } from "./cssLength";
import { sameDisplacementGeometry, type DisplacementMapGeometry } from "./displacementMap";
import { useDisplacementMap } from "./useDisplacementMap";
import { useElementMeasure } from "./useElementMeasure";
import { useRefractionSupport } from "./useRefractionSupport";

/** Filtre SVG de réfraction prêt à poser via `LiquidGlassLayers`. */
export interface CanopRefractionFilter {
  /** Id du `<filter>`, à référencer en `url(#id)` dans le `backdrop-filter`. */
  id: string;
  /** Carte de déplacement en data URL PNG. */
  map: string;
  /** Largeur de l'élément mesuré, en px. */
  width: number;
  /** Hauteur de l'élément mesuré, en px. */
  height: number;
  /** Amplitude maximale du déplacement (`scale` de `feDisplacementMap`), en px. */
  displacement: number;
  /** Dispersion chromatique, ratio 0-1 (0 : aucune). */
  dispersion: number;
}

export interface UseRefractionFilterOptions {
  /** Active la mesure et le filtre ; sans support Chromium, le filtre reste `null`. */
  enabled: boolean;
  /** Rayon des coins : longueur CSS en rem, px ou `var(--…)`. */
  radius: string;
  /** Largeur du biseau réfractant, en rem. */
  bevel: number;
  /** Amplitude maximale du déplacement, en px. */
  displacement: number;
  /** Dispersion chromatique, ratio 0-1. */
  dispersion: number;
}

export interface UseRefractionFilterResult<T extends HTMLElement> {
  /** Ref à poser sur l'élément dont la taille porte le filtre ; `undefined` si désactivé. */
  ref: ((element: T | null) => void) | undefined;
  /** Filtre prêt, ou `null` tant qu'il n'est pas mesuré ou hors Chromium. */
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
