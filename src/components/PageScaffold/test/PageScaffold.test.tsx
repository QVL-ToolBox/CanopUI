import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
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

const items: CanopNavbarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "apps" },
  { label: "Utilisateurs", href: "/users", icon: "user" },
];

function renderScaffold(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("PageScaffold", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("n'affiche aucun titre par defaut et rend le contenu", () => {
    renderScaffold(
      <PageScaffold items={items}>
        <p>contenu de page</p>
      </PageScaffold>,
    );
    expect(screen.queryByRole("heading", { name: "CustHome" })).toBeNull();
    expect(screen.getByText("contenu de page")).toBeInTheDocument();
  });

  it("affiche le navbarTitle dans la navbar", () => {
    renderScaffold(
      <PageScaffold navbarTitle="CustHome" items={items}>
        <p>x</p>
      </PageScaffold>,
    );
    expect(screen.getByRole("heading", { name: "CustHome" })).toBeInTheDocument();
  });

  it("permet de personnaliser le titre", () => {
    renderScaffold(
      <PageScaffold title="MonPortail" items={items}>
        <p>x</p>
      </PageScaffold>,
    );
    expect(screen.getByRole("heading", { name: "MonPortail" })).toBeInTheDocument();
  });

  it("rend les items de navigation", () => {
    renderScaffold(
      <PageScaffold items={items}>
        <p>x</p>
      </PageScaffold>,
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Utilisateurs" })).toBeInTheDocument();
  });

  it("affiche le userName et le bouton deconnexion", () => {
    renderScaffold(
      <PageScaffold items={items} userName="John Doe" onLogout={vi.fn()}>
        <p>x</p>
      </PageScaffold>,
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Déconnexion" })).toBeInTheDocument();
  });

  it("appelle onNavigate au clic sur un item", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    renderScaffold(
      <PageScaffold items={items} onNavigate={onNavigate}>
        <p>x</p>
      </PageScaffold>,
    );
    await user.click(screen.getByRole("link", { name: "Utilisateurs" }));
    expect(onNavigate).toHaveBeenCalledWith("/users");
  });
});
