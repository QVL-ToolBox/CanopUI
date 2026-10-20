import { describe, expect, it } from "vitest";
import { buildCguUrl } from "../navigation";

describe("buildCguUrl", () => {
  it("construit l'URL CGU sur /cgu par defaut a partir de authPortalUrl", () => {
    expect(buildCguUrl({ authPortalUrl: "https://auth.example.test" })).toBe(
      "https://auth.example.test/cgu",
    );
  });

  it("derive l'origine du authPortalUrl fourni par l'appelant", () => {
    expect(buildCguUrl({ authPortalUrl: "https://tenant-42.internal.test" })).toBe(
      "https://tenant-42.internal.test/cgu",
    );
  });

  it("accepte un chemin CGU personnalise", () => {
    expect(
      buildCguUrl({ authPortalUrl: "https://auth.example.test", cguPath: "/legal/terms" }),
    ).toBe("https://auth.example.test/legal/terms");
  });

  it("ajoute l'ancre mentions legales en fragment", () => {
    expect(
      buildCguUrl({
        authPortalUrl: "https://auth.example.test",
        legalNoticeAnchor: "mentions-legales",
      }),
    ).toBe("https://auth.example.test/cgu#mentions-legales");
  });

  it("combine chemin personnalise et ancre", () => {
    expect(
      buildCguUrl({
        authPortalUrl: "https://auth.example.test",
        cguPath: "/legal",
        legalNoticeAnchor: "ml",
      }),
    ).toBe("https://auth.example.test/legal#ml");
  });

  it("ne prefixe aucun domaine en dur et reste dans l'origine fournie", () => {
    const url = buildCguUrl({ authPortalUrl: "https://portail-preprod.zone.test" });
    expect(new URL(url).origin).toBe("https://portail-preprod.zone.test");
  });
});
