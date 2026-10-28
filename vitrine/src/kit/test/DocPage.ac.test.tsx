import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { DocPage } from "../DocPage";
import { DocSection } from "../DocSection";
import { DemoCard } from "../DemoCard";
import {
  forgetViewportWidth,
  renderInVitrine,
  simulateViewportWidth,
  stubScrollIntoView,
} from "../../test/vitrineTestKit";

const WIDE_SCREEN_REM = 100;

function renderButtonDoc() {
  window.location.hash = "#/components/button";
  return renderInVitrine(
    <DocPage title="Button" intro="Le bouton d'action.">
      <DocSection title="Variantes" description="Les styles du bouton.">
        <DemoCard title="Démo des variantes" code="<Button />">
          <button type="button">Démo</button>
        </DemoCard>
      </DocSection>
      <DocSection title="Tailles">
        <p>Contenu des tailles</p>
      </DocSection>
      <DocSection title="Props">
        <p>Contenu des props</p>
      </DocSection>
    </DocPage>,
  );
}

function breadcrumb() {
  return screen.getByRole("navigation", { name: "Fil d'Ariane" });
}

function tableOfContents() {
  return screen.getByRole("navigation", { name: "Sur cette page" });
}

beforeEach(() => {
  stubScrollIntoView();
  simulateViewportWidth(WIDE_SCREEN_REM);
});

afterEach(() => {
  forgetViewportWidth();
  window.location.hash = "";
});

describe("AC4 fil d'Ariane", () => {
  it("affiche Accueil › rubrique › page dans cet ordre", () => {
    renderButtonDoc();
    const crumbs = within(breadcrumb())
      .getAllByRole("listitem")
      .map((item) => item.textContent ?? "")
      .filter((text) => text !== "");
    expect(crumbs).toEqual(["Accueil", "Saisie", "Button"]);
  });

  it("marque la page en cours comme page courante", () => {
    renderButtonDoc();
    expect(
      within(breadcrumb()).getByText("Button").closest("[aria-current='page']"),
    ).not.toBeNull();
  });

  it("suit la rubrique de la page affichée", () => {
    window.location.hash = "#/components/card";
    renderInVitrine(
      <DocPage title="Card" intro="La carte.">
        <DocSection title="Utilisation">x</DocSection>
      </DocPage>,
    );
    const crumbs = within(breadcrumb())
      .getAllByRole("listitem")
      .map((item) => item.textContent ?? "")
      .filter((text) => text !== "");
    expect(crumbs).toEqual(["Accueil", "Affichage", "Card"]);
  });
});

describe("AC4 titres", () => {
  it("porte le titre de la page en h1 unique", () => {
    renderButtonDoc();
    const titles = screen.getAllByRole("heading", { level: 1 });
    expect(titles).toHaveLength(1);
    expect(titles[0]).toHaveTextContent("Button");
  });

  it("titre chaque DocSection en h2, parent direct de son contenu", () => {
    renderButtonDoc();
    const section = screen.getByRole("heading", { level: 2, name: "Tailles" });
    expect(
      within(section.parentElement as HTMLElement).getByText("Contenu des tailles"),
    ).toBeInTheDocument();
  });

  it("titre chaque DemoCard en h3, parent direct de sa démo", () => {
    renderButtonDoc();
    const demo = screen.getByRole("heading", { level: 3, name: "Démo des variantes" });
    expect(
      within(demo.parentElement as HTMLElement).getByRole("button", { name: "Démo" }),
    ).toBeInTheDocument();
  });

  it("place la DemoCard sous le h2 de sa DocSection", () => {
    renderButtonDoc();
    const section = screen.getByRole("heading", { level: 2, name: "Variantes" });
    expect(
      within(section.parentElement as HTMLElement).getByRole("heading", {
        level: 3,
        name: "Démo des variantes",
      }),
    ).toBeInTheDocument();
  });
});

describe("AC4 sommaire « Sur cette page »", () => {
  it("liste toutes les DocSection dans l'ordre de la page", () => {
    renderButtonDoc();
    const entries = within(tableOfContents())
      .getAllByRole("listitem")
      .map((item) => item.textContent);
    expect(entries).toEqual(["Variantes", "Tailles", "Props"]);
  });

  it("n'y liste pas les titres de démo", () => {
    renderButtonDoc();
    expect(within(tableOfContents()).queryByText("Démo des variantes")).toBeNull();
  });
});
