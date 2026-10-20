import { clamp } from "../_shared/clamp";

export interface ContainerSize {
  width: number;
  height: number;
}

export interface ShapeMeasurement {
  homeX: number;
  homeY: number;
  radius: number;
}

export interface ShapeBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  homeX: number;
  homeY: number;
}

const MIN_SPEED = 6;
const MAX_SPEED = 13;
const MIN_COLLISION_DISTANCE = 0.0001;

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function clampAxis(value: number, radius: number, size: number): number {
  const min = radius;
  const max = size - radius;
  if (max <= min) return size / 2;
  return clamp(value, min, max);
}

function createShapeBody(
  seed: number,
  measurement: ShapeMeasurement,
  size: ContainerSize,
): ShapeBody {
  const angle = pseudoRandom(seed) * Math.PI * 2;
  const speed = MIN_SPEED + pseudoRandom(seed + 100) * (MAX_SPEED - MIN_SPEED);
  return {
    x: clampAxis(measurement.homeX, measurement.radius, size.width),
    y: clampAxis(measurement.homeY, measurement.radius, size.height),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: measurement.radius,
    homeX: measurement.homeX,
    homeY: measurement.homeY,
  };
}

export function syncShapeBodies(
  previous: ShapeBody[],
  measurements: ShapeMeasurement[],
  size: ContainerSize,
): ShapeBody[] {
  return measurements.map((measurement, index) => {
    const existing = previous[index];
    if (!existing) return createShapeBody(index, measurement, size);
    existing.homeX = measurement.homeX;
    existing.homeY = measurement.homeY;
    existing.radius = measurement.radius;
    existing.x = clampAxis(existing.x, measurement.radius, size.width);
    existing.y = clampAxis(existing.y, measurement.radius, size.height);
    return existing;
  });
}

function resolveWalls(body: ShapeBody, size: ContainerSize): void {
  const maxX = size.width - body.radius;
  if (maxX <= body.radius) {
    body.x = size.width / 2;
    body.vx = 0;
  } else if (body.x < body.radius) {
    body.x = body.radius;
    body.vx = Math.abs(body.vx);
  } else if (body.x > maxX) {
    body.x = maxX;
    body.vx = -Math.abs(body.vx);
  }

  const maxY = size.height - body.radius;
  if (maxY <= body.radius) {
    body.y = size.height / 2;
    body.vy = 0;
  } else if (body.y < body.radius) {
    body.y = body.radius;
    body.vy = Math.abs(body.vy);
  } else if (body.y > maxY) {
    body.y = maxY;
    body.vy = -Math.abs(body.vy);
  }
}

function resolveCollision(a: ShapeBody, b: ShapeBody): void {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const minDistance = a.radius + b.radius;
  const distanceSquared = dx * dx + dy * dy;
  if (distanceSquared >= minDistance * minDistance || distanceSquared < MIN_COLLISION_DISTANCE) {
    return;
  }

  const distance = Math.sqrt(distanceSquared);
  const nx = dx / distance;
  const ny = dy / distance;
  const overlap = (minDistance - distance) / 2;

  a.x -= nx * overlap;
  a.y -= ny * overlap;
  b.x += nx * overlap;
  b.y += ny * overlap;

  const relativeNormalVelocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (relativeNormalVelocity >= 0) return;

  a.vx += relativeNormalVelocity * nx;
  a.vy += relativeNormalVelocity * ny;
  b.vx -= relativeNormalVelocity * nx;
  b.vy -= relativeNormalVelocity * ny;
}

export function stepShapeBodies(
  bodies: ShapeBody[],
  size: ContainerSize,
  deltaSeconds: number,
): void {
  for (const body of bodies) {
    body.x += body.vx * deltaSeconds;
    body.y += body.vy * deltaSeconds;
    resolveWalls(body, size);
  }

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      resolveCollision(bodies[i], bodies[j]);
    }
  }
}
