import { describe, expect, it } from "vitest";
import { contrastTextFor, isLightColor, parseHexColor, perceivedLuminance } from "../contrast";

describe("parseHexColor", () => {
  it("lit six chiffres, avec ou sans diese", () => {
    expect(parseHexColor("#3f7f5f")).toEqual({ red: 0x3f, green: 0x7f, blue: 0x5f });
    expect(parseHexColor("3f7f5f")).toEqual({ red: 0x3f, green: 0x7f, blue: 0x5f });
  });

  it("lit la forme courte a trois chiffres", () => {
    expect(parseHexColor("#fff")).toEqual({ red: 255, green: 255, blue: 255 });
    expect(parseHexColor("#0a3")).toEqual({ red: 0x00, green: 0xaa, blue: 0x33 });
  });

  it("refuse plutot que de deviner", () => {
    for (const entree of ["", "#", "rebeccapurple", "rgb(1,2,3)", "#12345", "#1234567", "zzz"]) {
      expect(parseHexColor(entree)).toBeNull();
    }
  });

  it("tolere les espaces autour", () => {
    expect(parseHexColor("  #3f7f5f  ")).toEqual({ red: 0x3f, green: 0x7f, blue: 0x5f });
  });
});

describe("perceivedLuminance", () => {
  it("place le noir a 0 et le blanc a 1", () => {
    expect(perceivedLuminance("#000000")).toBe(0);
    expect(perceivedLuminance("#ffffff")).toBe(1);
  });

  it("pese le vert plus que le bleu, comme l'oeil", () => {
    const vert = perceivedLuminance("#00ff00") ?? 0;
    const bleu = perceivedLuminance("#0000ff") ?? 0;
    const rouge = perceivedLuminance("#ff0000") ?? 0;

    expect(vert).toBeGreaterThan(rouge);
    expect(rouge).toBeGreaterThan(bleu);
  });

  it("renvoie null sur une couleur illisible", () => {
    expect(perceivedLuminance("pas une couleur")).toBeNull();
  });
});

describe("isLightColor", () => {
  it("juge clairs les fonds pales", () => {
    for (const clair of ["#ffffff", "#f4f1ea", "#ffe08a", "#c9f5d0"]) {
      expect(isLightColor(clair)).toBe(true);
    }
  });

  it("juge sombres les fonds soutenus", () => {
    for (const sombre of ["#000000", "#3f7f5f", "#6d4f9c", "#a83f52", "#2f7fa8"]) {
      expect(isLightColor(sombre)).toBe(false);
    }
  });

  it("penche vers le texte clair quand la couleur est illisible", () => {
    expect(isLightColor("")).toBe(false);
    expect(isLightColor("#zzz")).toBe(false);
  });
});

describe("contrastTextFor", () => {
  it("renvoie le jeton, et non un booleen a interpreter", () => {
    expect(contrastTextFor("#ffe08a")).toBe("var(--canop-palette-text-primary)");
    expect(contrastTextFor("#3f7f5f")).toBe("var(--canop-palette-background-default)");
  });

  it("donne toujours un jeton exploitable, meme sur une entree invalide", () => {
    expect(contrastTextFor("")).toMatch(/^var\(--canop-/);
  });
});
