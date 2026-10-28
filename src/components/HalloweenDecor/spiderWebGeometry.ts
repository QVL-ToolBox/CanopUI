interface SpiderWebStrand {
  id: string;
  d: string;
}

export interface SpiderWebDew {
  id: string;
  cx: string;
  cy: string;
}

interface SpiderWebGeometry {
  strands: SpiderWebStrand[];
  dew: SpiderWebDew[];
}

interface Point {
  x: number;
  y: number;
}

const SPOKE_ANGLES = [0, 12, 25, 38, 52, 65, 78, 90];
const RING_RADII = [12, 22, 33, 45, 58, 72, 87, 100];
const RING_SAG = 0.88;
const OUTER_RADIUS = RING_RADII[RING_RADII.length - 1];
const DEW_SPOTS: readonly (readonly [number, number])[] = [
  [2, 3],
  [4, 5],
  [3, 1],
  [6, 4],
];

function at(radius: number, degrees: number): Point {
  const radians = (degrees * Math.PI) / 180;
  return { x: radius * Math.cos(radians), y: radius * Math.sin(radians) };
}

function format(point: Point): string {
  return `${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
}

function spoke(angle: number, index: number): SpiderWebStrand {
  return { id: `spoke-${index}`, d: `M0 0L${format(at(OUTER_RADIUS, angle))}` };
}

function ringSegment(radius: number, from: number, to: number): string {
  const control = at(radius * RING_SAG, (from + to) / 2);
  return `Q${format(control)} ${format(at(radius, to))}`;
}

function ring(radius: number, index: number): SpiderWebStrand {
  const segments = SPOKE_ANGLES.slice(1).map((angle, step) =>
    ringSegment(radius, SPOKE_ANGLES[step], angle),
  );
  return {
    id: `ring-${index}`,
    d: `M${format(at(radius, SPOKE_ANGLES[0]))}${segments.join("")}`,
  };
}

function dew([ringIndex, spokeIndex]: readonly [number, number], index: number): SpiderWebDew {
  const point = at(RING_RADII[ringIndex], SPOKE_ANGLES[spokeIndex]);
  return { id: `dew-${index}`, cx: point.x.toFixed(2), cy: point.y.toFixed(2) };
}

const SPIDER_HOLD = at(RING_RADII[1], SPOKE_ANGLES[5]);

export const spiderHoldShare = {
  across: SPIDER_HOLD.x / OUTER_RADIUS,
  down: SPIDER_HOLD.y / OUTER_RADIUS,
};

export const spiderWebGeometry: SpiderWebGeometry = {
  strands: [...SPOKE_ANGLES.map(spoke), ...RING_RADII.map(ring)],
  dew: DEW_SPOTS.map(dew),
};
