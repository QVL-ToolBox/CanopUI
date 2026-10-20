import { describe, expect, it } from "vitest";
import { validateStyleMin } from "@maplibre/maplibre-gl-style-spec";
import { buildCanopMapStyle } from "../mapStyle";
import { canopMapPalette, mix } from "../mapPalette";
import { CANOP_MAP_TILES, resolveMapTiles } from "../mapTiles";
import {
  mapPoiClasses,
  mapPoiIcons,
  poiClassFromImageId,
  poiImageId,
  poiImageSource,
  poiModeFromImageId,
} from "../mapIcons";

const light = buildCanopMapStyle("light", CANOP_MAP_TILES);
const dark = buildCanopMapStyle("dark", CANOP_MAP_TILES);

describe("mix", () => {
  it("rend la couleur source à 100 %", () => {
    expect(mix("#1e6244", "#ffffff", 1)).toBe("#1e6244");
  });

  it("rend la couleur cible à 0 %", () => {
    expect(mix("#1e6244", "#ffffff", 0)).toBe("#ffffff");
  });

  it("mélange à mi-chemin", () => {
    expect(mix("#000000", "#ffffff", 0.5)).toBe("#808080");
  });
});

describe("buildCanopMapStyle", () => {
  it("branche la source sur les tuiles fournies", () => {
    const style = buildCanopMapStyle(
      "light",
      resolveMapTiles({ url: "https://tuiles.qvl/planet" }),
    );
    expect(style.sources.canop).toMatchObject({
      type: "vector",
      url: "https://tuiles.qvl/planet",
      attribution: CANOP_MAP_TILES.attribution,
    });
    expect(style.glyphs).toBe(CANOP_MAP_TILES.glyphs);
  });

  it("ne contient que des couches CanopUI", () => {
    expect(light.layers.every((layer) => layer.id.startsWith("canop-"))).toBe(true);
  });

  it("peint le fond avec la couleur de terre du thème", () => {
    const background = light.layers.find((layer) => layer.type === "background");
    expect(background?.paint).toEqual({ "background-color": canopMapPalette("light").land });
  });

  it("distingue le thème clair du thème sombre", () => {
    expect(canopMapPalette("dark").land).not.toBe(canopMapPalette("light").land);
    expect(dark.name).not.toBe(light.name);
    expect(dark.layers).toHaveLength(light.layers.length);
  });

  it("réserve la couleur vive aux données, pas au fond", () => {
    const color = canopMapPalette("light");
    expect(color.land).not.toBe("#f4ad15");
    expect(color.water).not.toBe("#1e6244");
  });

  it("nomme les libellés dans la police du fournisseur de tuiles", () => {
    const labels = light.layers.filter((layer) => layer.type === "symbol");
    expect(labels.length).toBeGreaterThan(0);
    for (const label of labels) {
      const font = (label.layout as { "text-font": string[] })["text-font"];
      expect([CANOP_MAP_TILES.fontRegular, CANOP_MAP_TILES.fontBold]).toContain(font[0]);
    }
  });
});

describe("resolveMapTiles", () => {
  it("garde la source par défaut sans surcharge", () => {
    expect(resolveMapTiles()).toBe(CANOP_MAP_TILES);
  });

  it("fusionne une surcharge partielle", () => {
    expect(resolveMapTiles({ attribution: "QVL" })).toEqual({
      ...CANOP_MAP_TILES,
      attribution: "QVL",
    });
  });
});

describe("points d'intérêt", () => {
  it("pose une couche POI par défaut", () => {
    const poi = light.layers.find((layer) => layer.id === "canop-poi");
    expect(poi).toBeDefined();
    expect(poi?.minzoom).toBe(15);
  });

  it("retire la couche quand le portail n'en veut pas", () => {
    const style = buildCanopMapStyle("light", CANOP_MAP_TILES, { poi: false });
    expect(style.layers.some((layer) => layer.id === "canop-poi")).toBe(false);
    expect(style.layers).toHaveLength(light.layers.length - 1);
  });

  it("ne garde que les classes demandées", () => {
    const style = buildCanopMapStyle("light", CANOP_MAP_TILES, { poi: ["bar", "cafe"] });
    const poi = style.layers.find((layer) => layer.id === "canop-poi");
    expect(JSON.stringify((poi as { filter?: unknown })?.filter)).toContain('["bar","cafe"]');
  });

  it("ignore une classe inconnue plutôt que de casser le style", () => {
    const style = buildCanopMapStyle("light", CANOP_MAP_TILES, {
      poi: ["bar", "licorne"] as never,
    });
    const poi = style.layers.find((layer) => layer.id === "canop-poi");
    expect(JSON.stringify((poi as { filter?: unknown })?.filter)).toContain('["bar"]');
    expect(validateStyleMin(style)).toEqual([]);
  });

  it("ne trace plus aucun pointillé", () => {
    for (const layer of light.layers) {
      expect((layer.paint as { "line-dasharray"?: unknown })?.["line-dasharray"]).toBeUndefined();
    }
  });

  it("couvre les classes du schéma avec des icônes CanopUI recolorables", () => {
    expect(mapPoiClasses.length).toBeGreaterThan(15);
    for (const poiClass of mapPoiClasses) {
      expect(mapPoiIcons[poiClass]).toContain("currentColor");
    }
  });

  it("sert les bars, cafés et restaurants", () => {
    expect(mapPoiClasses).toEqual(expect.arrayContaining(["bar", "cafe", "fast_food", "shop"]));
  });

  it("relie un identifiant d'image à sa classe, et rien d'autre", () => {
    expect(poiClassFromImageId(poiImageId("light", "bar"))).toBe("bar");
    expect(poiClassFromImageId(poiImageId("dark", "fast_food"))).toBe("fast_food");
    expect(poiModeFromImageId(poiImageId("dark", "bar"))).toBe("dark");
    expect(poiClassFromImageId("canop-poi-light-inconnu")).toBeUndefined();
    expect(poiClassFromImageId("autre-chose")).toBeUndefined();
  });

  it("peint l'icône aux couleurs du thème, dans une pastille", () => {
    const colors = {
      glyph: "#1e6244",
      badge: "#ffffff",
      edge: "#c8d6cd",
      shade: "rgba(0, 0, 0, 0.2)",
    };
    const source = decodeURIComponent(poiImageSource(mapPoiIcons.bar, colors, 44));
    expect(source).toContain("#1e6244");
    expect(source).toContain("<circle");
    expect(source).toContain("feDropShadow");
    expect(source).not.toContain("currentColor");
    expect(source).toContain('width="44"');
  });

  it("distingue la teinte des POI entre les deux thèmes", () => {
    expect(canopMapPalette("light").poiGlyph).not.toBe(canopMapPalette("dark").poiGlyph);
  });
});

describe("pastilles et thème", () => {
  it("nomme les images par thème, pour qu'un changement de thème les redemande", () => {
    const lightPoi = light.layers.find((layer) => layer.id === "canop-poi");
    const darkPoi = dark.layers.find((layer) => layer.id === "canop-poi");
    const image = (layer: typeof lightPoi) =>
      JSON.stringify((layer?.layout as { "icon-image": unknown })["icon-image"]);
    expect(image(lightPoi)).toContain("canop-poi-light-");
    expect(image(darkPoi)).toContain("canop-poi-dark-");
    expect(image(lightPoi)).not.toBe(image(darkPoi));
  });

  it("peint la pastille aux couleurs du thème demandé", () => {
    const source = (mode: "light" | "dark") => {
      const color = canopMapPalette(mode);
      return decodeURIComponent(
        poiImageSource(
          mapPoiIcons.bar,
          {
            glyph: color.poiGlyph,
            badge: color.poiBadge,
            edge: color.poiBadgeEdge,
            shade: color.buildingShade,
          },
          44,
        ),
      );
    };
    expect(source("light")).not.toBe(source("dark"));
    expect(source("dark")).toContain(canopMapPalette("dark").poiBadge);
  });
});

describe("frontières administratives", () => {
  it("trace les frontières nationales et régionales par défaut", () => {
    const ids = light.layers.map((layer) => layer.id);
    expect(ids).toContain("canop-boundary-country");
    expect(ids).toContain("canop-boundary-region");
    expect(ids).not.toContain("canop-boundary-department");
  });

  it("ajoute les départements quand on les demande", () => {
    const style = buildCanopMapStyle("light", CANOP_MAP_TILES, {
      boundaries: ["country", "region", "department"],
    });
    const department = style.layers.find((layer) => layer.id === "canop-boundary-department");
    expect(department?.minzoom).toBe(7);
    expect(validateStyleMin(style)).toEqual([]);
  });

  it("ne garde que le niveau demandé", () => {
    const style = buildCanopMapStyle("light", CANOP_MAP_TILES, { boundaries: ["department"] });
    const ids = style.layers.map((layer) => layer.id);
    expect(ids).toContain("canop-boundary-department");
    expect(ids).not.toContain("canop-boundary-country");
  });

  it("retire toute frontière quand le portail n'en veut pas", () => {
    const style = buildCanopMapStyle("light", CANOP_MAP_TILES, { boundaries: false });
    expect(style.layers.some((layer) => layer.id.startsWith("canop-boundary"))).toBe(false);
  });

  it("filtre chaque couche sur son niveau administratif", () => {
    const country = light.layers.find((layer) => layer.id === "canop-boundary-country");
    const region = light.layers.find((layer) => layer.id === "canop-boundary-region");
    expect(JSON.stringify((country as { filter?: unknown })?.filter)).toContain("2");
    expect(JSON.stringify((region as { filter?: unknown })?.filter)).toContain("4");
  });
});
