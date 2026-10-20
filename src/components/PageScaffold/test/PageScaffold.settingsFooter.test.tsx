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

const jauge = <span>Jauge stockage</span>;

function renderScaffold(ui: React.ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("PageScaffold - forward sidebarWidget", () => {
  describe("desktop", () => {
    beforeEach(() => {
      mockMatchMedia(false);
    });

    it("forwarde le widget dans la sidebar", () => {
      renderScaffold(
        <PageScaffold items={items} sidebarWidget={jauge}>
          <p>contenu</p>
        </PageScaffold>,
      );
      expect(screen.getByText("Jauge stockage")).toBeInTheDocument();
    });
  });

  describe("mobile", () => {
    beforeEach(() => {
      mockMatchMedia(true);
    });

    it("forwarde le widget en encart flottant hors du menu", async () => {
      const user = userEvent.setup();
      renderScaffold(
        <PageScaffold items={items} sidebarWidget={jauge}>
          <p>contenu</p>
        </PageScaffold>,
      );
      expect(screen.getByText("Jauge stockage")).toBeInTheDocument();
      await user.click(screen.getByLabelText("Ouvrir le menu"));
      const dialog = await screen.findByRole("presentation");
      expect(within(dialog).queryByText("Jauge stockage")).not.toBeInTheDocument();
    });
  });
});
