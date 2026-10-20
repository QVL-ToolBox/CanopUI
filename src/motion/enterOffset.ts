export type CanopEnterDirection = "up" | "down" | "left" | "right" | "none";

export interface CanopEnterOffset {
  x?: string;
  y?: string;
}

export function enterOffset(direction: CanopEnterDirection, distance: string): CanopEnterOffset {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: `-${distance}` };
    case "left":
      return { x: distance };
    case "right":
      return { x: `-${distance}` };
    case "none":
      return {};
  }
}
