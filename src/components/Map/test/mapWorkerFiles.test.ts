import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import { MAP_WORKER_FILES, mapWorkerSpecifier } from "../mapWorkerBase";

const depuisLeProjet = createRequire(import.meta.url);

function source(fichier: string): string {
  return readFileSync(depuisLeProjet.resolve(mapWorkerSpecifier(fichier)), "utf8");
}

describe("fichiers du worker de MapLibre", () => {
  it("resout chaque fichier declare dans le paquet installe", () => {
    for (const fichier of MAP_WORKER_FILES) {
      expect(() => depuisLeProjet.resolve(mapWorkerSpecifier(fichier))).not.toThrow();
    }
  });

  it("declare tous les modules voisins que le worker importe", () => {
    const attendus = new Set<string>(MAP_WORKER_FILES);
    const manquants: string[] = [];

    for (const fichier of MAP_WORKER_FILES) {
      for (const trouve of source(fichier).matchAll(/from\s*"\.\/([^"]+)"/g)) {
        if (!attendus.has(trouve[1])) manquants.push(fichier + " importe " + trouve[1]);
      }
    }

    expect(manquants).toEqual([]);
  });

  it("place le worker en tete, avant ce qu'il importe", () => {
    expect(MAP_WORKER_FILES[0]).toBe("maplibre-gl-worker.mjs");
  });
});
