import type { CanopyConstraint } from "./canopyQuality";

export interface CanopyNetworkConnection extends EventTarget {
  saveData?: unknown;
  effectiveType?: unknown;
  downlink?: unknown;
}

const POSTER_ONLY_EFFECTIVE_TYPES = new Set(["slow-2g", "2g"]);
const LIMITED_EFFECTIVE_TYPES = new Set(["3g"]);
const LIMITED_DOWNLINK_MBPS = 2;

function isNetworkConnection(value: unknown): value is CanopyNetworkConnection {
  return typeof EventTarget !== "undefined" && value instanceof EventTarget;
}

export function readNetworkConnection(): CanopyNetworkConnection | undefined {
  if (typeof navigator === "undefined" || !("connection" in navigator)) return undefined;
  const connection = navigator.connection;
  return isNetworkConnection(connection) ? connection : undefined;
}

function isLimited({ effectiveType, downlink }: CanopyNetworkConnection): boolean {
  if (typeof effectiveType === "string" && LIMITED_EFFECTIVE_TYPES.has(effectiveType)) return true;
  return typeof downlink === "number" && downlink > 0 && downlink < LIMITED_DOWNLINK_MBPS;
}

export function networkConstraint(
  connection: CanopyNetworkConnection | undefined = readNetworkConnection(),
): CanopyConstraint | undefined {
  if (!connection) return undefined;
  if (connection.saveData === true) return "save-data";
  const { effectiveType } = connection;
  if (typeof effectiveType === "string" && POSTER_ONLY_EFFECTIVE_TYPES.has(effectiveType)) {
    return "slow-network";
  }
  return isLimited(connection) ? "limited-network" : undefined;
}
