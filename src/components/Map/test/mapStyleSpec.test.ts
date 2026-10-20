import { describe, expect, it } from "vitest";
import { validateStyleMin } from "@maplibre/maplibre-gl-style-spec";
import { buildCanopMapStyle } from "../mapStyle";
import { CANOP_MAP_TILES } from "../mapTiles";

describe("conformité du style à la spec MapLibre", () => {
  it("valide le style clair", () => {
    expect(validateStyleMin(buildCanopMapStyle("light", CANOP_MAP_TILES))).toEqual([]);
  });

  it("valide le style sombre", () => {
    expect(validateStyleMin(buildCanopMapStyle("dark", CANOP_MAP_TILES))).toEqual([]);
  });
});
