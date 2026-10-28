import { describe, expect, it } from "vitest";
import { CANOP_CANOPY_SCENES, resolveCanopyScene } from "..";

describe("resolveCanopyScene et variante lite", () => {
  it("n'herite pas du lite par defaut quand le webm est surcharge sans lite", () => {
    const scene = resolveCanopyScene("light", {
      light: { webm: "https://cdn.qvl/canopy-light.webm" },
    });
    expect(scene.lite).toBeUndefined();
  });

  it("n'herite pas du lite par defaut quand le mp4 est surcharge sans lite", () => {
    const scene = resolveCanopyScene("dark", {
      dark: { mp4: "https://cdn.qvl/canopy-dark.mp4" },
    });
    expect(scene.lite).toBeUndefined();
  });

  it("garde le lite par defaut quand seule l'affiche est surchargee", () => {
    const scene = resolveCanopyScene("light", {
      light: { poster: "https://cdn.qvl/canopy-light-poster.jpg" },
    });
    expect(scene.poster).toBe("https://cdn.qvl/canopy-light-poster.jpg");
    expect(scene.lite).toEqual(CANOP_CANOPY_SCENES.light.lite);
  });

  it("conserve un lite explicite fourni avec la surcharge video", () => {
    const lite = {
      webm: "https://cdn.qvl/canopy-light-720.webm",
      mp4: "https://cdn.qvl/canopy-light-720.mp4",
    };
    const scene = resolveCanopyScene("light", {
      light: { webm: "https://cdn.qvl/canopy-light.webm", lite },
    });
    expect(scene.lite).toEqual(lite);
  });

  it("conserve un lite explicite fourni seul", () => {
    const lite = {
      webm: "https://cdn.qvl/lite.webm",
      mp4: "https://cdn.qvl/lite.mp4",
    };
    const scene = resolveCanopyScene("dark", { dark: { lite } });
    expect(scene.lite).toEqual(lite);
    expect(scene.webm).toBe(CANOP_CANOPY_SCENES.dark.webm);
  });

  it("garde le lite par defaut sans surcharge", () => {
    expect(resolveCanopyScene("dark").lite).toEqual(CANOP_CANOPY_SCENES.dark.lite);
  });
});
