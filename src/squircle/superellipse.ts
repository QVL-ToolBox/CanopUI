import { squircle, type CanopSquircleShape } from "../tokens/squircle";

export interface CanopSuperellipseOptions {
  shape?: CanopSquircleShape;
  exponent?: number;
  segments?: number;
}

export function resolveExponent(options: CanopSuperellipseOptions = {}): number {
  return options.exponent ?? squircle.exponent[options.shape ?? "rectangle"];
}

export interface CanopSquircleCorners {
  topLeft?: string;
  topRight?: string;
  bottomRight?: string;
  bottomLeft?: string;
}

export type CanopSquircleRadius = string | CanopSquircleCorners;

export type CanopSuperellipsePoint = readonly [number, number];

const PRECISION = 4;

function round(value: number): number {
  return Number(value.toFixed(PRECISION));
}

export function superellipseCorner(
  exponent: number = squircle.exponent.rectangle,
  segments: number = squircle.segments,
): CanopSuperellipsePoint[] {
  if (exponent <= 0) throw new RangeError("L'exposant du squircle doit être strictement positif.");
  if (!Number.isInteger(segments) || segments < 1) {
    throw new RangeError("Le nombre de segments du squircle doit être un entier supérieur à zéro.");
  }

  const power = 2 / exponent;
  const points: CanopSuperellipsePoint[] = [];

  for (let step = 0; step <= segments; step += 1) {
    const angle = (Math.PI / 2) * (step / segments);
    points.push([round(1 - Math.cos(angle) ** power), round(1 - Math.sin(angle) ** power)]);
  }

  return points;
}

const ZERO_LENGTH = /^0[a-z%]*$/i;

function coordinate(ratio: number, radius: string, fromEnd: boolean): string {
  if (ZERO_LENGTH.test(radius.trim())) return fromEnd ? "100%" : "0%";
  if (ratio <= 0) return fromEnd ? "100%" : "0%";
  if (ratio >= 1) return fromEnd ? `calc(100% - ${radius})` : radius;
  const offset = `${radius} * ${ratio}`;
  return fromEnd ? `calc(100% - ${offset})` : `calc(${offset})`;
}

function clamp(radius: string): string {
  const trimmed = radius.trim();
  if (trimmed === "0" || trimmed.endsWith("%")) return trimmed;
  return `min(${trimmed}, 50%)`;
}

function resolveCorners(radius: CanopSquircleRadius): Required<CanopSquircleCorners> {
  if (typeof radius === "string") {
    const every = clamp(radius);
    return { topLeft: every, topRight: every, bottomRight: every, bottomLeft: every };
  }
  return {
    topLeft: clamp(radius.topLeft ?? "0"),
    topRight: clamp(radius.topRight ?? "0"),
    bottomRight: clamp(radius.bottomRight ?? "0"),
    bottomLeft: clamp(radius.bottomLeft ?? "0"),
  };
}

type Place = (ratio: number, radius: string, fromEnd: boolean) => string;

function coordinateInset(ratio: number, radius: string, inset: string, fromEnd: boolean): string {
  if (ZERO_LENGTH.test(radius.trim()) || ratio <= 0) {
    return fromEnd ? `calc(100% - ${inset})` : inset;
  }
  if (ratio >= 1) {
    return fromEnd ? `calc(100% - ${inset} - ${radius})` : `calc(${inset} + ${radius})`;
  }
  return fromEnd
    ? `calc(100% - ${inset} - ${radius} * ${ratio})`
    : `calc(${inset} + ${radius} * ${ratio})`;
}

function contour(
  corners: Required<CanopSquircleCorners>,
  corner: CanopSuperellipsePoint[],
  place: Place,
): string[] {
  const reversed = [...corner].reverse();
  return [
    ...corner.map(
      ([u, v]) => `${place(u, corners.topLeft, false)} ${place(v, corners.topLeft, false)}`,
    ),
    ...reversed.map(
      ([u, v]) => `${place(u, corners.topRight, true)} ${place(v, corners.topRight, false)}`,
    ),
    ...corner.map(
      ([u, v]) => `${place(u, corners.bottomRight, true)} ${place(v, corners.bottomRight, true)}`,
    ),
    ...reversed.map(
      ([u, v]) => `${place(u, corners.bottomLeft, false)} ${place(v, corners.bottomLeft, true)}`,
    ),
  ];
}

export function squircleClipPath(
  radius: CanopSquircleRadius,
  options: CanopSuperellipseOptions = {},
): string {
  const corner = superellipseCorner(resolveExponent(options), options.segments);
  return `polygon(${contour(resolveCorners(radius), corner, coordinate).join(", ")})`;
}

export function squircleRingPath(
  radius: CanopSquircleRadius,
  width: string,
  options: CanopSuperellipseOptions = {},
): string {
  const corner = superellipseCorner(resolveExponent(options), options.segments);
  const outer = contour(resolveCorners(radius), corner, coordinate);
  const inner = contour(
    resolveCorners(insetRadius(radius, width)),
    corner,
    (ratio, corners, fromEnd) => coordinateInset(ratio, corners, width, fromEnd),
  );

  const points = [...outer, outer[0], inner[0], ...inner.slice(1).reverse(), inner[0]];

  return `polygon(${points.join(", ")})`;
}

function insetOne(radius: string, inset: string): string {
  const trimmed = radius.trim();
  if (trimmed === "0" || trimmed.endsWith("%")) return trimmed;
  return `calc(${trimmed} - ${inset})`;
}

export function insetRadius(radius: CanopSquircleRadius, inset: string): CanopSquircleRadius {
  if (typeof radius === "string") return insetOne(radius, inset);
  return {
    topLeft: insetOne(radius.topLeft ?? "0", inset),
    topRight: insetOne(radius.topRight ?? "0", inset),
    bottomRight: insetOne(radius.bottomRight ?? "0", inset),
    bottomLeft: insetOne(radius.bottomLeft ?? "0", inset),
  };
}

export function squirclePath(
  width: number,
  height: number,
  radius: number,
  options: CanopSuperellipseOptions = {},
): string {
  const bounded = Math.max(0, Math.min(radius, width / 2, height / 2));
  const corner = superellipseCorner(resolveExponent(options), options.segments);
  const reversed = [...corner].reverse();

  const points: string[] = [
    ...corner.map(([u, v]) => [u * bounded, v * bounded] as const),
    ...reversed.map(([u, v]) => [width - u * bounded, v * bounded] as const),
    ...corner.map(([u, v]) => [width - u * bounded, height - v * bounded] as const),
    ...reversed.map(([u, v]) => [u * bounded, height - v * bounded] as const),
  ].map(([x, y]) => `${round(x)} ${round(y)}`);

  return `M ${points.join(" L ")} Z`;
}
