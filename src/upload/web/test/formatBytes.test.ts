import { describe, expect, it } from "vitest";
import { formatBytes } from "../formatBytes";

const KIO = 1024;
const MIO = KIO * 1024;
const GIO = MIO * 1024;
const TIO = GIO * 1024;

describe("formatBytes - valeurs nulles ou negatives", () => {
  it.each([0, -1, -1024, Number.NEGATIVE_INFINITY])("rend zero octet pour %p", (bytes) => {
    expect(formatBytes(bytes)).toBe("0 o");
  });
});

describe("formatBytes - unite octet", () => {
  it("rend un octet sans decimale", () => {
    expect(formatBytes(1)).toBe("1 o");
  });

  it("rend la derniere valeur avant le kibioctet", () => {
    expect(formatBytes(1023)).toBe("1023 o");
  });

  it("n'arrondit pas les octets fractionnaires", () => {
    expect(formatBytes(1023.5)).toBe("1023.5 o");
  });
});

describe("formatBytes - changement d'unite", () => {
  it("bascule en kibioctets au premier multiple de 1024", () => {
    expect(formatBytes(KIO)).toBe("1 Kio");
  });

  it("reste en kibioctets juste sous le mebioctet", () => {
    expect(formatBytes(MIO - 1)).toBe("1024 Kio");
  });

  it("bascule en mebioctets a 1024 kibioctets", () => {
    expect(formatBytes(MIO)).toBe("1 Mio");
  });

  it("rend les gibioctets", () => {
    expect(formatBytes(5 * GIO)).toBe("5 Gio");
  });

  it("rend les tebioctets", () => {
    expect(formatBytes(3 * TIO)).toBe("3 Tio");
  });
});

describe("formatBytes - plafonnement de l'unite", () => {
  it("reste en tebioctets au-dela de 1024 Tio", () => {
    expect(formatBytes(1024 * TIO)).toBe("1024 Tio");
  });

  it("reste en tebioctets pour un ordre de grandeur superieur", () => {
    expect(formatBytes(2048 * TIO)).toBe("2048 Tio");
  });
});

describe("formatBytes - arrondi a une decimale", () => {
  it("garde une decimale significative", () => {
    expect(formatBytes(1536)).toBe("1.5 Kio");
  });

  it("arrondit au dixieme superieur", () => {
    expect(formatBytes(1280)).toBe("1.3 Kio");
  });

  it("arrondit au dixieme inferieur", () => {
    expect(formatBytes(1126)).toBe("1.1 Kio");
  });

  it("supprime la decimale quand l'arrondi tombe juste", () => {
    expect(formatBytes(1075)).toBe("1 Kio");
  });

  it("arrondit aussi les mebioctets", () => {
    expect(formatBytes(1.5 * MIO)).toBe("1.5 Mio");
  });
});
