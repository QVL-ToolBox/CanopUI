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

const jauge = <span>Jauge stockage</span>;

function renderNavbar(ui: React.ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("Navbar sidebarWidget", () => {
  describe("desktop", () => {
    beforeEach(() => {
      mockMatchMedia(false);
    });

    it("rend le widget dans la sidebar", () => {
      renderNavbar(
        <Navbar items={items} sidebarWidget={jauge}>
          Contenu
        </Navbar>,
      );
      expect(screen.getByText("Jauge stockage")).toBeInTheDocument();
    });

    it("retro-compat: n'affiche rien de plus sans widget", () => {
      renderNavbar(<Navbar items={items}>Contenu</Navbar>);
      expect(screen.queryByText("Jauge stockage")).not.toBeInTheDocument();
    });
  });

  describe("mobile", () => {
    beforeEach(() => {
      mockMatchMedia(true);
    });

    it("rend le widget en encart flottant hors du menu", async () => {
      const user = userEvent.setup();
      renderNavbar(
        <Navbar items={items} sidebarWidget={jauge}>
          Contenu
        </Navbar>,
      );
      expect(screen.getByText("Jauge stockage")).toBeInTheDocument();
      await user.click(screen.getByLabelText("Ouvrir le menu"));
      const dialog = await screen.findByRole("presentation");
      expect(within(dialog).queryByText("Jauge stockage")).not.toBeInTheDocument();
    });
  });
});

describe("Navbar settingsFooter - porte du bouton info", () => {
  describe("mobile", () => {
    beforeEach(() => {
      mockMatchMedia(true);
    });

    it("settingsFooter fournit la porte du bouton info meme en placement floating", async () => {
      const user = userEvent.setup();
      renderNavbar(
        <Navbar items={items} settingsFooter={<span>Reglages</span>} infoHref="/cgu">
          Contenu
        </Navbar>,
      );
      await user.click(screen.getByLabelText("Ouvrir le menu"));
      const info = await screen.findByRole("link", { name: "Informations légales" });
      expect(info).toHaveAttribute("href", "/cgu");
    });

    it("sans infoHref settingsFooter ne suffit pas a afficher le bouton info", async () => {
      const user = userEvent.setup();
      renderNavbar(
        <Navbar items={items} settingsFooter={<span>Reglages</span>}>
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

  describe("desktop", () => {
    beforeEach(() => {
      mockMatchMedia(false);
    });

    it("n'expose aucun bouton de menu reglages", () => {
      renderNavbar(
        <Navbar items={items} settingsFooter={<span>Reglages</span>} infoHref="/cgu">
          Contenu
        </Navbar>,
      );
      expect(screen.queryByLabelText("Ouvrir le menu")).not.toBeInTheDocument();
    });
  });
});
