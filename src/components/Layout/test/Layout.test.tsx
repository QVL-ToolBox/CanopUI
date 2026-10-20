import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Layout } from "../Layout";

function renderLayout(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function renderLayoutWithLocales(ui: React.ReactElement) {
  return render(
    <CanopI18nProvider locale="fr" messages={{ fr: {}, en: {} }}>
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function card() {
  return screen.getByText("Contenu").closest(".MuiCard-root") as HTMLElement;
}

function cardWrapper() {
  return card().parentElement as HTMLElement;
}

describe("Layout", () => {
  it("rend le contenu dans un main", () => {
    renderLayout(<Layout>Contenu de page</Layout>);
    expect(screen.getByRole("main")).toHaveTextContent("Contenu de page");
  });

  it("affiche le brand CustHome par défaut en h1", () => {
    renderLayout(<Layout>Contenu</Layout>);
    expect(screen.getByRole("heading", { level: 1, name: "CustHome" })).toBeInTheDocument();
  });

  it("permet de personnaliser le brand", () => {
    renderLayout(<Layout brand="HealthServ">Contenu</Layout>);
    expect(screen.getByRole("heading", { level: 1, name: "HealthServ" })).toBeInTheDocument();
  });

  it("affiche le logo à côté du brand", () => {
    renderLayout(<Layout logo={<svg data-testid="logo" />}>Contenu</Layout>);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "CustHome" })).toBeInTheDocument();
  });

  it("remplace le brand par un header personnalisé", () => {
    renderLayout(<Layout header={<nav>Menu portail</nav>}>Contenu</Layout>);
    expect(screen.getByText("Menu portail")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("masque le header avec header={null}", () => {
    renderLayout(<Layout header={null}>Contenu</Layout>);
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("n'affiche qu'un seul h1 en l'absence de header personnalisé", () => {
    renderLayout(<Layout>Contenu</Layout>);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("rend le contenu dans une carte flottante unique", () => {
    renderLayout(<Layout>Contenu</Layout>);
    expect(card()).toBeInTheDocument();
    expect(card()).toHaveTextContent("Contenu");
  });

  it("contraint la largeur de la carte à 23.75rem par défaut", () => {
    renderLayout(<Layout>Contenu</Layout>);
    expect(cardWrapper()).toHaveStyle({ maxWidth: "23.75rem", width: "100%" });
  });

  it("accepte une largeur personnalisée en rem", () => {
    renderLayout(<Layout maxWidth="31.25rem">Contenu</Layout>);
    expect(cardWrapper()).toHaveStyle({ maxWidth: "31.25rem" });
  });

  it("affiche le ThemeToggle par défaut", () => {
    renderLayout(<Layout>Contenu</Layout>);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("n'affiche pas de LanguageSelector avec une seule locale", () => {
    renderLayout(<Layout>Contenu</Layout>);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("affiche le LanguageSelector à partir de deux locales", () => {
    renderLayoutWithLocales(<Layout>Contenu</Layout>);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("masque les utilitaires avec showUtilities={false}", () => {
    renderLayoutWithLocales(<Layout showUtilities={false}>Contenu</Layout>);
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("rend les utilitaires en dehors de la carte", () => {
    renderLayoutWithLocales(<Layout>Contenu</Layout>);
    const inCard = within(card());
    expect(inCard.queryByRole("switch")).not.toBeInTheDocument();
    expect(inCard.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
