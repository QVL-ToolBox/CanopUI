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

const nestedItems: CanopNavbarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "apps" },
  {
    label: "Studio",
    href: "/studio",
    icon: "apps",
    children: [
      { label: "CanopUI", href: "/studio/canopui", icon: "folder" },
      { label: "PipeBoard", href: "/studio/pipeboard", icon: "folder" },
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

describe("Navbar mobile — rendu des sous-items", () => {
  beforeEach(() => {
    mockMatchMedia(true);
  });

  it("rend un item sans enfant comme lien direct", () => {
    renderNavbar(
      <Navbar items={nestedItems} activeHref="/dashboard">
        Contenu
      </Navbar>,
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("rend un item avec enfants comme declencheur de panneau replie par defaut", () => {
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

    expect(await screen.findByRole("link", { name: "Studio" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "CanopUI" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "PipeBoard" })).toBeInTheDocument();
  });

  it("notifie onNavigate au clic sur un sous-item et referme le panneau", async () => {
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
  });
});
