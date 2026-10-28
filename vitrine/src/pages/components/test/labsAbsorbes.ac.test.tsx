import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import CanopyBackgroundDoc from "../CanopyBackgroundDoc";
import CardDoc from "../CardDoc";
import { ThemingPage } from "../../getting-started/ThemingPage";
import {
  forgetViewportWidth,
  renderInVitrine,
  simulateViewportWidth,
  stubScrollIntoView,
} from "../../../test/vitrineTestKit";

const RENDU_LENT = 15_000;

function sectionTitled(pattern: RegExp): HTMLElement {
  const heading = screen
    .getAllByRole("heading", { level: 2 })
    .find((candidate) => pattern.test(candidate.textContent ?? ""));
  if (!heading) throw new Error(`aucune section ne correspond à ${pattern}`);
  return heading.parentElement as HTMLElement;
}

beforeEach(() => {
  stubScrollIntoView();
  simulateViewportWidth(100);
});

afterEach(() => {
  forgetViewportWidth();
});

describe("AC6 la doc Card couvre le verre liquide", () => {
  it(
    "a une section Verre liquide avec au moins une démo",
    () => {
      window.location.hash = "#/components/card";
      renderInVitrine(<CardDoc />);
      const section = sectionTitled(/verre liquide/i);
      expect(within(section).getAllByRole("heading", { level: 3 }).length).toBeGreaterThan(0);
    },
    RENDU_LENT,
  );

  it(
    "liste la section Verre liquide dans le sommaire de la page",
    () => {
      window.location.hash = "#/components/card";
      renderInVitrine(<CardDoc />);
      const toc = screen.getByRole("navigation", { name: "Sur cette page" });
      expect(within(toc).getByText(/verre liquide/i)).toBeInTheDocument();
    },
    RENDU_LENT,
  );
});

describe("AC6 la doc Theming couvre le néon en sombre", () => {
  it(
    "a une section sur le néon en thème sombre",
    () => {
      window.location.hash = "#/docs/theming";
      renderInVitrine(<ThemingPage />);
      const section = sectionTitled(/n[ée]on/i);
      expect(section.querySelector("h2")?.textContent ?? "").toMatch(/sombre/i);
    },
    RENDU_LENT,
  );
});

describe("AC6 la doc CanopyBackground n'a plus de banc d'essai", () => {
  it(
    "ne présente plus de section ni de démo banc d'essai ou labo",
    () => {
      window.location.hash = "#/components/canopy-background";
      renderInVitrine(<CanopyBackgroundDoc />);
      const titles = screen.getAllByRole("heading").map((heading) => heading.textContent ?? "");
      expect(titles.filter((title) => /banc d'essai|\blabo|\blab\b/i.test(title))).toEqual([]);
    },
    RENDU_LENT,
  );
});
