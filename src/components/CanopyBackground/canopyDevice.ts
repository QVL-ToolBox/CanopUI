import type { CanopyConstraint } from "./canopyQuality";

const MODEST_DEVICE_MEMORY_GB = 2;
const FEW_CORES = 2;
const FEW_CORES_DEVICE_MEMORY_GB = 4;
const LITE_SCENE_HEIGHT = 720;
const LITE_SCENE_WIDTH = 1280;

function readDeviceMemory(): number | undefined {
  if (typeof navigator === "undefined" || !("deviceMemory" in navigator)) return undefined;
  const memory = navigator.deviceMemory;
  return typeof memory === "number" ? memory : undefined;
}

function deviceConstraint(): CanopyConstraint | undefined {
  const memory = readDeviceMemory();
  if (memory === undefined) return undefined;
  const cores = navigator.hardwareConcurrency || Number.POSITIVE_INFINITY;
  const modest =
    memory <= MODEST_DEVICE_MEMORY_GB ||
    (cores <= FEW_CORES && memory <= FEW_CORES_DEVICE_MEMORY_GB);
  return modest ? "modest-device" : undefined;
}

function screenConstraint(): CanopyConstraint | undefined {
  if (typeof window === "undefined" || !window.innerWidth) return undefined;
  const ratio = window.devicePixelRatio || 1;
  const longSide = Math.max(window.innerWidth, window.innerHeight) * ratio;
  const shortSide = Math.min(window.innerWidth, window.innerHeight) * ratio;
  const liteSceneCoversScreen = longSide <= LITE_SCENE_WIDTH && shortSide <= LITE_SCENE_HEIGHT;
  return liteSceneCoversScreen ? "small-screen" : undefined;
}

export function hardwareConstraints(): CanopyConstraint[] {
  return [deviceConstraint(), screenConstraint()].filter(
    (constraint): constraint is CanopyConstraint => constraint !== undefined,
  );
}
