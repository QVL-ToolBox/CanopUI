import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Navbar, type CanopNavbarItem } from "../Navbar";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
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

const items: CanopNavbarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "apps" },
  { label: "Utilisateurs", href: "/users", icon: "user" },
  { label: "Roles", href: "/roles" },
];

function renderNavbar(ui: React.ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("rend les items de navigation", () => {
    renderNavbar(<Navbar items={items}>Contenu</Navbar>);
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Utilisateurs" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Roles" })).toBeInTheDocument();
  });

  it("rend le contenu principal dans un main", () => {
    renderNavbar(<Navbar items={items}>Contenu de page</Navbar>);
    expect(screen.getByRole("main")).toHaveTextContent("Contenu de page");
  });

  it("affiche le userName dans le footer", () => {
    renderNavbar(
      <Navbar items={items} userName="John Doe">
        Contenu
      </Navbar>,
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("affiche le bouton deconnexion quand onLogout est fourni", () => {
    renderNavbar(
      <Navbar items={items} onLogout={vi.fn()}>
        Contenu
      </Navbar>,
    );
    expect(screen.getByLabelText("Déconnexion")).toBeInTheDocument();
  });

  it("appelle onLogout au clic sur deconnexion", async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();
    renderNavbar(
      <Navbar items={items} onLogout={onLogout}>
        Contenu
      </Navbar>,
    );
    await user.click(screen.getByLabelText("Déconnexion"));
    expect(onLogout).toHaveBeenCalledOnce();
  });

  it("appelle onNavigate au clic sur un item", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    renderNavbar(
      <Navbar items={items} onNavigate={onNavigate}>
        Contenu
      </Navbar>,
    );
    await user.click(screen.getByRole("link", { name: "Utilisateurs" }));
    expect(onNavigate).toHaveBeenCalledWith("/users");
  });

  it("previent la navigation par defaut quand onNavigate est fourni", async () => {
    const user = userEvent.setup();
    renderNavbar(
      <Navbar items={items} onNavigate={vi.fn()}>
        Contenu
      </Navbar>,
    );
    const link = screen.getByRole("link", { name: "Dashboard" });
    await user.click(link);
    expect(link).toBeInTheDocument();
  });

  it("detecte l'item actif par correspondance exacte", () => {
    renderNavbar(
      <Navbar items={items} activeHref="/users">
        Contenu
      </Navbar>,
    );
    const activeLink = screen.getByRole("link", { name: "Utilisateurs" });
    expect(activeLink).toHaveStyle({ fontWeight: 600 });
  });

  it("detecte l'item actif par prefix de sous-route", () => {
    renderNavbar(
      <Navbar items={items} activeHref="/users/42/edit">
        Contenu
      </Navbar>,
    );
    const activeLink = screen.getByRole("link", { name: "Utilisateurs" });
    expect(activeLink).toHaveStyle({ fontWeight: 600 });
  });

  it("ne marque pas '/' comme actif pour toutes les routes", () => {
    const homeItems: CanopNavbarItem[] = [{ label: "Accueil", href: "/" }, ...items];
    renderNavbar(
      <Navbar items={homeItems} activeHref="/dashboard">
        Contenu
      </Navbar>,
    );
    const homeLink = screen.getByRole("link", { name: "Accueil" });
    expect(homeLink).not.toHaveStyle({ fontWeight: 600 });
  });

  it("n'affiche pas le footer sans userName ni onLogout", () => {
    renderNavbar(<Navbar items={items}>Contenu</Navbar>);
    expect(screen.queryByText("Déconnexion")).not.toBeInTheDocument();
  });

  describe("mobile", () => {
    beforeEach(() => {
      mockMatchMedia(true);
    });

    it("affiche un burger et les items de navigation (barre du bas)", () => {
      renderNavbar(<Navbar items={items}>Contenu</Navbar>);
      expect(screen.getByLabelText("Ouvrir le menu")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Utilisateurs" })).toBeInTheDocument();
    });

    it("ouvre un menu avec déconnexion au clic sur le burger", async () => {
      const user = userEvent.setup();
      const onLogout = vi.fn();
      renderNavbar(
        <Navbar items={items} onLogout={onLogout}>
          Contenu
        </Navbar>,
      );
      await user.click(screen.getByLabelText("Ouvrir le menu"));
      await user.click(await screen.findByRole("button", { name: "Déconnexion" }));
      expect(onLogout).toHaveBeenCalledOnce();
    });
  });
});
