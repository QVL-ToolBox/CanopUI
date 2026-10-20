import { describe, expect, it } from "vitest";
import { contrastRatio } from "../../test/contrastRatio";
import { paletteDark } from "..";

const AA_TEXT = 4.5;
const AA_NON_TEXT = 3;

describe("contraste du primaire en theme sombre", () => {
  it("garde primary.main lisible comme texte sur le fond de page", () => {
    const ratio = contrastRatio(paletteDark.primary.main, paletteDark.background.default);

    expect(ratio).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it.each(Object.entries(paletteDark.surface))(
    "garde primary.main visible comme element non textuel sur la surface %s",
    (_name, surface) => {
      const ratio = contrastRatio(paletteDark.primary.main, surface);

      expect(ratio).toBeGreaterThanOrEqual(AA_NON_TEXT);
    },
  );

  it("garde primary.light lisible comme texte sur la surface overlay", () => {
    const ratio = contrastRatio(paletteDark.primary.light, paletteDark.surface.overlay);

    expect(ratio).toBeGreaterThanOrEqual(AA_TEXT);
  });
});
