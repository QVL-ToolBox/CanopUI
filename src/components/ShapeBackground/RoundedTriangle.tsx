import Box from "@mui/material/Box";

interface Point {
  x: number;
  y: number;
}

const TRIANGLE_POINTS: Point[] = [
  { x: 50, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
];
const CORNER_RADIUS = 16;

function unitVector(from: Point, to: Point): Point {
  const dx = from.x - to.x;
  const dy = from.y - to.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length };
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function roundedPolygonPath(points: Point[], radius: number): string {
  const count = points.length;
  let path = "";

  for (let index = 0; index < count; index++) {
    const current = points[index];
    const previous = points[(index - 1 + count) % count];
    const next = points[(index + 1) % count];
    const toPrevious = unitVector(previous, current);
    const toNext = unitVector(next, current);
    const cornerRadius = Math.min(
      radius,
      distance(previous, current) / 2,
      distance(next, current) / 2,
    );
    const entry = {
      x: current.x + toPrevious.x * cornerRadius,
      y: current.y + toPrevious.y * cornerRadius,
    };
    const exit = {
      x: current.x + toNext.x * cornerRadius,
      y: current.y + toNext.y * cornerRadius,
    };
    path += index === 0 ? `M ${entry.x} ${entry.y} ` : `L ${entry.x} ${entry.y} `;
    path += `Q ${current.x} ${current.y} ${exit.x} ${exit.y} `;
  }

  return `${path}Z`;
}

const TRIANGLE_PATH = roundedPolygonPath(TRIANGLE_POINTS, CORNER_RADIUS);

export interface RoundedTriangleProps {
  color: string;
  opacity: number;
  rotate?: number;
}

export function RoundedTriangle({ color, opacity, rotate }: RoundedTriangleProps) {
  return (
    <Box
      component="svg"
      viewBox="0 0 100 100"
      sx={{
        display: "block",
        width: "100%",
        height: "100%",
        color,
        opacity,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      <path d={TRIANGLE_PATH} fill="currentColor" />
    </Box>
  );
}
