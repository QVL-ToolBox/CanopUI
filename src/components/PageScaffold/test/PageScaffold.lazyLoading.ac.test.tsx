import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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

const chargements = vi.hoisted(() => ({ fondSaisonnier: 0, overlaySaisonnier: 0 }));

vi.mock("../../HalloweenDecor/HalloweenSeasonBackdrop", async (importOriginal) => {
  chargements.fondSaisonnier += 1;
  return importOriginal();
});

vi.mock("../../HalloweenDecor/HalloweenSeasonOverlay", async (importOriginal) => {
  chargements.overlaySaisonnier += 1;
  return importOriginal();
});

const IN_SEASON_DAY = new Date(2026, 9, 20, 12);
const OFF_SEASON_DAY = new Date(2026, 5, 10, 12);
const items: CanopNavbarItem[] = [{ label: "Dashboard", href: "/dashboard", icon: "apps" }];

let fondAttendu = "";

function ThemeBackgroundProbe() {
  const theme = useTheme();
  fondAttendu = theme.vars?.palette.background.default ?? theme.palette.background.default;
  return null;
}

function renderScaffold(ui: ReactNode, season?: "halloween" | null) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider defaultMode="light" season={season}>
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

function fondAffiche(): string {
  const premierPlan = calqueDuFond().firstElementChild;
  if (!premierPlan) throw new Error("aucun fond dans le calque");
  return getComputedStyle(premierPlan).backgroundColor;
}

beforeEach(() => {
  preparerDecorDeterministe();
  mockMatchMedia(false);
});

afterEach(() => {
  quitterDecor();
});

describe("AC2 — fond de PageScaffold charge a la demande", () => {
  it.each([
    ["canopy", undefined],
    ["shapes", "shapes"],
  ] as const)(
    "affiche un aplat background.default pendant le chargement du fond %s",
    (_label, background) => {
      vi.setSystemTime(OFF_SEASON_DAY);

      renderScaffold(
        <PageScaffold items={items} background={background}>
          <p>Contenu</p>
        </PageScaffold>,
      );

      expect(fondAttendu).not.toBe("");
      expect(fondAffiche()).toBe(fondAttendu);
      expect(calqueDuFond().querySelector("video, canvas")).toBeNull();
      expect(screen.getByText("Contenu")).toBeInTheDocument();
    },
  );

  it("remplace l'aplat par la canopee une fois chargee", async () => {
    vi.setSystemTime(OFF_SEASON_DAY);

    renderScaffold(
      <PageScaffold items={items}>
        <p>Contenu</p>
      </PageScaffold>,
    );

    await waitFor(() => expect(calqueDuFond().querySelector("video")).not.toBeNull());
  });

  it("remplace l'aplat par les formes une fois chargees", async () => {
    vi.setSystemTime(OFF_SEASON_DAY);

    renderScaffold(
      <PageScaffold items={items} background="shapes">
        <p>Contenu</p>
      </PageScaffold>,
    );

    await waitFor(() => expect(calqueDuFond().querySelector("canvas")).not.toBeNull());
    expect(calqueDuFond().querySelector("video")).toBeNull();
  });
});

describe("AC2 — decor saisonnier charge uniquement en saison", () => {
  it("ne charge ni le fond ni l'overlay saisonnier hors saison", async () => {
    vi.setSystemTime(OFF_SEASON_DAY);

    renderScaffold(
      <PageScaffold items={items}>
        <p>Contenu</p>
      </PageScaffold>,
    );
    await waitFor(() => expect(calqueDuFond().querySelector("video")).not.toBeNull());

    expect(chargements.fondSaisonnier).toBe(0);
    expect(chargements.overlaySaisonnier).toBe(0);
  });

  it("ne charge pas le decor saisonnier quand la saison est coupee en pleine saison", async () => {
    vi.setSystemTime(IN_SEASON_DAY);

    renderScaffold(
      <PageScaffold items={items}>
        <p>Contenu</p>
      </PageScaffold>,
      null,
    );
    await waitFor(() => expect(calqueDuFond().querySelector("video")).not.toBeNull());

    expect(chargements.fondSaisonnier).toBe(0);
    expect(chargements.overlaySaisonnier).toBe(0);
  });

  it("charge le fond et l'overlay saisonniers quand la saison est active", async () => {
    vi.setSystemTime(IN_SEASON_DAY);

    renderScaffold(
      <PageScaffold items={items}>
        <p>Contenu</p>
      </PageScaffold>,
    );

    await waitFor(() => {
      expect(chargements.fondSaisonnier).toBe(1);
      expect(chargements.overlaySaisonnier).toBe(1);
    });
  });
});
