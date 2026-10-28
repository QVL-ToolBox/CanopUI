import { describe, expect, it } from "vitest";
import { allComponentEntries, navCategories } from "../nav";
import { componentPage } from "../componentPages";

const allNavPaths = navCategories.flatMap((category) => category.entries.map((e) => e.path));

describe("retrait de la page vitrine SlidingIndicator", () => {
  it("ne référence plus la page /components/sliding-indicator dans la navigation", () => {
    expect(allNavPaths).not.toContain("/components/sliding-indicator");
    expect(allComponentEntries.map((e) => e.path)).not.toContain("/components/sliding-indicator");
  });

  it("ne sert plus de page vitrine pour sliding-indicator", () => {
    expect(componentPage("sliding-indicator")).toBeUndefined();
  });

  it("conserve les pages des composants qui affichent la pastille", () => {
    expect(allNavPaths).toContain("/components/segmented-control");
    expect(allNavPaths).toContain("/components/toolbar");
    expect(componentPage("segmented-control")).toBeDefined();
    expect(componentPage("toolbar")).toBeDefined();
  });
});
