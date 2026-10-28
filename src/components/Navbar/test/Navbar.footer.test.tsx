import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
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
];

function renderNavbar(ui: React.ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("Navbar footer legal", () => {
  describe("desktop", () => {
    beforeEach(() => {
      mockMatchMedia(false);
    });

    it("ne rend pas le footer dans la sidebar", () => {
      renderNavbar(
        <Navbar items={items} footer={<span>Footer legal</span>} infoHref="/cgu">
          Contenu
        </Navbar>,
      );
      expect(screen.queryByText("Footer legal")).not.toBeInTheDocument();
    });

    it("n'expose aucun bouton d'ouverture de menu reglages", () => {
      renderNavbar(
        <Navbar items={items} footer={<span>Footer legal</span>} infoHref="/cgu">
          Contenu
        </Navbar>,
      );
      expect(screen.queryByLabelText("Ouvrir le menu")).not.toBeInTheDocument();
    });
  });

  describe("mobile - placement settings", () => {
    beforeEach(() => {
      mockMatchMedia(true);
    });

    it("expose un bouton info-lien vers infoHref dans le menu de settings", async () => {
      const user = userEvent.setup();
      renderNavbar(
        <Navbar
          items={items}
          footer={<span>Footer legal</span>}
          infoHref="/cgu"
          mobileFooterPlacement="settings"
        >
          Contenu
        </Navbar>,
      );
      await user.click(screen.getByLabelText("Ouvrir le menu"));
      const info = await screen.findByRole("link", { name: "Informations légales" });
      expect(info).toHaveAttribute("href", "/cgu");
    });

    it("affiche le contenu du footer dans le menu de settings", async () => {
      const user = userEvent.setup();
      renderNavbar(
        <Navbar
          items={items}
          footer={<span>Footer legal</span>}
          infoHref="/cgu"
          mobileFooterPlacement="settings"
        >
          Contenu
        </Navbar>,
      );
      await user.click(screen.getByLabelText("Ouvrir le menu"));
      const dialog = await screen.findByRole("presentation");
      expect(within(dialog).getByText("Footer legal")).toBeInTheDocument();
    });

    it("n'affiche pas de bouton info sans infoHref", async () => {
      const user = userEvent.setup();
      renderNavbar(
        <Navbar items={items} footer={<span>Footer legal</span>} mobileFooterPlacement="settings">
          Contenu
        </Navbar>,
      );
      await user.click(screen.getByLabelText("Ouvrir le menu"));
      const dialog = await screen.findByRole("presentation");
      expect(
        within(dialog).queryByRole("link", { name: "Informations légales" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("mobile - placement floating par defaut", () => {
    beforeEach(() => {
      mockMatchMedia(true);
    });

    it("ne rend aucun footer flottant hors du menu", () => {
      renderNavbar(
        <Navbar items={items} footer={<span>Footer legal</span>} infoHref="/cgu">
          Contenu
        </Navbar>,
      );
      expect(screen.queryByText("Footer legal")).not.toBeInTheDocument();
    });

    it("n'expose pas de bouton info dans le menu en mode floating", async () => {
      const user = userEvent.setup();
      renderNavbar(
        <Navbar items={items} footer={<span>Footer legal</span>} infoHref="/cgu">
          Contenu
        </Navbar>,
      );
      await user.click(screen.getByLabelText("Ouvrir le menu"));
      const dialog = await screen.findByRole("presentation");
      expect(
        within(dialog).queryByRole("link", { name: "Informations légales" }),
      ).not.toBeInTheDocument();
    });
  });
});
