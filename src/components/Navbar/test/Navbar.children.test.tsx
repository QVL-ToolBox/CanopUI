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

const flatItems: CanopNavbarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "apps" },
  { label: "Utilisateurs", href: "/users", icon: "user" },
];

const nestedItems: CanopNavbarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "apps" },
  {
    label: "Studio",
    href: "/studio",
    icon: "apps",
    children: [
      { label: "CanopUI", href: "/studio/canopui" },
      { label: "PipeBoard", href: "/studio/pipeboard" },
    ],
  },
];

function renderNavbar(ui: React.ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("Navbar sous-items", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("rend les items plats sans sous-groupe (retro-compatibilite)", () => {
    renderNavbar(<Navbar items={flatItems}>Contenu</Navbar>);
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Utilisateurs" })).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("n'expose pas aria-expanded sur un item sans sous-items", () => {
    renderNavbar(<Navbar items={flatItems}>Contenu</Navbar>);
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute("aria-expanded");
  });

  it("masque les sous-items quand la section n'est pas active", () => {
    renderNavbar(
      <Navbar items={nestedItems} activeHref="/dashboard">
        Contenu
      </Navbar>,
    );
    expect(screen.getByRole("link", { name: "Studio" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "CanopUI" })).not.toBeInTheDocument();
  });

  it("deploie les sous-items au clic sur le parent", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    renderNavbar(
      <Navbar items={nestedItems} activeHref="/dashboard" onNavigate={onNavigate}>
        Contenu
      </Navbar>,
    );
    await user.click(screen.getByRole("link", { name: "Studio" }));
    expect(onNavigate).toHaveBeenCalledWith("/studio");
    expect(await screen.findByRole("link", { name: "CanopUI" })).toBeInTheDocument();
  });

  it("deploie automatiquement la section active et marque parent et enfant actifs", () => {
    renderNavbar(
      <Navbar items={nestedItems} activeHref="/studio/canopui">
        Contenu
      </Navbar>,
    );
    const parent = screen.getByRole("link", { name: "Studio" });
    const child = screen.getByRole("link", { name: "CanopUI" });
    const sibling = screen.getByRole("link", { name: "PipeBoard" });
    expect(parent).toHaveAttribute("aria-expanded", "true");
    expect(parent).toHaveStyle({ fontWeight: 600 });
    expect(child).toHaveStyle({ fontWeight: 600 });
    expect(sibling).not.toHaveStyle({ fontWeight: 600 });
  });

  it("appelle onNavigate avec le href du sous-item", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    renderNavbar(
      <Navbar items={nestedItems} activeHref="/studio" onNavigate={onNavigate}>
        Contenu
      </Navbar>,
    );
    await user.click(screen.getByRole("link", { name: "PipeBoard" }));
    expect(onNavigate).toHaveBeenCalledWith("/studio/pipeboard");
  });
});
