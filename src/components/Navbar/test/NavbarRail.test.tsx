import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Navbar, type CanopNavbarItem } from "../Navbar";

function mockMatchMedia(matches: (query: string) => boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matches(query),
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

const isTabletViewport = (query: string) => query.includes("min-width");
const isReducedMotion = (query: string) => query.includes("prefers-reduced-motion");

const items: CanopNavbarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "apps" },
  { label: "Utilisateurs", href: "/users", icon: "user" },
  { label: "Roles", href: "/roles" },
];

const nestedItems: CanopNavbarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "apps" },
  {
    label: "Studio",
    href: "/studio",
    icon: "apps",
    children: [
      { label: "CanopUI", href: "/studio/canopui", icon: "folder" },
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

describe("NavbarRail (tablette)", () => {
  beforeEach(() => {
    mockMatchMedia(isTabletViewport);
  });

  it("rend le rail de navigation et le contenu principal", () => {
    renderNavbar(<Navbar items={items}>Contenu de page</Navbar>);
    expect(screen.getByRole("navigation", { name: "Navigation principale" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("Contenu de page");
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Roles" })).toBeInTheDocument();
  });

  it("marque l'item actif avec aria-current", () => {
    renderNavbar(
      <Navbar items={items} activeHref="/users/42">
        Contenu
      </Navbar>,
    );
    expect(screen.getByRole("link", { name: "Utilisateurs" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute("aria-current");
  });

  it("notifie onNavigate au clic sur un item sans enfant", async () => {
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

  describe("items a sous-items", () => {
    it("rend un declencheur replie tant que le popover est ferme", () => {
      renderNavbar(
        <Navbar items={nestedItems} activeHref="/dashboard">
          Contenu
        </Navbar>,
      );
      const trigger = screen.getByRole("button", { name: "Studio" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(screen.queryByRole("link", { name: "CanopUI" })).not.toBeInTheDocument();
    });

    it("ouvre un panneau accessible listant la section et ses sous-items", async () => {
      const user = userEvent.setup();
      renderNavbar(
        <Navbar items={nestedItems} activeHref="/dashboard">
          Contenu
        </Navbar>,
      );
      const trigger = screen.getByRole("button", { name: "Studio" });
      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      const controlsId = trigger.getAttribute("aria-controls");
      expect(controlsId).toBeTruthy();
      expect(document.getElementById(controlsId as string)).toBeInTheDocument();
      expect(await screen.findByRole("link", { name: "CanopUI" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "PipeBoard" })).toBeInTheDocument();
    });

    it("notifie onNavigate au clic sur un sous-item puis referme le panneau", async () => {
      const user = userEvent.setup();
      const onNavigate = vi.fn();
      renderNavbar(
        <Navbar items={nestedItems} activeHref="/dashboard" onNavigate={onNavigate}>
          Contenu
        </Navbar>,
      );
      await user.click(screen.getByRole("button", { name: "Studio" }));
      await user.click(await screen.findByRole("link", { name: "PipeBoard" }));
      expect(onNavigate).toHaveBeenCalledWith("/studio/pipeboard");
      expect(screen.getByRole("button", { name: "Studio" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("marque le sous-item actif quand activeHref cible un enfant", async () => {
      const user = userEvent.setup();
      renderNavbar(
        <Navbar items={nestedItems} activeHref="/studio/canopui">
          Contenu
        </Navbar>,
      );
      await user.click(screen.getByRole("button", { name: "Studio" }));
      expect(await screen.findByRole("link", { name: "CanopUI" })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });
  });

  describe("reglages du rail", () => {
    it("SCRUM-414 : ne rend aucun declencheur de reglages sans userName ni onLogout", () => {
      renderNavbar(<Navbar items={items}>Contenu</Navbar>);
      expect(screen.queryByLabelText("Ouvrir le menu")).not.toBeInTheDocument();
    });

    it("SCRUM-414 : la tabulation ne rencontre aucun popover vide", async () => {
      const user = userEvent.setup();
      renderNavbar(<Navbar items={items}>Contenu</Navbar>);
      await user.tab();
      await user.tab();
      await user.tab();
      await user.tab();
      expect(document.activeElement).not.toHaveAttribute("aria-haspopup", "dialog");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("rend le declencheur des que userName est fourni", async () => {
      const user = userEvent.setup();
      renderNavbar(
        <Navbar items={items} userName="John Doe">
          Contenu
        </Navbar>,
      );
      await user.click(screen.getByLabelText("Ouvrir le menu"));
      const panel = await screen.findByRole("dialog", { name: "Ouvrir le menu" });
      expect(within(panel).getByText("John Doe")).toBeInTheDocument();
      expect(within(panel).queryByRole("button", { name: "Déconnexion" })).not.toBeInTheDocument();
    });

    it("rend le declencheur des que onLogout est fourni", async () => {
      const user = userEvent.setup();
      const onLogout = vi.fn();
      renderNavbar(
        <Navbar items={items} onLogout={onLogout}>
          Contenu
        </Navbar>,
      );
      await user.click(screen.getByLabelText("Ouvrir le menu"));
      const panel = await screen.findByRole("dialog", { name: "Ouvrir le menu" });
      expect(within(panel).queryByText("John Doe")).not.toBeInTheDocument();
      await user.click(within(panel).getByRole("button", { name: "Déconnexion" }));
      expect(onLogout).toHaveBeenCalledOnce();
    });

    it("expose l'etat du popover sur le declencheur", async () => {
      const user = userEvent.setup();
      renderNavbar(
        <Navbar items={items} userName="John Doe" onLogout={vi.fn()}>
          Contenu
        </Navbar>,
      );
      const trigger = screen.getByLabelText("Ouvrir le menu");
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      const panel = await screen.findByRole("dialog", { name: "Ouvrir le menu" });
      expect(trigger).toHaveAttribute("aria-controls", panel.id);
    });
  });

  describe("mouvement reduit", () => {
    beforeEach(() => {
      mockMatchMedia((query) => isTabletViewport(query) || isReducedMotion(query));
    });

    it("ouvre le panneau des sous-items sans transition", async () => {
      const user = userEvent.setup();
      renderNavbar(
        <Navbar items={nestedItems} activeHref="/studio">
          Contenu
        </Navbar>,
      );
      await user.click(screen.getByRole("button", { name: "Studio" }));
      expect(await screen.findByRole("link", { name: "CanopUI" })).toBeInTheDocument();
    });
  });
});
