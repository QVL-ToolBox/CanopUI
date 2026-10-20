import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { PageScaffold } from "../PageScaffold";
import type { CanopNavbarItem } from "../../Navbar";

const MOBILE = 25;
const ENTRE_SM_ET_MD = 48;
const BUREAU = 100;

function correspond(query: string, largeurRem: number): boolean {
  if (query.includes("prefers-")) return false;
  const min = /min-width:\s*([\d.]+)rem/.exec(query);
  const max = /max-width:\s*([\d.]+)rem/.exec(query);
  if (min && largeurRem < Number(min[1])) return false;
  if (max && largeurRem > Number(max[1])) return false;
  return true;
}

function poserLargeur(largeurRem: number) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: correspond(query, largeurRem),
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

const items: CanopNavbarItem[] = [{ label: "Accueil", href: "/", icon: "apps" }];

function poser(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function poserCoquille(largeurRem: number, placement?: "header" | "floating") {
  poserLargeur(largeurRem);
  poser(
    <PageScaffold
      title="Entraînement"
      items={items}
      headerActions={<button>Son</button>}
      {...(placement ? { actionsPlacement: placement } : {})}
    >
      <p>contenu</p>
    </PageScaffold>,
  );
}

function actions() {
  return screen.getAllByRole("button", { name: "Son" });
}

function enTete() {
  return screen.getByRole("banner");
}

describe("PageScaffold — actionsPlacement", () => {
  it("laisse les actions dans l'en-tête de page par défaut", () => {
    poserCoquille(BUREAU);
    expect(actions()).toHaveLength(1);
    expect(within(enTete()).getByRole("button", { name: "Son" })).toBeInTheDocument();
  });

  it("laisse les actions dans l'en-tête quand le placement est explicitement header", () => {
    poserCoquille(BUREAU, "header");
    expect(within(enTete()).getByRole("button", { name: "Son" })).toBeInTheDocument();
  });

  it("sort les actions de l'en-tête en mobile", () => {
    poserCoquille(MOBILE, "floating");
    expect(actions()).toHaveLength(1);
    expect(within(enTete()).queryByRole("button", { name: "Son" })).toBeNull();
  });

  it("sort les actions de l'en-tête en rail, entre sm et md", () => {
    poserCoquille(ENTRE_SM_ET_MD, "floating");
    expect(actions()).toHaveLength(1);
    expect(within(enTete()).queryByRole("button", { name: "Son" })).toBeNull();
  });

  it("sort les actions de l'en-tête en sidebar", () => {
    poserCoquille(BUREAU, "floating");
    expect(actions()).toHaveLength(1);
    expect(within(enTete()).queryByRole("button", { name: "Son" })).toBeNull();
  });
});
