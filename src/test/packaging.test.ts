import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

interface Paquet {
  dependencies?: Record<string, string>;
  peerDependencies: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
}

const paquet = createRequire(import.meta.url)("../../package.json") as Paquet;

const configuration = readFileSync("vite.config.ts", "utf8");

function blocExternal(): string {
  const debut = configuration.indexOf("external: [");
  const fin = configuration.indexOf("]", debut);
  return configuration.slice(debut, fin);
}

function racine(nom: string): string {
  return nom.startsWith("@") ? nom.split("/")[0] : nom;
}

describe("dependances du paquet", () => {
  it("n'embarque aucune dependance d'execution", () => {
    expect(paquet.dependencies).toBeUndefined();
  });

  it("declare framer-motion en dependance pair non optionnelle", () => {
    expect(paquet.peerDependencies["framer-motion"]).toBeDefined();
    expect(paquet.peerDependenciesMeta?.["framer-motion"]).toBeUndefined();
  });

  it("externalise a la construction tout ce qu'il declare en dependance pair", () => {
    const bloc = blocExternal();
    const absentes = Object.keys(paquet.peerDependencies).filter(
      (nom) => !bloc.includes(racine(nom)),
    );

    expect(absentes).toEqual([]);
  });

  it("lit bien la configuration de construction qu'il pretend inspecter", () => {
    expect(blocExternal()).toContain("external: [");
    expect(Object.keys(paquet.peerDependencies).length).toBeGreaterThan(4);
  });
});

describe("point d'entree @canop/ui/vite", () => {
  it("ne resout aucun fichier par new URL, sans quoi Vite embarquerait les videos en base64", () => {
    const pointEntreeVite = readFileSync("src/vite.ts", "utf8");

    expect(pointEntreeVite).not.toContain("new URL(");
  });

  it("lit bien le point d'entree qu'il pretend inspecter", () => {
    expect(readFileSync("src/vite.ts", "utf8")).toContain("export");
  });
});
