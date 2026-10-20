import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { PageScaffold } from "../PageScaffold";
import type { CanopNavbarItem } from "../../Navbar";

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

const items: CanopNavbarItem[] = [{ label: "Dashboard", href: "/dashboard", icon: "apps" }];

function renderScaffold(ui: React.ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("PageScaffold - footer bas de page", () => {
  describe("desktop", () => {
    beforeEach(() => {
      mockMatchMedia(false);
    });

    it("rend le footer dans une zone footer en bas de page", () => {
      renderScaffold(
        <PageScaffold items={items} footer={<span>Footer legal</span>}>
          <p>contenu</p>
        </PageScaffold>,
      );
      const footer = screen.getByText("Footer legal").closest("footer");
      expect(footer).not.toBeNull();
      expect(within(footer as HTMLElement).getByText("Footer legal")).toBeInTheDocument();
    });

    it("n'affiche pas de footer sans la prop footer", () => {
      renderScaffold(
        <PageScaffold items={items}>
          <p>contenu</p>
        </PageScaffold>,
      );
      expect(screen.queryByText("Footer legal")).not.toBeInTheDocument();
    });
  });

  describe("mobile", () => {
    beforeEach(() => {
      mockMatchMedia(true);
    });

    it("ne rend pas de footer en bas de page", () => {
      renderScaffold(
        <PageScaffold items={items} footer={<span>Footer legal</span>}>
          <p>contenu</p>
        </PageScaffold>,
      );
      expect(screen.queryByText("Footer legal")).not.toBeInTheDocument();
    });

    it("forwarde footer, infoHref et placement settings pour exposer le bouton info", async () => {
      const user = userEvent.setup();
      renderScaffold(
        <PageScaffold
          items={items}
          footer={<span>Footer legal</span>}
          infoHref="/cgu"
          mobileFooterPlacement="settings"
        >
          <p>contenu</p>
        </PageScaffold>,
      );
      await user.click(screen.getByLabelText("Ouvrir le menu"));
      const info = await screen.findByRole("link", { name: "Informations légales" });
      expect(info).toHaveAttribute("href", "/cgu");
    });
  });
});

describe("PageScaffold - lien de signalement", () => {
  describe("desktop", () => {
    beforeEach(() => {
      mockMatchMedia(false);
    });

    it("ajoute le lien a la suite du footer du portail", () => {
      renderScaffold(
        <PageScaffold items={items} footer={<span>Footer legal</span>} supportHref="/bug">
          <p>contenu</p>
        </PageScaffold>,
      );

      const footer = screen.getByText("Footer legal").closest("footer") as HTMLElement;
      const lien = within(footer).getByRole("link", { name: "Signaler un bug" });
      expect(lien).toHaveAttribute("href", "/bug");
      expect(footer.textContent?.indexOf("Footer legal")).toBeLessThan(
        footer.textContent?.indexOf("Signaler") ?? -1,
      );
    });

    it("ouvre une zone de pied de page meme sans footer fourni", () => {
      renderScaffold(
        <PageScaffold items={items} supportHref="/bug">
          <p>contenu</p>
        </PageScaffold>,
      );

      expect(screen.getByRole("link", { name: "Signaler un bug" })).toBeInTheDocument();
    });

    it("ne rend rien sans supportHref", () => {
      renderScaffold(
        <PageScaffold items={items} footer={<span>Footer legal</span>}>
          <p>contenu</p>
        </PageScaffold>,
      );

      expect(screen.queryByRole("link", { name: "Signaler un bug" })).not.toBeInTheDocument();
    });
  });

  describe("mobile", () => {
    beforeEach(() => {
      mockMatchMedia(true);
    });

    it("bascule le lien dans la barre de reglages", async () => {
      const user = userEvent.setup();
      renderScaffold(
        <PageScaffold items={items} supportHref="/bug">
          <p>contenu</p>
        </PageScaffold>,
      );

      expect(screen.queryByRole("link", { name: "Signaler un bug" })).not.toBeInTheDocument();
      await user.click(screen.getByLabelText("Ouvrir le menu"));
      expect(screen.getByRole("link", { name: "Signaler un bug" })).toHaveAttribute("href", "/bug");
    });
  });
});
