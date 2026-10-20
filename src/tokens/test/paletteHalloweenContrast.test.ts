import { describe, expect, it } from "vitest";
import { contrastRatio } from "../../test/contrastRatio";
import { paletteHalloween, paletteHalloweenDark } from "..";

const AA_TEXT = 4.5;
const AA_NON_TEXT = 3;

const halloweenPalettes = [
  ["paletteHalloween", paletteHalloween],
  ["paletteHalloweenDark", paletteHalloweenDark],
] as const;

describe.each(halloweenPalettes)("contrastes AA de %s", (_name, halloween) => {
  const textRoles = [
    ["text.primary", halloween.text.primary],
    ["text.secondary", halloween.text.secondary],
  ] as const;

  const textBackgrounds = [
    ["background.default", halloween.background.default],
    ...Object.entries(halloween.surface).map(([surface, color]) => [`surface.${surface}`, color]),
  ];

  const textCases = textRoles.flatMap(([role, text]) =>
    textBackgrounds.map(([background, color]) => [role, background, text, color]),
  );

  it.each(textCases)("garde %s lisible sur %s", (_role, _background, text, background) => {
    expect(contrastRatio(text, background)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("garde primary.contrastText lisible sur primary.main", () => {
    expect(
      contrastRatio(halloween.primary.contrastText, halloween.primary.main),
    ).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it.each(Object.entries(halloween.surface))(
    "garde primary.main visible comme element non textuel sur la surface %s",
    (_surface, color) => {
      expect(contrastRatio(halloween.primary.main, color)).toBeGreaterThanOrEqual(AA_NON_TEXT);
    },
  );

  it("garde accent.contrastText lisible sur accent.main", () => {
    expect(
      contrastRatio(halloween.accent.contrastText, halloween.accent.main),
    ).toBeGreaterThanOrEqual(AA_TEXT);
  });
});
