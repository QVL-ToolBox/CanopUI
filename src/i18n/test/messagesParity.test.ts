import { describe, expect, it } from "vitest";
import { canopBaseMessages } from "../messages";

describe("i18n - parite des locales", () => {
  it("given the base messages, when comparing fr and en, then both expose the same keys", () => {
    const fr = Object.keys(canopBaseMessages.fr).sort();
    const en = Object.keys(canopBaseMessages.en).sort();
    expect(en).toEqual(fr);
  });

  it("given the base messages, when reading canop.link.newTab, then each locale says new tab", () => {
    expect(canopBaseMessages.fr["canop.link.newTab"]).toMatch(/nouvel onglet/);
    expect(canopBaseMessages.en["canop.link.newTab"]).toMatch(/new tab/);
  });
});
