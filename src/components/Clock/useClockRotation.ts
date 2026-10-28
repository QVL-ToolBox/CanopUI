import { useState } from "react";
import { shortestTurn } from "./clockTime";

export function useClockRotation(angle: number): number {
  const [rotation, setRotation] = useState(angle);
  const [lastAngle, setLastAngle] = useState(angle);

  if (angle !== lastAngle) {
    setLastAngle(angle);
    setRotation(rotation + shortestTurn(lastAngle, angle));
  }

  return rotation;
}
