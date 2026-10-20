import { describe, expect, it } from "vitest";
import type { CanopTranslate } from "../../../i18n";
import { defaultFileUploaderLabels } from "../labels";
import { resolveFileUploaderLabels } from "../useFileUploaderLabels";

const withoutTranslations: CanopTranslate = (key) => key;

const withTranslations: CanopTranslate = (key) => `[${key.replace("canop.upload.", "")}]`;

describe("resolveFileUploaderLabels - source des defauts", () => {
  it("retombe sur les libelles de la librairie quand la cle n'est pas traduite", () => {
    expect(resolveFileUploaderLabels(withoutTranslations)).toEqual(defaultFileUploaderLabels);
  });

  it("consomme les traductions canop.upload quand elles existent", () => {
    const labels = resolveFileUploaderLabels(withTranslations);
    expect(labels.start).toBe("[start]");
    expect(labels.dropZoneHint).toBe("[dropZoneHint]");
  });

  it("resout chaque libelle du contrat public", () => {
    const labels = resolveFileUploaderLabels(withTranslations);
    expect(Object.keys(labels).sort()).toEqual(Object.keys(defaultFileUploaderLabels).sort());
  });
});

describe("resolveFileUploaderLabels - surcharge explicite", () => {
  it("laisse la surcharge primer sur la traduction", () => {
    const labels = resolveFileUploaderLabels(withTranslations, { start: "Envoyer" });
    expect(labels.start).toBe("Envoyer");
  });

  it("ne touche pas aux libelles non surcharges", () => {
    const labels = resolveFileUploaderLabels(withTranslations, { start: "Envoyer" });
    expect(labels.abort).toBe("[abort]");
  });

  it("ignore une surcharge absente et garde la traduction", () => {
    const labels = resolveFileUploaderLabels(withTranslations, { start: undefined });
    expect(labels.start).toBe("[start]");
  });

  it("accepte une surcharge complete", () => {
    const overrides = { ...defaultFileUploaderLabels, start: "Envoyer" };
    expect(resolveFileUploaderLabels(withTranslations, overrides)).toEqual(overrides);
  });

  it("retombe sur les defauts quand ni traduction ni surcharge ne repondent", () => {
    const labels = resolveFileUploaderLabels(withoutTranslations, { start: "Envoyer" });
    expect(labels).toEqual({ ...defaultFileUploaderLabels, start: "Envoyer" });
  });
});
