import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../theme";
import { CanopI18nProvider } from "../../i18n";
import { Navbar, type CanopNavbarItem } from "../../components/Navbar/Navbar";
import { NavbarMobileLayout } from "../../components/Navbar/NavbarMobileLayout";
import { squircleSurface } from "../squircleSx";

function mockMatchMediaMobile() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: true,
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

function attendUnPlacementFixe(element: HTMLElement) {
  expect(window.getComputedStyle(element).position).toBe("fixed");
}

const items: CanopNavbarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "apps" },
  { label: "Studio", href: "/studio", icon: "apps" },
];

function renderMobile(ui: React.ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("squircleSurface — option de positionnement", () => {
  it("adopte la position demandée", () => {
    expect(squircleSurface({ radius: "1rem", position: "fixed" }).position).toBe("fixed");
  });

  it("retombe sur relative quand aucune position n'est demandée", () => {
    expect(squircleSurface({ radius: "1rem" }).position).toBe("relative");
  });

  it("écrase volontairement une position posée en amont, ce qui impose de passer par l'option", () => {
    const fusion = { position: "fixed", ...squircleSurface({ radius: "1rem" }) };
    expect(fusion.position).toBe("relative");
  });
});

describe("squircleSurface — placement réel des surfaces fixes de la navbar mobile", () => {
  beforeEach(() => {
    mockMatchMediaMobile();
  });

  it("laisse la barre de navigation mobile en position fixe", () => {
    renderMobile(
      <Navbar items={items} activeHref="/dashboard">
        Contenu
      </Navbar>,
    );
    attendUnPlacementFixe(screen.getByRole("navigation"));
  });

  it("laisse le bouton du menu de réglages en position fixe", () => {
    renderMobile(
      <Navbar items={items} activeHref="/dashboard">
        Contenu
      </Navbar>,
    );
    attendUnPlacementFixe(screen.getByRole("button", { name: "Ouvrir le menu" }));
  });

  it("laisse le widget latéral mobile en position fixe", () => {
    renderMobile(
      <NavbarMobileLayout
        items={items}
        activeHref="/dashboard"
        height="100vh"
        sidebarWidget={<span data-testid="widget">Widget</span>}
      >
        Contenu
      </NavbarMobileLayout>,
    );
    const conteneur = screen.getByTestId("widget").parentElement as HTMLElement;
    attendUnPlacementFixe(conteneur);
  });
});
