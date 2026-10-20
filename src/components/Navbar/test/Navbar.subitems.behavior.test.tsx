import { describe, expect, it, vi, beforeEach } from "vitest";
import { useState } from "react";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Navbar, type CanopNavbarItem } from "../Navbar";

function mockMatchMedia(mobile: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: mobile,
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
      { label: "CanopUI", href: "/studio/canopui" },
      { label: "PipeBoard", href: "/studio/pipeboard" },
    ],
  },
  {
    label: "CustHome",
    href: "/custhome",
    icon: "home",
    children: [{ label: "CasaPlan", href: "/custhome/casaplan" }],
  },
];

function renderNavbar(ui: React.ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("Navbar sous-items — a11y et cycle de vie", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("n'expose pas aria-controls quand le panneau est replie", () => {
    renderNavbar(
      <Navbar items={nestedItems} activeHref="/dashboard">
        Contenu
      </Navbar>,
    );
    const parent = screen.getByRole("link", { name: "Studio" });
    expect(parent).toHaveAttribute("aria-expanded", "false");
    expect(parent).not.toHaveAttribute("aria-controls");
  });

  it("expose aria-controls vers un panneau existant quand deploye", () => {
    renderNavbar(
      <Navbar items={nestedItems} activeHref="/studio/canopui">
        Contenu
      </Navbar>,
    );
    const parent = screen.getByRole("link", { name: "Studio" });
    expect(parent).toHaveAttribute("aria-expanded", "true");
    const controlsId = parent.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();
    expect(document.getElementById(controlsId as string)).toBeInTheDocument();
  });

  it("permet de refermer une section active", async () => {
    const user = userEvent.setup();
    renderNavbar(
      <Navbar items={nestedItems} activeHref="/studio/canopui" onNavigate={vi.fn()}>
        Contenu
      </Navbar>,
    );
    const parent = screen.getByRole("link", { name: "Studio" });
    expect(screen.getByRole("link", { name: "CanopUI" })).toBeInTheDocument();
    await user.click(parent);
    expect(parent).toHaveAttribute("aria-expanded", "false");
    await waitForElementToBeRemoved(() => screen.queryByRole("link", { name: "CanopUI" }));
  });

  it("reinitialise l'etat d'ouverture quand la navigation change de section", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [active, setActive] = useState("/studio/canopui");
      return (
        <Navbar items={nestedItems} activeHref={active} onNavigate={setActive}>
          Contenu
        </Navbar>
      );
    }
    renderNavbar(<Harness />);

    expect(screen.getByRole("link", { name: "CanopUI" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "CasaPlan" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "CustHome" }));

    expect(screen.getByRole("link", { name: "Studio" })).toHaveAttribute("aria-expanded", "false");
    await waitForElementToBeRemoved(() => screen.queryByRole("link", { name: "CanopUI" }));
    expect(await screen.findByRole("link", { name: "CasaPlan" })).toBeInTheDocument();
  });
});
