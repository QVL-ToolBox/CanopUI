import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useTheme } from "@mui/material/styles";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { PageScaffold } from "../PageScaffold";
import type { CanopNavbarItem } from "../../Navbar";
import {
  mockMatchMedia,
  preparerDecorDeterministe,
  quitterDecor,
} from "../../../test/halloweenDecorTestKit";

const echecs = vi.hoisted(() => ({ canopee: 0, decor: 0 }));

function canopeeIntrouvable(): never {
  echecs.canopee += 1;
  throw new Error("chunk de la canopee introuvable");
}

function decorIntrouvable(): never {
  echecs.decor += 1;
  throw new Error("chunk du decor introuvable");
}

vi.mock("../../CanopyBackground", async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return Object.defineProperty({ ...original }, "CanopyBackground", {
    enumerable: true,
    get: canopeeIntrouvable,
  });
});
vi.mock("../../HalloweenDecor/HalloweenSeasonBackdrop", () => decorIntrouvable());
vi.mock("../../HalloweenDecor/HalloweenSeasonOverlay", () => decorIntrouvable());

const IN_SEASON_DAY = new Date(2026, 9, 20, 12);
const items: CanopNavbarItem[] = [{ label: "Dashboard", href: "/dashboard", icon: "apps" }];

let fondAttendu = "";

function ThemeBackgroundProbe() {
  const theme = useTheme();
  fondAttendu = theme.vars?.palette.background.default ?? theme.palette.background.default;
  return null;
}

function renderScaffold(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider defaultMode="light">
        <ThemeBackgroundProbe />
        {ui}
      </CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function calqueDuFond(): HTMLElement {
  const calque = document.querySelector<HTMLElement>("main [aria-hidden='true']");
  if (!calque) throw new Error("calque du fond introuvable");
  return calque;
}

async function laisserEchouerLesChargements() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
  });
}

function decorLayers(): HTMLElement[] {
  return Array.from(
    document.body.querySelectorAll<HTMLElement>('[aria-hidden="true"][data-paused]'),
  );
}

beforeEach(() => {
  preparerDecorDeterministe();
  mockMatchMedia(false);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  quitterDecor();
  vi.restoreAllMocks();
});

describe("AC2 — echec du chargement a la demande", () => {
  it("garde l'aplat background.default et le contenu quand la canopee ne se charge pas", async () => {
    vi.setSystemTime(IN_SEASON_DAY);

    renderScaffold(
      <PageScaffold items={items}>
        <p>Contenu</p>
      </PageScaffold>,
    );
    await laisserEchouerLesChargements();

    expect(echecs.canopee).toBeGreaterThan(0);
    expect(screen.getByText("Contenu")).toBeInTheDocument();
    const aplat = calqueDuFond().firstElementChild;
    expect(aplat).not.toBeNull();
    expect(getComputedStyle(aplat as Element).backgroundColor).toBe(fondAttendu);
    expect(calqueDuFond().querySelector("video")).toBeNull();
  });

  it("continue sans decor quand le decor saisonnier ne se charge pas", async () => {
    vi.setSystemTime(IN_SEASON_DAY);

    renderScaffold(<p>Connexion</p>);
    await laisserEchouerLesChargements();

    expect(echecs.decor).toBeGreaterThan(0);
    expect(screen.getByText("Connexion")).toBeInTheDocument();
    expect(decorLayers()).toHaveLength(0);
  });
});
