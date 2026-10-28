import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { App } from "../App";
import { groupEntries, navGroups } from "../registry/nav";
import { renderInVitrine, stubScrollIntoView } from "./vitrineTestKit";

const RENDU_LENT = 15_000;

const PAGES_DE_DOC = navGroups.flatMap((group) => groupEntries(group).map((entry) => entry.path));

function rendreRoute(chemin: string) {
  window.location.hash = `#${chemin}`;
  return renderInVitrine(<App />);
}

beforeEach(() => {
  stubScrollIntoView();
  window.location.hash = "";
});

afterEach(() => {
  window.location.hash = "";
});

describe("AC10 un seul h1 et un seul main par page de doc", () => {
  it.each(PAGES_DE_DOC)(
    "%s",
    async (chemin) => {
      rendreRoute(chemin);
      await screen.findByRole("article", {}, { timeout: 4000 });
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(document.querySelectorAll("main")).toHaveLength(1);
    },
    RENDU_LENT,
  );
});
