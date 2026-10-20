import { getWorkerUrl, setWorkerUrl } from "maplibre-gl";
import { CANOP_MAP_WORKER_URL } from "./mapWorkerBase";

export function ensureMapWorkerUrl(): void {
  const applicationAlreadyChoseWorkerUrl = Boolean(getWorkerUrl());
  if (applicationAlreadyChoseWorkerUrl) return;
  setWorkerUrl(CANOP_MAP_WORKER_URL);
}
