import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

interface Paquet {
  name: string;
  version: string;
  exports: Record<string, unknown>;
}

const paquet = createRequire(import.meta.url)("../../package.json") as Paquet;

describe("identite publique du paquet", () => {
  it("se publie sous le nom @canop/ui", () => {
    expect(paquet.name).toBe("@canop/ui");
  });

  it("porte la version 1.3.4", () => {
    expect(paquet.version).toBe("1.3.4");
  });

  it.each([".", "./map", "./vite", "./styles.css"])(
    "expose le point d'entree %s sous @canop/ui",
    (entree) => {
      expect(paquet.exports[entree]).toBeDefined();
    },
  );

  it("n'expose aucun autre point d'entree", () => {
    expect(Object.keys(paquet.exports).sort()).toEqual([".", "./map", "./styles.css", "./vite"]);
  });
});
