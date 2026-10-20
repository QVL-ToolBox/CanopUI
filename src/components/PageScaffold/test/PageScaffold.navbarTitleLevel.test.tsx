import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { PageScaffold } from "../PageScaffold";
import type { CanopNavbarItem, CanopNavbarTitleLevel } from "../../Navbar";

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

function renderScaffold(navbarTitleLevel?: CanopNavbarTitleLevel) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>
        <PageScaffold
          title="Utilisateurs"
          navbarTitle="CustHome"
          navbarTitleLevel={navbarTitleLevel}
          items={items}
        >
          <p>contenu</p>
        </PageScaffold>
      </CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("PageScaffold - navbarTitleLevel", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("given no navbarTitleLevel, when rendered, then the navbar title stays an h1", () => {
    renderScaffold();
    expect(screen.getByRole("heading", { level: 1, name: "CustHome" })).toBeInTheDocument();
  });

  it("given navbarTitleLevel=2, when rendered, then the page title is the only h1", () => {
    renderScaffold(2);
    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent("Utilisateurs");
    expect(screen.getByRole("heading", { level: 2, name: "CustHome" })).toBeInTheDocument();
  });

  it("given navbarTitleLevel=text, when rendered, then the navbar title is no heading", () => {
    renderScaffold("text");
    expect(screen.queryByRole("heading", { name: "CustHome" })).toBeNull();
    expect(screen.getByText("CustHome")).toBeInTheDocument();
  });
});
