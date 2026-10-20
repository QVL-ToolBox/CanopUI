import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { PageContent } from "../PageContent";

function mockMatchMedia(matcher: (query: string) => boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matcher(query),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function restoreMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: undefined,
  });
}

function renderContent(ui: React.ReactElement) {
  return render(
    <CanopI18nProvider locale="fr" messages={{ fr: {}, en: {} }}>
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function column() {
  return screen.getByRole("heading").parentElement as HTMLElement;
}

function container() {
  return column().parentElement as HTMLElement;
}

describe("PageContent", () => {
  it("affiche le titre, le contenu et le pied", () => {
    renderContent(
      <PageContent title="Connexion" footer={<a href="/register">Créer un compte</a>}>
        <p>contenu de la page</p>
      </PageContent>,
    );

    expect(screen.getByRole("heading", { name: "Connexion" })).toBeInTheDocument();
    expect(screen.getByText("contenu de la page")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Créer un compte" })).toBeInTheDocument();
  });

  it("ne rend aucun heading sans prop title", () => {
    renderContent(
      <PageContent>
        <p>contenu</p>
      </PageContent>,
    );
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("ne rend aucun utilitaire de theme, langue ou menu", () => {
    renderContent(
      <PageContent title="Connexion">
        <p>contenu</p>
      </PageContent>,
    );
    expect(screen.queryByRole("radiogroup", { name: "Thème" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Langue")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Ouvrir le menu" })).not.toBeInTheDocument();
  });

  describe("sur mobile", () => {
    afterEach(restoreMatchMedia);

    it("ne rend aucun utilitaire de theme, langue ou menu", () => {
      mockMatchMedia((query) => query.includes("max-width") || query.includes("down"));
      renderContent(
        <PageContent title="Connexion">
          <p>contenu</p>
        </PageContent>,
      );
      expect(screen.queryByRole("radiogroup", { name: "Thème" })).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Langue")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Ouvrir le menu" })).not.toBeInTheDocument();
    });
  });

  describe("largeur de colonne", () => {
    it("applique 80rem par défaut (lg)", () => {
      renderContent(
        <PageContent title="Titre">
          <p>contenu</p>
        </PageContent>,
      );
      expect(column()).toHaveStyle({ maxWidth: "80rem" });
    });

    it("applique 48rem pour sm", () => {
      renderContent(
        <PageContent title="Titre" maxWidth="sm">
          <p>contenu</p>
        </PageContent>,
      );
      expect(column()).toHaveStyle({ maxWidth: "48rem" });
    });

    it("applique 64rem pour md", () => {
      renderContent(
        <PageContent title="Titre" maxWidth="md">
          <p>contenu</p>
        </PageContent>,
      );
      expect(column()).toHaveStyle({ maxWidth: "64rem" });
    });

    it("applique 80rem pour lg", () => {
      renderContent(
        <PageContent title="Titre" maxWidth="lg">
          <p>contenu</p>
        </PageContent>,
      );
      expect(column()).toHaveStyle({ maxWidth: "80rem" });
    });

    it("n'applique aucune largeur max pour full", () => {
      renderContent(
        <PageContent title="Titre" maxWidth="full">
          <p>contenu</p>
        </PageContent>,
      );
      expect(column().style.maxWidth).toBe("");
    });
  });

  describe("alignement", () => {
    it("aligne à gauche par défaut", () => {
      renderContent(
        <PageContent title="Titre">
          <p>contenu</p>
        </PageContent>,
      );
      expect(column()).toHaveStyle({ textAlign: "left" });
    });

    it("aligne au centre avec align=center", () => {
      renderContent(
        <PageContent title="Titre" align="center">
          <p>contenu</p>
        </PageContent>,
      );
      expect(column()).toHaveStyle({ textAlign: "center" });
    });
  });

  describe("gestion du défilement", () => {
    it("masque le débordement avec fillHeight", () => {
      renderContent(
        <PageContent title="Titre" fillHeight>
          <p>contenu</p>
        </PageContent>,
      );
      expect(container()).toHaveStyle({ overflow: "hidden" });
    });

    it("autorise le défilement vertical sans fillHeight", () => {
      renderContent(
        <PageContent title="Titre">
          <p>contenu</p>
        </PageContent>,
      );
      expect(container()).toHaveStyle({ overflowY: "auto" });
    });

    it("supprime le padding bas et n'impose aucun débordement avec hugContent", () => {
      renderContent(
        <PageContent title="Titre" hugContent>
          <p>contenu</p>
        </PageContent>,
      );
      expect(container()).toHaveStyle({ paddingBottom: "0px" });
      expect(container()).not.toHaveStyle({ overflow: "hidden" });
    });
  });

  describe("mouvement réduit", () => {
    afterEach(restoreMatchMedia);

    it("rend le bloc immédiatement visible sans transform initiale", () => {
      mockMatchMedia((query) => query.includes("prefers-reduced-motion"));
      renderContent(
        <PageContent title="Titre">
          <p>contenu</p>
        </PageContent>,
      );
      expect(column()).not.toHaveStyle({ opacity: "0" });
      expect(column().style.transform).not.toContain("translate");
    });
  });
});
