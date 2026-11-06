import { describe, expect, it } from "vitest";
import { CANOP_CANOPY_SCENES, resolveCanopyScene } from "..";

describe("resolveCanopyScene sans variante lite", () => {
  it("n'expose aucune variante lite sans surcharge", () => {
    expect(resolveCanopyScene("dark")).not.toHaveProperty("lite");
    expect(resolveCanopyScene("light")).not.toHaveProperty("lite");
  });

  it("n'expose aucune variante lite quand le webm est surcharge", () => {
    const scene = resolveCanopyScene("light", {
      light: { webm: "https://cdn.qvl/canopy-light.webm" },
    });
    expect(scene.webm).toBe("https://cdn.qvl/canopy-light.webm");
    expect(scene).not.toHaveProperty("lite");
  });

  it("garde les videos par defaut quand seule l'affiche est surchargee", () => {
    const scene = resolveCanopyScene("light", {
      light: { poster: "https://cdn.qvl/canopy-light-poster.jpg" },
    });
    expect(scene.poster).toBe("https://cdn.qvl/canopy-light-poster.jpg");
    expect(scene.webm).toBe(CANOP_CANOPY_SCENES.light.webm);
    expect(scene.mp4).toBe(CANOP_CANOPY_SCENES.light.mp4);
  });

  it("garde le webm par defaut quand seul le mp4 est surcharge", () => {
    const scene = resolveCanopyScene("dark", {
      dark: { mp4: "https://cdn.qvl/canopy-dark.mp4" },
    });
    expect(scene.mp4).toBe("https://cdn.qvl/canopy-dark.mp4");
    expect(scene.webm).toBe(CANOP_CANOPY_SCENES.dark.webm);
  });
});
