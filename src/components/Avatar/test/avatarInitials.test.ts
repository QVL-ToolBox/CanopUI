import { describe, expect, it } from "vitest";
import { avatarInitials } from "../avatarInitials";

describe("avatarInitials", () => {
  it.each([
    ["Martin Queval", "MQ"],
    ["Élodie Durand", "ÉD"],
    ["Jean-Pierre", "JP"],
    ["Jean-Pierre Lefèvre", "JL"],
    ["Ana María de la Peña", "AP"],
    ["Œdipe", "Œ"],
  ])("given le nom %s, when on calcule les initiales, then on obtient %s", (name, expected) => {
    expect(avatarInitials(name)).toBe(expected);
  });

  it("given un E suivi d'un accent combinant, when on calcule les initiales, then on obtient É en NFC", () => {
    const initials = avatarInitials("élodie Durand");

    expect(initials).toBe("ÉD");
    expect(initials).toBe(initials.normalize("NFC"));
  });

  it("given un nom entoure et coupe d'espaces multiples, when on calcule les initiales, then les espaces sont ignores", () => {
    expect(avatarInitials("   Martin    Queval   ")).toBe("MQ");
  });

  it("given un nom vide, when on calcule les initiales, then aucune initiale n'est produite", () => {
    expect(avatarInitials("")).toBe("");
  });

  it("given un nom fait uniquement d'espaces, when on calcule les initiales, then aucune initiale n'est produite", () => {
    expect(avatarInitials("    ")).toBe("");
  });

  it("given un nom commencant par des chiffres, when on calcule les initiales, then seules les lettres comptent", () => {
    expect(avatarInitials("42 Zoé")).toBe("Z");
  });

  it("given un nom en minuscules, when on calcule les initiales, then elles sont en majuscules", () => {
    expect(avatarInitials("martin queval")).toBe("MQ");
  });

  it.each(["Ana María de la Peña", "Jean Paul Marie Durand", "a b c d e"])(
    "given le nom a plusieurs mots %s, when on calcule les initiales, then il y en a au plus deux",
    (name) => {
      expect([...avatarInitials(name)].length).toBeLessThanOrEqual(2);
    },
  );
});
