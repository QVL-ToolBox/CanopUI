export const CANOP_MAP_ASSET_BASE = "/canopui/map";

export const MAP_WORKER_FILE = "maplibre-gl-worker.mjs";

export const MAP_WORKER_FILES = [MAP_WORKER_FILE, "maplibre-gl-shared.mjs"] as const;

export function mapWorkerSpecifier(fichier: string): string {
  return `maplibre-gl/dist/${fichier}`;
}

export const CANOP_MAP_WORKER_URL = `${CANOP_MAP_ASSET_BASE}/${MAP_WORKER_FILE}`;
