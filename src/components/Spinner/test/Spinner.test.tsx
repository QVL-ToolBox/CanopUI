import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Spinner } from "../Spinner";

function renderSpinner(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Spinner", () => {
  it("expose un progressbar accessible avec libellé par défaut", () => {
    renderSpinner(<Spinner />);
    expect(screen.getByRole("progressbar", { name: "Chargement" })).toBeInTheDocument();
  });

  it("accepte un libellé personnalisé", () => {
    renderSpinner(<Spinner ariaLabel="Envoi en cours" />);
    expect(screen.getByRole("progressbar", { name: "Envoi en cours" })).toBeInTheDocument();
  });

  it("utilise la couleur d'accent CustHome", () => {
    renderSpinner(<Spinner />);
    expect(screen.getByRole("progressbar").className).toContain("colorAccent");
  });

  it("rend en inline par défaut (sans conteneur pleine page)", () => {
    const { container } = renderSpinner(<Spinner />);
    expect(container.querySelector(".MuiBox-root")).not.toBeInTheDocument();
  });

  it("rend en pleine page avec fullPage", () => {
    const { container } = renderSpinner(<Spinner fullPage />);
    expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it.each([
    ["small", "1.25rem"],
    ["medium", "2.5rem"],
    ["large", "4rem"],
  ] as const)("mappe la taille %s sur %s", (size, dimension) => {
    renderSpinner(<Spinner size={size} />);
    expect(screen.getByRole("progressbar")).toHaveStyle({ width: dimension, height: dimension });
  });

  it("traduit le libelle par defaut au lieu de le figer en francais", () => {
    render(
      <CanopI18nProvider locale="en">
        <CanopThemeProvider>
          <Spinner />
        </CanopThemeProvider>
      </CanopI18nProvider>,
    );
    expect(screen.getByRole("progressbar", { name: "Loading" })).toBeInTheDocument();
  });

  it("accepte une autre couleur de la palette", () => {
    renderSpinner(<Spinner color="primary" />);
    expect(screen.getByRole("progressbar").className).toContain("colorPrimary");
  });

  it("epaissit le trait sur les petites tailles", () => {
    const epaisseur = (size: "small" | "medium" | "large") => {
      const { container, unmount } = renderSpinner(<Spinner size={size} />);
      const cercle = container.querySelector("circle");
      const valeur = Number(cercle?.getAttribute("stroke-width"));
      unmount();
      return valeur;
    };
    expect(epaisseur("small")).toBeGreaterThan(epaisseur("medium"));
    expect(epaisseur("medium")).toBeGreaterThan(epaisseur("large"));
  });

  it("definit son degrade dans le document, avec les trois teintes de la couleur", () => {
    const { container } = renderSpinner(<Spinner color="primary" />);
    const stops = Array.from(container.querySelectorAll("defs stop"));
    expect(stops).toHaveLength(3);
    expect(stops.map((stop) => stop.getAttribute("style"))).toEqual([
      "stop-color: var(--canop-palette-primary-light);",
      "stop-color: var(--canop-palette-primary-main);",
      "stop-color: var(--canop-palette-primary-dark);",
    ]);
  });

  it("donne un identifiant distinct a chaque instance", () => {
    const { container } = renderSpinner(
      <>
        <Spinner color="primary" />
        <Spinner color="success" />
      </>,
    );
    const ids = Array.from(container.querySelectorAll("linearGradient")).map((g) => g.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    for (const id of ids) expect(id).toMatch(/^canop-spinner-[A-Za-z0-9_-]+$/);
  });

  it("garde son degrade hors du champ des technologies d'assistance", () => {
    const { container } = renderSpinner(<Spinner />);
    const defs = container.querySelector("svg[aria-hidden]");
    expect(defs).not.toBeNull();
    expect(defs?.querySelector("linearGradient")).not.toBeNull();
  });
});
